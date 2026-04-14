<script lang="ts">
	import type { ProjectContent } from '$lib/types/content';

	interface Props {
		project: ProjectContent;
		overviewHeading: string;
		stackHeading: string;
	}

	let { project, overviewHeading, stackHeading }: Props = $props();
</script>

<article class="ui-panel rounded-2xl p-5 sm:p-6">
	<div class="flex flex-wrap items-start justify-between gap-4">
		<div class="min-w-0">
			<h2 class="ui-heading-2 break-words">{project.title}</h2>
			<p class="ui-muted mt-1 break-words">Role: {project.role}</p>
		</div>
		<span class="ui-chip max-w-full whitespace-normal break-words px-3 uppercase tracking-wide">{project.domain}</span>
	</div>

	<div class="mt-5 grid gap-4 sm:gap-5 lg:grid-cols-3">
		<div class="min-w-0">
			<h3 class="text-sm font-semibold [color:var(--ui-text)]">{overviewHeading}</h3>
			<p class="mt-2 text-sm leading-relaxed [color:var(--ui-text-muted)] break-words">{project.overview}</p>
		</div>
		{#each project.detailLists as detail}
			<div class="min-w-0">
				<h3 class="text-sm font-semibold [color:var(--ui-text)] break-words">{detail.heading}</h3>
				<ul class="mt-2 list-disc space-y-1.5 pl-5 text-sm [color:var(--ui-text-muted)]">
					{#each detail.items as item}
						<li class="break-words">{item}</li>
					{/each}
				</ul>
			</div>
		{/each}
	</div>

	<div class="mt-5 border-t ui-divider pt-4 sm:pt-5">
		<h3 class="text-sm font-semibold [color:var(--ui-text)]">{stackHeading}</h3>
		<p class="mt-2 text-sm [color:var(--ui-text-muted)] break-words">{project.techStack.join(', ')}</p>
	</div>
</article>
