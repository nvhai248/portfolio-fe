<script lang="ts">
	import { page } from '$app/state';
	import { browser } from '$app/environment';
	import { onMount, tick, untrack } from 'svelte';
	import { fade } from 'svelte/transition';
	import { getDictionary } from '$lib/i18n/dictionary';
	import { localeFromPathname } from '$lib/i18n/locale';
	import {
		SQL_DATA_TYPES,
		addColumn,
		addRelationship,
		addTable,
		cloneDraftState,
		createDefaultDraftState,
		generateMermaidFromSchema,
		generateSqlFromSchema,
		getColumnsForTable,
		parseSqlToSchema,
		removeColumn,
		removeRelationship,
		removeTable,
		sanitizeRelationships,
		type DesignerDraftState,
		type DesignerTab,
		type Relationship,
		type Table
	} from './model';
	import {
		DATABASE_HISTORY_LIMIT,
		DATABASE_STORAGE_KEY,
		createHistoryEntry,
		normalizePersistedDraft,
		serializeDraftState,
		type DesignerHistoryEntry,
		type PersistedDesignerDraft
	} from './persistence';

	type MermaidRenderResult = { svg: string };
	type MermaidInstance = {
		initialize: (config: Record<string, unknown>) => void;
		render: (id: string, code: string) => Promise<MermaidRenderResult>;
	};

	const initialDraftState = createDefaultDraftState();
	const initialHistoryEntry = createHistoryEntry(initialDraftState);

	let tables = $state<Table[]>(initialDraftState.tables);
	let relationships = $state<Relationship[]>(initialDraftState.relationships);
	let activeTab = $state<DesignerTab>(initialDraftState.activeTab);
	let sqlCode = $state(initialDraftState.sqlCode);
	let mermaidContainer: HTMLDivElement | undefined = $state();
	let isMermaidLoaded = $state(false);
	let mermaidError = $state('');
	let history = $state<DesignerHistoryEntry[]>([initialHistoryEntry]);
	let historyIndex = $state(0);
	let lastSavedAt = $state(initialHistoryEntry.savedAt);
	let restoredFromDraft = $state(false);
	let hasHydratedDraft = false;
	let isApplyingPersistedState = false;
	let skipNextHistoryCommit = false;
	let renderCounter = 0;

	let historyDebounceTimer: ReturnType<typeof setTimeout> | undefined;
	let renderDebounceTimer: ReturnType<typeof setTimeout> | undefined;

	const locale = $derived(localeFromPathname(page.url.pathname));
	const t = $derived(getDictionary(locale).tools.database.ui);
	const canUndo = $derived(historyIndex > 0);
	const canRedo = $derived(historyIndex < history.length - 1);
	const historySummary = $derived(history.length ? `${historyIndex + 1}/${history.length}` : '0/0');
	const savedAtLabel = $derived(lastSavedAt ? formatSavedAt(lastSavedAt) : '');
	const diagramCode = $derived(generateMermaidFromSchema(tables, relationships));
	const tableCount = $derived(tables.length);
	const relationshipCount = $derived(relationships.length);

	function getMermaid(): MermaidInstance | undefined {
		return (window as Window & { mermaid?: MermaidInstance }).mermaid;
	}

	function formatSavedAt(savedAt: string): string {
		const parsed = new Date(savedAt);
		if (Number.isNaN(parsed.getTime())) return '';
		return parsed.toLocaleString();
	}

	function captureDraftState(): DesignerDraftState {
		return cloneDraftState({
			tables,
			relationships: sanitizeRelationships(tables, relationships),
			activeTab,
			sqlCode
		});
	}

	function persistDraftState(updatedAt = new Date().toISOString()) {
		if (!browser) return;

		const payload: PersistedDesignerDraft = {
			version: 1,
			currentState: captureDraftState(),
			history: history.map((entry) => ({
				...entry,
				state: cloneDraftState(entry.state)
			})),
			historyIndex,
			updatedAt
		};

		try {
			localStorage.setItem(DATABASE_STORAGE_KEY, JSON.stringify(payload));
			lastSavedAt = updatedAt;
		} catch {
			// Ignore storage write errors and keep the editor usable.
		}
	}

	async function applyDraftState(
		state: DesignerDraftState,
		options: { skipHistoryCommit?: boolean; persist?: boolean } = {}
	) {
		const nextState = cloneDraftState(state);

		isApplyingPersistedState = true;
		if (options.skipHistoryCommit) {
			skipNextHistoryCommit = true;
		}

		tables = nextState.tables;
		relationships = sanitizeRelationships(nextState.tables, nextState.relationships);
		activeTab = nextState.activeTab;
		sqlCode = nextState.sqlCode;

		await tick();
		isApplyingPersistedState = false;

		if (options.persist) {
			persistDraftState();
		}

		if (isMermaidLoaded && activeTab === 'diagram') {
			await renderDiagram();
		}
	}

	function commitHistorySnapshot() {
		const currentState = captureDraftState();
		const activeEntry = history[historyIndex];

		if (activeEntry && serializeDraftState(activeEntry.state) === serializeDraftState(currentState)) {
			persistDraftState(activeEntry.savedAt);
			return;
		}

		const nextEntry = createHistoryEntry(currentState);
		let nextHistory = historyIndex < history.length - 1
			? history.slice(0, historyIndex + 1)
			: [...history];

		nextHistory = [...nextHistory, nextEntry];
		if (nextHistory.length > DATABASE_HISTORY_LIMIT) {
			nextHistory = nextHistory.slice(-DATABASE_HISTORY_LIMIT);
		}
		history = nextHistory;
		historyIndex = nextHistory.length - 1;
		persistDraftState(nextEntry.savedAt);
	}

	async function restorePersistedDraft() {
		if (!browser) return;

		try {
			const raw = localStorage.getItem(DATABASE_STORAGE_KEY);
			if (!raw) {
				persistDraftState(initialHistoryEntry.savedAt);
				return;
			}

			const parsed = normalizePersistedDraft(JSON.parse(raw));
			if (!parsed) {
				persistDraftState(initialHistoryEntry.savedAt);
				return;
			}

			history = parsed.history;
			historyIndex = parsed.historyIndex;
			lastSavedAt = parsed.updatedAt;
			restoredFromDraft = true;

			await applyDraftState(parsed.currentState, {
				skipHistoryCommit: true,
				persist: true
			});
		} catch {
			persistDraftState(initialHistoryEntry.savedAt);
		} finally {
			hasHydratedDraft = true;
		}
	}

	function switchTab(tab: DesignerTab) {
		activeTab = tab;
	}

	function addTableAction() {
		tables = addTable(tables);
	}

	function removeTableAction(tableId: string) {
		const nextState = removeTable(tables, relationships, tableId);
		tables = nextState.tables;
		relationships = nextState.relationships;
	}

	function addColumnAction(tableId: string) {
		tables = addColumn(tables, tableId);
	}

	function removeColumnAction(tableId: string, columnId: string) {
		const nextState = removeColumn(tables, relationships, tableId, columnId);
		tables = nextState.tables;
		relationships = nextState.relationships;
	}

	function addRelationshipAction() {
		relationships = addRelationship(tables, relationships);
	}

	function removeRelationshipAction(relationshipId: string) {
		relationships = removeRelationship(relationships, relationshipId);
	}

	function setRelationshipTable(relationship: Relationship, side: 'from' | 'to', tableId: string) {
		const columns = getColumnsForTable(tables, tableId);
		const fallbackColumnId = columns[0]?.id ?? '';

		if (side === 'from') {
			relationship.fromTableId = tableId;
			relationship.fromColumnId = columns.some((column) => column.id === relationship.fromColumnId)
				? relationship.fromColumnId
				: fallbackColumnId;
			return;
		}

		relationship.toTableId = tableId;
		relationship.toColumnId = columns.some((column) => column.id === relationship.toColumnId)
			? relationship.toColumnId
			: fallbackColumnId;
	}

	function regenerateSqlFromSchemaAction() {
		sqlCode = generateSqlFromSchema(tables, relationships);
		activeTab = 'sql';
	}

	function parseSql() {
		try {
			const parsed = parseSqlToSchema(sqlCode);
			if (!parsed.tables.length) {
				alert(t.invalidSqlNotFound);
				return;
			}

			tables = parsed.tables;
			relationships = parsed.relationships;
			activeTab = 'designer';
		} catch {
			alert(t.invalidSqlParse);
		}
	}

	async function undo() {
		if (!canUndo) return;

		historyIndex -= 1;
		const entry = history[historyIndex];
		await applyDraftState(entry.state, {
			skipHistoryCommit: true,
			persist: true
		});
	}

	async function redo() {
		if (!canRedo) return;

		historyIndex += 1;
		const entry = history[historyIndex];
		await applyDraftState(entry.state, {
			skipHistoryCommit: true,
			persist: true
		});
	}

	async function clearDraft() {
		if (!browser) return;

		const shouldReset = window.confirm(
			t.clearDraftConfirm
		);
		if (!shouldReset) return;

		const freshState = createDefaultDraftState();
		const freshEntry = createHistoryEntry(freshState);

		history = [freshEntry];
		historyIndex = 0;
		lastSavedAt = freshEntry.savedAt;
		restoredFromDraft = false;

		try {
			localStorage.removeItem(DATABASE_STORAGE_KEY);
		} catch {
			// Ignore storage removal errors.
		}

		await applyDraftState(freshState, {
			skipHistoryCommit: true,
			persist: true
		});
	}

	async function copySqlToClipboard() {
		try {
			await navigator.clipboard.writeText(sqlCode);
			alert(t.sqlCopied);
		} catch {
			alert(t.sqlCopyFailed);
		}
	}

	async function renderDiagram() {
		if (!mermaidContainer || !isMermaidLoaded) return;

		mermaidError = '';

		const mermaid = getMermaid();
		if (!mermaid) return;

		const currentId = `db-diagram-${++renderCounter}`;

		try {
			const { svg } = await mermaid.render(currentId, diagramCode);
			if (mermaidContainer) {
				mermaidContainer.innerHTML = svg;
				const svgElement = mermaidContainer.querySelector('svg');
				if (svgElement) {
					svgElement.style.maxWidth = '100%';
					svgElement.style.height = 'auto';
				}
			}
		} catch (error: unknown) {
			mermaidError = error instanceof Error ? error.message : t.diagramRenderFailed;
			const failedElement = document.getElementById('d' + currentId);
			if (failedElement) failedElement.remove();
		}
	}

	onMount(() => {
		restorePersistedDraft();

		if (!getMermaid()) {
			const script = document.createElement('script');
			script.src = 'https://cdn.jsdelivr.net/npm/mermaid@11/dist/mermaid.min.js';
			script.onload = async () => {
				getMermaid()?.initialize({
					startOnLoad: false,
					theme: document.documentElement.classList.contains('dark') ? 'dark' : 'default',
					securityLevel: 'loose',
					fontFamily: 'Inter, sans-serif'
				});
				isMermaidLoaded = true;
				await tick();
				renderDiagram();
			};
			document.head.appendChild(script);
		} else {
			isMermaidLoaded = true;
			tick().then(() => renderDiagram());
		}

		return () => {
			if (historyDebounceTimer) clearTimeout(historyDebounceTimer);
			if (renderDebounceTimer) clearTimeout(renderDebounceTimer);
		};
	});

	$effect(() => {
		const currentTables = tables;
		const currentRelationships = relationships;
		const currentTab = activeTab;
		const currentSqlCode = sqlCode;
		const currentDiagramCode = diagramCode;

		if (isApplyingPersistedState || !hasHydratedDraft) return;

		const sanitizedRelationships = sanitizeRelationships(currentTables, currentRelationships);
		if (sanitizedRelationships.length !== currentRelationships.length) {
			relationships = sanitizedRelationships;
			return;
		}

		const shouldSkipHistoryCommit = skipNextHistoryCommit;
		skipNextHistoryCommit = false;

		untrack(() => persistDraftState());

		if (historyDebounceTimer) clearTimeout(historyDebounceTimer);
		if (renderDebounceTimer) clearTimeout(renderDebounceTimer);

		if (!shouldSkipHistoryCommit) {
			historyDebounceTimer = setTimeout(() => {
				void currentTables;
				void currentRelationships;
				void currentTab;
				void currentSqlCode;
				commitHistorySnapshot();
			}, 450);
		}

		if (currentTab === 'diagram') {
			renderDebounceTimer = setTimeout(() => {
				void currentDiagramCode;
				renderDiagram();
			}, 250);
		}

		return () => {
			if (historyDebounceTimer) clearTimeout(historyDebounceTimer);
			if (renderDebounceTimer) clearTimeout(renderDebounceTimer);
		};
	});
</script>

<div class="glass-panel w-full overflow-hidden rounded-[2.5rem] shadow-2xl p-1 relative min-h-[700px]">
	<div class="bg-surface/80 relative z-10 w-full rounded-[2.4rem] backdrop-blur-3xl p-6 sm:p-8 flex flex-col gap-8">
		<div class="flex flex-col gap-4 bg-white/60 dark:bg-black/40 p-4 rounded-3xl border-2 border-primary/30 backdrop-blur-md shadow-xl">
			<div class="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
				<div class="flex flex-wrap items-center gap-1 p-1 bg-slate-300 dark:bg-white/10 rounded-2xl">
					<button
						class="px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all {activeTab === 'designer' ? 'bg-white dark:bg-slate-800 text-primary shadow-md scale-105' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'}"
						onclick={() => switchTab('designer')}
					>
						{t.tabs.designer}
					</button>
					<button
						class="px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all {activeTab === 'diagram' ? 'bg-white dark:bg-slate-800 text-primary shadow-md scale-105' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'}"
						onclick={() => switchTab('diagram')}
					>
						{t.tabs.diagram}
					</button>
					<button
						class="px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all {activeTab === 'sql' ? 'bg-white dark:bg-slate-800 text-primary shadow-md scale-105' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'}"
						onclick={() => switchTab('sql')}
					>
						{t.tabs.sql}
					</button>
				</div>

				<div class="flex flex-wrap items-center gap-2">
					<button
						onclick={undo}
						class="ui-btn bg-[var(--ui-bg-muted)] border border-[var(--ui-border)] !h-11 !px-4 !text-xs gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed"
						disabled={!canUndo}
						>
							<span class="material-symbols-outlined text-sm">undo</span>
							{t.undo}
						</button>
					<button
						onclick={redo}
						class="ui-btn bg-[var(--ui-bg-muted)] border border-[var(--ui-border)] !h-11 !px-4 !text-xs gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed"
						disabled={!canRedo}
						>
							<span class="material-symbols-outlined text-sm">redo</span>
							{t.redo}
						</button>
					<button
						onclick={clearDraft}
						class="ui-btn bg-transparent border border-[var(--ui-border)] !h-11 !px-4 !text-xs gap-1.5 hover:border-red-400 hover:text-red-500 transition-colors"
						>
							<span class="material-symbols-outlined text-sm">delete_sweep</span>
							{t.clearDraft}
						</button>
				</div>
			</div>

				<div class="flex flex-wrap items-center gap-2 text-[0.65rem] font-bold uppercase tracking-widest">
					<span class="rounded-full bg-primary/10 px-3 py-1 text-primary">
						{restoredFromDraft ? t.draftRestored : t.draftAutosave}
					</span>
					<span class="rounded-full bg-slate-100 px-3 py-1 text-slate-500 dark:bg-white/5 dark:text-slate-300">
						{t.historyLabel}: {historySummary}
					</span>
					<span class="rounded-full bg-slate-100 px-3 py-1 text-slate-500 dark:bg-white/5 dark:text-slate-300">
						{t.tablesLabel}: {tableCount}
					</span>
					<span class="rounded-full bg-slate-100 px-3 py-1 text-slate-500 dark:bg-white/5 dark:text-slate-300">
						{t.relationshipsLabel}: {relationshipCount}
					</span>
					{#if savedAtLabel}
						<span class="rounded-full bg-slate-100 px-3 py-1 text-slate-500 dark:bg-white/5 dark:text-slate-300">
							{t.lastSavedAt}: {savedAtLabel}
						</span>
					{/if}
				</div>

			<div class="flex flex-wrap items-center gap-3">
				{#if activeTab === 'designer'}
					<button onclick={addTableAction} class="ui-btn ui-btn-primary !h-12 !px-6 !text-[0.8rem] gap-2 shadow-2xl shadow-primary/30 font-black border-2 border-white/20">
						<span class="material-symbols-outlined text-xl">add_box</span>
						{t.addTable}
					</button>
					<button onclick={addRelationshipAction} class="ui-btn bg-white dark:bg-slate-800 !h-12 !px-6 !text-[0.8rem] gap-2 border-2 border-primary/40 hover:bg-primary/10 transition-all font-black text-slate-900 dark:text-white">
						<span class="material-symbols-outlined text-xl">schema</span>
						{t.addRelationship}
					</button>
					<button onclick={regenerateSqlFromSchemaAction} class="ui-btn bg-white dark:bg-slate-800 !h-12 !px-6 !text-[0.8rem] gap-2 border-2 border-primary/20 hover:border-primary/40 transition-all font-black text-slate-900 dark:text-white">
						<span class="material-symbols-outlined text-xl">code_blocks</span>
						{t.viewSqlFromDesigner}
					</button>
				{:else if activeTab === 'sql'}
					<button onclick={parseSql} class="ui-btn ui-btn-primary !h-12 !px-6 !text-[0.8rem] gap-2 shadow-2xl shadow-primary/30 font-black border-2 border-white/20">
						<span class="material-symbols-outlined text-xl">sync_alt</span>
						{t.syncFromSql}
					</button>
					<button onclick={regenerateSqlFromSchemaAction} class="ui-btn bg-white dark:bg-slate-800 !h-12 !px-6 !text-[0.8rem] gap-2 border-2 border-primary/20 hover:border-primary/40 transition-all font-black text-slate-900 dark:text-white">
						<span class="material-symbols-outlined text-xl">refresh</span>
						{t.regenerateSql}
					</button>
					<button onclick={copySqlToClipboard} class="ui-btn bg-white dark:bg-slate-800 !h-12 !px-6 !text-[0.8rem] gap-2 border-2 border-primary/20 hover:border-primary/40 transition-all font-black text-slate-900 dark:text-white">
						<span class="material-symbols-outlined text-xl">content_copy</span>
						{t.copySql}
					</button>
				{/if}
			</div>
		</div>

		<div class="flex-1 overflow-auto max-h-[1200px] custom-scrollbar">
			{#if activeTab === 'designer'}
				<div class="flex flex-col gap-10" in:fade>
					<div class="grid md:grid-cols-2 xl:grid-cols-3 gap-8">
						{#each tables as table (table.id)}
							<div class="bg-white dark:bg-slate-950/60 rounded-[2.4rem] border-2 border-primary/30 p-6 sm:p-7 flex flex-col gap-6 shadow-xl group hover:shadow-2xl hover:border-primary/60 transition-all duration-500 hover:-translate-y-1">
								<div class="flex justify-between items-center border-b border-primary/15 pb-4 gap-4">
									<div class="flex items-center gap-3 min-w-0 flex-1">
										<span class="material-symbols-outlined text-primary text-2xl font-black shrink-0">table_chart</span>
										<input
											bind:value={table.name}
											class="bg-transparent font-black tracking-tight text-2xl outline-none focus:text-primary w-full min-w-0 text-slate-900 dark:text-white"
											placeholder={t.tableNamePlaceholder}
										/>
									</div>
									<button
										onclick={() => removeTableAction(table.id)}
										class="size-10 flex items-center justify-center rounded-2xl bg-red-50 dark:bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-all active:scale-90 shadow-md border border-red-200 dark:border-red-500/20 shrink-0"
										title={t.removeTableTitle}
									>
										<span class="material-symbols-outlined text-xl font-bold">delete_forever</span>
									</button>
								</div>

								<div class="flex flex-col gap-4">
									{#each table.columns as column (column.id)}
										<div class="rounded-[1.6rem] bg-slate-100/90 dark:bg-white/[0.04] border border-slate-200 dark:border-white/10 p-4 flex flex-col gap-3 group/col hover:border-primary/50 transition-all">
											<div class="flex items-center gap-3">
												<div class="flex-1 min-w-0">
													<span class="mb-1 block text-[0.62rem] font-bold uppercase tracking-[0.18em] text-slate-400 dark:text-slate-500">
														{t.columnNameLabel}
													</span>
													<input
														bind:value={column.name}
														class="w-full rounded-xl border border-slate-300/80 dark:border-white/10 bg-white/90 dark:bg-slate-900/70 px-3 py-2.5 text-sm font-bold text-slate-900 dark:text-slate-100 outline-none transition-all focus:border-primary/60 focus:ring-4 focus:ring-primary/15"
														placeholder={t.columnNamePlaceholder}
														aria-label={t.columnNameLabel}
													/>
												</div>
												<button
													onclick={() => removeColumnAction(table.id, column.id)}
													class="mt-5 size-10 shrink-0 rounded-xl border border-slate-300 dark:border-white/10 text-slate-400 hover:text-red-500 hover:border-red-300 dark:hover:border-red-500/30 transition-colors"
													title={t.removeColumnTitle}
												>
													<span class="material-symbols-outlined text-xl">cancel</span>
												</button>
											</div>

											<div class="flex flex-wrap items-center gap-2">
												<select
													bind:value={column.type}
													class="min-w-[140px] rounded-xl border border-slate-300/80 dark:border-white/10 bg-white/90 dark:bg-slate-900/70 px-3 py-2 text-[0.72rem] font-mono font-black uppercase tracking-wide text-primary outline-none transition-all focus:border-primary/60 focus:ring-4 focus:ring-primary/15 cursor-pointer"
													aria-label={t.columnTypeLabel}
												>
													{#each SQL_DATA_TYPES as type}
														<option value={type}>{type}</option>
													{/each}
												</select>

												<button
													onclick={() => {
														column.pk = !column.pk;
														if (column.pk) {
															column.nullable = false;
														}
													}}
													class="inline-flex items-center gap-1.5 rounded-xl border px-3 py-2 text-[0.68rem] font-black uppercase tracking-[0.16em] transition-all
														{column.pk
															? 'border-amber-300 bg-amber-50 text-amber-600 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-400'
															: 'border-slate-300 bg-white/80 text-slate-500 hover:border-amber-300 hover:text-amber-500 dark:border-white/10 dark:bg-slate-900/50 dark:text-slate-400'}"
													title={t.primaryKeyStatus}
												>
													<span class="material-symbols-outlined text-base font-bold">vpn_key</span>
													{t.primaryKey}
												</button>
												<button
													onclick={() => {
														if (!column.pk) {
															column.nullable = !column.nullable;
														}
													}}
													class="inline-flex items-center gap-1.5 rounded-xl border px-3 py-2 text-[0.68rem] font-black uppercase tracking-[0.16em] transition-all disabled:opacity-50
														{column.nullable
															? 'border-emerald-300 bg-emerald-50 text-emerald-600 dark:border-emerald-500/30 dark:bg-emerald-500/10 dark:text-emerald-400'
															: 'border-slate-300 bg-white/80 text-slate-500 hover:border-emerald-300 hover:text-emerald-500 dark:border-white/10 dark:bg-slate-900/50 dark:text-slate-400'}"
													title={t.nullableStatus}
													disabled={column.pk}
												>
													<span class="material-symbols-outlined text-base font-bold">question_mark</span>
													{t.nullable}
												</button>

												<span class="ml-auto rounded-full bg-slate-200/70 dark:bg-white/5 px-2.5 py-1 text-[0.62rem] font-bold uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">
													{column.pk ? t.primaryKeyStatus : column.nullable ? t.nullableStatus : t.requiredStatus}
												</span>
											</div>
										</div>
									{/each}
								</div>

								<button onclick={() => addColumnAction(table.id)} class="text-[0.72rem] font-black uppercase text-primary tracking-[0.2em] flex items-center justify-center gap-2 p-4 rounded-2xl border border-dashed border-primary/30 hover:border-primary hover:bg-primary/5 transition-all">
									<span class="material-symbols-outlined text-xl">add_circle</span>
									{t.addColumn}
								</button>
							</div>
						{/each}
					</div>

					{#if relationships.length > 0}
						<div class="bg-primary/5 rounded-[3.5rem] p-10 border-2 border-primary/30 shadow-inner">
							<h3 class="text-[0.8rem] font-black uppercase tracking-[0.3em] text-primary mb-8 flex items-center gap-3">
								<span class="material-symbols-outlined text-2xl">hub</span>
								{t.relationshipsTitle}
							</h3>
							<div class="grid gap-6">
								{#each relationships as relationship (relationship.id)}
									<div class="flex flex-wrap items-center gap-6 bg-white dark:bg-black/60 p-6 rounded-[2rem] text-[0.9rem] font-black shadow-xl border-2 border-primary/20">
										<div class="flex items-center gap-3 px-5 py-2 bg-slate-100 dark:bg-white/5 rounded-xl border-2 border-slate-200 dark:border-white/10">
											<select
												value={relationship.fromTableId}
												onchange={(event) =>
													setRelationshipTable(
														relationship,
														'from',
														(event.currentTarget as HTMLSelectElement).value
													)}
												class="bg-transparent outline-none text-slate-900 dark:text-white"
											>
												{#each tables as candidateTable}
													<option value={candidateTable.id}>{candidateTable.name}</option>
												{/each}
											</select>
											<span class="text-primary font-black">→</span>
											<select bind:value={relationship.fromColumnId} class="bg-transparent text-primary outline-none">
												{#each getColumnsForTable(tables, relationship.fromTableId) as candidateColumn}
													<option value={candidateColumn.id}>{candidateColumn.name}</option>
												{/each}
											</select>
										</div>

										<div class="px-6 py-2 bg-primary text-white rounded-full text-[0.7rem] font-black shadow-xl shadow-primary/30 border-2 border-white/20">
											<select bind:value={relationship.type} class="bg-transparent outline-none uppercase tracking-widest">
												<option value="1:1">{t.relationOptions.oneToOne}</option>
												<option value="1:N">{t.relationOptions.oneToMany}</option>
												<option value="N:1">{t.relationOptions.manyToOne}</option>
											</select>
										</div>

										<span class="text-[0.7rem] font-black uppercase tracking-widest text-slate-400">{t.referencesLabel}</span>

										<div class="flex items-center gap-3 px-5 py-2 bg-emerald-500/5 rounded-xl border-2 border-emerald-500/30">
											<select
												value={relationship.toTableId}
												onchange={(event) =>
													setRelationshipTable(
														relationship,
														'to',
														(event.currentTarget as HTMLSelectElement).value
													)}
												class="bg-transparent outline-none text-emerald-600 dark:text-emerald-400"
											>
												{#each tables as candidateTable}
													<option value={candidateTable.id}>{candidateTable.name}</option>
												{/each}
											</select>
											<span class="text-emerald-500 font-black">.</span>
											<select bind:value={relationship.toColumnId} class="bg-transparent outline-none text-emerald-600 dark:text-emerald-400">
												{#each getColumnsForTable(tables, relationship.toTableId) as candidateColumn}
													<option value={candidateColumn.id}>{candidateColumn.name}</option>
												{/each}
											</select>
										</div>

										<button onclick={() => removeRelationshipAction(relationship.id)} class="ml-auto size-12 flex items-center justify-center rounded-2xl bg-red-50 dark:bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-all shadow-md border border-red-200 dark:border-red-500/20">
											<span class="material-symbols-outlined text-2xl">link_off</span>
										</button>
									</div>
								{/each}
							</div>
						</div>
					{/if}
				</div>
			{:else if activeTab === 'diagram'}
				<div class="flex flex-col gap-6 min-h-[600px]" in:fade>
					{#if tables.length === 0}
						<div class="flex-1 flex items-center justify-center">
							<div class="text-center opacity-40">
								<span class="material-symbols-outlined text-[8rem] text-primary">analytics</span>
								<p class="mt-8 font-black tracking-[0.4em] uppercase text-sm">{t.emptyDiagram}</p>
							</div>
						</div>
					{:else}
						<div class="flex-1 rounded-[3rem] border-2 border-primary/20 bg-white/40 dark:bg-black/20 overflow-auto shadow-inner p-8 relative">
							{#if mermaidError}
								<div class="absolute inset-0 flex items-center justify-center bg-red-50/80 dark:bg-red-950/30 backdrop-blur-sm rounded-[3rem] p-6">
									<div class="text-center max-w-md">
										<span class="material-symbols-outlined text-4xl text-red-400 mb-3">schema</span>
										<p class="text-sm text-red-600 dark:text-red-400 font-medium mb-1">{t.diagramErrorTitle}</p>
										<p class="text-xs text-red-500/70 dark:text-red-400/60 font-mono break-all leading-relaxed">{mermaidError}</p>
									</div>
								</div>
							{/if}
							<div bind:this={mermaidContainer} class="w-full h-full flex items-center justify-center diagram-output"></div>
						</div>
					{/if}
				</div>
			{:else if activeTab === 'sql'}
				<div class="flex flex-col gap-10 h-full" in:fade>
					<div class="relative group">
						<div class="absolute -inset-2 bg-gradient-to-r from-primary/40 to-blue-600/40 blur-xl opacity-100 transition duration-1000 group-hover:duration-200"></div>
						<textarea
							bind:value={sqlCode}
							class="relative w-full h-[850px] bg-slate-950/95 backdrop-blur-3xl text-blue-50 p-12 font-mono text-lg rounded-[3rem] border-2 border-white/30 outline-none focus:ring-8 focus:ring-primary/20 transition-all custom-scrollbar leading-relaxed shadow-2xl"
							spellcheck="false"
						></textarea>
					</div>
					<div class="p-8 bg-white dark:bg-slate-900 border-2 border-primary/40 rounded-[3rem] flex gap-8 items-center shadow-2xl">
						<div class="size-20 rounded-[2rem] bg-primary/20 flex items-center justify-center shrink-0 border-2 border-primary/30">
							<span class="material-symbols-outlined text-primary text-5xl font-black">tips_and_updates</span>
						</div>
						<div class="flex flex-col gap-2">
							<h4 class="text-primary font-black uppercase tracking-[0.3em] text-sm">{t.sqlWorkflowTitle}</h4>
							<p class="text-[1rem] text-slate-700 dark:text-slate-300 leading-relaxed font-bold">{t.sqlWorkflowDescription}</p>
						</div>
					</div>
				</div>
			{/if}
		</div>
	</div>

	<div class="absolute -right-20 -top-20 size-80 rounded-full bg-primary/5 blur-[100px] pointer-events-none"></div>
</div>

<style>
	.custom-scrollbar::-webkit-scrollbar {
		width: 10px;
		height: 10px;
	}

	.custom-scrollbar::-webkit-scrollbar-thumb {
		background-color: var(--ui-primary);
		border: 2px solid transparent;
		background-clip: padding-box;
		border-radius: 9999px;
	}

	:global(.diagram-output svg) {
		max-width: 100%;
		height: auto;
	}
</style>
