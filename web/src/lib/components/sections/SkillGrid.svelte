<script lang="ts">
	import type { TechSkillCategory } from '$lib/types/content';

	interface Props {
		items: TechSkillCategory[];
	}

	let { items }: Props = $props();

	function getIconForCategory(heading: string): string {
		const h = heading.toLowerCase();
		if (h.includes('language')) return 'code';
		if (h.includes('backend')) return 'hub';
		if (h.includes('data')) return 'psychology';
		if (h.includes('cloud') || h.includes('devops')) return 'deployed_code';
		if (h.includes('practice') || h.includes('engineering')) return 'architecture';
		return 'terminal';
	}
</script>

<div class="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
	{#each items as skill}
		<div class={`ui-panel group flex flex-col p-6 shadow-lg transition-all duration-300 hover:border-primary/20 hover:shadow-xl dark:hover:border-blue-500/20 ${skill.wide ? 'md:col-span-2' : ''}`}>
			<div class="flex items-center gap-4">
				<div class="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-primary/5 text-primary ring-1 ring-primary/10 transition-colors group-hover:bg-primary/10 dark:bg-blue-500/5 dark:text-blue-400 dark:ring-blue-500/10 dark:group-hover:bg-blue-500/10">
					<span class="material-symbols-outlined text-2xl">{getIconForCategory(skill.heading)}</span>
				</div>
				<h3 class="text-[0.85rem] font-black uppercase tracking-[0.2em] [color:var(--ui-text)]">
					{skill.heading}
				</h3>
			</div>

			<div class="mt-6 flex flex-wrap gap-2">
				{#each skill.summary.split(',').map(s => s.trim()) as tech}
					<span class="rounded-lg bg-primary/[0.03] px-3 py-1.5 text-[0.65rem] font-bold tracking-tight text-primary ring-1 ring-primary/5 dark:bg-blue-500/[0.03] dark:text-blue-400 dark:ring-blue-500/5">
						{tech}
					</span>
				{/each}
			</div>

			<div class="mt-6 border-t border-primary/5 pt-4 dark:border-blue-500/5">
				<p class="text-xs font-semibold leading-relaxed [color:var(--ui-text-subtle)] opacity-80">
					{skill.context}
				</p>
			</div>
		</div>
	{/each}
</div>
