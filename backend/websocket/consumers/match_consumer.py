import json
from django.db import connection
from channels.db import database_sync_to_async
from channels.layers import get_channel_layer
from channels.generic.websocket import AsyncWebsocketConsumer

from chess_game.models import WaitingUserForGame, ChessGame

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
