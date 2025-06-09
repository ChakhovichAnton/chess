from django.urls import path

from .consumers import match_consumer, chess_game_consumer

websocket_urlpatterns = [
    path('ws/match/', match_consumer.MatchConsumer.as_asgi()),
    path('ws/game/<game_id>/', chess_game_consumer.ChessGameConsumer.as_asgi()),
]