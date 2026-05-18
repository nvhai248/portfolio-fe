import { error } from '@sveltejs/kit';
import { driveFetch } from './driveClient.server';
import type { DriveFileNode, MarkdownNote } from '$lib/obsidian/types';

export const GOOGLE_FOLDER_MIME = 'application/vnd.google-apps.folder';
const MARKDOWN_MIME = 'text/markdown';
const MAX_TREE_DEPTH = 12;
const MAX_ANCESTOR_DEPTH = 50;

export type DriveFileMetadata = {
	id: string;
	name: string;
	mimeType: string;
	parents?: string[];
	modifiedTime?: string;
};

const driveFileFields = 'id,name,mimeType,parents,modifiedTime';
const driveListFields = `nextPageToken,files(${driveFileFields})`;

const encodePath = (value: string) => encodeURIComponent(value);

const escapeDriveQueryValue = (value: string): string => value.replace(/\\/g, '\\\\').replace(/'/g, "\\'");

const parseDriveFile = (payload: unknown): DriveFileMetadata => {
	const file = payload as Partial<DriveFileMetadata>;

	if (!file.id || !file.name || !file.mimeType) {
		throw error(502, 'Google Drive returned an incomplete file record.');
	}

	return {
		id: file.id,
		name: file.name,
		mimeType: file.mimeType,
		parents: file.parents,
		modifiedTime: file.modifiedTime
	};
};

const isFolder = (file: Pick<DriveFileMetadata, 'mimeType'>) => file.mimeType === GOOGLE_FOLDER_MIME;

export const isMarkdownFile = (file: Pick<DriveFileMetadata, 'name' | 'mimeType'>): boolean =>
	file.mimeType !== GOOGLE_FOLDER_MIME && file.name.toLowerCase().endsWith('.md');

export const validateDriveName = (name: unknown, kind: 'file' | 'folder'): string => {
	if (typeof name !== 'string') {
		throw error(400, `${kind === 'file' ? 'File' : 'Folder'} name is required.`);
	}

	const trimmedName = name.trim();

	if (!trimmedName || trimmedName === '.' || trimmedName === '..') {
		throw error(400, `${kind === 'file' ? 'File' : 'Folder'} name is invalid.`);
	}

	if (trimmedName.length > 180 || /[/\\\u0000-\u001f]/.test(trimmedName)) {
		throw error(400, `${kind === 'file' ? 'File' : 'Folder'} name contains unsupported characters.`);
	}

	return trimmedName;
};

export const ensureMarkdownFileName = (name: unknown): string => {
	const validName = validateDriveName(name, 'file');

	return validName.toLowerCase().endsWith('.md') ? validName : `${validName}.md`;
};

export const getDriveFile = async (fileId: string): Promise<DriveFileMetadata> => {
	const params = new URLSearchParams({
		fields: driveFileFields,
		supportsAllDrives: 'true'
	});
	const response = await driveFetch(`/files/${encodePath(fileId)}?${params.toString()}`);

	return parseDriveFile(await response.json());
};

export const listFolderChildren = async (folderId: string): Promise<DriveFileMetadata[]> => {
	const children: DriveFileMetadata[] = [];
	let pageToken: string | undefined;

	do {
		const params = new URLSearchParams({
			q: `'${escapeDriveQueryValue(folderId)}' in parents and trashed = false`,
			fields: driveListFields,
			orderBy: 'folder,name_natural',
			pageSize: '1000',
			supportsAllDrives: 'true',
			includeItemsFromAllDrives: 'true'
		});

		if (pageToken) {
			params.set('pageToken', pageToken);
		}

		const response = await driveFetch(`/files?${params.toString()}`);
		const payload = (await response.json()) as { nextPageToken?: string; files?: unknown[] };

		children.push(...(payload.files || []).map(parseDriveFile));
		pageToken = payload.nextPageToken;
	} while (pageToken);

	return children;
};

const toFileNode = (
	file: DriveFileMetadata,
	path: string,
	children?: DriveFileNode[]
): DriveFileNode => ({
	id: file.id,
	name: file.name,
	mimeType: file.mimeType,
	parentId: file.parents?.[0],
	path,
	isFolder: isFolder(file),
	isMarkdown: isMarkdownFile(file),
	modifiedTime: file.modifiedTime,
	children
});

const compareDriveFiles = (left: DriveFileMetadata, right: DriveFileMetadata) => {
	if (isFolder(left) !== isFolder(right)) {
		return isFolder(left) ? -1 : 1;
	}

	return left.name.localeCompare(right.name, undefined, { numeric: true, sensitivity: 'base' });
};

const buildChildren = async (parentId: string, parentPath: string, depth: number): Promise<DriveFileNode[]> => {
	if (depth > MAX_TREE_DEPTH) {
		return [];
	}

	const children = (await listFolderChildren(parentId))
		.filter((file) => isFolder(file) || isMarkdownFile(file))
		.sort(compareDriveFiles);

	return Promise.all(
		children.map(async (child) => {
			const childPath = parentPath ? `${parentPath}/${child.name}` : child.name;

			if (!isFolder(child)) {
				return toFileNode(child, childPath);
			}

			return toFileNode(child, childPath, await buildChildren(child.id, childPath, depth + 1));
		})
	);
};

export const buildDriveTree = async (rootId: string): Promise<DriveFileNode> => {
	const root = await getDriveFile(rootId);

	if (!isFolder(root)) {
		throw error(400, 'Configured Obsidian vault root is not a folder.');
	}

	return toFileNode(root, root.name, await buildChildren(root.id, root.name, 1));
};

export const isDriveItemInsideFolder = async (itemId: string, rootFolderId: string): Promise<boolean> => {
	if (itemId === rootFolderId) {
		return true;
	}

	const item = await getDriveFile(itemId);
	const visited = new Set<string>();
	const queue = [...(item.parents || [])];
	let depth = 0;

	while (queue.length > 0 && depth < MAX_ANCESTOR_DEPTH) {
		const parentId = queue.shift();
		if (!parentId || visited.has(parentId)) continue;
		if (parentId === rootFolderId) return true;

		visited.add(parentId);
		const parent = await getDriveFile(parentId);
		queue.push(...(parent.parents || []));
		depth += 1;
	}

	return false;
};

export const assertFolderInVault = async (folderId: unknown, vaultRootId: string): Promise<DriveFileMetadata> => {
	if (typeof folderId !== 'string' || !folderId) {
		throw error(400, 'Parent folder id is required.');
	}

	const folder = await getDriveFile(folderId);

	if (!isFolder(folder)) {
		throw error(400, 'Parent id must reference a Google Drive folder.');
	}

	if (!(await isDriveItemInsideFolder(folderId, vaultRootId))) {
		throw error(403, 'Parent folder is outside the configured Obsidian vault.');
	}

	return folder;
};

export const assertMarkdownFileInVault = async (fileId: unknown, vaultRootId: string): Promise<DriveFileMetadata> => {
	if (typeof fileId !== 'string' || !fileId) {
		throw error(400, 'Markdown file id is required.');
	}

	const file = await getDriveFile(fileId);

	if (!isMarkdownFile(file)) {
		throw error(400, 'Only Markdown files can be accessed.');
	}

	if (!(await isDriveItemInsideFolder(fileId, vaultRootId))) {
		throw error(403, 'Markdown file is outside the configured Obsidian vault.');
	}

	return file;
};

export const getDrivePath = async (file: DriveFileMetadata, vaultRootId: string): Promise<string> => {
	const parts = [file.name];
	let current = file;
	let depth = 0;

	while (current.id !== vaultRootId && depth < MAX_ANCESTOR_DEPTH) {
		const parentId = current.parents?.[0];

		if (!parentId) {
			throw error(403, 'Google Drive item is outside the configured Obsidian vault.');
		}

		if (parentId === vaultRootId) {
			return parts.join('/');
		}

		current = await getDriveFile(parentId);
		parts.unshift(current.name);
		depth += 1;
	}

	return parts.join('/');
};

export const downloadMarkdownFile = async (fileId: string): Promise<string> => {
	const params = new URLSearchParams({
		alt: 'media',
		supportsAllDrives: 'true'
	});
	const response = await driveFetch(`/files/${encodePath(fileId)}?${params.toString()}`);

	return response.text();
};

export const readMarkdownNote = async (fileId: string, vaultRootId: string): Promise<MarkdownNote> => {
	const file = await assertMarkdownFileInVault(fileId, vaultRootId);

	return {
		id: file.id,
		name: file.name,
		path: await getDrivePath(file, vaultRootId),
		content: await downloadMarkdownFile(file.id),
		modifiedTime: file.modifiedTime
	};
};

export const updateMarkdownFile = async (fileId: string, content: string): Promise<DriveFileMetadata> => {
	const response = await driveFetch(
		`/upload/drive/v3/files/${encodePath(fileId)}?${new URLSearchParams({
			uploadType: 'media',
			fields: driveFileFields,
			supportsAllDrives: 'true'
		}).toString()}`,
		{
			method: 'PATCH',
			headers: {
				'content-type': `${MARKDOWN_MIME}; charset=utf-8`
			},
			body: content
		}
	);

	return parseDriveFile(await response.json());
};

export const createMarkdownFile = async (
	parentId: string,
	name: string,
	content: string
): Promise<DriveFileMetadata> => {
	const boundary = `obsidian-notes-${crypto.randomUUID()}`;
	const metadata = {
		name,
		mimeType: MARKDOWN_MIME,
		parents: [parentId]
	};
	const body = [
		`--${boundary}`,
		'Content-Type: application/json; charset=UTF-8',
		'',
		JSON.stringify(metadata),
		`--${boundary}`,
		'Content-Type: text/markdown; charset=UTF-8',
		'',
		content,
		`--${boundary}--`,
		''
	].join('\r\n');
	const response = await driveFetch(
		`/upload/drive/v3/files?${new URLSearchParams({
			uploadType: 'multipart',
			fields: driveFileFields,
			supportsAllDrives: 'true'
		}).toString()}`,
		{
			method: 'POST',
			headers: {
				'content-type': `multipart/related; boundary="${boundary}"`
			},
			body
		}
	);

	return parseDriveFile(await response.json());
};

export const createFolder = async (parentId: string, name: string): Promise<DriveFileMetadata> => {
	const response = await driveFetch(
		`/files?${new URLSearchParams({
			fields: driveFileFields,
			supportsAllDrives: 'true'
		}).toString()}`,
		{
			method: 'POST',
			headers: {
				'content-type': 'application/json'
			},
			body: JSON.stringify({
				name,
				mimeType: GOOGLE_FOLDER_MIME,
				parents: [parentId]
			})
		}
	);

	return parseDriveFile(await response.json());
};

