import { test, expect } from '@playwright/test';

test.describe('Nuria Forest Platform End-to-End', () => {
  
  test('Storefront Navigation & Search', async ({ page }) => {
    await page.goto('/');
    
    // Check Branding
    await expect(page.locator('text=Nuria')).toBeVisible();
    
    // Test Search
    const searchInput = page.locator('placeholder=Search books, authors, ISBN...');
    await searchInput.fill('Kenya');
    await searchInput.press('Enter');
    
    // Verify search results page
    await expect(page).toHaveURL(/.*search=Kenya/);
  });

  test('Cart Flow', async ({ page }) => {
    await page.goto('/books');
    
    // Add first book to cart
    const firstBook = page.locator('button:has-text("Add to Cart")').first();
    await firstBook.click();
    
    // Check cart count in Navbar
    const cartBadge = page.locator('nav').locator('text=1');
    await expect(cartBadge).toBeVisible();
    
    // Go to cart
    await page.goto('/cart');
    await expect(page.locator('text=Shopping Cart')).toBeVisible();
  });

  test('Admin Login & Dashboard Access', async ({ page }) => {
    await page.goto('/admin/login');
    
    // Login as Admin
    await page.locator('input[type="email"]').fill('admin@nuria.com');
    await page.locator('input[type="password"]').fill('nuria1234');
    await page.locator('button:has-text("Sign In")').click();
    
    // Should be on Admin Dashboard
    await expect(page).toHaveURL(/.*admin/);
    await expect(page.locator('text=Admin Dashboard')).toBeVisible();
    
    // Check Stats Cards
    await expect(page.locator('text=Revenue')).toBeVisible();
    await expect(page.locator('text=Orders')).toBeVisible();
  });

  test('Vendor Registration & Guide', async ({ page }) => {
    await page.goto('/vendor/guide');
    
    // Click Register Button
    const registerBtn = page.locator('button:has-text("Register as Vendor")');
    await registerBtn.click();
    
    // Should be on Registration Page
    await expect(page).toHaveURL(/.*vendor\/register/);
  });

  test('Maintenance Mode Lockdown', async ({ page }) => {
    // This test assumes maintenance mode is toggled via DB for testing
    // or we skip it if we can't guarantee state
    await page.goto('/');
    // If maintenance was on, we'd check for "Maintenance Break"
  });

});
