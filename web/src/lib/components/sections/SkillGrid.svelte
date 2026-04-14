<script lang="ts">
	import type { SkillCategory } from '$lib/types/content';

	interface Props {
		items: SkillCategory[];
	}

	let { items }: Props = $props();
</script>

<div class="mt-6 grid gap-4 sm:gap-5 md:grid-cols-2 lg:grid-cols-3">
	{#each items as skill}
		<div class={`ui-panel p-5 ${skill.wide ? 'md:col-span-2 lg:col-span-2' : ''}`}>
			<h3 class="ui-heading-3">{skill.title}</h3>
			<p class="ui-body mt-2">{skill.description}</p>
			<p class="ui-subtle mt-3">{skill.note}</p>
		</div>
	{/each}
</div>
