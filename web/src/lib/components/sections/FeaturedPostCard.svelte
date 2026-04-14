<script lang="ts">
	import { base } from '$app/paths';
	import type { FeaturedPost } from '$lib/types/content';

	interface Props {
		post: FeaturedPost;
	}

	let { post }: Props = $props();
</script>

<article class="ui-panel rounded-2xl p-6">
	<div class="flex flex-wrap items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] [color:var(--ui-text-subtle)]">
		<span>{post.date}</span>
		<span aria-hidden="true">•</span>
		<span>{post.readTime}</span>
	</div>
	<h2 class="ui-heading-2 mt-3">{post.title}</h2>
	<p class="ui-body mt-3">{post.description}</p>
	<div class="mt-4 flex flex-wrap gap-2">
		{#each post.tags as tag}
			<span class="ui-chip">{tag}</span>
		{/each}
	</div>
	<a href={`${base}/blog/${post.slug}`} class="ui-link mt-6 inline-flex items-center gap-2 text-sm">
		Read article
		<span class="material-symbols-outlined text-base">arrow_forward</span>
	</a>
</article>
