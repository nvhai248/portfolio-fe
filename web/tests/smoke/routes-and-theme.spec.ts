import { expect, test } from '@playwright/test';

type ThemeMode = 'light' | 'dark';

const routes = [
	{ path: '/vi', marker: /Xem dự án|View Projects/i },
	{ path: '/vi/about', marker: /How I contribute inside teams|đóng góp/i },
	{ path: '/vi/projects', marker: /Open University Moodle Optimization|Moodle/i },
	{ path: '/vi/cv', marker: /Kinh nghiệm|Experience/i },
	{ path: '/vi/blog', marker: /Đang chuẩn bị thêm bài viết|More posts in progress/i }
] as const;

const viewports = [
	{ name: 'mobile', width: 390, height: 844 },
	{ name: 'tablet', width: 768, height: 1024 },
	{ name: 'desktop', width: 1280, height: 800 }
] as const;

const themes: ThemeMode[] = ['light', 'dark'];

for (const viewport of viewports) {
	for (const theme of themes) {
		test.describe(`${viewport.name} | ${theme}`, () => {
			test.beforeEach(async ({ page }) => {
				await page.setViewportSize({ width: viewport.width, height: viewport.height });
				await page.addInitScript((mode: ThemeMode) => {
					localStorage.setItem('theme', mode);
				}, theme);
			});

			for (const route of routes) {
				test(`smoke route ${route.path}`, async ({ page }) => {
					const response = await page.goto(route.path);
					expect(response, `No response for ${route.path}`).not.toBeNull();
					expect(response!.ok(), `Unexpected status for ${route.path}: ${response!.status()}`).toBeTruthy();

					const html = page.locator('html');
					if (theme === 'dark') {
						await expect(html).toHaveClass(/dark/);
					} else {
						await expect(html).not.toHaveClass(/dark/);
					}

					await expect(page.getByTestId('main-content')).toBeVisible();
					await expect(page.getByTestId('site-footer')).toBeVisible();
					await expect(page.getByText(route.marker).first()).toBeVisible();
				});
			}
		});
	}
}

test('root redirects to locale prefix', async ({ page }) => {
	const response = await page.goto('/');
	expect(response?.status()).toBeLessThan(400);
	expect(page.url()).toMatch(/\/vi$|\/en$/);
});

test('language switch keeps route and switches locale', async ({ page }) => {
	await page.goto('/vi/projects');
	await page.getByRole('link', { name: 'English' }).click();
	await expect(page).toHaveURL(/\/en\/projects$/);
});

test('theme toggle persists after reload and navigation', async ({ page }) => {
	await page.setViewportSize({ width: 1280, height: 800 });
	await page.goto('/vi');

	const html = page.locator('html');
	const toggle = page.getByTestId('theme-toggle');

	const startsDark = (await html.getAttribute('class'))?.includes('dark') ?? false;

	await toggle.click();
	await expect(toggle).toHaveAttribute('aria-pressed', startsDark ? 'false' : 'true');

	const expected = startsDark ? 'light' : 'dark';
	const hasDarkClass = expected === 'dark';

	if (hasDarkClass) {
		await expect(html).toHaveClass(/dark/);
	} else {
		await expect(html).not.toHaveClass(/dark/);
	}

	await expect.poll(async () => page.evaluate(() => localStorage.getItem('theme'))).toBe(expected);

	await page.reload();
	if (hasDarkClass) {
		await expect(html).toHaveClass(/dark/);
	} else {
		await expect(html).not.toHaveClass(/dark/);
	}

	await page.goto('/vi/about');
	if (hasDarkClass) {
		await expect(html).toHaveClass(/dark/);
	} else {
		await expect(html).not.toHaveClass(/dark/);
	}
});
