import { requireAdmin } from '$lib/auth/requireAdmin';
import { buildDriveTree } from '$lib/google-drive/driveFiles.server';
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
		const initialTree = await buildDriveTree(vaultInfo.vaultRootId);

		return {
			user,
			vaultInfo,
			initialTree
		};
	} catch (caught) {
		if (caught && typeof caught === 'object' && 'status' in caught && caught.status === 428) {
			throw redirect(302, `/auth/google?next=${encodeURIComponent(event.url.pathname)}`);
		}
		throw caught;
	}
};
