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
    command: 'node real-setup/backend/server.js',
    url: 'http://localhost:5000/api/v1/sync/legacy-erp',
    reuseExistingServer: !process.env.CI,
    timeout: 10000,
  },

  use: {
    extraHTTPHeaders: { 'Accept': 'application/json' },
  },
});