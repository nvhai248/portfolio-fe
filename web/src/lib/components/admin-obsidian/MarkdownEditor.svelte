<script lang="ts">
	import { onMount, onDestroy, untrack } from 'svelte';
	import { EditorView, keymap, placeholder as cmPlaceholder, lineNumbers, drawSelection, highlightActiveLine, highlightActiveLineGutter } from '@codemirror/view';
	import { EditorState } from '@codemirror/state';
	import { markdown } from '@codemirror/lang-markdown';
	import { defaultKeymap, history, historyKeymap, indentWithTab } from '@codemirror/commands';
	import { syntaxHighlighting, defaultHighlightStyle, bracketMatching, indentOnInput, foldGutter } from '@codemirror/language';

	type SaveStatus = 'idle' | 'unsaved' | 'saving' | 'saved' | 'failed';

	let {
		fileId,
		initialContent,
		onSave
	}: {
		fileId: string;
		initialContent: string;
		onSave: (content: string) => Promise<void>;
	} = $props();

	let editorContainer: HTMLDivElement | undefined = $state();
	let editorView: EditorView | undefined;
	let saveStatus = $state<SaveStatus>('idle');
	let saveTimer: ReturnType<typeof setTimeout> | undefined;
	let lastSavedContent = $state('');

	let showPreview = $state(false);
	let editorContent = $state('');

	// Ensure window.marked and window.DOMPurify exist on global scope for TS
	declare global {
		interface Window {
			marked: any;
			DOMPurify: any;
		}
	}

	const DEBOUNCE_MS = 1200;

	const scheduleSave = (content: string) => {
		if (content === lastSavedContent) {
			saveStatus = 'saved';
			return;
		}

		saveStatus = 'unsaved';

		if (saveTimer) {
			clearTimeout(saveTimer);
		}

		saveTimer = setTimeout(async () => {
			try {
				saveStatus = 'saving';
				await onSave(content);
				lastSavedContent = content;
				saveStatus = 'saved';
			} catch {
				saveStatus = 'failed';
			}
		}, DEBOUNCE_MS);
	};

	const handleRetrySave = async () => {
		if (!editorView) return;
		const content = editorView.state.doc.toString();
		try {
			saveStatus = 'saving';
			await onSave(content);
			lastSavedContent = content;
			saveStatus = 'saved';
		} catch {
			saveStatus = 'failed';
		}
	};

	// Dark theme for the CodeMirror editor
	const obsidianDarkTheme = EditorView.theme(
		{
			'&': {
				fontSize: '15px',
				height: '100%'
			},
			'.cm-content': {
				fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
				padding: '24px 16px',
				caretColor: 'var(--ui-primary)',
				lineHeight: '1.6'
			},
			'&.cm-focused .cm-cursor': {
				borderLeftColor: 'var(--ui-primary)'
			},
			'&.cm-focused .cm-selectionBackground, .cm-selectionBackground': {
				backgroundColor: 'rgba(59, 130, 246, 0.2) !important'
			},
			'.cm-gutters': {
				backgroundColor: 'transparent',
				borderRight: '1px solid var(--ui-border-subtle)',
				color: 'var(--ui-text-subtle)',
				minWidth: '3em'
			},
			'.cm-gutter': {
				fontSize: '13px'
			},
			'.cm-activeLineGutter': {
				backgroundColor: 'transparent',
				color: 'var(--ui-text-muted)'
			},
			'.cm-activeLine': {
				backgroundColor: 'rgba(59, 130, 246, 0.04)'
			},
			'.cm-foldGutter': {
				width: '14px'
			},
			'.cm-line': {
				padding: '1px 16px 1px 8px'
			},
			/* Markdown heading styling for visual Notion-like experience */
			'.ͼ7': { fontWeight: '700', fontSize: '1.8em', color: '#e2e8f0' },
			'.ͼ8': { fontWeight: '700', fontSize: '1.5em', color: '#e2e8f0' },
			'.ͼ9': { fontWeight: '700', fontSize: '1.3em', color: '#e2e8f0' },
			'.ͼa': { fontWeight: '700', fontSize: '1.1em', color: '#e2e8f0' },
			'.ͼb': { fontStyle: 'italic' },
			'.ͼc': { fontWeight: 'bold' }
		},
		{ dark: false }
	);

	const initEditor = () => {
		if (!editorContainer) return;

		// Destroy previous view if it exists
		if (editorView) {
			editorView.destroy();
			editorView = undefined;
		}

		const state = EditorState.create({
			doc: lastSavedContent,
			extensions: [
				lineNumbers(),
				highlightActiveLineGutter(),
				history(),
				foldGutter(),
				drawSelection(),
				indentOnInput(),
				bracketMatching(),
				highlightActiveLine(),
				syntaxHighlighting(defaultHighlightStyle, { fallback: true }),
				markdown(),
				keymap.of([...defaultKeymap, ...historyKeymap, indentWithTab]),
				cmPlaceholder('Start writing your note...'),
				obsidianDarkTheme,
				EditorView.lineWrapping,
				EditorView.updateListener.of((update) => {
					if (update.docChanged) {
						const content = update.state.doc.toString();
						editorContent = content;
						scheduleSave(content);
					}
				})
			]
		});

		editorView = new EditorView({
			state,
			parent: editorContainer
		});

		editorContent = lastSavedContent;
		editorView.focus();
	};

	// Re-initialize editor when fileId changes (different file selected)
	$effect(() => {
		// Track fileId to trigger re-init. DO NOT track initialContent.
		const _trackId = fileId;
		
		untrack(() => {
			lastSavedContent = initialContent;
			saveStatus = 'idle';

			if (saveTimer) {
				clearTimeout(saveTimer);
				saveTimer = undefined;
			}

			// Use tick-like delay to ensure container is ready
			setTimeout(() => initEditor(), 0);
		});
	});

	onMount(() => {
		initEditor();
	});

	onDestroy(() => {
		if (saveTimer) clearTimeout(saveTimer);
		if (editorView) editorView.destroy();
	});

	const saveStatusConfig: Record<SaveStatus, { label: string; icon: string; color: string }> = {
		idle: { label: '', icon: '', color: '' },
		unsaved: { label: 'Unsaved changes', icon: 'edit', color: 'text-amber-600 dark:text-amber-400' },
		saving: { label: 'Saving to Drive...', icon: 'cloud_upload', color: 'text-blue-600 dark:text-blue-400' },
		saved: { label: 'All changes saved', icon: 'cloud_done', color: 'text-emerald-600 dark:text-emerald-400' },
		failed: { label: 'Save failed', icon: 'cloud_off', color: 'text-red-600 dark:text-red-400' }
	};

	const status = $derived(saveStatusConfig[saveStatus]);

	let previewHtml = $derived.by(() => {
		if (showPreview && typeof window !== 'undefined' && window.marked && window.DOMPurify) {
			return window.DOMPurify.sanitize(window.marked.parse(editorContent));
		}
		return '';
	});

</script>

<svelte:head>
	<script src="https://cdn.jsdelivr.net/npm/marked/marked.min.js"></script>
	<script src="https://cdn.jsdelivr.net/npm/dompurify/dist/purify.min.js"></script>
</svelte:head>

<div class="flex h-full flex-col overflow-hidden">
	<!-- Save Status Bar & Tools -->
	<div class="flex shrink-0 items-center justify-between border-b border-neutral-200 bg-neutral-50/80 px-4 py-1.5 dark:border-neutral-800 dark:bg-neutral-900/80 min-h-[40px]">
		<div class="flex items-center gap-1.5 {status.color}">
			{#if saveStatus !== 'idle'}
				<span class="material-symbols-outlined text-[16px] {saveStatus === 'saving' ? 'animate-pulse' : ''}">{status.icon}</span>
				<span class="text-xs font-semibold">{status.label}</span>
			{/if}
			{#if saveStatus === 'failed'}
				<button
					type="button"
					onclick={handleRetrySave}
					class="inline-flex items-center gap-1 rounded-md bg-red-50 px-2.5 py-1 text-xs font-bold text-red-700 transition-colors hover:bg-red-100 dark:bg-red-950/50 dark:text-red-400 dark:hover:bg-red-900/50 ml-2"
				>
					<span class="material-symbols-outlined text-[14px]">refresh</span>
					Retry
				</button>
			{/if}
		</div>

		<div class="flex items-center gap-2">
			<button
				type="button"
				onclick={() => showPreview = !showPreview}
				class="inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-semibold transition-colors {showPreview ? 'bg-primary text-white dark:bg-blue-600' : 'bg-neutral-200 text-neutral-700 hover:bg-neutral-300 dark:bg-neutral-800 dark:text-neutral-300 dark:hover:bg-neutral-700'}"
			>
				<span class="material-symbols-outlined text-[14px]">{showPreview ? 'visibility_off' : 'visibility'}</span>
				{showPreview ? 'Hide Preview' : 'Side-by-side Preview'}
			</button>
		</div>
	</div>

	<!-- Workspace Area -->
	<div class="flex flex-1 overflow-hidden">
		<!-- CodeMirror Editor Pane -->
		<div
			bind:this={editorContainer}
			class="cm-editor-container flex-1 overflow-auto transition-all duration-300 {showPreview ? 'border-r border-neutral-200 dark:border-neutral-800' : ''}"
		></div>

		<!-- Live Preview Pane -->
		{#if showPreview}
			<div class="flex-1 overflow-auto bg-white dark:bg-neutral-950 p-6 lg:p-10 transition-all duration-300">
				<div class="prose prose-sm sm:prose-base dark:prose-invert max-w-none">
					{@html previewHtml || '<p class="text-neutral-500 italic">No content to preview.</p>'}
				</div>
			</div>
		{/if}
	</div>
</div>

<style>
	.cm-editor-container :global(.cm-editor) {
		height: 100%;
		outline: none;
	}

	.cm-editor-container :global(.cm-scroller) {
		overflow: auto;
		font-family: 'Inter', system-ui, -apple-system, sans-serif;
	}

	/* Dark mode overrides */
	:global(html.dark) .cm-editor-container :global(.cm-editor) {
		background-color: #0f172a;
		color: #e2e8f0;
	}

	:global(html.dark) .cm-editor-container :global(.cm-gutters) {
		background-color: #0f172a;
		color: #475569;
	}

	:global(html.dark) .cm-editor-container :global(.cm-activeLine) {
		background-color: rgba(59, 130, 246, 0.06);
	}

	:global(html.dark) .cm-editor-container :global(.cm-selectionBackground) {
		background-color: rgba(59, 130, 246, 0.25) !important;
	}

	:global(html.dark) .cm-editor-container :global(.cm-cursor) {
		border-left-color: #60a5fa;
	}
</style>
