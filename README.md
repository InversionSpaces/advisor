# Advisor Application

A full-stack application with a FastAPI backend, React frontend, and MongoDB database.

## Production Setup with Docker

The entire application can be run with a single command using Docker Compose:

```bash
docker compose up -d
```

This will:
1. Build the frontend React application
2. Build the backend FastAPI application
3. Start a MongoDB instance
4. Connect all services together

The application will be available at:
- http://localhost:8000 - Main application
- http://localhost:8000/api - API root
- http://localhost:8000/docs - API documentation

### Rebuilding the Application

If you need to rebuild the application after making changes, you can use the provided script:

```bash
./rebuild.sh
```

This script will:
1. Stop all running containers
2. Remove the frontend build volume to ensure a clean build
3. Rebuild all containers
4. Start the application

### Troubleshooting

If you're seeing API responses instead of the frontend:
1. Make sure the frontend has been built correctly
2. Check that the frontend volume is properly mounted in the backend container
3. Verify that the `FRONTEND_PATH` environment variable is set correctly
4. Use the rebuild script to ensure a clean rebuild
5. Make sure the `OPENAI_API_KEY` environment variable is set to active key

## Development Setup

### Backend

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Create a virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

4. Run the development server:
   ```bash
   python run.py
   ```

### Frontend

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Run the development server:
   ```bash
   npm run dev
   ```

## Project Structure

```
advisor/
├── backend/
│   ├── app/
│   │   ├── database/
│   │   ├── models/
│   │   ├── routers/
│   │   ├── services/
│   │   └── main.py
│   ├── Dockerfile
│   ├── requirements.txt
│   └── run.py
├── frontend/
│   ├── public/
│   ├── src/
│   ├── Dockerfile
│   └── package.json
├── docker-compose.yml
└── rebuild.sh
```

## Environment Variables

### Backend
- `MONGODB_URI`: MongoDB connection string (default: mongodb://mongodb:27017)
- `DB_NAME`: Database name (default: advisor)
- `ENVIRONMENT`: "development" or "production" (default: production in Docker)
- `FRONTEND_PATH`: Path to frontend build files (default: /app/frontend/dist in Docker)
- `HOST`: Host to bind the server to (default: 0.0.0.0)
- `PORT`: Port to run the server on (default: 8000)

## Deployment

The application is containerized and can be deployed to any environment that supports Docker and Docker Compose.

## Features

- "About Me" text input field
- Save and update user information
- Persistent user identification with UUID
- MongoDB database for data storage
- Internal history tracking of all "About Me" updates with timestamps (for later analysis)

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