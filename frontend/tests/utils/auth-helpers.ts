import { Page, expect } from '@playwright/test';
import { TestUser } from '../fixtures/test-users';

export class AuthHelpers {
  constructor(private page: Page) {}

  /**
   * Navigate to login page
   */
  async goToLogin() {
    await this.page.goto('/login');
    await expect(this.page).toHaveURL('/login');
  }

  /**
   * Navigate to landing page
   */
  async goToLanding() {
    await this.page.goto('/');
    await expect(this.page).toHaveURL('/');
  }

  /**
   * Navigate to dashboard
   */
  async goToDashboard() {
    await this.page.goto('/dashboard');
  }

  /**
   * Login with provided credentials
   */
  async login(username: string, password: string, rememberMe: boolean = false) {
    // Fill login form
    await this.page.fill('#username', username);
    await this.page.fill('#password', password);
    
    if (rememberMe) {
      await this.page.check('#rememberMe');
    }

    // Submit form
    await this.page.click('button[type="submit"]');
  }

  /**
   * Login with test user
   */
  async loginWithUser(user: TestUser, rememberMe: boolean = false) {
    await this.goToLogin();
    await this.login(user.username, user.password, rememberMe);
  }

  /**
   * Logout user
   */
  async logout() {
    // Look for logout button and click it
    const logoutButton = this.page.locator('button:has-text("Sign Out")');
    await expect(logoutButton).toBeVisible();
    await logoutButton.click();
  }

  /**
   * Check if user is authenticated (on dashboard)
   */
  async expectAuthenticated() {
    await expect(this.page).toHaveURL('/dashboard');
    await expect(this.page.locator('text=Welcome back')).toBeVisible();
  }

  /**
   * Check if user is not authenticated (redirected to login)
   */
  async expectNotAuthenticated() {
    await expect(this.page).toHaveURL(/\/login/);
    await expect(this.page.locator('h1:has-text("Jiko Milele")')).toBeVisible();
    await expect(this.page.locator('text=Restaurant Management System')).toBeVisible();
  }

  /**
   * Wait for login form to be ready
   */
  async waitForLoginForm() {
    await expect(this.page.locator('#username')).toBeVisible();
    await expect(this.page.locator('#password')).toBeVisible();
    await expect(this.page.locator('button[type="submit"]')).toBeVisible();
  }

  /**
   * Wait for dashboard to load
   */
  async waitForDashboard() {
    await expect(this.page.locator('text=Welcome back')).toBeVisible();
    await expect(this.page.locator('button:has-text("Sign Out")')).toBeVisible();
  }

  /**
   * Clear local storage (simulate logout)
   */
  async clearAuth() {
    try {
      await this.page.evaluate(() => {
        if (typeof window !== 'undefined' && window.localStorage) {
          localStorage.removeItem('access_token');
          localStorage.removeItem('refresh_token');
        }
      });
    } catch (error) {
      // Ignore localStorage errors in test setup
      console.log('clearAuth: localStorage not available, skipping');
    }
  }

  /**
   * Set authentication tokens (simulate login)
   */
  async setAuthTokens(accessToken: string, refreshToken: string) {
    try {
      await this.page.evaluate(({ access, refresh }) => {
        if (typeof window !== 'undefined' && window.localStorage) {
          localStorage.setItem('access_token', access);
          localStorage.setItem('refresh_token', refresh);
        }
      }, { access: accessToken, refresh: refreshToken });
    } catch (error) {
      // Ignore localStorage errors in test setup
      console.log('setAuthTokens: localStorage not available, skipping');
    }
  }

  /**
   * Get form validation errors
   */
  async getFormErrors() {
    const errors: Record<string, string> = {};
    
    const usernameError = await this.page.locator('input#username + p.text-red-500').textContent();
    if (usernameError) errors.username = usernameError;
    
    const passwordError = await this.page.locator('input#password + p.text-red-500').textContent();
    if (passwordError) errors.password = passwordError;
    
    return errors;
  }

  /**
   * Get general error message
   */
  async getGeneralError() {
    const errorElement = this.page.locator('[class*="bg-red-50"] p');
    if (await errorElement.isVisible()) {
      return await errorElement.textContent();
    }
    return null;
  }

  /**
   * Check if loading state is shown
   */
  async expectLoginLoading() {
    await expect(this.page.locator('text=Signing in...')).toBeVisible();
  }

  /**
   * Check if form is disabled during submission
   */
  async expectFormDisabled() {
    await expect(this.page.locator('#username')).toBeDisabled();
    await expect(this.page.locator('#password')).toBeDisabled();
    await expect(this.page.locator('button[type="submit"]')).toBeDisabled();
  }

  /**
   * Check remember me checkbox state
   */
  async expectRememberMeChecked() {
    await expect(this.page.locator('#rememberMe')).toBeChecked();
  }

  async expectRememberMeUnchecked() {
    await expect(this.page.locator('#rememberMe')).not.toBeChecked();
  }

  /**
   * Verify user role on dashboard
   */
  async expectUserRole(expectedRole: string) {
    await expect(this.page.locator(`text=${expectedRole}`)).toBeVisible();
  }

  /**
   * Verify role-based dashboard content
   */
  async expectManagerDashboard() {
    await expect(this.page.locator('text=Management Dashboard')).toBeVisible();
    await expect(this.page.locator('text=Financial Reports')).toBeVisible();
    await expect(this.page.locator('text=Staff Management')).toBeVisible();
  }

  async expectKitchenDashboard() {
    await expect(this.page.locator('text=Kitchen Management')).toBeVisible();
    await expect(this.page.locator('text=Active Orders')).toBeVisible();
    await expect(this.page.locator('text=Inventory')).toBeVisible();
  }

  async expectFOHDashboard() {
    await expect(this.page.locator('text=Front of House')).toBeVisible();
    await expect(this.page.locator('text=Table Management')).toBeVisible();
    await expect(this.page.locator('text=Point of Sale')).toBeVisible();
  }

  /**
   * Take screenshot for debugging
   */
  async takeScreenshot(name: string) {
    await this.page.screenshot({ path: `test-results/screenshots/${name}.png`, fullPage: true });
  }
}