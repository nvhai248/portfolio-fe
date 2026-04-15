import { client } from '$lib/sanity';
import { getBlogPosts } from '$lib/content/sanity-content';
import type { PageServerLoad } from './$types';

const settingsQuery = `*[_type == "settings"][0] {
	socials
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
		const [posts, settings] = await Promise.all([
			getBlogPosts(3),
			withTimeout(client.fetch(settingsQuery), 2500)
		]);

		return {
			posts,
			settings
		};
	} catch (error) {
		console.error('Failed to fetch homepage data from Sanity:', error);

		return {
			posts: [],
			settings: null
		};
	}
};

