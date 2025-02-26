from fastapi import APIRouter, HTTPException, status
from ..models.user import UserCreate, UserResponse, UserUpdate, serialize_user
from ..database.mongodb import user_collection
import uuid

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
    
    # Create user document
    user_data = {
        "_id": user_id,
        "about_me": user.about_me
    }
    
    # Insert into database
    result = user_collection.insert_one(user_data)
    
    if not result.acknowledged:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to create user"
        )
    
    # Return the created user
    return {"id": user_id, "about_me": user.about_me}

@router.get("/{user_id}", response_model=UserResponse)
async def get_user(user_id: str):
    """
    Get user information by user ID.
    """
    user = user_collection.find_one({"_id": user_id})
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"User with ID {user_id} not found"
        )
    
    return serialize_user(user)

@router.put("/{user_id}", response_model=UserResponse)
async def update_user(user_id: str, user_update: UserUpdate):
    """
    Update user's about_me information.
    """
    # Check if user exists
    existing_user = user_collection.find_one({"_id": user_id})
    if not existing_user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"User with ID {user_id} not found"
        )
    
    # Update user
    result = user_collection.update_one(
        {"_id": user_id},
        {"$set": {"about_me": user_update.about_me}}
    )
    
    if result.modified_count == 0:
        # If no document was modified (might be same data)
        if result.matched_count > 0:
            # User exists but no changes were made
            return serialize_user(existing_user)
        
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to update user"
        )
    
    # Return updated user
    updated_user = user_collection.find_one({"_id": user_id})
    return serialize_user(updated_user) 