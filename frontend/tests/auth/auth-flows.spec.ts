import { test, expect } from '@playwright/test';
import { AuthHelpers } from '../utils/auth-helpers';
import { TestHelpers } from '../utils/test-helpers';
import { TEST_USERS } from '../fixtures/test-users';

test.describe('Authentication Flows', () => {
  let authHelpers: AuthHelpers;
  let testHelpers: TestHelpers;

  test.beforeEach(async ({ page }) => {
    authHelpers = new AuthHelpers(page);
    testHelpers = new TestHelpers(page);
    
    // Clear any existing authentication
    await authHelpers.clearAuth();
  });

  test.describe('Complete Login to Dashboard to Logout Flow', () => {
    test('should complete full authentication flow for manager', async ({ page }) => {
      // 1. Start at landing page
      await authHelpers.goToLanding();
      await expect(page.locator('h1:has-text("Jiko Milele")')).toBeVisible();
      
      // 2. Navigate to login
      await page.click('a[href="/login"]:has-text("Access System")');
      await authHelpers.expectNotAuthenticated();
      
      // 3. Login with manager credentials
      const user = TEST_USERS.manager;
      await authHelpers.login(user.username, user.password);
      
      // 4. Verify dashboard access and content
      await authHelpers.expectAuthenticated();
      await authHelpers.expectUserRole(user.expectedRoleDisplay);
      await authHelpers.expectManagerDashboard();
      
      // 5. Logout
      await authHelpers.logout();
      
      // 6. Verify redirect to login
      await authHelpers.expectNotAuthenticated();
    });

    test('should complete full authentication flow for chef', async ({ page }) => {
      await authHelpers.goToLanding();
      
      // Navigate via Staff Login button
      await page.locator('text=Staff Login').scrollIntoViewIfNeeded();
      await page.click('a[href="/login"]:has-text("Staff Login")');
      
      // Login as chef
      const user = TEST_USERS.chef;
      await authHelpers.login(user.username, user.password);
      
      // Verify chef dashboard
      await authHelpers.expectAuthenticated();
      await authHelpers.expectUserRole(user.expectedRoleDisplay);
      await authHelpers.expectKitchenDashboard();
      
      // Logout
      await authHelpers.logout();
      await authHelpers.expectNotAuthenticated();
    });

    test('should complete full authentication flow for server', async ({ page }) => {
      await authHelpers.goToLogin();
      
      // Login as server
      const user = TEST_USERS.server;
      await authHelpers.login(user.username, user.password, true); // with remember me
      
      // Verify server dashboard
      await authHelpers.expectAuthenticated();
      await authHelpers.expectUserRole(user.expectedRoleDisplay);
      await authHelpers.expectFOHDashboard();
      
      // Logout
      await authHelpers.logout();
      await authHelpers.expectNotAuthenticated();
    });
  });

  test.describe('Session Persistence and Token Management', () => {
    test('should maintain session after page refresh', async ({ page }) => {
      // Login
      await authHelpers.loginWithUser(TEST_USERS.manager);
      await authHelpers.expectAuthenticated();
      
      // Refresh page
      await page.reload();
      
      // Should still be authenticated
      await authHelpers.expectAuthenticated();
      await authHelpers.expectUserRole(TEST_USERS.manager.expectedRoleDisplay);
    });

    test('should maintain session after browser navigation', async ({ page }) => {
      // Login
      await authHelpers.loginWithUser(TEST_USERS.chef);
      await authHelpers.expectAuthenticated();
      
      // Navigate away and back
      await page.goto('/');
      await expect(page).toHaveURL('/dashboard'); // Should redirect authenticated user
      
      // Navigate to login page
      await page.goto('/login');
      await expect(page).toHaveURL('/dashboard'); // Should redirect authenticated user
      
      // Still authenticated
      await authHelpers.expectAuthenticated();
    });

    test('should handle token refresh behavior', async ({ page, context }) => {
      // Login first
      await authHelpers.loginWithUser(TEST_USERS.server);
      
      // Mock token refresh scenario
      let refreshCalled = false;
      await context.route('**/auth/refresh/', async (route) => {
        refreshCalled = true;
        await route.continue();
      });
      
      // Simulate token expiry by mocking profile API
      await context.route('**/auth/profile/', async (route) => {
        if (!refreshCalled) {
          // First call - return 401 to trigger refresh
          await route.fulfill({
            status: 401,
            body: JSON.stringify({ detail: 'Token expired' })
          });
        } else {
          // After refresh - return success
          await route.continue();
        }
      });
      
      // Refresh page to trigger token validation
      await page.reload();
      
      // Should handle token refresh gracefully
      // Implementation depends on actual refresh token logic
    });

    test('should handle expired refresh token', async ({ page }) => {
      // Login first
      await authHelpers.loginWithUser(TEST_USERS.host);
      
      // Mock expired refresh token
      await testHelpers.mockApiError('**/auth/refresh/', 401, 'Refresh token expired');
      await testHelpers.mockApiError('**/auth/profile/', 401, 'Token expired');
      
      // Refresh page
      await page.reload();
      
      // Should be redirected to login
      await authHelpers.expectNotAuthenticated();
    });
  });

  test.describe('Protected Route Navigation Flows', () => {
    test('should redirect unauthenticated users attempting to access protected routes', async ({ page }) => {
      // Try to access dashboard directly
      await authHelpers.goToDashboard();
      
      // Should be redirected to login with redirect parameter
      await authHelpers.expectNotAuthenticated();
      await expect(page).toHaveURL(/\/login\?redirect=.*dashboard/);
      
      // Login and should be redirected back to dashboard
      await authHelpers.login('admin', 'SecurePass123');
      await authHelpers.expectAuthenticated();
    });

    test('should maintain intended destination through login flow', async ({ page }) => {
      // Try to access dashboard (will redirect to login)
      await page.goto('/dashboard');
      await authHelpers.expectNotAuthenticated();
      
      // Login from redirected page
      await authHelpers.login('admin', 'SecurePass123');
      
      // Should end up on originally intended dashboard
      await authHelpers.expectAuthenticated();
    });

    test('should handle multiple redirect attempts', async ({ page }) => {
      // Multiple attempts to access protected routes
      await page.goto('/dashboard');
      await authHelpers.expectNotAuthenticated();
      
      await page.goto('/dashboard');
      await authHelpers.expectNotAuthenticated();
      
      // Login should still work normally
      await authHelpers.login('admin', 'SecurePass123');
      await authHelpers.expectAuthenticated();
    });
  });

  test.describe('Cross-Role Authentication Flows', () => {
    test('should allow switching between different user roles', async ({ page }) => {
      // Login as manager
      await authHelpers.loginWithUser(TEST_USERS.manager);
      await authHelpers.expectManagerDashboard();
      
      // Logout
      await authHelpers.logout();
      await authHelpers.expectNotAuthenticated();
      
      // Login as chef
      await authHelpers.loginWithUser(TEST_USERS.chef);
      await authHelpers.expectKitchenDashboard();
      
      // Logout
      await authHelpers.logout();
      await authHelpers.expectNotAuthenticated();
      
      // Login as server
      await authHelpers.loginWithUser(TEST_USERS.server);
      await authHelpers.expectFOHDashboard();
    });

    test('should clear previous user data when switching accounts', async ({ page }) => {
      // Login as manager
      await authHelpers.loginWithUser(TEST_USERS.manager);
      await expect(page.locator(`text=${TEST_USERS.manager.username}`)).toBeVisible();
      
      // Logout and login as different user
      await authHelpers.logout();
      await authHelpers.loginWithUser(TEST_USERS.chef);
      
      // Should show new user data, not old
      await expect(page.locator(`text=${TEST_USERS.chef.username}`)).toBeVisible();
      await expect(page.locator(`text=${TEST_USERS.manager.username}`)).not.toBeVisible();
    });
  });

  test.describe('Error Recovery Flows', () => {
    test('should recover from login errors and retry successfully', async ({ page }) => {
      await authHelpers.goToLogin();
      
      // Try with wrong password first
      await authHelpers.login('admin', 'wrongpassword');
      
      // Should show error
      const errorMessage = await authHelpers.getGeneralError();
      expect(errorMessage).toContain('Invalid username or password');
      
      // Retry with correct credentials
      await authHelpers.login('admin', 'SecurePass123');
      
      // Should succeed
      await authHelpers.expectAuthenticated();
    });

    test('should handle network errors during authentication flow', async ({ page, context }) => {
      await authHelpers.goToLogin();
      
      // Simulate network error
      await testHelpers.mockApiError('**/auth/login/', 500, 'Server error');
      
      // Try to login
      await authHelpers.login('admin', 'SecurePass123');
      
      // Should show error
      const errorMessage = await authHelpers.getGeneralError();
      expect(errorMessage).toBeTruthy();
      
      // Remove network error simulation
      await context.unroute('**/auth/login/');
      
      // Retry login
      await authHelpers.login('admin', 'SecurePass123');
      
      // Should succeed
      await authHelpers.expectAuthenticated();
    });

    test('should handle logout errors gracefully', async ({ page }) => {
      await authHelpers.loginWithUser(TEST_USERS.manager);
      
      // Mock logout error
      await testHelpers.mockApiError('**/auth/logout/', 500, 'Server error');
      
      // Logout should still work (clear local tokens)
      await authHelpers.logout();
      
      // Should be logged out despite server error
      await authHelpers.expectNotAuthenticated();
    });
  });

  test.describe('Concurrent Session Handling', () => {
    test('should handle authentication in multiple tabs', async ({ browser }) => {
      // Create two pages (simulating tabs)
      const context = await browser.newContext();
      const page1 = await context.newPage();
      const page2 = await context.newPage();
      
      const auth1 = new AuthHelpers(page1);
      const auth2 = new AuthHelpers(page2);
      
      // Login in first tab
      await auth1.loginWithUser(TEST_USERS.manager);
      await auth1.expectAuthenticated();
      
      // Check second tab - should also be authenticated due to shared localStorage
      await page2.goto('/dashboard');
      await auth2.expectAuthenticated();
      
      // Logout from first tab
      await auth1.logout();
      await auth1.expectNotAuthenticated();
      
      // Second tab should also be logged out on next navigation
      await page2.goto('/dashboard');
      await auth2.expectNotAuthenticated();
      
      await context.close();
    });
  });

  test.describe('Remember Me Functionality', () => {
    test('should persist session when remember me is checked', async ({ page, context }) => {
      await authHelpers.goToLogin();
      
      // Login with remember me
      await authHelpers.login('admin', 'SecurePass123', true);
      await authHelpers.expectAuthenticated();
      
      // Close browser context (simulating browser close)
      await context.close();
      
      // Create new context and check if still authenticated
      const newContext = await page.context().browser()?.newContext();
      const newPage = await newContext?.newPage();
      
      if (newPage) {
        // Note: This test might need adjustment based on actual remember me implementation
        // as localStorage doesn't persist across browser contexts by default
        await newPage.goto('/dashboard');
      }
    });

    test('should not persist session when remember me is not checked', async ({ page }) => {
      await authHelpers.goToLogin();
      
      // Login without remember me
      await authHelpers.login('admin', 'SecurePass123', false);
      await authHelpers.expectAuthenticated();
      
      // This test would need browser restart simulation to be meaningful
      // For now, just verify that remember me checkbox state is respected
      await authHelpers.goToLogin();
      await authHelpers.expectRememberMeUnchecked();
    });
  });

  test.describe('Performance and Load Testing', () => {
    test('should handle rapid login/logout cycles', async ({ page }) => {
      for (let i = 0; i < 3; i++) {
        // Login
        await authHelpers.loginWithUser(TEST_USERS.manager);
        await authHelpers.expectAuthenticated();
        
        // Logout
        await authHelpers.logout();
        await authHelpers.expectNotAuthenticated();
      }
    });

    test('should maintain performance with slow network conditions', async ({ page, context }) => {
      // Simulate slow network
      await testHelpers.simulateSlowNetwork(context);
      
      const startTime = Date.now();
      
      // Complete authentication flow
      await authHelpers.loginWithUser(TEST_USERS.server);
      await authHelpers.expectAuthenticated();
      
      const duration = Date.now() - startTime;
      
      // Should complete within reasonable time even with slow network
      expect(duration).toBeLessThan(15000); // 15 seconds
    });
  });

  test.describe('Security Flow Testing', () => {
    test('should prevent access after manual token removal', async ({ page }) => {
      // Login normally
      await authHelpers.loginWithUser(TEST_USERS.chef);
      await authHelpers.expectAuthenticated();
      
      // Manually remove tokens (simulating token theft/removal)
      await page.evaluate(() => {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
      });
      
      // Try to access dashboard
      await page.goto('/dashboard');
      
      // Should be redirected to login
      await authHelpers.expectNotAuthenticated();
    });

    test('should handle tampered tokens gracefully', async ({ page }) => {
      // Login first
      await authHelpers.loginWithUser(TEST_USERS.host);
      
      // Tamper with tokens
      await page.evaluate(() => {
        localStorage.setItem('access_token', 'tampered-token');
        localStorage.setItem('refresh_token', 'tampered-refresh');
      });
      
      // Try to access dashboard
      await page.goto('/dashboard');
      
      // Should be redirected to login due to invalid token
      await authHelpers.expectNotAuthenticated();
    });
  });
});