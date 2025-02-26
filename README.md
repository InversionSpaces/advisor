# Advisor Application

A simple web application with FastAPI backend, React frontend, and MongoDB database.

## Project Structure

- `backend/`: FastAPI Python backend
- `frontend/`: React frontend

## Features

- "About Me" text input field
- Save and update user information
- Persistent user identification with UUID
- MongoDB database for data storage

## Setup and Running

### Prerequisites

- Python 3.8+
- Node.js 14+
- MongoDB

### Backend Setup

1. Navigate to the backend directory:
   ```
   cd backend
   ```

2. Install dependencies:
   ```
   pip install -r requirements.txt
   ```

3. Make sure MongoDB is running on your system.

4. Start the backend server:
   ```
   python run.py
   ```

   The API will be available at http://localhost:8000

### Frontend Setup

1. Navigate to the frontend directory:
   ```
   cd frontend
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Start the development server:
   ```
   npm run dev
   ```

   The application will be available at http://localhost:3000

## API Documentation

- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

## Development

- Backend: The FastAPI application follows a modular structure with routers, models, and database modules.
- Frontend: The React application uses functional components with hooks for state management.

## License

MIT 