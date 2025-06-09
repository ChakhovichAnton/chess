import chess

from ..models import ChessGame

def validate_chess_move(game, move, user_id):
    try:
        board = chess.Board(game.fen) # TODO: take previous moves into account as the game can for example end due to repetition
        isWhiteTurn = board.turn == chess.WHITE

        if isWhiteTurn and user_id == game.user_white.id:
            board.push_san(move)
            return board
        elif user_id == game.user_black.id and not isWhiteTurn:
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
