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
- Internal history tracking of all "About Me" updates with timestamps (for later analysis)

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

## Code Quality and Linting

### Backend

The backend uses the following tools for code quality:

- **Flake8**: For linting and style checking
- **Black**: For code formatting
- **isort**: For import sorting

Run linting:
```
cd backend
flake8 app
```

Run automatic formatting:
```
cd backend
isort app && black app
```

### Frontend

The frontend uses the following tools for code quality:

- **ESLint**: For linting and style checking
- **Prettier**: For code formatting

Run linting:
```
cd frontend
npm run lint
```

Run automatic formatting:
```
cd frontend
npm run lint:fix && npm run format
```

## API Documentation

- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

### API Endpoints

- `GET /`: Root endpoint with API information
- `POST /users`: Create a new user
- `GET /users/{user_id}`: Get user information
- `PUT /users/{user_id}`: Update user information

## Development

- Backend: The FastAPI application follows a modular structure with routers, models, and database modules.
- Frontend: The React application uses functional components with hooks for state management.
- Data Analysis: The backend maintains a history of all "About Me" updates internally for later analysis.

## License

MIT 