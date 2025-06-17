from django.urls import path

from .views import GameView, UserGameView, ChessGameTimeControlView

urlpatterns = [
    path("game/<int:id>/", GameView.as_view(), name="game_view"),
    path("games/user/<int:id>/", UserGameView.as_view(), name="user_game_view"),
    path("time-control/", ChessGameTimeControlView.as_view(), name="time_control"),
]
