<script lang="ts">
	import type { ExperienceItem } from '$lib/types/content';

	interface Props {
		item: ExperienceItem;
	}

	let { item }: Props = $props();
</script>

<article class="glass-panel group relative overflow-hidden rounded-[2rem] p-6 shadow-2xl transition-all duration-500 hover:border-blue-500/20 md:p-8">
	<div class="flex flex-wrap items-start justify-between gap-6">
		<div class="min-w-0 space-y-2">
			<div class="flex items-center gap-3">
				<div class="h-2 w-2 rounded-full bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.8)]"></div>
				<h3 class="text-xl font-black tracking-tight text-white md:text-2xl">
					{item.role}{item.company ? ` @ ${item.company}` : ''}
				</h3>
			</div>
			
			<p class="font-mono text-[0.7rem] font-bold uppercase tracking-widest text-slate-400">
				{item.focus}
			</p>
			
			{#if item.location || item.employmentType}
				<div class="flex items-center gap-2 text-[0.65rem] font-bold uppercase tracking-widest text-slate-500">
					<span class="material-symbols-outlined text-sm">location_on</span>
					{[item.location, item.employmentType].filter(Boolean).join(' • ')}
				</div>
			{/if}
		</div>
		
		<div class="rounded-xl border border-blue-500/10 bg-blue-500/5 px-4 py-2 font-mono text-[0.7rem] font-bold tracking-tighter text-blue-400">
			{item.duration}
		</div>
	</div>

	{#if item.impactSummary}
		<p class="mt-8 ui-body-lg border-l-2 border-blue-500/20 pl-6 italic text-slate-300">
			"{item.impactSummary}"
		</p>
	{/if}

	<div class="mt-8 grid gap-8 lg:grid-cols-[1fr_auto]">
		<div class="space-y-4">
			<ul class="space-y-4">
				{#each item.achievements as achievement}
					<li class="flex items-start gap-4 text-sm leading-relaxed text-slate-400">
						<span class="material-symbols-outlined mt-1 text-[10px] text-blue-500">terminal</span>
						<span class="break-words">{achievement}</span>
					</li>
				{/each}
			</ul>
			
			{#if item.highlights && item.highlights.length > 0}
				<ul class="mt-4 space-y-3 border-t border-white/5 pt-4">
					{#each item.highlights as highlight}
						<li class="flex items-start gap-3 text-xs font-medium text-slate-500">
							<span class="mt-1.5 h-1 w-1 rounded-full bg-slate-600"></span>
							<span class="break-words">{highlight}</span>
						</li>
					{/each}
				</ul>
			{/if}
		</div>

		{#if item.stack && item.stack.length > 0}
			<div class="flex flex-wrap gap-2 lg:w-48 lg:flex-none">
				{#each item.stack as tech}
					<span class="rounded-lg border border-white/5 bg-white/5 px-2.5 py-1 text-[0.6rem] font-black uppercase tracking-widest text-slate-500 transition-colors hover:border-blue-500/20 hover:text-slate-300">
						{tech}
					</span>
				{/each}
			</div>
		{/if}
	</div>
</article>
