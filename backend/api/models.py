from werkzeug.security import generate_password_hash, check_password_hash
from uuid import uuid4
from datetime import datetime, timezone

from .db import db

class Message:
    """
    A class representing a user message.
    
    This is not a database model but a helper class to encapsulate
    message-related functionality.
    """
    def __init__(self, content, posted_time=None, message_id=None):
        self.content = content
        self.posted_time = posted_time or datetime.now(timezone.utc)
        self.message_id = message_id or str(uuid4())
        
    def to_dict(self):
        """Convert Message object to dictionary for storage in MongoDB"""
        return {
            'content': self.content,
            'posted_time': self.posted_time,
            'message_id': self.message_id
        }
    
    @classmethod
    def from_dict(cls, message_dict):
        """Create a Message object from a dictionary"""
        return cls(
            content=message_dict.get('content'),
            posted_time=message_dict.get('posted_time'),
            message_id=message_dict.get('message_id')
        )

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
        # Convert Message objects to dictionaries for MongoDB storage
        message_dicts = [msg.to_dict() for msg in self.messages]
        
        db.users.update_one(
            {'_id': self._id},
            {'$set': {
                'username': self.username,
                'password_hash': self.password_hash,
                'messages': message_dicts
            }},
            upsert=True
        )

    def add_message(self, content):
        message = Message(content=content)
        self.messages.append(message)
        self.save()
        
    def get_messages(self, limit=None):
        """
        Get user messages with optional filtering
        
        Args:
            limit (int, optional): Maximum number of messages to return
            sort_by (str, optional): Field to sort by
            reverse (bool, optional): Sort in reverse order if True
            
        Returns:
            list: Filtered and sorted Message objects
        """
        # Sort messages
        messages = sorted(
            self.messages,
            key=lambda x: x.posted_time,
        )
            
        # Limit number of messages
        if limit and isinstance(limit, int) and limit > 0:
            messages = messages[:limit]
            
        return messages

    @classmethod
    def _from_db(cls, user_data):
        user = User(user_data['username'], user_data['password_hash'], user_data['_id'])
        # Convert message dictionaries to Message objects
        message_dicts = user_data.get('messages', [])
        user.messages = [Message.from_dict(msg) for msg in message_dicts]
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
