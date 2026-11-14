import { test, expect } from '@playwright/test';

test('GET /api/users/2 returns 200', async ({ request }) => {
  const response = await request.get('https://reqres.in/api/users/2');
  expect(response.status()).toBe(200);
});
