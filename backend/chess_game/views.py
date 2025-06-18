from django.http import JsonResponse, Http404
from django.views import View
from django.db.models import Q, Count
from django.core.paginator import Paginator

from .models import ChessGame, ChessGameTimeControl
from .serializers import ChessGameSerializerWithMoves, ChessGameSerializer, ChessGameTimeControlSerializer

class GameView(View):
    def get(self, request, id):
        game = ChessGame.objects.get_game_status_with_users_and_moves(id)

        if game is None:
            raise Http404
        serializer = ChessGameSerializerWithMoves(game)
        return JsonResponse(serializer.data, safe=False)
    
class ChessGameTimeControlView(View):
    def get(self, request):
        time_control = ChessGameTimeControl.objects.all()
        serializer = ChessGameTimeControlSerializer(time_control, many=True)
        return JsonResponse(serializer.data, safe=False)

class UserGameView(View):
    page_size = 10

    def get(self, request, id):
        page = int(request.GET.get("page", 1))

        games = (
            ChessGame.objects
            .select_related('clock', 'clock__time_control')
            .filter(Q(user_white_id=id) | Q(user_black_id=id))
            .annotate(move_count=Count('chess_moves'))
            .order_by('-created_at')
        )

        paginator = Paginator(games, self.page_size)

        # If the page is invalid, return an empty response
        if page < 1 or page > paginator.num_pages:
            return JsonResponse({
                "count": paginator.count,
                "pageCount": paginator.num_pages,
                "results": [],
            }, safe=False)

        page_obj = paginator.get_page(page)
        serializer = ChessGameSerializer(page_obj.object_list, many=True)

        return JsonResponse({
            "count": paginator.count,
            "pageCount": paginator.num_pages,
            "currentPage": page_obj.number,
            "results": serializer.data,
        }, safe=False)
