import { resolveLocale } from '$lib/i18n/locale';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ setHeaders, params }) => {
	setHeaders({
		'cache-control': 'public, max-age=60, s-maxage=300, stale-while-revalidate=600'
	});

	return {
		locale: resolveLocale(params.lang)
	};
};
