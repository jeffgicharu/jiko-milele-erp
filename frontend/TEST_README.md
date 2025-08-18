# Jiko Milele ERP Frontend Authentication Test Suite

This comprehensive Playwright test suite covers all aspects of the Jiko Milele Restaurant ERP frontend authentication system.

## 🎯 Test Coverage

### System Under Test
- **Frontend URL**: http://localhost:3003
- **Backend API**: http://localhost:8001
- **Framework**: Next.js React application

### Test User Credentials
| Role | Username | Password | Role Code | Description |
|------|----------|----------|-----------|-------------|
| Manager | admin | SecurePass123 | general_manager | Full system access |
| Chef | chef | SecurePass123 | head_chef | Kitchen management access |
| Server | server1 | SecurePass123 | server | Front-of-house access |
| Host | host | SecurePass123 | host | Customer service access |
| Bartender | bartender | SecurePass123 | bartender | Bar operations access |

## 📋 Test Suites

### 1. Landing Page Tests (`tests/landing.spec.ts`)
**Coverage**: Landing page (/) functionality
- ✅ Page loads and displays correctly when not authenticated
- ✅ "Access System" button navigates to login
- ✅ Redirect to dashboard when already authenticated
- ✅ Loading states and responsive design
- ✅ Accessibility features
- ✅ Error handling and performance

### 2. Login Page Tests (`tests/auth/login.spec.ts`)
**Coverage**: Login page (/login) functionality
- ✅ Form validation (empty fields, invalid input)
- ✅ Successful login with valid credentials for all roles
- ✅ Error handling for invalid credentials
- ✅ "Remember me" checkbox functionality
- ✅ Password visibility toggle
- ✅ Account locked scenario testing
- ✅ Loading states and form disable during submission
- ✅ Security features and accessibility

### 3. Dashboard Tests (`tests/auth/dashboard.spec.ts`)
**Coverage**: Dashboard page (/dashboard) functionality
- ✅ Protected route access (redirect when not authenticated)
- ✅ Role-based dashboard content for different user types
- ✅ User profile information display
- ✅ Logout functionality
- ✅ Role icons and badges
- ✅ Responsive design
- ✅ Error handling and performance

### 4. Authentication Flow Tests (`tests/auth/auth-flows.spec.ts`)
**Coverage**: Complete authentication workflows
- ✅ Complete login-to-dashboard-to-logout flow for all roles
- ✅ Session persistence and token management
- ✅ Token refresh behavior
- ✅ Protected route navigation flows
- ✅ Cross-role authentication flows
- ✅ Error recovery flows
- ✅ Remember me functionality
- ✅ Security flow testing

### 5. Navigation Tests (`tests/navigation.spec.ts`)
**Coverage**: Navigation and route protection
- ✅ Public route access (landing, login)
- ✅ Protected route access and redirects
- ✅ Navigation between routes when authenticated
- ✅ Deep linking and direct access
- ✅ Session expiry during navigation
- ✅ URL state management
- ✅ Performance and error handling

## 🛠️ Test Infrastructure

### Test Utilities
- **AuthHelpers** (`tests/utils/auth-helpers.ts`): Authentication-specific test utilities
- **TestHelpers** (`tests/utils/test-helpers.ts`): General testing utilities
- **Test Users** (`tests/fixtures/test-users.ts`): Test user data and credentials

### Configuration
- **Playwright Config** (`playwright.config.ts`): Test execution configuration
- **Global Setup** (`tests/global-setup.ts`): Pre-test setup
- **Global Teardown** (`tests/global-teardown.ts`): Post-test cleanup

## 🚀 Running Tests

### Prerequisites
1. Install dependencies:
   ```bash
   npm install
   ```

2. Install Playwright browsers:
   ```bash
   npx playwright install
   ```

3. Ensure both frontend and backend servers are running:
   ```bash
   # Frontend (port 3003)
   npm run dev
   
   # Backend (port 8001)
   cd ../backend && python manage.py runserver 8001
   ```

### Test Commands

```bash
# Run all tests
npm run test

# Run tests with visible browser
npm run test:headed

# Run tests in debug mode
npm run test:debug

# Run tests with Playwright UI
npm run test:ui

# View test report
npm run test:report
```

### Running Specific Test Suites

```bash
# Run only landing page tests
npx playwright test tests/landing.spec.ts

# Run only login tests
npx playwright test tests/auth/login.spec.ts

# Run only dashboard tests
npx playwright test tests/auth/dashboard.spec.ts

# Run only authentication flow tests
npx playwright test tests/auth/auth-flows.spec.ts

# Run only navigation tests
npx playwright test tests/navigation.spec.ts
```

## 📊 Test Reports

### Available Reports
- **HTML Report**: `playwright-report/index.html` - Interactive test results
- **JUnit Report**: `playwright-report/results.xml` - CI/CD integration
- **Screenshots**: `test-results/screenshots/` - Failure screenshots
- **Videos**: `test-results/` - Test execution videos

### Viewing Reports
```bash
# Open HTML report
npm run test:report

# Or manually open
open playwright-report/index.html
```

## 🎯 Test Scenarios Covered

### Login Page Scenarios
1. **Form Validation**:
   - Empty username/password fields
   - Password too short (< 6 characters)
   - Real-time validation error clearing

2. **Successful Authentication**:
   - Manager login with general_manager role
   - Chef login with head_chef role
   - Server login with server role
   - Host login with host role
   - Bartender login with bartender role

3. **Error Handling**:
   - Invalid username
   - Invalid password
   - Server errors (500, 401, 403)
   - Network timeouts
   - Account locked scenarios

4. **UI/UX Features**:
   - Password visibility toggle
   - Remember me checkbox
   - Loading states during authentication
   - Form disable during submission

### Dashboard Scenarios
1. **Role-Based Content**:
   - Manager: Financial reports, staff management, system settings
   - Chef: Kitchen management, orders, inventory, recipes
   - Server/Host/Bartender: Front-of-house operations

2. **User Information Display**:
   - Username, email, role display
   - Last login information
   - Permissions and quick stats
   - Role-specific icons and badges

3. **Protected Route Access**:
   - Redirect unauthenticated users to login
   - Maintain authentication on page refresh
   - Handle session expiry gracefully

### Authentication Flow Scenarios
1. **Complete Workflows**:
   - Landing → Login → Dashboard → Logout
   - Direct dashboard access → Login redirect → Dashboard
   - Cross-role switching scenarios

2. **Session Management**:
   - Token storage and retrieval
   - Session persistence across page refreshes
   - Token refresh handling
   - Concurrent session handling

3. **Security Testing**:
   - Manual token removal
   - Tampered token handling
   - Network error recovery

## 🔧 Configuration Details

### Browser Support
- Chromium (Desktop Chrome)
- Firefox (Desktop Firefox)
- WebKit (Desktop Safari)
- Mobile Chrome (Pixel 5)
- Mobile Safari (iPhone 12)

### Test Settings
- **Base URL**: http://localhost:3003
- **Timeout**: 30 seconds per test
- **Retries**: 2 retries on CI, 0 locally
- **Parallel Execution**: Enabled
- **Screenshots**: On failure
- **Videos**: On failure
- **Traces**: On first retry

### Server Configuration
The test suite automatically starts both frontend and backend servers:
- Frontend: `npm run dev` on port 3003
- Backend: `python manage.py runserver 8001` on port 8001

## 📈 Test Metrics

### Coverage Areas
- **Authentication**: Login, logout, session management
- **Authorization**: Role-based access control
- **Navigation**: Route protection, redirects
- **UI/UX**: Form validation, loading states, responsive design
- **Error Handling**: Network errors, server errors, validation errors
- **Performance**: Load times, navigation speed
- **Security**: Token handling, session security
- **Accessibility**: Keyboard navigation, screen reader support

### Test Count by Category
- Landing Page: ~15 tests
- Login Functionality: ~25 tests
- Dashboard Features: ~20 tests
- Authentication Flows: ~20 tests
- Navigation & Routes: ~25 tests
- **Total**: ~105 comprehensive test scenarios

## 🚨 Troubleshooting

### Common Issues

1. **Tests failing due to server not running**:
   ```bash
   # Start backend server
   cd ../backend && python manage.py runserver 8001
   
   # Start frontend server
   npm run dev
   ```

2. **Browser installation issues**:
   ```bash
   # Reinstall browsers
   npx playwright install --force
   ```

3. **Port conflicts**:
   - Ensure ports 3003 and 8001 are available
   - Kill any existing processes on these ports

4. **Network timeouts**:
   - Check internet connection
   - Increase timeout in playwright.config.ts if needed

### Debug Mode
Run tests in debug mode to step through test execution:
```bash
npm run test:debug
```

### Test Isolation
Each test runs in isolation with:
- Fresh browser context
- Cleared authentication state
- Independent test data

## 📝 Contributing

### Adding New Tests
1. Create test file in appropriate directory
2. Use existing utilities (AuthHelpers, TestHelpers)
3. Follow naming convention: `*.spec.ts`
4. Update this README with new test coverage

### Test Best Practices
- Use descriptive test names
- Group related tests in describe blocks
- Clear authentication state in beforeEach
- Use page object patterns via helpers
- Add appropriate assertions and waits

### Utility Functions
Leverage existing helper functions:
- `authHelpers.login()` - Login with credentials
- `authHelpers.logout()` - Logout user
- `authHelpers.expectAuthenticated()` - Verify dashboard access
- `testHelpers.waitForPageLoad()` - Wait for page ready
- `testHelpers.checkAccessibility()` - Verify accessibility

## 🏆 Success Criteria

All tests should pass with:
- ✅ All authentication flows working correctly
- ✅ All role-based features accessible
- ✅ All error scenarios handled gracefully
- ✅ All UI components responsive and accessible
- ✅ All security measures functioning properly
- ✅ Performance within acceptable limits
- ✅ No JavaScript errors in browser console

---

**Test Suite Version**: 1.0  
**Last Updated**: 2024-08-18  
**Playwright Version**: ^1.54.2  
**Node.js Version**: >=16.0.0