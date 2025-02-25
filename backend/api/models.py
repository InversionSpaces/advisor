from werkzeug.security import generate_password_hash, check_password_hash
from uuid import uuid4
from datetime import datetime

from .db import db

class User:
    def __init__(self, username, password_hash, _id, messages=None):
        self._id = _id
        self.username = username
        self.password_hash = password_hash
        self.messages = messages or []
        # Add these properties for Django auth compatibility
        self.is_active = True
        self.is_authenticated = True
        self.is_anonymous = False

    def save(self):
        db.users.update_one(
            {'_id': self._id},
            {'$set': {
                'username': self.username,
                'password_hash': self.password_hash,
                'messages': self.messages
            }},
            upsert=True
        )

    def add_message(self, content):
        message = {
            'content': content,
            'posted_time': datetime.utcnow()
        }
        self.messages.append(message)
        self.save()

    @classmethod
    def _from_db(cls, user_data):
        user = User(user_data['username'], user_data['password_hash'], user_data['_id'])
        user.messages = user_data.get('messages', [])
        return user

    @staticmethod
    def find_by_username(username):
        user_data = db.users.find_one({'username': username})
        if user_data:
            return User._from_db(user_data)
        return None

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)

    @staticmethod
    def create_user(username, plain_password):
        password_hash = generate_password_hash(plain_password)
        _id = str(uuid4())
        return User(username=username, password_hash=password_hash, _id=_id, messages=[])
        
    # Required methods for Django auth compatibility
    @property
    def id(self):
        return self._id
        
    def get_username(self):
        return self.username
        
    def __str__(self):
        return self.username
