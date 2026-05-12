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
	type RenderMode = 'preview' | 'export';

	const STORAGE_KEY = 'portfolio-diagram-draft-v1';
	const HISTORY_LIMIT = 60;
	const EXPORT_BACKGROUND = '#f8fbff';
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

	function isDarkMode(): boolean {
		return document.documentElement.classList.contains('dark');
	}

	function getMermaidPalette(mode: RenderMode) {
		const dark = mode === 'preview' && isDarkMode();

		return {
			background: dark ? '#08111f' : EXPORT_BACKGROUND,
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

	function getMermaidConfig(mode: RenderMode): Record<string, unknown> {
		const dark = mode === 'preview' && isDarkMode();
		const palette = getMermaidPalette(mode);

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
				actorTextColor: palette.text,
				labelBoxBkgColor: palette.edgeLabelBackground,
				labelBoxBorderColor: palette.primaryBorder,
				sequenceNumberColor: palette.text,
				sectionBkgColor: dark ? '#0f172a' : '#eff6ff',
				sectionBkgColor2: dark ? '#111c2d' : '#ffffff',
				sectionTextColor: palette.text,
				taskBkgColor: palette.primaryFill,
				taskBorderColor: palette.primaryBorder,
				taskTextColor: palette.text,
				taskTextOutsideColor: palette.text,
				pie1: '#2563eb',
				pie2: '#0f766e',
				pie3: '#f59e0b',
				pie4: '#0891b2',
				pie5: '#14b8a6',
				pieTextColor: palette.text
			}
		};
	}

	function enhanceRenderedSvg(svgEl: SVGSVGElement, mode: RenderMode) {
		const palette = getMermaidPalette(mode);

		svgEl.style.maxWidth = '100%';
		svgEl.style.height = 'auto';
		svgEl.style.display = 'block';
		svgEl.style.fontFamily = 'Inter, sans-serif';
		svgEl.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
		svgEl.setAttribute('preserveAspectRatio', 'xMidYMid meet');

		let backgroundRect = svgEl.querySelector('[data-portfolio-diagram-bg="true"]') as SVGRectElement | null;
		if (!backgroundRect) {
			backgroundRect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
			backgroundRect.setAttribute('data-portfolio-diagram-bg', 'true');
			backgroundRect.setAttribute('x', '0');
			backgroundRect.setAttribute('y', '0');
			backgroundRect.setAttribute('width', '100%');
			backgroundRect.setAttribute('height', '100%');
			backgroundRect.setAttribute('rx', '22');
			svgEl.insertBefore(backgroundRect, svgEl.firstChild);
		}
		backgroundRect.setAttribute('fill', palette.background);

		let styleNode = svgEl.querySelector('style[data-portfolio-diagram-style="true"]') as SVGStyleElement | null;
		if (!styleNode) {
			styleNode = document.createElementNS('http://www.w3.org/2000/svg', 'style') as unknown as SVGStyleElement;
			styleNode.setAttribute('data-portfolio-diagram-style', 'true');
			svgEl.insertBefore(styleNode, backgroundRect.nextSibling);
		}

		styleNode.textContent = `
			text, tspan {
				font-family: Inter, sans-serif;
			}

			.label, .nodeLabel, .edgeLabel, .cluster text, .sectionTitle, .taskText, .taskTextOutsideRight, .taskTextOutsideLeft {
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

	async function renderSvgMarkup(mode: RenderMode, id: string): Promise<string> {
		const mermaid = getMermaid();
		if (!mermaid) return '';

		mermaid.initialize(getMermaidConfig(mode));
		const { svg } = await mermaid.render(id, mermaidCode.trim());
		return svg;
	}

	function serializeSvgMarkup(svgMarkup: string, mode: RenderMode): string | null {
		const wrapper = document.createElement('div');
		wrapper.innerHTML = svgMarkup;
		const svgEl = wrapper.querySelector('svg');
		if (!(svgEl instanceof SVGSVGElement)) return null;

		enhanceRenderedSvg(svgEl, mode);
		return new XMLSerializer().serializeToString(svgEl);
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
				getMermaid()?.initialize(getMermaidConfig('preview'));
				isMermaidLoaded = true;
				await tick();
				renderDiagram();
			};
			document.head.appendChild(script);
		} else {
			getMermaid()?.initialize(getMermaidConfig('preview'));
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

		const currentId = `mermaid-preview-${++renderCounter}`;

		try {
			const svg = await renderSvgMarkup('preview', currentId);
			if (previewContainer) {
				previewContainer.innerHTML = svg;
				const svgEl = previewContainer.querySelector('svg');
				if (svgEl instanceof SVGSVGElement) {
					enhanceRenderedSvg(svgEl, 'preview');
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
		const svgMarkup = await renderSvgMarkup('export', `diagram-export-${++renderCounter}`);
		const svgData = serializeSvgMarkup(svgMarkup, 'export');
		if (!svgData) return;

		const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
		const url = URL.createObjectURL(svgBlob);
		const palette = getMermaidPalette('export');

		const img = new Image();
		img.onload = () => {
			const scale = 2;
			const sourceWidth = img.naturalWidth || img.width;
			const sourceHeight = img.naturalHeight || img.height;
			const padding = 28;
			const canvas = document.createElement('canvas');
			canvas.width = sourceWidth * scale + padding * 2;
			canvas.height = sourceHeight * scale + padding * 2;
			const ctx = canvas.getContext('2d')!;
			ctx.fillStyle = palette.background;
			ctx.fillRect(0, 0, canvas.width, canvas.height);
			ctx.drawImage(img, padding, padding, sourceWidth * scale, sourceHeight * scale);
			URL.revokeObjectURL(url);

			const pngUrl = canvas.toDataURL('image/png');
			const link = document.createElement('a');
			link.download = 'diagram.png';
			link.href = pngUrl;
			link.click();
		};
		img.src = url;
	}

	async function exportSvg() {
		const svgMarkup = await renderSvgMarkup('export', `diagram-export-${++renderCounter}`);
		const svgData = serializeSvgMarkup(svgMarkup, 'export');
		if (!svgData) return;

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

<div class="glass-panel relative w-full overflow-hidden rounded-[2rem] p-px shadow-xl">
	<div class="bg-surface/80 relative z-10 flex w-full flex-col gap-5 rounded-[1.85rem] p-4 backdrop-blur-3xl sm:p-5 lg:p-6">

		{#if !isMermaidLoaded}
			<div class="flex items-center justify-center p-20">
				<span class="material-symbols-outlined animate-spin text-4xl text-primary">progress_activity</span>
			</div>
		{:else}
			<!-- Template chips + Actions -->
			<div class="flex flex-col gap-4 rounded-[1.4rem] border border-primary/10 bg-white/60 p-3.5 shadow-sm dark:bg-black/20 sm:p-4">
				<div class="flex flex-wrap items-center justify-between gap-4">
					<div class="flex flex-wrap items-center gap-2">
						<span class="mr-1 text-[0.68rem] font-bold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">{t.templatesLabel}:</span>
						{#each Object.keys(templates) as key}
							<button
								class="rounded-full border px-3 py-1.5 text-[0.68rem] font-bold uppercase tracking-[0.16em] transition-all
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
						<button
							onclick={exportSvg}
							class="ui-btn gap-1.5 border border-[var(--ui-border)] bg-[var(--ui-bg-muted)] !h-9 !px-3 !text-[0.72rem] transition-colors hover:bg-primary hover:text-white"
						>
							<span class="material-symbols-outlined text-sm">download</span>
							{t.svg}
						</button>
						<button
							onclick={exportPng}
							class="ui-btn ui-btn-primary gap-1.5 !h-9 !px-3 !text-[0.72rem]"
						>
							<span class="material-symbols-outlined text-sm">image</span>
							{t.png}
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
					{#if savedAtLabel}
						<span class="rounded-full bg-slate-100 px-2.5 py-1 text-slate-500 dark:bg-white/5 dark:text-slate-300">
							{t.lastSavedAt}: {savedAtLabel}
						</span>
					{/if}
				</div>
			</div>

			<!-- Editor + Preview -->
			<div class="grid gap-5 lg:grid-cols-2 lg:items-stretch">
				<!-- Code Editor -->
				<div class="flex flex-col gap-2">
					<div class="flex items-center justify-between px-1">
						<span class="text-[0.65rem] font-bold uppercase tracking-[0.2em] text-primary">{t.editorTitle}</span>
						<div class="flex items-center gap-3 text-[0.62rem] font-mono text-slate-400">
							<span>{mermaidCode.split('\n').length} {t.lines}</span>
							<span>{historySummary} {t.snapshots}</span>
						</div>
					</div>
					<textarea
						bind:value={mermaidCode}
						spellcheck="false"
						class="custom-scrollbar min-h-[360px] w-full flex-1 resize-none rounded-[1.4rem] border border-slate-700/50 bg-slate-950 px-4 py-4 font-mono text-[0.83rem] leading-6 text-slate-100
							   outline-none transition-all focus:border-primary/40 focus:ring-4 focus:ring-primary/20
							   placeholder:text-slate-500 sm:min-h-[420px] sm:px-5 sm:py-4"
						placeholder={t.placeholder}
					></textarea>
				</div>

				<!-- Preview -->
				<div class="flex flex-col gap-2">
					<div class="flex items-center justify-between px-1">
						<span class="text-[0.65rem] font-bold uppercase tracking-[0.2em] text-primary">{t.previewTitle}</span>
						{#if errorMessage}
							<span class="flex items-center gap-1 text-[0.62rem] font-bold text-red-500">
								<span class="material-symbols-outlined text-xs">error</span>
								{t.syntaxError}
							</span>
						{/if}
					</div>
					<div
						class="custom-scrollbar relative flex min-h-[360px] flex-1 items-center justify-center overflow-auto rounded-[1.4rem] border border-primary/10 bg-white p-4 shadow-inner dark:border-white/10 dark:bg-slate-900/80 sm:min-h-[420px] sm:p-5"
					>
						{#if errorMessage}
							<div class="absolute inset-0 flex items-center justify-center rounded-[1.4rem] bg-red-50/80 p-6 backdrop-blur-sm dark:bg-red-950/30">
								<div class="text-center max-w-sm">
									<span class="material-symbols-outlined text-4xl text-red-400 mb-3">code_off</span>
									<p class="text-sm text-red-600 dark:text-red-400 font-medium mb-1">{t.syntaxErrorTitle}</p>
									<p class="text-xs text-red-500/70 dark:text-red-400/60 font-mono break-all leading-relaxed">{errorMessage}</p>
								</div>
							</div>
						{/if}
						<div bind:this={previewContainer} class="diagram-output flex w-full items-center justify-center"></div>
					</div>
				</div>
			</div>

			<p class="text-center text-[0.64rem] font-bold uppercase tracking-[0.18em] text-primary opacity-70">
				{t.footerSummary}
			</p>
		{/if}
	</div>
	<div class="pointer-events-none absolute -right-20 -top-20 size-80 rounded-full bg-primary/5 blur-[100px]"></div>
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

	.diagram-output {
		min-width: min-content;
	}

	:global(.diagram-output svg) {
		max-width: 100%;
		height: auto;
	}
</style>
