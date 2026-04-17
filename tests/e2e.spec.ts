import { test, expect } from '@playwright/test';

test.describe('Nuria Forest Platform End-to-End', () => {
  
  test('Storefront Navigation', async ({ page }) => {
    await page.goto('/');
    
    // Check Branding/Title - allow for hydration delay
    await expect(page).toHaveTitle(/Nuria Forest/, { timeout: 15000 });
    
    // Check if hero is visible - Use first() because of carousel
    await expect(page.locator('h1').first()).toBeVisible({ timeout: 15000 });
  });

  test('Catalog & Search', async ({ page }) => {
    await page.goto('/books');
    
    // Wait for books to load (Wait for at least one book card)
    await expect(page.locator('button:has-text("Add to Cart")').first()).toBeVisible({ timeout: 30000 });
    
    // Test Search - Match current placeholder
    const searchInput = page.getByPlaceholder(/Search 21,000\+ Titles/);
    await searchInput.fill('Kenya');
    await searchInput.press('Enter');
    
    // Verify search results page
    await expect(page).toHaveURL(/.*search=Kenya/);
  });

  test('Admin Authentication', async ({ page }) => {
    await page.goto('/admin/login');
    
    // Wait for login form
    await expect(page.locator('input[type="email"]')).toBeVisible({ timeout: 15000 });
    
    // Login as Admin
    await page.locator('input[type="email"]').fill('admin@nuria.com');
    await page.locator('input[type="password"]').fill('admin123');
    await page.click('button:has-text("Enter System")');
    
    // Verify redirection to dashboard
    await expect(page).toHaveURL(/.*admin/, { timeout: 20000 });
    await expect(page.locator('h1:has-text("Admin Dashboard")').first()).toBeVisible();
  });

  test('Vendor Registration flow', async ({ page }) => {
    await page.goto('/vendor/guide');
    
    // Click Register Button
    const registerBtn = page.getByRole('button', { name: 'Register as Vendor' });
    await expect(registerBtn).toBeVisible({ timeout: 15000 });
    await registerBtn.click();
    
    // Should be on Registration Page
    await expect(page).toHaveURL(/.*vendor\/register/);
  });

});
