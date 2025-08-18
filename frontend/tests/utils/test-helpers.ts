import { Page, expect, BrowserContext } from '@playwright/test';

export class TestHelpers {
  constructor(private page: Page) {}

  /**
   * Wait for page to be fully loaded
   */
  async waitForPageLoad() {
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Wait for element to be visible with timeout
   */
  async waitForElement(selector: string, timeout: number = 5000) {
    await this.page.waitForSelector(selector, { timeout });
  }

  /**
   * Check if element exists without waiting
   */
  async elementExists(selector: string): Promise<boolean> {
    return (await this.page.locator(selector).count()) > 0;
  }

  /**
   * Simulate slow network for testing loading states
   */
  async simulateSlowNetwork(context: BrowserContext) {
    await context.route('**/*', async (route) => {
      await new Promise(resolve => setTimeout(resolve, 1000));
      await route.continue();
    });
  }

  /**
   * Mock API responses
   */
  async mockApiError(url: string, status: number, message: string) {
    await this.page.route(url, async (route) => {
      await route.fulfill({
        status,
        contentType: 'application/json',
        body: JSON.stringify({ detail: message })
      });
    });
  }

  /**
   * Intercept and log network requests
   */
  async interceptRequests() {
    this.page.on('request', request => {
      console.log('REQUEST:', request.method(), request.url());
    });
    
    this.page.on('response', response => {
      console.log('RESPONSE:', response.status(), response.url());
    });
  }

  /**
   * Clear all browser data
   */
  async clearBrowserData(context: BrowserContext) {
    await context.clearCookies();
    await this.page.evaluate(() => {
      localStorage.clear();
      sessionStorage.clear();
    });
  }

  /**
   * Get console logs
   */
  async getConsoleLogs(): Promise<string[]> {
    const logs: string[] = [];
    this.page.on('console', msg => {
      logs.push(`${msg.type()}: ${msg.text()}`);
    });
    return logs;
  }

  /**
   * Check for JavaScript errors
   */
  async checkForJSErrors(): Promise<string[]> {
    const errors: string[] = [];
    this.page.on('pageerror', error => {
      errors.push(error.message);
    });
    return errors;
  }

  /**
   * Verify page accessibility
   */
  async checkAccessibility() {
    // Check for basic accessibility requirements
    await expect(this.page.locator('h1')).toBeVisible();
    
    // Check for proper form labels
    const inputs = await this.page.locator('input').count();
    for (let i = 0; i < inputs; i++) {
      const input = this.page.locator('input').nth(i);
      const id = await input.getAttribute('id');
      if (id) {
        await expect(this.page.locator(`label[for="${id}"]`)).toBeVisible();
      }
    }
  }

  /**
   * Test responsive design
   */
  async testMobileView() {
    await this.page.setViewportSize({ width: 375, height: 667 }); // iPhone SE
  }

  async testTabletView() {
    await this.page.setViewportSize({ width: 768, height: 1024 }); // iPad
  }

  async testDesktopView() {
    await this.page.setViewportSize({ width: 1920, height: 1080 }); // Full HD
  }

  /**
   * Verify loading states
   */
  async expectLoadingSpinner() {
    await expect(this.page.locator('[class*="animate-spin"]')).toBeVisible();
  }

  async expectNoLoadingSpinner() {
    await expect(this.page.locator('[class*="animate-spin"]')).not.toBeVisible();
  }
}