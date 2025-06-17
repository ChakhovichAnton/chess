from django.db.models import Prefetch, Manager
from django.core.exceptions import ObjectDoesNotExist

class ChessGameManager(Manager):
    def get_game_status_with_users_and_moves(self, game_id):
        """Fetch all moves for a specific game."""

         # Delay the import to avoid circular import issues
        from .models import ChessMove, DrawOffers

        try:
            game = (
                self
                .select_related('user_white', 'user_black', 'clock')
                .prefetch_related(
                    Prefetch('chess_moves', queryset=ChessMove.objects.all().order_by('created_at'))
                )
                .get(id=game_id)
            )
        except ObjectDoesNotExist:
            return None

        try:
            draw_offer = DrawOffers.objects.get(game=game, is_active=True, accepted=False)
            game.draw_offer_user = draw_offer.user
        except ObjectDoesNotExist:
            game.draw_offer_user = None
        return game
