// playwright.config.js
import { defineConfig } from '@playwright/test';
import path from 'path';
import { fileURLToPath } from 'url';

// 🔹 ES module me __dirname handle karne ke liye
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig({
  testDir: './tests',
  timeout: 0,
  expect: { timeout: 10000 },

  // Reporter setup: list in console + html report in existing Reports folder
  reporter: [
    ['list'],
    ['html', { outputFolder: path.join(__dirname, 'Reports/playwright-report') }]
  ],

  projects: [
    {
      name: 'chromium',
      use: {
        browserName: 'chromium',
        headless: false,
        viewport: null, // use real window size
        launchOptions: {
          args: ['--start-maximized'], // full screen window
        },

        // ✅ screenshots & videos
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
    actionTimeout: 0,
    baseURL: 'https://login.salesforce.com',
  },
});
