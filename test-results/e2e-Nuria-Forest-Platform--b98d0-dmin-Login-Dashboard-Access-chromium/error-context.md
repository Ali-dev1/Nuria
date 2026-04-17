# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: e2e.spec.ts >> Nuria Forest Platform End-to-End >> Admin Login & Dashboard Access
- Location: tests/e2e.spec.ts:35:3

# Error details

```
Test timeout of 30000ms exceeded.
```

```
Error: page.click: Test timeout of 30000ms exceeded.
Call log:
  - waiting for locator('button:has-text("Sign In")')

```

# Page snapshot

```yaml
- generic [ref=e2]:
  - region "Notifications (F8)":
    - list
  - region "Notifications alt+T"
  - generic [ref=e4]:
    - generic [ref=e5]:
      - img [ref=e7]
      - heading "Admin Portal" [level=1] [ref=e9]
      - paragraph [ref=e10]: Restricted Access Terminal
    - generic [ref=e11]:
      - generic [ref=e12]:
        - generic [ref=e13]:
          - generic [ref=e14]: Identity
          - textbox "admin@nuria.com" [ref=e16]
        - generic [ref=e17]:
          - generic [ref=e18]: Passkey
          - generic [ref=e19]:
            - textbox "••••••••" [active] [ref=e20]: nuria1234
            - button [ref=e21] [cursor=pointer]:
              - img [ref=e22]
        - button "Enter System" [ref=e25] [cursor=pointer]:
          - text: Enter System
          - img [ref=e26]
      - generic [ref=e28]:
        - generic [ref=e29]:
          - img [ref=e30]
          - text: End-to-End Encrypted
        - link "Storefront" [ref=e33] [cursor=pointer]:
          - /url: /
    - paragraph [ref=e34]: Nuria Platform Security Architecture v4.0
```

# Test source

```ts
  1  | import { test, expect } from '@playwright/test';
  2  | 
  3  | test.describe('Nuria Forest Platform End-to-End', () => {
  4  |   
  5  |   test('Storefront Navigation & Search', async ({ page }) => {
  6  |     await page.goto('/');
  7  |     
  8  |     // Check Branding/Title
  9  |     await expect(page).toHaveTitle(/Nuria/);
  10 |     
  11 |     // Test Search
  12 |     const searchInput = page.getByPlaceholder('Search books, authors, ISBN...');
  13 |     await searchInput.fill('Kenya');
  14 |     await searchInput.press('Enter');
  15 |     
  16 |     // Verify search results page
  17 |     await expect(page).toHaveURL(/.*search=Kenya/);
  18 |   });
  19 | 
  20 |   test('Cart Flow', async ({ page }) => {
  21 |     await page.goto('/books');
  22 |     
  23 |     // Wait for books to load
  24 |     await page.waitForSelector('button:has-text("Add to Cart")', { timeout: 15000 });
  25 |     
  26 |     // Add first book to cart
  27 |     const firstBook = page.locator('button:has-text("Add to Cart")').first();
  28 |     await firstBook.click();
  29 |     
  30 |     // Go to cart
  31 |     await page.goto('/cart');
  32 |     await expect(page.locator('text=Shopping Cart')).toBeVisible();
  33 |   });
  34 | 
  35 |   test('Admin Login & Dashboard Access', async ({ page }) => {
  36 |     await page.goto('/admin/login');
  37 |     
  38 |     // Login as Admin
  39 |     await page.locator('input[type="email"]').fill('admin@nuria.com');
  40 |     await page.locator('input[type="password"]').fill('nuria1234');
> 41 |     await page.click('button:has-text("Sign In")');
     |                ^ Error: page.click: Test timeout of 30000ms exceeded.
  42 |     
  43 |     // Should be on Admin Dashboard
  44 |     await expect(page).toHaveURL(/.*admin/, { timeout: 15000 });
  45 |     await expect(page.locator('text=Admin Dashboard')).toBeVisible();
  46 |   });
  47 | 
  48 |   test('Vendor Registration & Guide', async ({ page }) => {
  49 |     await page.goto('/vendor/guide');
  50 |     
  51 |     // Click Register Button
  52 |     const registerBtn = page.getByRole('button', { name: 'Register as Vendor' });
  53 |     await registerBtn.click();
  54 |     
  55 |     // Should be on Registration Page
  56 |     await expect(page).toHaveURL(/.*vendor\/register/);
  57 |   });
  58 | 
  59 | });
  60 | 
```