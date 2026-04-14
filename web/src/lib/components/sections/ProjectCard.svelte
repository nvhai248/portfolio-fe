<script lang="ts">
	import type { ProjectContent } from '$lib/types/content';

	interface Props {
		project: ProjectContent;
	}

	let { project }: Props = $props();
</script>

<article class="ui-panel rounded-2xl p-5 sm:p-6">
	<div class="flex flex-wrap items-start justify-between gap-4">
		<div>
			<h2 class="ui-heading-2">{project.title}</h2>
			<p class="ui-muted mt-1">Role: {project.role}</p>
		</div>
		<span class="ui-chip px-3 uppercase tracking-wide">{project.domain}</span>
	</div>

	<div class="mt-5 grid gap-4 sm:gap-5 lg:grid-cols-3">
		<div>
			<h3 class="text-sm font-semibold [color:var(--ui-text)]">Context</h3>
			<p class="mt-2 text-sm leading-relaxed [color:var(--ui-text-muted)]">{project.context}</p>
		</div>
		<div>
			<h3 class="text-sm font-semibold [color:var(--ui-text)]">Key contributions</h3>
			<ul class="mt-2 list-disc space-y-1.5 pl-5 text-sm [color:var(--ui-text-muted)]">
				{#each project.contributions as contribution}
					<li>{contribution}</li>
				{/each}
			</ul>
		</div>
		<div>
			<h3 class="text-sm font-semibold [color:var(--ui-text)]">Impact</h3>
			<ul class="mt-2 list-disc space-y-1.5 pl-5 text-sm [color:var(--ui-text-muted)]">
				{#each project.impact as item}
					<li>{item}</li>
				{/each}
			</ul>
		</div>
	</div>

	<div class="mt-5 border-t ui-divider pt-4 sm:pt-5">
		<h3 class="text-sm font-semibold [color:var(--ui-text)]">Tech stack</h3>
		<p class="mt-2 text-sm [color:var(--ui-text-muted)]">{project.stack}</p>
	</div>
</article>
