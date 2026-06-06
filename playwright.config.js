// playwright.config.js
const { defineConfig } = require('@playwright/test');

module.exports = defineConfig({
  testDir: './tests',
  fullyParallel: true,
  retries: 1,
  workers: 1, // Keep workers at 1 for serial state handling!

  reporter: [
    ['line'],
    ['allure-playwright', { outputFolder: 'allure-results' }]
  ],

  use: {
    baseURL: 'https://reqres.in',
    extraHTTPHeaders: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      // Dynamic fallback: reads locally via environment variables, or defaults blank
      'x-api-key': process.env.REQRES_API_KEY || '', 
    },
  },
});