# Jiko Milele Restaurant ERP - Conceptual Data Model

---

## Data Model Overview

The Jiko Milele ERP data model is designed around core restaurant business entities with strong relationships that support both transactional operations and analytical reporting. The model follows normalized design principles while maintaining performance for real-time operations.

---

## Core Entity Relationship Diagram

```
                               CUSTOMERS
                           ┌─────────────────┐
                           │ customer_id (PK)│
                           │ phone_number    │
                           │ name            │
                           │ email           │
                           │ created_at      │
                           │ loyalty_points  │
                           └─────────────────┘
                                     │
                                     │ 1:M
                                     ▼
                              RESERVATIONS
                           ┌─────────────────┐
                           │reservation_id(PK)│
                           │ customer_id(FK) │
                           │ table_id (FK)   │
                           │ party_size      │
                           │ reservation_time│
                           │ status          │
                           │ special_requests│
                           │ created_at      │
                           └─────────────────┘
                                     │
                   ┌─────────────────┴─────────────────┐
                   │                                   │
                   ▼ M:1                           1:M ▼
                TABLES                              ORDERS
        ┌─────────────────┐                 ┌─────────────────┐
        │ table_id (PK)   │                 │ order_id (PK)   │
        │ table_number    │                 │ table_id (FK)   │
        │ capacity        │                 │ server_id (FK)  │
        │ section         │                 │ customer_id(FK) │
        │ status          │                 │ order_time      │
        │ x_coordinate    │                 │ status          │
        │ y_coordinate    │                 │ total_amount    │
        └─────────────────┘                 │ tax_amount      │
                   │                        │ service_charge  │
                   │                        │ payment_status  │
                   │                        └─────────────────┘
                   │                                  │
                   │                                  │ 1:M
                   │                                  ▼
                   │                          ORDER_ITEMS
                   │                   ┌─────────────────────┐
                   │                   │ order_item_id (PK)  │
                   │                   │ order_id (FK)       │
                   │                   │ menu_item_id (FK)   │
                   │                   │ quantity            │
                   │                   │ unit_price          │
                   │                   │ modifications       │
                   │                   │ special_instructions│
                   │                   │ kitchen_status      │
                   │                   │ completed_at        │
                   │                   └─────────────────────┘
                   │                                  │
                   │                                  │ M:1
                   │                                  ▼
                   │                           MENU_ITEMS
                   │                   ┌─────────────────────┐
                   │                   │ menu_item_id (PK)   │
                   │                   │ name                │
                   │                   │ description         │
                   │                   │ price               │
                   │                   │ category            │
                   │                   │ service_period      │
                   │                   │ is_available        │
                   │                   │ prep_time_minutes   │
                   │                   │ allergens           │
                   │                   │ is_vegetarian       │
                   │                   │ created_at          │
                   │                   └─────────────────────┘
                   │                                  │
                   │                                  │ 1:M
                   │                                  ▼
                   │                           RECIPE_ITEMS
                   │                   ┌─────────────────────┐
                   │                   │ recipe_item_id (PK) │
                   │                   │ menu_item_id (FK)   │
                   │                   │ ingredient_id (FK)  │
                   │                   │ quantity_needed     │
                   │                   │ unit_of_measure     │
                   │                   │ preparation_notes   │
                   │                   └─────────────────────┘
                   │                                  │
                   │                                  │ M:1
                   │                                  ▼
                   │                           INGREDIENTS
                   │                   ┌─────────────────────┐
                   │                   │ ingredient_id (PK)  │
                   │                   │ name                │
                   │                   │ category            │
                   │                   │ unit_of_measure     │
                   │                   │ current_stock       │
                   │                   │ minimum_stock       │
                   │                   │ cost_per_unit       │
                   │                   │ supplier_id (FK)    │
                   │                   │ storage_location    │
                   │                   │ shelf_life_days     │
                   │                   │ last_updated        │
                   │                   └─────────────────────┘
                   │                                  │
                   │                                  │ M:1
                   │                                  ▼
                   │                           SUPPLIERS
                   │                   ┌─────────────────────┐
                   │                   │ supplier_id (PK)    │
                   │                   │ name                │
                   │                   │ contact_person      │
                   │                   │ phone_number        │
                   │                   │ address             │
                   │                   │ payment_terms       │
                   │                   │ delivery_schedule   │
                   │                   │ quality_rating      │
                   │                   │ is_active           │
                   │                   └─────────────────────┘
                   │
                   │
                   ▼ 1:M
                STAFF
        ┌─────────────────┐
        │ staff_id (PK)   │
        │ employee_number │
        │ name            │
        │ role            │
        │ phone_number    │
        │ email           │
        │ hire_date       │
        │ hourly_rate     │
        │ is_active       │
        │ permissions     │
        └─────────────────┘
```

---

## Detailed Entity Specifications

### Customer Management Entities

#### CUSTOMERS
**Purpose:** Store customer information for reservations and loyalty tracking
```sql
customers (
    customer_id         SERIAL PRIMARY KEY,
    phone_number        VARCHAR(20) UNIQUE NOT NULL,
    name               VARCHAR(100),
    email              VARCHAR(100),
    created_at         TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    loyalty_points     INTEGER DEFAULT 0,
    last_visit_date    DATE,
    total_visits       INTEGER DEFAULT 0,
    preferred_table    INTEGER,
    dietary_preferences TEXT,
    notes              TEXT
)
```

**Key Relationships:**
- One customer can have many reservations (1:M)
- One customer can have many orders (1:M)

#### RESERVATIONS
**Purpose:** Manage table reservations and waitlist
```sql
reservations (
    reservation_id      SERIAL PRIMARY KEY,
    customer_id         INTEGER REFERENCES customers(customer_id),
    table_id           INTEGER REFERENCES tables(table_id),
    party_size         INTEGER NOT NULL,
    reservation_time   TIMESTAMP NOT NULL,
    status             VARCHAR(20) DEFAULT 'confirmed',
    special_requests   TEXT,
    created_at         TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at         TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    waitlist_position  INTEGER,
    estimated_wait     INTEGER,
    confirmation_code  VARCHAR(10) UNIQUE
)
```

**Status Values:** 'confirmed', 'seated', 'completed', 'cancelled', 'no_show'

### Restaurant Operations Entities

#### TABLES
**Purpose:** Define restaurant floor plan and table management
```sql
tables (
    table_id           SERIAL PRIMARY KEY,
    table_number       VARCHAR(10) UNIQUE NOT NULL,
    capacity           INTEGER NOT NULL,
    section            VARCHAR(50),
    status             VARCHAR(20) DEFAULT 'available',
    x_coordinate       DECIMAL(5,2),
    y_coordinate       DECIMAL(5,2),
    server_assigned    INTEGER REFERENCES staff(staff_id),
    last_cleaned       TIMESTAMP,
    is_active          BOOLEAN DEFAULT true
)
```

**Status Values:** 'available', 'occupied', 'reserved', 'cleaning', 'out_of_order'

#### ORDERS
**Purpose:** Track customer orders and payments
```sql
orders (
    order_id           SERIAL PRIMARY KEY,
    table_id           INTEGER REFERENCES tables(table_id),
    server_id          INTEGER REFERENCES staff(staff_id),
    customer_id        INTEGER REFERENCES customers(customer_id),
    order_time         TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status             VARCHAR(20) DEFAULT 'open',
    total_amount       DECIMAL(10,2),
    tax_amount         DECIMAL(10,2),
    service_charge     DECIMAL(10,2),
    discount_amount    DECIMAL(10,2),
    payment_status     VARCHAR(20) DEFAULT 'pending',
    payment_method     VARCHAR(20),
    order_type         VARCHAR(20) DEFAULT 'dine_in',
    completed_at       TIMESTAMP,
    notes              TEXT
)
```

**Status Values:** 'open', 'sent_to_kitchen', 'in_progress', 'completed', 'cancelled'
**Payment Status:** 'pending', 'partial', 'paid', 'refunded'
**Order Types:** 'dine_in', 'takeout', 'delivery'

#### ORDER_ITEMS
**Purpose:** Individual items within an order
```sql
order_items (
    order_item_id      SERIAL PRIMARY KEY,
    order_id           INTEGER REFERENCES orders(order_id),
    menu_item_id       INTEGER REFERENCES menu_items(menu_item_id),
    quantity           INTEGER NOT NULL,
    unit_price         DECIMAL(8,2) NOT NULL,
    modifications      TEXT,
    special_instructions TEXT,
    kitchen_status     VARCHAR(20) DEFAULT 'pending',
    fired_at           TIMESTAMP,
    completed_at       TIMESTAMP,
    station_assignment VARCHAR(20)
)
```

**Kitchen Status:** 'pending', 'fired', 'in_progress', 'completed', 'cancelled'
**Station Assignment:** 'grill', 'saute', 'prep', 'bar'

### Menu and Recipe Entities

#### MENU_ITEMS
**Purpose:** Restaurant menu items with pricing and availability
```sql
menu_items (
    menu_item_id       SERIAL PRIMARY KEY,
    name               VARCHAR(100) NOT NULL,
    description        TEXT,
    price              DECIMAL(8,2) NOT NULL,
    category           VARCHAR(50) NOT NULL,
    service_period     VARCHAR(20),
    is_available       BOOLEAN DEFAULT true,
    prep_time_minutes  INTEGER,
    allergens          TEXT,
    is_vegetarian      BOOLEAN DEFAULT false,
    is_gluten_free     BOOLEAN DEFAULT false,
    spice_level        INTEGER DEFAULT 0,
    image_url          VARCHAR(255),
    created_at         TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at         TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)
```

**Categories:** 'appetizer', 'main_course', 'side_dish', 'beverage', 'dessert'
**Service Periods:** 'breakfast', 'lunch', 'dinner', 'all_day'

#### RECIPES
**Purpose:** Recipe definitions and costing
```sql
recipes (
    recipe_id          SERIAL PRIMARY KEY,
    menu_item_id       INTEGER REFERENCES menu_items(menu_item_id),
    version            INTEGER DEFAULT 1,
    serving_size       INTEGER DEFAULT 1,
    prep_instructions  TEXT,
    cooking_instructions TEXT,
    total_cost         DECIMAL(8,2),
    food_cost_percentage DECIMAL(5,2),
    yield_portions     INTEGER,
    created_at         TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_active          BOOLEAN DEFAULT true
)
```

#### RECIPE_ITEMS
**Purpose:** Ingredients required for each recipe
```sql
recipe_items (
    recipe_item_id     SERIAL PRIMARY KEY,
    recipe_id          INTEGER REFERENCES recipes(recipe_id),
    ingredient_id      INTEGER REFERENCES ingredients(ingredient_id),
    quantity_needed    DECIMAL(8,3) NOT NULL,
    unit_of_measure    VARCHAR(20) NOT NULL,
    preparation_notes  TEXT,
    is_optional        BOOLEAN DEFAULT false,
    cost_per_serving   DECIMAL(8,4)
)
```

### Inventory Management Entities

#### INGREDIENTS
**Purpose:** Raw materials and inventory items
```sql
ingredients (
    ingredient_id      SERIAL PRIMARY KEY,
    name               VARCHAR(100) NOT NULL,
    category           VARCHAR(50) NOT NULL,
    unit_of_measure    VARCHAR(20) NOT NULL,
    current_stock      DECIMAL(10,3) DEFAULT 0,
    minimum_stock      DECIMAL(10,3) NOT NULL,
    maximum_stock      DECIMAL(10,3),
    cost_per_unit      DECIMAL(8,4) NOT NULL,
    supplier_id        INTEGER REFERENCES suppliers(supplier_id),
    storage_location   VARCHAR(50),
    shelf_life_days    INTEGER,
    reorder_point      DECIMAL(10,3),
    last_updated       TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_perishable      BOOLEAN DEFAULT false,
    allergen_info      TEXT
)
```

**Categories:** 'protein', 'vegetables', 'grains', 'dairy', 'spices', 'beverages', 'dry_goods'
**Storage Locations:** 'dry_storage', 'walk_in_cooler', 'freezer', 'bar', 'prep_area'

#### SUPPLIERS
**Purpose:** Vendor and supplier information
```sql
suppliers (
    supplier_id        SERIAL PRIMARY KEY,
    name               VARCHAR(100) NOT NULL,
    contact_person     VARCHAR(100),
    phone_number       VARCHAR(20),
    email              VARCHAR(100),
    address            TEXT,
    payment_terms      VARCHAR(50),
    delivery_schedule  VARCHAR(100),
    minimum_order      DECIMAL(10,2),
    delivery_fee       DECIMAL(8,2),
    quality_rating     DECIMAL(3,2) DEFAULT 5.0,
    is_active          BOOLEAN DEFAULT true,
    notes              TEXT,
    created_at         TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)
```

#### PURCHASE_ORDERS
**Purpose:** Track orders placed with suppliers
```sql
purchase_orders (
    purchase_order_id  SERIAL PRIMARY KEY,
    supplier_id        INTEGER REFERENCES suppliers(supplier_id),
    order_date         DATE NOT NULL,
    expected_delivery  DATE,
    actual_delivery    DATE,
    status             VARCHAR(20) DEFAULT 'pending',
    total_amount       DECIMAL(10,2),
    created_by         INTEGER REFERENCES staff(staff_id),
    notes              TEXT,
    invoice_number     VARCHAR(50)
)
```

**Status Values:** 'pending', 'confirmed', 'delivered', 'partial', 'cancelled'

#### PURCHASE_ORDER_ITEMS
**Purpose:** Individual items in purchase orders
```sql
purchase_order_items (
    po_item_id         SERIAL PRIMARY KEY,
    purchase_order_id  INTEGER REFERENCES purchase_orders(purchase_order_id),
    ingredient_id      INTEGER REFERENCES ingredients(ingredient_id),
    quantity_ordered   DECIMAL(10,3) NOT NULL,
    quantity_received  DECIMAL(10,3) DEFAULT 0,
    unit_cost          DECIMAL(8,4) NOT NULL,
    total_cost         DECIMAL(10,2) NOT NULL,
    quality_notes      TEXT
)
```

#### INVENTORY_TRANSACTIONS
**Purpose:** Track all inventory movements
```sql
inventory_transactions (
    transaction_id     SERIAL PRIMARY KEY,
    ingredient_id      INTEGER REFERENCES ingredients(ingredient_id),
    transaction_type   VARCHAR(20) NOT NULL,
    quantity           DECIMAL(10,3) NOT NULL,
    unit_cost          DECIMAL(8,4),
    reference_id       INTEGER,
    reference_type     VARCHAR(20),
    performed_by       INTEGER REFERENCES staff(staff_id),
    transaction_date   TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    notes              TEXT,
    location_from      VARCHAR(50),
    location_to        VARCHAR(50)
)
```

**Transaction Types:** 'purchase', 'sale', 'waste', 'adjustment', 'transfer', 'prep_usage'
**Reference Types:** 'order', 'purchase_order', 'waste_log', 'adjustment', 'prep_batch'

### Staff Management Entities

#### STAFF
**Purpose:** Employee information and role management
```sql
staff (
    staff_id           SERIAL PRIMARY KEY,
    employee_number    VARCHAR(20) UNIQUE NOT NULL,
    name               VARCHAR(100) NOT NULL,
    role               VARCHAR(50) NOT NULL,
    phone_number       VARCHAR(20),
    email              VARCHAR(100),
    hire_date          DATE NOT NULL,
    hourly_rate        DECIMAL(6,2),
    is_active          BOOLEAN DEFAULT true,
    permissions        TEXT,
    emergency_contact  VARCHAR(100),
    emergency_phone    VARCHAR(20),
    national_id        VARCHAR(20),
    bank_account       VARCHAR(50),
    created_at         TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)
```

**Roles:** 'general_manager', 'shift_supervisor', 'head_chef', 'sous_chef', 'line_cook', 'server', 'host', 'bartender', 'busser'

#### SHIFTS
**Purpose:** Staff scheduling and time tracking
```sql
shifts (
    shift_id           SERIAL PRIMARY KEY,
    staff_id           INTEGER REFERENCES staff(staff_id),
    shift_date         DATE NOT NULL,
    start_time         TIME NOT NULL,
    end_time           TIME NOT NULL,
    actual_start       TIMESTAMP,
    actual_end         TIMESTAMP,
    break_minutes      INTEGER DEFAULT 0,
    status             VARCHAR(20) DEFAULT 'scheduled',
    hourly_rate        DECIMAL(6,2),
    total_hours        DECIMAL(4,2),
    total_pay          DECIMAL(8,2),
    notes              TEXT
)
```

**Status Values:** 'scheduled', 'in_progress', 'completed', 'absent', 'cancelled'

### Payment and Financial Entities

#### PAYMENTS
**Purpose:** Track all payment transactions
```sql
payments (
    payment_id         SERIAL PRIMARY KEY,
    order_id           INTEGER REFERENCES orders(order_id),
    payment_method     VARCHAR(20) NOT NULL,
    amount             DECIMAL(10,2) NOT NULL,
    payment_date       TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status             VARCHAR(20) DEFAULT 'completed',
    reference_number   VARCHAR(100),
    mpesa_code         VARCHAR(20),
    processed_by       INTEGER REFERENCES staff(staff_id),
    tip_amount         DECIMAL(8,2) DEFAULT 0,
    change_amount      DECIMAL(8,2) DEFAULT 0,
    notes              TEXT
)
```

**Payment Methods:** 'cash', 'mpesa', 'card', 'bank_transfer'
**Status Values:** 'pending', 'completed', 'failed', 'refunded'

#### DAILY_SALES_SUMMARY
**Purpose:** Daily sales aggregation for reporting
```sql
daily_sales_summary (
    summary_id         SERIAL PRIMARY KEY,
    business_date      DATE NOT NULL UNIQUE,
    total_revenue      DECIMAL(12,2) NOT NULL,
    total_orders       INTEGER NOT NULL,
    total_guests       INTEGER NOT NULL,
    average_ticket     DECIMAL(8,2),
    food_sales         DECIMAL(10,2),
    beverage_sales     DECIMAL(10,2),
    tax_collected      DECIMAL(10,2),
    tips_collected     DECIMAL(10,2),
    cash_sales         DECIMAL(10,2),
    card_sales         DECIMAL(10,2),
    mpesa_sales        DECIMAL(10,2),
    breakfast_revenue  DECIMAL(10,2),
    lunch_revenue      DECIMAL(10,2),
    dinner_revenue     DECIMAL(10,2),
    created_at         TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)
```

---

## Data Warehouse Entities (Analytics)

### Fact Tables

#### SALES_FACT
**Purpose:** Denormalized sales data for analytics
```sql
sales_fact (
    sale_id            SERIAL PRIMARY KEY,
    date_key           INTEGER NOT NULL,
    time_key           INTEGER NOT NULL,
    menu_item_key      INTEGER NOT NULL,
    customer_key       INTEGER,
    staff_key          INTEGER NOT NULL,
    table_key          INTEGER NOT NULL,
    quantity           INTEGER NOT NULL,
    unit_price         DECIMAL(8,2) NOT NULL,
    total_amount       DECIMAL(10,2) NOT NULL,
    food_cost          DECIMAL(8,2),
    gross_profit       DECIMAL(8,2),
    service_period     VARCHAR(20),
    payment_method     VARCHAR(20),
    order_type         VARCHAR(20)
)
```

#### INVENTORY_FACT
**Purpose:** Inventory movements for analytics
```sql
inventory_fact (
    inventory_id       SERIAL PRIMARY KEY,
    date_key           INTEGER NOT NULL,
    ingredient_key     INTEGER NOT NULL,
    supplier_key       INTEGER,
    transaction_type   VARCHAR(20) NOT NULL,
    quantity           DECIMAL(10,3) NOT NULL,
    unit_cost          DECIMAL(8,4),
    total_cost         DECIMAL(10,2),
    stock_level_after  DECIMAL(10,3),
    location           VARCHAR(50)
)
```

### Dimension Tables

#### DATE_DIMENSION
**Purpose:** Time intelligence for analytics
```sql
date_dimension (
    date_key           INTEGER PRIMARY KEY,
    full_date          DATE NOT NULL,
    day_of_week        INTEGER NOT NULL,
    day_name           VARCHAR(10) NOT NULL,
    month              INTEGER NOT NULL,
    month_name         VARCHAR(10) NOT NULL,
    quarter            INTEGER NOT NULL,
    year               INTEGER NOT NULL,
    is_weekend         BOOLEAN NOT NULL,
    is_holiday         BOOLEAN DEFAULT false,
    holiday_name       VARCHAR(50),
    week_of_year       INTEGER NOT NULL
)
```

---

## Key Indexes and Performance Optimization

### Critical Indexes
```sql
-- Order performance indexes
CREATE INDEX idx_orders_table_date ON orders(table_id, order_time);
CREATE INDEX idx_orders_status_date ON orders(status, order_time);
CREATE INDEX idx_order_items_status ON order_items(kitchen_status, fired_at);

-- Inventory performance indexes
CREATE INDEX idx_ingredients_supplier ON ingredients(supplier_id, is_active);
CREATE INDEX idx_inventory_trans_date ON inventory_transactions(transaction_date, ingredient_id);
CREATE INDEX idx_ingredients_stock_level ON ingredients(current_stock, minimum_stock);

-- Reservation performance indexes
CREATE INDEX idx_reservations_time ON reservations(reservation_time, status);
CREATE INDEX idx_reservations_customer ON reservations(customer_id, reservation_time);

-- Analytics indexes
CREATE INDEX idx_sales_fact_date ON sales_fact(date_key, time_key);
CREATE INDEX idx_sales_fact_menu_item ON sales_fact(menu_item_key, date_key);

-- Staff performance indexes
CREATE INDEX idx_shifts_date_staff ON shifts(shift_date, staff_id);
CREATE INDEX idx_staff_role_active ON staff(role, is_active);
```

### Partitioning Strategy
```sql
-- Partition large tables by date for performance
CREATE TABLE inventory_transactions_2025 PARTITION OF inventory_transactions
FOR VALUES FROM ('2025-01-01') TO ('2026-01-01');

CREATE TABLE sales_fact_2025 PARTITION OF sales_fact
FOR VALUES FROM (20250101) TO (20260101);
```

---

## Data Integrity and Business Rules

### Referential Integrity Constraints
```sql
-- Prevent deletion of referenced records
ALTER TABLE orders ADD CONSTRAINT fk_orders_table 
    FOREIGN KEY (table_id) REFERENCES tables(table_id) ON DELETE RESTRICT;

ALTER TABLE order_items ADD CONSTRAINT fk_order_items_order 
    FOREIGN KEY (order_id) REFERENCES orders(order_id) ON DELETE CASCADE;

-- Ensure positive quantities and amounts
ALTER TABLE order_items ADD CONSTRAINT chk_quantity_positive 
    CHECK (quantity > 0);

ALTER TABLE ingredients ADD CONSTRAINT chk_stock_non_negative 
    CHECK (current_stock >= 0);
```

### Triggers for Business Logic
```sql
-- Update order total when items change
CREATE OR REPLACE FUNCTION update_order_total()
RETURNS TRIGGER AS $
BEGIN
    UPDATE orders SET 
        total_amount = (
            SELECT COALESCE(SUM(quantity * unit_price), 0)
            FROM order_items 
            WHERE order_id = COALESCE(NEW.order_id, OLD.order_id)
        ),
        updated_at = CURRENT_TIMESTAMP
    WHERE order_id = COALESCE(NEW.order_id, OLD.order_id);
    RETURN COALESCE(NEW, OLD);
END;
$ LANGUAGE plpgsql;

-- Trigger for automatic inventory deduction
CREATE OR REPLACE FUNCTION deduct_inventory_on_sale()
RETURNS TRIGGER AS $
BEGIN
    INSERT INTO inventory_transactions (
        ingredient_id, transaction_type, quantity, 
        reference_id, reference_type, transaction_date
    )
    SELECT 
        ri.ingredient_id,
        'sale',
        -(ri.quantity_needed * NEW.quantity),
        NEW.order_item_id,
        'order_item',
        CURRENT_TIMESTAMP
    FROM recipe_items ri
    JOIN recipes r ON ri.recipe_id = r.recipe_id
    WHERE r.menu_item_id = NEW.menu_item_id;
    
    RETURN NEW;
END;
$ LANGUAGE plpgsql;
```

### Data Validation Rules
- **Phone Numbers:** Must follow Kenyan format (+254XXXXXXXXX)
- **Email Addresses:** Must be valid email format
- **Stock Levels:** Cannot go negative
- **Prices:** Must be positive decimal values
- **Reservation Times:** Must be in the future for new reservations
- **Table Capacity:** Must match actual seating assignments

---

## Data Security and Privacy

### Sensitive Data Protection
```sql
-- Encrypt sensitive customer data
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Hash customer phone numbers for privacy
CREATE OR REPLACE FUNCTION hash_phone_number(phone VARCHAR)
RETURNS VARCHAR AS $
BEGIN
    RETURN encode(digest(phone, 'sha256'), 'hex');
END;
$ LANGUAGE plpgsql;

-- Row-level security for staff data access
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;

CREATE POLICY customer_access_policy ON customers
    FOR ALL TO restaurant_staff
    USING (true);  -- Customize based on role requirements
```

### Audit Trail Implementation
```sql
-- Audit log table for sensitive operations
CREATE TABLE audit_log (
    log_id             SERIAL PRIMARY KEY,
    table_name         VARCHAR(50) NOT NULL,
    operation          VARCHAR(10) NOT NULL,
    old_values         JSONB,
    new_values         JSONB,
    user_id            INTEGER,
    timestamp          TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ip_address         INET
);

-- Generic audit trigger function
CREATE OR REPLACE FUNCTION audit_trigger_function()
RETURNS TRIGGER AS $
BEGIN
    INSERT INTO audit_log (
        table_name, operation, old_values, new_values, user_id
    ) VALUES (
        TG_TABLE_NAME,
        TG_OP,
        CASE WHEN TG_OP = 'DELETE' THEN to_jsonb(OLD) ELSE NULL END,
        CASE WHEN TG_OP = 'INSERT' OR TG_OP = 'UPDATE' THEN to_jsonb(NEW) ELSE NULL END,
        current_setting('app.current_user_id', true)::INTEGER
    );
    RETURN COALESCE(NEW, OLD);
END;
$ LANGUAGE plpgsql;
```

This comprehensive data model provides the foundation for all restaurant operations while ensuring data integrity, performance, and scalability for Jiko Milele's growth.