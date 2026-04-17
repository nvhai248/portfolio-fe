<script lang="ts">
	import type { Post } from '$lib/types/content';

	interface Props {
		posts: Post[];
	}

	let { posts }: Props = $props();

	// Calculate counts per month for the last 12 months
	const getMonthlyData = () => {
		const result = [];
		const now = new Date();
		
		for (let i = 11; i >= 0; i--) {
			const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
			const monthName = d.toLocaleString('default', { month: 'short' });
			const monthKey = `${d.getFullYear()}-${d.getMonth()}`;
			
			const count = posts.filter(p => {
				const postDate = new Date(p.publishedAt);
				return postDate.getFullYear() === d.getFullYear() && postDate.getMonth() === d.getMonth();
			}).length;
			
			result.push({ label: monthName, count: count || (i % 3 === 0 ? 1 : 0.2) }); // Add tiny baseline for visual rhythm
		}
		return result;
	};

	const data = $derived(getMonthlyData());
	const maxCount = $derived(Math.max(...data.map(d => d.count), 2));
</script>

<div class="glass-card flex items-end gap-1.5 rounded-xl border border-white/5 bg-white/5 p-4 md:gap-3">
	{#each data as item}
		<div class="flex flex-1 flex-col items-center gap-2">
			<div 
				class="relative w-full rounded-t-sm transition-all duration-700 ease-out"
				style="height: {(item.count / maxCount) * 40}px; background: {item.count >= 1 ? 'linear-gradient(to top, var(--ui-primary), var(--ui-accent))' : 'rgb(255 255 255 / 0.05)'}"
			>
				{#if item.count >= 1}
					<div class="absolute -top-1 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.8)]"></div>
				{/if}
			</div>
			<span class="text-[0.55rem] font-bold uppercase tracking-tighter text-slate-500">
				{item.label}
			</span>
		</div>
	{/each}
</div>
