import { client } from '$lib/sanity';
import type { PageServerLoad } from './$types';

const postsQuery = `*[_type == "post"] | order(publishedAt desc){
  _id,
  title,
  slug,
  mainImage,
  categories,
  publishedAt,
  body
}`;

const withTimeout = async <T>(promise: Promise<T>, timeoutMs = 2500): Promise<T> => {
	const timeoutPromise = new Promise<never>((_, reject) => {
		setTimeout(() => reject(new Error(`Timed out after ${timeoutMs}ms`)), timeoutMs);
	});

	return Promise.race([promise, timeoutPromise]);
};

export const load: PageServerLoad = async ({ setHeaders }) => {
	setHeaders({
		'cache-control': 'public, max-age=60, s-maxage=300, stale-while-revalidate=600'
	});

	try {
		const posts = await withTimeout(client.fetch(postsQuery), 2500);

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
