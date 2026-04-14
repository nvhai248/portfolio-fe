<script lang="ts">
	import type { ExperienceItem } from '$lib/types/content';

	interface Props {
		item: ExperienceItem;
	}

	let { item }: Props = $props();
</script>

<article class="ui-panel p-5 sm:p-6">
	<div class="flex flex-wrap items-start justify-between gap-3">
		<div>
			<h3 class="ui-heading-3">{item.role}</h3>
			<p class="ui-muted">{item.focus}</p>
		</div>
		<span class="ui-chip">{item.duration}</span>
	</div>
	<ul class="mt-4 list-disc space-y-2 pl-5 ui-body">
		{#each item.achievements as achievement}
			<li>{achievement}</li>
		{/each}
	</ul>
</article>
