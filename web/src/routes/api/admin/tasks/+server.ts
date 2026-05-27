import { requireAdmin } from '$lib/auth/requireAdmin';
import {
	getTasksFileId,
	downloadMarkdownFile,
	updateJsonFile
} from '$lib/google-drive/driveFiles.server';
import { detectVaultRoot } from '$lib/obsidian/vaultDetector.server';
import { error, json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

// Server-side double-layer memory cache for instant task reads (<10ms)
let cachedTasks: any[] | null = null;
let lastCacheTime = 0;
const CACHE_TTL = 1000 * 60 * 5; // 5 minutes

export const GET: RequestHandler = async (event) => {
	requireAdmin(event);

	// Serve from cache if valid
	if (cachedTasks !== null && Date.now() - lastCacheTime < CACHE_TTL) {
		return json(cachedTasks);
	}

	try {
		const vault = await detectVaultRoot();
		const fileId = await getTasksFileId(vault.vaultRootId);
		const rawContent = await downloadMarkdownFile(fileId);

		let tasks = [];
		if (rawContent && rawContent.trim()) {
			tasks = JSON.parse(rawContent);
		}

		if (!Array.isArray(tasks)) {
			tasks = [];
		}

		// Update cache
		cachedTasks = tasks;
		lastCacheTime = Date.now();

		return json(tasks);
	} catch (caught) {
		console.error('Failed to fetch tasks:', caught);
		throw error(500, 'Unable to load tasks from Google Drive.');
	}
};

export const PUT: RequestHandler = async (event) => {
	requireAdmin(event);

	try {
		const newTasks = (await event.request.json()) as unknown;

		if (!Array.isArray(newTasks)) {
			throw error(400, 'Request body must be a tasks array.');
		}

		// 1. Immediately update server-side memory cache for zero latency
		cachedTasks = newTasks;
		lastCacheTime = Date.now();

		// 2. Perform non-blocking background save to Google Drive asynchronously
		detectVaultRoot()
			.then((vault) => getTasksFileId(vault.vaultRootId))
			.then((fileId) => updateJsonFile(fileId, JSON.stringify(newTasks, null, 2)))
			.catch((err) => {
				console.error('Asynchronous background task sync failed:', err);
			});

		// 3. Respond with 200 OK instantly to the client!
		return json({ success: true });
	} catch (caught) {
		if (caught instanceof Error && 'status' in caught) {
			throw caught;
		}
		throw error(500, 'Unable to update tasks.');
	}
};
