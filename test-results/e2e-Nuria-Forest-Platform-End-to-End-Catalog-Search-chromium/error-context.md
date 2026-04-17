# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: e2e.spec.ts >> Nuria Forest Platform End-to-End >> Catalog & Search
- Location: tests/e2e.spec.ts:15:3

# Error details

```
Test timeout of 30000ms exceeded.
```

```
Error: expect(locator).toBeVisible() failed

Locator: locator('button:has-text("Add to Cart")').first()
Expected: visible
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 30000ms
  - waiting for locator('button:has-text("Add to Cart")').first()

```

# Page snapshot

```yaml
- generic [ref=e2]:
  - region "Notifications (F8)":
    - list
  - region "Notifications alt+T"
  - generic [ref=e3]:
    - generic [ref=e5]:
      - generic [ref=e6]: 🚚 Enjoy free delivery within Nairobi for orders above KSh 10,000 | 📞 0794 233 261
      - button "Dismiss" [ref=e7] [cursor=pointer]:
        - img [ref=e8]
    - banner [ref=e11]:
      - generic [ref=e12]:
        - link "Nuria Logo" [ref=e14] [cursor=pointer]:
          - /url: /
          - img "Nuria Logo" [ref=e15]
        - generic [ref=e16]:
          - button "Search" [ref=e17] [cursor=pointer]:
            - img [ref=e18]
          - navigation [ref=e21]:
            - link "Home" [ref=e22] [cursor=pointer]:
              - /url: /
            - link "Shop" [ref=e23] [cursor=pointer]:
              - /url: /books
            - link "Gift Card" [ref=e24] [cursor=pointer]:
              - /url: /gift-card
            - link "Blog" [ref=e25] [cursor=pointer]:
              - /url: /blog
            - link "About Us" [ref=e26] [cursor=pointer]:
              - /url: /about
          - generic [ref=e27]:
            - link "SELL ON NURIA" [ref=e28] [cursor=pointer]:
              - /url: /vendor/guide
              - button "SELL ON NURIA" [ref=e29]
            - link "VENDOR LOGIN" [ref=e30] [cursor=pointer]:
              - /url: /vendor
              - button "VENDOR LOGIN" [ref=e31]
          - link "Wishlist" [ref=e32] [cursor=pointer]:
            - /url: /wishlist
            - img [ref=e33]
          - link "Cart" [ref=e35] [cursor=pointer]:
            - /url: /cart
            - img [ref=e36]
          - link "Sign in" [ref=e40] [cursor=pointer]:
            - /url: /login
            - img [ref=e41]
    - main [ref=e44]:
      - generic [ref=e45]:
        - generic [ref=e46]:
          - generic [ref=e47]:
            - heading "All Books" [level=1] [ref=e48]
            - paragraph [ref=e50]: Loading…
          - generic [ref=e51]:
            - img [ref=e52]
            - textbox "Search in collection..." [ref=e55]
        - combobox [ref=e58]:
          - option "Newest" [selected]
          - 'option "Price: Low to High"'
          - 'option "Price: High to Low"'
          - option "Highest Rated"
          - option "Bestselling"
        - complementary [ref=e60]:
          - generic [ref=e62]:
            - heading "Category" [level=4] [ref=e63]
            - generic [ref=e64]:
              - button "All Categories" [ref=e65] [cursor=pointer]
              - button "Fiction" [ref=e66] [cursor=pointer]
              - button "Non-Fiction" [ref=e67] [cursor=pointer]
              - button "Children" [ref=e68] [cursor=pointer]
              - button "Education" [ref=e69] [cursor=pointer]
              - button "Self-Help" [ref=e70] [cursor=pointer]
              - button "Religion" [ref=e71] [cursor=pointer]
              - button "Business" [ref=e72] [cursor=pointer]
              - button "History" [ref=e73] [cursor=pointer]
              - button "Technology" [ref=e74] [cursor=pointer]
              - button "Lifestyle" [ref=e75] [cursor=pointer]
    - contentinfo [ref=e110]:
      - generic [ref=e111]:
        - generic [ref=e112]:
          - generic [ref=e113]:
            - heading "TALK TO US" [level=4] [ref=e114]
            - list [ref=e115]:
              - listitem [ref=e116]:
                - img [ref=e117]
                - generic [ref=e119]: 0794 233261 / 0724 670194
              - listitem [ref=e120]:
                - img [ref=e121]
                - generic [ref=e124]: nuriakenyabookstore@gmail.com
              - listitem [ref=e125]:
                - img [ref=e126]
                - generic [ref=e129]: The Bazaar Building, 1st Floor
          - generic [ref=e130]:
            - heading "About Nuria" [level=4] [ref=e131]
            - list [ref=e132]:
              - listitem [ref=e133]:
                - link "Our Story" [ref=e134] [cursor=pointer]:
                  - /url: /about
              - listitem [ref=e135]:
                - link "Blog" [ref=e136] [cursor=pointer]:
                  - /url: /blog
              - listitem [ref=e137]:
                - link "Contact Us" [ref=e138] [cursor=pointer]:
                  - /url: /contact
          - generic [ref=e139]:
            - heading "VENDORS" [level=4] [ref=e140]
            - list [ref=e141]:
              - listitem [ref=e142]:
                - link "Sell on Nuria" [ref=e143] [cursor=pointer]:
                  - /url: /vendor/guide
              - listitem [ref=e144]:
                - link "Vendor Login" [ref=e145] [cursor=pointer]:
                  - /url: /login
              - listitem [ref=e146]:
                - link "Privacy Policy" [ref=e147] [cursor=pointer]:
                  - /url: /privacy
          - generic [ref=e148]:
            - heading "USEFUL LINKS" [level=4] [ref=e149]
            - list [ref=e150]:
              - listitem [ref=e151]:
                - link "Delivery Policy" [ref=e152] [cursor=pointer]:
                  - /url: /delivery
              - listitem [ref=e153]:
                - link "Returns" [ref=e154] [cursor=pointer]:
                  - /url: /returns
              - listitem [ref=e155]:
                - link "Gift Card Balance" [ref=e156] [cursor=pointer]:
                  - /url: /gift-card
        - generic [ref=e157]:
          - generic [ref=e158]:
            - generic [ref=e159]: We Accept
            - generic [ref=e160]:
              - generic [ref=e161]: M-Pesa
              - generic [ref=e162]: VISA
              - generic [ref=e163]: PesaPal
              - generic [ref=e164]: Bitcoin
          - generic [ref=e165]:
            - generic [ref=e166]: Follow Us
            - generic [ref=e167]:
              - link "Facebook" [ref=e168] [cursor=pointer]:
                - /url: https://facebook.com/nuriayourhonestonlineshop/
                - img [ref=e169]
              - link "Instagram" [ref=e171] [cursor=pointer]:
                - /url: https://instagram.com/nuria_thehoneststore/
                - img [ref=e172]
              - link "Twitter" [ref=e175] [cursor=pointer]:
                - /url: https://x.com/nuriastore
                - img [ref=e176]
        - paragraph [ref=e180]: © 2025 Nuria Kenya. All rights reserved. The Honest Store.
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
> 19 |     await expect(page.locator('button:has-text("Add to Cart")').first()).toBeVisible({ timeout: 30000 });
     |                                                                          ^ Error: expect(locator).toBeVisible() failed
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
  43 |     await expect(page.locator('h1:has-text("Admin Dashboard")')).toBeVisible();
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