import os
from pymongo import MongoClient
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Get MongoDB connection string from environment variables
MONGODB_URI = os.getenv("MONGODB_URI", "mongodb://localhost:27017")
DB_NAME = os.getenv("DB_NAME", "advisor")

# Create a MongoDB client
client = MongoClient(MONGODB_URI)
db = client[DB_NAME]

# Collection for user profiles
user_collection = db.users

def get_db():
    """
    Get database connection.
    Returns MongoDB database instance.
    """
    return db 