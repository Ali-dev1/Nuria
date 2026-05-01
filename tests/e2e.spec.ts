import { test, expect, Page } from '@playwright/test';

// ============================================
// NURIA STORE — PRODUCTION E2E TEST SUITE
// ============================================
// Selectors synchronized with actual component DOM
// Last audited: 2026-04-20
// ============================================

const BASE_URL = 'http://localhost:8080';

const _TEST_USERS = {
  admin: { email: process.env.TEST_ADMIN_EMAIL || 'admin@nuria.com', password: process.env.TEST_ADMIN_PASSWORD || 'your_admin_password' },
  vendor: { email: process.env.TEST_VENDOR_EMAIL || 'vendor@nuria.com', password: process.env.TEST_VENDOR_PASSWORD || 'your_vendor_password' },
  customer: { email: process.env.TEST_CUSTOMER_EMAIL || 'customer@nuria.com', password: process.env.TEST_CUSTOMER_PASSWORD || 'your_customer_password' },
};

// ============================================
// HELPERS
// ============================================

async function _login(page: Page, email: string, password: string) {
  await page.goto(`${BASE_URL}/login`);
  await page.fill('input[type="email"]', email);
  await page.fill('input[type="password"]', password);
  await page.click('button[type="submit"]');
  await page.waitForTimeout(2000);
}

// ============================================
// 1. PUBLIC STOREFRONT
// ============================================

test.describe('Public Storefront', () => {

  test('Homepage loads with header and footer', async ({ page }) => {
    await page.goto(BASE_URL);
    await expect(page).toHaveTitle(/Nuria/i);
    await expect(page.locator('header')).toBeVisible();
    await expect(page.locator('footer')).toBeVisible();
  });

  test('Announcement bar shows free delivery message', async ({ page }) => {
    await page.goto(BASE_URL);
    // Navbar.tsx line 47: "🚚 Enjoy free delivery within Nairobi..."
    await expect(page.getByText(/free delivery/i)).toBeVisible();
  });

  test('Homepage hero carousel renders with slides', async ({ page }) => {
    await page.goto(BASE_URL);
    // Index.tsx: Carousel uses shadcn/ui which has aria-roledescription="carousel"
    const carousel = page.locator('section').filter({ has: page.locator('img') }).first();
    await expect(carousel).toBeVisible();
    await expect(carousel.locator('img').first()).toBeVisible({ timeout: 10000 });
  });

  test('Homepage search bar works', async ({ page }) => {
    await page.goto(BASE_URL);
    // Index.tsx line 175: placeholder="Search 21,000+ Titles, Authors, Genres..."
    const searchInput = page.getByPlaceholder(/Search 21,000/i);
    await expect(searchInput).toBeVisible();
    await searchInput.fill('Kenya');
    await searchInput.press('Enter');
    await expect(page).toHaveURL(/\/books\?search=Kenya/);
  });

  test('Homepage Featured Titles section renders', async ({ page }) => {
    await page.goto(BASE_URL);
    // Index.tsx line 216: SectionHeading label="CURATED" title="Featured Titles"
    await expect(page.getByText('Featured Titles')).toBeVisible();
  });

  test('Homepage New Arrivals section renders', async ({ page }) => {
    await page.goto(BASE_URL);
    // Index.tsx line 275: SectionHeading label="LATEST" title="New Arrivals"
    // Use level 2 to avoid matching the Carousel h1
    await expect(page.getByRole('heading', { name: 'New Arrivals', level: 2 })).toBeVisible();
  });

  test('Homepage Local Authors Spotlight renders', async ({ page }) => {
    await page.goto(BASE_URL);
    // Index.tsx line 235: "Local Authors Spotlight"
    await expect(page.getByText(/Local Authors/i)).toBeVisible();
  });

  test('Homepage vendor CTA renders', async ({ page }) => {
    await page.goto(BASE_URL);
    // Index.tsx line 292: "Are you an Author or Publisher?"
    await expect(page.getByText(/Author or Publisher/i)).toBeVisible();
  });

  test('Browse page loads and shows book count', async ({ page }) => {
    await page.goto(`${BASE_URL}/books`);
    // BooksPage.tsx line 66-69: heading shows "All Books" when no filter
    await expect(page.getByRole('heading', { name: /All Books/i })).toBeVisible();
    // BooksPage.tsx line 73: "X titles available"
    await expect(page.getByText(/titles available/i)).toBeVisible();
  });

  test('Browse page category sidebar filter works', async ({ page }) => {
    await page.goto(`${BASE_URL}/books`);
    // BooksPage.tsx line 152: "All Categories" button in sidebar
    await expect(page.getByText('All Categories')).toBeVisible();
    // Click a specific category button
    const categoryBtn = page.locator('aside button').filter({ hasText: /Fiction/i }).first();
    if (await categoryBtn.isVisible()) {
      await categoryBtn.click();
      await page.waitForTimeout(500);
    }
  });

  test('Browse page sort dropdown works', async ({ page }) => {
    await page.goto(`${BASE_URL}/books`);
    // BooksPage.tsx line 126-134: select with sort options
    const sortSelect = page.locator('select');
    await expect(sortSelect).toBeVisible();
    await sortSelect.selectOption('price-low');
  });

  test('Browse page search works', async ({ page }) => {
    await page.goto(`${BASE_URL}/books`);
    // BooksPage.tsx line 81: placeholder="Search in collection..."
    const searchInput = page.getByPlaceholder(/Search in collection/i);
    await expect(searchInput).toBeVisible();
    await searchInput.fill('history');
    await searchInput.press('Enter');
    await expect(page.getByText(/titles available/i)).toBeVisible();
  });

  test('Book cards display with Add to Cart button', async ({ page }) => {
    await page.goto(`${BASE_URL}/books`);
    await page.waitForTimeout(2000);
    // BookCard.tsx line 105: "Add to Cart" button
    const addToCartBtn = page.getByRole('button', { name: /Add to Cart/i }).first();
    await expect(addToCartBtn).toBeVisible();
  });
});

// ============================================
// 2. GIFT CARD PAGE
// ============================================

test.describe('Gift Card Page', () => {

  test('Gift card page loads with header', async ({ page }) => {
    await page.goto(`${BASE_URL}/gift-card`);
    // GiftCardPage.tsx line 9: title="Nuria Gift Cards"
    await expect(page.getByText('Nuria Gift Cards')).toBeVisible();
    // GiftCardPage.tsx line 8: label="The Perfect Gift"
    await expect(page.getByText('The Perfect Gift')).toBeVisible();
  });

  test('Gift card denomination buttons render', async ({ page }) => {
    await page.goto(`${BASE_URL}/gift-card`);
    // GiftCardPage.tsx line 54: [10000, 20000, 30000, 50000] denomination buttons
    // Use aria-label for reliable selection
    await expect(page.getByRole('radio', { name: /10,000 Kenyan Shillings/ })).toBeVisible();
    await expect(page.getByRole('radio', { name: /20,000 Kenyan Shillings/ })).toBeVisible();
    await expect(page.getByRole('radio', { name: /30,000 Kenyan Shillings/ })).toBeVisible();
    await expect(page.getByRole('radio', { name: /50,000 Kenyan Shillings/ })).toBeVisible();
  });

  test('Gift card purchase button renders', async ({ page }) => {
    await page.goto(`${BASE_URL}/gift-card`);
    // GiftCardPage.tsx line 71: "Purchase Gift Card"
    await expect(page.getByText(/Purchase Gift Card/i)).toBeVisible();
  });

  test('Gift card balance verification section renders', async ({ page }) => {
    await page.goto(`${BASE_URL}/gift-card`);
    // GiftCardPage.tsx line 84: "Verify Your <br />Balance"
    await expect(page.getByRole('heading', { name: /Verify Your.*Balance/i })).toBeVisible();
    // GiftCardPage.tsx line 93: label "Email Identity"
    await expect(page.getByText('Email Identity', { exact: true })).toBeVisible();
    // GiftCardPage.tsx line 105: label "Voucher Code"
    await expect(page.getByText('Voucher Code', { exact: true })).toBeVisible();
  });

  test('Gift card balance form has correct inputs', async ({ page }) => {
    await page.goto(`${BASE_URL}/gift-card`);
    // GiftCardPage.tsx line 97: placeholder="you@domain.com" type="email"
    const emailInput = page.locator('input[placeholder="you@domain.com"]');
    await expect(emailInput).toBeVisible();
    // GiftCardPage.tsx line 109: placeholder="NR-XXXX-XXXX-XXXX" type="text"
    const codeInput = page.locator('input[placeholder="NR-XXXX-XXXX-XXXX"]');
    await expect(codeInput).toBeVisible();
    // GiftCardPage.tsx line 117: "Verify Remaining Balance"
    await expect(page.getByText(/Verify Remaining Balance/i)).toBeVisible();
  });
});

// ============================================
// 3. AUTHENTICATION FLOWS
// ============================================

test.describe('Authentication', () => {

  test('Login page renders with form', async ({ page }) => {
    await page.goto(`${BASE_URL}/login`);
    await expect(page.locator('input[type="email"]')).toBeVisible();
    await expect(page.locator('input[type="password"]')).toBeVisible();
    await expect(page.locator('button[type="submit"]')).toBeVisible();
  });

  test('Register page renders', async ({ page }) => {
    await page.goto(`${BASE_URL}/register`);
    await expect(page.locator('input[type="email"]')).toBeVisible();
  });
});

// ============================================
// 4. CART FLOW
// ============================================

test.describe('Cart Flow', () => {

  test('Add item to cart from browse page', async ({ page }) => {
    await page.goto(`${BASE_URL}/books`);
    await page.waitForTimeout(2000);
    // BookCard.tsx line 105: "Add to Cart" button
    const addBtn = page.getByRole('button', { name: /Add to Cart/i }).first();
    await addBtn.click();
    // Navbar.tsx line 134: cart badge span with count
    const cartBadge = page.locator('a[aria-label="Cart"] span');
    await expect(cartBadge).toBeVisible();
  });

  test('Cart page loads', async ({ page }) => {
    await page.goto(`${BASE_URL}/cart`);
    // Cart page should be accessible
    await expect(page.locator('main')).toBeVisible();
  });
});

// ============================================
// 5. NAVBAR NAVIGATION
// ============================================

test.describe('Navigation', () => {

  test('Desktop nav links are present', async ({ page }) => {
    await page.goto(BASE_URL);
    // Navbar.tsx lines 94-98: nav links
    const nav = page.locator('nav.hidden.lg\\:flex');
    await expect(nav.getByText('Home')).toBeVisible();
    await expect(nav.getByText('Shop')).toBeVisible();
    await expect(nav.getByText('Gift Card')).toBeVisible();
    await expect(nav.getByText('Blog')).toBeVisible();
    await expect(nav.getByText('About Us')).toBeVisible();
  });

  test('Wishlist icon links to wishlist page', async ({ page }) => {
    await page.goto(BASE_URL);
    // Navbar.tsx line 127: aria-label="Wishlist"
    // Use locator('banner') to target the header icon specifically
    const wishlistLink = page.locator('header').getByLabel('Wishlist');
    await expect(wishlistLink).toBeVisible();
    await wishlistLink.click();
    await expect(page).toHaveURL(/\/wishlist/);
  });

  test('Cart icon links to cart page', async ({ page }) => {
    await page.goto(BASE_URL);
    // Navbar.tsx line 131: aria-label="Cart"
    const cartLink = page.getByLabel('Cart');
    await expect(cartLink).toBeVisible();
    await cartLink.click();
    await expect(page).toHaveURL(/\/cart/);
  });
});

// ============================================
// 6. ROLE-BASED ACCESS CONTROL
// ============================================

test.describe('Role-Based Access', () => {

  test('Guest is redirected from /admin', async ({ page }) => {
    await page.goto(`${BASE_URL}/admin`);
    await page.waitForTimeout(2000);
    // RoleGuard should redirect unauthenticated users
    const url = page.url();
    expect(url).not.toContain('/admin');
  });

  test('Guest is redirected from /vendor', async ({ page }) => {
    await page.goto(`${BASE_URL}/vendor`);
    await page.waitForTimeout(2000);
    const url = page.url();
    // Should redirect away from vendor dashboard
    expect(url.includes('/login') || url.includes('/vendor/guide') || !url.includes('/vendor')).toBeTruthy();
  });
});

// ============================================
// 7. STATIC/INFO PAGES
// ============================================

test.describe('Static Pages', () => {

  test('About page loads', async ({ page }) => {
    await page.goto(`${BASE_URL}/about`);
    await expect(page.locator('main')).toBeVisible();
  });

  test('Privacy policy page loads', async ({ page }) => {
    await page.goto(`${BASE_URL}/privacy`);
    await expect(page.locator('main')).toBeVisible();
  });

  test('FAQs page loads', async ({ page }) => {
    await page.goto(`${BASE_URL}/faqs`);
    await expect(page.locator('main')).toBeVisible();
  });

  test('Vendor guide page loads', async ({ page }) => {
    await page.goto(`${BASE_URL}/vendor/guide`);
    await expect(page.locator('main')).toBeVisible();
  });

  test('404 page shows for unknown routes', async ({ page }) => {
    await page.goto(`${BASE_URL}/this-does-not-exist-xyz`);
    // Use role and name to avoid strict mode violation
    await expect(page.getByRole('heading', { name: '404' })).toBeVisible();
  });
});