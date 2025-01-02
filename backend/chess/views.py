from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
from django.views import View
from django.db.models import Prefetch

from chess.models import ChessGame, ChessMove
from chess.serializers import ChessGameSerializer

@method_decorator(csrf_exempt, name='dispatch')
class GameView(View):
    def get(self, request, id):
        game = ChessGame.objects.prefetch_related(
            Prefetch('chess_moves', queryset=ChessMove.objects.all().order_by('move_time'))
        ).get(id=id)

        serializer = ChessGameSerializer(game)
        return JsonResponse(serializer.data, safe=False)
