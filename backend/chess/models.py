from django.db import models
from django.contrib.auth.models import User

class WaitingUserForGame(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    channel_name = models.CharField(max_length=255, unique=True)
    created_at = models.DateTimeField(auto_now_add=True)

class ChessGame(models.Model):
    class GameStatus(models.TextChoices):
        ONGOING = 'O', 'Ongoing'
        WHITE_WIN = 'W', 'WhiteWin'
        BLACK_WIN = 'B', 'BlackWin'
        DRAW = 'D', 'Draw'

    user_white = models.ForeignKey(User, null=True, on_delete=models.SET_NULL, related_name='user_white_id')
    user_black = models.ForeignKey(User, null=True, on_delete=models.SET_NULL, related_name='user_black_id')
    created_at = models.DateTimeField(auto_now_add=True)
    status = models.CharField(max_length=1, choices=GameStatus, default=GameStatus.ONGOING)
    fen = models.CharField(max_length=90) # The game as a FEN (Forsyth-Edwards Notation) string

class ChessMove(models.Model):
    game = models.ForeignKey(ChessGame, on_delete=models.CASCADE, related_name='chess_moves')
    move_text = models.CharField(max_length=10) # Chess move in algebraic notation; for example, 'e4' and 'Nf3'
    user = models.ForeignKey(User, null=True, on_delete=models.SET_NULL)
    created_at = models.DateTimeField(auto_now_add=True)

# TODO: add clocks
"""
class DrawOffers(models.Model):
    game_id = models.ForeignKey(ChessGame, on_delete=models.CASCADE)
    user = models.ForeignKey(User, null=True, on_delete=models.SET_NULL) # Player who offered the draw
    is_active = models.BooleanField(default=True) # Player has not cancelled the offer
    accepted = models.BooleanField(default=False)
"""
