import { test, expect } from '@playwright/test';

test.describe('Account routes', () => {
  test('POST /accounts/login without apikey returns 401', async ({ request }) => {
    const response = await request.post('/accounts/login', {
      data: { email: 'test@example.com', password: 'password123' },
    });

    expect(response.status()).toBe(401);
    expect(await response.json()).toEqual({
      success: false,
      message: 'Unauthorized',
    });
  });

  test('POST /accounts/sign-up without apikey returns 401', async ({ request }) => {
    const response = await request.post('/accounts/sign-up', {
      data: { email: 'test@example.com', password: 'password123' },
    });

    expect(response.status()).toBe(401);
    expect(await response.json()).toEqual({
      success: false,
      message: 'Unauthorized',
    });
  });

  test('GET /accounts/profile without apikey returns 401', async ({ request }) => {
    const response = await request.get('/accounts/profile');

    expect(response.status()).toBe(401);
    expect(await response.json()).toEqual({
      success: false,
      message: 'Unauthorized',
    });
  });
});
