import json
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
from django.views import View

from chess.models import ChessGame

# Create your views here.

@method_decorator(csrf_exempt, name='dispatch')
class GameView(View):
    def get(self, request):
        games = ChessGame.objects.all().values('id', 'name')
        return JsonResponse(list(games), safe=False)
    
    def post(self, request):
        data = json.loads(request.body)
        game = ChessGame.objects.create(name=data['name'])
        return JsonResponse({'message': 'Game created', 'game_id': game.id}, status=201)
