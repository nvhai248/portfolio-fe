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

<div class="glass-card glow-on-hover relative overflow-hidden rounded-3xl p-8 shadow-2xl transition-all duration-500 hover:border-blue-500/30">
	<!-- Decorative background pulse -->
	<div class="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-blue-500/5 blur-[80px]"></div>

	<Reveal type="fade" delay={500} duration={800}>
		<div class="mb-6 flex items-center justify-between">
			<h2 class="text-[0.65rem] font-bold uppercase tracking-[0.25em] text-blue-400">
				System status
			</h2>
			<div class="flex items-center gap-2">
				<span class="relative flex h-2 w-2">
					<span class="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
					<span class="relative inline-flex h-2 w-2 rounded-full bg-emerald-500"></span>
				</span>
				<span class="text-[0.6rem] font-bold uppercase tracking-widest text-emerald-500/80">Online</span>
			</div>
		</div>
	</Reveal>

	<div class="space-y-8">
		<MetricList items={highlights} baseDelay={600} />

		{#if socials?.length}
			<div class="border-t border-white/5 pt-6">
				<Reveal type="fade" delay={900} duration={800}>
					<SocialLinkList items={socials} />
				</Reveal>
			</div>
		{/if}
	</div>
</div>
