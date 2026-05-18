import { requireAdmin } from '$lib/auth/requireAdmin';
import {
	GOOGLE_FOLDER_MIME,
	assertFolderInVault,
	createFolder,
	getDrivePath,
	validateDriveName
} from '$lib/google-drive/driveFiles.server';
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

export const POST: RequestHandler = async (event) => {
	requireAdmin(event);

	const payload = await readJsonObject(event.request);
	const vault = await detectVaultRoot();
	const parent = await assertFolderInVault(payload.parentId, vault.vaultRootId);
	const createdFolder = await createFolder(parent.id, validateDriveName(payload.name, 'folder'));

	return json(
		{
			id: createdFolder.id,
			name: createdFolder.name,
			mimeType: GOOGLE_FOLDER_MIME,
			parentId: parent.id,
			path: await getDrivePath(createdFolder, vault.vaultRootId),
			isFolder: true,
			isMarkdown: false,
			modifiedTime: createdFolder.modifiedTime,
			children: []
		},
		{ status: 201 }
	);
};

