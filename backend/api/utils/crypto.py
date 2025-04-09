import base64
import os
from typing import Optional, Union, Any
import json

from cryptography.fernet import Fernet
from cryptography.hazmat.primitives import hashes
from cryptography.hazmat.primitives.kdf.pbkdf2 import PBKDF2HMAC
from django.conf import settings


class FernetEncryption:
    """
    Utility class for encrypting and decrypting data using Fernet (AES-256).
    
    This implementation uses a key derivation function (PBKDF2) to generate
    a secure encryption key from a password and salt.
    """
    
    def __init__(self, key: Optional[bytes] = None):
        """
        Initialize the encryption utility with a key.
        
        If no key is provided, it will use the SECRET_KEY from Django settings
        to generate a key using PBKDF2.
        """
        if key is None:
            # Get the secret key from Django settings or use a default
            password = getattr(settings, 'ENCRYPTION_KEY', settings.SECRET_KEY).encode()
            salt = getattr(settings, 'ENCRYPTION_SALT', b'healthchain_salt')
            
            # Generate a key using PBKDF2
            kdf = PBKDF2HMAC(
                algorithm=hashes.SHA256(),
                length=32,
                salt=salt,
                iterations=100000,
            )
            key = base64.urlsafe_b64encode(kdf.derive(password))
        
        self.fernet = Fernet(key)
    
    def encrypt(self, data: Union[str, bytes, dict, list, int, float, bool]) -> str:
        """
        Encrypt data of various types.
        
        Args:
            data: The data to encrypt (string, bytes, dict, list, or primitive types)
            
        Returns:
            str: Base64-encoded encrypted data
        """
        if isinstance(data, bytes):
            # Already bytes, just encrypt
            serialized_data = data
        elif isinstance(data, str):
            # Convert string to bytes
            serialized_data = data.encode('utf-8')
        else:
            # For other types (dict, list, int, etc.), convert to JSON string first
            serialized_data = json.dumps(data).encode('utf-8')
        
        # Perform encryption
        encrypted_data = self.fernet.encrypt(serialized_data)
        
        # Return as base64 string
        return base64.urlsafe_b64encode(encrypted_data).decode('ascii')
    
    def decrypt(self, encrypted_data: str, output_type: str = 'auto') -> Any:
        """
        Decrypt data and optionally convert to the specified type.
        
        Args:
            encrypted_data: Base64-encoded encrypted data
            output_type: The type to convert the decrypted data to ('str', 'bytes', 'json', or 'auto')
            
        Returns:
            The decrypted data in the specified type
        """
        # Convert from base64 string to bytes
        encrypted_bytes = base64.urlsafe_b64decode(encrypted_data.encode('ascii'))
        
        # Decrypt the data
        decrypted_bytes = self.fernet.decrypt(encrypted_bytes)
        
        # Handle output based on requested type
        if output_type == 'bytes':
            return decrypted_bytes
        elif output_type == 'str':
            return decrypted_bytes.decode('utf-8')
        elif output_type == 'json':
            return json.loads(decrypted_bytes.decode('utf-8'))
        elif output_type == 'auto':
            # Try to detect the type automatically
            try:
                # Attempt to parse as JSON
                return json.loads(decrypted_bytes.decode('utf-8'))
            except json.JSONDecodeError:
                # If not valid JSON, return as string
                return decrypted_bytes.decode('utf-8')
        else:
            raise ValueError(f"Unsupported output_type: {output_type}")


# Create a singleton instance for easy import
encryption = FernetEncryption() 