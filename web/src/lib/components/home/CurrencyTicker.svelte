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
	<Reveal type="fade" delay={400} duration={800}>
		<div class="space-y-8">
			<div class="flex items-center justify-between border-b pb-6 [border-color:var(--ui-border)]">
				<div class="flex items-center gap-3">
					<span class="relative flex h-2.5 w-2.5">
						<span class="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
						<span class="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500"></span>
					</span>
					<h3 class="text-[0.75rem] font-black uppercase tracking-[0.35em] [color:var(--ui-primary)] dark:text-blue-400">
						Global Market Data
					</h3>
				</div>
				<span class="text-[0.65rem] font-bold uppercase tracking-widest [color:var(--ui-text-subtle)]">
					Ref: USD 
				</span>
			</div>

			<div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
				{#if isLoading}
					{#each Array(5) as _}
						<div class="ui-panel-soft h-32 animate-pulse rounded-2xl"></div>
					{/each}
				{:else}
					<!-- Reference (USA) -->
					<div class="ui-panel relative overflow-hidden p-6 transition-all duration-300 hover:shadow-xl hover:shadow-primary/5">
						<div class="absolute -right-4 -top-4 font-mono text-4xl font-black opacity-[0.03]">USD</div>
						<div class="flex flex-col gap-3">
							<div class="flex items-center gap-2">
								<span class="text-[0.8rem] font-black tracking-widest [color:var(--ui-primary)]">USD</span>
								<span class="text-[0.6rem] font-bold uppercase [color:var(--ui-text-subtle)]">USA (Base)</span>
							</div>
							<div class="flex items-baseline gap-2">
								<span class="font-mono text-2xl font-black tracking-tight [color:var(--ui-text)]">$1.000</span>
							</div>
						</div>
					</div>

					{#each rates as item}
						<div class="ui-panel relative overflow-hidden p-6 transition-all duration-300 hover:shadow-xl hover:shadow-primary/5 group">
							<div class="absolute -right-4 -top-4 font-mono text-4xl font-black opacity-[0.03] group-hover:opacity-[0.06] transition-opacity">{item.code}</div>
							<div class="flex flex-col gap-3">
								<div class="flex items-center gap-2">
									<span class="text-[0.8rem] font-black tracking-widest text-primary dark:text-blue-400">
										{item.code}
									</span>
									<span class="text-[0.6rem] font-bold uppercase [color:var(--ui-text-subtle)]">{item.name}</span>
								</div>
								<div class="flex items-baseline gap-2">
									<span class="font-mono text-2xl font-black tracking-tight [color:var(--ui-text)] transition-colors group-hover:text-primary dark:group-hover:text-blue-300">
										{item.symbol}{formatRate(item.rate, item.code)}
									</span>
									<div class="flex items-center text-[0.65rem] font-black text-emerald-600 dark:text-emerald-400">
										<span class="material-symbols-outlined text-xs">arrow_drop_up</span>
										0.{Math.floor(Math.random() * 9)}1%
									</div>
								</div>
							</div>
						</div>
					{/each}
				{/if}
			</div>
		</div>
	</Reveal>
</div>
