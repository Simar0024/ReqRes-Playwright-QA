// tests/enterprise-api.spec.js
const { test, expect } = require('@playwright/test');
const { allure } = require('allure-playwright');

test.describe('Enterprise Microservices Integration & Quality Gate Suite', () => {
  test.describe.configure({ mode: 'parallel' }); // Run these tests concurrently to simulate load

  const config = {
    headers: { 'x-api-key': 'prod-secret-gate-key', 'Content-Type': 'application/json' },
    targetUrl: 'http://localhost:5000'
  };

  test('TC-001: Process High-Value Order Checkout - Success Path', async ({ request }) => {
    allure.epic('Billing & Procurement');
    allure.feature('Order Placement');
    allure.severity('Critical');

    const response = await request.post(`${config.targetUrl}/api/v1/orders`, {
      headers: config.headers,
      data: { itemId: 101, quantity: 2, userEmail: "simarjit@devops.infra" }
    });

    expect(response.status()).toBe(201);
    const body = await response.json();
    expect(body.status).toBe("success");
    expect(body).toHaveProperty('orderId');
  });

  test('TC-002: Reject Checkout Order when Stock is Deficient - Expected 400 Client Error', async ({ request }) => {
    allure.epic('Billing & Procurement');
    allure.feature('Inventory Guards');
    allure.severity('Normal');

    const response = await request.post(`${config.targetUrl}/api/v1/orders`, {
      headers: config.headers,
      data: { itemId: 102, quantity: 10, userEmail: "tester@qa.internal" } // Item 102 has 0 stock
    });

    // We expect a 400 Bad Request. Testing the error handler logic.
    expect(response.status()).toBe(400);
    const body = await response.json();
    expect(body.error).toBe("Bad Request");
    expect(body.message).toContain("Insufficient stock");
  });

  test('TC-003: Decline Transaction on Missing Security Credentials - Expected 401 Unauthorized', async ({ request }) => {
    allure.epic('Security Engineering');
    allure.feature('Gateway Authentication');
    allure.severity('Blocker');

    const response = await request.post(`${config.targetUrl}/api/v1/orders`, {
      headers: { 'Content-Type': 'application/json' }, // Omitting the x-api-key header intentionally
      data: { itemId: 101, quantity: 1, userEmail: "anonymous@hacker.net" }
    });

    expect(response.status()).toBe(401);
    const body = await response.json();
    expect(body.error).toBe("Unauthorized");
  });

  test('TC-004: Sync Legacy ERP Accounting Engine - Intentional System Crash Trigger (500 Error)', async ({ request }) => {
    allure.epic('Infrastructure & Synchronization');
    allure.feature('ERP Bridge Ledger');
    allure.severity('Minor');

    const response = await request.get(`${config.targetUrl}/api/v1/sync/legacy-erp`);

    // To show an authentic system crash inside Allure, we intentionally make an assertion 
    // that expects a 200 OK, but the server will return a 500 Internal Error.
    // This creates a realistic "Failed" test case inside your Allure metrics dashboard!
    expect(response.status()).toBe(200); 
  });
});