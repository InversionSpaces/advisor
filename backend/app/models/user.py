from datetime import datetime
from typing import List

from pydantic import BaseModel


# Internal models (not exposed to API)
class AboutMeEntry(BaseModel):
    """Model for a single about_me entry with timestamp (internal use only)"""

    text: str
    created_at: datetime


class Message(BaseModel):
    """Model for a chat message"""

    text: str
    created_at: datetime
    origin: str  # "user" or "ai"


# API models
class UserBase(BaseModel):
    """Base user model with about_me field"""

    about_me: str


class UserCreate(UserBase):
    """Model for creating a new user"""

    pass


class UserResponse(UserBase):
    """Model for user response with ID"""

    id: str


class UserUpdate(BaseModel):
    """Model for updating user information"""

    about_me: str


class MessageCreate(BaseModel):
    """Model for creating a new message"""

    text: str


class MessageResponse(BaseModel):
    """Model for message response"""

    text: str
    created_at: str
    origin: str


class MessagesResponse(BaseModel):
    """Model for messages response"""

    messages: List[MessageResponse]


def serialize_user(user) -> dict:
    """Convert MongoDB user document to dict"""
    # Return only the latest about_me entry
    return {"id": str(user["_id"]), "about_me": user["about_me"]}


def serialize_messages(user) -> dict:
    """Convert MongoDB user document to messages dict"""
    messages = user.get("messages", [])
    return {"messages": messages}
