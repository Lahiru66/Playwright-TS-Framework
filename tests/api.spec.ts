import { test, expect } from '@playwright/test';
import { env } from '../config/env';
import { testData } from '../test-data';

test('GET /users/:id returns 200', async ({ request }) => {
  const { id } = testData.users.validUser;
  const response = await request.get(`${env.apiUrl}/users/${id}`);
  expect(response.status()).toBe(200);
});
