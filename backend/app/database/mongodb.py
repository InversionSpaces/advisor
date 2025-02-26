import os
from pymongo import MongoClient
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Get MongoDB connection string from environment variables
MONGODB_URI = os.getenv("MONGODB_URI", "mongodb://localhost:27017")
DB_NAME = os.getenv("DB_NAME", "advisor")

client = MongoClient(MONGODB_URI, serverSelectionTimeoutMS=5000)
db = client[DB_NAME]
user_collection = db.users