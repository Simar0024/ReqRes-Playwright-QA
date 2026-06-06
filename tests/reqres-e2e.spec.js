// tests/reqres-e2e.spec.js
const { test, expect } = require('@playwright/test');
const { allure } = require('allure-playwright');

test.describe('ReqRes API E2E Management Pipeline', () => {
  test.describe.configure({ mode: 'serial' });
  let authToken;
  let createdUserId;

  test('Step 1: Authenticate and Fetch Bearer Token', async ({ request }) => {
    allure.epic('Authentication Services');
    allure.story('User Login Validation');
    allure.severity('Critical');

    await allure.step('Send POST request to login endpoint', async () => {
      const response = await request.post('/api/login', {
        data: {
          email: "eve.holt@reqres.in",
          password: "cityslicker"
        }
      });

      // DEBUG LOGS: Run this to see exactly what ReqRes is complaining about
      if (response.status() !== 200) {
        console.error(`🚨 API Error Status: ${response.status()}`);
        console.error(`🚨 API Error Body: ${await response.text()}`);
      }

      expect(response.status()).toBe(200);
      const body = await response.json();
      expect(body).toHaveProperty('token');
      authToken = body.token;
    });
  });

  test('Step 2: Create a New System Record', async ({ request }) => {
    allure.epic('User Management Lifecycle');
    allure.story('Create Operations');
    allure.severity('Normal');

    await allure.step('Send POST request to provision a new user', async () => {
      const response = await request.post('/api/users', {
        data: {
          name: "John Doe",
          job: "DevOps Engineer"
        }
      });

      expect(response.status()).toBe(201);
      const body = await response.json();
      expect(body.name).toBe("John Doe");
      expect(body.job).toBe("DevOps Engineer");
      expect(body).toHaveProperty('id');
      
      createdUserId = body.id; // Store ID for subsequent pipeline steps
    });
  });

  test('Step 3: Modify Record Information via PUT', async ({ request }) => {
    allure.epic('User Management Lifecycle');
    allure.story('Update Operations');
    
    // Fail-safe protection if preceding test step failed
    test.skip(!createdUserId, 'Skipping step due to upstream creation failure');

    await allure.step(`Send PUT request to modify user: ${createdUserId}`, async () => {
      const response = await request.put(`/api/users/${createdUserId}`, {
        data: {
          name: "John Doe",
          job: "Senior Site Reliability Engineer"
        }
      });

      expect(response.status()).toBe(200);
      const body = await response.json();
      expect(body.job).toBe("Senior Site Reliability Engineer");
    });
  });

  test('Step 4: Purge System Record and Clean Environment', async ({ request }) => {
    allure.epic('User Management Lifecycle');
    allure.story('Delete Operations');
    
    test.skip(!createdUserId, 'Skipping step due to upstream creation failure');

    await allure.step(`Send DELETE request for user: ${createdUserId}`, async () => {
      const response = await request.delete(`/api/users/${createdUserId}`);
      // ReqRes returns 204 No Content for a successful deletion execution
      expect(response.status()).toBe(204);
    });
  });
});