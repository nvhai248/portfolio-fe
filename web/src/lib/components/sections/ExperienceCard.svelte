<script lang="ts">
	import type { ExperienceItem } from '$lib/types/content';

	interface Props {
		item: ExperienceItem;
	}

	let { item }: Props = $props();
</script>

<article class="ui-panel p-5 sm:p-6">
	<div class="flex flex-wrap items-start justify-between gap-3">
		<div class="min-w-0">
			<h3 class="ui-heading-3 break-words">{item.role}</h3>
			<p class="ui-muted break-words">{item.focus}</p>
		</div>
		<span class="ui-chip max-w-full whitespace-normal break-words">{item.duration}</span>
	</div>
	<ul class="mt-4 list-disc space-y-2 pl-5 ui-body">
		{#each item.achievements as achievement}
			<li class="break-words">{achievement}</li>
		{/each}
	</ul>
</article>
