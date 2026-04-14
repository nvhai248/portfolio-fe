import { defineConfig, devices } from '@playwright/test';

const port = 4173;
const isCI = !!process.env.CI;

export default defineConfig({
	testDir: './tests/smoke',
	fullyParallel: true,
	retries: isCI ? 1 : 0,
	workers: 1,
	timeout: 30_000,
	reporter: isCI
		? [['github'], ['html', { outputFolder: 'playwright-report', open: 'never' }], ['list']]
		: [['list']],
	use: {
		baseURL: `http://127.0.0.1:${port}`,
		trace: 'on-first-retry'
	},
	webServer: {
		command: `npm run dev -- --host 127.0.0.1 --port ${port}`,
		port,
		reuseExistingServer: true,
		timeout: 120_000
	},
	projects: [
		{
			name: 'chromium',
			use: { ...devices['Desktop Chrome'] }
		}
	]
});
