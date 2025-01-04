from django.urls import path

from . import consumers

websocket_urlpatterns = [
    path('ws/match/', consumers.MatchConsumer.as_asgi()),
    path('ws/game/<game_id>/', consumers.ChessGameConsumer.as_asgi()),
]