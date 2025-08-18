#!/usr/bin/env python
"""
Create test user accounts for authentication system development and testing.
"""
import os
import django
import sys

# Add the project directory to the Python path
sys.path.append('/app')
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'jiko_backend.settings')
django.setup()

from django.contrib.auth.models import User
from apps.restaurant.models import Staff
from apps.authentication.models import UserProfile


def create_test_users():
    """Create test user accounts with different roles."""
    
    print("Creating test user accounts...")
    
    # Test users data
    test_users = [
        {
            'username': 'admin',
            'email': 'admin@jikomilele.co.ke',
            'password': 'SecurePass123',
            'first_name': 'System',
            'last_name': 'Administrator',
            'staff_name': 'Grace Wanjiku',
            'role': 'general_manager'
        },
        {
            'username': 'chef',
            'email': 'chef@jikomilele.co.ke',
            'password': 'SecurePass123',
            'first_name': 'David',
            'last_name': 'Kimani',
            'staff_name': 'David Kimani',
            'role': 'head_chef'
        },
        {
            'username': 'server1',
            'email': 'server1@jikomilele.co.ke',
            'password': 'SecurePass123',
            'first_name': 'Catherine',
            'last_name': 'Muthoni',
            'staff_name': 'Catherine Muthoni',
            'role': 'server'
        },
        {
            'username': 'host',
            'email': 'host@jikomilele.co.ke',
            'password': 'SecurePass123',
            'first_name': 'Sarah',
            'last_name': 'Njeri',
            'staff_name': 'Sarah Njeri',
            'role': 'host'
        },
        {
            'username': 'bartender',
            'email': 'bartender@jikomilele.co.ke',
            'password': 'SecurePass123',
            'first_name': 'Robert',
            'last_name': 'Kamau',
            'staff_name': 'Robert Kamau',
            'role': 'bartender'
        }
    ]
    
    created_users = []
    
    for user_data in test_users:
        # Check if user already exists
        if User.objects.filter(username=user_data['username']).exists():
            print(f"User '{user_data['username']}' already exists, skipping...")
            continue
            
        # Create User
        user = User.objects.create_user(
            username=user_data['username'],
            email=user_data['email'],
            password=user_data['password'],
            first_name=user_data['first_name'],
            last_name=user_data['last_name']
        )
        
        # Find corresponding staff member
        try:
            staff_member = Staff.objects.get(name=user_data['staff_name'])
        except Staff.DoesNotExist:
            print(f"Staff member '{user_data['staff_name']}' not found for user '{user_data['username']}'")
            staff_member = None
        
        # Create UserProfile
        profile = UserProfile.objects.create(
            user=user,
            staff_profile=staff_member,
            current_role=user_data['role']
        )
        
        created_users.append({
            'username': user.username,
            'email': user.email,
            'role': profile.current_role,
            'staff_name': staff_member.name if staff_member else 'None'
        })
        
        print(f"✅ Created user: {user.username} ({profile.current_role})")
    
    print(f"\n📊 Summary: Created {len(created_users)} test user accounts")
    print("\n🔐 Login Credentials:")
    for user in created_users:
        print(f"  • {user['username']} / SecurePass123 [{user['role']}]")
    
    print("\n🌐 API Endpoints:")
    print("  • POST /api/auth/login/ - Login with username/password")
    print("  • GET /api/auth/profile/ - Get user profile")
    print("  • POST /api/auth/logout/ - Logout")
    print("  • POST /api/auth/refresh/ - Refresh token")
    
    return created_users


if __name__ == '__main__':
    create_test_users()