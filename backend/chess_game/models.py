from django.db import models
from django.contrib.auth.models import User
import chess

from .managers import ChessGameManager

class ChessGameTimeControl(models.Model):
    class Category(models.TextChoices):
        BULLET = 'bullet', 'Bullet'
        BLITZ = 'blitz', 'Blitz'
        RAPID = 'rapid', 'Rapid'

    name = models.CharField(max_length=50, unique=True)
    minutes = models.PositiveIntegerField()
    increment_seconds = models.PositiveIntegerField()
    category = models.CharField(max_length=6, choices=Category.choices)

class WaitingUserForGame(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    channel_name = models.CharField(max_length=255, unique=True)
    created_at = models.DateTimeField(auto_now_add=True)

class ChessGame(models.Model):
    objects = ChessGameManager()

    class GameStatus(models.TextChoices):
        ONGOING = 'O', 'Ongoing'
        WHITE_WIN = 'W', 'WhiteWin'
        BLACK_WIN = 'B', 'BlackWin'
        DRAW = 'D', 'Draw'

    user_white = models.ForeignKey(User, null=True, on_delete=models.SET_NULL, related_name='user_white_id')
    user_black = models.ForeignKey(User, null=True, on_delete=models.SET_NULL, related_name='user_black_id')
    created_at = models.DateTimeField(auto_now_add=True)
    status = models.CharField(max_length=1, choices=GameStatus, default=GameStatus.ONGOING)
    fen = models.CharField(max_length=90, default=chess.STARTING_FEN) # The game as a FEN (Forsyth-Edwards Notation) string

class ChessMove(models.Model):
    game = models.ForeignKey(ChessGame, on_delete=models.CASCADE, related_name='chess_moves')
    move_text = models.CharField(max_length=10) # Chess move in algebraic notation; for example, 'e4' and 'Nf3'
    user = models.ForeignKey(User, null=True, on_delete=models.SET_NULL)
    user_time_left_ms = models.BigIntegerField(default=0) # How much time the user had left at the time of the move
    created_at = models.DateTimeField(auto_now_add=True)

class ChessClock(models.Model):
    class RunningStatus(models.TextChoices):
        WHITE = 'W', 'White'
        BLACK = 'B', 'Black'
        PAUSED = 'P', 'Paused'

    game = models.OneToOneField(ChessGame, on_delete=models.CASCADE, related_name='clock')
    running = models.CharField(max_length=1, choices=RunningStatus, default=RunningStatus.PAUSED)
    last_started_at = models.DateTimeField(null=True, blank=True) # For computing how long the clock has been running
    time_control = models.ForeignKey(ChessGameTimeControl, on_delete=models.PROTECT, related_name='time_control')

    # How much time left each player currently has
    white_time_ms = models.BigIntegerField(default=0)
    black_time_ms = models.BigIntegerField(default=0)

class DrawOffers(models.Model):
    game = models.ForeignKey(ChessGame, on_delete=models.CASCADE)
    user = models.ForeignKey(User, null=True, on_delete=models.SET_NULL) # Player who offered the draw
    is_active = models.BooleanField(default=True) # Player has not cancelled the offer
    accepted = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
