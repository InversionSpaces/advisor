from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .routers import users

# Create FastAPI app
app = FastAPI(
    title="Advisor API",
    description="API for managing user profiles with 'about me' information",
    version="0.1.0"
)

# Configure CORS
origins = [
    "http://localhost:3000",  # React frontend
    "http://localhost:5173",  # Vite dev server
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(users.router)

# Root endpoint
@app.get("/")
async def root():
    return {
        "message": "Welcome to the Advisor API",
        "docs": "/docs",
        "version": "0.1.0"
    } 