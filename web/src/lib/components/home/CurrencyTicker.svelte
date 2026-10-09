<script lang="ts">
	import { onMount } from 'svelte';
	import { fetchCurrencyRates, type CurrencyRate } from '$lib/services/currency';
	import Reveal from '$lib/components/ui/ScrollReveal.svelte';
	import { page } from '$app/state';
	import { localeFromPathname } from '$lib/i18n/locale';
	import CurrencyCard from './CurrencyCard.svelte';

	let rates: CurrencyRate[] = $state([]);
	let isLoading = $state(true);
	const isVietnamese = $derived(localeFromPathname(page.url.pathname) === 'vi');

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
	<Reveal type="slide-up" duration={600}>
		<div class="space-y-8">
			<div class="flex items-center justify-between border-b pb-6 [border-color:var(--ui-border)]">
				<div class="flex items-center gap-3">
					<span class="relative flex h-2.5 w-2.5">
						<span class="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
						<span class="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500"></span>
					</span>
					<h3 class="text-[0.75rem] font-black uppercase tracking-[0.35em] [color:var(--ui-primary)] dark:text-blue-400">
						{isVietnamese ? 'Một góc theo dõi tỷ giá' : 'Global Market Data'}
					</h3>
				</div>
				<span class="text-[0.65rem] font-bold uppercase tracking-widest [color:var(--ui-text-subtle)]">
					{isVietnamese ? 'So với USD' : 'Ref: USD'}
				</span>
			</div>

			<div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
				{#if isLoading}
					{#each Array(5) as _, index (index)}
						<div class="ui-panel-soft h-64 rounded-2xl"></div>
					{/each}
				{:else}
					<CurrencyCard code="USD" name={isVietnamese ? 'Đồng tiền tham chiếu' : 'Reference currency'} value="$1.000" symbol="$" />
					{#each rates as item (item.code)}
						<CurrencyCard code={item.code} name={item.name} value={`${item.symbol}${formatRate(item.rate, item.code)}`} symbol={item.symbol} />
					{/each}
				{/if}
			</div>
		</div>
	</Reveal>
</div>
