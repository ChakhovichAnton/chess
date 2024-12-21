from django.urls import path

from . import views

urlpatterns = [
    path("", views.GameView.as_view(), name="game_view"),
]