# Task 5: Frontend Structure Implementation - Detailed Specification

## Overview
Build a responsive, intuitive web application that serves as the primary interface for Jiko Milele's restaurant management system. The frontend must be tablet-friendly for servers, role-appropriate for different staff members, and provide seamless integration with the backend API.

---

## Part 1: Layout and Navigation System

### Main Application Layout
Create a responsive layout that works across desktop, tablet, and mobile devices:

#### Navigation Sidebar
Design a collapsible sidebar navigation with role-based menu items:
- **Logo and Restaurant Name**: "Jiko Milele" branding at the top
- **User Profile Section**: Current user name, role, and logout option
- **Role-Appropriate Menu Items**: Different navigation based on user permissions
- **Collapse/Expand**: Toggle for mobile and tablet optimization
- **Active State Indicators**: Highlight current page/section

#### Main Content Area
- **Responsive Design**: Fluid layout that adapts to screen size
- **Breadcrumb Navigation**: Show current location within the app
- **Page Headers**: Consistent page titles with action buttons
- **Loading States**: Skeleton screens and spinners for data loading
- **Error Boundaries**: Graceful error handling and fallback UI

#### Role-Based Navigation Structure

**General Manager Navigation:**
- 📊 Dashboard (overview metrics)
- 🍽️ Tables (floor plan and status)
- 👥 Staff (employee management)
- 👤 Customers (guest profiles)
- 📦 Inventory (stock and suppliers)
- 📈 Reports (analytics and insights)
- ⚙️ Settings (system configuration)

**Shift Supervisor Navigation:**
- 📊 Dashboard (shift overview)
- 🍽️ Tables (table management)
- 👥 Staff (current shift team)
- 👤 Customers (guest service)
- 📋 Operations (shift reports)

**Head Chef Navigation:**
- 📊 Kitchen Dashboard
- 📦 Inventory (ingredients and stock)
- 🧾 Suppliers (vendor management)
- 📋 Recipes (menu items)
- 📈 Kitchen Reports (costs and efficiency)

**Server Navigation:**
- 🍽️ My Tables (assigned tables)
- 👤 Customers (guest lookup)
- 💰 Sales (personal performance)

**Host Navigation:**
- 🍽️ Tables (floor plan)
- 📅 Reservations (booking management)
- 👤 Customers (guest check-in)
- ⏱️ Waitlist (queue management)

### Responsive Design Strategy
Implement mobile-first responsive design:
- **Mobile (320px-768px)**: Stacked layout, hamburger menu, touch-optimized
- **Tablet (768px-1024px)**: Primary interface for servers, optimized for touch
- **Desktop (1024px+)**: Full sidebar, multiple columns, mouse interaction

---

## Part 2: Dashboard Pages by Role

### General Manager Dashboard
Create a comprehensive business overview dashboard:

#### Key Metrics Cards (Top Row)
- **Today's Revenue**: Current sales with yesterday comparison
- **Active Tables**: Occupied vs. total capacity with percentage
- **Staff on Duty**: Current shift employees by role
- **Inventory Alerts**: Items below minimum stock levels

#### Charts and Analytics (Main Content)
- **Revenue Trend Chart**: Last 7 days sales with service period breakdown
- **Table Turnover Rate**: Average table utilization by time period
- **Top Menu Items**: Best-selling dishes today
- **Food Cost Percentage**: Current vs. target with trend indicator

#### Quick Actions (Sidebar or Bottom)
- View detailed reports
- Check staff schedules
- Review inventory alerts
- Access system settings

### Shift Supervisor Dashboard
Focus on real-time operational control:

#### Live Operations Panel
- **Current Shift Status**: Start time, expected end, team members
- **Table Status Grid**: Visual representation of all tables with real-time status
- **Active Orders**: Orders in progress with timing information
- **Staff Performance**: Current shift metrics for team members

#### Alert Center
- **Service Alerts**: Tables waiting too long, customer complaints
- **Staff Alerts**: Break schedules, late arrivals, performance issues
- **System Alerts**: Equipment problems, inventory stockouts

### Head Chef Dashboard
Kitchen-focused operational view:

#### Kitchen Performance Metrics
- **Orders in Queue**: Current kitchen workload by station
- **Average Prep Time**: Kitchen efficiency metrics
- **Food Cost Today**: Running total with budget comparison
- **Waste Tracking**: Items wasted with cost impact

#### Inventory Overview
- **Low Stock Alerts**: Ingredients below reorder point
- **Today's Deliveries**: Expected supplier deliveries
- **Prep Schedule**: Planned preparation tasks
- **Recipe Costs**: Menu item profitability analysis

### Server Dashboard (Simplified)
Focus on individual performance and assigned tables:

#### My Performance Today
- **Tables Served**: Number of tables assigned and completed
- **Total Sales**: Personal sales for current shift
- **Average Ticket**: Performance metric with target comparison
- **Tips Earned**: Tip tracking if applicable

#### My Current Tables
- **Table Status Cards**: Visual cards for each assigned table
- **Order Status**: Active orders and their kitchen progress
- **Customer Notes**: Special requests and preferences
- **Payment Status**: Bills and payment progress

---

## Part 3: Core Management Pages

### Table Management Page
Create an interactive floor plan interface:

#### Visual Floor Plan
- **Interactive Table Layout**: Clickable table representations
- **Real-Time Status Colors**: 
  - Green: Available
  - Red: Occupied
  - Yellow: Needs cleaning
  - Blue: Reserved
  - Gray: Out of order
- **Table Information on Hover**: Capacity, current party, time occupied
- **Drag-and-Drop Functionality**: Future feature for table assignment

#### Table Control Panel
- **Table List View**: Alternative to visual layout with sortable columns
- **Quick Actions**: Seat guest, mark cleaning, change status
- **Table Details Modal**: Complete information and history
- **Bulk Operations**: Mark multiple tables for cleaning

#### Table Status Management
- **Status Change Interface**: Easy buttons to update table status
- **Guest Assignment**: Link customers to tables with party size
- **Service Notes**: Add notes about table service or issues
- **Time Tracking**: Automatic timing for table turnover analysis

### Staff Management Page
Comprehensive employee administration:

#### Staff Directory
- **Staff List with Photos**: Professional directory view
- **Role-Based Filtering**: Filter by position, shift, or status
- **Search Functionality**: Find staff by name, employee number, or role
- **Quick Contact**: Phone numbers and emergency contacts

#### Staff Details and Management
- **Employee Profile Cards**: Photo, role, contact info, performance
- **Schedule Display**: Current and upcoming shifts
- **Performance Metrics**: Sales, attendance, customer ratings
- **Action Buttons**: Edit profile, assign role, schedule shift

#### Staff Creation and Editing (Manager Only)
- **New Employee Form**: Complete onboarding information
- **Role Assignment**: Select role with automatic permission setup
- **Contact Information**: Phone, email, emergency contacts
- **Employment Details**: Hire date, hourly rate, department

### Customer Management Page
Guest relationship and service tracking:

#### Customer Search and Lookup
- **Search Bar**: Search by phone number, name, or email
- **Recent Customers**: Last 50 customers for quick access
- **Frequent Guests**: Top customers by visit frequency
- **Quick Add Customer**: Fast form for new guest registration

#### Customer Profile Display
- **Guest Information Card**: Name, phone, email, preferences
- **Visit History**: Past visits with dates, spending, and notes
- **Loyalty Points**: Current points balance and earning history
- **Dietary Preferences**: Allergies, restrictions, special requests
- **Service Notes**: Staff observations and preferences

#### Customer Service Tools
- **Add Visit Notes**: Record service observations
- **Update Preferences**: Modify dietary restrictions or preferences
- **Loyalty Management**: Award or adjust loyalty points
- **Communication Log**: Track interactions and special occasions

---

## Part 4: Reusable UI Components

### Design System Components
Create a consistent, professional design system:

#### Basic Form Components
- **Input Fields**: Text, email, phone, number with validation styling
- **Select Dropdowns**: Single and multi-select with search capability
- **Checkboxes and Radio Buttons**: Styled form controls
- **Date and Time Pickers**: User-friendly date/time selection
- **File Upload**: Drag-and-drop file upload interface

#### Action Components
- **Primary Buttons**: Main actions (Save, Create, Submit)
- **Secondary Buttons**: Alternative actions (Cancel, Back, Edit)
- **Icon Buttons**: Small action buttons with icons
- **Button Groups**: Related action buttons grouped together
- **Loading Buttons**: Show loading state during API calls

#### Display Components
- **Data Tables**: Sortable, filterable tables with pagination
- **Cards**: Content containers for displaying related information
- **Modals and Dialogs**: Overlay windows for forms and confirmations
- **Alerts and Notifications**: Success, error, warning, and info messages
- **Progress Indicators**: Loading spinners, progress bars, skeleton screens

#### Navigation Components
- **Breadcrumbs**: Show navigation path
- **Tabs**: Switch between related content sections
- **Pagination**: Navigate through large datasets
- **Search Bars**: Global and context-specific search interfaces

### Kenyan Market-Specific Components
Build components tailored to local needs:

#### Phone Number Input
- **Kenyan Format Validation**: Automatically format +254XXXXXXXXX
- **Format Helper**: Show expected format as placeholder
- **Validation Feedback**: Clear error messages for invalid numbers

#### Currency Display
- **KES Formatting**: Consistent Kenyan Shilling display (KES 1,234.50)
- **Amount Input**: Number input with currency symbol
- **Calculator Interface**: For bill splitting and calculations

#### Time and Date Components
- **Local Time Display**: EAT timezone awareness
- **Business Hours**: 7 AM - 10 PM scheduling interface
- **Swahili Date Options**: Optional Swahili day/month names

---

## Part 5: API Integration and State Management

### API Service Layer
Create organized API communication:

#### API Client Configuration
- **Axios Setup**: Base URL, timeout, and interceptors
- **Authentication Interceptor**: Automatic JWT token attachment
- **Response Interceptor**: Handle token refresh and error responses
- **Request Interceptor**: Add request logging and debugging

#### API Service Functions
Organize API calls by business domain:

**Tables Service (`services/tablesService.js`)**
```javascript
export const tablesService = {
  getAllTables: () => api.get('/tables/'),
  getTable: (id) => api.get(`/tables/${id}/`),
  updateTableStatus: (id, status) => api.patch(`/tables/${id}/status/`, { status }),
  createTable: (tableData) => api.post('/tables/', tableData),
  deleteTable: (id) => api.delete(`/tables/${id}/`)
}
```

**Staff Service (`services/staffService.js`)**
```javascript
export const staffService = {
  getAllStaff: (filters) => api.get('/staff/', { params: filters }),
  getStaff: (id) => api.get(`/staff/${id}/`),
  createStaff: (staffData) => api.post('/staff/', staffData),
  updateStaff: (id, staffData) => api.put(`/staff/${id}/`, staffData),
  updateStaffStatus: (id, isActive) => api.patch(`/staff/${id}/status/`, { is_active: isActive })
}
```

**Customers Service (`services/customersService.js`)**
```javascript
export const customersService = {
  searchCustomers: (query) => api.get('/customers/search/', { params: { search: query } }),
  getCustomer: (id) => api.get(`/customers/${id}/`),
  createCustomer: (customerData) => api.post('/customers/', customerData),
  updateCustomer: (id, customerData) => api.put(`/customers/${id}/`, customerData)
}
```

### State Management Strategy
Implement efficient state management:

#### React Context for Global State
- **Authentication Context**: User state, login/logout, permissions
- **Notification Context**: Toast messages, alerts, system notifications
- **Theme Context**: Dark/light mode, responsive breakpoints

#### Local State with React Hooks
- **Component State**: Use useState for local form data and UI state
- **Data Fetching**: Use useEffect with custom hooks for API calls
- **Form Management**: Use useForm or similar for complex forms

#### Custom Hooks for Data Management
```javascript
// Custom hook for table management
export const useTables = () => {
  const [tables, setTables] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const fetchTables = async () => {
    setLoading(true)
    try {
      const response = await tablesService.getAllTables()
      setTables(response.data.results)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return { tables, loading, error, fetchTables }
}
```

---

## Part 6: Error Handling and User Experience

### Error Handling Strategy
Implement comprehensive error handling:

#### API Error Handling
- **Network Errors**: Handle connection failures with retry options
- **Authentication Errors**: Automatic logout and redirect to login
- **Validation Errors**: Display field-specific error messages
- **Server Errors**: User-friendly error messages with support contact

#### Form Validation
- **Client-Side Validation**: Immediate feedback for user input
- **Server-Side Validation**: Handle API validation responses
- **Required Fields**: Clear indicators for mandatory fields
- **Format Validation**: Phone numbers, emails, numbers

#### Loading States and Feedback
- **Skeleton Screens**: Show content structure while loading
- **Progress Indicators**: For long-running operations
- **Success Notifications**: Confirm successful actions
- **Optimistic Updates**: Update UI immediately, rollback on failure

### Accessibility and Usability
Ensure the application is accessible and user-friendly:

#### Accessibility Features
- **Keyboard Navigation**: Full keyboard accessibility
- **Screen Reader Support**: Proper ARIA labels and roles
- **Color Contrast**: WCAG AA compliance for text and backgrounds
- **Focus Management**: Clear focus indicators and logical tab order

#### Mobile and Tablet Optimization
- **Touch Targets**: Minimum 44px touch targets for mobile
- **Gesture Support**: Swipe, pinch, and touch interactions
- **Orientation Support**: Portrait and landscape modes
- **Performance**: Fast loading and smooth interactions

---

## Part 7: Development Tools and Quality

### Development Environment
Set up efficient development tools:

#### Hot Reloading and Development Server
- **Fast Refresh**: Instant updates during development
- **Error Overlay**: Clear error messages in development
- **API Proxy**: Seamless connection to backend during development

#### Code Quality Tools
- **ESLint Configuration**: Consistent code style and error detection
- **Prettier Setup**: Automatic code formatting
- **TypeScript Integration**: Type safety and better IDE support
- **Import Organization**: Automatic import sorting and organization

#### Testing Setup
- **Component Testing**: Test individual components and their behavior
- **Integration Testing**: Test component interactions and API calls
- **Accessibility Testing**: Automated accessibility checks
- **Performance Testing**: Monitor bundle size and loading times

---

## Success Criteria

After completing Task 5, verify these outcomes:

✅ **Responsive Layout and Navigation**
- Clean, professional interface that works on desktop, tablet, and mobile
- Role-based navigation showing appropriate menu items
- Smooth transitions and interactions

✅ **Dashboard Functionality**
- Role-appropriate dashboards with relevant metrics and information
- Real-time data updates from API
- Interactive elements and quick actions

✅ **Core Management Pages**
- Table management with visual floor plan and status controls
- Staff directory with search, filtering, and management capabilities
- Customer lookup and profile management

✅ **Component Library**
- Reusable UI components with consistent styling
- Form components with validation and error handling
- Kenyan market-specific components (phone formatting, currency)

✅ **API Integration**
- Seamless communication with backend API
- Proper error handling and loading states
- Authentication integration with protected routes

✅ **User Experience**
- Intuitive navigation and clear information hierarchy
- Fast loading times and smooth interactions
- Accessibility features and mobile optimization

✅ **Code Quality**
- Clean, well-organized code structure
- Consistent styling with Tailwind CSS
- Proper error boundaries and fallback UI

This frontend foundation will provide an excellent user experience for all restaurant staff while setting the stage for advanced features in future phases.