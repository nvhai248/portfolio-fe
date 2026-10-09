import { redirect } from '@sveltejs/kit';
import { detectPreferredLocale } from '$lib/i18n/locale';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params, request }) => {
	const preferred = detectPreferredLocale(request.headers.get('accept-language'));
	throw redirect(307, `/${preferred}/projects/${params.slug}`);
};
