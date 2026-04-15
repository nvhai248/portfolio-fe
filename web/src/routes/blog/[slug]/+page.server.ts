import { error } from '@sveltejs/kit';
import { getBlogPostBySlug } from '$lib/content/sanity-content';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params, setHeaders }) => {
	setHeaders({
		'cache-control': 'public, max-age=60, s-maxage=300, stale-while-revalidate=600'
	});

	const post = await getBlogPostBySlug(params.slug);

	if (!post) {
		throw error(404, 'Post not found');
	}

	return {
		post
	};
};
