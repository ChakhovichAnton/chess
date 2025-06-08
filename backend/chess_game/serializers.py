import re
from django.contrib.auth.models import User
from rest_framework.serializers import ModelSerializer, SerializerMethodField
from chess_game.models import ChessGame, ChessMove

def snake_to_camel(snake_str):
    components = snake_str.split('_')
    return components[0] + ''.join(x.title() for x in components[1:])

def camel_to_snake(camel_str):
    return re.sub(r'([a-z])([A-Z])', r'\1_\2', camel_str).lower()

class CamelSnakeSerializer(ModelSerializer):
    def to_representation(self, instance):
        """Convert field names to camelCase for outgoing response."""
        ret = super().to_representation(instance)
        camel_case_ret = {}
        for key, value in ret.items():
            camel_case_key = snake_to_camel(key)
            camel_case_ret[camel_case_key] = value
        return camel_case_ret

    def to_internal_value(self, data):
        """Convert camelCase keys to snake_case for incoming request."""
        snake_case_data = {}
        for key, value in data.items():
            snake_case_key = camel_to_snake(key)
            snake_case_data[snake_case_key] = value
        return super().to_internal_value(snake_case_data)

class ChessMoveSerializer(CamelSnakeSerializer):
    class Meta:
        model = ChessMove
        fields = '__all__'

class UserSerializer(CamelSnakeSerializer):
    class Meta:
        model = User
        fields = ['id', 'username']

class ChessGameSerializerWithMoves(CamelSnakeSerializer):
    chess_moves = ChessMoveSerializer(many=True, read_only=True)
    user_white = UserSerializer()
    user_black = UserSerializer()
    draw_offer_user = UserSerializer(read_only=True)

    class Meta:
        model = ChessGame
        fields = '__all__'

class ChessGameSerializer(CamelSnakeSerializer):
    user_white = UserSerializer()
    user_black = UserSerializer()
    move_count = SerializerMethodField(read_only=True)

    class Meta:
        model = ChessGame
        fields = '__all__'

    def get_move_count(self, obj):
        return obj.move_count
