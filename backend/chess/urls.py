from django.urls import path

from . import views

urlpatterns = [
    path("game/<int:id>/", views.GameView.as_view(), name="game_view"),
]