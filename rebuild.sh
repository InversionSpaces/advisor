#!/bin/bash

# Stop and remove existing containers
echo "Stopping existing containers..."
docker compose down

# Remove frontend build volume to ensure a clean build
echo "Removing frontend build volume..."
docker volume rm advisor_frontend_build || true

# Rebuild and start containers
echo "Rebuilding and starting containers..."
docker compose up -d --build

echo "Application is now running at http://localhost:8000" 