import { defineConfig, devices } from '@playwright/test';
import path from 'path';
import { fileURLToPath } from 'url';

// 🔹 ES module me __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig({
  testDir: './tests',
  timeout: 0,
  expect: { timeout: 10000 },
  reporter: [['list'], ['html', { outputFolder: 'Reports/playwright-report' }]],
  projects: [
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        headless: false,
        viewport: { width: 1920, height: 1080 },
        ignoreHTTPSErrors: true,
        screenshot: 'only-on-failure',
        video: {
          mode: 'retain-on-failure',
          dir: path.join(__dirname, 'Reports/videos'),
        },
        trace: 'retain-on-failure',
      },
    },
  ],
  use: {
    baseURL: 'https://login.salesforce.com',
    actionTimeout: 0,
  },
});
