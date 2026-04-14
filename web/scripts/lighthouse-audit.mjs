import fs from 'node:fs/promises';
import path from 'node:path';
import { launch } from 'chrome-launcher';
import lighthouse from 'lighthouse';

const baseUrl = process.argv[2] || 'http://localhost:5173';
const outDir = process.argv[3] || 'docs/lighthouse/baseline';

const routes = ['/', '/about', '/projects', '/blog', '/cv'];

const configs = [
  {
    name: 'mobile',
    settings: {
      formFactor: 'mobile',
      throttlingMethod: 'simulate'
    }
  },
  {
    name: 'desktop',
    settings: {
      formFactor: 'desktop',
      screenEmulation: {
        mobile: false,
        width: 1350,
        height: 940,
        deviceScaleFactor: 1,
        disabled: false
      },
      throttlingMethod: 'simulate'
    }
  }
];

const slug = (route) => (route === '/' ? 'home' : route.replace(/^\//, '').replace(/\//g, '-'));

const collectMetrics = (lhr) => ({
  performance: Math.round((lhr.categories.performance?.score ?? 0) * 100),
  accessibility: Math.round((lhr.categories.accessibility?.score ?? 0) * 100),
  bestPractices: Math.round((lhr.categories['best-practices']?.score ?? 0) * 100),
  seo: Math.round((lhr.categories.seo?.score ?? 0) * 100),
  lcpMs: Math.round(lhr.audits['largest-contentful-paint']?.numericValue ?? 0),
  cls: Number((lhr.audits['cumulative-layout-shift']?.numericValue ?? 0).toFixed(3)),
  inpMs: Math.round(lhr.audits['interaction-to-next-paint']?.numericValue ?? 0),
  tbtMs: Math.round(lhr.audits['total-blocking-time']?.numericValue ?? 0)
});

await fs.mkdir(outDir, { recursive: true });
const userDataDir = path.resolve('.lighthouse-profile');
await fs.mkdir(userDataDir, { recursive: true });

const summary = {};

for (const route of routes) {
  summary[route] = {};
  const targetUrl = `${baseUrl}${route}`;

  for (const config of configs) {
    const chrome = await launch({
      chromeFlags: ['--headless=new', '--no-sandbox', '--disable-dev-shm-usage'],
      userDataDir
    });

    try {
      const result = await lighthouse(targetUrl, {
        port: chrome.port,
        output: 'json',
        logLevel: 'error',
        onlyCategories: ['performance', 'accessibility', 'best-practices', 'seo'],
        ...config.settings
      });

      const file = path.join(outDir, `${config.name}-${slug(route)}.json`);
      await fs.writeFile(file, result.report, 'utf8');
      summary[route][config.name] = collectMetrics(result.lhr);
    } finally {
      try {
        await chrome.kill();
      } catch {
        // ignore launcher cleanup errors on Windows temp dir locks
      }
    }
  }
}

await fs.writeFile(path.join(outDir, 'summary.json'), JSON.stringify(summary, null, 2), 'utf8');
console.log(JSON.stringify(summary, null, 2));
