<script lang="ts">
	import type { ProfilePrinciples } from '$lib/content/profile';
	let { content }: { content: ProfilePrinciples } = $props();
</script>

<section aria-labelledby="profile-direction" class="page-shell max-w-5xl pb-14 sm:pb-16">
	<h2 id="profile-direction" class="ui-heading-2 mb-6 sm:mb-8">{content.directionTitle}</h2>
	<div class="principle-direction-grid grid overflow-hidden rounded-2xl border md:grid-cols-2">
		{#each content.directions as item (item.heading)}
			<article class="principle-direction-card min-w-0 p-6 sm:p-8">
				<h3 class="break-words text-xl font-semibold tracking-tight sm:text-2xl">{item.heading}</h3>
				<p class="ui-body mt-4 max-w-lg break-words">{item.body}</p>
			</article>
		{/each}
	</div>
</section>

<section aria-labelledby="profile-values" class="page-shell max-w-5xl pb-20">
	<h2 id="profile-values" class="ui-heading-2 mb-6 sm:mb-8">{content.valuesTitle}</h2>
	<div class="principle-values-grid grid overflow-hidden rounded-2xl border sm:grid-cols-2">
		{#each content.values as item (item.heading)}
			<article class="principle-value-card flex min-w-0 gap-4 p-5 sm:gap-5 sm:p-6">
				<span class="principle-value-marker mt-2 shrink-0" aria-hidden="true"></span>
				<div class="min-w-0">
					<h3 class="break-words text-base font-semibold tracking-tight sm:text-lg">{item.heading}</h3>
					<p class="ui-body mt-2 break-words">{item.body}</p>
				</div>
			</article>
		{/each}
	</div>
</section>

<style>
	.principle-direction-grid,
	.principle-values-grid {
		border-color: var(--ui-border);
	}

	.principle-direction-grid {
		background-color: var(--ui-surface);
	}

	.principle-direction-card {
		position: relative;
		isolation: isolate;
	}

	.principle-direction-card::before {
		position: absolute;
		inset: 0 0 auto;
		height: 2px;
		background-color: var(--ui-primary);
		content: '';
		transform: scaleX(1);
		transform-origin: left;
		transition: transform 650ms cubic-bezier(0.16, 1, 0.3, 1) 120ms;
	}

	.principle-direction-card + .principle-direction-card {
		border-top: 1px solid var(--ui-border);
	}

	.principle-direction-card:global([data-profile-reveal='pending'])::before {
		transform: scaleX(0);
	}

	.principle-values-grid {
		background-color: var(--ui-bg-muted);
	}

	.principle-value-card + .principle-value-card {
		border-top: 1px solid var(--ui-border);
	}

	.principle-value-marker {
		width: 0.625rem;
		height: 0.625rem;
		border: 1px solid var(--ui-primary);
		border-radius: 999px;
		background-color: var(--ui-primary-soft);
		transform: scale(1);
		transition: background-color 300ms ease, box-shadow 300ms ease, transform 500ms cubic-bezier(0.16, 1, 0.3, 1) 140ms;
	}

	.principle-value-card:global([data-profile-reveal='pending']) .principle-value-marker {
		transform: scale(0.5);
	}

	.principle-value-card:global([data-profile-reveal='visible']) .principle-value-marker {
		background-color: var(--ui-primary);
		box-shadow: 0 0 0 0.3rem var(--ui-primary-softer);
	}

	@media (min-width: 48rem) {
		.principle-direction-card + .principle-direction-card {
			border-top: 0;
			border-left: 1px solid var(--ui-border);
		}
	}

	@media (min-width: 40rem) {
		.principle-value-card:nth-child(even) {
			border-left: 1px solid var(--ui-border);
		}

		.principle-value-card:nth-child(2) {
			border-top: 0;
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.principle-direction-card::before,
		.principle-value-marker {
			transition: none;
		}

		.principle-direction-card:global([data-profile-reveal='pending'])::before {
			transform: scaleX(1);
		}

		.principle-value-card:global([data-profile-reveal='pending']) .principle-value-marker {
			transform: scale(1);
		}
	}
</style>
