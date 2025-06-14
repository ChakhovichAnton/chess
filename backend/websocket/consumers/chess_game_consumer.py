import json
from django.db import transaction
from django.contrib.auth.models import User
from channels.db import database_sync_to_async
from channels.generic.websocket import AsyncWebsocketConsumer

from chess_game.models import ChessGame, ChessMove, DrawOffers
from chess_game.serializers import ChessGameSerializerWithMoves, ChessMoveSerializer
from chess_game.utils.chess_utils import validate_chess_move, get_chess_game_status_from_board
from account.serializers import UserSerializer

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
        elif action == 'draw':
            res = await self.draw()
        elif action == 'surrender':
            res = await self.surrender()
        else:
            return # Do nothing if the action is invalid

        if res['action'] == 'error':
            await self.send(text_data=json.dumps(res))
        elif res['action'] in ['drawOffer', 'drawAccepted', 'drawOfferDeactivated', 'newMove', 'surrender']:
            # Send data to other users
            await self.channel_layer.group_send(self.game_group_name, {
                'type': 'new_message',
                'message': json.dumps(res),
            })

    async def new_message(self, event):
        await self.send(text_data=event['message'])

    @database_sync_to_async
    def surrender(self):
        try:
            game = ChessGame.objects.get(id=self.game_id, status=ChessGame.GameStatus.ONGOING)
        except ChessGame.DoesNotExist:
            return {'action': 'error', 'error': 'Invalid game'}
        
        if game.user_white.id == self.user.id: # self.user is white
            status = ChessGame.GameStatus.BLACK_WIN
        elif game.user_black.id == self.user.id: # self.user is black
            status = ChessGame.GameStatus.WHITE_WIN
        else:
            return {'action': 'error', 'error': 'You cannot surrender'}
        
        game.status = status
        game.save()
        return {'action': 'surrender', 'gameStatus': status}

    @database_sync_to_async
    def draw(self):
        with transaction.atomic():
            try:
                game = ChessGame.objects.get(id=self.game_id, status=ChessGame.GameStatus.ONGOING)
            except ChessGame.DoesNotExist:
                return {'action': 'error', 'error': 'Invalid game'}
            
            if game.user_white.id == self.user.id: # self.user is white
                other_user = game.user_black
            elif game.user_black.id == self.user.id: # self.user is black
                other_user = game.user_white
            else:
                return {'action': 'error', 'error': 'You cannot make draw requests'}
            
            try:
                drawOffer = DrawOffers.objects.get(game=game, is_active=True, accepted=False)
                if drawOffer.user is None:
                    return {'action': 'error', 'error': 'The user who made the draw request does not exist anymore'}
            except DrawOffers.DoesNotExist: # No active draw offer
                try:
                    user = User.objects.get(id=self.user.id)
                    serializer = UserSerializer(user)
                    DrawOffers.objects.create(game=game, user_id=self.user.id)

                    return {'action': 'drawOffer', 'by': serializer.data}
                except User.DoesNotExist:
                    return {'action': 'error', 'error': 'User does not exist'}

            if other_user is not None and drawOffer.user.id == other_user.id:
                DrawOffers.objects.filter(id=drawOffer.id).update(accepted=True)
                game.status = ChessGame.GameStatus.DRAW
                game.save()
                return {'action': 'drawAccepted'}
            else:
                DrawOffers.objects.filter(id=drawOffer.id).update(is_active=False)
                return {'action': 'drawOfferDeactivated'}

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
                previous_moves = ChessMove.objects.filter(game=game).order_by('created_at')
            except:
                return {'action': 'error', 'error': 'Invalid game'}
            
            board = validate_chess_move(game, previous_moves, move, self.user.id)
            if board is None:
                return {'action': 'error', 'error': 'Invalid move'}

            # Determine game status
            status = get_chess_game_status_from_board(board)
            new_fen = board.fen()

            # Update database
            new_move = ChessMove(game_id=game.id, user_id=self.user.id, move_text=move)
            new_move.save()

            game.fen = new_fen
            game.status = status
            game.save()

            serializer = ChessMoveSerializer(new_move)
            return {
                'action': 'newMove',
                'newMove': serializer.data,
                'fen': new_fen,
                'gameStatus': ChessGame.GameStatus.ONGOING if status is None else status,
            }
