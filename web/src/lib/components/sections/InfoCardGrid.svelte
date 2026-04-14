<script lang="ts">
	import type { ContentCardItem } from '$lib/types/content';

	interface Props {
		items: ContentCardItem[];
	}

	let { items }: Props = $props();
</script>

<div class="grid gap-4 sm:gap-5 md:grid-cols-2">
	{#each items as item}
		<article class="ui-panel p-5 sm:p-6">
			<h2 class="ui-heading-3 break-words">{item.heading}</h2>
			<p class="ui-body mt-2 break-words">{item.body}</p>
		</article>
	{/each}
</div>
