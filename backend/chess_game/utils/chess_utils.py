import chess
from django.utils import timezone

from ..models import ChessGame, ChessClock
from .time import timedelta_to_ms

def validate_chess_move(game, previous_moves, move, user_id):
    board = chess.Board()

    try:
        # Taking previous moves into account as the game can for example end due to repetition
        for previous_move in previous_moves:
            board.push_san(previous_move.move_text)

        isWhiteTurn = board.turn == chess.WHITE
        user_is_white = user_id == game.user_white.id
        user_is_black = user_id == game.user_black.id

        if (isWhiteTurn and user_is_white) or (user_is_black and not isWhiteTurn):
            board.push_san(move)
            return board
        else:
            return None
    except:
        return None

def get_chess_game_status_from_board(board):
    outcome = board.outcome()
    status = ChessGame.GameStatus.ONGOING # Default to ongoing game
    if outcome is not None:
        if outcome.winner is None:
            status = ChessGame.GameStatus.DRAW
        elif outcome.winner == chess.WHITE:
            status = ChessGame.GameStatus.WHITE_WIN
        elif outcome.winner == chess.BLACK:
            status = ChessGame.GameStatus.BLACK_WIN
    return status

def game_should_end_due_to_time(clock: ChessClock):
    if clock.running == ChessClock.RunningStatus.PAUSED:
        return

    now = timezone.now()
    elapsed_time_ms = timedelta_to_ms(now - clock.last_started_at)
    white_time_left_ms = clock.white_time_ms - elapsed_time_ms
    black_time_left_ms = clock.black_time_ms - elapsed_time_ms

    if clock.running == ChessClock.RunningStatus.WHITE and white_time_left_ms <= 0:
        return ChessGame.GameStatus.BLACK_WIN
    elif clock.running == ChessClock.RunningStatus.BLACK and black_time_left_ms <= 0:
        return ChessGame.GameStatus.WHITE_WIN
