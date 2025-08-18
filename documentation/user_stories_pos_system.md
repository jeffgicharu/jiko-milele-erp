# Point of Sale (POS) System
## User Stories & Functional Requirements

---

## Module Overview
The Point of Sale (POS) System is the operational heart of Jiko Milele, handling all order entry, payment processing, and real-time communication with the kitchen and bar. This system must seamlessly support three distinct service periods with varying menus while maintaining integration with table management and inventory systems.

---

## User Roles
- **Server** - Primary order entry and guest service
- **Bartender** - Beverage order management and preparation
- **Shift Supervisor** - Order modifications, discounts, and problem resolution
- **General Manager** - Sales analytics, menu management, and system administration
- **Busser** - Basic table status updates

---

## Server User Stories

### Order Entry & Management

**US-P001: Access Table from Reservation System**
- **As a** Server
- **I want to** select my assigned table from the POS and see guest information
- **So that I** can provide personalized service and start the order process
- **Acceptance Criteria:**
  - Table selection shows party size, seating time, and special requests from reservation
  - Guest name display for personalized greeting
  - Integration with table management system status
  - Clear indication of new table assignment vs. returning to existing order

**US-P002: Navigate Time-Based Menu Structure**
- **As a** Server
- **I want to** automatically see the correct menu (breakfast/lunch/dinner) based on current time
- **So that I** can efficiently take orders without confusion about available items
- **Acceptance Criteria:**
  - Automatic menu switching at 11 AM (breakfast→lunch) and 5 PM (lunch→dinner)
  - Clear visual indication of current service period
  - Ability to manually override for late/early orders with supervisor approval
  - Quick access to specials and seasonal items

**US-P003: Build Orders with Modifications**
- **As a** Server
- **I want to** add menu items with customizations and dietary modifications
- **So that I** can accommodate guest preferences and special dietary needs
- **Acceptance Criteria:**
  - Touch-friendly menu navigation with categories (Mains, Sides, Beverages)
  - Modification options: "No onions," "Sauce on side," "Extra spicy," "Gluten-free preparation"
  - Allergy alert system for common allergens
  - Clear display of modifications on kitchen tickets
  - Price adjustments for additions/substitutions

**US-P004: Split Order Types (Food vs. Beverages)**
- **As a** Server
- **I want to** send food orders to the kitchen and drink orders to the bar simultaneously
- **So that I** can ensure proper timing and preparation workflow
- **Acceptance Criteria:**
  - Food items automatically route to Kitchen Display System (KDS)
  - Beverage items automatically print at bar station
  - Mixed orders split appropriately without server intervention
  - Clear visual confirmation of where each item was sent

**US-P005: Modify Active Orders**
- **As a** Server
- **I want to** add items, cancel items, or modify existing orders before and after kitchen firing
- **So that I** can accommodate guest changes and correct ordering mistakes
- **Acceptance Criteria:**
  - Add items to existing order with automatic kitchen/bar routing
  - Cancel items not yet started (with kitchen confirmation for fired items)
  - Modification tracking for inventory and cost analysis
  - Different permission levels for various modification types

### Payment Processing

**US-P006: Generate and Present Bills**
- **As a** Server
- **I want to** generate itemized bills with tax and service charge calculations
- **So that I** can present accurate charges to guests
- **Acceptance Criteria:**
  - Automatic tax calculation based on Kenyan VAT rates
  - Optional service charge application (with guest consent)
  - Clear itemization of food, beverages, taxes, and charges
  - M-PESA till number prominently displayed on printed bills

**US-P007: Process Multiple Payment Types**
- **As a** Server
- **I want to** accept and process cash, card, and M-PESA payments
- **So that I** can accommodate all guest payment preferences
- **Acceptance Criteria:**
  - Cash payment with automatic change calculation
  - Card payment integration with portable terminals
  - M-PESA payment verification and confirmation
  - Payment type recording for daily reconciliation
  - Receipt printing for all payment methods

**US-P008: Split Bills Multiple Ways**
- **As a** Server
- **I want to** split bills by guest, by item, or by custom amounts
- **So that I** can accommodate group dining payment preferences
- **Acceptance Criteria:**
  - Split evenly by number of guests
  - Assign specific items to specific guests
  - Custom amount splitting for shared items
  - Separate payment processing for each split
  - Clear tracking of which portions are paid

**US-P009: Apply Discounts and Promotions**
- **As a** Server
- **I want to** apply authorized discounts and promotional offers to orders
- **So that I** can honor marketing campaigns and resolve service issues
- **Acceptance Criteria:**
  - Predefined discount categories (Student, Senior, Employee)
  - Percentage or fixed-amount discount options
  - Supervisor approval required for discounts over set threshold
  - Reason code selection for discount application
  - Automatic reporting of all discounts applied

### Table Management Integration

**US-P010: Update Table Status via POS**
- **As a** Server
- **I want to** update table status when guests depart or need cleaning
- **So that I** can keep the host informed of table availability
- **Acceptance Criteria:**
  - "Guest Departed" button that notifies host system
  - "Needs Cleaning" status update with estimated time
  - Automatic table clearing when final payment processed
  - Integration with table turnover tracking

---

## Bartender User Stories

**US-P011: Receive and Manage Drink Orders**
- **As a** Bartender
- **I want to** receive drink orders with clear preparation instructions
- **So that I** can efficiently prepare beverages and maintain order accuracy
- **Acceptance Criteria:**
  - Real-time drink order printing with table number and server name
  - Clear ingredient lists and preparation notes
  - Special instructions display (extra ice, no garnish, etc.)
  - Order completion marking system

**US-P012: Track Bar Inventory Usage**
- **As a** Bartender
- **I want to** mark items as 86'd (out of stock) directly from the bar station
- **So that I** can prevent orders for unavailable items
- **Acceptance Criteria:**
  - Quick 86 button for beer, wine, and spirits
  - Automatic menu hiding for out-of-stock items
  - Manager notification of stock-outs
  - Ability to restore items when restocked

**US-P013: Process Bar-Only Transactions**
- **As a** Bartender
- **I want to** handle direct bar sales without table assignment
- **So that I** can serve guests at the bar counter
- **Acceptance Criteria:**
  - Quick bar sale entry without table selection
  - Immediate payment processing capability
  - Integration with daily sales reporting
  - Cash handling and till management

---

## Shift Supervisor User Stories

**US-P014: Override and Void Transactions**
- **As a** Shift Supervisor
- **I want to** void items, cancel orders, and override system restrictions
- **So that I** can resolve service issues and handle exceptional situations
- **Acceptance Criteria:**
  - Manager PIN or card required for override actions
  - Void reasons selection (wrong order, service issue, walkout)
  - Complete transaction cancellation capability
  - Detailed logging of all override actions for management review

**US-P015: Apply Comp Meals and Service Recovery**
- **As a** Shift Supervisor
- **I want to** comp entire meals or individual items for service recovery
- **So that I** can maintain guest satisfaction and resolve complaints
- **Acceptance Criteria:**
  - Full meal comp or individual item comp options
  - Reason code requirement for all comps
  - Daily comp limit settings with manager override
  - Guest information capture for comp tracking

**US-P016: Real-Time Sales Monitoring**
- **As a** Shift Supervisor
- **I want to** monitor real-time sales performance and server activity
- **So that I** can identify issues and optimize service during shifts
- **Acceptance Criteria:**
  - Live sales dashboard with hourly comparisons
  - Server performance indicators (sales, table count, average ticket)
  - Alert system for unusual activity (large voids, excessive discounts)
  - Table turnover and timing analysis

---

## General Manager User Stories

**US-P017: Menu Management and Pricing**
- **As a** General Manager
- **I want to** update menu items, prices, and availability across all service periods
- **So that I** can respond to cost changes and seasonal menu updates
- **Acceptance Criteria:**
  - Menu item creation, modification, and deletion
  - Price update functionality with effective date scheduling
  - Bulk pricing updates for category-wide changes
  - Menu version control and change history

**US-P018: Sales Analytics and Reporting**
- **As a** General Manager
- **I want to** access comprehensive sales reports and analytics
- **So that I** can make informed business decisions and track performance
- **Acceptance Criteria:**
  - Daily, weekly, and monthly sales reports
  - Menu item performance analysis (best/worst sellers)
  - Payment method breakdown and trends
  - Server performance comparison and ranking
  - Food cost percentage tracking

**US-P019: System Configuration and User Management**
- **As a** General Manager
- **I want to** manage user accounts, permissions, and system settings
- **So that I** can maintain security and customize system behavior
- **Acceptance Criteria:**
  - User account creation and permission assignment
  - Role-based access control configuration
  - Tax rate and service charge settings
  - Integration settings for kitchen and bar systems
  - Backup and data export functionality

---

## Busser User Stories

**US-P020: Basic Table Status Updates**
- **As a** Busser
- **I want to** mark tables as cleaned and ready for new guests
- **So that I** can help maintain efficient table turnover
- **Acceptance Criteria:**
  - Simple "Table Clean" button access
  - Table selection from visual floor plan
  - Automatic notification to host system
  - No access to order or payment functions

---

## Technical Requirements

### Performance Requirements
- **Order Entry Speed:** Sub-second response for menu navigation
- **Payment Processing:** 30-second maximum for card transactions
- **Kitchen Integration:** Immediate order transmission to KDS
- **Concurrent Users:** Support 15+ simultaneous users during peak service
- **Offline Capability:** Basic order entry during internet outages

### Integration Requirements
- **Table Management:** Real-time table status synchronization
- **Kitchen Display System:** Instant food order transmission
- **Bar Printer:** Immediate drink order printing
- **Inventory System:** Real-time stock level updates
- **Payment Processors:** M-PESA, bank card, and cash handling

### Mobile & Hardware Requirements
- **Tablet Optimization:** Touch-friendly interface for server tablets
- **Portable Terminals:** Integration with mobile card readers
- **Receipt Printers:** Guest receipt and kitchen ticket printing
- **Cash Drawer:** Electronic cash drawer integration
- **Barcode Scanner:** Optional for inventory integration

### Security Requirements
- **User Authentication:** Secure login with role-based permissions
- **Payment Security:** PCI compliance for card transactions
- **Data Encryption:** Secure transmission of payment and order data
- **Audit Trail:** Complete logging of all transactions and modifications
- **Session Management:** Automatic logout and session security

---

## Business Rules

### Menu and Pricing Rules
- **Service Period Menus:** Automatic switching based on time
- **Special Item Management:** Daily specials override regular menu
- **Price Override Authority:** Manager approval required for price changes
- **Seasonal Items:** Automatic availability based on date ranges

### Order Management Rules
- **Modification Limits:** Reasonable modification policies per item type
- **Kitchen Timing:** No cancellations after 5-minute kitchen prep time
- **Special Requests:** Free modifications vs. charged additions
- **Group Order Limits:** Maximum 12 items per single order entry

### Payment Processing Rules
- **Split Bill Limits:** Maximum 6-way bill splitting
- **Cash Handling:** Exact change policies and till limits
- **M-PESA Verification:** Required confirmation screenshot for payments over 5,000 KES
- **Card Minimums:** No minimum purchase requirements for card payments

### Discount and Comp Policies
- **Server Discount Authority:** Up to 10% without approval
- **Supervisor Comp Authority:** Up to full meal value
- **Manager Override:** Required for voids over 2,000 KES
- **Daily Limits:** Maximum comp percentage per shift

### Inventory Integration Rules
- **Real-Time Updates:** Immediate stock reduction upon order confirmation
- **86'd Item Management:** Automatic menu updates when items unavailable
- **Prep Time Tracking:** Integration with kitchen prep schedules
- **Waste Tracking:** Void and comp items tracked for inventory accuracy

---

## Error Handling & Edge Cases

### Network Connectivity Issues
- **Offline Mode:** Basic order entry with sync when reconnected
- **Payment Failures:** Clear error messages and retry procedures
- **Kitchen Communication:** Backup printing for KDS failures

### User Error Prevention
- **Confirmation Dialogs:** Required for voids, comps, and large orders
- **Input Validation:** Price limits and quantity restrictions
- **Double-Entry Prevention:** Duplicate order detection
- **Training Mode:** Practice environment for new staff