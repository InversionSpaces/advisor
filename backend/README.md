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

## Internal Data Model

The application internally stores user data with the following structure:

```json
{
  "_id": "uuid-string",
  "about_me": "Current about me text",
  "history": [
    {
      "text": "First about me entry",
      "created_at": "2023-10-25T12:34:56.789Z"
    },
    {
      "text": "Updated about me text",
      "created_at": "2023-10-26T10:11:12.345Z"
    }
  ],
  "created_at": "2023-10-25T12:34:56.789Z",
  "updated_at": "2023-10-26T10:11:12.345Z"
}
```

The history of "about_me" entries is maintained internally for later analysis but is not exposed through the API. The API only returns the current "about_me" value. 