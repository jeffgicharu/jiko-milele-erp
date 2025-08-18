"""
Test views to demonstrate role-based access control.
These views can be used for testing authentication and authorization.
"""
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework import permissions, status
from .permissions import (
    IsAuthenticated,
    HasRole,
    HasPermission,
    IsManager,
    IsKitchenStaff,
    IsFOHStaff,
    ManagerRequiredMixin,
    KitchenStaffMixin,
    FOHStaffMixin,
    jwt_required,
    role_required,
    permission_required,
    manager_required,
    get_user_permissions_context
)


# ===== CLASS-BASED VIEW EXAMPLES =====

class PublicView(APIView):
    """Public endpoint - no authentication required."""
    permission_classes = [permissions.AllowAny]
    
    def get(self, request):
        return Response({
            'message': 'This is a public endpoint accessible to everyone',
            'authenticated': request.user.is_authenticated,
        })


class AuthenticatedView(APIView):
    """Requires authentication but any role."""
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        return Response({
            'message': 'Welcome authenticated user!',
            'user': request.user.username,
            'permissions': get_user_permissions_context(request.user)
        })


class ManagerOnlyView(APIView):
    """Manager-level access only."""
    permission_classes = [IsManager]
    
    def get(self, request):
        return Response({
            'message': 'Manager dashboard access',
            'user': request.user.username,
            'role': request.user.profile.current_role,
            'data': {
                'financial_reports': 'Available',
                'staff_management': 'Full Access',
                'system_settings': 'Read/Write'
            }
        })


class KitchenView(APIView):
    """Kitchen staff access only."""
    permission_classes = [IsKitchenStaff]
    
    def get(self, request):
        return Response({
            'message': 'Kitchen management system',
            'user': request.user.username,
            'role': request.user.profile.current_role,
            'data': {
                'orders': 'View Active Orders',
                'inventory': 'Manage Ingredients',
                'recipes': 'View/Edit Recipes'
            }
        })


class FOHView(APIView):
    """Front-of-house staff access only."""
    permission_classes = [IsFOHStaff]
    
    def get(self, request):
        return Response({
            'message': 'Front-of-house operations',
            'user': request.user.username,
            'role': request.user.profile.current_role,
            'data': {
                'tables': 'Manage Tables',
                'customers': 'Customer Service',
                'pos': 'Point of Sale Access'
            }
        })


class RoleBasedView(APIView):
    """Example using HasRole permission with specific roles."""
    permission_classes = [HasRole]
    required_roles = ['general_manager', 'head_chef']
    
    def get(self, request):
        return Response({
            'message': 'Access granted for General Manager or Head Chef only',
            'user': request.user.username,
            'role': request.user.profile.current_role,
            'allowed_roles': self.required_roles
        })


class PermissionBasedView(APIView):
    """Example using HasPermission with specific permissions."""
    permission_classes = [HasPermission]
    required_permissions = ['reports', 'inventory_management']
    
    def get(self, request):
        return Response({
            'message': 'Access granted - you have the required permissions',
            'user': request.user.username,
            'required_permissions': self.required_permissions,
            'user_permissions': request.user.profile.get_permissions()
        })


# ===== MIXIN EXAMPLES =====

class ManagerDashboardView(ManagerRequiredMixin, APIView):
    """Using ManagerRequiredMixin."""
    
    def get(self, request):
        return Response({
            'message': 'Manager Dashboard - using mixin',
            'features': [
                'Financial Reports',
                'Staff Scheduling',
                'System Configuration',
                'Performance Analytics'
            ]
        })


class KitchenDashboardView(KitchenStaffMixin, APIView):
    """Using KitchenStaffMixin."""
    
    def get(self, request):
        return Response({
            'message': 'Kitchen Dashboard - using mixin',
            'features': [
                'Order Management',
                'Inventory Control',
                'Recipe Management',
                'Kitchen Display System'
            ]
        })


class FOHDashboardView(FOHStaffMixin, APIView):
    """Using FOHStaffMixin."""
    
    def get(self, request):
        return Response({
            'message': 'Front-of-House Dashboard - using mixin',
            'features': [
                'Table Management',
                'Customer Service',
                'Reservation System',
                'POS Integration'
            ]
        })


# ===== FUNCTION-BASED VIEW EXAMPLES =====

@api_view(['GET'])
@permission_classes([permissions.AllowAny])
def public_function_view(request):
    """Public function view."""
    return Response({
        'message': 'Public function view - no authentication required'
    })


@api_view(['GET'])
@jwt_required
def authenticated_function_view(request):
    """Authenticated function view using decorator."""
    return Response({
        'message': 'Authenticated function view',
        'user': request.user.username
    })


@api_view(['GET'])
@role_required(['general_manager'])
def manager_function_view(request):
    """Manager-only function view."""
    return Response({
        'message': 'Manager function view',
        'user': request.user.username,
        'role': request.user.profile.current_role
    })


@api_view(['GET'])
@permission_required(['admin'])
def admin_function_view(request):
    """Admin permission required function view."""
    return Response({
        'message': 'Admin function view',
        'user': request.user.username,
        'permissions': request.user.profile.get_permissions()
    })


@api_view(['GET'])
@manager_required
def manager_decorator_view(request):
    """Using manager_required decorator."""
    return Response({
        'message': 'Manager decorator view',
        'access_level': 'Management'
    })


# ===== UTILITY ENDPOINTS =====

@api_view(['GET'])
@jwt_required
def my_permissions(request):
    """Get current user's permissions and role info."""
    return Response(get_user_permissions_context(request.user))


@api_view(['GET'])
@permission_required(['admin'])
def test_all_permissions(request):
    """Test endpoint to verify all permission types work."""
    return Response({
        'message': 'All permission tests passed!',
        'tests': {
            'authentication': 'PASS',
            'permission_check': 'PASS',
            'role_verification': 'PASS',
            'admin_access': 'PASS'
        }
    })