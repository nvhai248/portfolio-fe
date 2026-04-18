<script lang="ts">
	import type { ExperienceItem } from '$lib/types/content';

	interface Props {
		item: ExperienceItem;
	}

	let { item }: Props = $props();
</script>

<article class="ui-panel group relative overflow-hidden rounded-[2.5rem] p-8 shadow-2xl transition-all duration-500 hover:border-primary/20 dark:hover:border-blue-500/20 md:p-10">
	<div class="flex flex-wrap items-start justify-between gap-8">
		<div class="min-w-0 space-y-3">
			<div class="flex items-center gap-3">
				<div class="h-2 w-2 rounded-full bg-primary shadow-[0_0_10px_rgba(30,64,175,0.4)] dark:bg-blue-500 dark:shadow-[0_0_10px_rgba(59,130,246,0.8)]"></div>
				<h3 class="text-xl font-black tracking-tighter [color:var(--ui-text)] md:text-2xl">
					{item.role}{item.company ? ` @ ${item.company}` : ''}
				</h3>
			</div>
			
			<p class="font-mono text-[0.75rem] font-bold uppercase tracking-[0.25em] [color:var(--ui-primary)] dark:text-blue-400">
				{item.focus}
			</p>
			
			{#if item.location || item.employmentType}
				<div class="flex items-center gap-3 text-[0.65rem] font-black uppercase tracking-widest [color:var(--ui-text-subtle)]">
					<span class="material-symbols-outlined text-sm opacity-60">location_on</span>
					{[item.location, item.employmentType].filter(Boolean).join(' • ')}
				</div>
			{/if}
		</div>
		
		<div class="rounded-xl border border-primary/10 bg-primary/5 px-5 py-2.5 font-mono text-[0.7rem] font-black tracking-tight text-primary dark:border-blue-500/10 dark:bg-blue-500/5 dark:text-blue-400">
			{item.duration}
		</div>
	</div>

	{#if item.impactSummary}
		<div class="mt-10 border-l-[3px] border-primary/20 dark:border-blue-500/20 pl-8">
			<p class="ui-body-lg italic font-medium">
				"{item.impactSummary}"
			</p>
		</div>
	{/if}

	<div class="mt-10 grid gap-10 lg:grid-cols-[1fr_auto]">
		<div class="space-y-6">
			<ul class="space-y-5">
				{#each item.achievements as achievement}
					<li class="flex items-start gap-4 text-[0.9rem] leading-relaxed [color:var(--ui-text-muted)]">
						<span class="material-symbols-outlined mt-1 text-xs text-primary dark:text-blue-500">terminal</span>
						<span class="break-words font-medium">{achievement}</span>
					</li>
				{/each}
			</ul>
			
			{#if item.highlights && item.highlights.length > 0}
				<ul class="mt-6 space-y-4 border-t [border-color:var(--ui-border)] pt-8">
					{#each item.highlights as highlight}
						<li class="flex items-start gap-4 text-xs font-bold uppercase tracking-wider [color:var(--ui-text-subtle)]">
							<span class="mt-2 h-1 w-1 rounded-full [background-color:var(--ui-text-subtle)] opacity-40"></span>
							<span class="break-words leading-relaxed">{highlight}</span>
						</li>
					{/each}
				</ul>
			{/if}
		</div>

		{#if item.stack && item.stack.length > 0}
			<div class="flex flex-wrap gap-2.5 lg:w-52 lg:flex-none">
				{#each item.stack as tech}
					<span class="rounded-lg border [border-color:var(--ui-border)] [background-color:var(--ui-surface-soft)] px-3 py-1.5 text-[0.6rem] font-black uppercase tracking-widest [color:var(--ui-text-muted)] transition-all hover:border-primary/30 hover:[color:var(--ui-primary)] dark:hover:border-blue-500/30 dark:hover:text-blue-400">
						{tech}
					</span>
				{/each}
			</div>
		{/if}
	</div>
</article>
