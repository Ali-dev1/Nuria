import { test, expect } from '@playwright/test';

test('Smoke Test', async ({ page }) => {
  await page.goto('http://localhost:8080/');
  const title = await page.title();
  console.log('Title:', title);
  await expect(page).toHaveTitle(/Nuria/);
});
