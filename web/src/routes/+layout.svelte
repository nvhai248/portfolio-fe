<script lang="ts">
	import favicon from '$lib/assets/favicon.svg';
	import '../app.css';
	import Header from '$lib/components/layout/Header.svelte';
	import Footer from '$lib/components/layout/Footer.svelte';
	import { onMount } from 'svelte';
	import { page } from '$app/state';
	import { theme } from '$lib/stores/theme.svelte';
	import { getPersonSchema, getWebsiteSchema } from '$lib/seo/schema';

	let { children } = $props();

	onMount(() => {
		theme.init();
	});

	const personSchema = $derived(getPersonSchema(page.url.origin));
	const websiteSchema = $derived(getWebsiteSchema(page.url.origin));
	const stringifySchema = (payload: Record<string, unknown>): string =>
		JSON.stringify(payload).replace(/</g, '\\u003c');
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
	<link rel="preconnect" href="https://fonts.googleapis.com" />
	<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous" />
	<script>
		{`try {
			const key = 'theme';
			const saved = localStorage.getItem(key);
			const shouldUseDark = saved ? saved === 'dark' : window.matchMedia('(prefers-color-scheme: dark)').matches;
			document.documentElement.classList.toggle('dark', shouldUseDark);
		} catch {
			// ignore storage access errors
		}`}
	</script>
	<script type="application/ld+json">{stringifySchema(personSchema)}</script>
	<script type="application/ld+json">{stringifySchema(websiteSchema)}</script>
</svelte:head>

<a
	href="#main-content"
	class="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-md focus:bg-primary focus:px-3 focus:py-2 focus:text-sm focus:font-semibold focus:text-white"
>
	Skip to main content
</a>

<div class="layout-container flex min-h-screen grow flex-col">
	<Header />
	<main id="main-content" class="flex-1" data-testid="main-content">
		{@render children()}
	</main>
	<Footer />
</div>
