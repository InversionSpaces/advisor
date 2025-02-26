from datetime import datetime
from typing import List

from bson import ObjectId
from fastapi import APIRouter, HTTPException

from ..database import users_collection
from ..models.user import MessageCreate, MessageResponse
from ..services.ai_service import generate_response

router = APIRouter()


@router.post("/users/{user_id}/messages", response_model=List[MessageResponse])
async def add_message(user_id: str, message: MessageCreate):
    """
    Add a message to a user's messages list and generate an AI response
    """
    # Validate user_id
    if not ObjectId.is_valid(user_id):
        raise HTTPException(status_code=400, detail="Invalid user ID format")

    # Find the user
    user = await users_collection.find_one({"_id": ObjectId(user_id)})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    # Create a new message with timestamp
    new_message = {
        "text": message.text,
        "created_at": datetime.utcnow().isoformat(),
        "origin": message.origin,
    }

    # Initialize messages array if it doesn't exist
    if "messages" not in user:
        user["messages"] = []

    # Add the message to the user's messages
    user["messages"].append(new_message)

    # Generate AI response
    ai_response = await generate_response(message.text)

    # Add AI response to messages
    user["messages"].append(ai_response)

    # Update the user document
    await users_collection.update_one(
        {"_id": ObjectId(user_id)}, {"$set": {"messages": user["messages"]}}
    )

    # Return all messages
    return user["messages"]
