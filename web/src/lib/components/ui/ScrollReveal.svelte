<script lang="ts">
	import { onMount, type Snippet } from 'svelte';

	interface Props {
		children?: Snippet;
		delay?: number;
		duration?: number;
		type?: 'fade' | 'slide-up' | 'slide-down' | 'slide-left' | 'slide-right' | 'scale';
		threshold?: number;
		once?: boolean;
		class?: string;
	}

	let { children, delay = 0, duration = 600, type = 'slide-up', threshold = 0.05, once = true, class: className = '' }: Props = $props();
	let element: HTMLDivElement;
	let state = $state<'idle' | 'pending' | 'visible'>('idle');
	const x = $derived(type === 'slide-left' ? 20 : type === 'slide-right' ? -20 : 0);
	const y = $derived(type === 'slide-up' ? 24 : type === 'slide-down' ? -24 : 0);

	onMount(() => {
		const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
		const observer = new IntersectionObserver((entries) => {
			for (const entry of entries) {
				if (entry.isIntersecting) reveal();
				else if (!once && !preference.matches) state = 'pending';
			}
		}, { threshold, rootMargin: '0px 0px -24px 0px' });

		function reveal() {
			state = 'visible';
			if (once) observer.disconnect();
		}
		const showWithoutMotion = () => {
			if (preference.matches) {
				state = 'visible';
				observer.disconnect();
			}
		};
		if (preference.matches || element.getBoundingClientRect().top < window.innerHeight - 24) {
			reveal();
		} else {
			state = 'pending';
			observer.observe(element);
		}
		if (!once && !preference.matches) observer.observe(element);
		preference.addEventListener('change', showWithoutMotion);
		element.addEventListener('focusin', reveal);
		return () => {
			observer.disconnect();
			preference.removeEventListener('change', showWithoutMotion);
			element.removeEventListener('focusin', reveal);
		};
	});
</script>

<div bind:this={element} class="scroll-reveal {className}" data-state={state} style={`--reveal-x: ${x}px; --reveal-y: ${y}px; --reveal-scale: ${type === 'scale' ? 0.97 : 1}; --reveal-delay: ${delay}ms; --reveal-duration: ${duration}ms;`}>
	<div class="scroll-content">
		{@render children?.()}
	</div>
</div>

<style>
	.scroll-reveal, .scroll-content {
		width: 100%;
		min-width: 0;
	}
	.scroll-content {
		transition: opacity var(--reveal-duration) cubic-bezier(0.16, 1, 0.3, 1),
			translate var(--reveal-duration) cubic-bezier(0.16, 1, 0.3, 1),
			scale var(--reveal-duration) cubic-bezier(0.16, 1, 0.3, 1);
		transition-delay: var(--reveal-delay);
	}
	.scroll-reveal[data-state='pending'] > .scroll-content {
		opacity: 0;
		translate: var(--reveal-x) var(--reveal-y);
		scale: var(--reveal-scale);
	}
	.scroll-reveal[data-state='visible'] > .scroll-content {
		opacity: 1;
		translate: none;
		scale: none;
	}
	.scroll-reveal:focus-within > .scroll-content {
		opacity: 1;
		translate: none;
		scale: none;
		transition: none;
	}
	@media (prefers-reduced-motion: reduce) {
		.scroll-reveal[data-state] > .scroll-content {
			opacity: 1;
			translate: none;
			scale: none;
			transition: none;
		}
	}
	@media print {
		.scroll-reveal[data-state] > .scroll-content {
			opacity: 1;
			translate: none;
			scale: none;
			transition: none;
		}
	}
</style>
