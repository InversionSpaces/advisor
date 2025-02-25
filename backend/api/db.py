from pymongo import MongoClient
from config import MONGODB_URI, MONGODB_DB_NAME

# Initialize the database client
client = MongoClient(MONGODB_URI)
db = client[MONGODB_DB_NAME]
