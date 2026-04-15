import { client } from '$lib/sanity';
import { resolveLocale } from '$lib/i18n/locale';
import type { PageServerLoad } from './$types';

const postsQuery = `*[_type == "post"] | order(publishedAt desc)[0...3] {
	title,
	slug,
	mainImage,
	categories,
	publishedAt,
	body
}`;

const settingsQuery = `*[_type == "settings"][0] {
	socials
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
		const [posts, settings] = await Promise.all([
			withTimeout(client.fetch(postsQuery), 2500),
			withTimeout(client.fetch(settingsQuery), 2500)
		]);

		return {
			locale,
			posts,
			settings
		};
	} catch (error) {
		console.error('Failed to fetch homepage data from Sanity:', error);

		return {
			locale,
			posts: [],
			settings: null
		};
	}
};
