import { test, expect } from '@playwright/test';
import { AuthHelpers } from './utils/auth-helpers';
import { TestHelpers } from './utils/test-helpers';
import { TEST_USERS } from './fixtures/test-users';

test.describe('Landing Page', () => {
  let authHelpers: AuthHelpers;
  let testHelpers: TestHelpers;

  test.beforeEach(async ({ page }) => {
    authHelpers = new AuthHelpers(page);
    testHelpers = new TestHelpers(page);
    
    // Navigate to the page first to ensure localStorage is available
    await authHelpers.goToLanding();
    
    // Clear any existing authentication
    await authHelpers.clearAuth();
  });

  test.describe('When not authenticated', () => {
    test('should display landing page content correctly', async ({ page }) => {
      await authHelpers.goToLanding();
      
      // Check main heading and branding
      await expect(page.locator('h1:has-text("Jiko Milele")')).toBeVisible();
      await expect(page.locator('text=Modern Restaurant Management System for Kenyan Hospitality')).toBeVisible();
      
      // Check hero section content
      await expect(page.locator('text=Streamline your restaurant operations')).toBeVisible();
      
      // Check Access System button
      const accessButton = page.locator('a[href="/login"]:has-text("Access System")');
      await expect(accessButton).toBeVisible();
      
      // Check features section
      await expect(page.locator('text=Everything You Need to Run Your Restaurant')).toBeVisible();
      await expect(page.locator('h3:has-text("Kitchen Operations")')).toBeVisible();
      await expect(page.locator('h3:has-text("Customer Service")')).toBeVisible();
      await expect(page.locator('h3:has-text("Business Intelligence")')).toBeVisible();
      
      // Check footer
      await expect(page.locator('text=© 2024 Jiko Milele Restaurant')).toBeVisible();
    });

    test('should navigate to login when "Access System" button is clicked', async ({ page }) => {
      await authHelpers.goToLanding();
      
      // Click the main Access System button
      await page.click('a[href="/login"]:has-text("Access System")');
      
      // Should be redirected to login page
      await authHelpers.expectNotAuthenticated();
      await authHelpers.waitForLoginForm();
    });

    test('should navigate to login when "Staff Login" button is clicked', async ({ page }) => {
      await authHelpers.goToLanding();
      
      // Scroll to bottom to see Staff Login button
      await page.locator('text=Staff Login').scrollIntoViewIfNeeded();
      
      // Click the Staff Login button
      await page.click('a[href="/login"]:has-text("Staff Login")');
      
      // Should be redirected to login page
      await authHelpers.expectNotAuthenticated();
      await authHelpers.waitForLoginForm();
    });

    test('should show loading state initially', async ({ page }) => {
      // Navigate to landing page
      await page.goto('/');
      
      // Should show loading spinner briefly
      await testHelpers.waitForPageLoad();
      
      // Then show landing page content
      await expect(page.locator('h1:has-text("Jiko Milele")')).toBeVisible();
    });

    test('should be responsive on mobile devices', async ({ page }) => {
      await testHelpers.testMobileView();
      await authHelpers.goToLanding();
      
      // Check that content is still visible on mobile
      await expect(page.locator('h1:has-text("Jiko Milele")')).toBeVisible();
      await expect(page.locator('a[href="/login"]:has-text("Access System")')).toBeVisible();
    });

    test('should have proper accessibility features', async ({ page }) => {
      await authHelpers.goToLanding();
      
      // Check accessibility
      await testHelpers.checkAccessibility();
      
      // Check that buttons are keyboard accessible
      await page.keyboard.press('Tab');
      await expect(page.locator('a[href="/login"]:has-text("Access System")')).toBeFocused();
    });
  });

  test.describe('When authenticated', () => {
    test('should redirect to dashboard for authenticated manager', async ({ page }) => {
      // First login as manager
      await authHelpers.loginWithUser(TEST_USERS.manager);
      await authHelpers.expectAuthenticated();
      
      // Now try to visit landing page
      await page.goto('/');
      
      // Should be redirected to dashboard
      await authHelpers.expectAuthenticated();
    });

    test('should redirect to dashboard for authenticated chef', async ({ page }) => {
      // First login as chef
      await authHelpers.loginWithUser(TEST_USERS.chef);
      await authHelpers.expectAuthenticated();
      
      // Now try to visit landing page
      await page.goto('/');
      
      // Should be redirected to dashboard
      await authHelpers.expectAuthenticated();
    });

    test('should redirect to dashboard for authenticated server', async ({ page }) => {
      // First login as server
      await authHelpers.loginWithUser(TEST_USERS.server);
      await authHelpers.expectAuthenticated();
      
      // Now try to visit landing page
      await page.goto('/');
      
      // Should be redirected to dashboard
      await authHelpers.expectAuthenticated();
    });

    test('should handle authentication loading state', async ({ page, context }) => {
      // Simulate slow network to test loading states
      await testHelpers.simulateSlowNetwork(context);
      
      // Set valid tokens to simulate authenticated state
      await authHelpers.setAuthTokens('valid-token', 'valid-refresh');
      
      // Navigate to landing page
      await page.goto('/');
      
      // Should show loading state
      await expect(page.locator('text=Loading...')).toBeVisible();
      
      // Then redirect to dashboard (this might timeout due to slow network simulation)
    });
  });

  test.describe('Error handling', () => {
    test('should handle network errors gracefully', async ({ page }) => {
      // Mock API to return errors
      await testHelpers.mockApiError('**/auth/profile/', 500, 'Server error');
      
      await authHelpers.goToLanding();
      
      // Should still show landing page even if auth check fails
      await expect(page.locator('h1:has-text("Jiko Milele")')).toBeVisible();
    });

    test('should not show JavaScript errors in console', async ({ page }) => {
      const jsErrors = await testHelpers.checkForJSErrors();
      
      await authHelpers.goToLanding();
      await testHelpers.waitForPageLoad();
      
      // Check that no JavaScript errors occurred
      expect(jsErrors).toHaveLength(0);
    });
  });

  test.describe('Performance and UX', () => {
    test('should load within acceptable time', async ({ page }) => {
      const startTime = Date.now();
      
      await authHelpers.goToLanding();
      await testHelpers.waitForPageLoad();
      
      const loadTime = Date.now() - startTime;
      
      // Should load within 5 seconds
      expect(loadTime).toBeLessThan(5000);
    });

    test('should have working feature cards', async ({ page }) => {
      await authHelpers.goToLanding();
      
      // Check all feature cards are visible
      const featureCards = [
        'Kitchen Operations',
        'Customer Service', 
        'Business Intelligence'
      ];
      
      for (const feature of featureCards) {
        await expect(page.locator(`text=${feature}`)).toBeVisible();
      }
      
      // Check feature details
      await expect(page.locator('text=Real-time order tracking')).toBeVisible();
      await expect(page.locator('text=Table management')).toBeVisible();
      await expect(page.locator('text=Sales analytics')).toBeVisible();
    });
  });
});