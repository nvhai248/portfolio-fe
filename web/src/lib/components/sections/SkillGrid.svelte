<script lang="ts">
	import type { TechSkillCategory } from '$lib/types/content';

	interface Props {
		items: TechSkillCategory[];
	}

	let { items }: Props = $props();
</script>

<div class="mt-6 grid gap-4 sm:gap-5 md:grid-cols-2 lg:grid-cols-3">
	{#each items as skill}
		<div class={`ui-panel p-5 min-w-0 ${skill.wide ? 'md:col-span-2 lg:col-span-2' : ''}`}>
			<h3 class="ui-heading-3 break-words">{skill.heading}</h3>
			<p class="ui-body mt-2 break-words">{skill.summary}</p>
			<p class="ui-subtle mt-3 break-words">{skill.context}</p>
		</div>
	{/each}
</div>
