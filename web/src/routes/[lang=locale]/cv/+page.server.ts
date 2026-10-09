import { resolveLocale } from '$lib/i18n/locale';
import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = ({ params, url }) => {
	const locale = resolveLocale(params.lang);
	redirect(308, `/${locale}/about${url.search}#cv`);
};
