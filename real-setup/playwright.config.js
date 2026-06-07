// real-setup/playwright.config.js
const { defineConfig } = require('@playwright/test');
const path = require('path');

module.exports = defineConfig({
  // 🛠️ Directs Playwright strictly to your subfolder test cases
  testDir: path.resolve(__dirname, 'tests'),
  fullyParallel: true,
  retries: 0,
  workers: 2,

  reporter: [
    ['line'],
    // 🛠️ Forces raw report data into the folder tracked by your workflow configuration
    ['allure-playwright', { outputFolder: path.resolve(__dirname, 'allure-results') }]
  ],

  webServer: {
    // 🛠️ FIX: Clean path target execution using explicit folder transitions
    command: 'cd real-setup && node backend/server.js',
    url: 'http://localhost:5000/api/v1/orders', // Pings an active endpoint route for a reliable container readiness check
    reuseExistingServer: !process.env.CI,
    timeout: 30000, 
  },

  use: {
    // 🛠️ FIX: Directs your automated tests to use the correct validation key expected by your local backend server
    extraHTTPHeaders: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'x-api-key': 'prod-secret-gate-key'
    },
  },
});