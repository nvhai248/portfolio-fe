<script lang="ts">
	import { onMount, type Component } from 'svelte';
	import { base } from '$app/paths';
	import { theme } from '$lib/stores/theme.svelte';
	import type { SectionIntroContent } from '$lib/types/content';
	import Reveal from '$lib/components/ui/Reveal.svelte';
	import GeoHUD from './GeoHUD.svelte';

	interface Props {
		tagline: string;
		intro: SectionIntroContent;
		primaryCtaLabel?: string;
		secondaryCtaLabel?: string;
		show3DHero?: boolean;
	}

	let {
		tagline,
		intro,
		primaryCtaLabel = 'View Projects',
		secondaryCtaLabel = 'Read CV',
		show3DHero = true
	}: Props = $props();

	// Responsive Layout State
	let innerWidth = $state(typeof window !== 'undefined' ? window.innerWidth : 1024);
	let isMobile = $derived(innerWidth < 768);
	let isTablet = $derived(innerWidth >= 768 && innerWidth < 1024);

	// Animation Architecture: System to handle progressive loading
	let show3D = $state(false);
	let isLowPerformance = $state(false);
	let SceneComponent: Component<any> | undefined = $state();
	let pointer = $state({ x: 0, y: 0 });
	let scrollProgress = $state(0);
	let sectionElement: HTMLElement;

	onMount(async () => {
		if (!show3DHero) return; // Honor CMS toggle

		const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
		const isLikelyLowEnd =
			(navigator as any).deviceMemory !== undefined && (navigator as any).deviceMemory < 4;

		if (!prefersReducedMotion && !isLikelyLowEnd) {
			// Lazy load the heavy 3D components
			const { default: LoadedScene } = await import('./Scene.svelte');
			SceneComponent = LoadedScene;

			const timer = setTimeout(() => {
				show3D = true;
			}, 800);

			const onPointerMove = (e: PointerEvent) => {
				pointer.x = (e.clientX / window.innerWidth) * 2 - 1;
				pointer.y = -(e.clientY / window.innerHeight) * 2 + 1;
			};

			const onScroll = () => {
				if (!sectionElement) return;
				scrollProgress = Math.min(window.scrollY / sectionElement.offsetHeight, 1.2);
			};

			window.addEventListener('pointermove', onPointerMove);
			window.addEventListener('scroll', onScroll);

			return () => {
				clearTimeout(timer);
				window.removeEventListener('pointermove', onPointerMove);
				window.removeEventListener('scroll', onScroll);
			};
		} else {
			isLowPerformance = true;
		}
	});
</script>

<svelte:window bind:innerWidth />

<div
	bind:this={sectionElement}
	class="relative flex min-h-[70vh] flex-col justify-center py-10 lg:min-h-[85vh] lg:py-0"
>
	<!-- Real-time GeoHUD (Top Right) -->
	<div class="absolute right-0 top-10 z-20 hidden lg:block">
		<GeoHUD />
	</div>
	<div class="relative z-10 max-w-4xl space-y-8">
		<Reveal type="slide-up" delay={100} duration={800}>
			<div class="inline-flex items-center gap-2.5 rounded-full border border-primary/10 bg-primary/5 px-4 py-1.5 text-[0.7rem] font-bold uppercase tracking-[0.2em] text-primary backdrop-blur-md dark:border-blue-500/20 dark:bg-blue-500/5 dark:text-blue-400">
				<span class="relative flex h-2 w-2">
					<span class="absolute inline-flex h-full w-full animate-ping rounded-full bg-blue-400 opacity-75"></span>
					<span class="relative inline-flex h-2 w-2 rounded-full bg-blue-500"></span>
				</span>
				{tagline}
			</div>
		</Reveal>
		<Reveal type="slide-up" delay={200} duration={800}>
			<h1 class="ui-heading-hero">
				{@html intro.title.replace('backend systems', '<span class="accent">backend systems</span>')}
			</h1>
		</Reveal>
		<Reveal type="slide-up" delay={300} duration={800}>
			<p class="ui-body-lg max-w-2xl">{intro.description}</p>
		</Reveal>
		<Reveal type="slide-up" delay={400} duration={800}>
			<div class="flex flex-wrap gap-4 pt-4">
				<a href={`${base}/projects`} class="ui-btn ui-btn-primary glow-on-hover px-10">
					{primaryCtaLabel}
				</a>
				<a href={`${base}/cv`} class="ui-btn ui-btn-secondary px-8 backdrop-blur-md transition-all hover:border-blue-500/50">
					{secondaryCtaLabel}
				</a>
			</div>
		</Reveal>
	</div>

	<!-- 3D Hero Canvas Container -->
	<div class="absolute inset-y-0 right-0 -z-10 w-full opacity-60 mix-blend-screen pointer-events-none lg:w-2/3 lg:opacity-100 lg:mix-blend-normal">
		{#if show3D && SceneComponent}
			<div
				class="h-full w-full animate-in fade-in zoom-in duration-1000"
				aria-hidden="true"
			>
				<SceneComponent
					isDark={theme.current === 'dark'}
					{isMobile}
					{isTablet}
					{pointer}
					{scrollProgress}
				/>
			</div>
		{:else if isLowPerformance}
			<div class="h-full w-full lg:aspect-square animate-in fade-in duration-500" aria-hidden="true">
				<div
					class="flex h-full w-full items-center justify-center rounded-3xl bg-gradient-to-br from-primary/10 to-transparent lg:visible invisible"
				>
					<span class="material-symbols-outlined text-4xl text-primary/20">deployed_code</span>
				</div>
			</div>
		{/if}
	</div>
</div>
