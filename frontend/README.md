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