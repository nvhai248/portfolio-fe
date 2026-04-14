import type { RequestHandler } from './$types';
import { resolveSiteUrl, toAbsoluteUrl } from '$lib/seo/site';

const staticRoutes = ['/', '/about', '/projects', '/cv', '/blog', '/blog/optimizing-moodle-with-ollama-ai'];

export const prerender = true;

export const GET: RequestHandler = ({ url }) => {
	const origin = resolveSiteUrl(url.origin);
	const now = new Date().toISOString();

	const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${staticRoutes
	.map(
		(route) => `  <url>
    <loc>${toAbsoluteUrl(route, origin)}</loc>
    <lastmod>${now}</lastmod>
  </url>`
	)
	.join('\n')}
</urlset>`;

	return new Response(xml, {
		headers: {
			'Content-Type': 'application/xml; charset=utf-8',
			'Cache-Control': 'max-age=0, s-maxage=3600'
		}
	});
};
