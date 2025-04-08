from fastapi import APIRouter, HTTPException, Depends, Header
from pydantic import BaseModel
from typing import List, Optional
from services.face_id_service import FaceIDService
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
# We'll use a simplified auth approach for testing
# from auth.auth_handler import get_current_user

router = APIRouter()
face_id_service = FaceIDService()

class FaceIDSetupRequest(BaseModel):
    images: List[str]  # List of base64 encoded images
    user_id: Optional[str] = "test_user_id"  # Default user ID for testing

class FaceIDVerifyRequest(BaseModel):
    image: str  # Base64 encoded image
    user_id: Optional[str] = "test_user_id"  # Default user ID for testing

# Helper function to get user ID from Authorization header for testing
async def get_user_id(authorization: Optional[str] = Header(None)):
    if authorization:
        return "authenticated_user_id"
    return "test_user_id"

@router.post("/setup")
async def setup_face_id(request: FaceIDSetupRequest, user_id: str = Depends(get_user_id)):
    try:
        if not request.images:
            return JSONResponse(
                status_code=400,
                content={"success": False, "message": "No images provided"}
            )
            
        result = face_id_service.setup_face_id(request.user_id or user_id, request.images)
        if not result["success"]:
            return JSONResponse(
                status_code=400,
                content=result
            )
        return result
    except Exception as e:
        return JSONResponse(
            status_code=500,
            content={"success": False, "message": str(e)}
        )

@router.post("/verify")
async def verify_face(request: FaceIDVerifyRequest, user_id: str = Depends(get_user_id)):
    try:
        if not request.image:
            return JSONResponse(
                status_code=400,
                content={"success": False, "message": "No image provided"}
            )
            
        result = face_id_service.verify_face(request.user_id or user_id, request.image)
        if not result["success"]:
            return JSONResponse(
                status_code=400,
                content=result
            )
        return result
    except Exception as e:
        return JSONResponse(
            status_code=500,
            content={"success": False, "message": str(e)}
        )

@router.post("/reset")
async def reset_face_id(user_id: str = Depends(get_user_id)):
    try:
        result = face_id_service.reset_face_id(user_id)
        if not result["success"]:
            return JSONResponse(
                status_code=400,
                content=result
            )
        return result
    except Exception as e:
        return JSONResponse(
            status_code=500,
            content={"success": False, "message": str(e)}
        ) 