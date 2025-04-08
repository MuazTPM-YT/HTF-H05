from django.core.management.base import BaseCommand, CommandError
from django.db import transaction
from django.db.models import Q
from api.models import User, EmergencyAccessLog, EmergencyPIN
from api.utils.crypto import encryption

class Command(BaseCommand):
    help = 'Encrypt existing unencrypted data in the database'

    def add_arguments(self, parser):
        parser.add_argument(
            '--dry-run',
            action='store_true',
            help='Only show what would be encrypted without making changes',
        )

    def handle(self, *args, **options):
        dry_run = options['dry_run']
        
        if dry_run:
            self.stdout.write(self.style.WARNING('DRY RUN MODE: No data will be modified'))
        
        # Start transaction - we'll roll back in dry run mode
        with transaction.atomic():
            self.encrypt_user_data(dry_run)
            self.encrypt_emergency_logs(dry_run)
            self.encrypt_emergency_pins(dry_run)
            
            if dry_run:
                # Roll back all changes in dry run mode
                transaction.set_rollback(True)
                self.stdout.write(self.style.WARNING('DRY RUN COMPLETED - All changes rolled back'))
            else:
                self.stdout.write(self.style.SUCCESS('Successfully encrypted all sensitive data'))
    
    def encrypt_user_data(self, dry_run):
        """Encrypt sensitive fields in User model"""
        count = 0
        users = User.objects.all()
        total_users = users.count()
        
        self.stdout.write(f"Processing {total_users} user records...")
        
        for user in users:
            # Skip already encrypted data (if we can identify it)
            # For demonstration purposes - you may need different logic
            
            # Phone number
            if user.phone_number and not self._is_likely_encrypted(user.phone_number):
                if not dry_run:
                    # Temporarily bypass the auto-encryption to manually set
                    user.phone_number = encryption.encrypt(user.phone_number)
                count += 1
                
            # License number
            if user.license_number and not self._is_likely_encrypted(user.license_number):
                if not dry_run:
                    user.license_number = encryption.encrypt(user.license_number)
            
            # Hospital name
            if user.hospital_name and not self._is_likely_encrypted(user.hospital_name):
                if not dry_run:
                    user.hospital_name = encryption.encrypt(user.hospital_name)
            
            # Location
            if user.location and not self._is_likely_encrypted(user.location):
                if not dry_run:
                    user.location = encryption.encrypt(user.location)
            
            # Emergency contacts
            if user.emergency_contacts and not self._is_likely_encrypted(str(user.emergency_contacts)):
                if not dry_run:
                    user.emergency_contacts = encryption.encrypt(user.emergency_contacts)
            
            # Critical health info
            if user.critical_health_info and not self._is_likely_encrypted(str(user.critical_health_info)):
                if not dry_run:
                    user.critical_health_info = encryption.encrypt(user.critical_health_info)
            
            if not dry_run:
                user.save()
        
        self.stdout.write(f"Processed {count} user records with sensitive data")
    
    def encrypt_emergency_logs(self, dry_run):
        """Encrypt sensitive fields in EmergencyAccessLog model"""
        count = 0
        logs = EmergencyAccessLog.objects.all()
        total_logs = logs.count()
        
        self.stdout.write(f"Processing {total_logs} emergency access logs...")
        
        for log in logs:
            # IP address
            if log.ip_address and not self._is_likely_encrypted(str(log.ip_address)):
                if not dry_run:
                    log.ip_address = encryption.encrypt(log.ip_address)
                count += 1
            
            # User agent
            if log.user_agent and not self._is_likely_encrypted(log.user_agent):
                if not dry_run:
                    log.user_agent = encryption.encrypt(log.user_agent)
            
            # Details
            if log.details and not self._is_likely_encrypted(str(log.details)):
                if not dry_run:
                    log.details = encryption.encrypt(log.details)
            
            if not dry_run:
                log.save()
        
        self.stdout.write(f"Processed {count} emergency access logs with sensitive data")
    
    def encrypt_emergency_pins(self, dry_run):
        """Encrypt sensitive fields in EmergencyPIN model"""
        count = 0
        pins = EmergencyPIN.objects.all()
        total_pins = pins.count()
        
        self.stdout.write(f"Processing {total_pins} emergency PINs...")
        
        for pin in pins:
            # PIN
            if pin.pin and not self._is_likely_encrypted(pin.pin):
                if not dry_run:
                    pin.pin = encryption.encrypt(pin.pin)
                count += 1
            
            # Revocation reason
            if pin.revoked_reason and not self._is_likely_encrypted(pin.revoked_reason):
                if not dry_run:
                    pin.revoked_reason = encryption.encrypt(pin.revoked_reason)
            
            if not dry_run:
                pin.save()
        
        self.stdout.write(f"Processed {count} emergency PINs with sensitive data")
    
    def _is_likely_encrypted(self, value):
        """
        Try to detect if a value is already encrypted.
        This is a heuristic - encrypted data is base64-encoded and fairly long.
        """
        if not isinstance(value, str):
            return False
            
        # Encrypted data should be fairly long base64 string
        import base64
        import re
        
        # Simple heuristic: check if it's a long base64 string
        if len(value) > 100 and re.match(r'^[A-Za-z0-9_-]+={0,2}$', value):
            # Try to decode and see if it might be base64
            try:
                base64.urlsafe_b64decode(value.encode('ascii'))
                return True
            except:
                pass
                
        return False 