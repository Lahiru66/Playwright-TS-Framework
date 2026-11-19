import { defineConfig, devices } from '@playwright/test';
import { env } from './config/env';

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  /* Fail the build on CI if test.only is left in the source. */
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [['html'], ['allure-playwright', { resultsDir: 'allure-results' }]],
  use: {
    baseURL: env.baseUrl,
    /* Sauce Demo marks test hooks with data-test instead of data-testid. */
    testIdAttribute: 'data-test',
    trace: 'on-first-retry',
  },
  /* Chromium only, by design. */
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
});
