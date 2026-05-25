import { env } from '$env/dynamic/private';
import { error } from '@sveltejs/kit';
import {
	GOOGLE_FOLDER_MIME,
	getDriveFile,
	isMarkdownFile,
	listFolderChildren,
	type DriveFileMetadata
} from '$lib/google-drive/driveFiles.server';

const DEFAULT_OBSIDIAN_FOLDER_ID = '1C4UvPfyyiMIiwqa-dPNzhxbuAU1vmE4T';

export type VaultInfo = {
	vaultRootId: string;
	vaultName: string;
	configuredFolderId: string;
};

const isFolder = (file: Pick<DriveFileMetadata, 'mimeType'>) => file.mimeType === GOOGLE_FOLDER_MIME;

const hasVaultIndicator = (files: DriveFileMetadata[]) =>
	files.some((item) => (item.name === '.obsidian' && isFolder(item)) || isMarkdownFile(item));

export const getConfiguredObsidianFolderId = (): string => {
	const folderId = env.GOOGLE_DRIVE_OBSIDIAN_FOLDER_ID || DEFAULT_OBSIDIAN_FOLDER_ID;

	if (!folderId) {
		throw error(500, 'Google Drive Obsidian folder is not configured.');
	}

	return folderId;
};

let cachedVaultInfo: VaultInfo | null = null;
let vaultInfoCacheTime = 0;
const CACHE_TTL = 1000 * 60 * 60; // 1 hour

export const detectVaultRoot = async (defaultFolderId = getConfiguredObsidianFolderId()): Promise<VaultInfo> => {
	if (cachedVaultInfo && Date.now() - vaultInfoCacheTime < CACHE_TTL) {
		return cachedVaultInfo;
	}
	const configuredFolder = await getDriveFile(defaultFolderId);
	const children = await listFolderChildren(defaultFolderId);

	if (hasVaultIndicator(children)) {
		cachedVaultInfo = {
			vaultRootId: configuredFolder.id,
			vaultName: configuredFolder.name,
			configuredFolderId: configuredFolder.id
		};
		vaultInfoCacheTime = Date.now();
		return cachedVaultInfo;
	}

	const childFolders = children.filter(isFolder);

	for (const childFolder of childFolders) {
		const subChildren = await listFolderChildren(childFolder.id);

		if (hasVaultIndicator(subChildren)) {
			cachedVaultInfo = {
				vaultRootId: childFolder.id,
				vaultName: childFolder.name,
				configuredFolderId: configuredFolder.id
			};
			vaultInfoCacheTime = Date.now();
			return cachedVaultInfo;
		}
	}

	cachedVaultInfo = {
		vaultRootId: configuredFolder.id,
		vaultName: configuredFolder.name,
		configuredFolderId: configuredFolder.id
	};
	vaultInfoCacheTime = Date.now();
	return cachedVaultInfo;
};

