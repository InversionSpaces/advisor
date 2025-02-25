from rest_framework.decorators import api_view
from rest_framework.response import Response
import jwt
import datetime

from .models import User
from config import SECRET_KEY


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

    return Response({'message': 'User registered successfully.'}, status=201)


@api_view(['POST'])
def login(request):
    username = request.data.get('username')
    password = request.data.get('password')

    if not username or not password:
        return Response({'error': 'Username and password are required.'}, status=400)

    user = User.find_by_username(username)
    if user and user.check_password(password):
        token = jwt.encode({
            'user_id': user._id,
            'exp': datetime.datetime.now(datetime.timezone.utc) + datetime.timedelta(hours=1)
        }, SECRET_KEY, algorithm='HS256')
        return Response({'token': token})

    return Response({'error': 'Invalid credentials'}, status=401)
