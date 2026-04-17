# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: e2e.spec.ts >> Nuria Forest Platform End-to-End >> Admin Authentication
- Location: tests/e2e.spec.ts:30:3

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: locator('h1:has-text("Admin Dashboard")')
Expected: visible
Timeout: 5000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 5000ms
  - waiting for locator('h1:has-text("Admin Dashboard")')

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
            - textbox "••••••••" [ref=e20]: admin123
            - button [ref=e21] [cursor=pointer]:
              - img [ref=e22]
        - button "Authenticating..." [disabled] [ref=e25]
      - generic [ref=e26]:
        - generic [ref=e27]:
          - img [ref=e28]
          - text: End-to-End Encrypted
        - link "Storefront" [ref=e31] [cursor=pointer]:
          - /url: /
    - paragraph [ref=e32]: Nuria Platform Security Architecture v4.0
```

# Test source

```ts
  1  | import { test, expect } from '@playwright/test';
  2  | 
  3  | test.describe('Nuria Forest Platform End-to-End', () => {
  4  |   
  5  |   test('Storefront Navigation', async ({ page }) => {
  6  |     await page.goto('/');
  7  |     
  8  |     // Check Branding/Title - allow for hydration delay
  9  |     await expect(page).toHaveTitle(/Nuria/, { timeout: 15000 });
  10 |     
  11 |     // Check if hero is visible - Use first() because of carousel
  12 |     await expect(page.locator('h1').first()).toBeVisible({ timeout: 15000 });
  13 |   });
  14 | 
  15 |   test('Catalog & Search', async ({ page }) => {
  16 |     await page.goto('/books');
  17 |     
  18 |     // Wait for books to load (Wait for at least one book card)
  19 |     await expect(page.locator('button:has-text("Add to Cart")').first()).toBeVisible({ timeout: 30000 });
  20 |     
  21 |     // Test Search - Match current placeholder
  22 |     const searchInput = page.getByPlaceholder(/Search 21,000\+ Titles/);
  23 |     await searchInput.fill('Kenya');
  24 |     await searchInput.press('Enter');
  25 |     
  26 |     // Verify search results page
  27 |     await expect(page).toHaveURL(/.*search=Kenya/);
  28 |   });
  29 | 
  30 |   test('Admin Authentication', async ({ page }) => {
  31 |     await page.goto('/admin/login');
  32 |     
  33 |     // Wait for login form
  34 |     await expect(page.locator('input[type="email"]')).toBeVisible({ timeout: 15000 });
  35 |     
  36 |     // Login as Admin
  37 |     await page.locator('input[type="email"]').fill('admin@nuria.com');
  38 |     await page.locator('input[type="password"]').fill('admin123');
  39 |     await page.click('button:has-text("Enter System")');
  40 |     
  41 |     // Verify redirection to dashboard
  42 |     await expect(page).toHaveURL(/.*admin/, { timeout: 20000 });
> 43 |     await expect(page.locator('h1:has-text("Admin Dashboard")')).toBeVisible();
     |                                                                  ^ Error: expect(locator).toBeVisible() failed
  44 |   });
  45 | 
  46 |   test('Vendor Registration flow', async ({ page }) => {
  47 |     await page.goto('/vendor/guide');
  48 |     
  49 |     // Click Register Button
  50 |     const registerBtn = page.getByRole('button', { name: 'Register as Vendor' });
  51 |     await expect(registerBtn).toBeVisible({ timeout: 15000 });
  52 |     await registerBtn.click();
  53 |     
  54 |     // Should be on Registration Page
  55 |     await expect(page).toHaveURL(/.*vendor\/register/);
  56 |   });
  57 | 
  58 | });
  59 | 
```