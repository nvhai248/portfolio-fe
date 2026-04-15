import type { RequestHandler } from './$types';
import { locales } from '$lib/i18n/config';
import { resolveSiteUrl, toAbsoluteUrl } from '$lib/seo/site';

const bareRoutes = ['/', '/about', '/projects', '/cv', '/blog', '/blog/optimizing-moodle-with-ollama-ai'];

export const prerender = true;

export const GET: RequestHandler = ({ url }) => {
	const origin = resolveSiteUrl(url.origin);
	const now = new Date().toISOString();

	const localizedRoutes = locales.flatMap((locale) =>
		bareRoutes.map((route) => (route === '/' ? `/${locale}` : `/${locale}${route}`))
	);

	const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${localizedRoutes
	.map((route) => {
		const bare = route.replace(/^\/(vi|en)/, '') || '/';
		const links = locales
			.map((locale) => {
				const alt = bare === '/' ? `/${locale}` : `/${locale}${bare}`;
				return `    <xhtml:link rel="alternate" hreflang="${locale}" href="${toAbsoluteUrl(alt, origin)}" />`;
			})
			.join('\n');

		return `  <url>
    <loc>${toAbsoluteUrl(route, origin)}</loc>
    <lastmod>${now}</lastmod>
${links}
  </url>`;
	})
	.join('\n')}
</urlset>`;

	return new Response(xml, {
		headers: {
			'Content-Type': 'application/xml; charset=utf-8',
			'Cache-Control': 'max-age=0, s-maxage=3600'
		}
	});
};
