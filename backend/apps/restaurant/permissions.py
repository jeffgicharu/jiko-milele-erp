"""
Custom permissions for restaurant API endpoints based on user roles.
"""
from rest_framework import permissions
from apps.authentication.models import UserProfile


class IsManagerOrReadOnly(permissions.BasePermission):
    """
    Allow managers full access, other authenticated users read-only access.
    """
    
    def has_permission(self, request, view):
        if not request.user or not request.user.is_authenticated:
            return False
        
        # Read permissions for any authenticated user
        if request.method in permissions.SAFE_METHODS:
            return True
        
        # Write permissions only for managers
        try:
            profile = request.user.profile
            return profile.current_role in ['general_manager', 'shift_supervisor']
        except UserProfile.DoesNotExist:
            return False


class IsManagerOnly(permissions.BasePermission):
    """
    Allow only managers (general_manager, shift_supervisor) to access.
    """
    
    def has_permission(self, request, view):
        if not request.user or not request.user.is_authenticated:
            return False
        
        try:
            profile = request.user.profile
            return profile.current_role in ['general_manager', 'shift_supervisor']
        except UserProfile.DoesNotExist:
            return False


class IsKitchenStaffOrManager(permissions.BasePermission):
    """
    Allow kitchen staff and managers to access kitchen-related endpoints.
    """
    
    def has_permission(self, request, view):
        if not request.user or not request.user.is_authenticated:
            return False
        
        try:
            profile = request.user.profile
            kitchen_roles = ['general_manager', 'shift_supervisor', 'head_chef', 'sous_chef', 'line_cook']
            return profile.current_role in kitchen_roles
        except UserProfile.DoesNotExist:
            return False


class IsFOHStaffOrManager(permissions.BasePermission):
    """
    Allow front-of-house staff and managers to access FOH endpoints.
    """
    
    def has_permission(self, request, view):
        if not request.user or not request.user.is_authenticated:
            return False
        
        try:
            profile = request.user.profile
            foh_roles = ['general_manager', 'shift_supervisor', 'server', 'host', 'bartender', 'busser']
            return profile.current_role in foh_roles
        except UserProfile.DoesNotExist:
            return False


class CanModifyTableStatus(permissions.BasePermission):
    """
    Allow staff who can modify table status (host, server, supervisor, manager).
    """
    
    def has_permission(self, request, view):
        if not request.user or not request.user.is_authenticated:
            return False
        
        # Read permissions for any authenticated user
        if request.method in permissions.SAFE_METHODS:
            return True
        
        try:
            profile = request.user.profile
            allowed_roles = ['general_manager', 'shift_supervisor', 'host', 'server']
            return profile.current_role in allowed_roles
        except UserProfile.DoesNotExist:
            return False


class CanAccessCustomerData(permissions.BasePermission):
    """
    Allow staff who work with customers (FOH staff and managers).
    """
    
    def has_permission(self, request, view):
        if not request.user or not request.user.is_authenticated:
            return False
        
        try:
            profile = request.user.profile
            customer_facing_roles = [
                'general_manager', 'shift_supervisor', 'server', 'host', 'bartender'
            ]
            return profile.current_role in customer_facing_roles
        except UserProfile.DoesNotExist:
            return False


class IsStaffMemberOrManager(permissions.BasePermission):
    """
    Allow staff members to view their own data, managers to view all.
    """
    
    def has_permission(self, request, view):
        if not request.user or not request.user.is_authenticated:
            return False
        
        # Managers can access all staff data
        try:
            profile = request.user.profile
            if profile.current_role in ['general_manager', 'shift_supervisor']:
                return True
        except UserProfile.DoesNotExist:
            pass
        
        # Allow authenticated users (they can view their own data in object-level permission)
        return True
    
    def has_object_permission(self, request, view, obj):
        """
        Allow staff members to access their own records, managers to access all.
        """
        try:
            profile = request.user.profile
            
            # Managers can access any staff record
            if profile.current_role in ['general_manager', 'shift_supervisor']:
                return True
            
            # Staff can access their own record if linked via UserProfile
            if profile.staff_profile and profile.staff_profile.id == obj.id:
                return True
            
        except UserProfile.DoesNotExist:
            pass
        
        return False


class CanManageInventory(permissions.BasePermission):
    """
    Allow kitchen staff and managers to manage inventory.
    """
    
    def has_permission(self, request, view):
        if not request.user or not request.user.is_authenticated:
            return False
        
        try:
            profile = request.user.profile
            inventory_roles = ['general_manager', 'head_chef', 'sous_chef', 'line_cook']
            return profile.current_role in inventory_roles
        except UserProfile.DoesNotExist:
            return False


class CanUpdateStock(permissions.BasePermission):
    """
    Allow kitchen staff to update stock levels.
    """
    
    def has_permission(self, request, view):
        if not request.user or not request.user.is_authenticated:
            return False
        
        try:
            profile = request.user.profile
            stock_roles = ['general_manager', 'head_chef', 'sous_chef', 'line_cook']
            return profile.current_role in stock_roles
        except UserProfile.DoesNotExist:
            return False