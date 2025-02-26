import uvicorn
import os

if __name__ == "__main__":
    # Get environment variables with defaults
    host = os.getenv("HOST", "0.0.0.0")
    port = int(os.getenv("PORT", "8000"))
    reload = os.getenv("ENVIRONMENT", "development") == "development"
    
    # Run the application
    uvicorn.run(
        "app.main:app", 
        host=host, 
        port=port, 
        reload=reload,
        proxy_headers=True,
        forwarded_allow_ips="*"
    ) 