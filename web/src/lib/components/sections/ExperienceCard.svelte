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
			<h3 class="ui-heading-3 break-words">{item.role}{item.company ? ` — ${item.company}` : ''}</h3>
			<p class="ui-muted break-words">{item.focus}</p>
			{#if item.location || item.employmentType}
				<p class="mt-1 text-xs [color:var(--ui-text-muted)] break-words">
					{[item.location, item.employmentType].filter(Boolean).join(' • ')}
				</p>
			{/if}
		</div>
		<span class="ui-chip max-w-full whitespace-normal break-words">{item.duration}</span>
	</div>

	{#if item.impactSummary}
		<p class="mt-4 ui-body break-words">{item.impactSummary}</p>
	{/if}

	{#if item.stack && item.stack.length > 0}
		<div class="mt-4 flex flex-wrap gap-2">
			{#each item.stack as tech}
				<span class="ui-chip">{tech}</span>
			{/each}
		</div>
	{/if}

	{#if item.highlights && item.highlights.length > 0}
		<ul class="mt-4 list-disc space-y-2 pl-5 ui-body">
			{#each item.highlights as highlight}
				<li class="break-words">{highlight}</li>
			{/each}
		</ul>
	{/if}

	<ul class="mt-4 list-disc space-y-2 pl-5 ui-body">
		{#each item.achievements as achievement}
			<li class="break-words">{achievement}</li>
		{/each}
	</ul>
</article>
