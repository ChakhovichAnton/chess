from django.http import JsonResponse, Http404
from django.views import View
from django.db.models import Q, Count

from .models import ChessGame
from .serializers import ChessGameSerializerWithMoves, ChessGameSerializer

class GameView(View):
    def get(self, request, id):
        game = ChessGame.objects.get_game_status_with_users_and_moves(id)

        if game is None:
            raise Http404
        serializer = ChessGameSerializerWithMoves(game)
        return JsonResponse(serializer.data, safe=False)

class UserGameView(View):
    def get(self, request, id):
        games = (
            ChessGame.objects
            .filter(Q(user_white_id=id) | Q(user_black_id=id))
            .annotate(move_count=Count('chess_moves'))
            .order_by('-created_at')
        )

        serializer = ChessGameSerializer(games, many=True)
        return JsonResponse(serializer.data, safe=False)
