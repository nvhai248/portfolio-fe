import { client } from '$lib/sanity';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
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

    const [posts, settings] = await Promise.all([
        client.fetch(postsQuery),
        client.fetch(settingsQuery)
    ]);

    return {
        posts,
        settings
    };
};
