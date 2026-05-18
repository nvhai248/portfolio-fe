import { requireAdmin } from '$lib/auth/requireAdmin';
import { detectVaultRoot } from '$lib/obsidian/vaultDetector.server';
import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async (event) => {
	requireAdmin(event);

	return json(await detectVaultRoot());
};

