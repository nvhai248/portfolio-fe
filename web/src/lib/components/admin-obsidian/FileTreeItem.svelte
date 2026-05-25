<script lang="ts">
	import type { DriveFileNode } from '$lib/obsidian/types';
	import { slide } from 'svelte/transition';
	import FileTreeItem from './FileTreeItem.svelte';

	let {
		node,
		depth = 0,
		currentFileId = null,
		expandedFolders,
		onOpenFile,
		onToggleFolder,
		onCreateInFolder,
		onMoveItem = undefined,
		onDeleteItem = undefined
	}: {
		node: DriveFileNode;
		depth?: number;
		currentFileId?: string | null;
		expandedFolders: Set<string>;
		onOpenFile: (file: DriveFileNode) => void;
		onToggleFolder: (folderId: string) => void;
		onCreateInFolder: (folderId: string, isFolder: boolean) => void;
		onMoveItem?: (draggedId: string, targetFolderId: string) => void;
		onDeleteItem?: (node: DriveFileNode) => void;
	} = $props();

	const isExpanded = $derived(expandedFolders.has(node.id));
	const isSelected = $derived(currentFileId === node.id);

	let isDragOver = $state(false);

	const handleDragStart = (event: DragEvent) => {
		if (event.dataTransfer) {
			event.dataTransfer.setData('application/x-obsidian-file-id', node.id);
			event.dataTransfer.effectAllowed = 'move';
		}
	};

	const handleDragOver = (event: DragEvent) => {
		if (node.isFolder) {
			event.preventDefault();
			event.stopPropagation();
			if (event.dataTransfer) {
				// Only accept if dragging our proprietary format
				if (event.dataTransfer.types.includes('application/x-obsidian-file-id')) {
					event.dataTransfer.dropEffect = 'move';
					isDragOver = true;
				}
			}
		}
	};

	const handleDragLeave = (event: DragEvent) => {
		if (node.isFolder) {
			event.stopPropagation();
			isDragOver = false;
		}
	};

	const handleDrop = (event: DragEvent) => {
		if (node.isFolder) {
			event.preventDefault();
			event.stopPropagation();
			isDragOver = false;
			const draggedId = event.dataTransfer?.getData('application/x-obsidian-file-id');
			if (draggedId && draggedId !== node.id && onMoveItem) {
				onMoveItem(draggedId, node.id);
			}
		}
	};

	const handleKeydown = (event: KeyboardEvent) => {
		if (event.key === 'Enter' || event.key === ' ') {
			event.preventDefault();
			if (node.isFolder) {
				onToggleFolder(node.id);
			} else if (node.isMarkdown) {
				onOpenFile(node);
			}
		}
	};
</script>

<!-- svelte-ignore a11y_no_static_element_interactions -->
<div 
	class="select-none font-sans text-sm"
	draggable="true"
	ondragstart={handleDragStart}
	ondragover={handleDragOver}
	ondragleave={handleDragLeave}
	ondrop={handleDrop}
>
	{#if node.isFolder}
		<!-- Folder Item -->
		<div
			class="group flex items-center justify-between rounded-lg py-1.5 pr-2 transition-colors duration-150 {isDragOver ? 'bg-primary/20 ring-2 ring-primary dark:bg-blue-500/20 dark:ring-blue-500' : 'hover:bg-neutral-200/60 dark:hover:bg-neutral-800/60'}"
			style="padding-left: {depth * 12 + 12}px;"
		>
			<button
				type="button"
				class="flex grow items-center gap-1.5 text-left font-medium text-neutral-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 dark:text-neutral-200"
				onclick={() => onToggleFolder(node.id)}
				onkeydown={handleKeydown}
				aria-expanded={isExpanded}
			>
				<span
					class="material-symbols-outlined shrink-0 text-[18px] text-neutral-500 transition-transform duration-200 dark:text-neutral-400 {isExpanded ? 'rotate-90' : ''}"
				>
					chevron_right
				</span>
				<span
					class="material-symbols-outlined shrink-0 text-[18px] text-neutral-500 dark:text-neutral-400"
				>
					{isExpanded ? 'folder_open' : 'folder'}
				</span>
				<span class="truncate">{node.name}</span>
			</button>

			<!-- Quick Folder Actions (Hidden on default, visible on hover/focus) -->
			<div class="flex items-center gap-0.5 opacity-0 transition-opacity duration-150 group-hover:opacity-100 focus-within:opacity-100">
				<button
					type="button"
					class="flex size-6 items-center justify-center rounded text-neutral-500 hover:bg-neutral-300/60 hover:text-neutral-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary dark:text-neutral-400 dark:hover:bg-neutral-700/60 dark:hover:text-neutral-100"
					onclick={(e) => { e.stopPropagation(); onCreateInFolder(node.id, false); }}
					title="New note in {node.name}"
					aria-label="New note in {node.name}"
				>
					<span class="material-symbols-outlined text-[16px]">note_add</span>
				</button>
				<button
					type="button"
					class="flex size-6 items-center justify-center rounded text-neutral-500 hover:bg-neutral-300/60 hover:text-neutral-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary dark:text-neutral-400 dark:hover:bg-neutral-700/60 dark:hover:text-neutral-100"
					onclick={(e) => { e.stopPropagation(); onCreateInFolder(node.id, true); }}
					title="New folder in {node.name}"
					aria-label="New folder in {node.name}"
				>
					<span class="material-symbols-outlined text-[16px]">create_new_folder</span>
				</button>
				{#if onDeleteItem}
					<button
						type="button"
						class="flex size-6 items-center justify-center rounded text-neutral-500 hover:bg-red-100 hover:text-red-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 dark:text-neutral-400 dark:hover:bg-red-900/50 dark:hover:text-red-300"
						onclick={(e) => { e.stopPropagation(); onDeleteItem(node); }}
						title="Delete {node.name}"
						aria-label="Delete {node.name}"
					>
						<span class="material-symbols-outlined text-[16px]">delete</span>
					</button>
				{/if}
			</div>
		</div>

		<!-- Folder Children -->
		{#if isExpanded && node.children && node.children.length > 0}
			<div transition:slide={{ duration: 180 }} class="flex flex-col gap-0.5 py-0.5">
				{#each node.children as child (child.id)}
					<FileTreeItem
						node={child}
						depth={depth + 1}
						{currentFileId}
						{expandedFolders}
						{onOpenFile}
						{onToggleFolder}
						{onCreateInFolder}
						{onMoveItem}
						{onDeleteItem}
					/>
				{/each}
			</div>
		{/if}
	{:else if node.isMarkdown}
		<!-- Markdown File Item -->
		<div class="group relative flex w-full items-center">
			<button
				type="button"
				class="flex w-full items-center gap-2 rounded-lg py-1.5 pr-8 text-left transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary {isSelected ? 'bg-primary/10 font-semibold text-primary dark:bg-blue-500/15 dark:text-blue-400' : 'text-neutral-600 hover:bg-neutral-200/50 dark:text-neutral-400 dark:hover:bg-neutral-800/50'}"
				style="padding-left: {depth * 12 + 24}px;"
				onclick={() => onOpenFile(node)}
				onkeydown={handleKeydown}
				aria-current={isSelected ? 'page' : undefined}
			>
				<span
					class="material-symbols-outlined shrink-0 text-[18px] {isSelected ? 'text-primary dark:text-blue-400' : 'text-neutral-400 dark:text-neutral-500'}"
				>
					markdown
				</span>
				<span class="truncate">{node.name.replace(/\.md$/i, '')}</span>
			</button>

			<!-- Quick File Actions -->
			{#if onDeleteItem}
				<div class="absolute right-1 top-1/2 -translate-y-1/2 opacity-0 transition-opacity duration-150 group-hover:opacity-100 focus-within:opacity-100">
					<button
						type="button"
						class="flex size-6 items-center justify-center rounded text-neutral-500 hover:bg-red-100 hover:text-red-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 dark:text-neutral-400 dark:hover:bg-red-900/50 dark:hover:text-red-300"
						onclick={(e) => { e.stopPropagation(); onDeleteItem(node); }}
						title="Delete {node.name}"
						aria-label="Delete {node.name}"
					>
						<span class="material-symbols-outlined text-[16px]">delete</span>
					</button>
				</div>
			{/if}
		</div>
	{/if}
</div>
