from werkzeug.security import generate_password_hash, check_password_hash
from .db import db
from uuid import uuid4

# User model


class User:
    def __init__(self, username, password_hash, _id):
        self._id = _id
        self.username = username
        self.password_hash = password_hash

    @classmethod
    def _from_db(cls, user_data):
        return User(user_data['username'], user_data['password_hash'], user_data['_id'])

    def save(self):
        db.users.insert_one({
            '_id': self._id,
            'username': self.username,
            'password_hash': self.password_hash
        })

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
        return User(username=username, password_hash=password_hash, _id=_id)
