from django.db import models
from django.contrib.auth.models import User
from django.utils import timezone
from django.core.exceptions import ValidationError
from apps.restaurant.models import Staff


class UserProfile(models.Model):
    """
    Extends Django's built-in User model with restaurant-specific fields.
    """
    user = models.OneToOneField(
        User, 
        on_delete=models.CASCADE, 
        related_name='profile'
    )
    staff_profile = models.OneToOneField(
        Staff,
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        help_text="Link to staff record"
    )
    current_role = models.CharField(
        max_length=50,
        blank=True,
        help_text="Active role for this session"
    )
    last_login_ip = models.GenericIPAddressField(
        null=True,
        blank=True,
        help_text="Last login IP address for security tracking"
    )
    failed_login_attempts = models.PositiveIntegerField(
        default=0,
        help_text="Number of consecutive failed login attempts"
    )
    account_locked_until = models.DateTimeField(
        null=True,
        blank=True,
        help_text="Account lockout expiration time"
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'auth_user_profiles'
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['staff_profile']),
            models.Index(fields=['current_role']),
            models.Index(fields=['account_locked_until']),
        ]

    def __str__(self):
        return f"{self.user.username} - {self.current_role or 'No Role'}"

    def clean(self):
        """Custom validation for UserProfile."""
        super().clean()
        
        # If staff_profile is set, ensure current_role matches available roles
        if self.staff_profile and self.current_role:
            if self.current_role != self.staff_profile.role:
                raise ValidationError({
                    'current_role': f'Current role must match staff role: {self.staff_profile.role}'
                })

    @property
    def is_account_locked(self):
        """Check if account is currently locked."""
        if self.account_locked_until:
            return timezone.now() < self.account_locked_until
        return False

    @property
    def can_attempt_login(self):
        """Check if user can attempt login (not locked)."""
        return not self.is_account_locked

    def lock_account(self, duration_minutes=15):
        """Lock account for specified duration."""
        self.account_locked_until = timezone.now() + timezone.timedelta(minutes=duration_minutes)
        self.save()

    def unlock_account(self):
        """Unlock account and reset failed attempts."""
        self.account_locked_until = None
        self.failed_login_attempts = 0
        self.save()

    def increment_failed_attempts(self):
        """Increment failed login attempts and lock if necessary."""
        self.failed_login_attempts += 1
        
        # Progressive lockout: 5 attempts = 15 min, 10 attempts = 1 hour, 15+ = 24 hours
        if self.failed_login_attempts >= 15:
            self.lock_account(duration_minutes=1440)  # 24 hours
        elif self.failed_login_attempts >= 10:
            self.lock_account(duration_minutes=60)    # 1 hour
        elif self.failed_login_attempts >= 5:
            self.lock_account(duration_minutes=15)    # 15 minutes
            
        self.save()

    def reset_failed_attempts(self):
        """Reset failed login attempts after successful login."""
        self.failed_login_attempts = 0
        self.account_locked_until = None
        self.save()

    def get_permissions(self):
        """Get user permissions based on staff role."""
        if not self.staff_profile:
            return []
        
        # Return permissions based on role from Staff model
        role = self.staff_profile.role
        
        # This will be expanded when we implement permission groups
        role_permissions = {
            'general_manager': ['admin', 'reports', 'staff_management', 'financial_data'],
            'shift_supervisor': ['operational_oversight', 'staff_scheduling', 'discount_approval'],
            'head_chef': ['kitchen_management', 'menu_management', 'inventory_management'],
            'sous_chef': ['kitchen_operations', 'recipe_management', 'inventory_receiving'],
            'line_cook': ['kitchen_display', 'order_preparation', 'inventory_usage'],
            'server': ['pos_system', 'table_management', 'customer_profiles', 'payment_processing'],
            'host': ['reservations', 'table_assignment', 'customer_checkin'],
            'bartender': ['pos_system', 'bar_inventory', 'payment_processing', 'bar_reporting'],
            'busser': ['table_status', 'cleaning_completion'],
        }
        
        return role_permissions.get(role, [])


class AuthenticationLog(models.Model):
    """
    Log all authentication events for security monitoring.
    """
    ACTION_CHOICES = [
        ('login_success', 'Login Success'),
        ('login_failed', 'Login Failed'),
        ('logout', 'Logout'),
        ('token_refresh', 'Token Refresh'),
        ('account_locked', 'Account Locked'),
        ('account_unlocked', 'Account Unlocked'),
        ('password_changed', 'Password Changed'),
        ('role_changed', 'Role Changed'),
    ]

    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        help_text="User associated with the action (null for failed login attempts)"
    )
    username_attempted = models.CharField(
        max_length=150,
        blank=True,
        help_text="Username attempted (for failed logins)"
    )
    action = models.CharField(
        max_length=20,
        choices=ACTION_CHOICES,
        help_text="Type of authentication action"
    )
    ip_address = models.GenericIPAddressField(
        null=True,
        blank=True,
        help_text="IP address of the request"
    )
    user_agent = models.TextField(
        blank=True,
        help_text="Browser/client user agent"
    )
    success = models.BooleanField(
        default=True,
        help_text="Whether the action was successful"
    )
    details = models.TextField(
        blank=True,
        help_text="Additional details about the action"
    )
    timestamp = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'auth_logs'
        ordering = ['-timestamp']
        indexes = [
            models.Index(fields=['user', '-timestamp']),
            models.Index(fields=['action', '-timestamp']),
            models.Index(fields=['ip_address', '-timestamp']),
            models.Index(fields=['success', '-timestamp']),
        ]

    def __str__(self):
        username = self.user.username if self.user else self.username_attempted
        return f"{username} - {self.get_action_display()} - {self.timestamp}"
