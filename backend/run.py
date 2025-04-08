import os
import subprocess
import sys

# Ensure necessary directories exist
dirs_to_create = [
    'face_data',
    'auth',
    'routes',
    'services',
]

# Create directories if they don't exist
for directory in dirs_to_create:
    if not os.path.exists(directory):
        os.makedirs(directory, exist_ok=True)

# Create __init__.py files to make Python recognize them as packages
for directory in dirs_to_create:
    init_file = os.path.join(directory, '__init__.py')
    if not os.path.exists(init_file):
        with open(init_file, 'w') as f:
            pass  # Create an empty file

# Install dependencies if needed
try:
    import cv2
    import face_recognition
    import numpy
    import fastapi
except ImportError:
    print("Installing required dependencies...")
    subprocess.check_call([sys.executable, "-m", "pip", "install", "-r", "requirements.txt"])

# Run the application
if __name__ == "__main__":
    try:
        import uvicorn
        print("Starting FastAPI server...")
        uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
    except Exception as e:
        print(f"Error starting server: {e}")
        sys.exit(1) 