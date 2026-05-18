import { requireAdmin } from '$lib/auth/requireAdmin';
import { buildDriveTree, downloadMarkdownFile } from '$lib/google-drive/driveFiles.server';
import { detectVaultRoot } from '$lib/obsidian/vaultDetector.server';
import { buildObsidianGraph } from '$lib/obsidian/graphBuilder';
import type { DriveFileNode } from '$lib/obsidian/types';
import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

/**
 * Recursively collect all markdown file IDs from the tree.
 */
const collectMarkdownIds = (node: DriveFileNode): string[] => {
	const ids: string[] = [];
	if (node.isMarkdown) {
		ids.push(node.id);
	}
	if (node.isFolder && node.children) {
		for (const child of node.children) {
			ids.push(...collectMarkdownIds(child));
		}
	}
	return ids;
};

export const GET: RequestHandler = async (event) => {
	requireAdmin(event);

	const vault = await detectVaultRoot();
	const tree = await buildDriveTree(vault.vaultRootId);
	const fileIds = collectMarkdownIds(tree);

	// Fetch all markdown content in parallel (batched to avoid rate limits)
	const BATCH_SIZE = 10;
	const contents = new Map<string, string>();

	for (let i = 0; i < fileIds.length; i += BATCH_SIZE) {
		const batch = fileIds.slice(i, i + BATCH_SIZE);
		const results = await Promise.allSettled(
			batch.map(async (id) => {
				const content = await downloadMarkdownFile(id);
				return { id, content };
			})
		);

		for (const result of results) {
			if (result.status === 'fulfilled') {
				contents.set(result.value.id, result.value.content);
			}
		}
	}

	const graph = buildObsidianGraph(tree, contents);

	return json(graph);
};
