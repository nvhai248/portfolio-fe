<script lang="ts">
	import { base } from '$app/paths';
	import { urlFor } from '$lib/sanity';
	import { formatPublishedDate, getPostExcerpt } from '$lib/utils/content';

	interface Props {
		post: any;
	}

	let { post }: Props = $props();
</script>

<a href={post.slug?.current ? `${base}/blog/${post.slug.current}` : `${base}/blog`} class="ui-card-link">
	{#if post.mainImage}
		<img
			src={urlFor(post.mainImage).width(900).height(520).url()}
			alt={post.mainImage.alt || post.title}
			class="aspect-video w-full object-cover"
			width="900"
			height="520"
			loading="lazy"
			decoding="async"
			fetchpriority="low"
		/>
	{:else}
		<div class="aspect-video w-full bg-gradient-to-br from-primary/20 via-primary/10 to-[var(--ui-bg-muted)]" aria-hidden="true"></div>
	{/if}
	<div class="flex flex-1 flex-col gap-3 p-5">
		<p class="text-xs font-semibold uppercase tracking-[0.14em] text-primary">Insight</p>
		<h3 class="ui-card-title">{post.title}</h3>
		<p class="line-clamp-3 ui-body">{getPostExcerpt(post)}</p>
		<p class="mt-auto text-xs [color:var(--ui-text-subtle)]">{formatPublishedDate(post.publishedAt)}</p>
	</div>
</a>
