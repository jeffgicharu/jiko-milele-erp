# Reservation & Table Management System
## User Stories & Functional Requirements

---

## Module Overview
The Reservation & Table Management System serves as the front-door experience for Jiko Milele, managing the flow of guests from initial contact through seating. This system must support the restaurant's hybrid model of 60% walk-in and 40% reservation capacity across 75 seats.

---

## User Roles
- **Host/Hostess** - Primary system user for guest management
- **Shift Supervisor** - Oversight and problem resolution
- **General Manager** - Analytics and strategic planning
- **Server** - Table status updates and guest information

---

## Host/Hostess User Stories

### Reservation Management

**US-R001: View Daily Reservations**
- **As a** Host
- **I want to** view all today's reservations in a timeline format (7 AM - 10 PM)
- **So that I** can plan table assignments and prepare for expected guest arrival times
- **Acceptance Criteria:**
  - Timeline shows breakfast (7-11 AM), lunch (12-4 PM), and dinner (5-10 PM) periods
  - Each reservation displays: party name, size, time, contact number, special requests
  - Different colors for different party sizes (2, 4, 6, 8+ people)
  - Ability to filter by time period or party size

**US-R002: Create New Reservation**
- **As a** Host
- **I want to** quickly add a phone reservation to the system
- **So that I** can confirm availability and secure the booking
- **Acceptance Criteria:**
  - Form requires: name, phone number, party size, preferred time, special requests
  - System shows available time slots near requested time
  - Automatic conflict detection (no overbooking)
  - Confirmation number generation
  - SMS confirmation sent to guest (if phone number provided)

**US-R003: Modify Existing Reservation**
- **As a** Host
- **I want to** change reservation details (time, party size, special requests)
- **So that I** can accommodate guest changes and maintain accurate planning
- **Acceptance Criteria:**
  - Easy search by name, phone, or confirmation number
  - Real-time availability checking when changing time/size
  - Change history tracking (who made changes and when)
  - Automatic notification to guest if contact info available

**US-R004: Cancel Reservation**
- **As a** Host
- **I want to** cancel reservations and automatically free up the table slot
- **So that I** can maximize table utilization for other guests
- **Acceptance Criteria:**
  - Cancellation reason selection (guest request, no-show, restaurant issue)
  - Table slot immediately becomes available for new bookings
  - Cancellation confirmation sent to guest
  - Cancellation logged for reporting purposes

### Walk-in Management

**US-R005: Add Walk-in to Waitlist**
- **As a** Host
- **I want to** add walk-in guests to a digital waitlist with estimated wait time
- **So that I** can manage guest expectations and table turnover efficiently
- **Acceptance Criteria:**
  - Quick entry form: name, party size, phone number (optional)
  - Automatic wait time calculation based on current table status
  - Position number in queue displayed to guest
  - SMS notification capability when table becomes available

**US-R006: Manage Waitlist Queue**
- **As a** Host
- **I want to** see the current waitlist with real-time wait time updates
- **So that I** can provide accurate information to waiting guests
- **Acceptance Criteria:**
  - Live waitlist display ordered by arrival time
  - Wait time automatically recalculates as tables become available
  - Ability to manually adjust wait times based on current situation
  - "Seat Next" button to call the next party
  - No-show tracking (guest called but didn't respond)

### Table Management

**US-R007: Visual Table Layout**
- **As a** Host
- **I want to** see a visual floor plan of all 75 seats with real-time status
- **So that I** can quickly identify available tables and optimize seating
- **Acceptance Criteria:**
  - Interactive restaurant floor plan showing all tables
  - Color-coded table status: Available (green), Occupied (red), Needs Cleaning (yellow)
  - Table details on hover: party name, seating time, server assigned
  - Different table sizes clearly marked (2-top, 4-top, 6-top, etc.)

**US-R008: Seat Guests via Drag & Drop**
- **As a** Host
- **I want to** drag a party (reservation or waitlist) onto an available table
- **So that I** can quickly seat guests and update table status
- **Acceptance Criteria:**
  - Drag reservation or waitlist entry onto table graphic
  - Automatic server assignment based on rotation system
  - Table status changes to "Occupied" with guest details
  - Start time recorded for table turnover tracking
  - Print option for table card with guest name and special requests

**US-R009: Table Status Updates**
- **As a** Host
- **I want to** update table status throughout the service period
- **So that I** can maintain accurate availability for new guests
- **Acceptance Criteria:**
  - Quick status change buttons: "Needs Cleaning," "Available," "Reserved"
  - Estimated cleaning time input (5, 10, 15 minutes)
  - Integration with server system for "Guest Departed" notifications
  - Table turnover time tracking and reporting

### Server Rotation & Assignment

**US-R010: Server Rotation Management**
- **As a** Host
- **I want to** automatically assign servers to new tables based on rotation
- **So that I** can ensure fair distribution of tables among the serving staff
- **Acceptance Criteria:**
  - Current server rotation order displayed
  - Automatic "next server" selection when seating guests
  - Ability to skip a server if they're overloaded
  - Manual override option for special requests
  - Server workload indicator (number of active tables)

---

## Shift Supervisor User Stories

**US-R011: Reservation Override Authority**
- **As a** Shift Supervisor
- **I want to** override table assignments and modify any reservation
- **So that I** can handle complex situations and VIP guest accommodations
- **Acceptance Criteria:**
  - Access to all host functions plus override capabilities
  - Ability to seat parties at "reserved" tables in emergencies
  - VIP guest flagging and priority seating options
  - Override action logging for management review

**US-R012: Real-time Floor Management**
- **As a** Shift Supervisor
- **I want to** monitor table turnover and service timing across all tables
- **So that I** can identify bottlenecks and optimize guest flow
- **Acceptance Criteria:**
  - Dashboard showing average table turn time by period
  - Alert system for tables occupied longer than expected
  - Server performance indicators (tables served, average turn time)
  - Ability to reassign tables between servers if needed

---

## General Manager User Stories

**US-R013: Reservation Analytics Dashboard**
- **As a** General Manager
- **I want to** view reservation patterns and table utilization metrics
- **So that I** can optimize staffing and identify business trends
- **Acceptance Criteria:**
  - Daily/weekly/monthly reservation volume charts
  - Peak time analysis and capacity utilization rates
  - No-show and cancellation rate tracking
  - Average party size trends
  - Revenue correlation with reservation vs. walk-in ratio

**US-R014: Historical Reservation Data**
- **As a** General Manager
- **I want to** access historical reservation and seating data
- **So that I** can forecast demand and plan marketing initiatives
- **Acceptance Criteria:**
  - Searchable reservation history by date range
  - Guest return visit tracking (repeat customer identification)
  - Special event impact analysis (holidays, local events)
  - Export functionality for external analysis

---

## Server User Stories

**US-R015: Table Assignment Notification**
- **As a** Server
- **I want to** receive immediate notification when assigned a new table
- **So that I** can provide prompt greeting and service
- **Acceptance Criteria:**
  - Mobile notification or POS alert when table assigned
  - Guest information display: party size, special requests, seating time
  - Integration with POS system for order management
  - Ability to update table status (guest departed, needs cleaning)

---

## Technical Requirements

### Performance Requirements
- **Response Time:** Page loads under 2 seconds
- **Concurrent Users:** Support 5-10 simultaneous users during peak times
- **Uptime:** 99.5% availability during operating hours
- **Data Backup:** Real-time reservation data backup

### Integration Requirements
- **POS System Integration:** Seamless table-to-order connection
- **SMS Service:** Automated guest notifications
- **Mobile Responsive:** Touch-friendly interface for tablet use
- **Staff Mobile App:** Basic functionality for supervisors and managers

### Security Requirements
- **User Authentication:** Role-based login system
- **Data Privacy:** Guest contact information protection
- **Access Logging:** Track all reservation modifications
- **Session Management:** Automatic logout after inactivity

### Reporting Requirements
- **Daily Reports:** Reservation volume, no-shows, table turnover
- **Weekly Analysis:** Peak time patterns, server performance
- **Monthly Trends:** Capacity utilization, guest return rates
- **Export Options:** CSV/PDF format for external analysis

---

## Business Rules

### Reservation Policies
- **Advance Booking:** Accept reservations up to 30 days in advance
- **Time Slots:** 15-minute intervals for reservation times
- **Party Size Limits:** Maximum 8 people per single reservation
- **Hold Time:** Hold tables for 15 minutes past reservation time
- **Peak Time Priority:** Reservations preferred for Friday/Saturday evenings

### Table Management Rules
- **Capacity Allocation:** 40% reservation, 60% walk-in capacity
- **Table Combinations:** Ability to combine tables for large parties
- **Cleaning Time:** 10-minute standard table cleaning/reset time
- **Service Period Transitions:** 30-minute buffer between meal periods

### Waitlist Management
- **Queue Priority:** First-come, first-served within party size
- **Contact Attempts:** 3 attempts to contact guest before skipping
- **Wait Time Accuracy:** ±10 minutes of estimated wait time
- **Maximum Wait:** 90-minute maximum wait time recommendation