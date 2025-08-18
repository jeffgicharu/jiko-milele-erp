"""
Role-based access control permissions, decorators, and mixins.
"""
from functools import wraps
from django.http import JsonResponse
from django.core.exceptions import PermissionDenied
from rest_framework import permissions, status
from rest_framework.response import Response
from .models import UserProfile


# ===== PERMISSION CLASSES =====

class IsAuthenticated(permissions.BasePermission):
    """
    Custom authentication permission that also checks for UserProfile.
    """
    def has_permission(self, request, view):
        # Check if user is authenticated
        if not request.user or not request.user.is_authenticated:
            return False
        
        # Ensure user has a profile
        try:
            profile = request.user.profile
            # Check if account is locked
            if profile.is_account_locked:
                return False
        except UserProfile.DoesNotExist:
            # Create profile if it doesn't exist
            UserProfile.objects.create(user=request.user)
        
        return True


class HasRole(permissions.BasePermission):
    """
    Permission class to check if user has specific role(s).
    Usage: permission_classes = [HasRole]
    Then in view: required_roles = ['general_manager', 'shift_supervisor']
    """
    def has_permission(self, request, view):
        # First check authentication
        if not IsAuthenticated().has_permission(request, view):
            return False
        
        # Get required roles from view
        required_roles = getattr(view, 'required_roles', [])
        if not required_roles:
            return True  # No specific roles required
        
        # Check user's role
        try:
            profile = request.user.profile
            user_role = profile.current_role
            
            # Check if user has any of the required roles
            return user_role in required_roles
            
        except UserProfile.DoesNotExist:
            return False


class HasPermission(permissions.BasePermission):
    """
    Permission class to check if user has specific permission(s).
    Usage: permission_classes = [HasPermission]
    Then in view: required_permissions = ['admin', 'reports']
    """
    def has_permission(self, request, view):
        # First check authentication
        if not IsAuthenticated().has_permission(request, view):
            return False
        
        # Get required permissions from view
        required_permissions = getattr(view, 'required_permissions', [])
        if not required_permissions:
            return True  # No specific permissions required
        
        # Check user's permissions
        try:
            profile = request.user.profile
            user_permissions = profile.get_permissions()
            
            # Check if user has all required permissions
            return all(perm in user_permissions for perm in required_permissions)
            
        except UserProfile.DoesNotExist:
            return False


class IsManager(permissions.BasePermission):
    """Permission class for manager-level access."""
    def has_permission(self, request, view):
        if not IsAuthenticated().has_permission(request, view):
            return False
        
        try:
            profile = request.user.profile
            return profile.current_role in ['general_manager', 'shift_supervisor']
        except UserProfile.DoesNotExist:
            return False


class IsKitchenStaff(permissions.BasePermission):
    """Permission class for kitchen staff access."""
    def has_permission(self, request, view):
        if not IsAuthenticated().has_permission(request, view):
            return False
        
        try:
            profile = request.user.profile
            return profile.current_role in ['head_chef', 'sous_chef', 'line_cook']
        except UserProfile.DoesNotExist:
            return False


class IsFOHStaff(permissions.BasePermission):
    """Permission class for front-of-house staff access."""
    def has_permission(self, request, view):
        if not IsAuthenticated().has_permission(request, view):
            return False
        
        try:
            profile = request.user.profile
            return profile.current_role in ['server', 'host', 'bartender', 'busser']
        except UserProfile.DoesNotExist:
            return False


# ===== FUNCTION DECORATORS =====

def jwt_required(view_func):
    """
    Decorator to require JWT authentication.
    """
    @wraps(view_func)
    def wrapper(request, *args, **kwargs):
        if not request.user.is_authenticated:
            return JsonResponse({
                'error': 'Authentication required'
            }, status=401)
        
        # Check if account is locked
        try:
            profile = request.user.profile
            if profile.is_account_locked:
                return JsonResponse({
                    'error': 'Account is locked. Contact administrator.'
                }, status=423)  # HTTP 423 Locked
        except UserProfile.DoesNotExist:
            # Create profile if it doesn't exist
            UserProfile.objects.create(user=request.user)
        
        return view_func(request, *args, **kwargs)
    
    return wrapper


def role_required(roles):
    """
    Decorator to require specific role(s).
    Usage: @role_required(['general_manager', 'shift_supervisor'])
    """
    def decorator(view_func):
        @wraps(view_func)
        @jwt_required
        def wrapper(request, *args, **kwargs):
            try:
                profile = request.user.profile
                if profile.current_role not in roles:
                    return JsonResponse({
                        'error': f'Access denied. Required roles: {", ".join(roles)}'
                    }, status=403)
                
                return view_func(request, *args, **kwargs)
                
            except UserProfile.DoesNotExist:
                return JsonResponse({
                    'error': 'User profile not found'
                }, status=404)
        
        return wrapper
    return decorator


def permission_required(permissions_list):
    """
    Decorator to require specific permission(s).
    Usage: @permission_required(['admin', 'reports'])
    """
    def decorator(view_func):
        @wraps(view_func)
        @jwt_required
        def wrapper(request, *args, **kwargs):
            try:
                profile = request.user.profile
                user_permissions = profile.get_permissions()
                
                # Check if user has all required permissions
                missing_permissions = [p for p in permissions_list if p not in user_permissions]
                if missing_permissions:
                    return JsonResponse({
                        'error': f'Access denied. Missing permissions: {", ".join(missing_permissions)}'
                    }, status=403)
                
                return view_func(request, *args, **kwargs)
                
            except UserProfile.DoesNotExist:
                return JsonResponse({
                    'error': 'User profile not found'
                }, status=404)
        
        return wrapper
    return decorator


def manager_required(view_func):
    """Decorator for manager-level access only."""
    @wraps(view_func)
    @role_required(['general_manager', 'shift_supervisor'])
    def wrapper(request, *args, **kwargs):
        return view_func(request, *args, **kwargs)
    return wrapper


def kitchen_staff_required(view_func):
    """Decorator for kitchen staff access only."""
    @wraps(view_func)
    @role_required(['head_chef', 'sous_chef', 'line_cook'])
    def wrapper(request, *args, **kwargs):
        return view_func(request, *args, **kwargs)
    return wrapper


def foh_staff_required(view_func):
    """Decorator for front-of-house staff access only."""
    @wraps(view_func)
    @role_required(['server', 'host', 'bartender', 'busser'])
    def wrapper(request, *args, **kwargs):
        return view_func(request, *args, **kwargs)
    return wrapper


# ===== VIEW MIXINS =====

class AuthenticationMixin:
    """Base mixin for authentication requirements."""
    permission_classes = [IsAuthenticated]


class RoleRequiredMixin:
    """
    Mixin to require specific roles.
    Set required_roles = ['role1', 'role2'] in your view.
    """
    permission_classes = [HasRole]
    required_roles = []


class PermissionRequiredMixin:
    """
    Mixin to require specific permissions.
    Set required_permissions = ['perm1', 'perm2'] in your view.
    """
    permission_classes = [HasPermission]
    required_permissions = []


class ManagerRequiredMixin(AuthenticationMixin):
    """Mixin for manager-level access."""
    permission_classes = [IsManager]


class SupervisorRequiredMixin(RoleRequiredMixin):
    """Mixin for supervisor level and above."""
    required_roles = ['general_manager', 'shift_supervisor']


class StaffRequiredMixin(AuthenticationMixin):
    """Mixin for any authenticated staff member."""
    pass


class KitchenStaffMixin(AuthenticationMixin):
    """Mixin for kitchen roles only."""
    permission_classes = [IsKitchenStaff]


class FOHStaffMixin(AuthenticationMixin):
    """Mixin for front-of-house roles only."""
    permission_classes = [IsFOHStaff]


# ===== UTILITY FUNCTIONS =====

def check_role_hierarchy(user_role, required_role):
    """
    Check if user role has access based on hierarchy.
    General Manager > Shift Supervisor > Head Chef > other roles
    """
    role_hierarchy = {
        'general_manager': 5,
        'shift_supervisor': 4,
        'head_chef': 3,
        'sous_chef': 2,
        'server': 1,
        'host': 1,
        'bartender': 1,
        'line_cook': 1,
        'busser': 0,
    }
    
    user_level = role_hierarchy.get(user_role, 0)
    required_level = role_hierarchy.get(required_role, 0)
    
    return user_level >= required_level


def get_user_permissions_context(user):
    """
    Get user permissions context for templates/frontend.
    """
    if not user.is_authenticated:
        return {
            'authenticated': False,
            'permissions': [],
            'role': None,
            'is_manager': False,
            'is_kitchen_staff': False,
            'is_foh_staff': False,
        }
    
    try:
        profile = user.profile
        permissions = profile.get_permissions()
        role = profile.current_role
        
        return {
            'authenticated': True,
            'permissions': permissions,
            'role': role,
            'staff_name': profile.staff_profile.name if profile.staff_profile else None,
            'is_manager': role in ['general_manager', 'shift_supervisor'],
            'is_kitchen_staff': role in ['head_chef', 'sous_chef', 'line_cook'],
            'is_foh_staff': role in ['server', 'host', 'bartender', 'busser'],
            'is_locked': profile.is_account_locked,
            'failed_attempts': profile.failed_login_attempts,
        }
    except UserProfile.DoesNotExist:
        return {
            'authenticated': True,
            'permissions': [],
            'role': None,
            'staff_name': None,
            'is_manager': False,
            'is_kitchen_staff': False,
            'is_foh_staff': False,
            'is_locked': False,
            'failed_attempts': 0,
        }