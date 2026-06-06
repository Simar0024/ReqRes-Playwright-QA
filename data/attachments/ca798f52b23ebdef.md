# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: reqres-e2e.spec.js >> ReqRes API E2E Management Pipeline >> Step 1: Authenticate and Fetch Bearer Token
- Location: tests/reqres-e2e.spec.js:10:3

# Error details

```
Error: expect(received).toBe(expected) // Object.is equality

Expected: 200
Received: 401
```

# Test source

```ts
  1  | // tests/reqres-e2e.spec.js
  2  | const { test, expect } = require('@playwright/test');
  3  | const { allure } = require('allure-playwright');
  4  | 
  5  | test.describe('ReqRes API E2E Management Pipeline', () => {
  6  |   test.describe.configure({ mode: 'serial' });
  7  |   let authToken;
  8  |   let createdUserId;
  9  | 
  10 |   test('Step 1: Authenticate and Fetch Bearer Token', async ({ request }) => {
  11 |     allure.epic('Authentication Services');
  12 |     allure.story('User Login Validation');
  13 |     allure.severity('Critical');
  14 | 
  15 |     await allure.step('Send POST request to login endpoint', async () => {
  16 |       const response = await request.post('/api/login', {
  17 |         data: {
  18 |           email: "eve.holt@reqres.in",
  19 |           password: "cityslicker"
  20 |         }
  21 |       });
  22 | 
  23 |       // DEBUG LOGS: Run this to see exactly what ReqRes is complaining about
  24 |       if (response.status() !== 200) {
  25 |         console.error(`🚨 API Error Status: ${response.status()}`);
  26 |         console.error(`🚨 API Error Body: ${await response.text()}`);
  27 |       }
  28 | 
> 29 |       expect(response.status()).toBe(200);
     |                                 ^ Error: expect(received).toBe(expected) // Object.is equality
  30 |       const body = await response.json();
  31 |       expect(body).toHaveProperty('token');
  32 |       authToken = body.token;
  33 |     });
  34 |   });
  35 | 
  36 |   test('Step 2: Create a New System Record', async ({ request }) => {
  37 |     allure.epic('User Management Lifecycle');
  38 |     allure.story('Create Operations');
  39 |     allure.severity('Normal');
  40 | 
  41 |     await allure.step('Send POST request to provision a new user', async () => {
  42 |       const response = await request.post('/api/users', {
  43 |         data: {
  44 |           name: "John Doe",
  45 |           job: "DevOps Engineer"
  46 |         }
  47 |       });
  48 | 
  49 |       expect(response.status()).toBe(201);
  50 |       const body = await response.json();
  51 |       expect(body.name).toBe("John Doe");
  52 |       expect(body.job).toBe("DevOps Engineer");
  53 |       expect(body).toHaveProperty('id');
  54 |       
  55 |       createdUserId = body.id; // Store ID for subsequent pipeline steps
  56 |     });
  57 |   });
  58 | 
  59 |   test('Step 3: Modify Record Information via PUT', async ({ request }) => {
  60 |     allure.epic('User Management Lifecycle');
  61 |     allure.story('Update Operations');
  62 |     
  63 |     // Fail-safe protection if preceding test step failed
  64 |     test.skip(!createdUserId, 'Skipping step due to upstream creation failure');
  65 | 
  66 |     await allure.step(`Send PUT request to modify user: ${createdUserId}`, async () => {
  67 |       const response = await request.put(`/api/users/${createdUserId}`, {
  68 |         data: {
  69 |           name: "John Doe",
  70 |           job: "Senior Site Reliability Engineer"
  71 |         }
  72 |       });
  73 | 
  74 |       expect(response.status()).toBe(200);
  75 |       const body = await response.json();
  76 |       expect(body.job).toBe("Senior Site Reliability Engineer");
  77 |     });
  78 |   });
  79 | 
  80 |   test('Step 4: Purge System Record and Clean Environment', async ({ request }) => {
  81 |     allure.epic('User Management Lifecycle');
  82 |     allure.story('Delete Operations');
  83 |     
  84 |     test.skip(!createdUserId, 'Skipping step due to upstream creation failure');
  85 | 
  86 |     await allure.step(`Send DELETE request for user: ${createdUserId}`, async () => {
  87 |       const response = await request.delete(`/api/users/${createdUserId}`);
  88 |       // ReqRes returns 204 No Content for a successful deletion execution
  89 |       expect(response.status()).toBe(204);
  90 |     });
  91 |   });
  92 | });
```