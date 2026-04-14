import type { RequestHandler } from './$types';
import { resolveSiteUrl } from '$lib/seo/site';

export const prerender = true;

export const GET: RequestHandler = ({ url }) => {
	const origin = resolveSiteUrl(url.origin);
	const body = `User-agent: *
Allow: /

Sitemap: ${origin}/sitemap.xml
`;

	return new Response(body, {
		headers: {
			'Content-Type': 'text/plain; charset=utf-8',
			'Cache-Control': 'max-age=0, s-maxage=3600'
		}
	});
};
