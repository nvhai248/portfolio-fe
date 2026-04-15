<script lang="ts">
	import { urlFor } from '$lib/sanity';

	let { portableText }: { portableText: any } = $props();
	const imageValue = $derived(portableText?.value);
</script>

{#if imageValue?.asset}
	<figure class="my-10">
		<img
			src={urlFor(imageValue).width(1200).auto('format').url()}
			alt={imageValue.alt || ''}
			class="w-full rounded-xl"
			loading="lazy"
			decoding="async"
		/>
		{#if imageValue.alt}
			<figcaption class="mt-3 text-center text-sm [color:var(--ui-text-subtle)]">
				{imageValue.alt}
			</figcaption>
		{/if}
	</figure>
{/if}
