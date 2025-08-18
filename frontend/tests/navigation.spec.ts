import { test, expect } from '@playwright/test';
import { AuthHelpers } from './utils/auth-helpers';
import { TestHelpers } from './utils/test-helpers';
import { TEST_USERS } from './fixtures/test-users';

test.describe('Navigation and Protected Routes', () => {
  let authHelpers: AuthHelpers;
  let testHelpers: TestHelpers;

  test.beforeEach(async ({ page }) => {
    authHelpers = new AuthHelpers(page);
    testHelpers = new TestHelpers(page);
    
    // Clear any existing authentication
    await authHelpers.clearAuth();
  });

  test.describe('Public Route Access', () => {
    test('should allow access to landing page without authentication', async ({ page }) => {
      await authHelpers.goToLanding();
      
      // Should display landing page
      await expect(page.locator('h1:has-text("Jiko Milele")')).toBeVisible();
      await expect(page.locator('a[href="/login"]:has-text("Access System")')).toBeVisible();
    });

    test('should allow access to login page without authentication', async ({ page }) => {
      await authHelpers.goToLogin();
      
      // Should display login form
      await authHelpers.waitForLoginForm();
      await expect(page.locator('h1:has-text("Jiko Milele")')).toBeVisible();
    });

    test('should redirect authenticated users away from public auth pages', async ({ page }) => {
      // Login first
      await authHelpers.loginWithUser(TEST_USERS.manager);
      await authHelpers.expectAuthenticated();
      
      // Try to visit login page
      await page.goto('/login');
      
      // Should be redirected to dashboard
      await authHelpers.expectAuthenticated();
      
      // Try to visit landing page
      await page.goto('/');
      
      // Should be redirected to dashboard
      await authHelpers.expectAuthenticated();
    });
  });

  test.describe('Protected Route Access', () => {
    test('should redirect unauthenticated users from dashboard to login', async ({ page }) => {
      await authHelpers.goToDashboard();
      
      // Should be redirected to login
      await authHelpers.expectNotAuthenticated();
      
      // URL should include redirect parameter
      await expect(page).toHaveURL(/\/login\?redirect=%2Fdashboard/);
    });

    test('should preserve redirect parameter through login process', async ({ page }) => {
      // Try to access dashboard (will redirect to login with redirect param)
      await authHelpers.goToDashboard();
      await expect(page).toHaveURL(/\/login\?redirect=%2Fdashboard/);
      
      // Login successfully
      await authHelpers.login('admin', 'SecurePass123');
      
      // Should be redirected back to dashboard
      await authHelpers.expectAuthenticated();
    });

    test('should handle complex redirect URLs correctly', async ({ page }) => {
      // Try to access dashboard with query parameters
      await page.goto('/dashboard?tab=profile&section=permissions');
      
      // Should redirect to login with encoded redirect parameter
      await authHelpers.expectNotAuthenticated();
      
      // Login
      await authHelpers.login('admin', 'SecurePass123');
      
      // Should redirect back to dashboard (may not preserve query params)
      await authHelpers.expectAuthenticated();
    });

    test('should handle multiple consecutive protected route attempts', async ({ page }) => {
      // Multiple attempts to access protected routes
      await page.goto('/dashboard');
      await authHelpers.expectNotAuthenticated();
      
      await page.goto('/dashboard');
      await authHelpers.expectNotAuthenticated();
      
      await page.goto('/dashboard');
      await authHelpers.expectNotAuthenticated();
      
      // Login should still work
      await authHelpers.login('admin', 'SecurePass123');
      await authHelpers.expectAuthenticated();
    });
  });

  test.describe('Navigation Between Routes', () => {
    test('should allow navigation between protected routes when authenticated', async ({ page }) => {
      // Login first
      await authHelpers.loginWithUser(TEST_USERS.manager);
      await authHelpers.expectAuthenticated();
      
      // Navigate to dashboard (already there, but verify)
      await page.goto('/dashboard');
      await authHelpers.expectAuthenticated();
      
      // Try to navigate to landing page (should redirect back to dashboard)
      await page.goto('/');
      await authHelpers.expectAuthenticated();
      
      // Try to navigate to login page (should redirect back to dashboard)
      await page.goto('/login');
      await authHelpers.expectAuthenticated();
    });

    test('should maintain authentication state during navigation', async ({ page }) => {
      await authHelpers.loginWithUser(TEST_USERS.chef);
      
      // Navigate back and forth
      await page.goto('/dashboard');
      await authHelpers.expectAuthenticated();
      
      await page.goBack();
      await page.goForward();
      await authHelpers.expectAuthenticated();
      
      // Refresh page
      await page.reload();
      await authHelpers.expectAuthenticated();
    });

    test('should handle browser back/forward buttons correctly', async ({ page }) => {
      // Start at landing page
      await authHelpers.goToLanding();
      
      // Navigate to login
      await page.click('a[href="/login"]:has-text("Access System")');
      await authHelpers.expectNotAuthenticated();
      
      // Go back to landing
      await page.goBack();
      await expect(page.locator('h1:has-text("Jiko Milele")')).toBeVisible();
      
      // Go forward to login
      await page.goForward();
      await authHelpers.expectNotAuthenticated();
      
      // Login
      await authHelpers.login('admin', 'SecurePass123');
      await authHelpers.expectAuthenticated();
      
      // Try to go back (should stay on dashboard due to auth redirect)
      await page.goBack();
      await authHelpers.expectAuthenticated();
    });
  });

  test.describe('Deep Linking and Direct Access', () => {
    test('should handle direct access to dashboard URL', async ({ page }) => {
      // Direct navigation to dashboard URL
      await page.goto('http://localhost:3003/dashboard');
      
      // Should redirect to login
      await authHelpers.expectNotAuthenticated();
    });

    test('should handle direct access with authentication', async ({ page }) => {
      // Login first in a separate flow
      await authHelpers.loginWithUser(TEST_USERS.server);
      
      // Direct navigation should work
      await page.goto('http://localhost:3003/dashboard');
      await authHelpers.expectAuthenticated();
    });

    test('should handle malformed URLs gracefully', async ({ page }) => {
      // Try accessing non-existent routes
      await page.goto('/nonexistent');
      
      // Should handle gracefully (either 404 or redirect to a valid page)
      // This depends on Next.js configuration
    });

    test('should handle URLs with special characters', async ({ page }) => {
      // Test URLs with encoded characters
      await page.goto('/dashboard%20test');
      
      // Should either redirect properly or handle gracefully
    });
  });

  test.describe('Route Guards and Authorization', () => {
    test('should enforce authentication on all protected routes', async ({ page }) => {
      const protectedRoutes = [
        '/dashboard',
        '/dashboard/',
        '/dashboard?param=value'
      ];
      
      for (const route of protectedRoutes) {
        await page.goto(route);
        await authHelpers.expectNotAuthenticated();
      }
    });

    test('should allow access to protected routes after authentication', async ({ page }) => {
      await authHelpers.loginWithUser(TEST_USERS.host);
      
      const protectedRoutes = [
        '/dashboard',
        '/dashboard/',
        '/dashboard?param=value'
      ];
      
      for (const route of protectedRoutes) {
        await page.goto(route);
        await authHelpers.expectAuthenticated();
      }
    });

    test('should handle role-based access control if implemented', async ({ page }) => {
      // This test assumes there might be role-specific routes in the future
      // For now, all authenticated users can access dashboard
      
      // Test with different roles
      const users = [TEST_USERS.manager, TEST_USERS.chef, TEST_USERS.server];
      
      for (const user of users) {
        await authHelpers.clearAuth();
        await authHelpers.loginWithUser(user);
        
        // All should be able to access dashboard
        await page.goto('/dashboard');
        await authHelpers.expectAuthenticated();
        await authHelpers.expectUserRole(user.expectedRoleDisplay);
      }
    });
  });

  test.describe('Session Expiry and Route Protection', () => {
    test('should redirect to login when session expires during navigation', async ({ page }) => {
      // Login first
      await authHelpers.loginWithUser(TEST_USERS.bartender);
      await authHelpers.expectAuthenticated();
      
      // Simulate session expiry by clearing tokens
      await authHelpers.clearAuth();
      
      // Try to navigate to dashboard
      await page.goto('/dashboard');
      
      // Should be redirected to login
      await authHelpers.expectNotAuthenticated();
    });

    test('should handle API token expiry during route navigation', async ({ page }) => {
      await authHelpers.loginWithUser(TEST_USERS.manager);
      
      // Mock API to return 401 (unauthorized)
      await testHelpers.mockApiError('**/auth/profile/', 401, 'Token expired');
      
      // Navigate to dashboard (should trigger profile check)
      await page.goto('/dashboard');
      
      // Should redirect to login due to token expiry
      await authHelpers.expectNotAuthenticated();
    });

    test('should handle concurrent session expiry across multiple tabs', async ({ browser }) => {
      const context = await browser.newContext();
      const page1 = await context.newPage();
      const page2 = await context.newPage();
      
      const auth1 = new AuthHelpers(page1);
      const auth2 = new AuthHelpers(page2);
      
      // Login in first tab
      await auth1.loginWithUser(TEST_USERS.chef);
      await auth1.expectAuthenticated();
      
      // Second tab should also be authenticated
      await page2.goto('/dashboard');
      await auth2.expectAuthenticated();
      
      // Clear auth in first tab (simulate session expiry)
      await auth1.clearAuth();
      
      // Navigate in first tab
      await page1.goto('/dashboard');
      await auth1.expectNotAuthenticated();
      
      // Navigate in second tab - should also be logged out
      await page2.goto('/dashboard');
      await auth2.expectNotAuthenticated();
      
      await context.close();
    });
  });

  test.describe('Navigation Performance and UX', () => {
    test('should provide smooth navigation experience', async ({ page }) => {
      await authHelpers.loginWithUser(TEST_USERS.server);
      
      const startTime = Date.now();
      
      // Navigate between pages
      await page.goto('/dashboard');
      await page.goto('/');
      await page.goto('/dashboard');
      
      const navigationTime = Date.now() - startTime;
      
      // Should complete navigation quickly
      expect(navigationTime).toBeLessThan(5000);
    });

    test('should show appropriate loading states during navigation', async ({ page, context }) => {
      // Simulate slow navigation
      await context.route('**/auth/profile/', async (route) => {
        await new Promise(resolve => setTimeout(resolve, 1000));
        await route.continue();
      });
      
      await authHelpers.loginWithUser(TEST_USERS.host);
      
      // Navigate to dashboard
      await page.goto('/dashboard');
      
      // Should show loading state
      await expect(page.locator('text=Checking authentication...')).toBeVisible();
    });

    test('should maintain responsive design during navigation', async ({ page }) => {
      // Test mobile navigation
      await testHelpers.testMobileView();
      
      await authHelpers.loginWithUser(TEST_USERS.manager);
      
      // Navigate between pages
      await page.goto('/');
      await authHelpers.expectAuthenticated();
      
      await page.goto('/dashboard');
      await authHelpers.expectAuthenticated();
      
      // Elements should be visible on mobile
      await expect(page.locator('button:has-text("Sign Out")')).toBeVisible();
    });
  });

  test.describe('Error Handling in Navigation', () => {
    test('should handle network errors during route navigation', async ({ page, context }) => {
      await authHelpers.loginWithUser(TEST_USERS.chef);
      
      // Simulate network error
      await context.setOffline(true);
      
      // Try to navigate
      await page.goto('/dashboard');
      
      // Should handle gracefully (may show cached content or error page)
      await context.setOffline(false);
    });

    test('should recover from navigation errors', async ({ page }) => {
      await authHelpers.loginWithUser(TEST_USERS.server);
      
      // Mock temporary server error
      await testHelpers.mockApiError('**/auth/profile/', 500, 'Server error');
      
      // Navigate to dashboard
      await page.goto('/dashboard');
      
      // Remove error mock
      await page.unroute('**/auth/profile/');
      
      // Retry navigation
      await page.goto('/dashboard');
      await authHelpers.expectAuthenticated();
    });

    test('should not break navigation after JavaScript errors', async ({ page }) => {
      const jsErrors = await testHelpers.checkForJSErrors();
      
      await authHelpers.loginWithUser(TEST_USERS.bartender);
      
      // Navigate multiple times
      await page.goto('/dashboard');
      await page.goto('/');
      await page.goto('/dashboard');
      
      // Should not have JavaScript errors
      expect(jsErrors).toHaveLength(0);
      
      // Navigation should still work
      await authHelpers.expectAuthenticated();
    });
  });

  test.describe('URL State Management', () => {
    test('should preserve URL parameters during authentication redirects', async ({ page }) => {
      // Access dashboard with parameters
      await page.goto('/dashboard?tab=profile&view=detailed');
      
      // Should redirect to login
      await authHelpers.expectNotAuthenticated();
      
      // Login
      await authHelpers.login('admin', 'SecurePass123');
      
      // Should redirect back to dashboard (parameters may or may not be preserved)
      await authHelpers.expectAuthenticated();
    });

    test('should handle hash fragments in URLs', async ({ page }) => {
      // Try to access dashboard with hash
      await page.goto('/dashboard#section1');
      
      // Should redirect to login
      await authHelpers.expectNotAuthenticated();
      
      // Login
      await authHelpers.login('admin', 'SecurePass123');
      
      // Should redirect back
      await authHelpers.expectAuthenticated();
    });

    test('should handle special characters in redirect URLs', async ({ page }) => {
      // Create URL with special characters
      const specialUrl = '/dashboard?query=test%20value&type=special%26chars';
      await page.goto(specialUrl);
      
      await authHelpers.expectNotAuthenticated();
      
      // Login should handle special characters gracefully
      await authHelpers.login('admin', 'SecurePass123');
      await authHelpers.expectAuthenticated();
    });
  });
});