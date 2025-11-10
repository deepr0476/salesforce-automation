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

        headless: false,            // GUI mode
        viewport: null,             // use full window
        screen: { width: 1920, height: 1080 }, // screen size
        ignoreHTTPSErrors: true,

        screenshot: 'only-on-failure',        // screenshots
        video: {
          mode: 'retain-on-failure',
          dir: path.join(__dirname, 'Reports/videos'), // videos
        },
        trace: 'retain-on-failure',

        launchOptions: {
          args: ['--start-maximized'], // force browser maximize
        },
      },
    },
  ],
  use: {
    baseURL: 'https://login.salesforce.com',
    actionTimeout: 0,
    // 📌 optionally force device scale factor
    deviceScaleFactor: 1,
  },
});
