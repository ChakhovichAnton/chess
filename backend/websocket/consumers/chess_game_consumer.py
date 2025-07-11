import json
from django.db import transaction
from django.contrib.auth.models import User
from django.utils import timezone
from channels.db import database_sync_to_async
from channels.generic.websocket import AsyncWebsocketConsumer

from chess_game.models import ChessGame, ChessMove, DrawOffers, ChessClock
from chess_game.serializers import ChessClockSerializer, ChessGameSerializerWithMoves, ChessMoveSerializer
from chess_game.utils.chess_utils import game_should_end_due_to_time, validate_chess_move, get_chess_game_status_from_board
from chess_game.utils.time import minutes_to_ms, seconds_to_ms, timedelta_to_ms
from account.serializers import UserSerializer

class ChessGameConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.game_group_name = None
        self.game_id = self.scope['url_route']['kwargs']['game_id']
        self.user = self.scope["user"]
        
        game_state = await get_serialized_game_state(self.game_id)
        if game_state is None:
            return
        
        await self.accept()

        # Join the game-specific group and send the current game state to the user
        self.game_group_name = f"game_{self.game_id}"
        await self.channel_layer.group_add(self.game_group_name, self.channel_name)
        await self.send(text_data=json.dumps(game_state))

        # Checking if the game has ended due to time
        clock_res = await game_has_ended_due_to_time(self.game_id)
        if clock_res is not None:
            await self.channel_layer.group_send(self.game_group_name, {
                'type': 'new_message',
                'message': json.dumps(clock_res),
            })

    async def disconnect(self, close_code):
        """Leave the current group"""
        if self.game_group_name is not None:
            await self.channel_layer.group_discard(self.game_group_name, self.channel_name)

    async def receive(self, text_data):
        if not self.user.is_authenticated:
            await self.close()
            return

        data = json.loads(text_data)
        action = data.get('action')

        if action == 'move':
            move = data.get('move')
            res = await make_move(self.game_id, self.user.id, move)
        elif action == 'draw':
            res = await draw(self.game_id, self.user.id)
        elif action == 'surrender':
            res = await surrender(self.game_id, self.user.id)
        elif action == 'clockCheck':
            res = await game_has_ended_due_to_time(self.game_id)
        else:
            return # Do nothing if the action is invalid

        if res is None:
            return
        elif res['action'] == 'error':
            await self.send(text_data=json.dumps(res))
        elif res['action'] in ['drawOffer', 'drawAccepted', 'drawOfferDeactivated', 'newMove', 'surrender', 'noTime']:
            # Send data to other users
            await self.channel_layer.group_send(self.game_group_name, {
                'type': 'new_message',
                'message': json.dumps(res),
            })

    async def new_message(self, event):
        await self.send(text_data=event['message'])

@database_sync_to_async
def surrender(game_id, user_id):
    try:
        game = ChessGame.objects.select_related('clock').get(id=game_id, status=ChessGame.GameStatus.ONGOING)
    except ChessGame.DoesNotExist:
        return {'action': 'error', 'error': 'Invalid game'}
    
    if game.user_white.id == user_id: # user_id is white
        status = ChessGame.GameStatus.BLACK_WIN
    elif game.user_black.id == user_id: # user_id is black
        status = ChessGame.GameStatus.WHITE_WIN
    else:
        return {'action': 'error', 'error': 'You cannot surrender'}
    
    game.clock.running = ChessClock.RunningStatus.PAUSED
    game.clock.save()
    game.status = status
    game.save()
    return {'action': 'surrender', 'gameStatus': status}

@database_sync_to_async
def draw(game_id, user_id):
    with transaction.atomic():
        try:
            game = ChessGame.objects.get(id=game_id, status=ChessGame.GameStatus.ONGOING)
        except ChessGame.DoesNotExist:
            return {'action': 'error', 'error': 'Invalid game'}
        
        if game.user_white.id == user_id: # user_id is white
            other_user = game.user_black
        elif game.user_black.id == user_id: # user_id is black
            other_user = game.user_white
        else:
            return {'action': 'error', 'error': 'You cannot make draw requests'}
        
        try:
            drawOffer = DrawOffers.objects.get(game=game, is_active=True, accepted=False)
            if drawOffer.user is None:
                return {'action': 'error', 'error': 'The user who made the draw request does not exist anymore'}
        except DrawOffers.DoesNotExist: # No active draw offer
            try:
                user = User.objects.get(id=user_id)
                serializer = UserSerializer(user)
                DrawOffers.objects.create(game=game, user_id=user_id)

                return {'action': 'drawOffer', 'by': serializer.data}
            except User.DoesNotExist:
                return {'action': 'error', 'error': 'User does not exist'}

        if other_user is not None and drawOffer.user.id == other_user.id:
            DrawOffers.objects.filter(id=drawOffer.id).update(accepted=True)

            game.clock.running = ChessClock.RunningStatus.PAUSED
            game.clock.save()
            game.status = ChessGame.GameStatus.DRAW
            game.save()
            return {'action': 'drawAccepted'}
        else:
            DrawOffers.objects.filter(id=drawOffer.id).update(is_active=False)
            return {'action': 'drawOfferDeactivated'}
        
@database_sync_to_async
def game_has_ended_due_to_time(game_id):
    with transaction.atomic():
        try:
            game = ChessGame.objects.select_related('clock').get(id=game_id, status=ChessGame.GameStatus.ONGOING)
        except ChessGame.DoesNotExist:
            return
        
        status = game_should_end_due_to_time(game.clock)
        if status is None:
            return
        elif status == ChessGame.GameStatus.WHITE_WIN:
            game.clock.black_time_ms = 0
        else:
            game.clock.white_time_ms = 0
        
        game.clock.running = ChessClock.RunningStatus.PAUSED
        game.clock.save()
        game.status = status
        game.save()
        return { 'action': 'noTime', 'gameStatus': status }

@database_sync_to_async
def get_serialized_game_state(game_id):
    game = ChessGame.objects.get_game_status_with_users_and_moves(game_id)
    if game is None:
        return None
    serializer = ChessGameSerializerWithMoves(game)
    return { 'action': 'gameState', 'gameState': serializer.data }

@database_sync_to_async
def make_move(game_id, user_id, move):
    with transaction.atomic():
        try:
            game = ChessGame.objects.select_related('clock').get(id=game_id, status=ChessGame.GameStatus.ONGOING)
            previous_moves = ChessMove.objects.filter(game=game).order_by('created_at')
        except:
            return {'action': 'error', 'error': 'Invalid game'}
        
        board = validate_chess_move(game, previous_moves, move, user_id)
        if board is None:
            return {'action': 'error', 'error': 'Invalid move'}

        # Calculate the time elapsed since the last move
        clock = game.clock
        now = timezone.now()
        status = ChessGame.GameStatus.ONGOING

        if clock.running == ChessClock.RunningStatus.PAUSED: # The clock is paused on the first move
            clock.running = ChessClock.RunningStatus.BLACK
            clock.last_started_at = now
            user_time_left_ms = minutes_to_ms(clock.time_control.minutes)
        else:
            elapsed_time_ms = timedelta_to_ms(now - clock.last_started_at)

            # Update clock data
            if clock.running == ChessClock.RunningStatus.WHITE:
                white_time_left_ms = clock.white_time_ms - elapsed_time_ms
                if white_time_left_ms > 0:
                    clock.white_time_ms = white_time_left_ms + seconds_to_ms(clock.time_control.increment_seconds)
                    user_time_left_ms = clock.white_time_ms
                    clock.running = ChessClock.RunningStatus.BLACK
                    clock.last_started_at = now
                else:
                    clock.running = ChessClock.RunningStatus.PAUSED
                    clock.white_time_ms = 0
                    status = ChessGame.GameStatus.BLACK_WIN
            else: # Black clock is running
                black_time_left_ms = clock.black_time_ms - elapsed_time_ms
                if black_time_left_ms > 0:
                    clock.black_time_ms = black_time_left_ms + seconds_to_ms(clock.time_control.increment_seconds)
                    user_time_left_ms = clock.black_time_ms
                    clock.running = ChessClock.RunningStatus.WHITE
                    clock.last_started_at = now
                else:
                    clock.running = ChessClock.RunningStatus.PAUSED
                    clock.black_time_ms = 0
                    status = ChessGame.GameStatus.WHITE_WIN
        clock.save()

        # Game has ended due to time
        if status != ChessGame.GameStatus.ONGOING:
            game.status = status
            game.save()
            return { 'action': 'noTime', 'gameStatus': status }

        # Determine game status
        status = get_chess_game_status_from_board(board)
        new_fen = board.fen()

        # Update database
        new_move = ChessMove(
            game_id=game.id,
            user_id=user_id,
            move_text=move,
            user_time_left_ms=user_time_left_ms,
        )
        new_move.save()

        game.fen = new_fen
        game.status = status
        game.save()

        return {
            'action': 'newMove',
            'newMove': ChessMoveSerializer(new_move).data,
            'fen': new_fen,
            'gameStatus': status,
            'clock': ChessClockSerializer(clock).data
        }
