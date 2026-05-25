<script lang="ts">
	import { untrack } from 'svelte';
	import type { PageData } from './$types';
	import type { DriveFileNode, MarkdownNote, ObsidianGraph } from '$lib/obsidian/types';
	import { AdminObsidianLayout } from '$lib/components/admin-obsidian';
	import MarkdownEditor from '$lib/components/admin-obsidian/MarkdownEditor.svelte';
	import GraphView from '$lib/components/admin-obsidian/GraphView.svelte';
	import ToastContainer from '$lib/components/admin-obsidian/ToastContainer.svelte';
	import { toastStore } from '$lib/stores/toast.svelte';

	let { data }: { data: PageData } = $props();

	let treeRoot = $state<DriveFileNode | null>(untrack(() => data.initialTree) || null);
	let currentFileId = $state<string | null>(null);
	let currentFile = $state<MarkdownNote | null>(null);
	let isRefreshing = $state(false);
	let isLoadingFile = $state(false);
	let fileErrorMsg = $state('');
	let viewMode = $state<'editor' | 'graph'>('editor');

	// Graph state
	let graphData = $state<ObsidianGraph | null>(null);
	let isLoadingGraph = $state(false);
	let graphErrorMsg = $state('');

	// --- Keyboard shortcuts ---
	const handleGlobalKeydown = (event: KeyboardEvent) => {
		const isModifier = event.metaKey || event.ctrlKey;

		// Ctrl/Cmd+G → Toggle graph view
		if (isModifier && event.key === 'g') {
			event.preventDefault();
			handleSwitchView(viewMode === 'graph' ? 'editor' : 'graph');
			return;
		}

		// Escape → Close graph, or deselect file
		if (event.key === 'Escape') {
			if (viewMode === 'graph') {
				viewMode = 'editor';
			}
		}
	};

	// --- Tree & file operations ---
	const handleRefresh = async () => {
		if (isRefreshing) return;
		try {
			isRefreshing = true;
			const response = await fetch('/api/admin/obsidian/tree');
			if (!response.ok) {
				throw new Error('Failed to refresh vault structure.');
			}
			const payload = (await response.json()) as { root?: DriveFileNode };
			if (payload.root) {
				treeRoot = payload.root;
			}
			toastStore.success('Vault tree refreshed.');
		} catch (caught) {
			const msg = caught instanceof Error ? caught.message : 'Refresh failed.';
			toastStore.error(msg);
		} finally {
			isRefreshing = false;
		}
	};

	const handleOpenFile = async (fileNode: DriveFileNode) => {
		if (viewMode === 'graph') {
			viewMode = 'editor';
		}

		if (currentFileId === fileNode.id && currentFile) return;
		currentFileId = fileNode.id;
		isLoadingFile = true;
		fileErrorMsg = '';

		try {
			const response = await fetch(`/api/admin/obsidian/file?id=${encodeURIComponent(fileNode.id)}`);
			if (!response.ok) {
				throw new Error('Failed to load note content.');
			}
			const note = (await response.json()) as MarkdownNote;
			currentFile = note;
		} catch (caught) {
			const msg = caught instanceof Error ? caught.message : 'Failed to load note.';
			fileErrorMsg = msg;
			currentFile = null;
			toastStore.error(msg);
		} finally {
			isLoadingFile = false;
		}
	};

	const handleOpenFileById = async (nodeId: string) => {
		await handleOpenFile({
			id: nodeId,
			name: '',
			path: '',
			mimeType: '',
			isFolder: false,
			isMarkdown: true
		});
	};

	const insertIntoTree = (node: DriveFileNode, parentId: string, newNode: DriveFileNode): DriveFileNode => {
		if (node.id === parentId) {
			const children = [...(node.children || [])];
			children.push(newNode);
			children.sort((a, b) => {
				if (a.isFolder !== b.isFolder) {
					return a.isFolder ? -1 : 1;
				}
				return a.name.localeCompare(b.name, undefined, { numeric: true, sensitivity: 'base' });
			});
			return { ...node, children };
		}

		if (node.isFolder && node.children) {
			return {
				...node,
				children: node.children.map((child) => insertIntoTree(child, parentId, newNode))
			};
		}

		return node;
	};

	const handleCreateItem = async (name: string, isFolder: boolean, parentId: string): Promise<DriveFileNode> => {
		const endpoint = isFolder ? '/api/admin/obsidian/folder' : '/api/admin/obsidian/file';
		const body = isFolder
			? JSON.stringify({ name, parentId })
			: JSON.stringify({ name, parentId, content: `# ${name}\n\n` });

		const response = await fetch(endpoint, {
			method: 'POST',
			headers: { 'content-type': 'application/json' },
			body
		});

		if (!response.ok) {
			const payload = (await response.json()) as { message?: string };
			const msg = payload.message || `Failed to create ${isFolder ? 'folder' : 'note'}.`;
			toastStore.error(msg);
			throw new Error(msg);
		}

		const created = (await response.json()) as DriveFileNode;

		if (treeRoot) {
			treeRoot = insertIntoTree(treeRoot, parentId, created);
		}

		toastStore.success(`${isFolder ? 'Folder' : 'Note'} "${name}" created.`);
		return created;
	};

	const handleMoveItem = async (draggedId: string, targetFolderId: string) => {
		try {
			const response = await fetch('/api/admin/obsidian/move', {
				method: 'PUT',
				headers: { 'content-type': 'application/json' },
				body: JSON.stringify({ id: draggedId, parentId: targetFolderId })
			});

			if (!response.ok) {
				const payload = await response.json();
				throw new Error(payload.message || 'Failed to move item.');
			}

			toastStore.success('Item moved successfully.');
			await handleRefresh();
		} catch (caught) {
			toastStore.error(caught instanceof Error ? caught.message : 'Move failed.');
		}
	};

	const handleDeleteItem = async (node: DriveFileNode) => {
		if (!confirm(`Are you sure you want to delete ${node.isFolder ? 'folder' : 'note'} "${node.name}"?`)) {
			return;
		}

		try {
			const endpoint = node.isFolder ? '/api/admin/obsidian/folder' : '/api/admin/obsidian/file';
			const response = await fetch(`${endpoint}?id=${encodeURIComponent(node.id)}`, {
				method: 'DELETE'
			});

			if (!response.ok) {
				const payload = await response.json();
				throw new Error(payload.message || `Failed to delete ${node.isFolder ? 'folder' : 'note'}.`);
			}

			toastStore.success(`Deleted "${node.name}".`);

			if (currentFileId === node.id || (node.isFolder && currentFile?.path.includes(node.name))) {
				currentFileId = null;
				currentFile = null;
			}

			await handleRefresh();
		} catch (caught) {
			toastStore.error(caught instanceof Error ? caught.message : 'Delete failed.');
		}
	};

	const handleSaveContent = async (content: string) => {
		if (!currentFile) return;

		const response = await fetch('/api/admin/obsidian/file', {
			method: 'PUT',
			headers: { 'content-type': 'application/json' },
			body: JSON.stringify({ id: currentFile.id, content })
		});

		if (!response.ok) {
			const payload = (await response.json()) as { message?: string };
			throw new Error(payload.message || 'Failed to save note.');
		}

		const updated = (await response.json()) as { modifiedTime?: string };
		if (updated.modifiedTime) {
			currentFile = { ...currentFile, content, modifiedTime: updated.modifiedTime };
		}
	};

	const loadGraph = async () => {
		if (isLoadingGraph) return;
		isLoadingGraph = true;
		graphErrorMsg = '';

		try {
			const response = await fetch('/api/admin/obsidian/graph');
			if (!response.ok) {
				throw new Error('Failed to load graph data.');
			}
			graphData = (await response.json()) as ObsidianGraph;
		} catch (caught) {
			const msg = caught instanceof Error ? caught.message : 'Failed to load graph.';
			graphErrorMsg = msg;
			toastStore.error(msg);
		} finally {
			isLoadingGraph = false;
		}
	};

	const handleSwitchView = (mode: 'editor' | 'graph') => {
		viewMode = mode;
		if (mode === 'graph' && !graphData) {
			loadGraph();
		}
	};

	const formatDate = (dateStr?: string) => {
		if (!dateStr) return '';
		const d = new Date(dateStr);
		return d.toLocaleDateString(undefined, {
			year: 'numeric',
			month: 'short',
			day: 'numeric',
			hour: '2-digit',
			minute: '2-digit'
		});
	};
</script>

<svelte:window onkeydown={handleGlobalKeydown} />

<svelte:head>
	<title>{data.vaultInfo ? `${data.vaultInfo.vaultName} | Admin Obsidian` : 'Admin Obsidian Notes'}</title>
	<meta name="robots" content="noindex,nofollow" />
</svelte:head>

<AdminObsidianLayout
	vaultName={data.vaultInfo?.vaultName || 'Obsidian Vault'}
	userEmail={data.user.email}
	userName={data.user.name}
	userPicture={data.user.picture}
	{treeRoot}
	{currentFileId}
	{isRefreshing}
	{viewMode}
	onRefresh={handleRefresh}
	onOpenFile={handleOpenFile}
	onCreateItem={handleCreateItem}
	onSwitchView={handleSwitchView}
	onMoveItem={handleMoveItem}
	onDeleteItem={handleDeleteItem}
>
	{#if viewMode === 'graph'}
		<!-- Graph View -->
		{#if isLoadingGraph}
			<div class="flex h-full flex-col items-center justify-center gap-4">
				<div class="relative">
					<span class="material-symbols-outlined animate-spin text-5xl text-primary/30 dark:text-blue-500/30">hub</span>
					<span class="material-symbols-outlined animate-spin absolute inset-0 text-5xl text-primary dark:text-blue-500" style="animation-direction: reverse; animation-duration: 2s;">progress_activity</span>
				</div>
				<div class="text-center">
					<p class="text-sm font-semibold text-neutral-700 dark:text-neutral-300">Building graph</p>
					<p class="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">Fetching and parsing all vault notes...</p>
				</div>
			</div>
		{:else if graphErrorMsg}
			<div class="flex h-full flex-col items-center justify-center gap-4 p-6 text-center">
				<div class="flex size-16 items-center justify-center rounded-2xl bg-red-50 dark:bg-red-950/50">
					<span class="material-symbols-outlined text-3xl text-red-500">cloud_off</span>
				</div>
				<div>
					<p class="text-sm font-semibold text-neutral-900 dark:text-neutral-100">Graph failed to load</p>
					<p class="text-xs text-neutral-500 dark:text-neutral-400 mt-1 max-w-xs">{graphErrorMsg}</p>
				</div>
				<button
					type="button"
					onclick={loadGraph}
					class="inline-flex h-9 items-center justify-center gap-1.5 rounded-lg bg-neutral-900 px-4 text-xs font-bold text-white transition-colors hover:bg-neutral-800 dark:bg-neutral-100 dark:text-neutral-900 dark:hover:bg-neutral-200"
				>
					<span class="material-symbols-outlined text-[16px]">refresh</span>
					Try again
				</button>
			</div>
		{:else if graphData}
			<GraphView
				graph={graphData}
				{currentFileId}
				onClickNode={handleOpenFileById}
			/>
		{/if}
	{:else if isLoadingFile}
		<!-- Skeleton Loading State -->
		<article class="flex h-full flex-col overflow-hidden animate-pulse">
			<div class="shrink-0 border-b border-neutral-200 px-4 py-3 sm:px-6 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-900/50">
				<div class="flex items-start justify-between gap-4">
					<div class="min-w-0 flex-1">
						<div class="h-3 w-32 rounded bg-neutral-200 dark:bg-neutral-800 mb-2"></div>
						<div class="h-6 w-64 rounded bg-neutral-300 dark:bg-neutral-700"></div>
					</div>
					<div class="hidden shrink-0 pt-1 sm:block">
						<div class="h-3 w-24 rounded bg-neutral-200 dark:bg-neutral-800"></div>
					</div>
				</div>
			</div>
			<div class="flex-1 p-6 space-y-4">
				<div class="h-4 w-full rounded bg-neutral-200 dark:bg-neutral-800"></div>
				<div class="h-4 w-5/6 rounded bg-neutral-200 dark:bg-neutral-800"></div>
				<div class="h-4 w-4/6 rounded bg-neutral-200 dark:bg-neutral-800"></div>
				<div class="h-4 w-full rounded bg-neutral-200 dark:bg-neutral-800"></div>
				<div class="h-4 w-3/4 rounded bg-neutral-200 dark:bg-neutral-800"></div>
			</div>
		</article>
	{:else if fileErrorMsg}
		<!-- File Error State -->
		<div class="flex h-full flex-col items-center justify-center gap-4 p-6 text-center">
			<div class="flex size-16 items-center justify-center rounded-2xl bg-red-50 dark:bg-red-950/50">
				<span class="material-symbols-outlined text-3xl text-red-500">error</span>
			</div>
			<div>
				<p class="text-sm font-semibold text-neutral-900 dark:text-neutral-100">Could not load note</p>
				<p class="text-xs text-neutral-500 dark:text-neutral-400 mt-1 max-w-xs">{fileErrorMsg}</p>
			</div>
			<button
				type="button"
				onclick={() => currentFileId && handleOpenFileById(currentFileId)}
				class="inline-flex h-9 items-center justify-center gap-1.5 rounded-lg bg-neutral-900 px-4 text-xs font-bold text-white transition-colors hover:bg-neutral-800 dark:bg-neutral-100 dark:text-neutral-900 dark:hover:bg-neutral-200"
			>
				<span class="material-symbols-outlined text-[16px]">refresh</span>
				Try again
			</button>
		</div>
	{:else if currentFile}
		<article class="flex h-full flex-col overflow-hidden">
			<!-- Note Header -->
			<div class="shrink-0 border-b border-neutral-200 px-4 py-3 sm:px-6 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-900/50">
				<div class="flex items-start justify-between gap-4">
					<div class="min-w-0 flex-1">
						<div class="flex items-center gap-1.5 text-xs text-neutral-500 dark:text-neutral-400 font-mono mb-0.5">
							<span class="material-symbols-outlined text-[14px]">folder</span>
							<span class="truncate">{currentFile.path}</span>
						</div>
						<h1 class="text-base font-bold tracking-tight text-neutral-950 dark:text-neutral-50 truncate sm:text-lg">
							{currentFile.name.replace(/\.md$/i, '')}
						</h1>
					</div>
					{#if currentFile.modifiedTime}
						<p class="hidden shrink-0 text-[11px] text-neutral-400 dark:text-neutral-500 pt-1 sm:block">
							{formatDate(currentFile.modifiedTime)}
						</p>
					{/if}
				</div>
			</div>

			<!-- CodeMirror Markdown Editor -->
			<div class="flex-1 overflow-hidden">
				{#key currentFile.id}
					<MarkdownEditor
						fileId={currentFile.id}
						initialContent={currentFile.content}
						onSave={handleSaveContent}
					/>
				{/key}
			</div>
		</article>
	{:else}
		<!-- Empty State: No File Selected -->
		<div class="flex h-full flex-col items-center justify-center gap-4 p-6 text-center">
			<div class="flex size-20 items-center justify-center rounded-3xl bg-gradient-to-br from-neutral-100 to-neutral-200 dark:from-neutral-800 dark:to-neutral-900">
				<span class="material-symbols-outlined text-4xl text-neutral-400 dark:text-neutral-500">edit_document</span>
			</div>
			<div>
				<h2 class="text-base font-bold text-neutral-700 dark:text-neutral-300">No note selected</h2>
				<p class="max-w-xs text-xs text-neutral-500 dark:text-neutral-400 mt-1">
					Choose a markdown note from the explorer sidebar or create a new one to begin editing.
				</p>
			</div>
			<div class="flex flex-col gap-1 mt-2 text-[11px] text-neutral-400 dark:text-neutral-500">
				<div class="flex items-center gap-2">
					<kbd class="rounded border border-neutral-200 bg-neutral-100 px-1.5 py-0.5 font-mono text-[10px] dark:border-neutral-700 dark:bg-neutral-800">⌘G</kbd>
					<span>Toggle graph view</span>
				</div>
			</div>
		</div>
	{/if}
</AdminObsidianLayout>

<!-- Global Toast Notifications -->
<ToastContainer />
