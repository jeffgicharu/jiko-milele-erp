import { test, expect } from '@playwright/test';
import { AuthHelpers } from '../utils/auth-helpers';
import { TestHelpers } from '../utils/test-helpers';
import { TEST_USERS, INVALID_USERS } from '../fixtures/test-users';

test.describe('Login Page', () => {
  let authHelpers: AuthHelpers;
  let testHelpers: TestHelpers;

  test.beforeEach(async ({ page }) => {
    authHelpers = new AuthHelpers(page);
    testHelpers = new TestHelpers(page);
    
    // Clear any existing authentication
    await authHelpers.clearAuth();
    await authHelpers.goToLogin();
  });

  test.describe('Page Structure and Content', () => {
    test('should display login page correctly', async ({ page }) => {
      // Check page title and branding
      await expect(page.locator('h1:has-text("Jiko Milele")')).toBeVisible();
      await expect(page.locator('text=Restaurant Management System')).toBeVisible();
      
      // Check form elements
      await expect(page.locator('#username')).toBeVisible();
      await expect(page.locator('#password')).toBeVisible();
      await expect(page.locator('#rememberMe')).toBeVisible();
      await expect(page.locator('button[type="submit"]')).toBeVisible();
      
      // Check form labels
      await expect(page.locator('label[for="username"]')).toHaveText('Username');
      await expect(page.locator('label[for="password"]')).toHaveText('Password');
      await expect(page.locator('label[for="rememberMe"]')).toHaveText('Remember me for 7 days');
      
      // Check test credentials section
      await expect(page.locator('text=Test Accounts')).toBeVisible();
      await expect(page.locator('text=Manager: admin / admin123')).toBeVisible();
    });

    test('should have proper accessibility features', async ({ page }) => {
      await testHelpers.checkAccessibility();
      
      // Check form accessibility
      await expect(page.locator('#username')).toHaveAttribute('autocomplete', 'username');
      await expect(page.locator('#password')).toHaveAttribute('autocomplete', 'current-password');
      
      // Check that username field is auto-focused
      await expect(page.locator('#username')).toBeFocused();
    });

    test('should be responsive on different screen sizes', async ({ page }) => {
      // Test mobile view
      await testHelpers.testMobileView();
      await expect(page.locator('h1:has-text("Jiko Milele")')).toBeVisible();
      await expect(page.locator('#username')).toBeVisible();
      
      // Test tablet view
      await testHelpers.testTabletView();
      await expect(page.locator('h1:has-text("Jiko Milele")')).toBeVisible();
      
      // Test desktop view
      await testHelpers.testDesktopView();
      await expect(page.locator('h1:has-text("Jiko Milele")')).toBeVisible();
    });
  });

  test.describe('Form Validation', () => {
    test('should show validation errors for empty fields', async ({ page }) => {
      // Try to submit without filling fields
      await page.click('button[type="submit"]');
      
      // Check validation errors
      await expect(page.locator('text=Username is required')).toBeVisible();
      await expect(page.locator('text=Password is required')).toBeVisible();
    });

    test('should show validation error for short password', async ({ page }) => {
      await page.fill('#username', 'admin');
      await page.fill('#password', '123');
      await page.click('button[type="submit"]');
      
      await expect(page.locator('text=Password must be at least 6 characters')).toBeVisible();
    });

    test('should clear field errors when user starts typing', async ({ page }) => {
      // Trigger validation errors
      await page.click('button[type="submit"]');
      await expect(page.locator('text=Username is required')).toBeVisible();
      
      // Start typing in username field
      await page.fill('#username', 'a');
      
      // Username error should disappear
      await expect(page.locator('text=Username is required')).not.toBeVisible();
    });

    test('should validate password field correctly', async ({ page }) => {
      // Test various password lengths
      const passwords = ['1', '12', '123', '1234', '12345'];
      
      for (const password of passwords) {
        await page.fill('#username', 'admin');
        await page.fill('#password', password);
        await page.click('button[type="submit"]');
        
        if (password.length < 6) {
          await expect(page.locator('text=Password must be at least 6 characters')).toBeVisible();
        }
        
        // Clear fields for next iteration
        await page.fill('#password', '');
      }
    });
  });

  test.describe('Password Visibility Toggle', () => {
    test('should toggle password visibility', async ({ page }) => {
      await page.fill('#password', 'testpassword');
      
      // Initially password should be hidden
      await expect(page.locator('#password')).toHaveAttribute('type', 'password');
      
      // Click eye icon to show password
      await page.click('button[tabindex="-1"]');
      await expect(page.locator('#password')).toHaveAttribute('type', 'text');
      
      // Click again to hide password
      await page.click('button[tabindex="-1"]');
      await expect(page.locator('#password')).toHaveAttribute('type', 'password');
    });
  });

  test.describe('Remember Me Functionality', () => {
    test('should toggle remember me checkbox', async ({ page }) => {
      // Initially unchecked
      await authHelpers.expectRememberMeUnchecked();
      
      // Click to check
      await page.click('#rememberMe');
      await authHelpers.expectRememberMeChecked();
      
      // Click to uncheck
      await page.click('#rememberMe');
      await authHelpers.expectRememberMeUnchecked();
    });
  });

  test.describe('Successful Authentication', () => {
    test('should login successfully with manager credentials', async ({ page }) => {
      const user = TEST_USERS.manager;
      
      await authHelpers.login(user.username, user.password);
      
      // Should redirect to dashboard
      await authHelpers.expectAuthenticated();
      await authHelpers.expectUserRole(user.expectedRoleDisplay);
    });

    test('should login successfully with chef credentials', async ({ page }) => {
      const user = TEST_USERS.chef;
      
      await authHelpers.login(user.username, user.password);
      
      // Should redirect to dashboard
      await authHelpers.expectAuthenticated();
      await authHelpers.expectUserRole(user.expectedRoleDisplay);
    });

    test('should login successfully with server credentials', async ({ page }) => {
      const user = TEST_USERS.server;
      
      await authHelpers.login(user.username, user.password);
      
      // Should redirect to dashboard
      await authHelpers.expectAuthenticated();
      await authHelpers.expectUserRole(user.expectedRoleDisplay);
    });

    test('should login successfully with host credentials', async ({ page }) => {
      const user = TEST_USERS.host;
      
      await authHelpers.login(user.username, user.password);
      
      // Should redirect to dashboard
      await authHelpers.expectAuthenticated();
      await authHelpers.expectUserRole(user.expectedRoleDisplay);
    });

    test('should login successfully with bartender credentials', async ({ page }) => {
      const user = TEST_USERS.bartender;
      
      await authHelpers.login(user.username, user.password);
      
      // Should redirect to dashboard
      await authHelpers.expectAuthenticated();
      await authHelpers.expectUserRole(user.expectedRoleDisplay);
    });

    test('should login with remember me option', async ({ page }) => {
      const user = TEST_USERS.manager;
      
      await authHelpers.login(user.username, user.password, true);
      
      // Should redirect to dashboard
      await authHelpers.expectAuthenticated();
    });
  });

  test.describe('Authentication Errors', () => {
    test('should show error for invalid username', async ({ page }) => {
      const invalidUser = INVALID_USERS.invalidUsername;
      
      await authHelpers.login(invalidUser.username, invalidUser.password);
      
      // Should show error message
      const errorMessage = await authHelpers.getGeneralError();
      expect(errorMessage).toContain(invalidUser.expectedError);
      
      // Should remain on login page
      await expect(page).toHaveURL('/login');
    });

    test('should show error for invalid password', async ({ page }) => {
      const invalidUser = INVALID_USERS.invalidPassword;
      
      await authHelpers.login(invalidUser.username, invalidUser.password);
      
      // Should show error message
      const errorMessage = await authHelpers.getGeneralError();
      expect(errorMessage).toContain(invalidUser.expectedError);
      
      // Should remain on login page
      await expect(page).toHaveURL('/login');
    });

    test('should handle server errors gracefully', async ({ page }) => {
      // Mock server error
      await testHelpers.mockApiError('**/auth/login/', 500, 'Server error');
      
      await authHelpers.login('admin', 'SecurePass123');
      
      // Should show error message
      const errorMessage = await authHelpers.getGeneralError();
      expect(errorMessage).toContain('Login failed');
    });

    test('should handle network timeout', async ({ page, context }) => {
      // Simulate very slow network
      await context.route('**/auth/login/', async (route) => {
        await new Promise(resolve => setTimeout(resolve, 10000));
        await route.continue();
      });
      
      await authHelpers.login('admin', 'SecurePass123');
      
      // Should eventually show error or timeout
      // This test might need adjustment based on actual timeout behavior
    });
  });

  test.describe('Loading States', () => {
    test('should show loading state during login', async ({ page, context }) => {
      // Simulate slow login response
      await context.route('**/auth/login/', async (route) => {
        await new Promise(resolve => setTimeout(resolve, 2000));
        await route.continue();
      });
      
      // Start login process
      await page.fill('#username', 'admin');
      await page.fill('#password', 'SecurePass123');
      await page.click('button[type="submit"]');
      
      // Should show loading state
      await authHelpers.expectLoginLoading();
      await authHelpers.expectFormDisabled();
    });

    test('should disable form during submission', async ({ page, context }) => {
      // Simulate slow response
      await context.route('**/auth/login/', async (route) => {
        await new Promise(resolve => setTimeout(resolve, 1000));
        await route.continue();
      });
      
      await page.fill('#username', 'admin');
      await page.fill('#password', 'SecurePass123');
      await page.click('button[type="submit"]');
      
      // Form should be disabled
      await authHelpers.expectFormDisabled();
    });
  });

  test.describe('Account Locked Scenario', () => {
    test('should display account locked message', async ({ page }) => {
      // Navigate to login with locked parameter
      await page.goto('/login?locked=true');
      
      // Should show account locked alert
      await expect(page.locator('text=Account Locked')).toBeVisible();
      await expect(page.locator('text=too many failed login attempts')).toBeVisible();
    });

    test('should handle locked account login error', async ({ page }) => {
      // Mock locked account response
      await testHelpers.mockApiError('**/auth/login/', 423, 'Account is locked');
      
      await authHelpers.login('admin', 'SecurePass123');
      
      // Should show locked account error
      const errorMessage = await authHelpers.getGeneralError();
      expect(errorMessage).toContain('Account is locked');
    });
  });

  test.describe('Redirect Functionality', () => {
    test('should redirect to intended page after login', async ({ page }) => {
      // Navigate to login with redirect parameter
      await page.goto('/login?redirect=%2Fdashboard');
      
      // Login successfully
      await authHelpers.login('admin', 'SecurePass123');
      
      // Should redirect to dashboard
      await authHelpers.expectAuthenticated();
    });

    test('should redirect authenticated users to dashboard', async ({ page }) => {
      // First login
      await authHelpers.login('admin', 'SecurePass123');
      await authHelpers.expectAuthenticated();
      
      // Try to visit login page again
      await page.goto('/login');
      
      // Should be redirected to dashboard
      await authHelpers.expectAuthenticated();
    });
  });

  test.describe('Security Features', () => {
    test('should not expose sensitive information in DOM', async ({ page }) => {
      await page.fill('#password', 'secretpassword');
      
      // Check that password is not visible in DOM when type=password
      const passwordValue = await page.locator('#password').inputValue();
      expect(passwordValue).toBe('secretpassword');
      
      // But the actual display should be obscured
      await expect(page.locator('#password')).toHaveAttribute('type', 'password');
    });

    test('should clear password field on navigation', async ({ page }) => {
      await page.fill('#password', 'testpassword');
      
      // Navigate away and back
      await page.goto('/');
      await page.goto('/login');
      
      // Password field should be empty
      const passwordValue = await page.locator('#password').inputValue();
      expect(passwordValue).toBe('');
    });
  });
});