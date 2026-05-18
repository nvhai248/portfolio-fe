<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
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
				fontSize: '14px',
				height: '100%'
			},
			'.cm-content': {
				fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
				padding: '16px 0',
				caretColor: 'var(--ui-primary)'
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
				fontSize: '12px'
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
			/* Markdown heading styling */
			'.ͼ7': {
				/* ATX headings */
				fontWeight: '700'
			}
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
			doc: initialContent,
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
						scheduleSave(content);
					}
				})
			]
		});

		editorView = new EditorView({
			state,
			parent: editorContainer
		});

		editorView.focus();
	};

	// Re-initialize editor when fileId changes (different file selected)
	$effect(() => {
		// Track fileId to trigger re-init
		const _trackId = fileId;
		lastSavedContent = initialContent;
		saveStatus = 'idle';

		if (saveTimer) {
			clearTimeout(saveTimer);
			saveTimer = undefined;
		}

		// Use tick-like delay to ensure container is ready
		setTimeout(() => initEditor(), 0);
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
</script>

<div class="flex h-full flex-col overflow-hidden">
	<!-- Save Status Bar -->
	{#if saveStatus !== 'idle'}
		<div class="flex shrink-0 items-center justify-between border-b border-neutral-200 bg-neutral-50/80 px-4 py-1.5 dark:border-neutral-800 dark:bg-neutral-900/80">
			<div class="flex items-center gap-1.5 {status.color}">
				<span class="material-symbols-outlined text-[16px] {saveStatus === 'saving' ? 'animate-pulse' : ''}">{status.icon}</span>
				<span class="text-xs font-semibold">{status.label}</span>
			</div>

			{#if saveStatus === 'failed'}
				<button
					type="button"
					onclick={handleRetrySave}
					class="inline-flex items-center gap-1 rounded-md bg-red-50 px-2.5 py-1 text-xs font-bold text-red-700 transition-colors hover:bg-red-100 dark:bg-red-950/50 dark:text-red-400 dark:hover:bg-red-900/50"
				>
					<span class="material-symbols-outlined text-[14px]">refresh</span>
					Retry
				</button>
			{/if}
		</div>
	{/if}

	<!-- CodeMirror Editor -->
	<div
		bind:this={editorContainer}
		class="cm-editor-container flex-1 overflow-auto"
	></div>
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
