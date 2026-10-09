<script lang="ts">
	import { resolve } from '$app/paths';
	import { page } from '$app/state';
	import { localeFromPathname } from '$lib/i18n/locale';
	import type { SectionIntroContent } from '$lib/types/content';
	import SystemSculpture from './SystemSculpture.svelte';
	let { tagline, intro, primaryCtaLabel = 'View projects', secondaryCtaLabel = 'Read CV', show3DHero = true }: {
		tagline: string; intro: SectionIntroContent; primaryCtaLabel?: string; secondaryCtaLabel?: string; show3DHero?: boolean;
	} = $props();
	const locale = $derived(localeFromPathname(page.url.pathname));
</script>

<div class="hero-grid" class:hero-text-only={!show3DHero}>
	<div class="hero-copy">
		<p class="mb-6 text-sm font-medium [color:var(--ui-text-muted)]">{tagline}</p>
		<h1 class="hero-title">{intro.title}</h1>
		<p class="ui-body-lg mt-7 max-w-xl">{intro.description}</p>
		<div class="mt-9 flex flex-wrap gap-3">
			<a href={resolve('/[lang=locale]/projects', { lang: locale })} class="ui-btn ui-btn-primary px-7">{primaryCtaLabel}</a>
			<a href={`${resolve('/[lang=locale]/about', { lang: locale })}#cv`} class="ui-btn ui-btn-secondary px-7">{secondaryCtaLabel}</a>
		</div>
	</div>
	{#if show3DHero}<SystemSculpture {locale} />{/if}
</div>

<style>
	.hero-grid { display: grid; align-items: center; gap: 2rem; min-height: 650px; padding-block: 3rem; }
	.hero-copy { position: relative; z-index: 1; }
	.hero-title { font-size: clamp(2.8rem, 5.1vw, 5.1rem); line-height: 1.09; letter-spacing: -.055em; font-weight: 750; max-width: 12ch; text-wrap: balance; color: var(--ui-text); }
	@media (min-width: 1024px) { .hero-grid { grid-template-columns: 1.1fr 1fr; gap: 1rem; } .hero-text-only { grid-template-columns: 1fr; } }
	@media (max-width: 1023px) { .hero-title { max-width: 17ch; } }
</style>
