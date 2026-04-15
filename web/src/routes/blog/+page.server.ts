import { getBlogPosts } from '$lib/content/sanity-content';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ setHeaders }) => {
	setHeaders({
		'cache-control': 'public, max-age=60, s-maxage=300, stale-while-revalidate=600'
	});

	try {
		const posts = await getBlogPosts();

		return {
			posts
		};
	} catch (error) {
		console.error('Failed to fetch blog posts from Sanity:', error);

		return {
			posts: []
		};
	}
};

