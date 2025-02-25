from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from .auth import MongoRefreshToken

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

    refresh = MongoRefreshToken.for_user(user)
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
        refresh = MongoRefreshToken.for_user(user)
        return Response({'refresh': str(refresh), 'access': str(refresh.access_token)})

    return Response({'error': 'Invalid credentials'}, status=401)

@api_view(['POST', 'GET'])
@permission_classes([IsAuthenticated])
def messages(request):
    user = User.find_by_username(request.user.username)
    if not user:
        return Response({'error': 'User not found.'}, status=404)
    
    if request.method == 'POST':
        # Handle posting a new message
        content = request.data.get('message')
        
        if not content:
            return Response({'error': 'Message content is required.'}, status=400)

        user.add_message(content)
        return Response({'message': 'Message posted successfully.'}, status=201)
    
    elif request.method == 'GET':
        # Handle fetching messages with optional filtering
        try:
            limit = int(request.query_params.get('limit', 0)) or None
        except ValueError:
            limit = None
        
        # Get filtered messages
        messages = user.get_messages(limit=limit)
        messages = [msg.to_dict() for msg in messages]

        return Response({
            'count': len(messages),
            'messages': messages
        })
