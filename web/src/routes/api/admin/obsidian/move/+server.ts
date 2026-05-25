import { requireAdmin } from '$lib/auth/requireAdmin';
import { assertFolderInVault, moveDriveItem, getDrivePath, isDriveItemInsideFolder } from '$lib/google-drive/driveFiles.server';
import { detectVaultRoot } from '$lib/obsidian/vaultDetector.server';
import { error, json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

const readJsonObject = async (request: Request): Promise<Record<string, unknown>> => {
	try {
		const payload = (await request.json()) as unknown;

		if (!payload || typeof payload !== 'object' || Array.isArray(payload)) {
			throw error(400, 'Request body must be a JSON object.');
		}

		return payload as Record<string, unknown>;
	} catch (caught) {
		if (caught instanceof Error && 'status' in caught) {
			throw caught;
		}

		throw error(400, 'Request body must be valid JSON.');
	}
};

export const PUT: RequestHandler = async (event) => {
	requireAdmin(event);

	const payload = await readJsonObject(event.request);
	const fileId = payload.id;
	const newParentId = payload.parentId;

	if (typeof fileId !== 'string' || !fileId) {
		throw error(400, 'File/folder id is required.');
	}

	if (typeof newParentId !== 'string' || !newParentId) {
		throw error(400, 'New parent id is required.');
	}

	const vault = await detectVaultRoot();
	
	if (!(await isDriveItemInsideFolder(fileId, vault.vaultRootId))) {
		throw error(403, 'File is outside the configured Obsidian vault.');
	}

	const newParent = await assertFolderInVault(newParentId, vault.vaultRootId);
	const updatedItem = await moveDriveItem(fileId, newParent.id);

	return json({
		id: updatedItem.id,
		name: updatedItem.name,
		path: await getDrivePath(updatedItem, vault.vaultRootId),
		modifiedTime: updatedItem.modifiedTime
	});
};
