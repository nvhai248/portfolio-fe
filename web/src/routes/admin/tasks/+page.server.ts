import { requireAdmin } from '$lib/auth/requireAdmin';
import { detectVaultRoot } from '$lib/obsidian/vaultDetector.server';
import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async (event) => {
	if (!event.locals.user) {
		throw redirect(302, `/auth/google?next=${encodeURIComponent(event.url.pathname)}`);
	}

	const user = requireAdmin(event);

	try {
		const vaultInfo = await detectVaultRoot();
		return {
			user,
			vaultInfo
		};
	} catch (caught) {
		if (caught && typeof caught === 'object' && 'status' in caught && caught.status === 428) {
			throw redirect(302, `/auth/google?next=${encodeURIComponent(event.url.pathname)}`);
		}
		
		return {
			user,
			vaultInfo: null
		};
	}
};
