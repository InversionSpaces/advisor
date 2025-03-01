from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
import os

from .routers import users

# Create FastAPI app
app = FastAPI(
    title="Advisor API",
    description="API for managing user profiles with 'about me' information",
    version="0.1.0",
    docs_url="/api/docs",
    redoc_url="/api/redoc",
    openapi_url="/api/openapi.json"
)

# Configure CORS
frontend_addresses = os.getenv("FRONTEND_ADDRESSES", "http://localhost:8000")
origins = frontend_addresses.split(",")

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(users.router, prefix="/api")

# Root API endpoint
@app.get("/api")
async def root():
    return {"message": "Welcome to the Advisor API", "docs": "/api/docs", "version": "0.1.0"}

# Mount static files
frontend_path = os.getenv("FRONTEND_PATH")

# Check if frontend build exists
if os.path.exists(frontend_path):
    # Serve static assets from the assets directory
    if os.path.exists(os.path.join(frontend_path, "assets")):
        app.mount("/assets", StaticFiles(directory=os.path.join(frontend_path, "assets")), name="assets")
    
    # Root endpoint - serve index.html for the root path
    @app.get("/", include_in_schema=False)
    async def serve_root():
        index_path = os.path.join(frontend_path, "index.html")
        if os.path.exists(index_path):
            return FileResponse(index_path)
        return {"detail": "Frontend not built"}
    
    # Serve index.html for all other non-API routes to support SPA routing
    @app.get("/{full_path:path}", include_in_schema=False)
    async def serve_frontend(full_path: str, request: Request):
        # Skip API routes
        if full_path.startswith("api/"):
            return {"detail": "Not Found"}
            
        index_path = os.path.join(frontend_path, "index.html")
        if os.path.exists(index_path):
            return FileResponse(index_path)
        return {"detail": "Frontend not built"}
