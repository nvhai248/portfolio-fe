<script lang="ts">
	import type { MetricItem, SocialProfile } from '$lib/types/content';
	import MetricList from '$lib/components/ui/MetricList.svelte';
	import SocialLinkList from '$lib/components/ui/SocialLinkList.svelte';
	import Reveal from '$lib/components/ui/ScrollReveal.svelte';
	import { page } from '$app/state';
	import { localeFromPathname } from '$lib/i18n/locale';

	interface Props {
		highlights: MetricItem[];
		socials?: SocialProfile[];
	}

	let { highlights, socials }: Props = $props();
	const isVietnamese = $derived(localeFromPathname(page.url.pathname) === 'vi');
</script>

<div class="relative border-y [border-color:var(--ui-border)] py-10 sm:py-14">

	<Reveal type="slide-right" duration={600}>
		<div class="mb-10 flex items-center justify-between">
			<h2 class="ui-heading-2">
				{isVietnamese ? 'Một chút về tôi' : 'System Index'}
			</h2>
		</div>
	</Reveal>

	<div class="grid gap-12 lg:grid-cols-[1fr_auto]">
		<div class="space-y-10">
			<MetricList items={highlights} baseDelay={60} />
		</div>

		{#if socials?.length}
			<div class="border-t [border-color:var(--ui-border)] pt-8 lg:border-l lg:border-t-0 lg:pl-12 lg:pt-0">
				<h3 class="mb-6 text-sm [color:var(--ui-text-muted)]">{isVietnamese ? 'Bạn cũng có thể tìm tôi ở đây' : 'Connect'}</h3>
				<Reveal type="slide-up" delay={120} duration={600}>
					<SocialLinkList items={socials} />
				</Reveal>
			</div>
		{/if}
	</div>
</div>
