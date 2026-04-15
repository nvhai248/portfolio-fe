<script lang="ts">
	import { browser } from '$app/environment';
	import { theme } from '$lib/stores/theme.svelte';

	interface Props {
		code: string;
		language?: string;
		filename?: string;
	}

	let { code, language = 'text', filename }: Props = $props();

	let highlightedHtml = $state('');
	let copied = $state(false);

	async function highlight(codeStr: string, lang: string, isDark: boolean) {
		if (!browser) return;

		const shiki = await import('shiki');
		const highlighter = await shiki.createHighlighter({
			themes: ['github-light', 'github-dark'],
			langs: [lang].filter(Boolean)
		});

		try {
			highlightedHtml = highlighter.codeToHtml(codeStr, {
				lang,
				theme: isDark ? 'github-dark' : 'github-light'
			});
		} catch {
			// If language not supported, fall back to plain text
			highlightedHtml = highlighter.codeToHtml(codeStr, {
				lang: 'text',
				theme: isDark ? 'github-dark' : 'github-light'
			});
		}
	}

	$effect(() => {
		const isDark = theme.current === 'dark';
		highlight(code, language, isDark);
	});

	function copyToClipboard() {
		if (!browser) return;
		navigator.clipboard.writeText(code).then(() => {
			copied = true;
			setTimeout(() => (copied = false), 2000);
		});
	}
</script>

<div class="group relative my-6 overflow-hidden rounded-lg border ui-divider">
	{#if filename || language}
		<div class="flex items-center justify-between border-b ui-divider bg-[var(--ui-bg-muted)] px-4 py-2">
			<span class="text-xs font-medium [color:var(--ui-text-subtle)]">
				{filename || language}
			</span>
			<button
				type="button"
				onclick={copyToClipboard}
				class="inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-xs font-medium opacity-0 transition-opacity group-hover:opacity-100 hover:bg-[var(--ui-surface)] [color:var(--ui-text-muted)]"
				aria-label="Copy code to clipboard"
			>
				<span class="material-symbols-outlined text-sm">{copied ? 'check' : 'content_copy'}</span>
				{copied ? 'Copied' : 'Copy'}
			</button>
		</div>
	{/if}
	{#if highlightedHtml}
		<div class="code-block overflow-x-auto text-sm [&_pre]:!m-0 [&_pre]:!rounded-none [&_pre]:!p-4">
			{@html highlightedHtml}
		</div>
	{:else}
		<pre class="overflow-x-auto bg-[var(--ui-bg-muted)] p-4 font-mono text-sm leading-6 [color:var(--ui-text)]"><code>{code}</code></pre>
	{/if}
</div>
