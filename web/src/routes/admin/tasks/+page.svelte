<script lang="ts">
	import { onMount } from 'svelte';
	import { fade } from 'svelte/transition';
	import type { PageData } from './$types';
	import ObsidianToolbar from '$lib/components/admin-obsidian/ObsidianToolbar.svelte';
	import ToastContainer from '$lib/components/admin-obsidian/ToastContainer.svelte';
	import { toastStore } from '$lib/stores/toast.svelte';

	interface Task {
		id: string;
		title: string;
		description: string;
		column: 'todo' | 'inprogress' | 'completed';
		color: 'yellow' | 'peach' | 'mint' | 'lavender' | 'sky';
		createdAt: string;
		updatedAt: string;
	}

	let { data }: { data: PageData } = $props();

	// Primary tasks state (Svelte 5 rune)
	let tasks = $state<Task[]>([]);
	let isLoadingTasks = $state(true);
	let isRefreshing = $state(false);
	let isSaving = $state(false);

	onMount(async () => {
		isLoadingTasks = true;
		try {
			const response = await fetch('/api/admin/tasks');
			if (response.status === 428) {
				window.location.href = `/auth/google?next=${encodeURIComponent(window.location.pathname)}`;
				return;
			}
			if (response.ok) {
				tasks = await response.json();
			}
		} catch (err) {
			toastStore.error('Failed to load tasks.');
		} finally {
			isLoadingTasks = false;
		}
	});

	// Search filter
	let searchQuery = $state('');

	// Native drag-and-drop state
	let activeDragTaskId = $state<string | null>(null);
	let isDraggingOverColumn = $state<'todo' | 'inprogress' | 'completed' | null>(null);

	// Modal dialog state
	let showDialog = $state(false);
	let isEditing = $state(false);
	let dialogTaskId = $state('');
	let dialogTitle = $state('');
	let dialogDescription = $state('');
	let dialogColumn = $state<'todo' | 'inprogress' | 'completed'>('todo');
	let dialogColor = $state<'yellow' | 'peach' | 'mint' | 'lavender' | 'sky'>('yellow');

	// Color definitions with harmonious, premium pastel palettes
	const colorThemes = {
		yellow: {
			bg: 'from-amber-50 to-amber-100 border-amber-200/50 dark:from-amber-950/20 dark:to-amber-900/30 dark:border-amber-900/20',
			text: 'text-amber-900 dark:text-amber-200',
			textMuted: 'text-amber-800/60 dark:text-amber-300/50',
			dot: 'bg-amber-400 dark:bg-amber-500',
			accent: '#f59e0b'
		},
		peach: {
			bg: 'from-orange-50 to-orange-100 border-orange-200/50 dark:from-orange-950/20 dark:to-orange-900/30 dark:border-orange-900/20',
			text: 'text-orange-900 dark:text-orange-200',
			textMuted: 'text-orange-800/60 dark:text-orange-300/50',
			dot: 'bg-orange-400 dark:bg-orange-500',
			accent: '#f97316'
		},
		mint: {
			bg: 'from-emerald-50 to-emerald-100 border-emerald-200/50 dark:from-emerald-950/20 dark:to-emerald-900/30 dark:border-emerald-900/20',
			text: 'text-emerald-900 dark:text-emerald-200',
			textMuted: 'text-emerald-800/60 dark:text-emerald-300/50',
			dot: 'bg-emerald-400 dark:bg-emerald-500',
			accent: '#10b981'
		},
		lavender: {
			bg: 'from-violet-50 to-violet-100 border-violet-200/50 dark:from-violet-950/20 dark:to-violet-900/30 dark:border-violet-900/20',
			text: 'text-violet-900 dark:text-violet-200',
			textMuted: 'text-violet-800/60 dark:text-violet-300/50',
			dot: 'bg-violet-400 dark:bg-violet-500',
			accent: '#8b5cf6'
		},
		sky: {
			bg: 'from-sky-50 to-sky-100 border-sky-200/50 dark:from-sky-950/20 dark:to-sky-900/30 dark:border-sky-900/20',
			text: 'text-sky-900 dark:text-sky-200',
			textMuted: 'text-sky-800/60 dark:text-sky-300/50',
			dot: 'bg-sky-400 dark:bg-sky-500',
			accent: '#0ea5e9'
		}
	};

	// Deterministic slight rotation for sticky notes to create a physical board feel
	const getRotationStyle = (id: string): string => {
		let hash = 0;
		for (let i = 0; i < id.length; i++) {
			hash = id.charCodeAt(i) + ((hash << 5) - hash);
		}
		const angle = (hash % 24) / 10 - 1.2; // Angle between -1.2deg and 1.2deg
		return `transform: rotate(${angle}deg);`;
	};

	// Synchronize with API server
	const syncTasks = async () => {
		isSaving = true;
		try {
			const response = await fetch('/api/admin/tasks', {
				method: 'PUT',
				headers: { 'content-type': 'application/json' },
				body: JSON.stringify(tasks)
			});

			if (response.status === 428) {
				toastStore.error('Google session expired. Redirecting to login...');
				setTimeout(() => {
					window.location.href = `/auth/google?next=${encodeURIComponent(window.location.pathname)}`;
				}, 1500);
				return;
			}

			if (!response.ok) {
				throw new Error('Failed to synchronize tasks.');
			}
		} catch (caught) {
			toastStore.error(caught instanceof Error ? caught.message : 'Synchronization failed.');
		} finally {
			isSaving = false;
		}
	};

	// Fetch fresh data from Google Drive manually
	const handleRefresh = async () => {
		if (isRefreshing) return;
		isRefreshing = true;
		try {
			const response = await fetch('/api/admin/tasks');
			if (response.status === 428) {
				window.location.href = `/auth/google?next=${encodeURIComponent(window.location.pathname)}`;
				return;
			}
			if (!response.ok) {
				throw new Error('Failed to fetch tasks.');
			}
			const freshTasks = (await response.json()) as Task[];
			tasks = freshTasks;
			toastStore.success('Tasks refreshed.');
		} catch (caught) {
			toastStore.error(caught instanceof Error ? caught.message : 'Refresh failed.');
		} finally {
			isRefreshing = false;
		}
	};

	// Open dialog for creating a task
	const openCreateDialog = (column: 'todo' | 'inprogress' | 'completed') => {
		isEditing = false;
		dialogTaskId = '';
		dialogTitle = '';
		dialogDescription = '';
		dialogColumn = column;
		dialogColor = 'yellow';
		showDialog = true;
	};

	// Open dialog for editing a task
	const openEditDialog = (task: Task) => {
		isEditing = true;
		dialogTaskId = task.id;
		dialogTitle = task.title;
		dialogDescription = task.description;
		dialogColumn = task.column;
		dialogColor = task.color;
		showDialog = true;
	};

	// Handle creating/editing submission
	const handleSaveTask = async (e: Event) => {
		e.preventDefault();
		if (!dialogTitle.trim()) {
			toastStore.error('Task title is required.');
			return;
		}

		if (isEditing) {
			// Edit task in state
			const index = tasks.findIndex((t) => t.id === dialogTaskId);
			if (index !== -1) {
				tasks[index] = {
					...tasks[index],
					title: dialogTitle.trim(),
					description: dialogDescription.trim(),
					column: dialogColumn,
					color: dialogColor,
					updatedAt: new Date().toISOString()
				};
				toastStore.success('Task updated.');
			}
		} else {
			// Create task in state
			const newTask: Task = {
				id: crypto.randomUUID(),
				title: dialogTitle.trim(),
				description: dialogDescription.trim(),
				column: dialogColumn,
				color: dialogColor,
				createdAt: new Date().toISOString(),
				updatedAt: new Date().toISOString()
			};
			tasks = [...tasks, newTask];
			toastStore.success('Task created.');
		}

		showDialog = false;
		await syncTasks();
	};

	// Delete a task
	const handleDeleteTask = async (id: string, title: string) => {
		if (!confirm(`Are you sure you want to delete task "${title}"?`)) {
			return;
		}

		tasks = tasks.filter((t) => t.id !== id);
		toastStore.success('Task deleted.');
		await syncTasks();
	};

	// Drag & Drop Handlers
	const handleDragStart = (e: DragEvent, id: string) => {
		activeDragTaskId = id;
		if (e.dataTransfer) {
			e.dataTransfer.setData('text/plain', id);
			e.dataTransfer.effectAllowed = 'move';
		}
	};

	const handleDragOver = (e: DragEvent, column: 'todo' | 'inprogress' | 'completed') => {
		e.preventDefault();
		isDraggingOverColumn = column;
	};

	const handleDragLeave = () => {
		isDraggingOverColumn = null;
	};

	const handleDrop = async (e: DragEvent, column: 'todo' | 'inprogress' | 'completed') => {
		e.preventDefault();
		isDraggingOverColumn = null;

		const id = e.dataTransfer?.getData('text/plain') || activeDragTaskId;
		if (!id) return;

		const index = tasks.findIndex((t) => t.id === id);
		if (index !== -1 && tasks[index].column !== column) {
			// Optimistically update column position
			tasks[index].column = column;
			tasks[index].updatedAt = new Date().toISOString();
			activeDragTaskId = null;
			await syncTasks();
		}
	};

	// Filtered tasks by search query
	const filteredTasks = $derived(
		tasks.filter((t) => {
			const query = searchQuery.toLowerCase().trim();
			if (!query) return true;
			return t.title.toLowerCase().includes(query) || t.description.toLowerCase().includes(query);
		})
	);

	// Task counts per column
	const columns = [
		{ id: 'todo' as const, label: 'To Do', icon: 'playlist_add' },
		{ id: 'inprogress' as const, label: 'In Progress', icon: 'engineering' },
		{ id: 'completed' as const, label: 'Completed', icon: 'task_alt' }
	];
</script>

<div in:fade={{ duration: 180 }} class="flex h-screen w-full flex-col overflow-hidden bg-neutral-50 dark:bg-neutral-950 font-sans">
	<ObsidianToolbar
		vaultName={data.vaultInfo?.vaultName || 'Tasks Board'}
		userEmail={data.user.email}
		userName={data.user.name}
		userPicture={data.user.picture}
		{isRefreshing}
		viewMode="editor"
		onRefresh={handleRefresh}
	/>

	<div class="flex flex-1 flex-col overflow-hidden bg-white dark:bg-neutral-900">
		<!-- Toolbar Actions -->
		<div class="flex shrink-0 flex-col gap-4 border-b border-neutral-200 px-6 py-4 dark:border-neutral-800 sm:flex-row sm:items-center sm:justify-between">
			<div>
				<h1 class="text-xl font-black text-neutral-900 dark:text-white flex items-center gap-2">
					<span class="material-symbols-outlined text-2xl text-blue-500">space_dashboard</span>
					Tasks Management
				</h1>
				<p class="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
					A drag-and-drop sticky note kanban board synced directly with Google Drive.
				</p>
			</div>

			<!-- Search & Add Actions -->
			<div class="flex items-center gap-3">
				<!-- Search -->
				<div class="relative w-full max-w-xs">
					<span class="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[18px] text-neutral-400">search</span>
					<input
						type="text"
						placeholder="Search tasks..."
						bind:value={searchQuery}
						class="h-9 w-full rounded-lg border border-neutral-200 bg-neutral-50 pl-9 pr-4 text-xs font-semibold text-neutral-800 placeholder-neutral-400 transition-colors focus:border-blue-500 focus:bg-white focus:outline-none dark:border-neutral-800 dark:bg-neutral-950 dark:text-neutral-100 dark:placeholder-neutral-600 dark:focus:border-blue-500 dark:focus:bg-neutral-950"
					/>
					{#if searchQuery}
						<button
							onclick={() => (searchQuery = '')}
							class="absolute right-2.5 top-1/2 -translate-y-1/2 flex size-5 items-center justify-center rounded-full bg-neutral-200 text-neutral-500 hover:bg-neutral-300 dark:bg-neutral-800 dark:text-neutral-400 dark:hover:bg-neutral-700"
						>
							<span class="material-symbols-outlined text-[12px]">close</span>
						</button>
					{/if}
				</div>

				<div class="h-5 w-px bg-neutral-200 dark:bg-neutral-800 hidden sm:block"></div>

				{#if isSaving}
					<div class="flex items-center gap-1.5 text-xs text-neutral-400 dark:text-neutral-500 font-bold">
						<span class="material-symbols-outlined animate-spin text-[16px]">sync</span>
						Saving...
					</div>
				{/if}
			</div>
		</div>

		<!-- Kanban Board Layout -->
		<div class="flex-1 overflow-x-auto overflow-y-hidden p-6 bg-neutral-50/50 dark:bg-neutral-950/20">
			<div class="flex h-full min-w-[900px] gap-6">
				{#each columns as col (col.id)}
					{@const colTasks = filteredTasks.filter((t) => t.column === col.id)}
					<div
						role="region"
						aria-label="{col.label} column"
						class="flex h-full w-1/3 flex-col rounded-2xl border border-neutral-200/80 bg-neutral-100/30 p-4 transition-all dark:border-neutral-800/60 dark:bg-neutral-900/20 {isDraggingOverColumn === col.id ? 'bg-blue-500/5 border-blue-500/30 ring-2 ring-blue-500/10' : ''}"
						ondragover={(e) => handleDragOver(e, col.id)}
						ondragleave={handleDragLeave}
						ondrop={(e) => handleDrop(e, col.id)}
					>
						<!-- Column Header -->
						<div class="mb-4 flex items-center justify-between shrink-0">
							<div class="flex items-center gap-2">
								<span class="material-symbols-outlined text-[20px] text-neutral-500 dark:text-neutral-400">{col.icon}</span>
								<span class="font-extrabold text-sm text-neutral-700 dark:text-neutral-300 uppercase tracking-widest">{col.label}</span>
								<span class="flex size-5 items-center justify-center rounded-full bg-neutral-200 text-[10px] font-black text-neutral-600 dark:bg-neutral-800 dark:text-neutral-400">
									{colTasks.length}
								</span>
							</div>

							<!-- Add Task inside this Column -->
							<button
								onclick={() => openCreateDialog(col.id)}
								class="flex size-7 items-center justify-center rounded-lg bg-white shadow-sm border border-neutral-200/80 text-neutral-600 hover:bg-blue-50 hover:text-blue-600 transition-colors dark:bg-neutral-900 dark:border-neutral-800 dark:text-neutral-400 dark:hover:bg-neutral-800 dark:hover:text-blue-400"
								title="Add task to {col.label}"
							>
								<span class="material-symbols-outlined text-[16px]">add</span>
							</button>
						</div>

						<!-- Column Task Cards Wrapper -->
						<div class="flex-1 overflow-y-auto space-y-4 pr-1 pb-10">
							{#if isLoadingTasks}
								<!-- Premium Loading Skeleton cards -->
								<div class="space-y-4 animate-pulse">
									<div class="h-28 rounded-xl bg-neutral-200/50 dark:bg-neutral-800/40 relative overflow-hidden border border-neutral-200/20 dark:border-neutral-800/20">
										<div class="absolute -top-2.5 left-1/2 -translate-x-1/2 w-10 h-5 bg-neutral-300/40 dark:bg-neutral-700/40 rounded-sm"></div>
										<div class="p-5 space-y-3">
											<div class="h-4 w-2/3 rounded bg-neutral-300/60 dark:bg-neutral-700/50"></div>
											<div class="h-3 w-5/6 rounded bg-neutral-300/30 dark:bg-neutral-700/30"></div>
										</div>
									</div>
									<div class="h-28 rounded-xl bg-neutral-200/30 dark:bg-neutral-800/20 relative overflow-hidden border border-neutral-200/10 dark:border-neutral-800/10 opacity-70">
										<div class="absolute -top-2.5 left-1/2 -translate-x-1/2 w-10 h-5 bg-neutral-300/30 dark:bg-neutral-700/30 rounded-sm"></div>
										<div class="p-5 space-y-3">
											<div class="h-4 w-1/2 rounded bg-neutral-300/50 dark:bg-neutral-700/40"></div>
											<div class="h-3 w-4/5 rounded bg-neutral-300/20 dark:bg-neutral-700/20"></div>
										</div>
									</div>
								</div>
							{:else if colTasks.length === 0}
								<!-- Empty column state -->
								<div class="flex flex-col items-center justify-center py-12 border-2 border-dashed border-neutral-200 dark:border-neutral-800 rounded-xl">
									<span class="material-symbols-outlined text-3xl text-neutral-300 dark:text-neutral-700">dashboard_customize</span>
									<span class="text-[10px] font-bold text-neutral-400 dark:text-neutral-600 uppercase tracking-widest mt-2">No tasks</span>
								</div>
							{:else}
								{#each colTasks as task (task.id)}
									{@const theme = colorThemes[task.color]}
									<!-- Sticky Note Card -->
									<div
										role="button"
										tabindex="0"
										draggable="true"
										ondragstart={(e) => handleDragStart(e, task.id)}
										onclick={() => openEditDialog(task)}
										onkeydown={(e) => {
											if (e.key === 'Enter' || e.key === ' ') {
												e.preventDefault();
												openEditDialog(task);
											}
										}}
										class="group relative flex flex-col rounded-lg border p-5 shadow-sm bg-gradient-to-b transition-all duration-300 ease-out cursor-grab hover:shadow-lg hover:-translate-y-1 hover:rotate-0 active:cursor-grabbing {theme.bg} {theme.text}"
										style={getRotationStyle(task.id)}
									>
										<!-- Taped look at the top of sticky note -->
										<div class="absolute -top-2.5 left-1/2 -translate-x-1/2 w-10 h-5 bg-white/30 dark:bg-neutral-900/30 border-x border-neutral-200/30 backdrop-blur-xs rotate-1 shadow-2xs rounded-sm"></div>

										<!-- Color Dot Accent and Options -->
										<div class="flex items-center justify-between mb-2">
											<div class="flex items-center gap-1.5">
												<span class="size-2 rounded-full {theme.dot}"></span>
												<span class="text-[10px] font-bold uppercase tracking-wider {theme.textMuted}">{task.color}</span>
											</div>
											<button
												onclick={(e) => {
													e.stopPropagation();
													handleDeleteTask(task.id, task.title);
												}}
												class="opacity-0 group-hover:opacity-100 flex size-5 items-center justify-center rounded text-neutral-400 hover:bg-red-500/10 hover:text-red-500 transition-all"
												title="Delete task"
											>
												<span class="material-symbols-outlined text-[14px]">delete</span>
											</button>
										</div>

										<h3 class="font-extrabold text-sm leading-snug tracking-tight mb-2 truncate">
											{task.title}
										</h3>

										{#if task.description}
											<p class="text-xs leading-relaxed line-clamp-3 mb-3 {theme.textMuted}">
												{task.description}
											</p>
										{/if}

										<!-- Footer info -->
										<div class="flex items-center justify-between border-t border-black/5 dark:border-white/5 pt-2.5 mt-auto">
											<span class="text-[9px] font-bold uppercase tracking-widest {theme.textMuted}">
												{new Date(task.updatedAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
											</span>
											<span class="material-symbols-outlined text-[14px] opacity-25 group-hover:opacity-60 transition-opacity">drag_indicator</span>
										</div>
									</div>
								{/each}
							{/if}
						</div>
					</div>
				{/each}
			</div>
		</div>
	</div>
</div>

<!-- Add/Edit Task Modal Dialog -->
{#if showDialog}
	<!-- svelte-ignore a11y_click_events_have_key_events -->
	<!-- svelte-ignore a11y_no_static_element_interactions -->
	<div
		class="fixed inset-0 z-50 flex items-center justify-center bg-neutral-950/60 backdrop-blur-xs p-4 animate-in fade-in duration-200"
		onclick={() => (showDialog = false)}
	>
		<div
			class="w-full max-w-md rounded-2xl border border-neutral-200 bg-white p-6 shadow-2xl dark:border-neutral-800 dark:bg-neutral-900 animate-in zoom-in-95 duration-200"
			onclick={(e) => e.stopPropagation()}
		>
			<div class="flex items-center justify-between border-b border-neutral-100 pb-3 dark:border-neutral-800">
				<h2 class="text-base font-extrabold text-neutral-900 dark:text-white flex items-center gap-2">
					<span class="material-symbols-outlined text-[20px] text-blue-500">
						{isEditing ? 'edit_note' : 'note_add'}
					</span>
					{isEditing ? 'Edit Task Note' : 'Create Task Note'}
				</h2>
				<button
					onclick={() => (showDialog = false)}
					class="flex size-7 items-center justify-center rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 transition-colors"
				>
					<span class="material-symbols-outlined text-[20px]">close</span>
				</button>
			</div>

			<form onsubmit={handleSaveTask} class="mt-4 space-y-4">
				<!-- Title -->
				<div>
					<label for="task-title" class="block text-xs font-extrabold text-neutral-500 uppercase tracking-widest mb-1.5 dark:text-neutral-400">
						Title
					</label>
					<input
						type="text"
						id="task-title"
						placeholder="E.g. Write blog post about Svelte 5"
						bind:value={dialogTitle}
						required
						class="h-10 w-full rounded-xl border border-neutral-200 bg-neutral-50 px-3.5 text-xs font-semibold text-neutral-800 placeholder-neutral-400 transition-colors focus:border-blue-500 focus:bg-white focus:outline-none dark:border-neutral-800 dark:bg-neutral-950 dark:text-neutral-100 dark:placeholder-neutral-700 dark:focus:border-blue-500 dark:focus:bg-neutral-950"
					/>
				</div>

				<!-- Description -->
				<div>
					<label for="task-desc" class="block text-xs font-extrabold text-neutral-500 uppercase tracking-widest mb-1.5 dark:text-neutral-400">
						Description
					</label>
					<textarea
						id="task-desc"
						rows="4"
						placeholder="Describe the objective or sub-tasks..."
						bind:value={dialogDescription}
						class="w-full rounded-xl border border-neutral-200 bg-neutral-50 p-3.5 text-xs font-semibold text-neutral-800 placeholder-neutral-400 transition-colors focus:border-blue-500 focus:bg-white focus:outline-none dark:border-neutral-800 dark:bg-neutral-950 dark:text-neutral-100 dark:placeholder-neutral-700 dark:focus:border-blue-500 dark:focus:bg-neutral-950 resize-none"
					></textarea>
				</div>

				<!-- Grid: Column & Color Selection -->
				<div class="grid grid-cols-2 gap-4">
					<div>
						<label for="task-column" class="block text-xs font-extrabold text-neutral-500 uppercase tracking-widest mb-1.5 dark:text-neutral-400">
							Column Status
						</label>
						<select
							id="task-column"
							bind:value={dialogColumn}
							class="h-10 w-full rounded-xl border border-neutral-200 bg-neutral-50 px-3 text-xs font-semibold text-neutral-800 transition-colors focus:border-blue-500 focus:bg-white focus:outline-none dark:border-neutral-800 dark:bg-neutral-950 dark:text-neutral-100 dark:focus:border-blue-500 dark:focus:bg-neutral-950"
						>
							<option value="todo">To Do</option>
							<option value="inprogress">In Progress</option>
							<option value="completed">Completed</option>
						</select>
					</div>

					<!-- Color Picker (Sticky note themes) -->
					<div>
						<span class="block text-xs font-extrabold text-neutral-500 uppercase tracking-widest mb-1.5 dark:text-neutral-400">
							Color Theme
						</span>
						<div class="flex h-10 items-center justify-between rounded-xl border border-neutral-200 bg-neutral-50 px-2.5 dark:border-neutral-800 dark:bg-neutral-950">
							{#each Object.keys(colorThemes) as colorKey (colorKey)}
								{@const th = colorThemes[colorKey as keyof typeof colorThemes]}
								<button
									type="button"
									onclick={() => (dialogColor = colorKey as any)}
									class="size-6 rounded-full border transition-transform flex items-center justify-center {dialogColor === colorKey ? 'scale-110 shadow-sm border-neutral-400 dark:border-neutral-200' : 'border-transparent hover:scale-105'}"
									style="background-color: {th.accent};"
									title={colorKey}
								>
									{#if dialogColor === colorKey}
										<span class="material-symbols-outlined text-[12px] text-white">check</span>
									{/if}
								</button>
							{/each}
						</div>
					</div>
				</div>

				<!-- Save Action -->
				<div class="mt-6 flex items-center justify-end gap-3 border-t border-neutral-100 pt-4 dark:border-neutral-800">
					<button
						type="button"
						onclick={() => (showDialog = false)}
						class="h-10 rounded-xl px-4 text-xs font-extrabold uppercase tracking-wider text-neutral-500 hover:bg-neutral-100 transition-colors dark:text-neutral-400 dark:hover:bg-neutral-800"
					>
						Cancel
					</button>
					<button
						type="submit"
						class="h-10 rounded-xl bg-blue-500 hover:bg-blue-600 px-5 text-xs font-extrabold uppercase tracking-wider text-white shadow-md shadow-blue-500/20 transition-colors"
					>
						{isEditing ? 'Save Changes' : 'Create Note'}
					</button>
				</div>
			</form>
		</div>
	</div>
{/if}

<!-- Global Toast Notifications -->
<ToastContainer />
