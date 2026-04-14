<script lang="ts">
	import type { LabeledContentItem } from '$lib/types/content';

	interface Props {
		title: string;
		items: LabeledContentItem[];
	}

	let { title, items }: Props = $props();
</script>

<div class="ui-panel rounded-2xl p-6 sm:p-8">
	<h2 class="ui-heading-2 break-words">{title}</h2>
	<ul class="mt-5 space-y-3 ui-body">
		{#each items as item}
			<li class="break-words">
				<strong class="[color:var(--ui-text)]">{item.label}:</strong> {item.text}
			</li>
		{/each}
	</ul>
</div>
