<script lang="ts">
	import type { MetricItem, SocialProfile } from '$lib/types/content';
	import MetricList from '$lib/components/ui/MetricList.svelte';
	import SocialLinkList from '$lib/components/ui/SocialLinkList.svelte';
	import Reveal from '$lib/components/ui/Reveal.svelte';

	interface Props {
		highlights: MetricItem[];
		socials?: SocialProfile[];
	}

	let { highlights, socials }: Props = $props();
</script>

<div class="ui-panel relative overflow-hidden rounded-[2.5rem] p-10 shadow-2xl transition-all duration-500 hover:border-primary/30 dark:hover:border-blue-500/30">
	<!-- Decorative background pulse -->
	<div class="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-primary/5 blur-[80px] dark:bg-blue-500/5"></div>

	<Reveal type="fade" delay={500} duration={800}>
		<div class="mb-10 flex items-center justify-between">
			<h2 class="text-[0.7rem] font-black uppercase tracking-[0.35em] [color:var(--ui-primary)] dark:text-blue-400">
				System Index
			</h2>
			<div class="flex items-center gap-2">
				<span class="relative flex h-2.5 w-2.5">
					<span class="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
					<span class="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500"></span>
				</span>
				<span class="text-[0.65rem] font-black uppercase tracking-[0.2em] text-emerald-600 dark:text-emerald-400">Live Status</span>
			</div>
		</div>
	</Reveal>

	<div class="grid gap-12 lg:grid-cols-[1fr_auto]">
		<div class="space-y-10">
			<MetricList items={highlights} baseDelay={600} />
		</div>

		{#if socials?.length}
			<div class="border-t [border-color:var(--ui-border)] pt-8 lg:border-l lg:border-t-0 lg:pl-12 lg:pt-0">
				<h3 class="mb-6 text-[0.6rem] font-black uppercase tracking-widest [color:var(--ui-text-subtle)]">Connect</h3>
				<Reveal type="fade" delay={900} duration={800}>
					<SocialLinkList items={socials} />
				</Reveal>
			</div>
		{/if}
	</div>
</div>
