<script lang="ts">
	import { page } from '$app/state';
	import { browser } from '$app/environment';
	import { onMount, tick, untrack } from 'svelte';
	import { getDictionary } from '$lib/i18n/dictionary';
	import { localeFromPathname } from '$lib/i18n/locale';

	type MermaidRenderResult = { svg: string };
	type MermaidInstance = {
		initialize: (config: Record<string, unknown>) => void;
		render: (id: string, code: string) => Promise<MermaidRenderResult>;
	};

	type DiagramHistoryEntry = {
		id: string;
		code: string;
		templateKey: string;
		savedAt: string;
	};

	type PersistedDiagramDraft = {
		version: 1;
		currentCode: string;
		currentTemplateKey: string;
		history: DiagramHistoryEntry[];
		historyIndex: number;
		updatedAt: string;
	};

	type TemplateKey = 'flowchart' | 'sequence' | 'classDiagram' | 'gantt' | 'erDiagram' | 'pie';

	const STORAGE_KEY = 'portfolio-diagram-draft-v1';
	const HISTORY_LIMIT = 60;
	const DEFAULT_MERMAID_CODE = `flowchart TD
    A[Bắt đầu] --> B[Người dùng gửi yêu cầu]
    B --> C[Hệ thống tiếp nhận]
    C --> D[Kiểm tra dữ liệu]
    D -->|Hợp lệ| E[Xử lý yêu cầu]
    D -->|Không hợp lệ| F[Trả về lỗi]
    E --> G[Lưu kết quả]
    G --> H[Phản hồi người dùng]
    F --> H
    H --> I[Kết thúc]`;

	const templates: Record<TemplateKey, { code: string }> = {
		flowchart: {
			code: `flowchart TD
    A[Start] --> B{Is it working?}
    B -->|Yes| C[Great!]
    B -->|No| D[Debug]
    D --> B`
		},
		sequence: {
			code: `sequenceDiagram
    participant Client
    participant Server
    participant Database
    Client->>Server: HTTP Request
    Server->>Database: Query
    Database-->>Server: Result
    Server-->>Client: HTTP Response`
		},
		classDiagram: {
			code: `classDiagram
    class User {
        +String name
        +String email
        +login()
        +logout()
    }
    class Order {
        +int id
        +Date createdAt
        +submit()
    }
    User "1" --> "*" Order : places`
		},
		gantt: {
			code: `gantt
    title Project Timeline
    dateFormat YYYY-MM-DD
    section Planning
        Research       :a1, 2026-01-01, 14d
        Design         :a2, after a1, 10d
    section Development
        Backend API    :b1, after a2, 21d
        Frontend UI    :b2, after a2, 18d
    section Testing
        QA Testing     :c1, after b1, 7d`
		},
		erDiagram: {
			code: `erDiagram
    USER ||--o{ ORDER : places
    ORDER ||--|{ LINE_ITEM : contains
    PRODUCT ||--o{ LINE_ITEM : "ordered in"
    USER {
        int id PK
        string name
        string email
    }
    ORDER {
        int id PK
        date created_at
        string status
    }`
		},
		pie: {
			code: `pie title Technology Usage
    "JavaScript" : 40
    "TypeScript" : 30
    "Python" : 15
    "Go" : 10
    "Other" : 5`
		}
	};

	function createHistoryEntry(
		code: string,
		templateKey: string,
		savedAt = new Date().toISOString()
	): DiagramHistoryEntry {
		return {
			id: browser && typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function'
				? crypto.randomUUID()
				: `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`,
			code,
			templateKey,
			savedAt
		};
	}

	function getMermaid(): MermaidInstance | undefined {
		return (window as Window & { mermaid?: MermaidInstance }).mermaid;
	}

	function isDiagramHistoryEntry(value: unknown): value is DiagramHistoryEntry {
		if (!value || typeof value !== 'object') return false;

		const entry = value as Record<string, unknown>;
		return (
			typeof entry.id === 'string' &&
			typeof entry.code === 'string' &&
			typeof entry.templateKey === 'string' &&
			typeof entry.savedAt === 'string'
		);
	}

	function formatSavedAt(savedAt: string): string {
		const parsed = new Date(savedAt);
		if (Number.isNaN(parsed.getTime())) return '';
		return parsed.toLocaleString();
	}

	function normalizePersistedDraft(raw: unknown): PersistedDiagramDraft | null {
		if (!raw || typeof raw !== 'object') return null;

		const draft = raw as Record<string, unknown>;
		let normalizedHistory = Array.isArray(draft.history)
			? draft.history.filter(isDiagramHistoryEntry)
			: [];

		if (!normalizedHistory.length) {
			normalizedHistory = [createHistoryEntry(DEFAULT_MERMAID_CODE, '')];
		}

		let historyIndex = typeof draft.historyIndex === 'number'
			? Math.trunc(draft.historyIndex)
			: normalizedHistory.length - 1;

		historyIndex = Math.min(Math.max(historyIndex, 0), normalizedHistory.length - 1);

		const currentEntry = normalizedHistory[historyIndex];
		const currentCode = typeof draft.currentCode === 'string' ? draft.currentCode : currentEntry.code;
		const currentTemplateKey =
			typeof draft.currentTemplateKey === 'string' ? draft.currentTemplateKey : currentEntry.templateKey;
		const updatedAt = typeof draft.updatedAt === 'string' ? draft.updatedAt : currentEntry.savedAt;

		if (
			currentEntry.code !== currentCode ||
			currentEntry.templateKey !== currentTemplateKey
		) {
			normalizedHistory = [...normalizedHistory, createHistoryEntry(currentCode, currentTemplateKey, updatedAt)];
			if (normalizedHistory.length > HISTORY_LIMIT) {
				normalizedHistory = normalizedHistory.slice(-HISTORY_LIMIT);
			}
			historyIndex = normalizedHistory.length - 1;
		}

		return {
			version: 1,
			currentCode,
			currentTemplateKey,
			history: normalizedHistory,
			historyIndex,
			updatedAt
		};
	}

	const initialEntry = createHistoryEntry(DEFAULT_MERMAID_CODE, '');

	let mermaidCode = $state(DEFAULT_MERMAID_CODE);
	let selectedTemplate = $state('');
	let previewContainer: HTMLDivElement | undefined = $state();
	let isMermaidLoaded = $state(false);
	let errorMessage = $state('');
	let renderCounter = 0;
	let history = $state<DiagramHistoryEntry[]>([initialEntry]);
	let historyIndex = $state(0);
	let lastSavedAt = $state(initialEntry.savedAt);
	let restoredFromDraft = $state(false);
	let hasHydratedDraft = false;
	let isApplyingPersistedState = false;
	let skipNextHistoryCommit = false;

	let historyDebounceTimer: ReturnType<typeof setTimeout> | undefined;
	let renderDebounceTimer: ReturnType<typeof setTimeout> | undefined;

	const locale = $derived(localeFromPathname(page.url.pathname));
	const t = $derived(getDictionary(locale).tools.diagram.ui);
	const canUndo = $derived(historyIndex > 0);
	const canRedo = $derived(historyIndex < history.length - 1);
	const historySummary = $derived(history.length ? `${historyIndex + 1}/${history.length}` : '0/0');
	const savedAtLabel = $derived(lastSavedAt ? formatSavedAt(lastSavedAt) : '');

	function getTemplateLabel(key: TemplateKey): string {
		return t.templateOptions[key];
	}

	function persistDraftState(updatedAt = new Date().toISOString()) {
		if (!browser) return;

		const payload: PersistedDiagramDraft = {
			version: 1,
			currentCode: mermaidCode,
			currentTemplateKey: selectedTemplate,
			history,
			historyIndex,
			updatedAt
		};

		try {
			localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
			lastSavedAt = updatedAt;
		} catch {
			// Ignore storage write errors and keep the in-memory editor functional.
		}
	}

	async function applyEditorState(
		code: string,
		templateKey: string,
		options: { skipHistoryCommit?: boolean; persist?: boolean } = {}
	) {
		isApplyingPersistedState = true;
		if (options.skipHistoryCommit) {
			skipNextHistoryCommit = true;
		}

		mermaidCode = code;
		selectedTemplate = templateKey;
		await tick();
		isApplyingPersistedState = false;

		if (options.persist) {
			persistDraftState();
		}

		if (isMermaidLoaded) {
			await renderDiagram();
		}
	}

	function commitHistorySnapshot(code: string, templateKey: string) {
		const activeEntry = history[historyIndex];
		if (activeEntry && activeEntry.code === code && activeEntry.templateKey === templateKey) {
			persistDraftState(activeEntry.savedAt);
			return;
		}

		const nextEntry = createHistoryEntry(code, templateKey);
		let nextHistory = historyIndex < history.length - 1
			? history.slice(0, historyIndex + 1)
			: [...history];

		nextHistory = [...nextHistory, nextEntry];
		if (nextHistory.length > HISTORY_LIMIT) {
			nextHistory = nextHistory.slice(-HISTORY_LIMIT);
		}

		history = nextHistory;
		historyIndex = nextHistory.length - 1;
		persistDraftState(nextEntry.savedAt);
	}

	async function restorePersistedDraft() {
		if (!browser) return;

		try {
			const raw = localStorage.getItem(STORAGE_KEY);
			if (!raw) {
				persistDraftState(initialEntry.savedAt);
				hasHydratedDraft = true;
				return;
			}

			const parsed = normalizePersistedDraft(JSON.parse(raw));
			if (!parsed) {
				persistDraftState(initialEntry.savedAt);
				hasHydratedDraft = true;
				return;
			}

			history = parsed.history;
			historyIndex = parsed.historyIndex;
			lastSavedAt = parsed.updatedAt;
			restoredFromDraft = true;
			await applyEditorState(parsed.currentCode, parsed.currentTemplateKey, {
				skipHistoryCommit: true,
				persist: true
			});
		} catch {
			persistDraftState(initialEntry.savedAt);
		} finally {
			hasHydratedDraft = true;
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

	async function renderDiagram() {
		if (!previewContainer || !isMermaidLoaded) return;
		errorMessage = '';

		const mermaid = getMermaid();
		if (!mermaid) return;

		const currentId = `mermaid-preview-${++renderCounter}`;

		try {
			const { svg } = await mermaid.render(currentId, mermaidCode.trim());
			if (previewContainer) {
				previewContainer.innerHTML = svg;

				// Make SVG responsive
				const svgEl = previewContainer.querySelector('svg');
				if (svgEl) {
					svgEl.style.maxWidth = '100%';
					svgEl.style.height = 'auto';
				}
			}
		} catch (err: unknown) {
			errorMessage = err instanceof Error ? err.message : t.invalidSyntax;
			// Clean up failed render element
			const failedEl = document.getElementById('d' + currentId);
			if (failedEl) failedEl.remove();
		}
	}

	function applyTemplate(key: TemplateKey) {
		mermaidCode = templates[key].code;
		selectedTemplate = key;
	}

	async function undo() {
		if (!canUndo) return;

		historyIndex -= 1;
		const entry = history[historyIndex];
		await applyEditorState(entry.code, entry.templateKey, {
			skipHistoryCommit: true,
			persist: true
		});
	}

	async function redo() {
		if (!canRedo) return;

		historyIndex += 1;
		const entry = history[historyIndex];
		await applyEditorState(entry.code, entry.templateKey, {
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

		const freshEntry = createHistoryEntry(DEFAULT_MERMAID_CODE, '');
		history = [freshEntry];
		historyIndex = 0;
		lastSavedAt = freshEntry.savedAt;
		restoredFromDraft = false;

		try {
			localStorage.removeItem(STORAGE_KEY);
		} catch {
			// Ignore storage removal errors.
		}

		await applyEditorState(freshEntry.code, freshEntry.templateKey, {
			skipHistoryCommit: true,
			persist: true
		});
	}

	async function exportPng() {
		if (!previewContainer) return;
		const svgEl = previewContainer.querySelector('svg');
		if (!svgEl) return;

		const svgData = new XMLSerializer().serializeToString(svgEl);
		const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
		const url = URL.createObjectURL(svgBlob);

		const img = new Image();
		img.onload = () => {
			const scale = 2;
			const canvas = document.createElement('canvas');
			canvas.width = img.width * scale;
			canvas.height = img.height * scale;
			const ctx = canvas.getContext('2d')!;
			ctx.fillStyle = '#ffffff';
			ctx.fillRect(0, 0, canvas.width, canvas.height);
			ctx.scale(scale, scale);
			ctx.drawImage(img, 0, 0);
			URL.revokeObjectURL(url);

			const pngUrl = canvas.toDataURL('image/png');
			const link = document.createElement('a');
			link.download = 'diagram.png';
			link.href = pngUrl;
			link.click();
		};
		img.src = url;
	}

	function exportSvg() {
		if (!previewContainer) return;
		const svgEl = previewContainer.querySelector('svg');
		if (!svgEl) return;

		const svgData = new XMLSerializer().serializeToString(svgEl);
		const blob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
		const url = URL.createObjectURL(blob);
		const link = document.createElement('a');
		link.download = 'diagram.svg';
		link.href = url;
		link.click();
		URL.revokeObjectURL(url);
	}

	$effect(() => {
		const currentCode = mermaidCode;
		const currentTemplateKey = selectedTemplate;

		if (isApplyingPersistedState || !hasHydratedDraft) return;

		const shouldSkipHistoryCommit = skipNextHistoryCommit;
		skipNextHistoryCommit = false;

		untrack(() => persistDraftState());

		if (historyDebounceTimer) clearTimeout(historyDebounceTimer);
		if (renderDebounceTimer) clearTimeout(renderDebounceTimer);

		if (!shouldSkipHistoryCommit) {
			historyDebounceTimer = setTimeout(() => {
				commitHistorySnapshot(currentCode, currentTemplateKey);
			}, 450);
		}

		renderDebounceTimer = setTimeout(() => {
			if (isMermaidLoaded) {
				renderDiagram();
			}
		}, 250);

		return () => {
			if (historyDebounceTimer) clearTimeout(historyDebounceTimer);
			if (renderDebounceTimer) clearTimeout(renderDebounceTimer);
		};
	});
</script>

<div class="glass-panel w-full overflow-hidden rounded-[2.5rem] shadow-2xl p-1 relative">
	<div class="bg-surface/80 relative z-10 w-full rounded-[2.4rem] backdrop-blur-3xl p-6 sm:p-8 flex flex-col gap-6">

		{#if !isMermaidLoaded}
			<div class="flex items-center justify-center p-20">
				<span class="material-symbols-outlined animate-spin text-4xl text-primary">progress_activity</span>
			</div>
		{:else}
			<!-- Template chips + Actions -->
			<div class="flex flex-col gap-4 bg-white/50 dark:bg-black/20 p-4 rounded-2xl border border-primary/10">
				<div class="flex flex-wrap items-center justify-between gap-4">
					<div class="flex flex-wrap items-center gap-2">
						<span class="text-[0.65rem] font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400 mr-1">{t.templatesLabel}:</span>
						{#each Object.keys(templates) as key}
							<button
								class="px-3 py-1.5 rounded-full text-[0.7rem] font-bold uppercase tracking-wider transition-all border
									{selectedTemplate === key
										? 'bg-primary text-white border-primary shadow-lg shadow-primary/20'
										: 'bg-white/60 dark:bg-white/5 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-primary/40 hover:text-primary'}"
								onclick={() => applyTemplate(key as TemplateKey)}
							>
								{getTemplateLabel(key as TemplateKey)}
							</button>
						{/each}
					</div>

					<div class="flex flex-wrap items-center gap-2">
						<button
							onclick={undo}
							class="ui-btn bg-[var(--ui-bg-muted)] border border-[var(--ui-border)] !h-9 !px-3 !text-xs gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed"
							disabled={!canUndo}
						>
							<span class="material-symbols-outlined text-sm">undo</span>
							{t.undo}
						</button>
						<button
							onclick={redo}
							class="ui-btn bg-[var(--ui-bg-muted)] border border-[var(--ui-border)] !h-9 !px-3 !text-xs gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed"
							disabled={!canRedo}
						>
							<span class="material-symbols-outlined text-sm">redo</span>
							{t.redo}
						</button>
						<button
							onclick={clearDraft}
							class="ui-btn bg-transparent border border-[var(--ui-border)] !h-9 !px-3 !text-xs gap-1.5 hover:border-red-400 hover:text-red-500 transition-colors"
						>
							<span class="material-symbols-outlined text-sm">delete_sweep</span>
							{t.clearDraft}
						</button>
						<button
							onclick={exportSvg}
							class="ui-btn bg-[var(--ui-bg-muted)] border border-[var(--ui-border)] !h-9 !px-3 !text-xs gap-1.5 hover:bg-primary hover:text-white transition-colors"
						>
							<span class="material-symbols-outlined text-sm">download</span>
							{t.svg}
						</button>
						<button
							onclick={exportPng}
							class="ui-btn ui-btn-primary !h-9 !px-3 !text-xs gap-1.5"
						>
							<span class="material-symbols-outlined text-sm">image</span>
							{t.png}
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
					{#if savedAtLabel}
						<span class="rounded-full bg-slate-100 px-3 py-1 text-slate-500 dark:bg-white/5 dark:text-slate-300">
							{t.lastSavedAt}: {savedAtLabel}
						</span>
					{/if}
				</div>
			</div>

			<!-- Editor + Preview -->
			<div class="grid lg:grid-cols-2 gap-6 min-h-[500px]">
				<!-- Code Editor -->
				<div class="flex flex-col gap-2">
					<div class="flex items-center justify-between px-1">
						<span class="text-[0.65rem] font-bold uppercase tracking-widest text-primary">{t.editorTitle}</span>
						<div class="flex items-center gap-3 text-[0.6rem] font-mono text-slate-400">
							<span>{mermaidCode.split('\n').length} {t.lines}</span>
							<span>{historySummary} {t.snapshots}</span>
						</div>
					</div>
					<textarea
						bind:value={mermaidCode}
						spellcheck="false"
						class="flex-1 w-full resize-none rounded-2xl bg-slate-900 text-slate-100 font-mono text-sm leading-relaxed p-5
							   border border-slate-700/50 outline-none focus:ring-4 focus:ring-primary/20 focus:border-primary/40 transition-all
							   placeholder:text-slate-500 custom-scrollbar"
						placeholder={t.placeholder}
					></textarea>
				</div>

				<!-- Preview -->
				<div class="flex flex-col gap-2">
					<div class="flex items-center justify-between px-1">
						<span class="text-[0.65rem] font-bold uppercase tracking-widest text-primary">{t.previewTitle}</span>
						{#if errorMessage}
							<span class="text-[0.6rem] font-bold text-red-500 flex items-center gap-1">
								<span class="material-symbols-outlined text-xs">error</span>
								{t.syntaxError}
							</span>
						{/if}
					</div>
					<div
						class="flex-1 rounded-2xl bg-white dark:bg-slate-900/80 border border-primary/10 dark:border-white/10
							   shadow-inner overflow-auto p-6 flex items-center justify-center custom-scrollbar relative"
					>
						{#if errorMessage}
							<div class="absolute inset-0 flex items-center justify-center bg-red-50/80 dark:bg-red-950/30 backdrop-blur-sm rounded-2xl p-6">
								<div class="text-center max-w-sm">
									<span class="material-symbols-outlined text-4xl text-red-400 mb-3">code_off</span>
									<p class="text-sm text-red-600 dark:text-red-400 font-medium mb-1">{t.syntaxErrorTitle}</p>
									<p class="text-xs text-red-500/70 dark:text-red-400/60 font-mono break-all leading-relaxed">{errorMessage}</p>
								</div>
							</div>
						{/if}
						<div bind:this={previewContainer} class="w-full flex items-center justify-center diagram-output"></div>
					</div>
				</div>
			</div>

			<p class="text-[0.65rem] font-bold text-primary tracking-widest uppercase opacity-70 text-center">
				{t.footerSummary}
			</p>
		{/if}
	</div>
	<div class="absolute -right-20 -top-20 size-80 rounded-full bg-primary/5 blur-[100px] pointer-events-none"></div>
</div>

<style>
	.custom-scrollbar::-webkit-scrollbar {
		width: 6px;
		height: 6px;
	}
	.custom-scrollbar::-webkit-scrollbar-thumb {
		background-color: var(--ui-primary);
		opacity: 0.2;
		border-radius: 9999px;
	}
	/* Ensure mermaid SVG text is visible in dark mode */
	:global(.dark) .diagram-output :global(svg) {
		filter: invert(0);
	}
	:global(.dark) .diagram-output :global(.nodeLabel),
	:global(.dark) .diagram-output :global(.edgeLabel),
	:global(.dark) .diagram-output :global(.label) {
		color: inherit !important;
	}
</style>
