<script lang="ts">
	interface Props {
		active?: boolean;
	}

	let { active = false }: Props = $props();

	let progress = $state(0);
	let visible = $state(false);
	let hideTimer: ReturnType<typeof setTimeout> | undefined;
	let incrementTimer: ReturnType<typeof setInterval> | undefined;

	$effect(() => {
		if (active) {
			if (hideTimer) clearTimeout(hideTimer);
			if (incrementTimer) clearInterval(incrementTimer);

			visible = true;
			progress = 0.1;

			// Gradually increase progress while active
			incrementTimer = setInterval(() => {
				// Move towards 95% 
				progress += (0.95 - progress) * 0.1;
			}, 100);
		} else {
			if (incrementTimer) {
				clearInterval(incrementTimer);
				incrementTimer = undefined;
			}

			// When deactivated, quickly finish to 100% and fade out
			if (visible) {
				progress = 1;
				hideTimer = setTimeout(() => {
					visible = false;
					setTimeout(() => {
						progress = 0;
					}, 300); // Reset progress after it fades out
				}, 400); // Stay at 100% for 400ms before fading
			}
		}
	});
</script>

<div
	class="pointer-events-none fixed inset-x-0 top-0 z-[9999] h-[3px] print:hidden transition-opacity duration-300 ease-linear {visible ? 'opacity-100' : 'opacity-0'}"
	role="progressbar"
	aria-live="polite"
	aria-label="Loading next page"
	aria-valuemin="0"
	aria-valuemax="100"
	aria-valuenow={Math.round(progress * 100)}
>
	{#if visible || progress > 0}
		<div
			class="relative h-full bg-primary transition-all duration-200 ease-out shadow-[0_0_10px_var(--ui-primary)]"
			style="width: {progress * 100}%;"
		>
			<!-- Glow effect at the tip of the progress bar -->
			<div 
				class="absolute right-0 top-0 h-full w-24 translate-x-1/2 opacity-80 mix-blend-screen" 
				style="box-shadow: 0 0 10px var(--ui-primary), 0 0 5px var(--ui-primary);"
				aria-hidden="true"
			></div>
		</div>
	{/if}
</div>
