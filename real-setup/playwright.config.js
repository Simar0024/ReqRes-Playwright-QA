// real-setup/playwright.config.js
const { defineConfig } = require('@playwright/test');

module.exports = defineConfig({
  testDir: './tests', 
  fullyParallel: true,
  retries: 0,
  workers: 2,

  reporter: [
    ['line'],
    // 🛠️ FIX: Directs results to the isolated real-setup subfolder to prevent root directory clobbering
    ['allure-playwright', { outputFolder: 'real-setup/allure-results' }]
  ],

  webServer: {
    command: 'node backend/server.js',
    url: 'http://localhost:5000/',
    reuseExistingServer: !process.env.CI,
    timeout: 15000, 
  },

  use: {
   extraHTTPHeaders: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      // Dynamic fallback: reads locally via environment variables, or defaults blank
      'x-api-key': process.env.REQRES_API_KEY || '', 
    },
  },
});