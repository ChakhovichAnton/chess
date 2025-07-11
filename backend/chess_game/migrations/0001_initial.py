# Generated by Django 5.1.4 on 2025-06-17 14:02

import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models

def create_default_time_controls(apps, schema_editor):
    TimeControl = apps.get_model('chess_game', 'ChessGameTimeControl')

    presets = [
        ("1+0 Bullet", 1, 0, 'bullet'),
        ("1+1 Bullet", 1, 1, 'bullet'),
        ("2+1 Bullet", 2, 1, 'bullet'),
        ("3+0 Blitz", 3, 0, 'blitz'),
        ("3+2 Blitz", 3, 2, 'blitz'),
        ("5+0 Blitz", 5, 0, 'blitz'),
        ("5+3 Blitz", 5, 3, 'blitz'),
        ("10+0 Rapid", 10, 0, 'rapid'),
        ("10+5 Rapid", 10, 5, 'rapid'),
        ("15+10 Rapid", 15, 10, 'rapid'),
    ]

    for name, minutes, inc, category in presets:
        TimeControl.objects.get_or_create(
            name=name,
            minutes=minutes,
            increment_seconds=inc,
            category=category,
        )


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='ChessGameTimeControl',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=50, unique=True)),
                ('minutes', models.PositiveIntegerField()),
                ('increment_seconds', models.PositiveIntegerField()),
                ('category', models.CharField(choices=[('bullet', 'Bullet'), ('blitz', 'Blitz'), ('rapid', 'Rapid')], max_length=6)),
            ],
        ),
        migrations.RunPython(create_default_time_controls),
        migrations.CreateModel(
            name='ChessGame',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('status', models.CharField(choices=[('O', 'Ongoing'), ('W', 'WhiteWin'), ('B', 'BlackWin'), ('D', 'Draw')], default='O', max_length=1)),
                ('fen', models.CharField(default='rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1', max_length=90)),
                ('user_black', models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='user_black_id', to=settings.AUTH_USER_MODEL)),
                ('user_white', models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='user_white_id', to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.CreateModel(
            name='ChessClock',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('running', models.CharField(choices=[('W', 'White'), ('B', 'Black'), ('P', 'Paused')], default='P', max_length=1)),
                ('last_started_at', models.DateTimeField(blank=True, null=True)),
                ('white_time_ms', models.BigIntegerField(default=0)),
                ('black_time_ms', models.BigIntegerField(default=0)),
                ('game', models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, related_name='clock', to='chess_game.chessgame')),
                ('time_control', models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, related_name='time_control', to='chess_game.chessgametimecontrol')),
            ],
        ),
        migrations.CreateModel(
            name='ChessMove',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('move_text', models.CharField(max_length=10)),
                ('user_time_left_ms', models.BigIntegerField(default=0)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('game', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='chess_moves', to='chess_game.chessgame')),
                ('user', models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.CreateModel(
            name='DrawOffers',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('is_active', models.BooleanField(default=True)),
                ('accepted', models.BooleanField(default=False)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('game', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='chess_game.chessgame')),
                ('user', models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.CreateModel(
            name='WaitingUserForGame',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('channel_name', models.CharField(max_length=255, unique=True)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('time_control', models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, related_name='game_time_control', to='chess_game.chessgametimecontrol')),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
        ),
    ]
