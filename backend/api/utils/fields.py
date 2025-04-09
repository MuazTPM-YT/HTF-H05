from django.db import models
from django.conf import settings
from .crypto import encryption


class EncryptedTextField(models.TextField):
    """
    A TextField that encrypts its contents when saving to the database
    and decrypts when retrieving from the database.
    """
    description = "TextField that transparently encrypts/decrypts data"

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)

    def from_db_value(self, value, expression, connection):
        """Convert from database value to Python value"""
        if value is None:
            return value
        return encryption.decrypt(value, 'str')

    def to_python(self, value):
        """Convert from serialized value to Python value"""
        if value is None or not isinstance(value, str) or not value.strip():
            return value
        
        # Check if the value is already decrypted
        # This is needed because to_python can be called multiple times
        # during form validation
        try:
            # If we can decrypt, it's encrypted
            encryption.decrypt(value, 'str')
            return value  # Return encrypted (will be decrypted by from_db_value)
        except Exception:
            # If decryption fails, it's likely already decrypted
            return value

    def get_prep_value(self, value):
        """Prepare value for database query"""
        if value is None or value == '':
            return value
            
        # Don't encrypt already encrypted values
        try:
            encryption.decrypt(value, 'str')
            return value  # Already encrypted
        except Exception:
            # Not encrypted yet, so encrypt
            return encryption.encrypt(value)


class EncryptedCharField(models.CharField):
    """
    A CharField that encrypts its contents when saving to the database
    and decrypts when retrieving from the database.
    """
    description = "CharField that transparently encrypts/decrypts data"

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)

    def from_db_value(self, value, expression, connection):
        """Convert from database value to Python value"""
        if value is None:
            return value
        return encryption.decrypt(value, 'str')

    def to_python(self, value):
        """Convert from serialized value to Python value"""
        if value is None or not isinstance(value, str) or not value.strip():
            return value
            
        # Check if the value is already decrypted
        try:
            encryption.decrypt(value, 'str')
            return value  # Return encrypted (will be decrypted by from_db_value)
        except Exception:
            # If decryption fails, it's likely already decrypted
            return value

    def get_prep_value(self, value):
        """Prepare value for database query"""
        if value is None or value == '':
            return value
            
        # Don't encrypt already encrypted values
        try:
            encryption.decrypt(value, 'str')
            return value  # Already encrypted
        except Exception:
            # Not encrypted yet, so encrypt
            return encryption.encrypt(value)


class EncryptedEmailField(EncryptedCharField):
    """
    An EmailField that encrypts its contents when saving to the database
    and decrypts when retrieving from the database.
    """
    description = "EmailField that transparently encrypts/decrypts data"
    
    def __init__(self, *args, **kwargs):
        kwargs.setdefault('max_length', 254)
        super().__init__(*args, **kwargs)
        
    def formfield(self, **kwargs):
        # Use the parent formfield but specify EmailField
        from django.forms import EmailField
        defaults = {'form_class': EmailField}
        defaults.update(kwargs)
        return super().formfield(**defaults)


class EncryptedJSONField(models.TextField):
    """
    A TextField that encrypts JSON content when saving to the database
    and decrypts when retrieving from the database.
    """
    description = "JSON field that transparently encrypts/decrypts data"

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)

    def from_db_value(self, value, expression, connection):
        """Convert from database value to Python value"""
        if value is None:
            return value
        return encryption.decrypt(value, 'json')

    def to_python(self, value):
        """Convert from serialized value to Python value"""
        if value is None:
            return value
            
        # If already a dict/list, no need to decode
        if isinstance(value, (dict, list)):
            return value
            
        # Check if the value is already decrypted JSON
        try:
            encryption.decrypt(value, 'json')
            return value  # Return encrypted (will be decrypted by from_db_value)
        except Exception:
            # If decryption fails, it might be a JSON string
            return value

    def get_prep_value(self, value):
        """Prepare value for database query"""
        if value is None:
            return value
            
        # Don't encrypt already encrypted values
        try:
            encryption.decrypt(value, 'json')
            return value  # Already encrypted
        except Exception:
            # Not encrypted yet, so encrypt
            return encryption.encrypt(value)
            
    def value_to_string(self, obj):
        """Return string value of this field from the passed obj"""
        value = self.value_from_object(obj)
        return self.get_prep_value(value) 