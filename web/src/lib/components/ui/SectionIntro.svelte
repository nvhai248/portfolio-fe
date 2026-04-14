<script lang="ts">
	import type { SectionIntroContent } from '$lib/types/content';

	interface Props {
		content: SectionIntroContent;
		titleClass?: string;
		descriptionClass?: string;
		className?: string;
	}

	let {
		content,
		titleClass = 'ui-heading-1 mt-3 max-w-4xl',
		descriptionClass = 'ui-body-lg mt-4 max-w-3xl',
		className = ''
	}: Props = $props();
</script>

<div class={`space-y-0 ${className}`}>
	{#if content.eyebrow}
		<p class="ui-eyebrow">{content.eyebrow}</p>
	{/if}
	<h1 class={titleClass}>{content.title}</h1>
	{#if content.description}
		<p class={descriptionClass}>{content.description}</p>
	{/if}
</div>
