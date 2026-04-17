import { test, expect } from '@playwright/test';

test.describe('Nuria Forest Platform End-to-End', () => {
  
  test('Storefront Navigation & Search', async ({ page }) => {
    await page.goto('/');
    
    // Check Branding/Title
    await expect(page).toHaveTitle(/Nuria/);
    
    // Test Search
    const searchInput = page.getByPlaceholder('Search books, authors, ISBN...');
    await searchInput.fill('Kenya');
    await searchInput.press('Enter');
    
    // Verify search results page
    await expect(page).toHaveURL(/.*search=Kenya/);
  });

  test('Cart Flow', async ({ page }) => {
    await page.goto('/books');
    
    // Wait for books to load
    await page.waitForSelector('button:has-text("Add to Cart")', { timeout: 15000 });
    
    // Add first book to cart
    const firstBook = page.locator('button:has-text("Add to Cart")').first();
    await firstBook.click();
    
    // Go to cart
    await page.goto('/cart');
    await expect(page.locator('text=Shopping Cart')).toBeVisible();
  });

  test('Admin Login & Dashboard Access', async ({ page }) => {
    await page.goto('/admin/login');
    
    // Login as Admin
    await page.locator('input[type="email"]').fill('admin@nuria.com');
    await page.locator('input[type="password"]').fill('nuria1234');
    await page.click('button:has-text("Sign In")');
    
    // Should be on Admin Dashboard
    await expect(page).toHaveURL(/.*admin/, { timeout: 15000 });
    await expect(page.locator('text=Admin Dashboard')).toBeVisible();
  });

  test('Vendor Registration & Guide', async ({ page }) => {
    await page.goto('/vendor/guide');
    
    // Click Register Button
    const registerBtn = page.getByRole('button', { name: 'Register as Vendor' });
    await registerBtn.click();
    
    // Should be on Registration Page
    await expect(page).toHaveURL(/.*vendor\/register/);
  });

});
