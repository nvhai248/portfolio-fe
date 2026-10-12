import { expect, test } from '@playwright/test';

for (const locale of ['vi', 'en']) {
	test(`combined About and CV content in ${locale}`, async ({ page }) => {
		await page.setViewportSize({ width: 390, height: 844 });
		await page.goto(`/${locale}/about`);

		await expect(page.locator('main h1')).toHaveCount(1);
		await expect(page.locator('main .ui-eyebrow').first()).toBeVisible();
		expect(await page.locator('main section').nth(1).locator('article').count()).toBeGreaterThan(0);
		await expect(page.locator('main section').nth(2).getByRole('heading')).toBeVisible();
		expect(await page.locator('main section').nth(2).locator('li').count()).toBeGreaterThan(0);
		await expect(page.locator('#cv')).toBeVisible();
		await expect(page.getByRole('heading', { name: locale === 'vi' ? 'Kinh nghiệm dự án' : 'Project experience', exact: true })).toBeVisible();
		await expect(page.getByRole('heading', { name: locale === 'vi' ? 'Học vấn' : 'Education', exact: true })).toBeVisible();
		const skills = page.locator('main section').filter({ has: page.getByRole('heading', { name: locale === 'vi' ? 'Năng lực công nghệ' : 'Technical capabilities', exact: true }) });
		await expect(skills.locator('h2')).toBeVisible();
		expect(await skills.locator('h3').count()).toBeGreaterThan(0);
		if (locale === 'en') {
			await expect(page.getByRole('region', { name: 'Mission & vision', exact: true }).locator('article')).toHaveCount(2);
			await expect(page.getByRole('region', { name: 'Core values', exact: true }).locator('article')).toHaveCount(4);
		} else {
			await expect(page.getByRole('region', { name: 'Tầm nhìn & sứ mệnh', exact: true }).locator('article')).toHaveCount(2);
			await expect(page.getByRole('region', { name: 'Giá trị cốt lõi', exact: true }).locator('article')).toHaveCount(4);
		}
		await expect(page.locator('#cv a[href^="https://drive.google.com/file/"]')).toBeVisible();
		await expect(page.locator('#cv a[href^="mailto:"]')).toBeVisible();
		await expect(page.getByRole('heading', { name: locale === 'vi' ? 'Ngôn ngữ' : 'Languages', exact: true })).toBeVisible();
		await expect(page.getByRole('heading', { name: locale === 'vi' ? 'Chứng chỉ & khóa học' : 'Certifications & courses', exact: true })).toBeVisible();
		await expect(page.locator('main a[href="tel:+84813042255"]')).toBeVisible();
		await expect(page.locator('main a[href="https://github.com/nvhai248"]')).toBeVisible();
		await expect(page.locator('main a[href*="/learning/certificates/"]')).toHaveCount(3);
		await expect(page.locator('main')).toContainText('2020–2024');
		await expect(page.locator('main')).not.toContainText('Class of 2019');
		await expect(page.getByRole('heading', { level: 1 })).toHaveText(locale === 'vi' ? 'Nguyễn Văn Hải — Kỹ sư Backend & DevOps' : 'Nguyen Van Hai — Backend & DevOps Engineer');
		await expect(page).toHaveTitle(/Giới thiệu & CV|About & CV/);
		await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', new RegExp(`/${locale}/about$`));
		await expect(page.locator(`a[href="/${locale}/cv"]`)).toHaveCount(0);
		expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
	});

	test(`old CV URL redirects to combined page in ${locale}`, async ({ request }) => {
		const response = await request.get(`/${locale}/cv?source=bookmark`, { maxRedirects: 0 });
		expect(response.status()).toBe(308);
		expect(response.headers().location).toBe(`/${locale}/about?source=bookmark#cv`);
	});
}

test('sitemap lists the combined route only', async ({ request }) => {
	const response = await request.get('/sitemap.xml');
	const xml = await response.text();
	expect(xml).toContain('/vi/about');
	expect(xml).toContain('/en/about');
	expect(xml).not.toContain('/cv');
});

test('language switch updates the complete static profile', async ({ page }) => {
	await page.goto('/vi/about');
	await expect(page.locator('html')).toHaveAttribute('data-app-hydrated', 'true');
	await page.getByTestId('language-toggle').click();
	await page.getByTestId('language-link-en').click();
	await expect(page).toHaveURL(/\/en\/about$/);
	await expect(page.getByRole('heading', { level: 1 })).toHaveText('Nguyen Van Hai — Backend & DevOps Engineer');
	await expect(page.getByRole('heading', { name: 'Technical capabilities', exact: true })).toBeVisible();
	await expect(page.getByRole('heading', { name: 'Certifications & courses', exact: true })).toBeVisible();
	await expect(page.locator('main')).not.toContainText('Cách tôi đóng góp trong đội ngũ');
});
