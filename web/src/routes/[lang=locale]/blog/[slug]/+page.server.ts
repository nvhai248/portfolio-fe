import { error } from '@sveltejs/kit';
import { getBlogPostBySlug } from '$lib/content/sanity-content';
import { resolveLocale } from '$lib/i18n/locale';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params, setHeaders }) => {
	setHeaders({
		'cache-control': 'public, max-age=60, s-maxage=300, stale-while-revalidate=600'
	});

	const locale = resolveLocale(params.lang);
	const post = await getBlogPostBySlug(params.slug, locale);

	if (!post) {
		throw error(404, 'Post not found');
	}

	return {
		locale,
		post
	};
};
