import { client } from '$lib/sanity';
import { resolveLocale } from '$lib/i18n/locale';
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

export const load: PageServerLoad = async ({ setHeaders, params }) => {
	setHeaders({
		'cache-control': 'public, max-age=60, s-maxage=300, stale-while-revalidate=600'
	});

	const locale = resolveLocale(params.lang);

	try {
		const posts = await withTimeout(client.fetch(postsQuery), 2500);

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
