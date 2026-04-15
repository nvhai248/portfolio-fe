import { resolveLocale } from '$lib/i18n/locale';
import { getProjectsContent } from '$lib/content/sanity-content';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ setHeaders, params }) => {
	setHeaders({
		'cache-control': 'public, max-age=60, s-maxage=300, stale-while-revalidate=600'
	});

	const locale = resolveLocale(params.lang);

	return {
		locale,
		projectsContent: await getProjectsContent(locale)
	};
};
