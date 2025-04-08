from django.contrib.auth import get_user_model
from rest_framework import serializers

User = get_user_model()

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = [
            "id", "username", "password", "email", 
            "first_name", "last_name", "date_of_birth", 
            "gender", "role", "phone_number",
            "license_number", "specialization", 
            "hospital_name", "location"
        ]
        extra_kwargs = {
            "password": {"write_only": True},
            # Make these fields optional
            "date_of_birth": {"required": False},
            "gender": {"required": False},
            "role": {"required": False},
            "phone_number": {"required": False},
            "license_number": {"required": False},
            "specialization": {"required": False},
            "hospital_name": {"required": False},
            "location": {"required": False}
        }

    def create(self, validated_data):
        print(validated_data)
        user = User.objects.create_user(**validated_data)
        return user