from rest_framework.serializers import ModelSerializer
from chess.models import ChessGame, ChessMove

class ChessMoveSerializer(ModelSerializer):
    class Meta:
        model = ChessMove
        fields = '__all__'

class ChessGameSerializer(ModelSerializer):
    chess_moves = ChessMoveSerializer(many=True, read_only=True)

    class Meta:
        model = ChessGame
        fields = '__all__'
