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
		onCreateInFolder
	}: {
		node: DriveFileNode;
		depth?: number;
		currentFileId?: string | null;
		expandedFolders: Set<string>;
		onOpenFile: (file: DriveFileNode) => void;
		onToggleFolder: (folderId: string) => void;
		onCreateInFolder: (folderId: string, isFolder: boolean) => void;
	} = $props();

	const isExpanded = $derived(expandedFolders.has(node.id));
	const isSelected = $derived(currentFileId === node.id);

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

<div class="select-none font-sans text-sm">
	{#if node.isFolder}
		<!-- Folder Item -->
		<div
			class="group flex items-center justify-between rounded-lg py-1.5 pr-2 transition-colors duration-150 hover:bg-neutral-200/60 dark:hover:bg-neutral-800/60"
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
					/>
				{/each}
			</div>
		{/if}
	{:else if node.isMarkdown}
		<!-- Markdown File Item -->
		<button
			type="button"
			class="group flex w-full items-center gap-2 rounded-lg py-1.5 pr-3 text-left transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary {isSelected ? 'bg-primary/10 font-semibold text-primary dark:bg-blue-500/15 dark:text-blue-400' : 'text-neutral-600 hover:bg-neutral-200/50 dark:text-neutral-400 dark:hover:bg-neutral-800/50'}"
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
	{/if}
</div>
