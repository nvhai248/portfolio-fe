<script lang="ts">
	import type { ProfilePrinciples } from '$lib/content/profile';
	let { content }: { content: ProfilePrinciples } = $props();
</script>

<section aria-labelledby="profile-direction" class="page-shell max-w-5xl pb-14 sm:pb-16">
	<h2 id="profile-direction" class="ui-heading-2 mb-6">{content.directionTitle}</h2>
	<div class="grid gap-4 sm:gap-5 md:grid-cols-2">
		{#each content.directions as item (item.heading)}
			<article class="ui-panel p-5 sm:p-6">
				<h3 class="ui-heading-3 break-words">{item.heading}</h3>
				<p class="ui-body mt-3 break-words">{item.body}</p>
			</article>
		{/each}
	</div>
</section>

<section aria-labelledby="profile-values" class="page-shell max-w-5xl pb-20">
	<h2 id="profile-values" class="ui-heading-2 mb-6">{content.valuesTitle}</h2>
	<div class="grid gap-4 sm:gap-5 md:grid-cols-2">
		{#each content.values as item (item.heading)}
			<article class="ui-panel p-5 sm:p-6">
				<h3 class="ui-heading-3 break-words">{item.heading}</h3>
				<p class="ui-body mt-3 break-words">{item.body}</p>
			</article>
		{/each}
	</div>
</section>
