<script lang="ts">
	import { PortableText } from '@portabletext/svelte';
	import PortableImage from './PortableImage.svelte';
	import PortableCode from './PortableCode.svelte';

	interface Props {
		value: any[];
	}

	let { value }: Props = $props();
</script>

{#if value && value.length > 0}
	<div class="prose prose-slate dark:prose-invert max-w-none text-lg leading-relaxed [color:var(--ui-text-muted)]
		prose-headings:[color:var(--ui-text)]
		prose-h2:mt-12 prose-h2:mb-4 prose-h2:text-2xl prose-h2:font-bold
		prose-h3:mt-8 prose-h3:mb-3 prose-h3:text-xl prose-h3:font-semibold
		prose-h4:mt-6 prose-h4:mb-2 prose-h4:text-lg prose-h4:font-semibold
		prose-p:mb-6
		prose-a:text-primary prose-a:underline-offset-4 hover:prose-a:underline
		prose-strong:[color:var(--ui-text)]
		prose-blockquote:border-l-4 prose-blockquote:border-primary prose-blockquote:bg-transparent prose-blockquote:py-2 prose-blockquote:pl-6 prose-blockquote:text-xl prose-blockquote:font-light prose-blockquote:italic prose-blockquote:[color:var(--ui-text-muted)]
		prose-code:rounded prose-code:bg-[var(--ui-bg-muted)] prose-code:px-1.5 prose-code:py-0.5 prose-code:text-sm prose-code:font-medium prose-code:[color:var(--ui-text)]
		prose-img:rounded-xl
		prose-li:[color:var(--ui-text-muted)]">
		<PortableText
			{value}
			components={{
				types: {
					image: PortableImage,
					code: PortableCode
				}
			}}
		/>
	</div>
{/if}
