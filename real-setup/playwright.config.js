const { defineConfig } = require('@playwright/test');

module.exports = defineConfig({
  testDir: './tests', // Evaluates tests relative to this file's location (real-setup/tests)
  fullyParallel: true,
  retries: 0,
  workers: 2,

  reporter: [
    ['line'],
    ['allure-playwright', { outputFolder: 'allure-results' }] // Drops data into real-setup/allure-results
  ],

  webServer: {
    command: 'node backend/server.js',
    url: 'http://localhost:5000/', // CHANGED: Points to the new healthy endpoint instead of the intentional 500 error route
    reuseExistingServer: !process.env.CI,
    timeout: 15000, // CHANGED: Increased to 15s to handle resource provisioning delays on GitHub runner systems
  },

  use: {
    extraHTTPHeaders: { 'Accept': 'application/json' },
  },
});