# Advisor Backend

A FastAPI-based backend for the Advisor application.

## Setup

1. Install dependencies:
   ```
   pip install -r requirements.txt
   ```

2. Make sure MongoDB is running on your system:
   ```
   # Start MongoDB (command may vary based on your installation)
   sudo systemctl start mongod
   ```

3. Configure environment variables:
   - Create a `.env` file in the backend directory
   - Set the following variables:
     ```
     MONGODB_URI=mongodb://localhost:27017
     DB_NAME=advisor_db
     ```

## Running the Application

Run the application with:
```
python run.py
```

The API will be available at http://localhost:8000

## API Documentation

- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

## API Endpoints

- `GET /`: Root endpoint with API information
- `POST /users`: Create a new user
- `GET /users/{user_id}`: Get user information
- `PUT /users/{user_id}`: Update user information 