"""
Authentication URLs for JWT-based authentication system.
"""
from django.urls import path, include
from .views import (
    LoginView,
    TokenRefreshView,
    LogoutView,
    ProfileView,
    ChangePasswordView,
    check_authentication,
    unlock_user_account
)
from .test_views import (
    PublicView,
    AuthenticatedView,
    ManagerOnlyView,
    KitchenView,
    FOHView,
    RoleBasedView,
    PermissionBasedView,
    ManagerDashboardView,
    KitchenDashboardView,
    FOHDashboardView,
    public_function_view,
    authenticated_function_view,
    manager_function_view,
    admin_function_view,
    manager_decorator_view,
    my_permissions,
    test_all_permissions
)

app_name = 'authentication'

urlpatterns = [
    # Authentication endpoints
    path('login/', LoginView.as_view(), name='login'),
    path('refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('logout/', LogoutView.as_view(), name='logout'),
    
    # User profile endpoints
    path('profile/', ProfileView.as_view(), name='profile'),
    path('change-password/', ChangePasswordView.as_view(), name='change_password'),
    
    # Utility endpoints
    path('check/', check_authentication, name='check_authentication'),
    path('unlock-account/', unlock_user_account, name='unlock_account'),
    
    # Test endpoints for role-based access control
    path('test/public/', PublicView.as_view(), name='test_public'),
    path('test/authenticated/', AuthenticatedView.as_view(), name='test_authenticated'),
    path('test/manager/', ManagerOnlyView.as_view(), name='test_manager'),
    path('test/kitchen/', KitchenView.as_view(), name='test_kitchen'),
    path('test/foh/', FOHView.as_view(), name='test_foh'),
    path('test/roles/', RoleBasedView.as_view(), name='test_roles'),
    path('test/permissions/', PermissionBasedView.as_view(), name='test_permissions'),
    path('test/manager-dashboard/', ManagerDashboardView.as_view(), name='test_manager_dashboard'),
    path('test/kitchen-dashboard/', KitchenDashboardView.as_view(), name='test_kitchen_dashboard'),
    path('test/foh-dashboard/', FOHDashboardView.as_view(), name='test_foh_dashboard'),
    
    # Function-based test views
    path('test/public-func/', public_function_view, name='test_public_func'),
    path('test/auth-func/', authenticated_function_view, name='test_auth_func'),
    path('test/manager-func/', manager_function_view, name='test_manager_func'),
    path('test/admin-func/', admin_function_view, name='test_admin_func'),
    path('test/manager-decorator/', manager_decorator_view, name='test_manager_decorator'),
    
    # Utility test endpoints
    path('test/my-permissions/', my_permissions, name='my_permissions'),
    path('test/all-permissions/', test_all_permissions, name='test_all_permissions'),
]