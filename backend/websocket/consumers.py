import json
import chess
from django.db import connection, transaction
from channels.db import database_sync_to_async
from channels.layers import get_channel_layer
from channels.generic.websocket import AsyncWebsocketConsumer

from chess_game.models import WaitingUserForGame, ChessGame, ChessMove
from chess_game.serializers import ChessGameSerializerWithMoves, ChessMoveSerializer

class MatchConsumer(AsyncWebsocketConsumer):
    """Matches two users and creates a game of chess between the users"""

    async def connect(self):
        user = self.scope["user"]

        if user.is_authenticated:
            await self.accept()
            result = await self.delete_and_return_waiting_user(user.id)

            if result is None:
                await self.create_waiting_user(user.id)
            else:
                game = await self.create_chess_game(result["user_id"], user.id)

                # Send game id to both users
                channel_layer = get_channel_layer()
                await channel_layer.send(result["channel_name"], {
                    "type": "chat.message",
                    "message": json.dumps({"gameId": game.id}),
                })
                await self.send(text_data=json.dumps({"gameId": game.id}))
        else:
            await self.close()

    async def disconnect(self, close_code):
        """Removes the user from the database when they disconnect"""
        user_id = self.scope["user"].id
        await self.delete_waiting_user(user_id)

    async def chat_message(self, event):
        """
        Called when the channel layer of this user receives a message.
        Sends the same message to the client
        """
        await self.send(text_data=event["message"])
        
    @database_sync_to_async
    def delete_and_return_waiting_user(self, user_id):
        db_table_name = WaitingUserForGame._meta.db_table
        with connection.cursor() as cursor:
            cursor.execute(f"""
                DELETE FROM {db_table_name}
                WHERE id = (SELECT id FROM {db_table_name} WHERE NOT user_id = %s ORDER BY created_at LIMIT 1)
                RETURNING *;
            """, [user_id])

            result = cursor.fetchone()
            if result is None:
                return None

            # Convert result into a dictonary
            columns = (col[0] for col in cursor.description)
            result = dict(zip(columns, result))
        return result

    @database_sync_to_async
    def create_waiting_user(self, user_id):
        WaitingUserForGame.objects.create(user_id=user_id, channel_name=self.channel_name)

    @database_sync_to_async
    def delete_waiting_user(self, user_id):
        WaitingUserForGame.objects.filter(user_id=user_id).delete()

    @database_sync_to_async
    def create_chess_game(self, user_white_id, user_black_id):
        game = ChessGame.objects.create(user_white_id=user_white_id, user_black_id=user_black_id)
        return game

class ChessGameConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.game_group_name = None
        self.game_id = self.scope['url_route']['kwargs']['game_id']
        self.user = self.scope["user"]
        
        game_state = await self.get_serialized_game_state()
        if game_state is None:
            return
        
        await self.accept()

        # Join the game-specific group and send the current game state to the user
        self.game_group_name = f"game_{self.game_id}"
        await self.channel_layer.group_add(self.game_group_name, self.channel_name)
        await self.send(text_data=json.dumps({"action": "gameState", "gameState": game_state}))

    async def disconnect(self, close_code):
        """Leave the current group"""
        if self.game_group_name is not None:
            await self.channel_layer.group_discard(self.game_group_name, self.channel_name)

    async def receive(self, text_data):
        if not self.user.is_authenticated:
            return

        data = json.loads(text_data)
        action = data.get('action')

        if action == 'move':
            move = data.get('move')
            res = await self.make_move(move)

            if res['action'] == 'error':
                await self.send(text_data=json.dumps(res))
            elif res['action'] == 'newMove':
                # Send move to other users
                await self.channel_layer.group_send(self.game_group_name, {
                    'type': 'new_move',
                    'message': json.dumps(res),
                })

    async def new_move(self, event):
        await self.send(text_data=event["message"])

    @database_sync_to_async
    def get_serialized_game_state(self):
        game = ChessGame.objects.get_game_status_with_users_and_moves(self.game_id)
        if game is None:
            return None
        serializer = ChessGameSerializerWithMoves(game)
        return serializer.data
    
    @database_sync_to_async
    def make_move(self, move):
        with transaction.atomic():
            try:
                game = ChessGame.objects.get(id=self.game_id, status=ChessGame.GameStatus.ONGOING)
            except ChessGame.DoesNotExist:
                return {'action': 'error', 'error': 'Invalid game'}
            
            try: # Validate move
                board = chess.Board(game.fen) # TODO: take previous moves into account as they game can for example end due to repetition
                isWhiteTurn = board.turn == chess.WHITE

                if isWhiteTurn and self.user.id == game.user_white.id:
                    board.push_san(move)
                elif self.user.id == game.user_black.id and not isWhiteTurn:
                    board.push_san(move)
                else:
                    return {'action': 'error', 'error': 'Invalid move'}
            except:
                return {'action': 'error', 'error': 'Invalid move'}

            # Determine game status
            outcome = board.outcome()
            status = None
            if outcome is not None:
                if outcome.winner is None:
                    status = ChessGame.GameStatus.DRAW
                elif outcome.winner == chess.WHITE:
                    status = ChessGame.GameStatus.WHITE_WIN
                elif outcome.winner == chess.BLACK:
                    status = ChessGame.GameStatus.BLACK_WIN

            # Update database
            new_fen = board.fen()
            new_move = ChessMove(game_id=game.id, user_id=self.user.id, move_text=move)
            new_move.save()

            game.fen = new_fen
            if status is not None:
                game.status = status
            game.save()

            # TODO: send game state every x moves: await self.send_game_state(game)

            serializer = ChessMoveSerializer(new_move)
            return {
                'action': 'newMove',
                'newMove': serializer.data,
                'gameStatus': None if status is None else status,
            }
