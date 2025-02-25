from dotenv import load_dotenv
import os

# Load environment variables from .env file
load_dotenv()

# Retrieve constants from environment variables
MONGODB_URI = os.getenv(
    'MONGODB_URI',
    'mongodb://localhost:27017/')  # Default URI if not set
MONGODB_DB_NAME = os.getenv('MONGODB_DB_NAME')
SECRET_KEY = os.getenv('SECRET_KEY')
