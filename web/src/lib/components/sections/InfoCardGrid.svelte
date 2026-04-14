<script lang="ts">
	import type { InfoCardItem } from '$lib/types/content';

	interface Props {
		items: InfoCardItem[];
	}

	let { items }: Props = $props();
</script>

<div class="grid gap-4 sm:gap-5 md:grid-cols-2">
	{#each items as item}
		<article class="ui-panel p-5 sm:p-6">
			<h2 class="ui-heading-3">{item.title}</h2>
			<p class="ui-body mt-2">{item.description}</p>
		</article>
	{/each}
</div>
