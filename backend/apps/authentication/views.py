"""
Authentication views with JWT token handling and security features.
"""
from rest_framework import status, permissions
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.token_blacklist.models import OutstandingToken, BlacklistedToken
from rest_framework_simplejwt.exceptions import TokenError, InvalidToken
from django.contrib.auth.models import User
from django.utils import timezone
from django.contrib.auth import get_user_model
from .models import UserProfile, AuthenticationLog
from .serializers import (
    LoginSerializer, 
    UserSerializer, 
    TokenRefreshSerializer,
    LogoutSerializer,
    ChangePasswordSerializer
)


def get_client_ip(request):
    """Get client IP address from request."""
    x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
    if x_forwarded_for:
        ip = x_forwarded_for.split(',')[0]
    else:
        ip = request.META.get('REMOTE_ADDR')
    return ip


def get_client_user_agent(request):
    """Get client user agent from request."""
    return request.META.get('HTTP_USER_AGENT', '')


def log_authentication_event(user, action, request, success=True, details='', username_attempted=''):
    """Log authentication events for security monitoring."""
    AuthenticationLog.objects.create(
        user=user if success else None,
        username_attempted=username_attempted if not success else '',
        action=action,
        ip_address=get_client_ip(request),
        user_agent=get_client_user_agent(request),
        success=success,
        details=details
    )


class LoginView(APIView):
    """
    JWT Login endpoint with comprehensive security features.
    """
    permission_classes = [permissions.AllowAny]
    
    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        
        if serializer.is_valid():
            user = serializer.validated_data['user']
            
            try:
                # Get or create user profile
                profile, created = UserProfile.objects.get_or_create(user=user)
                
                # Check account lock status
                if profile.is_account_locked:
                    log_authentication_event(
                        user, 'login_failed', request, success=False,
                        details='Account is locked'
                    )
                    return Response({
                        'error': f'Account is locked until {profile.account_locked_until}. Contact administrator.'
                    }, status=status.HTTP_423_LOCKED)
                
                # Update profile with login info
                profile.last_login_ip = get_client_ip(request)
                profile.reset_failed_attempts()  # Reset on successful login
                
                # Set current role from staff profile if available
                if profile.staff_profile:
                    profile.current_role = profile.staff_profile.role
                
                profile.save()
                
                # Generate tokens
                refresh = RefreshToken.for_user(user)
                access_token = refresh.access_token
                
                # Serialize user data
                user_serializer = UserSerializer(user)
                
                # Log successful login
                log_authentication_event(
                    user, 'login_success', request, success=True,
                    details=f'Role: {profile.current_role or "No role assigned"}'
                )
                
                return Response({
                    'access_token': str(access_token),
                    'refresh_token': str(refresh),
                    'user': user_serializer.data,
                    'permissions': profile.get_permissions(),
                    'message': 'Login successful'
                })
                
            except Exception as e:
                log_authentication_event(
                    user, 'login_failed', request, success=False,
                    details=f'System error: {str(e)}'
                )
                return Response({
                    'error': 'An error occurred during login. Please try again.'
                }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
        else:
            # Log failed login attempt
            username = request.data.get('username', '')
            log_authentication_event(
                None, 'login_failed', request, success=False,
                details='Invalid credentials',
                username_attempted=username
            )
            
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class TokenRefreshView(APIView):
    """
    Refresh JWT access token.
    """
    permission_classes = [permissions.AllowAny]
    
    def post(self, request):
        serializer = TokenRefreshSerializer(data=request.data)
        
        if serializer.is_valid():
            try:
                refresh_token = RefreshToken(serializer.validated_data['refresh'])
                new_access_token = refresh_token.access_token
                
                # If token rotation is enabled, get new refresh token
                if hasattr(refresh_token, 'set_jti'):
                    refresh_token.set_jti()
                    refresh_token.set_exp()
                
                # Log token refresh
                user_id = refresh_token.payload.get('user_id')
                if user_id:
                    try:
                        user = User.objects.get(id=user_id)
                        log_authentication_event(
                            user, 'token_refresh', request, success=True
                        )
                    except User.DoesNotExist:
                        pass
                
                response_data = {
                    'access_token': str(new_access_token),
                }
                
                # Return new refresh token if rotation is enabled
                if hasattr(refresh_token, 'token'):
                    response_data['refresh_token'] = str(refresh_token)
                
                return Response(response_data)
                
            except TokenError as e:
                return Response({
                    'error': 'Invalid or expired refresh token'
                }, status=status.HTTP_401_UNAUTHORIZED)
            except Exception as e:
                return Response({
                    'error': 'An error occurred while refreshing token'
                }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class LogoutView(APIView):
    """
    Logout and blacklist refresh token.
    """
    permission_classes = [permissions.IsAuthenticated]
    
    def post(self, request):
        serializer = LogoutSerializer(data=request.data)
        
        if serializer.is_valid():
            try:
                refresh_token = RefreshToken(serializer.validated_data['refresh'])
                refresh_token.blacklist()
                
                # Log logout
                log_authentication_event(
                    request.user, 'logout', request, success=True
                )
                
                return Response({
                    'message': 'Successfully logged out'
                })
                
            except TokenError as e:
                return Response({
                    'error': 'Invalid refresh token'
                }, status=status.HTTP_400_BAD_REQUEST)
            except Exception as e:
                return Response({
                    'error': 'An error occurred during logout'
                }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class ProfileView(APIView):
    """
    Get current user profile information.
    """
    permission_classes = [permissions.IsAuthenticated]
    
    def get(self, request):
        """Get current user profile."""
        serializer = UserSerializer(request.user)
        return Response(serializer.data)
    
    def patch(self, request):
        """Update current user profile."""
        serializer = UserSerializer(request.user, data=request.data, partial=True)
        
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class ChangePasswordView(APIView):
    """
    Change user password.
    """
    permission_classes = [permissions.IsAuthenticated]
    
    def post(self, request):
        serializer = ChangePasswordSerializer(data=request.data, context={'request': request})
        
        if serializer.is_valid():
            # Set new password
            request.user.set_password(serializer.validated_data['new_password'])
            request.user.save()
            
            # Log password change
            log_authentication_event(
                request.user, 'password_changed', request, success=True
            )
            
            # Blacklist all existing tokens for this user
            outstanding_tokens = OutstandingToken.objects.filter(user=request.user)
            for token in outstanding_tokens:
                try:
                    BlacklistedToken.objects.get_or_create(token=token)
                except:
                    pass
            
            return Response({
                'message': 'Password changed successfully. Please log in again.'
            })
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def check_authentication(request):
    """
    Simple endpoint to check if user is authenticated and get basic info.
    """
    try:
        profile = request.user.profile
        return Response({
            'authenticated': True,
            'user_id': request.user.id,
            'username': request.user.username,
            'email': request.user.email,
            'current_role': profile.current_role,
            'permissions': profile.get_permissions(),
            'staff_name': profile.staff_profile.name if profile.staff_profile else None
        })
    except UserProfile.DoesNotExist:
        # Create profile if it doesn't exist
        profile = UserProfile.objects.create(user=request.user)
        return Response({
            'authenticated': True,
            'user_id': request.user.id,
            'username': request.user.username,
            'email': request.user.email,
            'current_role': None,
            'permissions': [],
            'staff_name': None
        })


@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def unlock_user_account(request):
    """
    Admin endpoint to unlock user accounts (General Manager only).
    """
    # Check if user has admin permissions
    try:
        profile = request.user.profile
        if 'admin' not in profile.get_permissions():
            return Response({
                'error': 'Permission denied. Admin access required.'
            }, status=status.HTTP_403_FORBIDDEN)
    except UserProfile.DoesNotExist:
        return Response({
            'error': 'User profile not found.'
        }, status=status.HTTP_404_NOT_FOUND)
    
    user_id = request.data.get('user_id')
    if not user_id:
        return Response({
            'error': 'user_id is required.'
        }, status=status.HTTP_400_BAD_REQUEST)
    
    try:
        user = User.objects.get(id=user_id)
        profile = user.profile
        
        if profile.is_account_locked:
            profile.unlock_account()
            
            # Log account unlock
            log_authentication_event(
                user, 'account_unlocked', request, success=True,
                details=f'Unlocked by admin: {request.user.username}'
            )
            
            return Response({
                'message': f'Account for {user.username} has been unlocked.'
            })
        else:
            return Response({
                'message': f'Account for {user.username} is not locked.'
            })
            
    except User.DoesNotExist:
        return Response({
            'error': 'User not found.'
        }, status=status.HTTP_404_NOT_FOUND)
    except UserProfile.DoesNotExist:
        return Response({
            'error': 'User profile not found.'
        }, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({
            'error': 'An error occurred while unlocking account.'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
