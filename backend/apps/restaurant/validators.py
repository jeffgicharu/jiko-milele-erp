"""
Custom validators for restaurant models.
"""
import re
from django.core.exceptions import ValidationError
from django.utils.translation import gettext_lazy as _


def validate_kenyan_phone_number(value):
    """
    Validate Kenyan phone number format.
    Accepts formats: +254XXXXXXXXX, 254XXXXXXXXX, 07XXXXXXXX, 01XXXXXXXX
    """
    if not value:
        return
    
    # Clean the phone number (remove spaces and dashes)
    cleaned = re.sub(r'[\s\-]', '', str(value))
    
    # Kenyan phone number patterns
    patterns = [
        r'^\+254[17]\d{8}$',  # +254701234567 or +254101234567
        r'^254[17]\d{8}$',    # 254701234567 or 254101234567
        r'^0[17]\d{8}$',      # 0701234567 or 0101234567
    ]
    
    if not any(re.match(pattern, cleaned) for pattern in patterns):
        raise ValidationError(
            _('Enter a valid Kenyan phone number. Format: +254XXXXXXXXX or 07XXXXXXXX'),
            code='invalid_phone_number'
        )


def validate_positive_decimal(value):
    """
    Validate that a decimal value is positive.
    """
    if value is not None and value < 0:
        raise ValidationError(
            _('This value must be positive.'),
            code='negative_value'
        )


def validate_quality_rating(value):
    """
    Validate quality rating is between 1.0 and 5.0.
    """
    if value is not None and (value < 1.0 or value > 5.0):
        raise ValidationError(
            _('Quality rating must be between 1.0 and 5.0.'),
            code='invalid_rating'
        )


def validate_future_date(value):
    """
    Validate that a date is not in the future.
    """
    from django.utils import timezone
    
    if value and value > timezone.now().date():
        raise ValidationError(
            _('Date cannot be in the future.'),
            code='future_date'
        )


def validate_stock_levels(minimum_stock, maximum_stock=None, current_stock=None):
    """
    Validate stock level relationships.
    This is used in model clean() methods for cross-field validation.
    """
    errors = {}
    
    if minimum_stock is not None and minimum_stock <= 0:
        errors['minimum_stock'] = _('Minimum stock must be greater than zero.')
    
    if maximum_stock is not None and minimum_stock is not None:
        if maximum_stock <= minimum_stock:
            errors['maximum_stock'] = _('Maximum stock must be greater than minimum stock.')
    
    if current_stock is not None and current_stock < 0:
        errors['current_stock'] = _('Current stock cannot be negative.')
    
    if current_stock is not None and maximum_stock is not None:
        if current_stock > maximum_stock:
            errors['current_stock'] = _('Current stock cannot exceed maximum stock.')
    
    return errors


def normalize_kenyan_phone_number(value):
    """
    Normalize a Kenyan phone number to the standard +254XXXXXXXXX format.
    """
    if not value:
        return value
    
    # Clean the phone number
    cleaned = re.sub(r'[\s\-]', '', str(value))
    
    # Convert to standard format
    if cleaned.startswith('+254'):
        return cleaned
    elif cleaned.startswith('254'):
        return '+' + cleaned
    elif cleaned.startswith('07') or cleaned.startswith('01'):
        return '+254' + cleaned[1:]
    
    return value  # Return as-is if format is unexpected