// real-setup/playwright.config.js
const { defineConfig } = require('@playwright/test');
const path = require('path');

module.exports = defineConfig({
  // 🛠️ FIX: Explicitly direct Playwright to search inside the subfolder's test directory
  testDir: path.resolve(__dirname, 'tests'),
  fullyParallel: true,
  retries: 0,
  workers: 2,

  reporter: [
    ['line'],
    // 🛠️ FIX: Forces results into the subfolder so your GitHub Actions CI step can read it safely
    ['allure-playwright', { outputFolder: path.resolve(__dirname, 'allure-results') }]
  ],

  webServer: {
    command: 'node real-setup/backend/server.js', // Adjusted runtime path for root execution context
    url: 'http://localhost:5000/',
    reuseExistingServer: !process.env.CI,
    timeout: 15000, 
  },

  use: {
    extraHTTPHeaders: { 'Accept': 'application/json' },
  },
});