import chess

from ..models import ChessGame

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
