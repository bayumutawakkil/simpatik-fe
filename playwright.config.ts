import { defineConfig, devices } from '@playwright/test';

/**
 * Playwright E2E configuration for Simpatik
 */
export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: false,
  workers: 1,
  forbidOnly: !!process.env.CI,
  retries: 0,
  reporter: [
    ['html', { outputFolder: 'playwright-report', open: 'never' }],
    ['list']
  ],
  use: {
    baseURL: 'http://localhost:8443',
    trace: 'on',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],

  webServer: [
    {
      command: 'npm --prefix ../be dev',
      url: 'http://localhost:4000/api/siswa',
      reuseExistingServer: true,
      timeout: 30000,
    },
    {
      command: 'npm run dev',
      url: 'http://localhost:8443',
      reuseExistingServer: true,
      timeout: 30000,
    },
  ],
});
