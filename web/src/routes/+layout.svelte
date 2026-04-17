<script lang="ts">
	import favicon from '$lib/assets/favicon.svg';
	import '../app.css';
	import Header from '$lib/components/layout/Header.svelte';
	import Footer from '$lib/components/layout/Footer.svelte';
	import RouteLoadingBar from '$lib/components/ui/RouteLoadingBar.svelte';
	import InteractiveGrid from '$lib/components/layout/InteractiveGrid.svelte';
	import { onMount } from 'svelte';
	import { navigating, page } from '$app/state';
	import { theme } from '$lib/stores/theme.svelte';
	import { getPersonSchema, getWebsiteSchema } from '$lib/seo/schema';
	import { getDictionary } from '$lib/i18n/dictionary';
	import { onNavigate } from '$app/navigation';
	import { localeFromPathname } from '$lib/i18n/locale';

	let { children } = $props();
	let showNavigationFeedback = $state(false);

	let revealTimer: ReturnType<typeof setTimeout> | undefined;
	let hideTimer: ReturnType<typeof setTimeout> | undefined;

	onMount(() => {
		theme.init();

		return () => {
			if (revealTimer) clearTimeout(revealTimer);
			if (hideTimer) clearTimeout(hideTimer);
		};
	});

	const isNavigating = $derived(Boolean(navigating.to));
	const locale = $derived(localeFromPathname(page.url.pathname));
	const t = $derived(getDictionary(locale));
	const personSchema = $derived(getPersonSchema(page.url.origin, locale));
	const websiteSchema = $derived(getWebsiteSchema(page.url.origin, locale));
	const stringifySchema = (payload: Record<string, unknown>): string => JSON.stringify(payload).replace(/</g, '\\u003c');

	$effect(() => {
		if (isNavigating) {
			if (hideTimer) {
				clearTimeout(hideTimer);
				hideTimer = undefined;
			}

			if (!showNavigationFeedback && !revealTimer) {
				revealTimer = setTimeout(() => {
					showNavigationFeedback = true;
					revealTimer = undefined;
				}, 120);
			}

			return;
		}

		if (revealTimer) {
			clearTimeout(revealTimer);
			revealTimer = undefined;
		}

		if (showNavigationFeedback && !hideTimer) {
			hideTimer = setTimeout(() => {
				showNavigationFeedback = false;
				hideTimer = undefined;
			}, 180);
		}
	});

	onNavigate((navigation) => {
		if (!document.startViewTransition) return;

		return new Promise((resolve) => {
			document.startViewTransition(async () => {
				resolve();
				await navigation.complete;
			});
		});
	});
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
	{t.skipToContent}
</a>

<RouteLoadingBar active={showNavigationFeedback} />
<InteractiveGrid />

<div class="layout-container flex min-h-screen grow flex-col">
	<Header />
	<div class="relative flex-1">
		<main
			id="main-content"
			class="flex-1 transition-opacity duration-200 {showNavigationFeedback ? 'opacity-50 pointer-events-none blur-[1px]' : ''}"
			data-testid="main-content"
			aria-busy={showNavigationFeedback ? 'true' : undefined}
		>
			{@render children()}
		</main>
	</div>
	<Footer />
</div>
