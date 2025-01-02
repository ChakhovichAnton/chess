from urllib.parse import parse_qs
from channels.middleware import BaseMiddleware
from channels.db import database_sync_to_async
from django.contrib.auth import get_user_model
from django.contrib.auth.models import AnonymousUser
from rest_framework_simplejwt.exceptions import InvalidToken, TokenError
from rest_framework_simplejwt.tokens import UntypedToken

User = get_user_model()

class JWTAuthMiddleware(BaseMiddleware):
    """Middleware to authenticate user for channels"""

    async def __call__(self, scope, receive, send):
        """Authenticate the user based on jwt"""
        try:
            # Get token parameter from query string
            token = parse_qs(scope["query_string"].decode("utf8")).get('token', None)

            if token is None:
                scope['user'] = AnonymousUser()
            else:
                validated_token = UntypedToken(token[0])
                scope['user'] = await self.get_user(validated_token['user_id'])
        except (InvalidToken, TokenError):
            scope['user'] = AnonymousUser()
        return await super().__call__(scope, receive, send)

    @database_sync_to_async
    def get_user(self, user_id):
        try:
            return User.objects.get(id=user_id)
        except User.DoesNotExist:
            return AnonymousUser()
