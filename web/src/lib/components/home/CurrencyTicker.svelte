<script lang="ts">
	import { onMount } from 'svelte';
	import { fetchCurrencyRates, type CurrencyRate } from '$lib/services/currency';
	import Reveal from '$lib/components/ui/Reveal.svelte';

	let rates: CurrencyRate[] = $state([]);
	let isLoading = $state(true);

	onMount(async () => {
		const fetched = await fetchCurrencyRates();
		rates = fetched;
		isLoading = false;
	});

	const formatRate = (rate: number, code: string) => {
		if (code === 'VND') return Math.round(rate).toLocaleString();
		return rate.toFixed(3);
	};
</script>

<div class="pointer-events-auto h-full w-full">
	<Reveal type="fade" delay={600} duration={1000}>
		<div class="glass-card inline-flex flex-col gap-6 overflow-hidden rounded-[2.5rem] p-6 shadow-2xl backdrop-blur-2xl transition-all duration-300 hover:border-blue-500/20 md:p-10">
			<div class="flex items-center justify-between border-b border-white/5 pb-5">
				<div class="flex items-center gap-3">
					<span class="relative flex h-2.5 w-2.5">
						<span class="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
						<span class="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500"></span>
					</span>
					<h3 class="text-[0.75rem] font-black uppercase tracking-[0.3em] text-emerald-500">
						Global Market Data
					</h3>
				</div>
				<span class="text-[0.65rem] font-black uppercase tracking-widest text-slate-500">
					Reference: USD
				</span>
			</div>

			<div class="flex flex-wrap items-center gap-x-12 gap-y-8">
				{#if isLoading}
					{#each Array(5) as _}
						<div class="h-14 w-32 animate-pulse rounded-xl bg-white/5"></div>
					{/each}
				{:else}
					<!-- Reference (USA) -->
					<div class="flex flex-col gap-2 border-r border-white/10 pr-12">
						<div class="flex items-center gap-2">
							<span class="text-[0.7rem] font-black tracking-[0.2em] text-emerald-400">USD</span>
							<span class="text-[0.6rem] font-bold uppercase text-slate-500">USA (Base)</span>
						</div>
						<div class="flex items-baseline gap-2">
							<span class="font-mono text-xl font-black tracking-tight text-white">$1.000</span>
						</div>
					</div>

					{#each rates as item}
						<div class="flex flex-col gap-2 group transition-transform hover:translate-y-[-4px]">
							<div class="flex items-center gap-2">
								<span class="text-[0.7rem] font-black tracking-[0.2em] text-blue-400 group-hover:text-blue-300">
									{item.code}
								</span>
								<span class="text-[0.6rem] font-bold uppercase text-slate-500">{item.name}</span>
							</div>
							<div class="flex items-baseline gap-2">
								<span class="font-mono text-xl font-black tracking-tight text-slate-100 group-hover:text-white transition-colors">
									{item.symbol}{formatRate(item.rate, item.code)}
								</span>
								<div class="flex items-center text-[0.6rem] font-black text-emerald-400">
									<span class="material-symbols-outlined text-[10px]">arrow_drop_up</span>
									0.{Math.floor(Math.random() * 9)}1%
								</div>
							</div>
						</div>
					{/each}
				{/if}
			</div>
		</div>
	</Reveal>
</div>
