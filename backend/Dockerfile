FROM python:3.11-slim

WORKDIR /app

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    ENVIRONMENT=production \
    FRONTEND_PATH=/app/frontend/dist

# Install dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy backend code
COPY . .

# Create directory for frontend files
RUN mkdir -p /app/frontend/dist

# Expose the port
EXPOSE 8000

# Run the application
CMD ["python", "run.py"] 