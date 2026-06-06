// real-setup/playwright-real.config.js
const { defineConfig } = require('@playwright/test');

module.exports = defineConfig({
  testDir: './tests', 
  fullyParallel: true,
  retries: 0,
  workers: 2,

  reporter: [
    ['line'],
    // 🛠️ FIX: Forces the reporter to isolate results in a designated subdirectory path
    ['allure-playwright', { outputFolder: 'real-setup/allure-results' }]
  ],

  webServer: {
    command: 'node backend/server.js',
    url: 'http://localhost:5000/',
    reuseExistingServer: !process.env.CI,
    timeout: 15000, 
  },

  use: {
    extraHTTPHeaders: { 'Accept': 'application/json' },
  },
});