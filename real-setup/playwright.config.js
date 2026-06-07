// real-setup/playwright.config.js
const { defineConfig } = require('@playwright/test');

module.exports = defineConfig({
  // Playwright now runs directly inside real-setup/, so ./tests maps perfectly!
  testDir: './tests',
  fullyParallel: true,
  retries: 0,
  workers: 2,

  reporter: [
    ['line'],
    // Places results clearly inside real-setup/allure-results for your CI action pipeline
    ['allure-playwright', { outputFolder: 'allure-results' }]
  ],

  webServer: {
    command: 'node backend/server.js',
    url: 'http://localhost:5000', // Ping the base URL path instead of a sub-route to prevent early 401/404 startup drops
    reuseExistingServer: !process.env.CI,
    timeout: 30000, 
  },

  use: {
    extraHTTPHeaders: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'x-api-key': 'prod-secret-gate-key' // Matches the validation header key of your local backend server script
    },
  },
});