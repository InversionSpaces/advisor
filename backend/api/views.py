from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken

from .models import User

@api_view(['POST'])
def register(request):
    username = request.data.get('username')
    password = request.data.get('password')

    if not username or not password:
        return Response({'error': 'Username and password are required.'}, status=400)

    if User.find_by_username(username):
        return Response({'error': 'Username already exists.'}, status=400)

    user = User.create_user(username, password)
    user.save()

    refresh = RefreshToken.for_user(user)
    return Response({
        'message': 'User registered successfully.',
        'refresh': str(refresh),
        'access': str(refresh.access_token)
    }, status=201)


@api_view(['POST'])
def login(request):
    username = request.data.get('username')
    password = request.data.get('password')

    if not username or not password:
        return Response({'error': 'Username and password are required.'}, status=400)

    user = User.find_by_username(username)
    if user and user.check_password(password):
        refresh = RefreshToken.for_user(user)
        return Response({'refresh': str(refresh), 'access': str(refresh.access_token)})

    return Response({'error': 'Invalid credentials'}, status=401)
