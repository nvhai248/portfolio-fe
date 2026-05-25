<script lang="ts">
	import type { DriveFileNode } from '$lib/obsidian/types';
	import FileTreeItem from './FileTreeItem.svelte';

	let {
		treeRoot,
		currentFileId = null,
		onOpenFile,
		onCreateFile,
		onCreateFolder,
		onMoveItem = undefined,
		onDeleteItem = undefined
	}: {
		treeRoot: DriveFileNode | null;
		currentFileId?: string | null;
		onOpenFile: (file: DriveFileNode) => void;
		onCreateFile: (parentId: string) => void;
		onCreateFolder: (parentId: string) => void;
		onMoveItem?: (draggedId: string, targetFolderId: string) => void;
		onDeleteItem?: (node: DriveFileNode) => void;
	} = $props();

	let expandedFolders = $state<Set<string>>(new Set());

	// Initialize root folder as expanded by default
	$effect(() => {
		if (treeRoot && expandedFolders.size === 0) {
			expandedFolders = new Set([treeRoot.id]);
		}
	});

	const handleToggleFolder = (folderId: string) => {
		const next = new Set(expandedFolders);
		if (next.has(folderId)) {
			next.delete(folderId);
		} else {
			next.add(folderId);
		}
		expandedFolders = next;
	};

	const handleCreateInFolder = (folderId: string, isFolder: boolean) => {
		// Ensure folder is expanded when creating inside it
		if (!expandedFolders.has(folderId)) {
			const next = new Set(expandedFolders);
			next.add(folderId);
			expandedFolders = next;
		}

		if (isFolder) {
			onCreateFolder(folderId);
		} else {
			onCreateFile(folderId);
		}
	};

	// Helper to find path from root to target item ID
	const findAncestors = (node: DriveFileNode, targetId: string, path: string[] = []): string[] | null => {
		if (node.id === targetId) {
			return path;
		}
		if (node.isFolder && node.children) {
			for (const child of node.children) {
				const result = findAncestors(child, targetId, [...path, node.id]);
				if (result) return result;
			}
		}
		return null;
	};

	const handleRevealCurrent = () => {
		if (!treeRoot || !currentFileId) return;
		const path = findAncestors(treeRoot, currentFileId);
		if (path && path.length > 0) {
			const next = new Set(expandedFolders);
			for (const folderId of path) {
				next.add(folderId);
			}
			expandedFolders = next;

			// Scroll the active item into view after DOM updates
			setTimeout(() => {
				const activeEl = document.querySelector('[aria-current="page"]');
				activeEl?.scrollIntoView({ behavior: 'smooth', block: 'center' });
			}, 100);
		}
	};
</script>

<aside class="flex h-full w-full flex-col overflow-hidden bg-neutral-50 border-r border-neutral-200 dark:bg-neutral-950 dark:border-neutral-800">
	<!-- Actions Bar -->
	<div class="flex flex-col gap-2 p-3 border-b border-neutral-200 bg-neutral-100/50 dark:border-neutral-800 dark:bg-neutral-900/50">
		<div class="flex items-center justify-between">
			<span class="text-xs font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">Explorer</span>
			{#if currentFileId}
				<button
					type="button"
					onclick={handleRevealCurrent}
					class="flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider text-primary hover:underline dark:text-blue-400"
					title="Expand folders and scroll to currently open note"
				>
					<span class="material-symbols-outlined text-[14px]">my_location</span>
					Reveal active
				</button>
			{/if}
		</div>
		<div class="grid grid-cols-2 gap-2">
			<button
				type="button"
				onclick={() => treeRoot && handleCreateInFolder(treeRoot.id, false)}
				disabled={!treeRoot}
				class="inline-flex h-8 items-center justify-center gap-1.5 rounded-lg border border-neutral-200 bg-white px-2.5 text-xs font-bold uppercase tracking-wider text-neutral-700 shadow-sm transition-colors hover:bg-neutral-50 disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-300 dark:hover:bg-neutral-800"
			>
				<span class="material-symbols-outlined text-[16px]">post_add</span>
				New Note
			</button>
			<button
				type="button"
				onclick={() => treeRoot && handleCreateInFolder(treeRoot.id, true)}
				disabled={!treeRoot}
				class="inline-flex h-8 items-center justify-center gap-1.5 rounded-lg border border-neutral-200 bg-white px-2.5 text-xs font-bold uppercase tracking-wider text-neutral-700 shadow-sm transition-colors hover:bg-neutral-50 disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-300 dark:hover:bg-neutral-800"
			>
				<span class="material-symbols-outlined text-[16px]">create_new_folder</span>
				New Folder
			</button>
		</div>
	</div>

	<!-- Tree View -->
	<div class="flex-1 overflow-y-auto p-2 sm:p-3">
		{#if !treeRoot}
			<div class="flex h-32 items-center justify-center text-center text-xs text-neutral-500 dark:text-neutral-400">
				Loading vault structure...
			</div>
		{:else if treeRoot.children && treeRoot.children.length > 0}
			<div class="flex flex-col gap-0.5">
				{#each treeRoot.children as child (child.id)}
					<FileTreeItem
						node={child}
						depth={0}
						{currentFileId}
						{expandedFolders}
						{onOpenFile}
						onToggleFolder={handleToggleFolder}
						onCreateInFolder={handleCreateInFolder}
						{onMoveItem}
						{onDeleteItem}
					/>
				{/each}
			</div>
		{:else}
			<div class="flex h-32 flex-col items-center justify-center gap-2 text-center text-xs text-neutral-500 dark:text-neutral-400">
				<span class="material-symbols-outlined text-2xl opacity-50">folder_off</span>
				Vault is empty. Create a note or folder to start.
			</div>
		{/if}
	</div>
</aside>
