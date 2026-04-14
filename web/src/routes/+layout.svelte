<script lang="ts">
	import favicon from '$lib/assets/favicon.svg';
	import '../app.css';
	import Header from '$lib/components/layout/Header.svelte';
	import Footer from '$lib/components/layout/Footer.svelte';
	import { onMount } from 'svelte';
	import { theme } from '$lib/stores/theme.svelte';

	let { children } = $props();

	onMount(() => {
		theme.init();
	});
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<a
	href="#main-content"
	class="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-md focus:bg-primary focus:px-3 focus:py-2 focus:text-sm focus:font-semibold focus:text-white"
>
	Skip to main content
</a>

<div class="layout-container flex min-h-screen grow flex-col">
	<Header />
	<main id="main-content" class="flex-1">
		{@render children()}
	</main>
	<Footer />
</div>
