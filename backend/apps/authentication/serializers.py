"""
Serializers for authentication app.
"""
from rest_framework import serializers
from django.contrib.auth.models import User
from django.contrib.auth import authenticate
from .models import UserProfile, AuthenticationLog


class UserProfileSerializer(serializers.ModelSerializer):
    """Serializer for UserProfile model."""
    
    permissions = serializers.SerializerMethodField()
    staff_name = serializers.SerializerMethodField()
    staff_role_display = serializers.SerializerMethodField()
    
    class Meta:
        model = UserProfile
        fields = [
            'id', 
            'staff_profile', 
            'staff_name',
            'current_role', 
            'staff_role_display',
            'permissions',
            'last_login_ip', 
            'failed_login_attempts',
            'is_account_locked',
            'created_at', 
            'updated_at'
        ]
        read_only_fields = [
            'id', 
            'last_login_ip', 
            'failed_login_attempts',
            'is_account_locked',
            'created_at', 
            'updated_at',
            'permissions',
            'staff_name',
            'staff_role_display'
        ]

    def get_permissions(self, obj):
        """Get user permissions."""
        return obj.get_permissions()
    
    def get_staff_name(self, obj):
        """Get staff member name."""
        return obj.staff_profile.name if obj.staff_profile else None
    
    def get_staff_role_display(self, obj):
        """Get staff role display name."""
        if obj.staff_profile:
            return obj.staff_profile.get_role_display()
        return None


class UserSerializer(serializers.ModelSerializer):
    """Serializer for User model with profile."""
    
    profile = UserProfileSerializer(read_only=True)
    
    class Meta:
        model = User
        fields = [
            'id',
            'username',
            'email', 
            'first_name',
            'last_name',
            'is_active',
            'last_login',
            'date_joined',
            'profile'
        ]
        read_only_fields = [
            'id',
            'last_login',
            'date_joined',
            'profile'
        ]


class LoginSerializer(serializers.Serializer):
    """Serializer for login credentials."""
    
    username = serializers.CharField(max_length=150)
    password = serializers.CharField(max_length=128, write_only=True)
    
    def validate(self, data):
        """Validate login credentials."""
        username = data.get('username')
        password = data.get('password')
        
        if username and password:
            # Try to authenticate
            user = authenticate(username=username, password=password)
            
            if user:
                if not user.is_active:
                    raise serializers.ValidationError(
                        'User account is disabled.'
                    )
                
                # Check if user has a profile
                try:
                    profile = user.profile
                    if profile.is_account_locked:
                        raise serializers.ValidationError(
                            f'Account is locked until {profile.account_locked_until}. '
                            f'Contact administrator for assistance.'
                        )
                except UserProfile.DoesNotExist:
                    # Create profile if it doesn't exist
                    profile = UserProfile.objects.create(user=user)
                
                data['user'] = user
            else:
                # Handle failed login attempt
                try:
                    user_obj = User.objects.get(username=username)
                    try:
                        profile = user_obj.profile
                        profile.increment_failed_attempts()
                    except UserProfile.DoesNotExist:
                        profile = UserProfile.objects.create(user=user_obj)
                        profile.increment_failed_attempts()
                except User.DoesNotExist:
                    pass
                
                raise serializers.ValidationError(
                    'Unable to log in with provided credentials.'
                )
        else:
            raise serializers.ValidationError(
                'Must include "username" and "password".'
            )
        
        return data


class TokenRefreshSerializer(serializers.Serializer):
    """Serializer for token refresh."""
    
    refresh = serializers.CharField()


class LogoutSerializer(serializers.Serializer):
    """Serializer for logout."""
    
    refresh = serializers.CharField()


class ChangePasswordSerializer(serializers.Serializer):
    """Serializer for password change."""
    
    old_password = serializers.CharField(write_only=True)
    new_password = serializers.CharField(write_only=True)
    confirm_password = serializers.CharField(write_only=True)
    
    def validate(self, data):
        """Validate password change data."""
        if data['new_password'] != data['confirm_password']:
            raise serializers.ValidationError(
                "New passwords don't match."
            )
        return data
    
    def validate_old_password(self, value):
        """Validate old password."""
        user = self.context['request'].user
        if not user.check_password(value):
            raise serializers.ValidationError(
                "Old password is incorrect."
            )
        return value


class AuthenticationLogSerializer(serializers.ModelSerializer):
    """Serializer for AuthenticationLog model."""
    
    user_display = serializers.SerializerMethodField()
    action_display = serializers.CharField(source='get_action_display', read_only=True)
    
    class Meta:
        model = AuthenticationLog
        fields = [
            'id',
            'user',
            'user_display',
            'username_attempted',
            'action',
            'action_display',
            'ip_address',
            'user_agent',
            'success',
            'details',
            'timestamp'
        ]
        read_only_fields = ['id', 'timestamp', 'user_display', 'action_display']
    
    def get_user_display(self, obj):
        """Get user display name."""
        if obj.user:
            return obj.user.username
        return obj.username_attempted or 'Unknown'