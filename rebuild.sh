#!/bin/bash

# Stop and remove running containers
echo "Stopping running containers..."
docker-compose down

# Remove frontend build volume
echo "Removing frontend build volume..."
docker volume prune -af || true

# Rebuild and start containers
echo "Rebuilding and starting containers..."
docker-compose up --build -d

echo "Rebuild complete. Application is running."