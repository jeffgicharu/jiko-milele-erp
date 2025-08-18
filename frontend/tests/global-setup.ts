import { chromium, FullConfig } from '@playwright/test';

async function globalSetup(config: FullConfig) {
  // Start a browser to warm up
  const browser = await chromium.launch();
  await browser.close();

  console.log('Global setup completed');
}

export default globalSetup;