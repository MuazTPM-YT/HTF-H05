from django.db import models
from django.conf import settings
from django.contrib.auth.models import AbstractUser
from django.utils import timezone
import secrets
import hashlib
import uuid
from api.utils.fields import EncryptedCharField, EncryptedTextField, EncryptedJSONField

class User(AbstractUser):
    ROLE_CHOICES = (
        ('patient', 'Patient'),
        ('doctor', 'Doctor'),
    )
    
    GENDER_CHOICES = (
        ('male', 'Male'),
        ('female', 'Female'),
        ('other', 'Other'),
    )

    role = models.CharField(max_length=10, choices=ROLE_CHOICES, default='patient')
    phone_number = EncryptedCharField(max_length=150, blank=True)  # Increased size to accommodate encrypted data
    date_of_birth = models.DateField(null=True, blank=True)
    gender = models.CharField(max_length=10, choices=GENDER_CHOICES, blank=True)
    
    license_number = EncryptedCharField(max_length=150, blank=True)  # Increased size + encrypted
    specialization = models.CharField(max_length=100, blank=True)
    hospital_name = EncryptedCharField(max_length=250, blank=True)  # Increased size + encrypted
    location = EncryptedCharField(max_length=250, blank=True)  # Increased size + encrypted

    # Emergency access fields - encrypted for privacy
    emergency_contacts = EncryptedJSONField(default=list, blank=True)
    critical_health_info = EncryptedJSONField(default=dict, blank=True)
    emergency_access_enabled = models.BooleanField(default=True)
    emergency_access_expires_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        verbose_name = 'User'
        verbose_name_plural = 'Users'

    def __str__(self):
        return f"{self.get_full_name()} ({self.get_role_display()})"

    def has_active_emergency_access(self):
        if not self.emergency_access_enabled:
            return False
        if self.emergency_access_expires_at and timezone.now() > self.emergency_access_expires_at:
            return False
        return True

    def grant_emergency_access(self, duration_minutes=60):
        self.emergency_access_enabled = True
        self.emergency_access_expires_at = timezone.now() + timezone.timedelta(minutes=duration_minutes)
        self.save()

    def revoke_emergency_access(self):
        self.emergency_access_enabled = False
        self.emergency_access_expires_at = None
        self.save()

class EmergencyAccessLog(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='emergency_access_logs')
    timestamp = models.DateTimeField(auto_now_add=True)
    action = models.CharField(max_length=20, choices=[
        ('GENERATED', 'PIN Generated'),
        ('VERIFIED', 'PIN Verified'),
        ('EXPIRED', 'PIN Expired'),
        ('REVOKED', 'Access Revoked'),
        ('FAILED', 'Failed Attempt')
    ])
    ip_address = EncryptedCharField(max_length=100, null=True, blank=True)  # Encrypted IP address
    user_agent = EncryptedTextField(null=True, blank=True)  # Encrypted user agent
    details = EncryptedJSONField(default=dict, blank=True)  # Encrypted details

    class Meta:
        ordering = ['-timestamp']

class EmergencyPIN(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='emergency_pins')
    pin = EncryptedCharField(max_length=100)  # Encrypted PIN
    pin_hash = models.CharField(max_length=64)  # Store hashed PIN (already secure)
    created_at = models.DateTimeField(auto_now_add=True)
    expires_at = models.DateTimeField(default=timezone.now)
    is_used = models.BooleanField(default=False)
    used_at = models.DateTimeField(null=True, blank=True)
    access_duration = models.IntegerField(default=60)  # Duration in minutes
    delivery_method = models.CharField(max_length=10, choices=[
        ('SMS', 'SMS'),
        ('EMAIL', 'Email'),
        ('BOTH', 'Both')
    ], default='BOTH')
    delivery_status = models.CharField(max_length=20, default='PENDING', choices=[
        ('PENDING', 'Pending'),
        ('SENT', 'Sent'),
        ('FAILED', 'Failed')
    ])
    access_token = models.UUIDField(unique=True, default=uuid.uuid4, editable=False)
    failed_attempts = models.IntegerField(default=0)
    last_attempt = models.DateTimeField(null=True, blank=True)
    is_revoked = models.BooleanField(default=False)
    revoked_at = models.DateTimeField(null=True, blank=True)
    revoked_reason = EncryptedTextField(null=True, blank=True)  # Encrypted reason

    class Meta:
        ordering = ['-created_at']

    @classmethod
    def generate_pin(cls):
        return ''.join(secrets.choice('0123456789') for _ in range(6))

    @staticmethod
    def hash_pin(pin):
        return hashlib.sha256(pin.encode()).hexdigest()

    def save(self, *args, **kwargs):
        if not self.pin:
            self.pin = self.generate_pin()
        if not self.pin_hash:
            self.pin_hash = self.hash_pin(self.pin)
        if not self.expires_at:
            self.expires_at = timezone.now() + timezone.timedelta(hours=24)
        super().save(*args, **kwargs)

    def is_valid(self):
        return (
            not self.is_used and
            not self.is_revoked and
            timezone.now() < self.expires_at and
            self.failed_attempts < 3
        )

    def mark_as_used(self):
        self.is_used = True
        self.used_at = timezone.now()
        self.save()

    def record_failed_attempt(self):
        self.failed_attempts += 1
        self.last_attempt = timezone.now()
        self.save()

    def revoke(self, reason=None):
        self.is_revoked = True
        self.revoked_at = timezone.now()
        self.revoked_reason = reason
        self.save()

    def log_access(self, action, request=None, details=None):
        EmergencyAccessLog.objects.create(
            user=self.user,
            action=action,
            ip_address=request.META.get('REMOTE_ADDR') if request else None,
            user_agent=request.META.get('HTTP_USER_AGENT') if request else None,
            details=details or {}
        )
