# Task 4: API Gateway Structure Implementation - Detailed Specification

## Overview
Build a well-organized, versioned API structure with comprehensive documentation and essential CRUD operations for core restaurant entities. This API foundation will support all future modules and provide consistent, reliable data access patterns.

---

## Part 1: Django URL Structure and Organization

### API Versioning Strategy
Implement a clean URL structure that supports future API evolution:

#### Base URL Structure
```
/api/v1/auth/          # Authentication endpoints
/api/v1/tables/        # Table management
/api/v1/staff/         # Staff management  
/api/v1/customers/     # Customer management
/api/v1/suppliers/     # Supplier management
/api/v1/inventory/     # Inventory and ingredients
/api/v1/system/        # System information and health
```

#### URL Configuration Organization
Structure Django URLs in a maintainable hierarchy:
- **Main `urls.py`**: Include versioned API routes
- **`api/urls.py`**: Route to version-specific URLs
- **`api/v1/urls.py`**: Include all v1 module URLs
- **Module-specific URL files**: Separate URLs for each business domain

### URL Naming Conventions
Follow RESTful conventions with consistent patterns:
- **Collections**: `/api/v1/tables/` (GET for list, POST for create)
- **Individual Resources**: `/api/v1/tables/{id}/` (GET, PUT, PATCH, DELETE)
- **Nested Resources**: `/api/v1/tables/{id}/reservations/`
- **Actions**: `/api/v1/tables/{id}/seat-guest/` (POST for custom actions)

---

## Part 2: API Documentation Setup

### Django REST Framework Documentation
Configure comprehensive API documentation:

#### Swagger/OpenAPI Integration
- Install and configure `drf-spectacular` for OpenAPI 3.0 support
- Generate interactive API documentation at `/api/docs/`
- Include authentication examples and token usage
- Provide sample request/response payloads

#### Documentation Standards
Ensure every endpoint includes:
- **Clear descriptions** of purpose and functionality
- **Parameter documentation** with types and validation rules
- **Response schemas** with example data
- **Error responses** with status codes and messages
- **Authentication requirements** and permission levels

#### API Versioning Documentation
- Document version differences and migration paths
- Deprecation notices for future version changes
- Backward compatibility guidelines
- Breaking change notifications

---

## Part 3: Core API Endpoints Implementation

### Tables API Endpoints

#### GET /api/v1/tables/
**Purpose**: Retrieve list of all restaurant tables with current status
**Authentication**: Staff-level access required
**Response**: Paginated list of tables with status, capacity, and assignment info
```json
{
  "count": 10,
  "next": null,
  "previous": null,
  "results": [
    {
      "id": 1,
      "table_number": "T1",
      "capacity": 4,
      "section": "Main Dining",
      "status": "available",
      "x_coordinate": "10.50",
      "y_coordinate": "15.25",
      "is_active": true
    }
  ]
}
```

#### POST /api/v1/tables/
**Purpose**: Create new table (Manager-only)
**Authentication**: Manager or Supervisor access required
**Request Body**: Table details (number, capacity, section, coordinates)
**Response**: Created table object with assigned ID

#### GET /api/v1/tables/{id}/
**Purpose**: Retrieve specific table details
**Authentication**: Staff-level access required
**Response**: Complete table information including current assignment

#### PUT /api/v1/tables/{id}/
**Purpose**: Update table information (Manager-only)
**Authentication**: Manager access required
**Request Body**: Updated table details
**Response**: Updated table object

#### PATCH /api/v1/tables/{id}/status/
**Purpose**: Update table status (available, occupied, cleaning, etc.)
**Authentication**: Host, Server, or Supervisor access required
**Request Body**: `{"status": "occupied", "notes": "Party of 4 seated"}`
**Response**: Updated table with new status and timestamp

### Staff API Endpoints

#### GET /api/v1/staff/
**Purpose**: Retrieve list of restaurant staff members
**Authentication**: Supervisor-level access required
**Filtering**: Support filtering by role, active status, and shift
**Response**: Paginated list of staff with basic information
```json
{
  "count": 25,
  "results": [
    {
      "id": 1,
      "employee_number": "EMP001",
      "name": "John Kivuti",
      "role": "server",
      "phone_number": "+254712345678",
      "is_active": true,
      "hire_date": "2024-01-15"
    }
  ]
}
```

#### POST /api/v1/staff/
**Purpose**: Create new staff member (Manager-only)
**Authentication**: Manager access required
**Request Body**: Staff details including role assignment
**Response**: Created staff object with employee number

#### GET /api/v1/staff/{id}/
**Purpose**: Retrieve specific staff member details
**Authentication**: Self-access or Supervisor-level required
**Response**: Complete staff information (restricted based on requester role)

#### PUT /api/v1/staff/{id}/
**Purpose**: Update staff member information
**Authentication**: Self-access for basic info, Manager for role changes
**Request Body**: Updated staff details
**Response**: Updated staff object

#### PATCH /api/v1/staff/{id}/status/
**Purpose**: Activate/deactivate staff member
**Authentication**: Manager access required
**Request Body**: `{"is_active": false, "reason": "Resigned"}`
**Response**: Updated staff status

### Customers API Endpoints

#### GET /api/v1/customers/
**Purpose**: Retrieve customer list for reservations and service
**Authentication**: Host, Server, or Manager access required
**Filtering**: Search by phone number, name, or visit frequency
**Response**: Paginated customer list with visit statistics
```json
{
  "count": 150,
  "results": [
    {
      "id": 1,
      "phone_number": "+254701234567",
      "name": "Grace Wanjiku",
      "total_visits": 12,
      "loyalty_points": 240,
      "last_visit_date": "2024-12-15",
      "dietary_preferences": "Vegetarian"
    }
  ]
}
```

#### POST /api/v1/customers/
**Purpose**: Create new customer record
**Authentication**: Host or Server access required
**Request Body**: Customer information (phone required, name optional)
**Response**: Created customer object

#### GET /api/v1/customers/{id}/
**Purpose**: Retrieve specific customer details and history
**Authentication**: Staff-level access required
**Response**: Complete customer profile with visit history

#### PUT /api/v1/customers/{id}/
**Purpose**: Update customer information
**Authentication**: Staff-level access required
**Request Body**: Updated customer details
**Response**: Updated customer object

#### GET /api/v1/customers/search/
**Purpose**: Search customers by phone number or name
**Authentication**: Staff-level access required
**Query Parameters**: `?phone=+254701234567` or `?name=Grace`
**Response**: Matching customer records

### Suppliers API Endpoints

#### GET /api/v1/suppliers/
**Purpose**: Retrieve supplier list for procurement management
**Authentication**: Kitchen staff or Manager access required
**Filtering**: Filter by active status, category, or quality rating
**Response**: Paginated supplier list with contact and performance info
```json
{
  "count": 8,
  "results": [
    {
      "id": 1,
      "name": "Thika Fresh Market",
      "contact_person": "Samuel Mwangi",
      "phone_number": "+254722123456",
      "quality_rating": "4.5",
      "is_active": true,
      "delivery_schedule": "Monday, Wednesday, Friday"
    }
  ]
}
```

#### POST /api/v1/suppliers/
**Purpose**: Add new supplier (Head Chef or Manager only)
**Authentication**: Head Chef or Manager access required
**Request Body**: Supplier details and contact information
**Response**: Created supplier object

#### GET /api/v1/suppliers/{id}/
**Purpose**: Retrieve specific supplier details and performance history
**Authentication**: Kitchen staff or Manager access required
**Response**: Complete supplier information

#### PUT /api/v1/suppliers/{id}/
**Purpose**: Update supplier information and ratings
**Authentication**: Head Chef or Manager access required
**Request Body**: Updated supplier details
**Response**: Updated supplier object

### Inventory API Endpoints

#### GET /api/v1/inventory/ingredients/
**Purpose**: Retrieve ingredient inventory with current stock levels
**Authentication**: Kitchen staff access required
**Filtering**: Filter by category, storage location, or stock level
**Response**: Paginated ingredient list with stock information
```json
{
  "count": 45,
  "results": [
    {
      "id": 1,
      "name": "Sukuma Wiki",
      "category": "vegetables",
      "current_stock": "5.500",
      "minimum_stock": "2.000",
      "unit_of_measure": "kg",
      "cost_per_unit": "80.0000",
      "supplier": "Thika Fresh Market",
      "storage_location": "walk_in_cooler",
      "is_perishable": true
    }
  ]
}
```

#### POST /api/v1/inventory/ingredients/
**Purpose**: Add new ingredient to inventory
**Authentication**: Head Chef or Manager access required
**Request Body**: Ingredient details with supplier assignment
**Response**: Created ingredient object

#### GET /api/v1/inventory/ingredients/{id}/
**Purpose**: Retrieve specific ingredient details and stock history
**Authentication**: Kitchen staff access required
**Response**: Complete ingredient information

#### PATCH /api/v1/inventory/ingredients/{id}/stock/
**Purpose**: Update ingredient stock levels
**Authentication**: Kitchen staff access required
**Request Body**: `{"current_stock": "3.200", "reason": "Daily count adjustment"}`
**Response**: Updated ingredient with new stock level

#### GET /api/v1/inventory/low-stock/
**Purpose**: Retrieve ingredients below minimum stock levels
**Authentication**: Kitchen staff access required
**Response**: List of ingredients needing reorder

---

## Part 4: API Response Standards and Error Handling

### Standardized Response Format
Implement consistent response structure across all endpoints:

#### Success Responses
```json
{
  "success": true,
  "data": { /* response data */ },
  "message": "Operation completed successfully",
  "timestamp": "2024-12-16T10:30:00Z"
}
```

#### Error Responses
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input data",
    "details": {
      "phone_number": ["This field is required"]
    }
  },
  "timestamp": "2024-12-16T10:30:00Z"
}
```

### HTTP Status Code Standards
Use appropriate HTTP status codes:
- **200 OK**: Successful GET, PUT, PATCH requests
- **201 Created**: Successful POST requests
- **204 No Content**: Successful DELETE requests
- **400 Bad Request**: Invalid input data or parameters
- **401 Unauthorized**: Missing or invalid authentication
- **403 Forbidden**: Insufficient permissions for operation
- **404 Not Found**: Resource does not exist
- **409 Conflict**: Resource conflicts (duplicate phone numbers)
- **422 Unprocessable Entity**: Validation errors
- **500 Internal Server Error**: Server-side errors

### Input Validation and Sanitization
Implement comprehensive input validation:
- **Phone Number Validation**: Kenyan format (+254XXXXXXXXX)
- **Email Validation**: Proper email format where applicable
- **Numeric Validation**: Positive numbers for costs, quantities, ratings
- **Text Sanitization**: Prevent XSS attacks in text fields
- **File Upload Validation**: Size and type restrictions for images

---

## Part 5: Pagination and Filtering

### Pagination Implementation
Use Django REST Framework's pagination for all list endpoints:
- **Page Size**: Default 20 items per page, configurable up to 100
- **Page Numbers**: Use page-number pagination for simplicity
- **Response Format**: Include count, next, previous, and results

### Filtering and Search
Implement filtering capabilities for list endpoints:

#### Tables Filtering
- Filter by status: `?status=available`
- Filter by section: `?section=Main Dining`
- Filter by capacity: `?capacity_min=4&capacity_max=6`

#### Staff Filtering  
- Filter by role: `?role=server`
- Filter by active status: `?is_active=true`
- Search by name: `?search=John`

#### Customers Filtering
- Search by phone: `?phone=254701234567`
- Search by name: `?search=Grace`
- Filter by visit frequency: `?min_visits=5`

#### Inventory Filtering
- Filter by category: `?category=vegetables`
- Filter by storage location: `?storage_location=walk_in_cooler`
- Filter low stock: `?low_stock=true`

---

## Part 6: Performance Optimization

### Database Query Optimization
Implement efficient database queries:
- **Select Related**: Use `select_related()` for foreign key relationships
- **Prefetch Related**: Use `prefetch_related()` for many-to-many relationships
- **Only/Defer**: Load only necessary fields for list views
- **Database Indexes**: Ensure proper indexing on filtered fields

### Caching Strategy
Implement caching for frequently accessed data:
- **Redis Caching**: Cache frequently accessed lookup data
- **Query Caching**: Cache expensive database queries
- **Cache Invalidation**: Clear cache when related data changes
- **API Response Caching**: Cache stable endpoint responses

### Rate Limiting
Implement rate limiting to prevent abuse:
- **Per-User Limits**: 1000 requests per hour per authenticated user
- **Anonymous Limits**: 100 requests per hour per IP address
- **Endpoint-Specific Limits**: Lower limits for expensive operations
- **Burst Protection**: Allow short bursts while maintaining hourly limits

---

## Part 7: API Testing and Validation

### Automated Testing
Create comprehensive test coverage:
- **Unit Tests**: Test individual API endpoints and business logic
- **Integration Tests**: Test API endpoints with database interactions
- **Authentication Tests**: Verify permission and role-based access
- **Performance Tests**: Ensure acceptable response times

### Manual Testing Tools
Provide tools for manual API testing:
- **Postman Collection**: Pre-configured API requests for all endpoints
- **Test Data Scripts**: Generate realistic test data for API testing
- **Authentication Examples**: Sample requests with proper token usage

### API Health Monitoring
Implement monitoring and health checks:
- **Health Check Endpoint**: `/api/v1/system/health/` for system status
- **Database Connectivity**: Verify database connection and response time
- **External Dependencies**: Check connections to Redis and other services
- **Performance Metrics**: Track response times and error rates

---

## Success Criteria

After completing Task 4, verify these outcomes:

✅ **URL Structure and Organization**
- Clean, RESTful URL patterns for all endpoints
- Proper versioning strategy implemented
- Logical organization of URL configurations

✅ **API Documentation**
- Interactive Swagger documentation accessible at `/api/docs/`
- All endpoints properly documented with examples
- Authentication requirements clearly specified

✅ **Core CRUD Operations**
- All table management operations working
- Staff management with proper role restrictions
- Customer creation and lookup functionality
- Supplier management for kitchen operations
- Basic inventory operations with stock tracking

✅ **Response Standards**
- Consistent JSON response format across all endpoints
- Proper HTTP status codes for all scenarios
- Comprehensive error handling and validation

✅ **Security and Permissions**
- All endpoints properly protected with authentication
- Role-based access control working correctly
- Input validation preventing security vulnerabilities

✅ **Performance and Usability**
- Pagination working on all list endpoints
- Filtering and search functionality operational
- Response times under 200ms for simple queries
- Proper database query optimization

✅ **Testing and Monitoring**
- Basic test coverage for all endpoints
- Health check endpoint operational
- API documentation reflects actual implementation

This API foundation will support all future restaurant management features while maintaining performance, security, and usability standards.