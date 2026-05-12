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

	function isDarkMode(): boolean {
		return document.documentElement.classList.contains('dark');
	}

	function getMermaidPalette() {
		const dark = isDarkMode();

		return {
			background: dark ? '#08111f' : '#f8fbff',
			text: dark ? '#e2e8f0' : '#0f172a',
			line: dark ? '#93c5fd' : '#2563eb',
			primaryFill: dark ? '#1e3a8a' : '#dbeafe',
			primaryBorder: dark ? '#60a5fa' : '#2563eb',
			secondaryFill: dark ? '#134e4a' : '#ccfbf1',
			secondaryBorder: dark ? '#14b8a6' : '#0f766e',
			tertiaryFill: dark ? '#78350f' : '#fef3c7',
			tertiaryBorder: dark ? '#f59e0b' : '#d97706',
			edgeLabelBackground: dark ? '#0f172a' : '#ffffff'
		};
	}

	function getMermaidConfig(): Record<string, unknown> {
		const dark = isDarkMode();
		const palette = getMermaidPalette();

		return {
			startOnLoad: false,
			theme: 'base',
			securityLevel: 'loose',
			fontFamily: 'Inter, sans-serif',
			themeVariables: {
				background: palette.background,
				primaryColor: palette.primaryFill,
				primaryTextColor: palette.text,
				primaryBorderColor: palette.primaryBorder,
				secondaryColor: palette.secondaryFill,
				secondaryTextColor: palette.text,
				secondaryBorderColor: palette.secondaryBorder,
				tertiaryColor: palette.tertiaryFill,
				tertiaryTextColor: palette.text,
				tertiaryBorderColor: palette.tertiaryBorder,
				lineColor: palette.line,
				defaultLinkColor: palette.line,
				textColor: palette.text,
				nodeTextColor: palette.text,
				mainBkg: palette.background,
				edgeLabelBackground: palette.edgeLabelBackground,
				clusterBkg: dark ? '#0f172a' : '#eff6ff',
				clusterBorder: dark ? '#38bdf8' : '#2563eb',
				actorBorder: palette.primaryBorder,
				actorBkg: palette.primaryFill,
				actorTextColor: palette.text
			}
		};
	}

	function enhanceRenderedSvg(svgEl: SVGSVGElement) {
		const palette = getMermaidPalette();

		svgEl.style.maxWidth = '100%';
		svgEl.style.height = 'auto';
		svgEl.style.display = 'block';
		svgEl.style.fontFamily = 'Inter, sans-serif';
		svgEl.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
		svgEl.setAttribute('preserveAspectRatio', 'xMidYMid meet');

		let backgroundRect = svgEl.querySelector('[data-portfolio-db-bg="true"]') as SVGRectElement | null;
		if (!backgroundRect) {
			backgroundRect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
			backgroundRect.setAttribute('data-portfolio-db-bg', 'true');
			backgroundRect.setAttribute('x', '0');
			backgroundRect.setAttribute('y', '0');
			backgroundRect.setAttribute('width', '100%');
			backgroundRect.setAttribute('height', '100%');
			backgroundRect.setAttribute('rx', '22');
			svgEl.insertBefore(backgroundRect, svgEl.firstChild);
		}
		backgroundRect.setAttribute('fill', palette.background);

		let styleNode = svgEl.querySelector('style[data-portfolio-db-style="true"]') as SVGStyleElement | null;
		if (!styleNode) {
			styleNode = document.createElementNS('http://www.w3.org/2000/svg', 'style') as unknown as SVGStyleElement;
			styleNode.setAttribute('data-portfolio-db-style', 'true');
			svgEl.insertBefore(styleNode, backgroundRect.nextSibling);
		}

		styleNode.textContent = `
			text, tspan {
				font-family: Inter, sans-serif;
			}

			.label, .nodeLabel, .edgeLabel {
				fill: ${palette.text} !important;
				color: ${palette.text} !important;
				font-weight: 600;
			}

			.edgeLabel rect, .labelBkg {
				fill: ${palette.edgeLabelBackground} !important;
				opacity: 1 !important;
				stroke: ${palette.primaryBorder} !important;
			}
		`;
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
			mermaid.initialize(getMermaidConfig());
			const { svg } = await mermaid.render(currentId, diagramCode);
			if (mermaidContainer) {
				mermaidContainer.innerHTML = svg;
				const svgElement = mermaidContainer.querySelector('svg');
				if (svgElement instanceof SVGSVGElement) {
					enhanceRenderedSvg(svgElement);
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
				getMermaid()?.initialize(getMermaidConfig());
				isMermaidLoaded = true;
				await tick();
				renderDiagram();
			};
			document.head.appendChild(script);
		} else {
			getMermaid()?.initialize(getMermaidConfig());
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

<div class="glass-panel relative min-h-[620px] w-full overflow-hidden rounded-[2rem] p-px shadow-xl">
	<div class="bg-surface/80 relative z-10 flex w-full flex-col gap-6 rounded-[1.85rem] p-4 backdrop-blur-3xl sm:p-5 lg:p-6">
		<div class="flex flex-col gap-4 rounded-[1.4rem] border border-primary/20 bg-white/70 p-3.5 shadow-sm backdrop-blur-md dark:bg-black/30 sm:p-4">
			<div class="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
				<div class="flex flex-wrap items-center gap-1 rounded-[1.05rem] bg-slate-200/90 p-1 dark:bg-white/10">
					<button
						class="rounded-[0.9rem] px-4 py-2 text-[0.68rem] font-black uppercase tracking-[0.18em] transition-all {activeTab === 'designer' ? 'bg-white dark:bg-slate-800 text-primary shadow-md' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'}"
						onclick={() => switchTab('designer')}
					>
						{t.tabs.designer}
					</button>
					<button
						class="rounded-[0.9rem] px-4 py-2 text-[0.68rem] font-black uppercase tracking-[0.18em] transition-all {activeTab === 'diagram' ? 'bg-white dark:bg-slate-800 text-primary shadow-md' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'}"
						onclick={() => switchTab('diagram')}
					>
						{t.tabs.diagram}
					</button>
					<button
						class="rounded-[0.9rem] px-4 py-2 text-[0.68rem] font-black uppercase tracking-[0.18em] transition-all {activeTab === 'sql' ? 'bg-white dark:bg-slate-800 text-primary shadow-md' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'}"
						onclick={() => switchTab('sql')}
					>
						{t.tabs.sql}
					</button>
				</div>

				<div class="flex flex-wrap items-center gap-2">
					<button
						onclick={undo}
						class="ui-btn gap-1.5 border border-[var(--ui-border)] bg-[var(--ui-bg-muted)] !h-9 !px-3 !text-[0.72rem] disabled:cursor-not-allowed disabled:opacity-50"
						disabled={!canUndo}
						>
							<span class="material-symbols-outlined text-sm">undo</span>
							{t.undo}
						</button>
					<button
						onclick={redo}
						class="ui-btn gap-1.5 border border-[var(--ui-border)] bg-[var(--ui-bg-muted)] !h-9 !px-3 !text-[0.72rem] disabled:cursor-not-allowed disabled:opacity-50"
						disabled={!canRedo}
						>
							<span class="material-symbols-outlined text-sm">redo</span>
							{t.redo}
						</button>
					<button
						onclick={clearDraft}
						class="ui-btn gap-1.5 border border-[var(--ui-border)] bg-transparent !h-9 !px-3 !text-[0.72rem] transition-colors hover:border-red-400 hover:text-red-500"
						>
							<span class="material-symbols-outlined text-sm">delete_sweep</span>
							{t.clearDraft}
						</button>
				</div>
			</div>

				<div class="flex flex-wrap items-center gap-2 text-[0.64rem] font-bold uppercase tracking-[0.18em]">
					<span class="rounded-full bg-primary/10 px-2.5 py-1 text-primary">
						{restoredFromDraft ? t.draftRestored : t.draftAutosave}
					</span>
					<span class="rounded-full bg-slate-100 px-2.5 py-1 text-slate-500 dark:bg-white/5 dark:text-slate-300">
						{t.historyLabel}: {historySummary}
					</span>
					<span class="rounded-full bg-slate-100 px-2.5 py-1 text-slate-500 dark:bg-white/5 dark:text-slate-300">
						{t.tablesLabel}: {tableCount}
					</span>
					<span class="rounded-full bg-slate-100 px-2.5 py-1 text-slate-500 dark:bg-white/5 dark:text-slate-300">
						{t.relationshipsLabel}: {relationshipCount}
					</span>
					{#if savedAtLabel}
						<span class="rounded-full bg-slate-100 px-2.5 py-1 text-slate-500 dark:bg-white/5 dark:text-slate-300">
							{t.lastSavedAt}: {savedAtLabel}
						</span>
					{/if}
				</div>

			<div class="flex flex-wrap items-center gap-2.5">
				{#if activeTab === 'designer'}
					<button onclick={addTableAction} class="ui-btn ui-btn-primary gap-2 border border-white/20 !h-10 !px-4 !text-[0.72rem] shadow-lg shadow-primary/20">
						<span class="material-symbols-outlined text-lg">add_box</span>
						{t.addTable}
					</button>
					<button onclick={addRelationshipAction} class="ui-btn gap-2 border border-primary/30 bg-white !h-10 !px-4 !text-[0.72rem] text-slate-900 transition-all hover:bg-primary/10 dark:bg-slate-800 dark:text-white">
						<span class="material-symbols-outlined text-lg">schema</span>
						{t.addRelationship}
					</button>
					<button onclick={regenerateSqlFromSchemaAction} class="ui-btn gap-2 border border-primary/20 bg-white !h-10 !px-4 !text-[0.72rem] text-slate-900 transition-all hover:border-primary/40 dark:bg-slate-800 dark:text-white">
						<span class="material-symbols-outlined text-lg">code_blocks</span>
						{t.viewSqlFromDesigner}
					</button>
				{:else if activeTab === 'sql'}
					<button onclick={parseSql} class="ui-btn ui-btn-primary gap-2 border border-white/20 !h-10 !px-4 !text-[0.72rem] shadow-lg shadow-primary/20">
						<span class="material-symbols-outlined text-lg">sync_alt</span>
						{t.syncFromSql}
					</button>
					<button onclick={regenerateSqlFromSchemaAction} class="ui-btn gap-2 border border-primary/20 bg-white !h-10 !px-4 !text-[0.72rem] text-slate-900 transition-all hover:border-primary/40 dark:bg-slate-800 dark:text-white">
						<span class="material-symbols-outlined text-lg">refresh</span>
						{t.regenerateSql}
					</button>
					<button onclick={copySqlToClipboard} class="ui-btn gap-2 border border-primary/20 bg-white !h-10 !px-4 !text-[0.72rem] text-slate-900 transition-all hover:border-primary/40 dark:bg-slate-800 dark:text-white">
						<span class="material-symbols-outlined text-lg">content_copy</span>
						{t.copySql}
					</button>
				{/if}
			</div>
		</div>

		<div class="custom-scrollbar flex-1 overflow-auto max-h-[980px]">
			{#if activeTab === 'designer'}
				<div class="flex flex-col gap-7" in:fade>
					<div class="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
						{#each tables as table (table.id)}
							<div class="group flex flex-col gap-5 rounded-[1.6rem] border border-primary/20 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-lg dark:bg-slate-950/60">
								<div class="flex items-center justify-between gap-3 border-b border-primary/10 pb-3.5">
									<div class="flex items-center gap-3 min-w-0 flex-1">
										<span class="material-symbols-outlined shrink-0 text-[1.45rem] font-black text-primary">table_chart</span>
										<input
											bind:value={table.name}
											class="min-w-0 w-full bg-transparent text-[1.15rem] font-black tracking-tight text-slate-900 outline-none focus:text-primary dark:text-white"
											placeholder={t.tableNamePlaceholder}
										/>
									</div>
									<button
										onclick={() => removeTableAction(table.id)}
										class="flex size-9 shrink-0 items-center justify-center rounded-xl border border-red-200 bg-red-50 text-red-500 shadow-sm transition-all hover:bg-red-500 hover:text-white active:scale-90 dark:border-red-500/20 dark:bg-red-500/10"
										title={t.removeTableTitle}
									>
										<span class="material-symbols-outlined text-lg font-bold">delete_forever</span>
									</button>
								</div>

								<div class="flex flex-col gap-3.5">
									{#each table.columns as column (column.id)}
										<div class="group/col flex flex-col gap-3 rounded-[1.2rem] border border-slate-200 bg-slate-100/90 p-3.5 transition-all hover:border-primary/40 dark:border-white/10 dark:bg-white/[0.04]">
											<div class="flex items-center gap-3">
												<div class="flex-1 min-w-0">
													<span class="mb-1 block text-[0.6rem] font-bold uppercase tracking-[0.18em] text-slate-400 dark:text-slate-500">
														{t.columnNameLabel}
													</span>
													<input
														bind:value={column.name}
														class="w-full rounded-xl border border-slate-300/80 bg-white/90 px-3 py-2 text-[0.82rem] font-semibold text-slate-900 outline-none transition-all focus:border-primary/60 focus:ring-4 focus:ring-primary/15 dark:border-white/10 dark:bg-slate-900/70 dark:text-slate-100"
														placeholder={t.columnNamePlaceholder}
														aria-label={t.columnNameLabel}
													/>
												</div>
												<button
													onclick={() => removeColumnAction(table.id, column.id)}
													class="mt-5 size-9 shrink-0 rounded-xl border border-slate-300 text-slate-400 transition-colors hover:border-red-300 hover:text-red-500 dark:border-white/10 dark:hover:border-red-500/30"
													title={t.removeColumnTitle}
												>
													<span class="material-symbols-outlined text-lg">cancel</span>
												</button>
											</div>

											<div class="flex flex-wrap items-center gap-2">
												<select
													bind:value={column.type}
													class="min-w-[132px] cursor-pointer rounded-xl border border-slate-300/80 bg-white/90 px-3 py-2 text-[0.68rem] font-mono font-black uppercase tracking-wide text-primary outline-none transition-all focus:border-primary/60 focus:ring-4 focus:ring-primary/15 dark:border-white/10 dark:bg-slate-900/70"
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
													class="inline-flex items-center gap-1.5 rounded-xl border px-2.5 py-1.5 text-[0.65rem] font-black uppercase tracking-[0.16em] transition-all
														{column.pk
															? 'border-amber-300 bg-amber-50 text-amber-600 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-400'
															: 'border-slate-300 bg-white/80 text-slate-500 hover:border-amber-300 hover:text-amber-500 dark:border-white/10 dark:bg-slate-900/50 dark:text-slate-400'}"
													title={t.primaryKeyStatus}
												>
														<span class="material-symbols-outlined text-sm font-bold">vpn_key</span>
														{t.primaryKey}
													</button>
												<button
													onclick={() => {
														if (!column.pk) {
															column.nullable = !column.nullable;
														}
													}}
													class="inline-flex items-center gap-1.5 rounded-xl border px-2.5 py-1.5 text-[0.65rem] font-black uppercase tracking-[0.16em] transition-all disabled:opacity-50
														{column.nullable
															? 'border-emerald-300 bg-emerald-50 text-emerald-600 dark:border-emerald-500/30 dark:bg-emerald-500/10 dark:text-emerald-400'
															: 'border-slate-300 bg-white/80 text-slate-500 hover:border-emerald-300 hover:text-emerald-500 dark:border-white/10 dark:bg-slate-900/50 dark:text-slate-400'}"
													title={t.nullableStatus}
													disabled={column.pk}
												>
														<span class="material-symbols-outlined text-sm font-bold">question_mark</span>
														{t.nullable}
													</button>

													<span class="ml-auto rounded-full bg-slate-200/70 px-2.5 py-1 text-[0.6rem] font-bold uppercase tracking-[0.16em] text-slate-500 dark:bg-white/5 dark:text-slate-400">
														{column.pk ? t.primaryKeyStatus : column.nullable ? t.nullableStatus : t.requiredStatus}
													</span>
												</div>
											</div>
										{/each}
								</div>

								<button onclick={() => addColumnAction(table.id)} class="flex items-center justify-center gap-2 rounded-[1.1rem] border border-dashed border-primary/30 p-3 text-[0.68rem] font-black uppercase tracking-[0.18em] text-primary transition-all hover:border-primary hover:bg-primary/5">
									<span class="material-symbols-outlined text-lg">add_circle</span>
									{t.addColumn}
								</button>
							</div>
						{/each}
					</div>

					{#if relationships.length > 0}
						<div class="rounded-[1.8rem] border border-primary/20 bg-primary/5 p-5 shadow-inner sm:p-6">
							<h3 class="mb-5 flex items-center gap-2.5 text-[0.72rem] font-black uppercase tracking-[0.24em] text-primary">
								<span class="material-symbols-outlined text-xl">hub</span>
								{t.relationshipsTitle}
							</h3>
							<div class="grid gap-4">
								{#each relationships as relationship (relationship.id)}
									<div class="flex flex-wrap items-center gap-4 rounded-[1.3rem] border border-primary/20 bg-white p-4 text-[0.82rem] font-bold shadow-sm dark:bg-black/60">
										<div class="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-100 px-4 py-2 dark:border-white/10 dark:bg-white/5">
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

										<div class="rounded-full border border-white/20 bg-primary px-4 py-1.5 text-[0.64rem] font-black text-white shadow-md shadow-primary/20">
											<select bind:value={relationship.type} class="bg-transparent uppercase tracking-[0.18em] outline-none">
												<option value="1:1">{t.relationOptions.oneToOne}</option>
												<option value="1:N">{t.relationOptions.oneToMany}</option>
												<option value="N:1">{t.relationOptions.manyToOne}</option>
											</select>
										</div>

										<span class="text-[0.64rem] font-black uppercase tracking-[0.18em] text-slate-400">{t.referencesLabel}</span>

										<div class="flex items-center gap-2 rounded-xl border border-emerald-500/30 bg-emerald-500/5 px-4 py-2">
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

										<button onclick={() => removeRelationshipAction(relationship.id)} class="ml-auto flex size-10 items-center justify-center rounded-xl border border-red-200 bg-red-50 text-red-500 shadow-sm transition-all hover:bg-red-500 hover:text-white dark:border-red-500/20 dark:bg-red-500/10">
											<span class="material-symbols-outlined text-xl">link_off</span>
										</button>
									</div>
								{/each}
							</div>
						</div>
					{/if}
				</div>
			{:else if activeTab === 'diagram'}
				<div class="flex min-h-[460px] flex-col gap-5" in:fade>
					{#if tables.length === 0}
						<div class="flex-1 flex items-center justify-center">
							<div class="text-center opacity-40">
								<span class="material-symbols-outlined text-[8rem] text-primary">analytics</span>
								<p class="mt-8 font-black tracking-[0.4em] uppercase text-sm">{t.emptyDiagram}</p>
							</div>
						</div>
					{:else}
						<div class="custom-scrollbar relative flex-1 overflow-auto rounded-[1.8rem] border border-primary/20 bg-white/50 p-5 shadow-inner dark:bg-black/20 sm:p-6">
							{#if mermaidError}
								<div class="absolute inset-0 flex items-center justify-center rounded-[1.8rem] bg-red-50/80 p-6 backdrop-blur-sm dark:bg-red-950/30">
									<div class="text-center max-w-md">
										<span class="material-symbols-outlined text-4xl text-red-400 mb-3">schema</span>
										<p class="text-sm text-red-600 dark:text-red-400 font-medium mb-1">{t.diagramErrorTitle}</p>
										<p class="text-xs text-red-500/70 dark:text-red-400/60 font-mono break-all leading-relaxed">{mermaidError}</p>
									</div>
								</div>
							{/if}
							<div bind:this={mermaidContainer} class="diagram-output flex h-full w-full items-center justify-center"></div>
						</div>
					{/if}
				</div>
			{:else if activeTab === 'sql'}
				<div class="flex h-full flex-col gap-6" in:fade>
					<div class="group relative">
						<div class="absolute -inset-1.5 bg-gradient-to-r from-primary/30 to-cyan-500/30 opacity-90 blur-lg transition duration-700 group-hover:opacity-100"></div>
						<textarea
							bind:value={sqlCode}
							class="custom-scrollbar relative h-[520px] w-full rounded-[1.8rem] border border-white/20 bg-slate-950/95 px-5 py-4 font-mono text-[0.82rem] leading-6 text-blue-50 shadow-xl outline-none transition-all focus:ring-4 focus:ring-primary/20 sm:h-[620px] sm:px-6 sm:py-5"
							spellcheck="false"
						></textarea>
					</div>
					<div class="flex items-center gap-4 rounded-[1.5rem] border border-primary/20 bg-white p-4 shadow-sm dark:bg-slate-900 sm:p-5">
						<div class="flex size-14 shrink-0 items-center justify-center rounded-[1.2rem] border border-primary/20 bg-primary/15">
							<span class="material-symbols-outlined text-3xl font-black text-primary">tips_and_updates</span>
						</div>
						<div class="flex flex-col gap-2">
							<h4 class="text-[0.7rem] font-black uppercase tracking-[0.24em] text-primary">{t.sqlWorkflowTitle}</h4>
							<p class="text-[0.9rem] font-semibold leading-relaxed text-slate-700 dark:text-slate-300">{t.sqlWorkflowDescription}</p>
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

	.diagram-output {
		min-width: min-content;
	}
</style>
