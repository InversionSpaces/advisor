# Build frontend
FROM node:18-alpine as frontend-build

WORKDIR /frontend
COPY ./frontend/package.json ./frontend/package-lock.json ./
RUN npm ci
COPY ./frontend .

ARG FEEDBACK_FORM_URL
ENV VITE_FEEDBACK_FORM_URL=${FEEDBACK_FORM_URL}

RUN npm run build

# Build backend
FROM python:3.11-slim
WORKDIR /app

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    ENVIRONMENT=production \
    FRONTEND_PATH=/app/frontend/dist

# Install dependencies
COPY backend/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy backend code
COPY ./backend .

# Copy frontend build from frontend stage
COPY --from=frontend-build /frontend/dist /app/frontend/dist

# Expose the port
EXPOSE 8000

# Run the application
CMD ["python", "run.py"] 