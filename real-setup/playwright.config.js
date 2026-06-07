// real-setup/playwright.config.js
const { defineConfig } = require('@playwright/test');

module.exports = defineConfig({
  testDir: './tests',
  fullyParallel: true,
  retries: 0,
  workers: 2,

  reporter: [
    ['line'],
    ['allure-playwright', { outputFolder: 'allure-results' }]
  ],

  webServer: {
    command: 'node backend/server.js',
    url: 'http://localhost:5000', 
    reuseExistingServer: !process.env.CI,
    timeout: 30000, 
  },

  use: {
    // 🛠️ FIX: Standard headers only. No global authentication injection.
    extraHTTPHeaders: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
  },
});