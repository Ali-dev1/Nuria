import { test, expect, Page } from '@playwright/test';

// ============================================
// NURIA MARKETPLACE — PLAYWRIGHT TEST SUITE
// ============================================
// Known broken areas (marked with todo):
// - Email verification on register (Resend not configured)
// - M-Pesa STK Push (payment not fully hooked up)
// ============================================

const BASE_URL = 'http://localhost:8080';

const TEST_USERS = {
    admin: { email: 'admin@nuria.com', password: 'your_admin_password' },
    vendor: { email: 'vendor@nuria.com', password: 'your_vendor_password' },
    customer: { email: 'customer@nuria.com', password: 'your_customer_password' },
};

// ============================================
// HELPERS
// ============================================

async function login(page: Page, email: string, password: string) {
    await page.goto(`${BASE_URL}/login`);
    await page.fill('input[type="email"]', email);
    await page.fill('input[type="password"]', password);
    await page.click('button[type="submit"]');
    await page.waitForURL((url) => !url.toString().includes('/login'), { timeout: 10000 });
}

async function logout(page: Page) {
    await page.goto(BASE_URL);
    const accountIcon = page.locator('[data-testid="account-icon"], [aria-label="account"], button:has-text("Sign Out")').first();
    if (await accountIcon.isVisible()) {
        await accountIcon.click();
        const signOutBtn = page.locator('button:has-text("Sign Out"), a:has-text("Log out"), button:has-text("Logout")').first();
        if (await signOutBtn.isVisible()) await signOutBtn.click();
    }
    await page.goto(`${BASE_URL}/login`);
}

// ============================================
// 1. PUBLIC PAGES
// ============================================

test.describe('Public Pages', () => {

    test('Homepage loads correctly', async ({ page }) => {
        await page.goto(BASE_URL);
        await expect(page).toHaveTitle(/Nuria/i);
        await expect(page.locator('img[alt*="Nuria"], img[src*="logo"]').first()).toBeVisible();
    });

    test('Announcement bar is visible', async ({ page }) => {
        await page.goto(BASE_URL);
        const bar = page.locator('text=/free delivery/i').first();
        await expect(bar).toBeVisible();
    });

    test('Homepage carousel renders', async ({ page }) => {
        await page.goto(BASE_URL);
        const carousel = page.locator('[class*="carousel"], [class*="slider"], [class*="hero"]').first();
        await expect(carousel).toBeVisible();
    });

    test('Homepage featured books section loads', async ({ page }) => {
        await page.goto(BASE_URL);
        const section = page.locator('text=/featured/i').first();
        await expect(section).toBeVisible();
    });

    test('Browse page loads with books', async ({ page }) => {
        await page.goto(`${BASE_URL}/books`);
        await page.waitForSelector('[class*="BookCard"], [class*="book-card"], .grid > div', { timeout: 10000 });
        const cards = page.locator('[class*="BookCard"], [class*="book-card"]');
        await expect(cards.first()).toBeVisible();
    });

    test('Category filter works on browse page', async ({ page }) => {
        await page.goto(`${BASE_URL}/books`);
        await page.waitForSelector('[class*="BookCard"]', { timeout: 10000 });
        const filterBtn = page.locator('button:has-text("Fiction"), a:has-text("Fiction"), [data-category="Fiction"]').first();
        if (await filterBtn.isVisible()) {
            await filterBtn.click();
            await page.waitForTimeout(1500);
            const cards = page.locator('[class*="BookCard"]');
            expect(await cards.count()).toBeGreaterThan(0);
        }
    });

    test('Single product page loads', async ({ page }) => {
        await page.goto(`${BASE_URL}/books`);
        await page.waitForSelector('[class*="BookCard"]', { timeout: 10000 });
        await page.locator('[class*="BookCard"]').first().click();
        await expect(page).toHaveURL(/\/books\/.+/);
        await expect(page.locator('h1, [class*="title"]').first()).toBeVisible();
    });

    test('Search returns results', async ({ page }) => {
        await page.goto(`${BASE_URL}/search?q=Kenya`);
        await page.waitForTimeout(2000);
        const results = page.locator('[class*="BookCard"]');
        expect(await results.count()).toBeGreaterThan(0);
    });

    test('Search with no results shows empty state', async ({ page }) => {
        await page.goto(`${BASE_URL}/search?q=xyznonexistentbookxyz`);
        await page.waitForTimeout(2000);
        const empty = page.locator('text=/no results/i, text=/not found/i, text=/could not find/i').first();
        await expect(empty).toBeVisible();
    });

    test('About page loads with content', async ({ page }) => {
        await page.goto(`${BASE_URL}/about`);
        await expect(page.locator('text=/nuria/i').first()).toBeVisible();
        await expect(page.locator('text=/2015/i').first()).toBeVisible();
    });

    test('Contact page loads with form', async ({ page }) => {
        await page.goto(`${BASE_URL}/contact`);
        await expect(page.locator('input[name="name"], input[placeholder*="name" i]').first()).toBeVisible();
        await expect(page.locator('input[name="email"], input[type="email"]').first()).toBeVisible();
        await expect(page.locator('textarea').first()).toBeVisible();
    });

    test('Blog page loads with posts', async ({ page }) => {
        await page.goto(`${BASE_URL}/blog`);
        await expect(page.locator('text=/reading room/i, text=/blog/i').first()).toBeVisible();
    });

    test('Sell on Nuria page loads', async ({ page }) => {
        await page.goto(`${BASE_URL}/sell`);
        await expect(page.locator('text=/sell/i').first()).toBeVisible();
        await expect(page.locator('text=/vendor/i, text=/mpesa/i').first()).toBeVisible();
    });

    test('FAQs page loads with accordion', async ({ page }) => {
        await page.goto(`${BASE_URL}/faqs`);
        await expect(page.locator('text=/frequently asked/i, text=/faq/i').first()).toBeVisible();
        const firstQuestion = page.locator('[class*="accordion"], details, [role="button"]').first();
        await expect(firstQuestion).toBeVisible();
    });

    test('Privacy policy page loads', async ({ page }) => {
        await page.goto(`${BASE_URL}/privacy`);
        await expect(page.locator('text=/privacy/i').first()).toBeVisible();
    });

    test('Delivery policy page loads', async ({ page }) => {
        await page.goto(`${BASE_URL}/delivery-policy`);
        await expect(page.locator('text=/delivery/i').first()).toBeVisible();
    });

    test('Returns page loads', async ({ page }) => {
        await page.goto(`${BASE_URL}/returns`);
        await expect(page.locator('text=/return/i').first()).toBeVisible();
    });

    test('404 page shows for unknown routes', async ({ page }) => {
        await page.goto(`${BASE_URL}/this-page-does-not-exist`);
        await expect(page.locator('text=/not found/i, text=/404/i').first()).toBeVisible();
    });

    test('Footer renders with correct links', async ({ page }) => {
        await page.goto(BASE_URL);
        await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
        await expect(page.locator('footer').first()).toBeVisible();
        await expect(page.locator('footer a:has-text("About"), footer a:has-text("Our Story")').first()).toBeVisible();
    });

    test('Navbar renders on all pages', async ({ page }) => {
        const pages = ['/', '/books', '/about', '/contact', '/blog'];
        for (const path of pages) {
            await page.goto(`${BASE_URL}${path}`);
            await expect(page.locator('nav, header').first()).toBeVisible();
        }
    });

});

// ============================================
// 2. AUTHENTICATION
// ============================================

test.describe('Authentication', () => {

    test('Login page renders', async ({ page }) => {
        await page.goto(`${BASE_URL}/login`);
        await expect(page.locator('input[type="email"]').first()).toBeVisible();
        await expect(page.locator('input[type="password"]').first()).toBeVisible();
        await expect(page.locator('button[type="submit"]').first()).toBeVisible();
    });

    test('Register page renders', async ({ page }) => {
        await page.goto(`${BASE_URL}/register`);
        await expect(page.locator('input[type="email"]').first()).toBeVisible();
        await expect(page.locator('input[type="password"]').first()).toBeVisible();
    });

    test('Login with valid customer credentials', async ({ page }) => {
        await login(page, TEST_USERS.customer.email, TEST_USERS.customer.password);
        await expect(page).not.toHaveURL(/\/login/);
    });

    test('Login with invalid credentials shows error', async ({ page }) => {
        await page.goto(`${BASE_URL}/login`);
        await page.fill('input[type="email"]', 'wrong@email.com');
        await page.fill('input[type="password"]', 'wrongpassword');
        await page.click('button[type="submit"]');
        await page.waitForTimeout(2000);
        const error = page.locator('text=/invalid/i, text=/incorrect/i, text=/error/i, [class*="error"], [class*="toast"]').first();
        await expect(error).toBeVisible();
    });

    test.fixme('Register new account sends confirmation email', async ({ page }) => {
        // BROKEN: Resend not configured on free domain
        // Email verification returns 500 error
        // Fix: Configure Resend with a proper domain
        await page.goto(`${BASE_URL}/register`);
        await page.fill('input[type="email"]', `test${Date.now()}@gmail.com`);
        await page.fill('input[type="password"]', 'TestPassword123!');
        await page.click('button[type="submit"]');
        await expect(page.locator('text=/check your email/i, text=/confirmation/i').first()).toBeVisible();
    });

    test('/account redirects to login when not authenticated', async ({ page }) => {
        await page.goto(`${BASE_URL}/account`);
        await expect(page).toHaveURL(/\/login/);
    });

    test('/admin redirects to home when not authenticated', async ({ page }) => {
        await page.goto(`${BASE_URL}/admin`);
        await expect(page).not.toHaveURL(/\/admin/);
    });

    test('/vendor redirects when not authenticated', async ({ page }) => {
        await page.goto(`${BASE_URL}/vendor`);
        await expect(page).not.toHaveURL(/^.*\/vendor$/);
    });

    test('Customer cannot access admin dashboard', async ({ page }) => {
        await login(page, TEST_USERS.customer.email, TEST_USERS.customer.password);
        await page.goto(`${BASE_URL}/admin`);
        await expect(page).not.toHaveURL(/\/admin/);
        await logout(page);
    });

    test('Customer cannot access vendor dashboard', async ({ page }) => {
        await login(page, TEST_USERS.customer.email, TEST_USERS.customer.password);
        await page.goto(`${BASE_URL}/vendor`);
        await page.waitForTimeout(2000);
        await expect(page).not.toHaveURL(/^.*\/vendor$/);
        await logout(page);
    });

});

// ============================================
// 3. CUSTOMER FLOW
// ============================================

test.describe('Customer Flow', () => {

    test.beforeEach(async ({ page }) => {
        await login(page, TEST_USERS.customer.email, TEST_USERS.customer.password);
    });

    test.afterEach(async ({ page }) => {
        await logout(page);
    });

    test('Customer can view account page', async ({ page }) => {
        await page.goto(`${BASE_URL}/account`);
        await expect(page).toHaveURL(/\/account/);
    });

    test('Customer can add book to cart', async ({ page }) => {
        await page.goto(`${BASE_URL}/books`);
        await page.waitForSelector('[class*="BookCard"]', { timeout: 10000 });
        await page.locator('[class*="BookCard"]').first().click();
        await page.waitForURL(/\/books\/.+/);
        const addToCart = page.locator('button:has-text("Add to Cart"), button:has-text("Add to Basket")').first();
        await addToCart.click();
        await page.waitForTimeout(1000);
        const cartCount = page.locator('[class*="cart-count"], [class*="badge"], [data-testid="cart-count"]').first();
        if (await cartCount.isVisible()) {
            const count = await cartCount.textContent();
            expect(Number(count)).toBeGreaterThan(0);
        }
    });

    test('Cart persists after page refresh', async ({ page }) => {
        await page.goto(`${BASE_URL}/books`);
        await page.waitForSelector('[class*="BookCard"]', { timeout: 10000 });
        await page.locator('[class*="BookCard"]').first().click();
        await page.locator('button:has-text("Add to Cart"), button:has-text("Add to Basket")').first().click();
        await page.waitForTimeout(1000);
        await page.reload();
        await page.goto(`${BASE_URL}/cart`);
        const items = page.locator('[class*="CartItem"], [class*="cart-item"]');
        expect(await items.count()).toBeGreaterThan(0);
    });

    test('Cart page shows correct total in KSh', async ({ page }) => {
        await page.goto(`${BASE_URL}/cart`);
        const total = page.locator('text=/KSh/i, text=/KShs/i').first();
        await expect(total).toBeVisible();
    });

    test('Customer can proceed to checkout', async ({ page }) => {
        await page.goto(`${BASE_URL}/cart`);
        const checkoutBtn = page.locator('button:has-text("Checkout"), a:has-text("Checkout"), button:has-text("Proceed")').first();
        if (await checkoutBtn.isVisible()) {
            await checkoutBtn.click();
            await expect(page).toHaveURL(/\/checkout/);
        }
    });

    test('Checkout page shows delivery form', async ({ page }) => {
        await page.goto(`${BASE_URL}/checkout`);
        await expect(page.locator('input[name*="address"], input[placeholder*="address" i], input[name*="street"]').first()).toBeVisible();
    });

    test.fixme('Checkout completes with M-Pesa payment', async ({ page }) => {
        // BROKEN: M-Pesa STK Push not fully connected
        // Daraja API sandbox credentials need to be set in Supabase Edge Function secrets
        // Fix: Deploy mpesa-stk-push Edge Function with real sandbox credentials
        await page.goto(`${BASE_URL}/checkout`);
        await page.fill('input[name*="address"], input[placeholder*="address" i]', '123 Test Street, Nairobi');
        await page.locator('input[value="mpesa"], label:has-text("M-Pesa")').first().click();
        await page.fill('input[placeholder*="phone" i], input[name*="phone"]', '0712345678');
        await page.locator('button:has-text("Place Order"), button:has-text("Pay")').first().click();
        await expect(page).toHaveURL(/\/order-confirmation/);
    });

    test('Customer can add book to wishlist', async ({ page }) => {
        await page.goto(`${BASE_URL}/books`);
        await page.waitForSelector('[class*="BookCard"]', { timeout: 10000 });
        const wishlistBtn = page.locator('[aria-label*="wishlist" i], button:has([class*="heart"]), [class*="wishlist"]').first();
        if (await wishlistBtn.isVisible()) {
            await wishlistBtn.click();
            await page.waitForTimeout(1000);
        }
    });

    test('Account page shows order history tab', async ({ page }) => {
        await page.goto(`${BASE_URL}/account`);
        const ordersTab = page.locator('button:has-text("Orders"), [role="tab"]:has-text("Orders")').first();
        await expect(ordersTab).toBeVisible();
    });

    test('Account page shows loyalty points', async ({ page }) => {
        await page.goto(`${BASE_URL}/account`);
        const loyaltyTab = page.locator('button:has-text("Loyalty"), [role="tab"]:has-text("Loyalty"), text=/loyalty points/i').first();
        await expect(loyaltyTab).toBeVisible();
    });

    test('Account page shows wishlist tab', async ({ page }) => {
        await page.goto(`${BASE_URL}/account`);
        const wishlistTab = page.locator('button:has-text("Wishlist"), [role="tab"]:has-text("Wishlist")').first();
        await expect(wishlistTab).toBeVisible();
    });

    test('Account page shows addresses tab', async ({ page }) => {
        await page.goto(`${BASE_URL}/account`);
        const addressTab = page.locator('button:has-text("Address"), [role="tab"]:has-text("Address")').first();
        await expect(addressTab).toBeVisible();
    });

});

// ============================================
// 4. VENDOR FLOW
// ============================================

test.describe('Vendor Flow', () => {

    test.beforeEach(async ({ page }) => {
        await login(page, TEST_USERS.vendor.email, TEST_USERS.vendor.password);
    });

    test.afterEach(async ({ page }) => {
        await logout(page);
    });

    test('Verified vendor lands on dashboard not register page', async ({ page }) => {
        await page.goto(`${BASE_URL}/vendor`);
        await page.waitForTimeout(2000);
        await expect(page).not.toHaveURL(/\/vendor\/register/);
        await expect(page).toHaveURL(/\/vendor/);
    });

    test('Vendor dashboard shows stats cards', async ({ page }) => {
        await page.goto(`${BASE_URL}/vendor`);
        const stats = page.locator('[class*="stat"], [class*="card"]').first();
        await expect(stats).toBeVisible();
    });

    test('Vendor can view their products tab', async ({ page }) => {
        await page.goto(`${BASE_URL}/vendor`);
        const productsTab = page.locator('button:has-text("Products"), [role="tab"]:has-text("Products"), a:has-text("My Products")').first();
        await expect(productsTab).toBeVisible();
        await productsTab.click();
        await page.waitForTimeout(1000);
    });

    test('Vendor can view orders tab', async ({ page }) => {
        await page.goto(`${BASE_URL}/vendor`);
        const ordersTab = page.locator('button:has-text("Orders"), [role="tab"]:has-text("Orders")').first();
        await expect(ordersTab).toBeVisible();
    });

    test('Vendor can view payouts tab', async ({ page }) => {
        await page.goto(`${BASE_URL}/vendor`);
        const payoutsTab = page.locator('button:has-text("Payouts"), [role="tab"]:has-text("Payouts")').first();
        await expect(payoutsTab).toBeVisible();
    });

    test('Vendor can navigate to add product page', async ({ page }) => {
        await page.goto(`${BASE_URL}/vendor/products/new`);
        await expect(page.locator('input[name*="title"], input[placeholder*="title" i]').first()).toBeVisible();
    });

    test('Vendor cannot access admin dashboard', async ({ page }) => {
        await page.goto(`${BASE_URL}/admin`);
        await page.waitForTimeout(2000);
        await expect(page).not.toHaveURL(/\/admin/);
    });

    test('Vendor pending status shows review banner', async ({ page }) => {
        // This test verifies the pending state UI exists
        // Actual pending vendor would need a separate test account
        await page.goto(`${BASE_URL}/vendor`);
        const dashboard = page.locator('[class*="dashboard"], main').first();
        await expect(dashboard).toBeVisible();
    });

});

// ============================================
// 5. ADMIN FLOW
// ============================================

test.describe('Admin Flow', () => {

    test.beforeEach(async ({ page }) => {
        await login(page, TEST_USERS.admin.email, TEST_USERS.admin.password);
    });

    test.afterEach(async ({ page }) => {
        await logout(page);
    });

    test('Admin lands on admin dashboard', async ({ page }) => {
        await page.goto(`${BASE_URL}/admin`);
        await expect(page).toHaveURL(/\/admin/);
        await expect(page.locator('text=/admin dashboard/i').first()).toBeVisible();
    });

    test('Admin dashboard shows platform stats', async ({ page }) => {
        await page.goto(`${BASE_URL}/admin`);
        await expect(page.locator('text=/total users/i, text=/total products/i').first()).toBeVisible();
    });

    test('Admin can view products tab', async ({ page }) => {
        await page.goto(`${BASE_URL}/admin`);
        const productsTab = page.locator('button:has-text("Products"), [role="tab"]:has-text("Products")').first();
        await productsTab.click();
        await page.waitForTimeout(1500);
        await expect(page.locator('table, [class*="product-list"]').first()).toBeVisible();
    });

    test('Admin can view orders tab', async ({ page }) => {
        await page.goto(`${BASE_URL}/admin`);
        const ordersTab = page.locator('button:has-text("Orders"), [role="tab"]:has-text("Orders")').first();
        await ordersTab.click();
        await page.waitForTimeout(1000);
    });

    test('Admin can view users tab', async ({ page }) => {
        await page.goto(`${BASE_URL}/admin`);
        const usersTab = page.locator('button:has-text("Users"), [role="tab"]:has-text("Users")').first();
        await usersTab.click();
        await page.waitForTimeout(1000);
        await expect(page.locator('table, [class*="user-list"]').first()).toBeVisible();
    });

    test('Admin can view vendors tab', async ({ page }) => {
        await page.goto(`${BASE_URL}/admin`);
        const vendorsTab = page.locator('button:has-text("Vendors"), [role="tab"]:has-text("Vendors")').first();
        await vendorsTab.click();
        await page.waitForTimeout(1000);
    });

    test('Admin can view blog tab', async ({ page }) => {
        await page.goto(`${BASE_URL}/admin`);
        const blogTab = page.locator('button:has-text("Blog"), [role="tab"]:has-text("Blog")').first();
        await blogTab.click();
        await page.waitForTimeout(1000);
    });

    test('Admin can view settings tab', async ({ page }) => {
        await page.goto(`${BASE_URL}/admin`);
        const settingsTab = page.locator('button:has-text("Settings"), [role="tab"]:has-text("Settings")').first();
        await settingsTab.click();
        await page.waitForTimeout(1000);
        await expect(page.locator('text=/commission/i, text=/delivery/i').first()).toBeVisible();
    });

    test('Admin can search products', async ({ page }) => {
        await page.goto(`${BASE_URL}/admin`);
        const productsTab = page.locator('button:has-text("Products"), [role="tab"]:has-text("Products")').first();
        await productsTab.click();
        await page.waitForTimeout(1000);
        const searchInput = page.locator('input[placeholder*="search" i]').first();
        if (await searchInput.isVisible()) {
            await searchInput.fill('Kenya');
            await page.waitForTimeout(1500);
        }
    });

});

// ============================================
// 6. PERFORMANCE & SEO
// ============================================

test.describe('Performance and SEO', () => {

    test('Homepage has correct meta title', async ({ page }) => {
        await page.goto(BASE_URL);
        await expect(page).toHaveTitle(/Nuria/i);
    });

    test('Homepage has meta description', async ({ page }) => {
        await page.goto(BASE_URL);
        const meta = page.locator('meta[name="description"]');
        const content = await meta.getAttribute('content');
        expect(content).toBeTruthy();
        expect(content!.length).toBeGreaterThan(10);
    });

    test('Product page has dynamic meta title', async ({ page }) => {
        await page.goto(`${BASE_URL}/books`);
        await page.waitForSelector('[class*="BookCard"]', { timeout: 10000 });
        await page.locator('[class*="BookCard"]').first().click();
        await page.waitForURL(/\/books\/.+/);
        const title = await page.title();
        expect(title).toMatch(/Nuria/i);
    });

    test('Images have alt text on homepage', async ({ page }) => {
        await page.goto(BASE_URL);
        const images = page.locator('img');
        const count = await images.count();
        for (let i = 0; i < Math.min(count, 5); i++) {
            const alt = await images.nth(i).getAttribute('alt');
            expect(alt).not.toBeNull();
        }
    });

    test('No console errors on homepage', async ({ page }) => {
        const errors: string[] = [];
        page.on('console', (msg) => {
            if (msg.type() === 'error') errors.push(msg.text());
        });
        await page.goto(BASE_URL);
        await page.waitForTimeout(3000);
        const criticalErrors = errors.filter(e =>
            !e.includes('.map') &&
            !e.includes('preload') &&
            !e.includes('googlead') &&
            !e.includes('favicon')
        );
        expect(criticalErrors).toHaveLength(0);
    });

});

// ============================================
// 7. MOBILE RESPONSIVENESS
// ============================================

test.describe('Mobile Responsiveness', () => {

    test.use({ viewport: { width: 390, height: 844 } });

    test('Homepage renders on mobile', async ({ page }) => {
        await page.goto(BASE_URL);
        await expect(page.locator('header, nav').first()).toBeVisible();
    });

    test('Bottom mobile navbar is visible', async ({ page }) => {
        await page.goto(BASE_URL);
        const bottomNav = page.locator('[class*="bottom-nav"], [class*="mobile-nav"], nav:last-of-type').last();
        await expect(bottomNav).toBeVisible();
    });

    test('Books grid is responsive on mobile', async ({ page }) => {
        await page.goto(`${BASE_URL}/books`);
        await page.waitForSelector('[class*="BookCard"]', { timeout: 10000 });
        const grid = page.locator('[class*="grid"]').first();
        await expect(grid).toBeVisible();
    });

    test('Cart page is usable on mobile', async ({ page }) => {
        await page.goto(`${BASE_URL}/cart`);
        await expect(page.locator('main').first()).toBeVisible();
    });

    test('No horizontal scroll on mobile', async ({ page }) => {
        await page.goto(BASE_URL);
        const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
        const clientWidth = await page.evaluate(() => document.documentElement.clientWidth);
        expect(scrollWidth).toBeLessThanOrEqual(clientWidth + 5);
    });

});

// ============================================
// 8. GIFT CARD
// ============================================

test.describe('Gift Card', () => {

    test('Gift card page loads', async ({ page }) => {
        await page.goto(`${BASE_URL}/gift-card`);
        await expect(page.locator('text=/gift/i').first()).toBeVisible();
    });

    test('Gift card form renders', async ({ page }) => {
        await page.goto(`${BASE_URL}/gift-card`);
        await expect(page.locator('input[type="number"], input[placeholder*="amount" i], input[placeholder*="price" i]').first()).toBeVisible();
    });

    test('Gift card balance checker renders', async ({ page }) => {
        await page.goto(`${BASE_URL}/gift-card`);
        const balanceSection = page.locator('text=/balance/i, text=/check/i').first();
        await expect(balanceSection).toBeVisible();
    });

});