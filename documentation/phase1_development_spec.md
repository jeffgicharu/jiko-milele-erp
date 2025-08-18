# Jiko Milele Restaurant ERP - Phase 1 Development Specification

## Overview
This document provides clear, plain-English instructions for Claude Code to build the foundation of the Jiko Milele Restaurant ERP system. Phase 1 focuses on setting up the core infrastructure, database, and basic authentication system.

---

## Project Setup Requirements

### Technology Stack
- **Backend**: Django 5.0 with Django REST Framework
- **Frontend**: Next.js 15 with TypeScript and Tailwind CSS
- **Database**: PostgreSQL (use Docker container for development)
- **Cache/Queue**: Redis (use Docker container for development)
- **Development Environment**: Docker Compose for all services

### Project Structure
Create a monorepo with the following structure:
```
jiko-milele-erp/
├── backend/               # Django REST API
├── frontend/             # Next.js application  
├── docker-compose.yml    # Development environment
├── README.md            # Setup instructions
└── .env.example         # Environment variables template
```

---

## Task 1: Development Environment Setup

### What Claude Code Needs to Do:
1. **Initialize the Django Backend**
   - Create a new Django project called "jiko_backend"
   - Install and configure Django REST Framework
   - Set up PostgreSQL as the database backend
   - Configure Redis for caching and sessions
   - Create proper settings for development/production environments
   - Set up CORS to allow frontend connections

2. **Initialize the Next.js Frontend**
   - Create a new Next.js 15 project with TypeScript
   - Install and configure Tailwind CSS
   - Set up the basic folder structure for components, pages, and utilities
   - Configure environment variables for API connections

3. **Create Docker Development Environment**
   - Write a docker-compose.yml file that includes:
     - PostgreSQL database container
     - Redis container
     - Django backend service (with hot reload)
     - Next.js frontend service (with hot reload)
   - Ensure all services can communicate with each other
   - Create volume mappings for persistent data

4. **Environment Configuration**
   - Create .env.example files with all necessary environment variables
   - Set up proper secret key management
   - Configure database connection strings
   - Set up CORS and security settings

### Expected Outcome:
A developer should be able to run `docker-compose up` and have a fully working development environment with Django backend running on one port and Next.js frontend on another.

---

## Task 2: Database Schema Implementation

### What Claude Code Needs to Do:
1. **Create Django Models**
   Based on our data model specification, create Django models for these core entities:
   
   - **Customer** model with fields: phone_number, name, email, created_at, loyalty_points, last_visit_date, total_visits, dietary_preferences, notes
   
   - **Table** model with fields: table_number, capacity, section, status, x_coordinate, y_coordinate, is_active
   
   - **Staff** model with fields: employee_number, name, role, phone_number, email, hire_date, hourly_rate, is_active, permissions, emergency_contact, emergency_phone
   
   - **Supplier** model with fields: name, contact_person, phone_number, email, address, payment_terms, delivery_schedule, quality_rating, is_active, notes
   
   - **Ingredient** model with fields: name, category, unit_of_measure, current_stock, minimum_stock, cost_per_unit, supplier (foreign key), storage_location, shelf_life_days, is_perishable

2. **Set Up Model Relationships**
   - Configure proper foreign key relationships between models
   - Add appropriate indexes for performance
   - Set up model validation rules (positive numbers, required fields, etc.)

3. **Create Database Migrations**
   - Generate initial Django migrations for all models
   - Include proper constraints and indexes in migrations
   - Add some sample data fixtures for development

4. **Model Admin Interface**
   - Register all models with Django Admin
   - Create user-friendly admin interfaces for each model
   - Add search, filtering, and list display options

### Expected Outcome:
A working Django backend with database models that match our specification, accessible through Django Admin interface with sample data.

---

## Task 3: Basic Authentication System

### What Claude Code Needs to Do:
1. **JWT Authentication Setup**
   - Install and configure Django Simple JWT
   - Create custom user model or extend Django's User model to include restaurant roles
   - Set up JWT token authentication for API endpoints
   - Configure token refresh and expiration settings

2. **Role-Based Access Control**
   - Create user roles: general_manager, shift_supervisor, head_chef, sous_chef, line_cook, server, host, bartender, busser
   - Implement permission groups for each role
   - Create decorators or mixins for role-based API access

3. **User Management APIs**
   - Create API endpoints for user registration (admin only)
   - Create login/logout endpoints with JWT token generation
   - Create user profile endpoints (view/update own profile)
   - Create user management endpoints for managers (list users, assign roles, deactivate users)

4. **Frontend Authentication**
   - Create login page with form validation
   - Set up JWT token storage and management in the frontend
   - Create authentication context/hooks for managing user state
   - Implement automatic token refresh
   - Create protected route wrapper for authenticated pages

### Expected Outcome:
Working authentication system where users can log in and receive proper access based on their role.

---

## Task 4: Basic API Gateway Structure

### What Claude Code Needs to Do:
1. **Django URL Configuration**
   - Set up proper URL routing structure for the API
   - Create versioned API endpoints (e.g., /api/v1/)
   - Organize URLs by functionality (auth, tables, menu, etc.)

2. **API Documentation**
   - Install and configure Django REST Framework's built-in documentation
   - Set up Swagger/OpenAPI documentation
   - Ensure all endpoints are properly documented with descriptions

3. **Basic API Endpoints**
   Create these essential API endpoints:
   - `GET /api/v1/tables/` - List all tables
   - `POST /api/v1/tables/` - Create new table
   - `PUT /api/v1/tables/{id}/` - Update table details
   - `GET /api/v1/staff/` - List staff members
   - `GET /api/v1/customers/` - List customers
   - `POST /api/v1/customers/` - Create new customer

4. **API Response Standards**
   - Set up consistent JSON response format
   - Implement proper HTTP status codes
   - Create error handling and validation responses
   - Add pagination for list endpoints

### Expected Outcome:
Well-organized API structure with basic CRUD operations and proper documentation.

---

## Task 5: Basic Frontend Structure

### What Claude Code Needs to Do:
1. **Layout and Navigation**
   - Create a main layout component with navigation sidebar
   - Design responsive navigation for different screen sizes
   - Create route structure for different sections (Tables, Staff, Customers, etc.)
   - Implement role-based navigation (show different menu items based on user role)

2. **Basic Dashboard Pages**
   - Create a main dashboard page with placeholder widgets
   - Create basic table management page (list tables, show status)
   - Create staff management page (list staff members)
   - Create customer management page (list customers)

3. **Reusable Components**
   - Create basic UI components: Button, Input, Table, Modal, Card
   - Set up a consistent design system with Tailwind
   - Create form components with validation
   - Create loading states and error handling components

4. **API Integration**
   - Set up Axios or fetch for API communication
   - Create API service functions for backend communication
   - Implement error handling for API calls
   - Create hooks for data fetching and state management

### Expected Outcome:
A functional frontend application with basic pages, navigation, and API integration.

---

## Task 6: Development Tools and Quality

### What Claude Code Needs to Do:
1. **Code Quality Tools**
   - Set up Python linting (flake8 or black) for Django backend
   - Set up ESLint and Prettier for Next.js frontend
   - Create pre-commit hooks for code formatting
   - Set up basic unit test structure for both backend and frontend

2. **Development Scripts**
   - Create package.json scripts for common development tasks
   - Create Django management commands for common tasks (create superuser, load sample data)
   - Set up database seeding with sample data
   - Create backup and restore scripts for development data

3. **Documentation**
   - Create comprehensive README with setup instructions
   - Document the API endpoints and how to use them
   - Create developer guidelines for code style and practices
   - Document the database schema and model relationships

### Expected Outcome:
A professional development environment with proper tooling and documentation.

---

## Success Criteria for Phase 1

When Phase 1 is complete, the following should be working:

✅ **Development Environment**: `docker-compose up` starts all services  
✅ **Database**: All models created and accessible via Django Admin  
✅ **Authentication**: Users can log in and access role-appropriate features  
✅ **API**: Basic CRUD operations work for core entities  
✅ **Frontend**: Responsive web application with working navigation  
✅ **Integration**: Frontend successfully communicates with backend API  
✅ **Documentation**: Clear setup and usage instructions  

---

## Important Notes for Claude Code

1. **Follow Django Best Practices**: Use proper model design, URL patterns, and view structure
2. **Security First**: Implement proper authentication and input validation
3. **Mobile-Friendly**: Ensure frontend works well on tablets (will be used by servers)
4. **Kenyan Context**: Use appropriate phone number formats and consider M-PESA integration points
5. **Performance**: Add database indexes and optimize queries from the start
6. **Error Handling**: Implement comprehensive error handling and user feedback

This specification gives Claude Code clear direction while allowing it to make technical implementation decisions. Each task has a clear "what" without prescribing the "how."