from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

class LoginTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)

        print(token)
        print(user)
        
        token['username'] = user.username
        token['id'] = user.id
        return token