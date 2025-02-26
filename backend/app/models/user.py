from pydantic import BaseModel
from datetime import datetime

# Internal models (not exposed to API)
class AboutMeEntry(BaseModel):
    """Model for a single about_me entry with timestamp (internal use only)"""
    text: str
    created_at: datetime

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

    class Config:
        json_schema_extra = {
            "example": {
                "id": "123e4567-e89b-12d3-a456-426614174000",
                "about_me": "I am a software developer interested in web technologies."
            }
        }

class UserUpdate(BaseModel):
    """Model for updating user information"""
    about_me: str

def serialize_user(user) -> dict:
    """Convert MongoDB user document to dict"""
    # Return only the latest about_me entry
    return {
        "id": str(user["_id"]),
        "about_me": user["about_me"]
    } 