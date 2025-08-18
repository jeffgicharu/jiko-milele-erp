import { test, expect } from '@playwright/test';
import { AuthHelpers } from '../utils/auth-helpers';
import { TestHelpers } from '../utils/test-helpers';
import { TEST_USERS } from '../fixtures/test-users';

test.describe('Dashboard Page', () => {
  let authHelpers: AuthHelpers;
  let testHelpers: TestHelpers;

  test.beforeEach(async ({ page }) => {
    authHelpers = new AuthHelpers(page);
    testHelpers = new TestHelpers(page);
    
    // Clear any existing authentication
    await authHelpers.clearAuth();
  });

  test.describe('Protected Route Access', () => {
    test('should redirect unauthenticated users to login', async ({ page }) => {
      // Try to access dashboard without authentication
      await authHelpers.goToDashboard();
      
      // Should be redirected to login
      await authHelpers.expectNotAuthenticated();
      
      // URL should include redirect parameter
      await expect(page).toHaveURL(/\/login\?redirect=.*dashboard/);
    });

    test('should allow authenticated users to access dashboard', async ({ page }) => {
      // Login first
      await authHelpers.loginWithUser(TEST_USERS.manager);
      
      // Should be on dashboard
      await authHelpers.expectAuthenticated();
      await authHelpers.waitForDashboard();
    });

    test('should maintain authentication on page refresh', async ({ page }) => {
      // Login and go to dashboard
      await authHelpers.loginWithUser(TEST_USERS.manager);
      await authHelpers.expectAuthenticated();
      
      // Refresh page
      await page.reload();
      
      // Should still be authenticated
      await authHelpers.expectAuthenticated();
    });
  });

  test.describe('Common Dashboard Elements', () => {
    test('should display header with user info and logout button', async ({ page }) => {
      await authHelpers.loginWithUser(TEST_USERS.manager);
      
      // Check header elements
      await expect(page.locator('text=Jiko Milele')).toBeVisible();
      await expect(page.locator('button:has-text("Sign Out")')).toBeVisible();
      
      // Check user info display
      await expect(page.locator(`text=${TEST_USERS.manager.username}`)).toBeVisible();
      await expect(page.locator(`text=${TEST_USERS.manager.expectedRoleDisplay}`)).toBeVisible();
    });

    test('should display welcome message with current date', async ({ page }) => {
      await authHelpers.loginWithUser(TEST_USERS.server);
      
      // Check welcome message
      await expect(page.locator('text=Welcome back')).toBeVisible();
      
      // Check current date display
      const currentDate = new Date().toLocaleDateString('en-US', { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      });
      await expect(page.locator(`text=${currentDate}`)).toBeVisible();
    });

    test('should display user profile sidebar', async ({ page }) => {
      await authHelpers.loginWithUser(TEST_USERS.chef);
      
      // Check profile section
      await expect(page.locator('text=Your Profile')).toBeVisible();
      await expect(page.locator('text=Username')).toBeVisible();
      await expect(page.locator('text=Email')).toBeVisible();
      await expect(page.locator('text=Role')).toBeVisible();
      await expect(page.locator('text=Last Login')).toBeVisible();
    });

    test('should display permissions section', async ({ page }) => {
      await authHelpers.loginWithUser(TEST_USERS.manager);
      
      // Check permissions section
      await expect(page.locator('text=Your Permissions')).toBeVisible();
    });

    test('should display quick stats section', async ({ page }) => {
      await authHelpers.loginWithUser(TEST_USERS.host);
      
      // Check quick stats
      await expect(page.locator('text=Quick Stats')).toBeVisible();
      await expect(page.locator('text=Account Status')).toBeVisible();
      await expect(page.locator('text=Active')).toBeVisible();
      await expect(page.locator('text=Failed Logins')).toBeVisible();
      await expect(page.locator('text=Member Since')).toBeVisible();
    });
  });

  test.describe('Role-Based Dashboard Content', () => {
    test('should display manager dashboard for general manager', async ({ page }) => {
      await authHelpers.loginWithUser(TEST_USERS.manager);
      
      // Check manager-specific content
      await authHelpers.expectManagerDashboard();
      
      // Check specific manager features
      await expect(page.locator('text=Financial Reports')).toBeVisible();
      await expect(page.locator('text=Revenue, costs, and profit analysis')).toBeVisible();
      await expect(page.locator('text=Staff Management')).toBeVisible();
      await expect(page.locator('text=Schedules, performance, payroll')).toBeVisible();
      await expect(page.locator('text=System Settings')).toBeVisible();
      await expect(page.locator('text=Operations')).toBeVisible();
    });

    test('should display kitchen dashboard for chef', async ({ page }) => {
      await authHelpers.loginWithUser(TEST_USERS.chef);
      
      // Check kitchen-specific content
      await authHelpers.expectKitchenDashboard();
      
      // Check specific kitchen features
      await expect(page.locator('text=Active Orders')).toBeVisible();
      await expect(page.locator('text=Kitchen display system')).toBeVisible();
      await expect(page.locator('text=Inventory')).toBeVisible();
      await expect(page.locator('text=Ingredients and supplies')).toBeVisible();
      await expect(page.locator('text=Recipes')).toBeVisible();
      await expect(page.locator('text=Food Costs')).toBeVisible();
    });

    test('should display FOH dashboard for server', async ({ page }) => {
      await authHelpers.loginWithUser(TEST_USERS.server);
      
      // Check FOH-specific content
      await authHelpers.expectFOHDashboard();
      
      // Check specific FOH features
      await expect(page.locator('text=Table Management')).toBeVisible();
      await expect(page.locator('text=Seating and table status')).toBeVisible();
      await expect(page.locator('text=Point of Sale')).toBeVisible();
      await expect(page.locator('text=Order taking and payments')).toBeVisible();
      await expect(page.locator('text=Customers')).toBeVisible();
      await expect(page.locator('text=Reservations')).toBeVisible();
    });

    test('should display FOH dashboard for host', async ({ page }) => {
      await authHelpers.loginWithUser(TEST_USERS.host);
      
      // Check FOH-specific content
      await authHelpers.expectFOHDashboard();
      await authHelpers.expectUserRole(TEST_USERS.host.expectedRoleDisplay);
    });

    test('should display FOH dashboard for bartender', async ({ page }) => {
      await authHelpers.loginWithUser(TEST_USERS.bartender);
      
      // Check FOH-specific content
      await authHelpers.expectFOHDashboard();
      await authHelpers.expectUserRole(TEST_USERS.bartender.expectedRoleDisplay);
    });
  });

  test.describe('Role Icons and Badges', () => {
    test('should display correct icon for manager role', async ({ page }) => {
      await authHelpers.loginWithUser(TEST_USERS.manager);
      
      // Manager should have shield icon (represented by specific styling)
      await expect(page.locator('text=GENERAL MANAGER')).toBeVisible();
    });

    test('should display correct icon for chef role', async ({ page }) => {
      await authHelpers.loginWithUser(TEST_USERS.chef);
      
      // Chef should have chef hat icon
      await expect(page.locator('text=HEAD CHEF')).toBeVisible();
    });

    test('should display correct badge colors for different roles', async ({ page }) => {
      // Test manager badge color (red)
      await authHelpers.loginWithUser(TEST_USERS.manager);
      const managerBadge = page.locator('text=GENERAL MANAGER');
      await expect(managerBadge).toHaveClass(/bg-red-100/);
      
      // Test chef badge color (purple)
      await authHelpers.clearAuth();
      await authHelpers.loginWithUser(TEST_USERS.chef);
      const chefBadge = page.locator('text=HEAD CHEF');
      await expect(chefBadge).toHaveClass(/bg-purple-100/);
      
      // Test server badge color (blue)
      await authHelpers.clearAuth();
      await authHelpers.loginWithUser(TEST_USERS.server);
      const serverBadge = page.locator('text=SERVER');
      await expect(serverBadge).toHaveClass(/bg-blue-100/);
    });
  });

  test.describe('Logout Functionality', () => {
    test('should logout successfully and redirect to login', async ({ page }) => {
      await authHelpers.loginWithUser(TEST_USERS.manager);
      await authHelpers.expectAuthenticated();
      
      // Logout
      await authHelpers.logout();
      
      // Should be redirected to login
      await authHelpers.expectNotAuthenticated();
    });

    test('should show loading state during logout', async ({ page, context }) => {
      await authHelpers.loginWithUser(TEST_USERS.manager);
      
      // Simulate slow logout
      await context.route('**/auth/logout/', async (route) => {
        await new Promise(resolve => setTimeout(resolve, 1000));
        await route.continue();
      });
      
      // Start logout
      await page.click('button:has-text("Sign Out")');
      
      // Should show loading state
      await expect(page.locator('text=Signing out...')).toBeVisible();
    });

    test('should clear authentication tokens on logout', async ({ page }) => {
      await authHelpers.loginWithUser(TEST_USERS.manager);
      
      // Verify tokens exist
      const tokensBeforeLogout = await page.evaluate(() => ({
        access: localStorage.getItem('access_token'),
        refresh: localStorage.getItem('refresh_token')
      }));
      expect(tokensBeforeLogout.access).toBeTruthy();
      expect(tokensBeforeLogout.refresh).toBeTruthy();
      
      // Logout
      await authHelpers.logout();
      
      // Verify tokens are cleared
      const tokensAfterLogout = await page.evaluate(() => ({
        access: localStorage.getItem('access_token'),
        refresh: localStorage.getItem('refresh_token')
      }));
      expect(tokensAfterLogout.access).toBeNull();
      expect(tokensAfterLogout.refresh).toBeNull();
    });
  });

  test.describe('Responsive Design', () => {
    test('should be responsive on mobile devices', async ({ page }) => {
      await testHelpers.testMobileView();
      await authHelpers.loginWithUser(TEST_USERS.manager);
      
      // Check that dashboard is usable on mobile
      await expect(page.locator('text=Welcome back')).toBeVisible();
      await expect(page.locator('button:has-text("Sign Out")')).toBeVisible();
    });

    test('should be responsive on tablet devices', async ({ page }) => {
      await testHelpers.testTabletView();
      await authHelpers.loginWithUser(TEST_USERS.chef);
      
      // Check that dashboard layout works on tablet
      await expect(page.locator('text=Kitchen Management')).toBeVisible();
      await expect(page.locator('text=Your Profile')).toBeVisible();
    });
  });

  test.describe('Error Handling', () => {
    test('should handle API errors gracefully', async ({ page }) => {
      await authHelpers.loginWithUser(TEST_USERS.manager);
      
      // Mock API error for profile fetch
      await testHelpers.mockApiError('**/auth/profile/', 500, 'Server error');
      
      // Refresh page to trigger profile fetch
      await page.reload();
      
      // Should handle error gracefully (might redirect to login or show error)
      // This depends on error handling implementation
    });

    test('should handle network connectivity issues', async ({ page, context }) => {
      await authHelpers.loginWithUser(TEST_USERS.server);
      
      // Simulate network failure
      await context.setOffline(true);
      
      // Try to logout (should handle network error)
      await page.click('button:has-text("Sign Out")');
      
      // Should still clear local tokens even if server logout fails
      await context.setOffline(false);
    });
  });

  test.describe('Performance and UX', () => {
    test('should load dashboard quickly', async ({ page }) => {
      const startTime = Date.now();
      
      await authHelpers.loginWithUser(TEST_USERS.manager);
      await authHelpers.waitForDashboard();
      
      const loadTime = Date.now() - startTime;
      
      // Should load within reasonable time
      expect(loadTime).toBeLessThan(10000); // 10 seconds
    });

    test('should display loading states appropriately', async ({ page, context }) => {
      // Simulate slow authentication check
      await context.route('**/auth/profile/', async (route) => {
        await new Promise(resolve => setTimeout(resolve, 1000));
        await route.continue();
      });
      
      await authHelpers.goToDashboard();
      
      // Should show loading state
      await expect(page.locator('text=Checking authentication...')).toBeVisible();
    });

    test('should not have JavaScript errors', async ({ page }) => {
      const jsErrors = await testHelpers.checkForJSErrors();
      
      await authHelpers.loginWithUser(TEST_USERS.chef);
      await testHelpers.waitForPageLoad();
      
      // Check that no JavaScript errors occurred
      expect(jsErrors).toHaveLength(0);
    });
  });

  test.describe('User Information Display', () => {
    test('should display correct user information for each role', async ({ page }) => {
      for (const [roleName, userData] of Object.entries(TEST_USERS)) {
        // Clear previous session
        await authHelpers.clearAuth();
        
        // Login with current user
        await authHelpers.loginWithUser(userData);
        
        // Verify user information is displayed correctly
        await expect(page.locator(`text=${userData.username}`)).toBeVisible();
        await expect(page.locator(`text=${userData.expectedRoleDisplay}`)).toBeVisible();
      }
    });

    test('should handle missing user data gracefully', async ({ page }) => {
      await authHelpers.loginWithUser(TEST_USERS.manager);
      
      // Mock API to return user with missing fields
      await page.route('**/auth/profile/', async (route) => {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            username: 'testuser',
            email: '',
            profile: {
              current_role: 'server',
              staff_name: null,
              permissions: []
            }
          })
        });
      });
      
      await page.reload();
      
      // Should handle missing data gracefully
      await expect(page.locator('text=testuser')).toBeVisible();
    });
  });
});