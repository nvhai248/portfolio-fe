<script lang="ts">
	import { resolve } from '$app/paths';
	import { page } from '$app/state';

	type ViewMode = 'editor' | 'graph';

	let {
		vaultName,
		userEmail,
		userName = undefined,
		userPicture = undefined,
		isRefreshing,
		viewMode = 'editor' as ViewMode,
		onRefresh,
		onToggleSidebar,
		onSwitchView
	}: {
		vaultName: string;
		userEmail: string;
		userName?: string;
		userPicture?: string;
		isRefreshing: boolean;
		viewMode?: ViewMode;
		onRefresh: () => Promise<void>;
		onToggleSidebar?: () => void;
		onSwitchView?: (mode: ViewMode) => void;
	} = $props();
</script>

<header class="flex h-14 shrink-0 items-center justify-between border-b border-neutral-200 bg-white px-4 z-10 dark:border-neutral-800 dark:bg-neutral-900 sm:px-6">
	<div class="flex items-center gap-3">
		{#if onToggleSidebar}
			<button
				type="button"
				class="md:hidden flex size-8 items-center justify-center rounded-lg border border-neutral-200 text-neutral-600 hover:bg-neutral-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary dark:border-neutral-800 dark:text-neutral-300 dark:hover:bg-neutral-800"
				onclick={onToggleSidebar}
				aria-label="Toggle sidebar"
			>
				<span class="material-symbols-outlined text-[18px]">menu_open</span>
			</button>
		{/if}

		<a
			href={resolve('/')}
			class="flex size-8 items-center justify-center rounded-lg border border-neutral-200 text-neutral-600 hover:bg-neutral-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary dark:border-neutral-800 dark:text-neutral-300 dark:hover:bg-neutral-800"
			title="Back to site"
		>
			<span class="material-symbols-outlined text-[18px]">home</span>
		</a>

		<!-- Admin Segmented Tab Navigation -->
		<div class="flex items-center rounded-lg border border-neutral-200 p-0.5 dark:border-neutral-800 ml-1">
			<a
				href={resolve('/admin/obsidian-notes')}
				class="inline-flex h-7 items-center justify-center gap-1 rounded-md px-2.5 text-xs font-bold transition-colors {page.url.pathname.startsWith('/admin/obsidian-notes') ? 'bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-900' : 'text-neutral-500 hover:text-neutral-700 dark:text-neutral-400 dark:hover:text-neutral-200'}"
				title="Obsidian notes manager"
			>
				<span class="material-symbols-outlined text-[14px]">edit_document</span>
				Notes
			</a>
			<a
				href={resolve('/admin/tasks')}
				class="inline-flex h-7 items-center justify-center gap-1 rounded-md px-2.5 text-xs font-bold transition-colors {page.url.pathname.startsWith('/admin/tasks') ? 'bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-900' : 'text-neutral-500 hover:text-neutral-700 dark:text-neutral-400 dark:hover:text-neutral-200'}"
				title="Tasks Kanban board"
			>
				<span class="material-symbols-outlined text-[14px]">space_dashboard</span>
				Tasks
			</a>
		</div>

		<div class="flex items-center gap-2 ml-1">
			<div class="flex size-8 items-center justify-center rounded-lg bg-primary/10 text-primary dark:bg-blue-500/15 dark:text-blue-400">
				<span class="material-symbols-outlined text-[18px]">folder_special</span>
			</div>
			<div class="flex flex-col">
				<div class="flex items-center gap-2">
					<span class="text-sm font-bold leading-tight text-neutral-900 dark:text-neutral-50">{vaultName}</span>
					<span class="rounded bg-neutral-100 px-1.5 py-0.5 text-[10px] font-semibold text-neutral-600 dark:bg-neutral-800 dark:text-neutral-400">Vault</span>
				</div>
				<div class="flex items-center gap-1 mt-0.5" title={userEmail}>
					{#if userPicture}
						<img src={userPicture} alt="Profile" class="size-3.5 rounded-full object-cover border border-neutral-200 dark:border-neutral-700" />
					{:else}
						<div class="flex size-3.5 items-center justify-center rounded-full bg-neutral-200 dark:bg-neutral-700 text-neutral-500 dark:text-neutral-400">
							<span class="material-symbols-outlined text-[10px]">person</span>
						</div>
					{/if}
					<span class="text-[11px] leading-tight text-neutral-500 dark:text-neutral-400 truncate max-w-[200px] sm:max-w-xs">{userName || userEmail}</span>
				</div>
			</div>
		</div>
	</div>

	<div class="flex items-center gap-2">
		<!-- View Mode Switcher -->
		{#if onSwitchView}
			<!-- Mobile: icon-only toggle -->
			<button
				type="button"
				onclick={() => onSwitchView?.(viewMode === 'editor' ? 'graph' : 'editor')}
				class="sm:hidden flex size-9 items-center justify-center rounded-lg border border-neutral-200 text-neutral-600 hover:bg-neutral-100 dark:border-neutral-800 dark:text-neutral-300 dark:hover:bg-neutral-800"
				title="{viewMode === 'editor' ? 'Graph' : 'Editor'} view (⌘G)"
			>
				<span class="material-symbols-outlined text-[18px]">{viewMode === 'editor' ? 'hub' : 'edit_note'}</span>
			</button>

			<!-- Desktop: segmented control -->
			<div class="hidden sm:flex items-center rounded-lg border border-neutral-200 p-0.5 dark:border-neutral-800">
				<button
					type="button"
					onclick={() => onSwitchView?.('editor')}
					class="inline-flex h-7 items-center justify-center gap-1 rounded-md px-2.5 text-xs font-bold transition-colors {viewMode === 'editor' ? 'bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-900' : 'text-neutral-500 hover:text-neutral-700 dark:text-neutral-400 dark:hover:text-neutral-200'}"
					title="Editor view (⌘G)"
				>
					<span class="material-symbols-outlined text-[14px]">edit_note</span>
					Editor
				</button>
				<button
					type="button"
					onclick={() => onSwitchView?.('graph')}
					class="inline-flex h-7 items-center justify-center gap-1 rounded-md px-2.5 text-xs font-bold transition-colors {viewMode === 'graph' ? 'bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-900' : 'text-neutral-500 hover:text-neutral-700 dark:text-neutral-400 dark:hover:text-neutral-200'}"
					title="Graph view (⌘G)"
				>
					<span class="material-symbols-outlined text-[14px]">hub</span>
					Graph
				</button>
			</div>
		{/if}

		<button
			type="button"
			class="inline-flex h-9 items-center justify-center gap-1.5 rounded-lg border border-neutral-200 px-3 text-xs font-bold uppercase tracking-wider text-neutral-700 transition-colors hover:bg-neutral-100 disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary dark:border-neutral-800 dark:text-neutral-300 dark:hover:bg-neutral-800"
			onclick={onRefresh}
			disabled={isRefreshing}
			title="Refresh note tree from Google Drive"
		>
			<span class="material-symbols-outlined text-[16px] {isRefreshing ? 'animate-spin' : ''}">refresh</span>
			<span class="hidden sm:inline">{isRefreshing ? 'Refreshing...' : 'Refresh'}</span>
		</button>

		<a
			href={resolve('/auth/logout')}
			class="inline-flex h-9 items-center justify-center gap-1.5 rounded-lg border border-neutral-200 px-3 text-xs font-bold uppercase tracking-wider text-neutral-700 transition-colors hover:bg-neutral-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary dark:border-neutral-800 dark:text-neutral-300 dark:hover:bg-neutral-800"
			title="Sign out of Admin Google session"
		>
			<span class="material-symbols-outlined text-[16px]">logout</span>
			<span class="hidden sm:inline">Sign out</span>
		</a>
	</div>
</header>
