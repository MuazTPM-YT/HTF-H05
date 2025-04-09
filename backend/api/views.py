from django.shortcuts import render
from django.contrib.auth import get_user_model
from rest_framework import generics
from .serializers import UserSerializer 
from rest_framework.permissions import AllowAny
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
import os
from dotenv import load_dotenv
import sys
import cv2
import numpy as np
import psycopg2
import base64
from .models import EmergencyPIN, EmergencyAccessLog
from django.core.mail import send_mail
from django.conf import settings
from rest_framework import status
from django.utils import timezone
import datetime
from django.core.cache import cache
from django.views.decorators.csrf import csrf_exempt
import requests
from twilio.rest import Client
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from django.contrib.auth import authenticate
from rest_framework.views import APIView
from django.db import transaction

load_dotenv()
User = get_user_model()

# Custom Token Authentication View
class CustomTokenObtainPairView(APIView):
    permission_classes = [AllowAny]
    
    @transaction.atomic
    def post(self, request, *args, **kwargs):
        username = request.data.get('username')
        password = request.data.get('password')
        
        if not username or not password:
            return Response(
                {"detail": "Username and password are required"}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Use Django's built-in authentication
        user = authenticate(username=username, password=password)
        
        if user is None:
            # Log failed login attempt if desired
            return Response(
                {"detail": "Invalid credentials"}, 
                status=status.HTTP_401_UNAUTHORIZED
            )
        
        # Generate tokens using the existing serializer
        serializer = TokenObtainPairSerializer(data=request.data)
        
        try:
            serializer.is_valid(raise_exception=True)
            return Response(serializer.validated_data, status=status.HTTP_200_OK)
        except Exception as e:
            # Provide more detailed error for debugging
            return Response(
                {"detail": f"Authentication failed: {str(e)}"}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

class CreateUserView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny]

@api_view(['GET'])
@permission_classes([AllowAny])
def health_check(request):
    return Response({"status": "healthy"})

face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_frontalface_default.xml')

def store_face_encodings(user_id, encodings):
    conn = psycopg2.connect(
        dbname=os.getenv("DB_NAME"), 
        user=os.getenv("DB_USER"), 
        password=os.getenv("DB_PASSWORD"), 
        host=os.getenv("DB_HOST"), 
        port=os.getenv("DB_PORT")
    )
    cur = conn.cursor()
    cur.execute("""
        CREATE TABLE IF NOT EXISTS face_data (
            user_id TEXT,
            encoding BYTEA
        )
    """)
    for encoding in encodings:
        cur.execute("INSERT INTO face_data (user_id, encoding) VALUES (%s, %s)", (user_id, encoding.tobytes()))
    conn.commit()
    cur.close()
    conn.close()

def load_face_encodings():
    conn = psycopg2.connect(
        dbname=os.getenv("DB_NAME"), 
        user=os.getenv("DB_USER"), 
        password=os.getenv("DB_PASSWORD"), 
        host=os.getenv("DB_HOST"), 
        port=os.getenv("DB_PORT")
    )
    cur = conn.cursor()
    cur.execute("SELECT user_id, encoding FROM face_data")
    data = cur.fetchall()
    cur.close()
    conn.close()
    encodings_by_user = {}
    for user_id, encoding in data:
        img = np.frombuffer(encoding, dtype=np.uint8).reshape(100, 100)
        encodings_by_user.setdefault(user_id, []).append(img)
    return encodings_by_user

def delete_user_data(user_id):
    conn = psycopg2.connect(
        dbname=os.getenv("DB_NAME"), 
        user=os.getenv("DB_USER"), 
        password=os.getenv("DB_PASSWORD"), 
        host=os.getenv("DB_HOST"), 
        port=os.getenv("DB_PORT")
    )
    cur = conn.cursor()
    cur.execute("DELETE FROM face_data WHERE user_id = %s", (user_id,))
    conn.commit()
    cur.close()
    conn.close()

@api_view(['POST'])
@permission_classes([AllowAny])
def enroll_face(request):
    """
    Expected JSON payload:
    {
      "user_id": "example_user",
      "images": ["<base64-image-string>", "<base64-image-string>", ...]
    }
    """
    user_id = request.data.get("user_id")
    images = request.data.get("images", [])
    if not user_id or not images:
        return Response({"error": "user_id and images are required"}, status=400)
    
    encodings = []
    for img_str in images:
        try:
            img_data = base64.b64decode(img_str)
            np_arr = np.frombuffer(img_data, np.uint8)
            img = cv2.imdecode(np_arr, cv2.IMREAD_COLOR)
        except Exception as e:
            continue
        gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
        faces = face_cascade.detectMultiScale(gray, 1.3, 5)
        if len(faces) > 0:
            (x, y, w, h) = faces[0]
            face_img = cv2.resize(gray[y:y+h, x:x+w], (100, 100))
            encodings.append(face_img)
    if encodings:
        store_face_encodings(user_id, encodings)
        return Response({"message": f"Enrollment completed for {user_id} with {len(encodings)} images."})
    else:
        return Response({"error": "No face detected in any image."}, status=400)

@api_view(['POST'])
@permission_classes([AllowAny])
def verify_face(request):
    """
    Expected JSON payload:
    {
      "image": "<base64-image-string>"
    }
    """
    image_str = request.data.get("image")
    if not image_str:
        return Response({"error": "image is required"}, status=400)
    try:
        img_data = base64.b64decode(image_str)
        np_arr = np.frombuffer(img_data, np.uint8)
        img = cv2.imdecode(np_arr, cv2.IMREAD_COLOR)
    except Exception as e:
        return Response({"error": "Invalid image data"}, status=400)
    
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    faces = face_cascade.detectMultiScale(gray, 1.3, 5)
    if not faces:
        return Response({"error": "No face detected."}, status=400)
    
    (x, y, w, h) = faces[0]
    face_img = cv2.resize(gray[y:y+h, x:x+w], (100, 100))
    known_encodings = load_face_encodings()
    match_counts = {user: 0 for user in known_encodings.keys()}
    
    for user_id, encodings in known_encodings.items():
        for known in encodings:
            diff = np.mean(cv2.absdiff(face_img, known))
            if diff < 20:
                match_counts[user_id] += 1
    
    if match_counts:
        matched_user = max(match_counts, key=match_counts.get)
        if match_counts[matched_user] > 5:
            return Response({"verified": True, "user_id": matched_user})
    return Response({"verified": False})

@api_view(['POST'])
@permission_classes([AllowAny])
def delete_face_data(request):
    """
    Expected JSON payload:
    {
      "user_id": "example_user"
    }
    """
    user_id = request.data.get("user_id")
    if not user_id:
        return Response({"error": "user_id is required"}, status=400)
    delete_user_data(user_id)
    return Response({"message": f"Data for {user_id} has been deleted."})

@api_view(['POST'])
@permission_classes([AllowAny])
def generate_emergency_pin(request):
    """
    Generate a new emergency PIN and send it via SMS/Email
    Expected JSON payload:
    {
        "user_id": "user123",
        "delivery_method": "SMS" or "EMAIL" or "BOTH",
        "access_duration": 60  # in minutes
    }
    """
    user_id = request.data.get('user_id')
    delivery_method = request.data.get('delivery_method', 'BOTH')
    access_duration = request.data.get('access_duration', 60)

    if not user_id:
        return Response({"error": "user_id is required"}, status=status.HTTP_400_BAD_REQUEST)

    try:
        user = User.objects.get(id=user_id)
    except User.DoesNotExist:
        return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)

    # Create new emergency PIN
    emergency_pin = EmergencyPIN.objects.create(
        user=user,
        delivery_method=delivery_method,
        access_duration=access_duration
    )

    # Send PIN via selected method(s)
    if delivery_method in ['EMAIL', 'BOTH'] and user.email:
        try:
            send_mail(
                'Your Emergency Access PIN',
                f'Your emergency access PIN is: {emergency_pin.pin}\n'
                f'This PIN will expire in 24 hours.\n'
                f'Access duration: {access_duration} minutes.',
                settings.DEFAULT_FROM_EMAIL,
                [user.email],
                fail_silently=False,
            )
            emergency_pin.delivery_status = 'SENT'
        except Exception as e:
            emergency_pin.delivery_status = 'FAILED'
            emergency_pin.save()
            return Response(
                {"error": f"Failed to send email: {str(e)}"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

    # Send SMS if requested
    if delivery_method in ['SMS', 'BOTH'] and user.phone_number:
        try:
            client = Client(os.getenv('TWILIO_ACCOUNT_SID'), os.getenv('TWILIO_AUTH_TOKEN'))
            client.messages.create(
                body=f'Your emergency access PIN is: {emergency_pin.pin}\n'
                     f'This PIN will expire in 24 hours.\n'
                     f'Access duration: {access_duration} minutes.',
                from_=os.getenv('TWILIO_PHONE_NUMBER'),
                to=user.phone_number
            )
            emergency_pin.delivery_status = 'SENT'
        except Exception as e:
            emergency_pin.delivery_status = 'FAILED'
            emergency_pin.save()
            return Response(
                {"error": f"Failed to send SMS: {str(e)}"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

    emergency_pin.save()
    emergency_pin.log_access('GENERATED', request)

    return Response({
        "message": "Emergency PIN generated and sent successfully",
        "expires_at": emergency_pin.expires_at,
        "access_duration": emergency_pin.access_duration
    })

@api_view(['POST'])
@permission_classes([AllowAny])
def verify_emergency_pin(request):
    """
    Verify an emergency PIN and grant access if valid
    Expected JSON payload:
    {
        "pin": "123456",
        "user_id": "user123"
    }
    """
    pin = request.data.get('pin')
    user_id = request.data.get('user_id')

    if not pin or not user_id:
        return Response(
            {"error": "PIN and user_id are required"},
            status=status.HTTP_400_BAD_REQUEST
        )

    try:
        emergency_pin = EmergencyPIN.objects.get(
            pin_hash=EmergencyPIN.hash_pin(pin),
            user_id=user_id,
            is_used=False,
            is_revoked=False
        )
    except EmergencyPIN.DoesNotExist:
        # Record failed attempt
        try:
            pin = EmergencyPIN.objects.get(user_id=user_id, is_used=False, is_revoked=False)
            pin.record_failed_attempt()
            pin.log_access('FAILED', request, {"attempted_pin": pin})
        except EmergencyPIN.DoesNotExist:
            pass
        return Response(
            {"error": "Invalid or expired PIN"},
            status=status.HTTP_400_BAD_REQUEST
        )

    if not emergency_pin.is_valid():
        emergency_pin.log_access('FAILED', request)
        return Response(
            {"error": "PIN has expired"},
            status=status.HTTP_400_BAD_REQUEST
        )

    # Mark PIN as used
    emergency_pin.mark_as_used()
    emergency_pin.log_access('VERIFIED', request)

    # Calculate access expiration
    access_expires_at = timezone.now() + datetime.timedelta(minutes=emergency_pin.access_duration)

    return Response({
        "message": "Access granted",
        "access_expires_at": access_expires_at,
        "access_duration": emergency_pin.access_duration,
        "access_token": emergency_pin.access_token
    })

@api_view(['GET'])
@permission_classes([AllowAny])
def get_emergency_pin_status(request, user_id):
    """
    Get the status of the latest emergency PIN for a user
    """
    try:
        latest_pin = EmergencyPIN.objects.filter(
            user_id=user_id
        ).latest('created_at')
        
        return Response({
            "is_valid": latest_pin.is_valid(),
            "is_used": latest_pin.is_used,
            "expires_at": latest_pin.expires_at,
            "created_at": latest_pin.created_at,
            "delivery_status": latest_pin.delivery_status
        })
    except EmergencyPIN.DoesNotExist:
        return Response(
            {"error": "No emergency PIN found"},
            status=status.HTTP_404_NOT_FOUND
        )

@api_view(['POST'])
@permission_classes([AllowAny])
def revoke_emergency_access(request):
    """
    Revoke emergency access for a user
    Expected JSON payload:
    {
        "user_id": "user123",
        "reason": "Optional reason for revocation"
    }
    """
    user_id = request.data.get('user_id')
    reason = request.data.get('reason')

    if not user_id:
        return Response({"error": "user_id is required"}, status=status.HTTP_400_BAD_REQUEST)

    try:
        user = User.objects.get(id=user_id)
    except User.DoesNotExist:
        return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)

    # Revoke all active emergency PINs for the user
    active_pins = EmergencyPIN.objects.filter(
        user=user,
        is_used=False,
        is_revoked=False,
        expires_at__gt=timezone.now()
    )

    for pin in active_pins:
        pin.revoke(reason=reason)
        pin.log_access('REVOKED', request, {"reason": reason})

    return Response({
        "message": f"Emergency access revoked for user {user_id}",
        "pins_revoked": active_pins.count()
    })

@api_view(['POST'])
@permission_classes([AllowAny])
def update_emergency_contacts(request):
    """
    Update emergency contacts for a user
    Expected JSON payload:
    {
        "user_id": "user123",
        "contacts": [
            {
                "name": "John Doe",
                "relationship": "Spouse",
                "phone": "1234567890",
                "email": "john@example.com"
            },
            ...
        ]
    }
    """
    user_id = request.data.get('user_id')
    contacts = request.data.get('contacts', [])

    if not user_id:
        return Response({"error": "user_id is required"}, status=status.HTTP_400_BAD_REQUEST)

    try:
        user = User.objects.get(id=user_id)
    except User.DoesNotExist:
        return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)

    # Update emergency contacts
    user.emergency_contacts = contacts
    user.save()

    return Response({
        "message": "Emergency contacts updated successfully",
        "contacts": contacts
    })

@api_view(['POST'])
@permission_classes([AllowAny])
def update_critical_health_info(request):
    """
    Update critical health information for a user
    Expected JSON payload:
    {
        "user_id": "user123",
        "allergies": "Penicillin, Peanuts",
        "medications": "Atorvastatin 20mg daily, Lisinopril 10mg daily",
        "conditions": "Hypertension, Type 2 Diabetes",
        "blood_type": "O+",
        "weight": "165 lbs",
        "height": "5'10\""
    }
    """
    user_id = request.data.get('user_id')
    if not user_id:
        return Response({"error": "user_id is required"}, status=status.HTTP_400_BAD_REQUEST)

    try:
        user = User.objects.get(id=user_id)
    except User.DoesNotExist:
        return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)

    # Update critical health information
    user.critical_health_info = {
        'allergies': request.data.get('allergies', ''),
        'medications': request.data.get('medications', ''),
        'conditions': request.data.get('conditions', ''),
        'blood_type': request.data.get('blood_type', ''),
        'weight': request.data.get('weight', ''),
        'height': request.data.get('height', '')
    }
    user.save()

    return Response({
        "message": "Critical health information updated successfully",
        "info": user.critical_health_info
    })
