import { requireAdmin } from '$lib/auth/requireAdmin';
import { buildDriveTree } from '$lib/google-drive/driveFiles.server';
import { detectVaultRoot } from '$lib/obsidian/vaultDetector.server';
import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async (event) => {
	requireAdmin(event);

	const vault = await detectVaultRoot();

	return json({
		root: await buildDriveTree(vault.vaultRootId)
	});
};

