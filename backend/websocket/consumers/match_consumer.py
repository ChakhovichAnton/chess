import json
from django.db import connection
from channels.db import database_sync_to_async
from channels.layers import get_channel_layer
from channels.generic.websocket import AsyncWebsocketConsumer

from chess_game.models import ChessGameTimeControl, WaitingUserForGame, ChessGame, ChessClock
from chess_game.utils.time import minutes_to_ms

class MatchConsumer(AsyncWebsocketConsumer):
    """Matches two users and creates a game of chess between the users"""

    async def connect(self):
        user = self.scope["user"]

        if user.is_authenticated:
            await self.accept()

    async def receive(self, text_data):
        user = self.scope["user"]
        if not user.is_authenticated:
            return

        data = json.loads(text_data)
        action = data.get('action')

        if action == 'timeControlId':
            time_control_id = data.get('timeControlId')
            if not isinstance(time_control_id, int):
                return
            
            time_control = await get_time_control(time_control_id)
            if time_control is None:
                return

            result = await delete_and_return_waiting_user(user.id, time_control_id)
            if result is None:
                await create_waiting_user(user.id, time_control_id, self.channel_name)
            else:
                game = await create_chess_game(result['user_id'], user.id, time_control)

                # Send game id to both users
                channel_layer = get_channel_layer()
                await channel_layer.send(result['channel_name'], {
                    'type': 'chat.message',
                    'message': json.dumps({'action': 'gameId', 'gameId': game.id}),
                })
                await self.send(text_data=json.dumps({'action': 'gameId', 'gameId': game.id}))
        elif action == 'disconnect':
            await delete_waiting_user(user.id)
            await self.send(text_data=json.dumps({'action': 'disconnect'}))

    async def disconnect(self, close_code):
        """Removes the user from the database when they disconnect in-case they have not disconnected themselves"""
        user_id = self.scope['user'].id
        await delete_waiting_user(user_id)

    async def chat_message(self, event):
        """
        Called when the channel layer of this user receives a message.
        Sends the same message to the client
        """
        await self.send(text_data=event['message'])
        
@database_sync_to_async
def delete_and_return_waiting_user(user_id, time_control_id):
    db_table_name = WaitingUserForGame._meta.db_table
    with connection.cursor() as cursor:
        cursor.execute(f"""
            DELETE FROM {db_table_name}
            WHERE id = (
                SELECT id FROM {db_table_name}
                WHERE time_control_id = %s AND NOT user_id = %s
                ORDER BY created_at
                LIMIT 1
            )
            RETURNING *;
        """, [time_control_id, user_id])

        result = cursor.fetchone()
        if result is not None:
            # Convert result into a dictonary
            columns = (col[0] for col in cursor.description)
            return dict(zip(columns, result))
        
@database_sync_to_async
def get_time_control(id):
    try:
        return ChessGameTimeControl.objects.get(id=id)
    except ChessGameTimeControl.DoesNotExist:
        return

@database_sync_to_async
def create_waiting_user(user_id, time_control_id, channel_name):
    WaitingUserForGame.objects.create(user_id=user_id, channel_name=channel_name, time_control_id=time_control_id)

@database_sync_to_async
def delete_waiting_user(user_id):
    WaitingUserForGame.objects.filter(user_id=user_id).delete()

@database_sync_to_async
def create_chess_game(user_white_id, user_black_id, time_control):
    game = ChessGame.objects.create(user_white_id=user_white_id, user_black_id=user_black_id)

    time = minutes_to_ms(time_control.minutes)
    ChessClock.objects.create(game=game, white_time_ms=time, black_time_ms=time, time_control=time_control)
    return game
