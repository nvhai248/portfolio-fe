import { expect, test } from '@playwright/test';

test('scroll reveals content once without changing page height', async ({ page }) => {
	await page.setViewportSize({ width: 1280, height: 800 });
	await page.goto('/en/about');
	const heading = page.getByRole('heading', { name: 'Technical capabilities', exact: true });
	await expect(heading).toHaveAttribute('data-profile-reveal', 'pending');
	await expect(heading).toHaveCSS('opacity', '0');
	const height = await page.locator('.profile-motion').evaluate((node) => node.getBoundingClientRect().height);
	await heading.scrollIntoViewIfNeeded();
	await expect(heading).toHaveAttribute('data-profile-reveal', 'visible');
	await expect(heading).toHaveCSS('opacity', '1');
	await expect(heading).toHaveCSS('translate', '0px');
	expect(await page.locator('.profile-motion').evaluate((node) => node.getBoundingClientRect().height)).toBe(height);
	await page.screenshot({ path: '/tmp/profile-scroll-desktop.png' });
	await page.evaluate(() => window.scrollTo(0, 0));
	await expect(heading).toHaveAttribute('data-profile-reveal', 'visible');
});

test('profile principles join the existing restrained scroll reveal', async ({ page }) => {
	await page.setViewportSize({ width: 1280, height: 800 });
	await page.goto('/en/about');
	const direction = page.getByRole('region', { name: 'Mission & vision', exact: true });
	const directionCard = direction.locator('.principle-direction-card').first();
	const value = page.getByRole('region', { name: 'Core values', exact: true });
	const valueCard = value.locator('.principle-value-card').first();

	await expect(directionCard).toHaveAttribute('data-profile-reveal', 'pending');
	await directionCard.scrollIntoViewIfNeeded();
	await expect(directionCard).toHaveAttribute('data-profile-reveal', 'visible');
	await expect(valueCard).toHaveAttribute('data-profile-reveal', 'visible');
});

test('profile principle dividers remain visible in dark mode', async ({ page }) => {
	await page.setViewportSize({ width: 1280, height: 800 });
	await page.emulateMedia({ colorScheme: 'dark' });
	await page.goto('/en/about');
	await expect(page.locator('html')).toHaveClass(/dark/);

	const directionDivider = page.getByRole('region', { name: 'Mission & vision', exact: true }).locator('.principle-direction-card').nth(1);
	const valueDivider = page.getByRole('region', { name: 'Core values', exact: true }).locator('.principle-value-card').nth(1);
	await expect(directionDivider).toHaveCSS('border-left-color', 'rgb(30, 41, 59)');
	await expect(valueDivider).toHaveCSS('border-left-color', 'rgb(30, 41, 59)');
});

test('mobile contact reveal does not overflow horizontally', async ({ page }) => {
	await page.setViewportSize({ width: 390, height: 844 });
	await page.goto('/vi/about');
	const heading = page.getByRole('heading', { name: 'Liên hệ & hồ sơ', exact: true });
	await expect(heading).toHaveAttribute('data-profile-reveal', 'pending');
	await heading.scrollIntoViewIfNeeded();
	await expect(heading).toHaveCSS('opacity', '1');
	await expect(page.locator('main a[href="tel:+84813042255"]')).toHaveCSS('opacity', '1');
	expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
	await page.screenshot({ path: '/tmp/profile-scroll-mobile.png' });
});

test('reduced motion keeps all content visible immediately', async ({ page }) => {
	await page.emulateMedia({ reducedMotion: 'reduce' });
	await page.goto('/en/about');
	await expect(page.locator('html')).toHaveAttribute('data-app-hydrated', 'true');
	await expect(page.locator('[data-profile-reveal="pending"]')).toHaveCount(0);
	await expect(page.getByRole('heading', { name: 'Contact & profiles', exact: true })).toHaveCSS('opacity', '1');
});

test('printing exposes unrevealed content', async ({ page }) => {
	await page.goto('/en/about');
	const heading = page.getByRole('heading', { name: 'Contact & profiles', exact: true });
	await expect(heading).toHaveAttribute('data-profile-reveal', 'pending');
	await page.emulateMedia({ media: 'print' });
	await expect(heading).toHaveCSS('opacity', '1');
	await expect(heading).toHaveCSS('translate', 'none');
});

test('switching reduced motion on cancels pending reveals', async ({ page }) => {
	await page.goto('/en/about');
	const heading = page.getByRole('heading', { name: 'Contact & profiles', exact: true });
	await expect(heading).toHaveAttribute('data-profile-reveal', 'pending');
	await page.emulateMedia({ reducedMotion: 'reduce' });
	await expect(page.locator('[data-profile-reveal="pending"]')).toHaveCount(0);
	await expect(heading).toHaveCSS('translate', 'none');
	await expect(heading).toHaveCSS('opacity', '1');
});

test('profile content remains available without JavaScript', async ({ browser }) => {
	const context = await browser.newContext({ javaScriptEnabled: false });
	const page = await context.newPage();
	await page.goto('http://127.0.0.1:4173/en/about');
	await expect(page.getByRole('heading', { name: 'Contact & profiles', exact: true })).toHaveCSS('opacity', '1');
	await expect(page.locator('main a[href="https://github.com/nvhai248"]')).toBeVisible();
	await context.close();
});
