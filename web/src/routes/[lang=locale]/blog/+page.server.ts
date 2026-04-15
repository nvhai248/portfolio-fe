import { getBlogPosts } from '$lib/content/sanity-content';
import { resolveLocale } from '$lib/i18n/locale';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ setHeaders, params }) => {
	setHeaders({
		'cache-control': 'public, max-age=60, s-maxage=300, stale-while-revalidate=600'
	});

	const locale = resolveLocale(params.lang);

	try {
		const posts = await getBlogPosts(undefined, locale);

		return {
			locale,
			posts
		};
	} catch (error) {
		console.error('Failed to fetch blog posts from Sanity:', error);

		return {
			locale,
			posts: []
		};
	}
};
