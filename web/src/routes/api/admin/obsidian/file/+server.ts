import { requireAdmin } from '$lib/auth/requireAdmin';
import {
	assertFolderInVault,
	assertMarkdownFileInVault,
	createMarkdownFile,
	ensureMarkdownFileName,
	getDrivePath,
	readMarkdownNote,
	updateMarkdownFile
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

export const GET: RequestHandler = async (event) => {
	requireAdmin(event);

	const fileId = event.url.searchParams.get('id');
	if (!fileId) {
		throw error(400, 'Markdown file id is required.');
	}

	const vault = await detectVaultRoot();

	return json(await readMarkdownNote(fileId, vault.vaultRootId));
};

export const PUT: RequestHandler = async (event) => {
	requireAdmin(event);

	const payload = await readJsonObject(event.request);
	const content = payload.content;

	if (typeof content !== 'string') {
		throw error(400, 'Markdown content is required.');
	}

	const vault = await detectVaultRoot();
	const file = await assertMarkdownFileInVault(payload.id, vault.vaultRootId);
	const updatedFile = await updateMarkdownFile(file.id, content);

	return json({
		id: updatedFile.id,
		name: updatedFile.name,
		path: await getDrivePath(updatedFile, vault.vaultRootId),
		modifiedTime: updatedFile.modifiedTime
	});
};

export const POST: RequestHandler = async (event) => {
	requireAdmin(event);

	const payload = await readJsonObject(event.request);
	const content = payload.content;
	const vault = await detectVaultRoot();
	const parent = await assertFolderInVault(payload.parentId, vault.vaultRootId);
	const createdFile = await createMarkdownFile(
		parent.id,
		ensureMarkdownFileName(payload.name),
		typeof content === 'string' ? content : ''
	);

	return json(
		{
			id: createdFile.id,
			name: createdFile.name,
			path: await getDrivePath(createdFile, vault.vaultRootId),
			content: typeof content === 'string' ? content : '',
			modifiedTime: createdFile.modifiedTime
		},
		{ status: 201 }
	);
};

