# Task 3: Authentication System Implementation - Detailed Specification

## Overview
Implement a comprehensive authentication system with JWT tokens and role-based access control. This system will secure all API endpoints and provide the foundation for user management throughout the restaurant ERP system.

---

## Part 1: JWT Authentication Setup

### Django Backend Authentication

#### Required Packages
Install and configure these packages:
- `djangorestframework-simplejwt` - JWT token handling
- `django-cors-headers` - Cross-origin resource sharing for frontend

#### JWT Configuration
Configure JWT settings in Django settings:
- **Access token lifetime**: 1 hour
- **Refresh token lifetime**: 7 days  
- **Token rotation**: Enable refresh token rotation for security
- **Blacklist**: Enable token blacklisting for logout functionality
- **Algorithm**: Use RS256 for production-ready security

#### Custom User Model Extension
Extend Django's built-in User model to include restaurant-specific fields:
- `staff_profile` (OneToOneField to Staff model) - Link to staff record
- `current_role` (CharField) - Active role for this session
- `last_login_ip` (GenericIPAddressField) - Security tracking
- `failed_login_attempts` (PositiveIntegerField, default=0) - Brute force protection
- `account_locked_until` (DateTimeField, null=True) - Temporary lockout

#### Authentication Views
Create these authentication endpoints:

**POST /api/v1/auth/login/**
- Accept: username/email and password
- Validate credentials against Staff model
- Return: access_token, refresh_token, user_profile, permissions
- Include: role information and last_login timestamp
- Handle: account lockout after 5 failed attempts (15-minute lockout)

**POST /api/v1/auth/refresh/**
- Accept: refresh_token
- Return: new access_token and refresh_token (if rotation enabled)
- Validate: token is not blacklisted

**POST /api/v1/auth/logout/**
- Accept: refresh_token
- Action: Blacklist the refresh token
- Return: success confirmation

**GET /api/v1/auth/profile/**
- Require: Valid JWT token
- Return: Current user profile with role and permissions
- Include: staff details from linked Staff model

---

## Part 2: Role-Based Access Control System

### Permission Groups and Roles
Create Django permission groups for each restaurant role:

#### General Manager Permissions
- Full access to all modules
- User management (create, modify, deactivate staff accounts)
- System administration (backup, settings, reports)
- Financial data access (sales, costs, profits)
- Override capabilities for all operations

#### Shift Supervisor Permissions  
- Operational oversight during assigned shifts
- Staff scheduling and break management
- Discount and comp approval (up to defined limits)
- Table management and customer service resolution
- Real-time performance monitoring
- Limited financial reporting (shift-level only)

#### Head Chef Permissions
- Complete kitchen management
- Menu and recipe management
- Inventory management and purchasing
- Supplier relationship management
- Food cost analysis and reporting
- Staff scheduling for kitchen personnel

#### Sous Chef Permissions
- Kitchen operations during assigned shifts
- Recipe and prep management
- Inventory receiving and basic adjustments
- Kitchen staff coordination
- Food cost tracking (view only)

#### Line Cook Permissions
- Kitchen display system access
- Order preparation and completion
- Basic inventory usage recording
- Shift-specific kitchen operations

#### Server Permissions
- POS system access for order entry
- Table management for assigned section
- Customer profile access (view/create)
- Payment processing
- Basic reporting (own sales only)

#### Host Permissions
- Reservation management system
- Table assignment and waitlist management
- Customer check-in and seating
- Basic customer profile management

#### Bartender Permissions
- POS system for beverage orders
- Bar inventory management
- Payment processing for bar sales
- Bar-specific reporting

#### Busser Permissions
- Basic table status updates
- Cleaning completion recording
- Limited POS access (table clearing only)

### Role Assignment System
Create management interface for role assignment:
- Only General Managers can assign roles
- Staff can have multiple roles but one active role per shift
- Role changes require manager approval and are logged
- Emergency role elevation procedures for supervisors

---

## Part 3: API Security Implementation

### Authentication Decorators and Mixins
Create reusable authentication components:

#### @jwt_required Decorator
- Validate JWT token in request headers
- Extract user information and add to request context
- Return 401 Unauthorized for invalid/missing tokens

#### @role_required(roles) Decorator  
- Verify user has one of the specified roles
- Return 403 Forbidden for insufficient permissions
- Support role hierarchies (managers can access supervisor functions)

#### Permission Mixins for Class-Based Views
- `ManagerRequiredMixin` - General Manager access only
- `SupervisorRequiredMixin` - Supervisor level and above
- `StaffRequiredMixin` - Any authenticated staff member
- `KitchenStaffMixin` - Kitchen roles only
- `FOHStaffMixin` - Front-of-house roles only

### API Endpoint Protection
Secure these endpoint categories:

#### Public Endpoints (No Authentication)
- Login, password reset requests
- Basic restaurant information (hours, contact)

#### Staff-Level Endpoints (Any Authenticated User)
- User profile viewing and basic updates
- Shift schedule viewing
- Basic operational data access

#### Supervisor-Level Endpoints
- Real-time operational monitoring
- Staff performance during shifts
- Customer service resolution tools

#### Manager-Level Endpoints
- Financial reporting and analytics
- Staff management and scheduling
- System configuration and settings

#### Kitchen-Specific Endpoints
- Kitchen display system
- Recipe and inventory management
- Food preparation tracking

#### FOH-Specific Endpoints  
- Table and reservation management
- Customer service tools
- POS system access

---

## Part 4: Frontend Authentication Implementation

### Authentication Context and State Management
Create React context for managing authentication state:

#### AuthContext Features
- Current user state (profile, role, permissions)
- Authentication status (loading, authenticated, unauthenticated)
- Login/logout functions
- Token management (storage, refresh, expiration)
- Role-based component rendering

#### JWT Token Management
- Store tokens securely (httpOnly cookies preferred, or localStorage with XSS protection)
- Automatic token refresh before expiration
- Clear tokens on logout or expiration
- Redirect to login on authentication failure

### Authentication Components

#### Login Page (/login)
Create comprehensive login interface:
- Username/email and password fields with validation
- "Remember me" option for extended sessions
- Password visibility toggle
- Loading states during authentication
- Error handling for invalid credentials
- Account lockout notifications
- Forgot password link (placeholder for future implementation)

#### Route Protection
Implement protected route wrapper:
- `<ProtectedRoute>` component for authenticated access
- Role-based route protection with permission checking
- Automatic redirect to login for unauthenticated users
- Redirect to appropriate dashboard based on user role
- Loading states while checking authentication

#### Navigation and UI Updates
Update navigation based on user role:
- Role-appropriate menu items and sections
- Hide/show features based on permissions
- User profile display with current role
- Logout functionality with confirmation
- Visual indicators for user authentication status

### API Integration
Set up frontend API communication:

#### Axios Configuration
- Automatic JWT token inclusion in request headers
- Request interceptors for token attachment
- Response interceptors for token refresh handling
- Error handling for authentication failures
- Automatic logout on persistent authentication errors

#### API Service Functions
Create authentication-related API calls:
- `login(credentials)` - User authentication
- `logout()` - Token invalidation
- `refreshToken()` - Token renewal
- `getCurrentUser()` - Profile information
- `updateProfile(data)` - Profile updates

---

## Part 5: Security Features and Best Practices

### Security Measures
Implement comprehensive security features:

#### Password Security
- Minimum password requirements (8+ characters, mixed case, numbers)
- Password hashing using Django's built-in PBKDF2
- Password change enforcement for default passwords
- Password history to prevent reuse

#### Session Security
- Secure token storage and transmission
- Token expiration and automatic refresh
- Session invalidation on suspicious activity
- IP address tracking for security monitoring

#### Brute Force Protection
- Account lockout after failed login attempts
- Progressive lockout timing (15 min, 1 hour, 24 hours)
- Admin notification for repeated lockout attempts
- CAPTCHA integration for high-risk scenarios

#### Audit Logging
- Log all authentication events (login, logout, failed attempts)
- Track permission changes and role assignments
- Monitor suspicious activity patterns
- Secure log storage with integrity protection

### Development and Testing Features

#### Test User Accounts
Create sample accounts for development:
- Manager account: admin@jikomilele.com / SecurePass123
- Head Chef account: chef@jikomilele.com / SecurePass123  
- Server account: server1@jikomilele.com / SecurePass123
- Host account: host@jikomilele.com / SecurePass123

#### Development Tools
- Authentication state debugging in development
- Permission testing interface for developers
- Token inspection and validation tools
- Authentication flow logging and monitoring

---

## Part 6: User Management Interface

### Admin User Management
Create Django admin interfaces for user management:

#### User Administration
- Create new staff accounts with role assignment
- Modify existing user permissions and roles
- Deactivate/reactivate user accounts
- Reset passwords and unlock accounts
- View authentication logs and security events

#### Role Management
- Assign and modify user roles
- Create custom permission combinations
- View role-based access patterns
- Monitor permission usage and compliance

### Frontend User Management (Manager Only)
Create web interface for user management:
- Staff account creation with role selection
- User status monitoring (active, locked, expired)
- Role assignment and permission management
- Password reset initiation for staff
- Authentication activity monitoring

---

## Success Criteria

After completing Task 3, verify these outcomes:

✅ **JWT Authentication**
- Users can log in and receive valid JWT tokens
- Token refresh works automatically
- Logout properly invalidates tokens
- Failed login attempts are tracked and limited

✅ **Role-Based Access Control**
- Different roles see appropriate menu items
- API endpoints properly enforce permissions
- Role assignments work correctly
- Permission inheritance functions as designed

✅ **Frontend Integration**
- Login page works with proper validation
- Protected routes redirect appropriately
- User state persists across page refreshes
- Navigation updates based on user role

✅ **Security Features**
- Account lockout prevents brute force attacks
- Tokens are securely stored and transmitted
- Audit logging captures authentication events
- Password requirements are enforced

✅ **User Management**
- Managers can create and modify user accounts
- Role assignments are properly saved and applied
- User profiles display correct information
- Authentication status is clearly indicated

✅ **API Security**
- All sensitive endpoints require authentication
- Role-based access control works on API calls
- Error responses don't leak sensitive information
- Token validation is consistent across endpoints

This authentication system will provide the security foundation for all restaurant operations while maintaining usability for daily staff workflows.