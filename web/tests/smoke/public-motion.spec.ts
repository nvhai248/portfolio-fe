import { expect, test } from '@playwright/test';

const routes = [
	'/projects', '/projects/open-university-moodle-optimization', '/blog',
	'/blog/optimizing-moodle-with-ollama-ai', '/contact', '/tools',
	'/tools/salary', '/tools/image', '/tools/image-compress', '/tools/music',
	'/tools/diagram', '/tools/database'
];

for (const locale of ['vi', 'en']) {
	for (const route of routes) {
		test(`public animation route ${locale}${route}`, async ({ page }) => {
			await page.setViewportSize({ width: locale === 'vi' ? 390 : 1280, height: 844 });
			const response = await page.goto(`/${locale}${route}`);
			expect(response?.ok()).toBe(true);
			await expect(page.locator('main h1')).toBeVisible();
			await expect(page.locator('html')).toHaveAttribute('data-app-hydrated', 'true');
			expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
		});
	}
}

test('project cards reveal once with stable layout and keyboard access', async ({ page }) => {
	await page.goto('/en/projects');
	const card = page.locator('main section > article').last();
	await expect(card).toHaveAttribute('data-page-reveal', 'pending');
	const height = await page.locator('main').evaluate((node) => node.getBoundingClientRect().height);
	await card.scrollIntoViewIfNeeded();
	await expect(card).toHaveAttribute('data-page-reveal', 'visible');
	await expect(card).toHaveCSS('opacity', '1');
	expect(await page.locator('main').evaluate((node) => node.getBoundingClientRect().height)).toBe(height);
	await page.screenshot({ path: '/tmp/public-motion-projects.png' });
	await page.evaluate(() => window.scrollTo(0, 0));
	await expect(card).toHaveAttribute('data-page-reveal', 'visible');
	await page.reload();
	await expect(card).toHaveAttribute('data-page-reveal', 'pending');
	await card.locator('a').first().focus();
	await expect(card).toHaveCSS('opacity', '1');
});

test('article anchors reveal headings and preserve the hash', async ({ page }) => {
	await page.goto('/en/blog/optimizing-moodle-with-ollama-ai');
	const heading = page.locator('#benchmarks');
	await expect(heading).toHaveAttribute('data-page-reveal', 'pending');
	await page.locator('a[href="#benchmarks"]').click();
	await expect(page).toHaveURL(/#benchmarks$/);
	await expect(heading).toHaveAttribute('data-page-reveal', 'visible');
	await expect(heading).toHaveCSS('opacity', '1');
	await page.screenshot({ path: '/tmp/public-motion-article.png' });
});

test('client navigation initializes new project detail reveals', async ({ page }) => {
	await page.goto('/en/projects');
	await expect(page.locator('html')).toHaveAttribute('data-app-hydrated', 'true');
	const target = page.getByRole('link', { name: 'Open University Moodle (Enterprise LMS Platform)', exact: true });
	const sourceCard = target.locator('xpath=ancestor::article[contains(@class, "sys-project-card")]');
	await sourceCard.scrollIntoViewIfNeeded();
	await expect(sourceCard).toHaveAttribute('data-page-reveal', 'visible');
	await Promise.all([
		page.waitForURL(/\/en\/projects\/open-university-moodle-optimization$/),
		target.click()
	]);
	const lastBlock = page.getByTestId('project-detail-card').last();
	await expect(lastBlock).toHaveAttribute('data-page-reveal', 'pending');
	await lastBlock.scrollIntoViewIfNeeded();
	await expect(lastBlock).toHaveAttribute('data-page-reveal', 'visible');
	await expect(lastBlock).toHaveCSS('opacity', '1');
});

test('remaining pages respect reduced motion and printing', async ({ page }) => {
	await page.goto('/en/blog/optimizing-moodle-with-ollama-ai');
	const heading = page.locator('#benchmarks');
	await expect(heading).toHaveAttribute('data-page-reveal', 'pending');
	await page.emulateMedia({ media: 'print' });
	await expect(heading).toHaveCSS('opacity', '1');
	await expect(heading).toHaveCSS('translate', 'none');
	await page.emulateMedia({ media: 'screen', reducedMotion: 'reduce' });
	await expect(page.locator('[data-page-reveal="pending"]')).toHaveCount(0);
	await page.goto('/vi/tools');
	await expect(page.locator('html')).toHaveAttribute('data-app-hydrated', 'true');
	await expect(page.locator('.scroll-reveal[data-state="pending"]')).toHaveCount(0);
	await page.screenshot({ path: '/tmp/public-motion-tools.png' });
});

test('contact form and article content remain available without JavaScript', async ({ browser }) => {
	const context = await browser.newContext({ javaScriptEnabled: false });
	const page = await context.newPage();
	await page.goto('http://127.0.0.1:4173/en/contact');
	await expect(page.locator('main input').first()).toBeVisible();
	await expect(page.locator('main textarea')).toBeVisible();
	await page.goto('http://127.0.0.1:4173/en/blog/optimizing-moodle-with-ollama-ai');
	await expect(page.locator('#benchmarks')).toHaveCSS('opacity', '1');
	await context.close();
});
