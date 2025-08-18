# Inventory Management System
## User Stories & Functional Requirements

---

## Module Overview
The Inventory Management System is the financial backbone of Jiko Milele, tracking every ingredient from supplier delivery to guest consumption. This system provides real-time stock levels, automated recipe costing, and critical data for profitability analysis while supporting the restaurant's local sourcing from Thika markets and suppliers.

---

## User Roles
- **Head Chef** - Primary inventory controller, purchasing decisions, recipe management
- **Sous Chef** - Daily stock management, receiving assistance, prep coordination
- **General Manager** - Cost analysis, supplier relationships, profitability oversight
- **Receiver/Prep Cook** - Delivery acceptance, basic stock updates, prep tracking
- **Server/Bartender** - Real-time stock level awareness for guest communication

---

## Head Chef User Stories

### Purchasing & Supplier Management

**US-I001: Supplier Database Management**
- **As a** Head Chef
- **I want to** maintain detailed supplier profiles with contact information and pricing
- **So that I** can efficiently source ingredients from multiple Thika market vendors and suppliers
- **Acceptance Criteria:**
  - Supplier contact database with phone numbers and physical locations
  - Price history tracking for each supplier by ingredient
  - Delivery schedule and minimum order information
  - Quality rating system based on past deliveries
  - Preferred supplier designation for automatic ordering suggestions

**US-I002: Automated Purchase Order Generation**
- **As a** Head Chef
- **I want to** generate purchase orders based on current stock levels and sales projections
- **So that I** can maintain optimal inventory without over-ordering or stockouts
- **Acceptance Criteria:**
  - Automatic reorder point calculations based on usage patterns
  - Sales forecast integration from POS historical data
  - Multi-supplier order optimization for best pricing
  - Lead time consideration for different suppliers
  - Manual override capability for seasonal adjustments

**US-I003: Market Day Planning and Mobile Orders**
- **As a** Head Chef
- **I want to** access inventory data and place orders via mobile device during market visits
- **So that I** can make real-time purchasing decisions at Thika markets
- **Acceptance Criteria:**
  - Mobile-optimized interface for market use
  - Real-time stock level access while away from restaurant
  - Quick order entry for market purchases
  - Price comparison tools for multiple vendors
  - Photo capture for receipt documentation

### Recipe Management & Costing

**US-I004: Recipe Creation and Ingredient Mapping**
- **As a** Head Chef
- **I want to** create detailed recipes with precise ingredient quantities for each menu item
- **So that I** can accurately track food costs and automate inventory depletion
- **Acceptance Criteria:**
  - Recipe builder with ingredient search and quantity specification
  - Unit conversion tools (grams, kilograms, liters, pieces)
  - Yield calculation for batch cooking and portioning
  - Allergen tracking and dietary restriction flagging
  - Recipe versioning for menu changes and improvements

**US-I005: Real-Time Food Cost Calculation**
- **As a** Head Chef
- **I want to** see current food costs for each menu item based on current ingredient prices
- **So that I** can make informed pricing decisions and identify cost control opportunities
- **Acceptance Criteria:**
  - Automatic cost calculation using current supplier prices
  - Food cost percentage display for each menu item
  - Cost trend analysis showing price changes over time
  - Profitability alerts when costs exceed target margins
  - Batch cost analysis for special events and catering

**US-I006: Recipe Scaling and Prep Planning**
- **As a** Head Chef
- **I want to** scale recipes for different batch sizes and prep requirements
- **So that I** can efficiently plan daily prep work and minimize waste
- **Acceptance Criteria:**
  - Recipe scaling calculator for different serving quantities
  - Prep list generation based on projected sales
  - Ingredient consolidation across multiple recipes
  - Prep timing recommendations based on shelf life
  - Integration with daily sales forecasts

### Stock Level Monitoring

**US-I007: Real-Time Inventory Dashboard**
- **As a** Head Chef
- **I want to** monitor current stock levels across all storage locations in real-time
- **So that I** can prevent stockouts and manage 86'd items proactively
- **Acceptance Criteria:**
  - Live inventory display with color-coded stock levels (high, medium, low, critical)
  - Multiple storage location tracking (dry storage, walk-in cooler, freezer, bar)
  - Integration with POS for automatic depletion based on sales
  - Quick 86 item marking with automatic menu updates
  - Stock movement history and usage pattern analysis

**US-I008: Automated Low Stock Alerts**
- **As a** Head Chef
- **I want to** receive automated alerts when ingredients approach minimum levels
- **So that I** can maintain service continuity and avoid emergency purchasing
- **Acceptance Criteria:**
  - Customizable reorder points for each ingredient
  - Multiple alert methods (dashboard, mobile notification, email)
  - Lead time consideration in alert timing
  - Weekend and holiday alert adjustments
  - Seasonal demand pattern recognition

### Waste and Loss Management

**US-I009: Waste Tracking and Analysis**
- **As a** Head Chef
- **I want to** track food waste and spoilage with detailed categorization
- **So that I** can identify cost reduction opportunities and improve purchasing accuracy
- **Acceptance Criteria:**
  - Waste entry with reason codes (spoilage, prep error, overproduction, guest return)
  - Photo documentation for training and analysis
  - Waste cost calculation and impact on food cost percentage
  - Trend analysis to identify recurring waste patterns
  - Staff training recommendations based on waste data

**US-I010: Inventory Shrinkage Management**
- **As a** Head Chef
- **I want to** track and analyze inventory shrinkage from various causes
- **So that I** can maintain accurate cost control and identify operational issues
- **Acceptance Criteria:**
  - Shrinkage tracking with categorization (waste, theft, portion control, counting errors)
  - Regular variance reporting between theoretical and actual usage
  - Investigation workflows for significant variances
  - Staff accountability tracking for high-value items
  - Security recommendations for high-shrinkage items

---

## Sous Chef User Stories

**US-I011: Daily Stock Count Coordination**
- **As a** Sous Chef
- **I want to** conduct and coordinate daily stock counts efficiently
- **So that I** can maintain inventory accuracy and support purchasing decisions
- **Acceptance Criteria:**
  - Mobile stock counting interface with barcode scanning
  - Cycle counting schedule for different product categories
  - Variance detection and investigation prompts
  - Team member assignment for different storage areas
  - Integration with prep planning and production schedules

**US-I012: Prep Production Tracking**
- **As a** Sous Chef
- **I want to** track prep production and yield rates for recipe accuracy
- **So that I** can maintain consistent portions and accurate inventory depletion
- **Acceptance Criteria:**
  - Prep batch recording with actual yields vs. theoretical
  - Prep shelf life tracking and rotation management
  - Production efficiency analysis for staff training
  - Recipe adjustment recommendations based on actual yields
  - Integration with daily prep planning system

---

## General Manager User Stories

### Financial Analysis & Reporting

**US-I013: Food Cost Analysis Dashboard**
- **As a** General Manager
- **I want to** analyze food costs and profitability across different time periods and menu categories
- **So that I** can make strategic decisions about pricing, purchasing, and menu development
- **Acceptance Criteria:**
  - Real-time food cost percentage tracking with target comparisons
  - Menu item profitability ranking and analysis
  - Cost trend analysis with seasonal adjustments
  - Vendor performance comparison for cost optimization
  - Integration with sales data for comprehensive profitability analysis

**US-I014: Inventory Investment Monitoring**
- **As a** General Manager
- **I want to** monitor inventory investment levels and turnover rates
- **So that I** can optimize cash flow and reduce carrying costs
- **Acceptance Criteria:**
  - Inventory turnover rate calculation by category
  - Cash flow impact analysis of inventory investment
  - Slow-moving inventory identification and recommendations
  - Optimal stock level recommendations based on turnover targets
  - Integration with financial reporting systems

**US-I015: Supplier Performance Analytics**
- **As a** General Manager
- **I want to** analyze supplier performance across multiple metrics
- **So that I** can optimize vendor relationships and reduce costs
- **Acceptance Criteria:**
  - Supplier scorecards with quality, timeliness, and pricing metrics
  - Cost comparison analysis across suppliers for same items
  - Delivery reliability tracking and performance trends
  - Quality issue documentation and resolution tracking
  - Contract negotiation support with historical performance data

### System Administration

**US-I016: Inventory System Configuration**
- **As a** General Manager
- **I want to** configure inventory parameters and user permissions
- **So that I** can maintain system security and optimize workflows
- **Acceptance Criteria:**
  - User permission management for different inventory functions
  - Approval workflows for high-value orders and adjustments
  - System backup and data export capabilities
  - Integration settings with POS, KDS, and accounting systems
  - Audit trail maintenance for all inventory transactions

---

## Receiver/Prep Cook User Stories

**US-I017: Delivery Receiving and Verification**
- **As a** Receiver
- **I want to** efficiently check deliveries against purchase orders and record receipts
- **So that I** can ensure order accuracy and maintain inventory records
- **Acceptance Criteria:**
  - Mobile receiving interface with purchase order lookup
  - Quantity and quality verification checkboxes
  - Photo documentation for quality issues
  - Automatic inventory updates upon receipt confirmation
  - Exception reporting for discrepancies or quality problems

**US-I018: Basic Stock Movement Recording**
- **As a** Prep Cook
- **I want to** record basic stock movements during prep work
- **So that I** can maintain accurate inventory levels for production tracking
- **Acceptance Criteria:**
  - Simple interface for recording ingredient usage during prep
  - Batch production recording with yield tracking
  - Transfer recording between storage locations
  - Basic waste reporting for prep activities
  - Integration with prep planning and recipe systems

---

## Server/Bartender User Stories

**US-I019: Real-Time Stock Level Awareness**
- **As a** Server/Bartender
- **I want to** see current availability of menu items and ingredients
- **So that I** can accurately inform guests and suggest alternatives for unavailable items
- **Acceptance Criteria:**
  - Real-time menu item availability display in POS
  - Stock level indicators for bar inventory
  - Automatic 86'd item alerts and alternative suggestions
  - Estimated return time for temporarily unavailable items
  - Integration with ordering system to prevent unavailable item orders

---

## Technical Requirements

### Hardware and Infrastructure
- **Mobile Devices:** Tablet/smartphone support for market visits and receiving
- **Barcode Scanning:** Integration with barcode scanners for efficient counting
- **Scale Integration:** Connection to kitchen scales for accurate portioning
- **Network Connectivity:** Offline capability with sync when connection restored
- **Cloud Storage:** Secure data backup and multi-device synchronization

### Performance Requirements
- **Real-Time Updates:** Immediate inventory adjustments from POS sales
- **Response Time:** Sub-second response for stock level queries
- **Concurrent Users:** Support multiple users during busy receiving periods
- **Data Accuracy:** 99.9% accuracy in inventory calculations and depletion
- **Backup Systems:** Daily automated backups with point-in-time recovery

### Integration Requirements
- **POS System:** Real-time sales depletion and 86'd item communication
- **KDS System:** Stock level data for kitchen planning and operations
- **Accounting System:** Cost data export for financial reporting
- **Supplier Systems:** Electronic ordering and invoice processing (where available)
- **Mobile Apps:** Native mobile functionality for market and receiving activities

### Security and Compliance
- **User Authentication:** Role-based access control for different functions
- **Audit Trails:** Complete logging of all inventory transactions and adjustments
- **Data Encryption:** Secure storage and transmission of cost and supplier data
- **Financial Controls:** Approval workflows for high-value transactions
- **Backup Security:** Encrypted backup storage with access controls

---

## Business Rules

### Purchasing and Ordering Rules
- **Minimum Order Quantities:** Supplier-specific minimum orders and delivery fees
- **Lead Time Management:** Automatic reorder timing based on supplier lead times
- **Seasonal Adjustments:** Dynamic reorder points for seasonal demand variations
- **Budget Controls:** Monthly purchasing budget limits with manager override
- **Quality Standards:** Minimum quality specifications for each ingredient category

### Inventory Valuation Methods
- **FIFO Cost Method:** First-in, first-out inventory valuation for perishables
- **Weighted Average:** Average cost calculation for bulk dry goods
- **Standard Costing:** Fixed costs for menu planning with variance tracking
- **Market Price Updates:** Regular price updates from supplier invoices
- **Shrinkage Allowances:** Expected shrinkage rates by product category

### Stock Movement and Control
- **Receiving Procedures:** Required inspection and approval for all deliveries
- **Storage Assignments:** Proper location assignment based on product requirements
- **Rotation Management:** Strict FIFO rotation for perishable items
- **Transfer Authorization:** Manager approval for high-value inter-location transfers
- **Count Accuracy:** Required investigation for variances over 5% by value

### Recipe and Costing Standards
- **Recipe Standardization:** Mandatory recipe recording for all menu items
- **Portion Control:** Standard portion sizes with acceptable variance ranges
- **Cost Update Frequency:** Weekly cost recalculation based on latest prices
- **Menu Engineering:** Regular analysis of item profitability and popularity
- **Yield Standards:** Expected yield rates with variance tracking

---

## Error Handling & Data Integrity

### Inventory Accuracy Management
- **Cycle Counting:** Regular partial counts to maintain accuracy
- **Variance Investigation:** Mandatory investigation for significant variances
- **Adjustment Approval:** Manager approval required for inventory adjustments
- **Historical Tracking:** Complete audit trail for all inventory changes
- **Reconciliation Procedures:** Daily reconciliation with POS sales data

### System Failure Contingencies
- **Offline Mode:** Basic functionality during connectivity issues
- **Data Recovery:** Point-in-time recovery for system failures
- **Manual Backup:** Paper-based emergency procedures for critical functions
- **Sync Verification:** Automatic verification of data synchronization
- **Error Correction:** Procedures for correcting data entry errors

### Quality Assurance Protocols
- **Receiving Standards:** Quality inspection requirements for all deliveries
- **Storage Monitoring:** Temperature and condition monitoring for perishables
- **Expiration Tracking:** Automatic alerts for approaching expiration dates
- **Supplier Quality:** Quality issue tracking and supplier performance impact
- **Training Requirements:** Staff certification for inventory handling procedures