import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: 'playwright/tests',
  timeout: 30 * 1000,
  use: {
    baseURL: 'http://127.0.0.1:3000',
    trace: 'on-first-retry',
  },
  webServer: {
    command: 'npm start',
    port: 3000,
    reuseExistingServer: !process.env.CI,
    timeout: 60 * 1000,
  },
});
