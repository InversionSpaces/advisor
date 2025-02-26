import uuid
from datetime import datetime

from fastapi import APIRouter, HTTPException, status

from ..database.mongodb import user_collection
from ..models.user import (
    MessageCreate,
    MessagesResponse,
    UserCreate,
    UserResponse,
    UserUpdate,
    serialize_messages,
    serialize_user,
)
from ..services.ai_service import generate_response

router = APIRouter(
    prefix="/users",
    tags=["users"],
    responses={404: {"description": "Not found"}},
)


@router.post("", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
async def create_user(user: UserCreate):
    """
    Create a new user with the provided about_me information.
    Returns the created user with a generated UUID.
    """
    user_id = str(uuid.uuid4())
    current_time = datetime.utcnow()

    # Create history entry
    history_entry = {"text": user.about_me, "created_at": current_time.isoformat()}

    # Create user document
    user_data = {
        "_id": user_id,
        "about_me": user.about_me,
        "history": [history_entry],
        "messages": [],
        "created_at": current_time,
        "updated_at": current_time,
    }

    # Insert into database
    result = user_collection.insert_one(user_data)

    if not result.acknowledged:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Failed to create user"
        )

    # Return the created user
    return {"id": user_id, "about_me": user.about_me}


@router.get("/{user_id}", response_model=UserResponse)
async def get_user(user_id: str):
    """
    Get user information by user ID.
    Returns only the latest about_me entry.
    """
    user = user_collection.find_one({"_id": user_id})

    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail=f"User with ID {user_id} not found"
        )

    return serialize_user(user)


@router.put("/{user_id}", response_model=UserResponse)
async def update_user(user_id: str, user_update: UserUpdate):
    """
    Update user's about_me information.
    Internally adds a new entry to the history for later analysis.
    """
    # Check if user exists
    existing_user = user_collection.find_one({"_id": user_id})
    if not existing_user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail=f"User with ID {user_id} not found"
        )

    current_time = datetime.utcnow()

    # Create history entry
    history_entry = {"text": user_update.about_me, "created_at": current_time.isoformat()}

    # Update user
    result = user_collection.update_one(
        {"_id": user_id},
        {
            "$set": {"about_me": user_update.about_me, "updated_at": current_time},
            "$push": {"history": history_entry},
        },
    )

    if result.modified_count == 0:
        # If no document was modified (might be same data)
        if result.matched_count > 0:
            # User exists but no changes were made
            return serialize_user(existing_user)

        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Failed to update user"
        )

    # Return updated user
    updated_user = user_collection.find_one({"_id": user_id})
    return serialize_user(updated_user)


@router.post("/{user_id}/messages", status_code=status.HTTP_201_CREATED)
async def create_message(user_id: str, message: MessageCreate):
    """
    Add a new message to the user's messages list and generate an AI response.
    """
    # Check if user exists
    existing_user = user_collection.find_one({"_id": user_id})
    if not existing_user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail=f"User with ID {user_id} not found"
        )

    current_time = datetime.utcnow()

    # Create message entry with origin
    message_entry = {
        "text": message.text,
        "created_at": current_time.isoformat(),
        "origin": message.origin,
    }

    # Update user with the user message
    result = user_collection.update_one({"_id": user_id}, {"$push": {"messages": message_entry}})

    if result.modified_count == 0:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Failed to add message"
        )

    # Generate AI response
    ai_response = await generate_response(message.text)

    # Add AI response to messages
    result = user_collection.update_one({"_id": user_id}, {"$push": {"messages": ai_response}})

    if result.modified_count == 0:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Failed to add AI response"
        )

    # Get updated user with all messages
    updated_user = user_collection.find_one({"_id": user_id})

    # Return all messages
    return serialize_messages(updated_user)


@router.get("/{user_id}/messages", response_model=MessagesResponse)
async def get_messages(user_id: str):
    """
    Get all messages for a user.
    """
    user = user_collection.find_one({"_id": user_id})

    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail=f"User with ID {user_id} not found"
        )

    return serialize_messages(user)
