<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { DriveFileNode } from '$lib/obsidian/types';
	import ObsidianToolbar from './ObsidianToolbar.svelte';
	import ObsidianSidebar from './ObsidianSidebar.svelte';
	import CreateItemDialog from './CreateItemDialog.svelte';

	type ViewMode = 'editor' | 'graph';

	let {
		vaultName,
		userEmail,
		userName = undefined,
		userPicture = undefined,
		treeRoot,
		currentFileId = null,
		isRefreshing = false,
		viewMode = 'editor' as ViewMode,
		onRefresh,
		onOpenFile,
		onCreateItem,
		onSwitchView,
		onMoveItem = undefined,
		onDeleteItem = undefined,
		children
	}: {
		vaultName: string;
		userEmail: string;
		userName?: string;
		userPicture?: string;
		treeRoot: DriveFileNode | null;
		currentFileId?: string | null;
		isRefreshing?: boolean;
		viewMode?: ViewMode;
		onRefresh: () => Promise<void>;
		onOpenFile: (file: DriveFileNode) => void;
		onCreateItem: (name: string, isFolder: boolean, parentId: string) => Promise<DriveFileNode>;
		onSwitchView?: (mode: ViewMode) => void;
		onMoveItem?: (draggedId: string, targetFolderId: string) => Promise<void>;
		onDeleteItem?: (node: DriveFileNode) => void;
		children: Snippet;
	} = $props();

	let isMobileSidebarOpen = $state(false);

	// Create dialog state
	let createDialogOpen = $state(false);
	let createDialogIsFolder = $state(false);
	let createDialogParentId = $state('');
	let createDialogParentName = $state('');

	// Helper to find node by id
	const findNodeById = (node: DriveFileNode | null, id: string): DriveFileNode | null => {
		if (!node) return null;
		if (node.id === id) return node;
		if (node.children) {
			for (const child of node.children) {
				const found = findNodeById(child, id);
				if (found) return found;
			}
		}
		return null;
	};

	const handleOpenCreateFile = (parentId: string) => {
		const parent = findNodeById(treeRoot, parentId);
		createDialogParentId = parentId;
		createDialogParentName = parent ? parent.name : 'Vault root';
		createDialogIsFolder = false;
		createDialogOpen = true;
	};

	const handleOpenCreateFolder = (parentId: string) => {
		const parent = findNodeById(treeRoot, parentId);
		createDialogParentId = parentId;
		createDialogParentName = parent ? parent.name : 'Vault root';
		createDialogIsFolder = true;
		createDialogOpen = true;
	};

	const handleSubmitCreate = async (name: string, isFolder: boolean, parentId: string) => {
		const newNode = await onCreateItem(name, isFolder, parentId);
		if (!isFolder && newNode.isMarkdown) {
			onOpenFile(newNode);
			if (isMobileSidebarOpen) {
				isMobileSidebarOpen = false;
			}
		}
	};
</script>

<div class="flex h-screen w-full flex-col overflow-hidden bg-neutral-50 dark:bg-neutral-950 font-sans">
	<ObsidianToolbar
		{vaultName}
		{userEmail}
		{userName}
		{userPicture}
		{isRefreshing}
		{viewMode}
		{onRefresh}
		{onSwitchView}
		onToggleSidebar={() => (isMobileSidebarOpen = !isMobileSidebarOpen)}
	/>

	<div class="relative flex flex-1 overflow-hidden">
		<!-- Sidebar (Desktop) — hidden in graph view for full-width graph -->
		{#if viewMode !== 'graph'}
			<div class="hidden md:block md:w-72 lg:w-80 shrink-0 h-full">
				<ObsidianSidebar
					{treeRoot}
					{currentFileId}
					{onOpenFile}
					onCreateFile={handleOpenCreateFile}
					onCreateFolder={handleOpenCreateFolder}
					{onMoveItem}
					{onDeleteItem}
				/>
			</div>
		{/if}

		<!-- Mobile Sidebar Drawer -->
		{#if isMobileSidebarOpen && viewMode !== 'graph'}
			<!-- svelte-ignore a11y_click_events_have_key_events -->
			<!-- svelte-ignore a11y_no_static_element_interactions -->
			<div
				class="fixed inset-0 z-40 bg-neutral-950/50 backdrop-blur-xs md:hidden"
				onclick={() => (isMobileSidebarOpen = false)}
			></div>

			<div class="fixed top-14 bottom-0 left-0 z-50 w-80 shadow-2xl md:hidden animate-in slide-in-from-left duration-200">
				<ObsidianSidebar
					{treeRoot}
					{currentFileId}
					onOpenFile={(file) => { onOpenFile(file); isMobileSidebarOpen = false; }}
					onCreateFile={handleOpenCreateFile}
					onCreateFolder={handleOpenCreateFolder}
					{onMoveItem}
					{onDeleteItem}
				/>
			</div>
		{/if}

		<!-- Main Workspace Area -->
		<main class="flex-1 h-full overflow-hidden relative flex flex-col bg-white dark:bg-neutral-900">
			{@render children()}
		</main>
	</div>

	<!-- Create Item Modal -->
	<CreateItemDialog
		isOpen={createDialogOpen}
		isFolder={createDialogIsFolder}
		parentId={createDialogParentId}
		parentName={createDialogParentName}
		onSubmit={handleSubmitCreate}
		onClose={() => (createDialogOpen = false)}
	/>
</div>
