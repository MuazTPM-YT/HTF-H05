from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from routes import face_id
import os

app = FastAPI(title="Healthcare API", description="API for healthcare application")

# Configure CORS
origins = [
    "http://localhost:5173",  # React frontend in development
    "http://localhost:3000",  # Alternative frontend port
    "http://localhost:8080",  # Another possible frontend port
    "http://127.0.0.1:5173",
    "http://127.0.0.1:3000",
    "http://127.0.0.1:8080",
    # Add production URLs as needed
]

# List of allowed headers
allowed_headers = [
    "Content-Type",
    "Authorization",
    "Accept",
    "Origin",
    "X-Requested-With",
    "Cache-Control",
    "Pragma",
    "Expires"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=allowed_headers,
    expose_headers=["*"],
    max_age=3600  # Cache preflight requests for 1 hour
)

# Include routers
app.include_router(face_id.router, prefix="/api/face-id", tags=["face-id"])

@app.get("/")
async def root():
    return {"message": "Healthcare API is running"}

@app.get("/health")
async def health_check():
    return {"status": "healthy"}

# This is the endpoint that the frontend is trying to access
@app.get("/health/")
async def health_check_with_slash():
    return {"status": "healthy"}

if __name__ == "__main__":
    import uvicorn
    port = int(os.environ.get("PORT", 8000))
    uvicorn.run("main:app", host="0.0.0.0", port=port, reload=True) 