import { expect, test, type Page, type Response } from '@playwright/test';

type ThemeMode = 'light' | 'dark';
type SmokeRoute = {
	path: string;
	marker?: RegExp;
};

const routes: ReadonlyArray<SmokeRoute> = [
	{ path: '/vi', marker: /Xem dự án|View Projects/i },
	{ path: '/vi/about', marker: /How I contribute inside teams|đóng góp/i },
	{ path: '/vi/projects', marker: /Open University Moodle Optimization|Moodle/i },
	{ path: '/vi/cv', marker: /Kinh nghiệm|Experience/i },
	{ path: '/vi/blog' }
] as const;

const viewports = [
	{ name: 'mobile', width: 390, height: 844 },
	{ name: 'tablet', width: 768, height: 1024 },
	{ name: 'desktop', width: 1280, height: 800 }
] as const;

const themes: ThemeMode[] = ['light', 'dark'];
const blogEmptyStateMarker = /Đang chuẩn bị thêm bài viết|More posts in progress/i;
const retriableNavigationErrors = ['ERR_NO_BUFFER_SPACE', 'ERR_CONNECTION_RESET', 'ERR_CONNECTION_REFUSED'];

const isRetriableNavigationError = (error: unknown): boolean =>
	error instanceof Error &&
	retriableNavigationErrors.some((fragment) => error.message.includes(fragment));

const gotoWithRetry = async (page: Page, path: string): Promise<Response | null> => {
	const maxAttempts = 2;

	for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
		try {
			return await page.goto(path);
		} catch (error) {
			if (attempt === maxAttempts || !isRetriableNavigationError(error)) {
				throw error;
			}
			await page.waitForTimeout(500);
		}
	}

	return null;
};

const waitForAppHydration = async (page: Page): Promise<void> => {
	await expect(page.locator('html')).toHaveAttribute('data-app-hydrated', 'true');
};

const assertBlogContentIsVisible = async (page: Page): Promise<void> => {
	await expect
		.poll(async () => {
			const cardCount = await page.locator('a.ui-card-link').count();
			if (cardCount > 0) {
				return true;
			}

			const emptyStateCount = await page.getByText(blogEmptyStateMarker).count();
			return emptyStateCount > 0;
		})
		.toBeTruthy();

	const cardCount = await page.locator('a.ui-card-link').count();
	if (cardCount > 0) {
		await expect(page.locator('a.ui-card-link').first()).toBeVisible();
		return;
	}

	await expect(page.getByText(blogEmptyStateMarker).first()).toBeVisible();
};

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
					const response = await gotoWithRetry(page, route.path);
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

					if (route.marker) {
						await expect(page.getByText(route.marker).first()).toBeVisible();
					} else {
						await assertBlogContentIsVisible(page);
					}
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
	await page.setViewportSize({ width: 1280, height: 800 });
	await page.goto('/vi/projects');
	await waitForAppHydration(page);

	// Open the language switcher dropdown
	await page.getByTestId('language-toggle').click();

	// Click English
	await page.getByTestId('language-link-en').click();

	await expect(page).toHaveURL(/\/en\/projects\/?$/);
});

test('theme toggle persists after reload and navigation', async ({ page }) => {
	await page.setViewportSize({ width: 1280, height: 800 });
	await page.goto('/vi');
	await waitForAppHydration(page);

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
