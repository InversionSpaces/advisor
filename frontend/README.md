# Advisor Frontend

A React-based frontend for the Advisor application.

## Setup

1. Install dependencies:
   ```
   npm install
   ```

2. Configure environment variables:
   - The backend API URL is configured in `src/services/api.js`
   - By default, it points to `http://localhost:8000`

## Running the Application

Run the development server:
```
npm run dev
```

The application will be available at http://localhost:3000

## Linting and Code Formatting

The project uses the following tools for code quality:

- **ESLint**: For linting and style checking
- **Prettier**: For code formatting

### Running Linters

To check your code with ESLint:
```
npm run lint
```

### Automatic Code Formatting

To automatically fix ESLint issues:
```
npm run lint:fix
```

To format your code with Prettier:
```
npm run format
```

For the best results, run both commands in sequence:
```
npm run lint:fix && npm run format
```

## Building for Production

Build the application for production:
```
npm run build
```

The built files will be in the `dist` directory.

## Features

- "About Me" text input field
- Persistent user identification with UUID
- Local storage for user ID
- Automatic data retrieval for returning users

## Components

- `App.jsx`: Main application component
- `AboutMe.jsx`: Component for managing the "About Me" form
- `api.js`: Service for communicating with the backend API

## API Integration

The frontend communicates with the backend using the following endpoints:

- `POST /users`: Create a new user
- `GET /users/{user_id}`: Get user information
- `PUT /users/{user_id}`: Update user information 