import os
import json
import base64
import cv2
import numpy as np
from typing import List, Dict, Tuple
import io
from datetime import datetime

class FaceIDService:
    def __init__(self, storage_path: str = "face_data"):
        self.storage_path = storage_path
        os.makedirs(storage_path, exist_ok=True)
        
        # Load Haar Cascade for face detection
        try:
            self.face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_frontalface_default.xml')
            if self.face_cascade.empty():
                raise Exception("Could not load face cascade classifier")
        except Exception as e:
            print(f"Error loading face cascade: {str(e)}")
            # Create a simple placeholder if OpenCV resources aren't available
            self.face_cascade = None
            
    def _decode_image(self, base64_image: str) -> np.ndarray:
        """Decode a base64 image into an OpenCV image."""
        try:
            img_data = base64.b64decode(base64_image)
            nparr = np.frombuffer(img_data, np.uint8)
            return cv2.imdecode(nparr, cv2.IMREAD_COLOR)
        except Exception as e:
            print(f"Error decoding image: {str(e)}")
            return None
    
    def _process_face(self, image: np.ndarray) -> np.ndarray:
        """Detect and extract a face from an image."""
        if image is None or self.face_cascade is None:
            return None
            
        # Convert to grayscale
        gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
        
        # Detect faces
        faces = self.face_cascade.detectMultiScale(gray, 1.3, 5)
        if len(faces) == 0:
            return None
            
        # Process the first (or largest) face
        (x, y, w, h) = max(faces, key=lambda face: face[2] * face[3])
        
        # Apply zoom if face is small
        zoom_factor = 1
        if w < 100 or h < 100:
            zoom_factor = 2
        elif w < 150 or h < 150:
            zoom_factor = 1.5
            
        if zoom_factor > 1:
            x_center, y_center = x + w // 2, y + h // 2
            w_zoom, h_zoom = int(w * zoom_factor), int(h * zoom_factor)
            
            # Ensure zoom bounds remain within image
            x_zoom = max(x_center - w_zoom // 2, 0)
            y_zoom = max(y_center - h_zoom // 2, 0)
            x2_zoom = min(x_center + w_zoom // 2, gray.shape[1])
            y2_zoom = min(y_center + h_zoom // 2, gray.shape[0])
            
            # Extract and resize face
            face_img = gray[y_zoom:y2_zoom, x_zoom:x2_zoom]
        else:
            face_img = gray[y:y+h, x:x+w]
            
        # Resize to standard size
        face_img = cv2.resize(face_img, (100, 100))
        return face_img
        
    def _save_face_data(self, user_id: str, face_encodings: List[np.ndarray]) -> None:
        """Save face encodings to a file."""
        # Create user directory if it doesn't exist
        user_dir = os.path.join(self.storage_path, user_id)
        os.makedirs(user_dir, exist_ok=True)
        
        # Save timestamp and metadata
        metadata = {
            "timestamp": datetime.now().isoformat(),
            "image_count": len(face_encodings),
            "user_id": user_id
        }
        
        with open(os.path.join(user_dir, "metadata.json"), 'w') as f:
            json.dump(metadata, f)
            
        # Save individual face images
        for i, face in enumerate(face_encodings):
            filename = f"face_{i}.png"
            cv2.imwrite(os.path.join(user_dir, filename), face)
        
        print(f"Saved {len(face_encodings)} face encodings for user {user_id}")
            
    def _load_face_data(self, user_id: str) -> List[np.ndarray]:
        """Load face encodings from a file."""
        user_dir = os.path.join(self.storage_path, user_id)
        if not os.path.exists(user_dir):
            return []
            
        faces = []
        for filename in os.listdir(user_dir):
            if filename.startswith("face_") and filename.endswith(".png"):
                filepath = os.path.join(user_dir, filename)
                face = cv2.imread(filepath, cv2.IMREAD_GRAYSCALE)
                if face is not None:
                    faces.append(face)
                    
        return faces
            
    def setup_face_id(self, user_id: str, images_data: List[str]) -> Dict:
        """Setup Face ID for a user using multiple images."""
        if not images_data:
            return {
                "success": False,
                "message": "No images provided"
            }
        
        if self.face_cascade is None:
            return {
                "success": False,
                "message": "Face detection is not available"
            }
            
        # Process each image to extract faces
        processed_faces = []
        eyes_open_count = 0
        eyes_closed_count = 0
        
        # First half of images are with eyes open
        for i, img_data in enumerate(images_data):
            img = self._decode_image(img_data)
            if img is None:
                continue
                
            face = self._process_face(img)
            if face is not None:
                processed_faces.append(face)
                if i < len(images_data) // 2:
                    eyes_open_count += 1
                else:
                    eyes_closed_count += 1
        
        if not processed_faces:
            return {
                "success": False,
                "message": "No valid faces detected in the provided images"
            }
            
        # Save the processed faces
        self._save_face_data(user_id, processed_faces)
        
        return {
            "success": True,
            "message": f"Successfully processed {len(processed_faces)} images",
            "images_processed": len(processed_faces),
            "eyes_open_count": eyes_open_count,
            "eyes_closed_count": eyes_closed_count
        }
        
    def verify_face(self, user_id: str, image_data: str) -> Dict:
        """Verify if a face matches the stored face data."""
        # Load stored face encodings
        stored_faces = self._load_face_data(user_id)
        if not stored_faces:
            return {
                "success": False,
                "message": "No face data found for this user",
                "verified": False
            }
            
        if self.face_cascade is None:
            return {
                "success": False,
                "message": "Face detection is not available",
                "verified": False
            }
            
        # Process the new image
        img = self._decode_image(image_data)
        if img is None:
            return {
                "success": False,
                "message": "Invalid image data",
                "verified": False
            }
            
        face = self._process_face(img)
        if face is None:
            return {
                "success": False,
                "message": "No face detected in the image",
                "verified": False
            }
            
        # Compare with stored faces
        match_count = 0
        min_diff = float('inf')
        
        for stored_face in stored_faces:
            # Calculate the absolute difference between the images
            diff = np.mean(cv2.absdiff(face, stored_face))
            min_diff = min(min_diff, diff)
            
            # Low difference means the faces are similar
            if diff < 20:  # Threshold can be adjusted
                match_count += 1
                
        # Determine if verified based on match count
        verified = match_count >= 5  # At least 5 matches required
        confidence = 1.0 - (min_diff / 255.0) if min_diff < float('inf') else 0.0
        
        return {
            "success": True,
            "verified": verified,
            "confidence": confidence,
            "match_count": match_count,
            "message": f"Face verification completed with confidence {confidence:.2f}"
        }
        
    def reset_face_id(self, user_id: str) -> Dict:
        """Reset Face ID data for a user."""
        user_dir = os.path.join(self.storage_path, user_id)
        if not os.path.exists(user_dir):
            return {
                "success": False,
                "message": "No Face ID data found for this user"
            }
            
        # Remove all files in the user directory
        try:
            for filename in os.listdir(user_dir):
                file_path = os.path.join(user_dir, filename)
                if os.path.isfile(file_path):
                    os.remove(file_path)
            os.rmdir(user_dir)
            
            return {
                "success": True,
                "message": "Face ID data successfully reset"
            }
        except Exception as e:
            return {
                "success": False,
                "message": f"Error resetting Face ID data: {str(e)}"
            } 