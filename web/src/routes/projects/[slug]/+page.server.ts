import { error } from '@sveltejs/kit';
import { getProjectBySlug } from '$lib/content/sanity-content';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params, setHeaders }) => {
	setHeaders({
		'cache-control': 'public, max-age=60, s-maxage=300, stale-while-revalidate=600'
	});

	const project = await getProjectBySlug(params.slug);

	if (!project) {
		throw error(404, 'Project not found');
	}

	return {
		project
	};
};
