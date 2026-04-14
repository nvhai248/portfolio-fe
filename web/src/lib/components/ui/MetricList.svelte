<script lang="ts">
	import type { MetricItem } from '$lib/types/content';

	interface Props {
		items: MetricItem[];
	}

	let { items }: Props = $props();
</script>

<ul class="space-y-4">
	{#each items as item}
		<li class="flex items-start justify-between gap-4 border-b ui-divider pb-3 text-sm last:border-b-0 last:pb-0">
			<span class="[color:var(--ui-text-muted)]">{item.label}</span>
			<span class="text-right font-semibold [color:var(--ui-text)]">{item.value}</span>
		</li>
	{/each}
</ul>
