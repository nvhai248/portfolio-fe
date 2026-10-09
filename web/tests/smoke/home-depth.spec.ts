import { expect, test } from '@playwright/test';

for (const locale of ['vi', 'en']) {
	test(`3D Home responds to pointer and scroll in ${locale}`, async ({ page }) => {
		await page.setViewportSize({ width: 1440, height: 1000 });
		await page.goto(`/${locale}`);
		await expect(page.locator('html')).toHaveAttribute('data-app-hydrated', 'true');
		const art = page.locator('.sculpture');
		await expect(art.locator('.server-layer')).toHaveCount(3);
		const box = (await art.boundingBox())!;
		await page.mouse.move(box.x + box.width * .85, box.y + box.height * .4);
		await expect.poll(() => art.evaluate(el => el.style.getPropertyValue('--depth-x'))).not.toBe('0deg');
		const angle = await art.evaluate(el => el.style.getPropertyValue('--depth-scroll'));
		await page.evaluate(() => window.scrollBy(0, 150));
		await expect.poll(() => art.evaluate(el => el.style.getPropertyValue('--depth-scroll'))).not.toBe(angle);
		await page.emulateMedia({ reducedMotion: 'reduce' });
		await expect.poll(() => art.evaluate(el => el.style.getPropertyValue('--depth-x'))).toBe('0deg');
		await expect(art.locator('.sculpture-world')).toHaveCSS('transition-duration', '0s');
		await page.evaluate(() => window.scrollTo(0, 0));
		await expect(page.locator(`main a[href="/${locale}/projects"]`)).toBeVisible();
		await expect(page.locator(`main a[href="/${locale}/about#cv"]`)).toBeVisible();
		await page.screenshot({ path: `/tmp/home-depth-${locale}-desktop.png` });
	});
}

test('3D Home images fit mobile and dark mode', async ({ page }) => {
	await page.setViewportSize({ width: 390, height: 844 });
	await page.addInitScript(() => localStorage.setItem('theme', 'dark'));
	await page.goto('/vi');
	await expect(page.locator('html')).toHaveClass(/dark/);
	await page.locator('.sculpture').scrollIntoViewIfNeeded();
	await page.screenshot({ path: '/tmp/home-depth-mobile-dark.png' });
	await page.locator('#engineering-heading').scrollIntoViewIfNeeded();
	const images = page.locator('.study-image');
	await expect(images).toHaveCount(3);
	for (const image of await images.all()) {
		await image.scrollIntoViewIfNeeded();
		await expect.poll(() => image.evaluate(el => (el as HTMLImageElement).naturalWidth)).toBeGreaterThan(0);
	}
	expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});

test('3D sculpture and illustrations render without JavaScript', async ({ browser }) => {
	const context = await browser.newContext({ javaScriptEnabled: false });
	const page = await context.newPage();
	await page.goto('/en');
	await expect(page.locator('.sculpture')).toBeVisible();
	await expect(page.locator('main h1')).toBeVisible();
	await expect(page.locator('.study-image')).toHaveCount(3);
	await context.close();
});

test('currency cards and writing chart respond in 3D with reduced-motion support', async ({ page }) => {
	await page.route('https://api.frankfurter.app/**', route => route.fulfill({ json: { rates: { VND: 25450, EUR: .94, JPY: 154.5, CNY: 7.24 } } }));
	await page.setViewportSize({ width: 1440, height: 1000 });
	await page.goto('/vi');
	const currency = page.locator('.currency-depth').first();
	await expect(page.locator('.currency-card')).toHaveCount(5);
	for (const widget of [currency, page.locator('.writing-depth')]) {
		await widget.scrollIntoViewIfNeeded();
		const box = (await widget.boundingBox())!;
		await page.mouse.move(box.x + box.width * .85, box.y + box.height * .5);
		await expect.poll(() => widget.evaluate(el => el.style.getPropertyValue('--depth-x'))).not.toBe('0deg');
	}
	await expect(page.locator('.writing-depth .month-bar')).toHaveCount(12);
	await expect(page.locator('.writing-depth .sr-only li')).toHaveCount(12);
	await page.locator('.writing-depth').screenshot({ path: '/tmp/home-writing-3d.png' });
	await currency.scrollIntoViewIfNeeded();
	await page.locator('.currency-depth').last().scrollIntoViewIfNeeded();
	await page.locator('.currency-depth').first().locator('..').screenshot({ path: '/tmp/home-currency-3d.png' });
	await page.emulateMedia({ reducedMotion: 'reduce' });
	await expect(page.locator('.currency-card').first()).toHaveCSS('transform', 'none');
	await expect(page.locator('.chart-world')).toHaveCSS('transition-duration', '0s');
	await page.setViewportSize({ width: 390, height: 844 });
	await page.locator('.writing-depth').scrollIntoViewIfNeeded();
	expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});
