import { expect, test } from '@playwright/test';

test.beforeEach(async ({ page }) => {
	await page.route('https://api.frankfurter.app/**', (route) => route.fulfill({
		json: { rates: { VND: 25450, EUR: 0.94, JPY: 154.5, CNY: 7.24 } }
	}));
});

for (const locale of ['vi', 'en']) {
	test(`home scroll reveals keep layout stable in ${locale}`, async ({ page }) => {
		await page.setViewportSize({ width: locale === 'vi' ? 390 : 1280, height: 844 });
		await page.goto(`/${locale}`);
		await expect(page.locator('html')).toHaveAttribute('data-app-hydrated', 'true');
		await page.evaluate(() => document.fonts.ready);
		await expect(page.getByText('EUR', { exact: true }).first()).toBeAttached();
		const market = page.locator('.scroll-reveal').filter({ has: page.getByRole('heading', { name: locale === 'vi' ? 'Một góc theo dõi tỷ giá' : 'Global Market Data', exact: true }) });
		await expect(market).toHaveAttribute('data-state', 'pending');
		const height = await page.locator('main .page-shell').first().evaluate((node) => node.getBoundingClientRect().height);
		await market.scrollIntoViewIfNeeded();
		await expect(market).toHaveAttribute('data-state', 'visible');
		await expect(market.locator(':scope > .scroll-content')).toHaveCSS('opacity', '1');
		expect(await page.locator('main .page-shell').first().evaluate((node) => node.getBoundingClientRect().height)).toBe(height);
		const system = page.locator('.scroll-reveal').filter({ has: page.getByRole('heading', { name: locale === 'vi' ? 'Một chút về tôi' : 'System Index', exact: true }) });
		await system.scrollIntoViewIfNeeded();
		await expect(system).toHaveAttribute('data-state', 'visible');
		await expect(system.locator(':scope > .scroll-content')).toHaveCSS('opacity', '1');
		const contact = page.locator('.scroll-reveal').filter({ has: page.locator(`a[href$="/${locale}/contact"]`) });
		await contact.scrollIntoViewIfNeeded();
		await expect(contact).toHaveAttribute('data-state', 'visible');
		await expect(contact.locator(':scope > .scroll-content')).toHaveCSS('opacity', '1');
		expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
		await page.screenshot({ path: `/tmp/home-motion-${locale}.png` });
		await page.evaluate(() => window.scrollTo(0, 0));
		await expect(market).toHaveAttribute('data-state', 'visible');
	});
}

test('home reduced-motion preference reveals all groups immediately', async ({ page }) => {
	await page.emulateMedia({ reducedMotion: 'reduce' });
	await page.goto('/en');
	await expect(page.locator('html')).toHaveAttribute('data-app-hydrated', 'true');
	await expect(page.locator('.scroll-reveal[data-state="pending"]')).toHaveCount(0);
});

test('home print and preference changes expose pending groups', async ({ page }) => {
	await page.goto('/en');
	const contact = page.locator('.scroll-reveal').filter({ has: page.locator('a[href$="/en/contact"]') });
	await expect(contact).toHaveAttribute('data-state', 'pending');
	await page.emulateMedia({ media: 'print' });
	await expect(contact.locator(':scope > .scroll-content')).toHaveCSS('opacity', '1');
	await expect(contact.locator(':scope > .scroll-content')).toHaveCSS('translate', 'none');
	await page.emulateMedia({ media: 'screen', reducedMotion: 'reduce' });
	await expect(page.locator('.scroll-reveal[data-state="pending"]')).toHaveCount(0);
});

test('home retains hero and contact content without JavaScript', async ({ browser }) => {
	const context = await browser.newContext({ javaScriptEnabled: false });
	const page = await context.newPage();
	await page.goto('http://127.0.0.1:4173/en');
	await expect(page.locator('main h1')).toBeVisible();
	await expect(page.locator('main a[href$="/en/contact"]')).toBeVisible();
	await expect(page.getByRole('heading', { name: 'System Index', exact: true })).toBeVisible();
	await context.close();
});
