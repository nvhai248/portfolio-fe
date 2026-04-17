<script lang="ts">
	import { onMount } from 'svelte';
	import { fly, fade, scale } from 'svelte/transition';
	import { cubicOut } from 'svelte/easing';

	interface Props {
		children?: import('svelte').Snippet;
		delay?: number;
		duration?: number;
		type?: 'fade' | 'slide-up' | 'slide-down' | 'slide-left' | 'slide-right' | 'scale';
		threshold?: number;
		once?: boolean;
		class?: string;
	}

	let {
		children,
		delay = 0,
		duration = 1000,
		type = 'slide-up',
		threshold = 0.1,
		once = true,
		class: className = ''
	}: Props = $props();

	let visible = $state(false);
	let element: HTMLElement;

	onMount(() => {
		const observer = new IntersectionObserver(
			(entries) => {
				entries.forEach((entry) => {
					if (entry.isIntersecting) {
						visible = true;
						if (once) observer.unobserve(element);
					} else if (!once) {
						visible = false;
					}
				});
			},
			{ threshold }
		);

		if (element) {
			observer.observe(element);
		}

		return () => observer.disconnect();
	});

	const getTransitionProperties = () => {
		const base = { delay, duration, easing: cubicOut };
		switch (type) {
			case 'fade':
				return { ...base };
			case 'slide-up':
				return { ...base, y: 30 };
			case 'slide-down':
				return { ...base, y: -30 };
			case 'slide-left':
				return { ...base, x: 30 };
			case 'slide-right':
				return { ...base, x: -30 };
			case 'scale':
				return { ...base, start: 0.95 };
			default:
				return { ...base, y: 30 };
		}
	};
</script>

<div bind:this={element} class="reveal-wrapper {className}">
	{#if visible}
		{#if type === 'fade'}
			<div class="reveal-content h-full w-full" in:fade={getTransitionProperties()}>
				{@render children?.()}
			</div>
		{:else if type === 'scale'}
			<div class="reveal-content h-full w-full" in:scale={getTransitionProperties()}>
				{@render children?.()}
			</div>
		{:else}
			<div class="reveal-content h-full w-full" in:fly={getTransitionProperties()}>
				{@render children?.()}
			</div>
		{/if}
	{/if}
</div>

<style>
	.reveal-wrapper {
		display: block;
		width: 100%;
		min-height: 1px;
	}
	.reveal-content {
		will-change: transform, opacity;
	}
</style>
