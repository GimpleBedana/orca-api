import { test, expect } from '@playwright/test';

test('server starts and returns 404 on root', async ({ request }) => {
  const response = await request.get('/');
  expect(response.status()).toBe(404);
});
