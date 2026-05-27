import { requireAdmin } from '$lib/auth/requireAdmin';
import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async (event) => {
	if (!event.locals.user) {
		throw redirect(302, `/auth/google?next=${encodeURIComponent(event.url.pathname)}`);
	}

	const user = requireAdmin(event);

	return {
		user
	};
};
