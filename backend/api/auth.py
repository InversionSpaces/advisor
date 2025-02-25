from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework_simplejwt.tokens import RefreshToken
from django.utils.translation import gettext_lazy as _
from rest_framework import exceptions

from .models import User
from .db import db

class MongoJWTAuthentication(JWTAuthentication):
    """
    Custom JWT Authentication for MongoDB users
    """
    def get_user(self, validated_token):
        """
        Attempt to find and return a user using the given validated token.
        """
        try:
            user_id = validated_token['user_id']
        except KeyError:
            raise exceptions.AuthenticationFailed(_('Token contained no recognizable user identification'))

        # Find user in MongoDB by ID
        user_data = db.users.find_one({'_id': user_id})
        if not user_data:
            raise exceptions.AuthenticationFailed(_('User not found'))

        user = User._from_db(user_data)
        if not user.is_active:
            raise exceptions.AuthenticationFailed(_('User is inactive'))

        return user


class MongoRefreshToken(RefreshToken):
    """
    Custom RefreshToken for MongoDB users
    """
    @classmethod
    def for_user(cls, user):
        """
        Returns an authorization token for the given user that will be provided
        after authenticating the user's credentials.
        """
        token = cls()
        token['user_id'] = user._id
        token['username'] = user.username

        return token 