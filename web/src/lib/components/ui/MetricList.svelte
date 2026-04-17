<script lang="ts">
	import type { MetricItem } from '$lib/types/content';
	import Reveal from '$lib/components/ui/Reveal.svelte';

	interface Props {
		items: MetricItem[];
		baseDelay?: number;
	}

	let { items, baseDelay = 0 }: Props = $props();
</script>

<ul class="space-y-4">
	{#each items as item, i}
		<Reveal type="slide-up" delay={baseDelay + i * 100} duration={600}>
			<li
				class="group flex items-center justify-between gap-4 border-b border-white/5 pb-4 last:border-b-0 last:pb-0"
			>
				<div class="flex items-center gap-3">
					<div class="h-1.5 w-1.5 rounded-full bg-blue-500/40 transition-colors group-hover:bg-blue-400"></div>
					<span class="text-[0.7rem] font-bold uppercase tracking-widest text-slate-400">
						{item.label}
					</span>
				</div>
				<span class="font-mono text-sm font-medium tracking-tight text-slate-200">
					{item.value}
				</span>
			</li>
		</Reveal>
	{/each}
</ul>
