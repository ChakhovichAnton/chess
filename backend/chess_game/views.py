from django.http import JsonResponse, Http404
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
from django.views import View

from .models import ChessGame
from .serializers import ChessGameSerializer

@method_decorator(csrf_exempt, name='dispatch')
class GameView(View):
    def get(self, request, id):
        game = ChessGame.objects.get_game_status_with_users_and_moves(id)

        if game is None:
            raise Http404
        serializer = ChessGameSerializer(game)
        return JsonResponse(serializer.data, safe=False)
