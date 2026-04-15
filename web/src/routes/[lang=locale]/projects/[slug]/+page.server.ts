import { error } from '@sveltejs/kit';
import { resolveLocale } from '$lib/i18n/locale';
import { getProjectBySlug } from '$lib/content/sanity-content';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params, setHeaders }) => {
	setHeaders({
		'cache-control': 'public, max-age=60, s-maxage=300, stale-while-revalidate=600'
	});

	const locale = resolveLocale(params.lang);
	const project = await getProjectBySlug(params.slug, locale);

	if (!project) {
		throw error(404, locale === 'vi' ? 'Không tìm thấy dự án' : 'Project not found');
	}

	return {
		locale,
		project
	};
};
