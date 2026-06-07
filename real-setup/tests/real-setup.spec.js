// real-setup/tests/real-setup.spec.js
const { test, expect } = require('@playwright/test');

test.describe('Enterprise Microservices Integration & Quality Gate Suite', () => {

  // TC-001: Success Path (Pass Key Explicitly)
  test('TC-001: Process High-Value Order Checkout - Success Path', async ({ request }) => {
    const response = await request.post('http://localhost:5000/api/v1/orders', {
      headers: { 'x-api-key': 'prod-secret-gate-key' }, // 🛠️ Explicit Authentication
      data: {
        itemId: 101,
        quantity: 2,
        userEmail: 'simarjit.devops@example.com'
      }
    });

    expect(response.status()).toBe(201);
    const body = await response.json();
    expect(body.status).toBe('success');
    expect(body.orderId).stringContaining;
  });

  // TC-002: Stock Deficient Path (Pass Key Explicitly)
  test('TC-002: Reject Checkout Order when Stock is Deficient - Expected 400 Client Error', async ({ request }) => {
    const response = await request.post('http://localhost:5000/api/v1/orders', {
      headers: { 'x-api-key': 'prod-secret-gate-key' }, // 🛠️ Explicit Authentication
      data: {
        itemId: 102, // Out of stock item
        quantity: 1,
        userEmail: 'simarjit.devops@example.com'
      }
    });

    expect(response.status()).toBe(400);
    const body = await response.json();
    expect(body.error).toBe('Bad Request');
  });

  // TC-003: Missing Security Credentials (No Key Passed)
  test('TC-003: Decline Transaction on Missing Security Credentials - Expected 401 Unauthorized', async ({ request }) => {
    const response = await request.post('http://localhost:5000/api/v1/orders', {
      headers: {}, // 🛠️ FIX: No key sent, testing backend security blockages cleanly
      data: {
        itemId: 101,
        quantity: 1,
        userEmail: 'unauthorized-attempt@example.com'
      }
    });

    expect(response.status()).toBe(401); // This assertion will pass successfully now!
    const body = await response.json();
    expect(body.error).toBe('Unauthorized');
    expect(body.message).toBe('Invalid or missing x-api-key header.');
  });
});