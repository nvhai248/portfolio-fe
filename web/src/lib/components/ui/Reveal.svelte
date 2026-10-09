<script lang="ts">
	import type { ComponentProps } from 'svelte';
	import ScrollReveal from './ScrollReveal.svelte';

	let props: ComponentProps<typeof ScrollReveal> = $props();
</script>

<ScrollReveal {...props} />
