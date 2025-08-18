# Task 2: Database Schema Implementation - Detailed Specification

## Overview
Implement the core operational database models that will serve as the foundation for all restaurant management features. These models represent the essential entities needed for table management, staff operations, customer service, and basic inventory tracking.

---

## Models to Implement

### 1. Customer Model
**Purpose:** Store guest information for reservations, loyalty tracking, and personalized service

**Required Fields:**
- `phone_number` (CharField, unique, max_length=20, required) - Primary identifier for customers
- `name` (CharField, max_length=100, optional) - Customer name for personalized service
- `email` (EmailField, optional) - For digital receipts and marketing
- `created_at` (DateTimeField, auto_now_add=True) - Account creation timestamp
- `loyalty_points` (IntegerField, default=0) - Points accumulated through visits
- `last_visit_date` (DateField, null=True, blank=True) - Most recent visit tracking
- `total_visits` (IntegerField, default=0) - Lifetime visit counter
- `dietary_preferences` (TextField, blank=True) - Allergies, vegetarian, etc.
- `notes` (TextField, blank=True) - Staff notes about customer preferences

**Validation Rules:**
- Phone number must follow Kenyan format: +254XXXXXXXXX
- Loyalty points must be non-negative
- Email format validation when provided

**Django Admin Configuration:**
- List display: phone_number, name, total_visits, last_visit_date, loyalty_points
- Search fields: phone_number, name, email
- List filter: last_visit_date, total_visits
- Ordering: -last_visit_date (most recent visitors first)

---

### 2. Table Model
**Purpose:** Define restaurant floor plan, table capacity, and real-time status tracking

**Required Fields:**
- `table_number` (CharField, unique, max_length=10, required) - Display identifier (e.g., "T1", "BAR2")
- `capacity` (PositiveIntegerField, required) - Number of seats at table
- `section` (CharField, max_length=50, blank=True) - Area designation (e.g., "Main Dining", "Bar Area")
- `status` (CharField, max_length=20, choices=STATUS_CHOICES, default="available")
- `x_coordinate` (DecimalField, max_digits=5, decimal_places=2, null=True, blank=True)
- `y_coordinate` (DecimalField, max_digits=5, decimal_places=2, null=True, blank=True)
- `is_active` (BooleanField, default=True) - For temporarily disabling tables

**Status Choices:**
- "available" - Ready for new guests
- "occupied" - Currently has guests
- "reserved" - Held for upcoming reservation
- "cleaning" - Being cleaned/reset
- "out_of_order" - Temporarily unavailable

**Validation Rules:**
- Table numbers must be unique
- Capacity must be positive integer (1-12 typical range)
- Coordinates are for future drag-and-drop floor plan interface

**Django Admin Configuration:**
- List display: table_number, capacity, section, status, is_active
- Search fields: table_number, section
- List filter: status, section, capacity, is_active
- Ordering: table_number

---

### 3. Staff Model
**Purpose:** Employee management, role assignment, and authentication foundation

**Required Fields:**
- `employee_number` (CharField, unique, max_length=20, required) - Unique staff identifier
- `name` (CharField, max_length=100, required) - Full employee name
- `role` (CharField, max_length=50, choices=ROLE_CHOICES, required) - Job position
- `phone_number` (CharField, max_length=20, required) - Contact information
- `email` (EmailField, blank=True) - Optional email contact
- `hire_date` (DateField, required) - Employment start date
- `hourly_rate` (DecimalField, max_digits=6, decimal_places=2, null=True, blank=True)
- `is_active` (BooleanField, default=True) - Current employment status
- `permissions` (TextField, blank=True) - JSON storage for custom permissions
- `emergency_contact` (CharField, max_length=100, blank=True) - Emergency contact name
- `emergency_phone` (CharField, max_length=20, blank=True) - Emergency contact number

**Role Choices:**
- "general_manager" - Full system access
- "shift_supervisor" - Operational oversight
- "head_chef" - Kitchen management
- "sous_chef" - Assistant kitchen management
- "line_cook" - Food preparation
- "server" - Guest service
- "host" - Guest seating and reservations
- "bartender" - Beverage service
- "busser" - Table cleaning and support

**Validation Rules:**
- Employee numbers must be unique
- Phone numbers should validate Kenyan format (+254XXXXXXXXX)
- Hourly rate must be positive if provided
- Hire date cannot be in the future

**Django Admin Configuration:**
- List display: employee_number, name, role, phone_number, is_active, hire_date
- Search fields: employee_number, name, phone_number
- List filter: role, is_active, hire_date
- Ordering: name

---

### 4. Supplier Model
**Purpose:** Vendor relationship management for inventory procurement

**Required Fields:**
- `name` (CharField, max_length=100, required) - Supplier business name
- `contact_person` (CharField, max_length=100, blank=True) - Primary contact name
- `phone_number` (CharField, max_length=20, required) - Primary contact number
- `email` (EmailField, blank=True) - Email contact
- `address` (TextField, blank=True) - Physical address
- `payment_terms` (CharField, max_length=50, blank=True) - e.g., "Net 30", "Cash on Delivery"
- `delivery_schedule` (CharField, max_length=100, blank=True) - e.g., "Monday/Wednesday/Friday"
- `minimum_order` (DecimalField, max_digits=10, decimal_places=2, null=True, blank=True)
- `delivery_fee` (DecimalField, max_digits=8, decimal_places=2, null=True, blank=True)
- `quality_rating` (DecimalField, max_digits=3, decimal_places=2, default=5.0) - 1.0 to 5.0 scale
- `is_active` (BooleanField, default=True) - Current vendor status
- `notes` (TextField, blank=True) - Additional supplier information
- `created_at` (DateTimeField, auto_now_add=True)

**Validation Rules:**
- Supplier names should be unique
- Quality rating must be between 1.0 and 5.0
- Minimum order and delivery fee must be positive if provided
- Phone number required for communication

**Django Admin Configuration:**
- List display: name, contact_person, phone_number, quality_rating, is_active
- Search fields: name, contact_person, phone_number
- List filter: is_active, quality_rating, payment_terms
- Ordering: name

---

### 5. Ingredient Model
**Purpose:** Inventory tracking for all food and beverage items

**Required Fields:**
- `name` (CharField, max_length=100, required) - Ingredient name
- `category` (CharField, max_length=50, choices=CATEGORY_CHOICES, required)
- `unit_of_measure` (CharField, max_length=20, choices=UOM_CHOICES, required)
- `current_stock` (DecimalField, max_digits=10, decimal_places=3, default=0)
- `minimum_stock` (DecimalField, max_digits=10, decimal_places=3, required) - Reorder point
- `maximum_stock` (DecimalField, max_digits=10, decimal_places=3, null=True, blank=True)
- `cost_per_unit` (DecimalField, max_digits=8, decimal_places=4, required)
- `supplier` (ForeignKey to Supplier, on_delete=CASCADE) - Primary supplier
- `storage_location` (CharField, max_length=50, choices=STORAGE_CHOICES)
- `shelf_life_days` (PositiveIntegerField, null=True, blank=True) - For perishables
- `reorder_point` (DecimalField, max_digits=10, decimal_places=3, null=True, blank=True)
- `is_perishable` (BooleanField, default=False)
- `allergen_info` (TextField, blank=True) - Allergen warnings
- `last_updated` (DateTimeField, auto_now=True)

**Category Choices:**
- "protein" - Meat, fish, eggs
- "vegetables" - Fresh produce
- "grains" - Rice, flour, pasta
- "dairy" - Milk, cheese, butter
- "spices" - Seasonings and spices
- "beverages" - Drinks and liquids
- "dry_goods" - Non-perishable staples

**Unit of Measure Choices:**
- "kg" - Kilograms
- "grams" - Grams
- "liters" - Liters
- "ml" - Milliliters
- "pieces" - Individual items
- "cases" - Case quantities

**Storage Location Choices:**
- "dry_storage" - Dry goods storage
- "walk_in_cooler" - Refrigerated storage
- "freezer" - Frozen storage
- "bar" - Bar inventory area
- "prep_area" - Kitchen prep area

**Validation Rules:**
- Current stock cannot be negative
- Minimum stock must be positive
- Cost per unit must be positive
- Maximum stock must be greater than minimum stock if provided
- Shelf life only makes sense for perishables

**Django Admin Configuration:**
- List display: name, category, current_stock, minimum_stock, cost_per_unit, supplier, is_perishable
- Search fields: name, category
- List filter: category, storage_location, is_perishable, supplier
- Ordering: name

---

## Database Indexes and Performance

### Required Indexes
Create these indexes for optimal query performance:

```python
# Customer indexes
Customer.phone_number (unique=True, db_index=True)

# Table indexes  
Table.table_number (unique=True, db_index=True)
Table.status (db_index=True)

# Staff indexes
Staff.employee_number (unique=True, db_index=True)  
Staff.role (db_index=True)
Staff.is_active (db_index=True)

# Ingredient indexes
Ingredient.category (db_index=True)
Ingredient.current_stock (db_index=True)
Ingredient.minimum_stock (db_index=True)
Ingredient.supplier (db_index=True)

# Supplier indexes
Supplier.is_active (db_index=True)
```

---

## Sample Data Fixtures

Create realistic sample data for development and testing:

### Sample Tables (8-10 tables)
- T1, T2, T3, T4 (4-person tables in Main Dining)
- T5, T6 (6-person tables in Main Dining)  
- T7, T8 (2-person tables in Main Dining)
- BAR1, BAR2 (bar seating for 3 people each)

### Sample Staff (5-6 employees)
- 1 General Manager
- 1 Head Chef  
- 2 Servers
- 1 Host
- 1 Bartender

### Sample Suppliers (3-4 vendors)
- "Thika Fresh Market" - vegetables and fruits
- "Kikuyu Meat Suppliers" - proteins
- "Nakumatt Wholesale" - dry goods
- "Tusker Distributors" - beverages

### Sample Ingredients (15-20 items)
Cover all categories with realistic Kenyan ingredients:
- Proteins: beef, goat meat, chicken, tilapia
- Vegetables: sukuma wiki, tomatoes, onions, dhania
- Grains: maize meal (ugali), rice, wheat flour
- Dairy: milk, cooking oil
- Spices: salt, black pepper, cumin, ginger
- Beverages: Tusker beer, sodas, bottled water

### Sample Customers (2-3 customers)
- Regular customer with loyalty points
- New customer with dietary preferences
- VIP customer with notes

---

## Validation and Error Handling

### Custom Validators
Create custom validators for:
- Kenyan phone number format validation
- Positive number validation for financial fields
- Stock level logical validation (current ≤ maximum, minimum > 0)

### Model Clean Methods
Implement model.clean() methods for:
- Cross-field validation (e.g., maximum_stock > minimum_stock)
- Business rule enforcement
- Data consistency checks

---

## Success Criteria

After completing Task 2, verify these outcomes:

✅ **Database Structure**
- All 5 models created with proper field types
- Foreign key relationships working correctly
- Database migrations applied successfully

✅ **Django Admin Interface**
- All models registered and accessible
- Proper list displays, search, and filtering
- Sample data visible and editable

✅ **Data Validation**
- Field validation working (try invalid phone numbers, negative numbers)
- Unique constraints enforced
- Required field validation working

✅ **Sample Data**
- Realistic test data loaded for all models
- Relationships properly connected (ingredients linked to suppliers)
- Data reflects Kenyan restaurant context

✅ **Performance**
- Database queries execute quickly
- Proper indexes created
- Admin interface responsive

This foundation will support all future restaurant management features including order processing, inventory management, staff scheduling, and business analytics.