<script lang="ts">
	import { base } from '$app/paths';
	import { urlFor } from '$lib/sanity';
	import { formatPublishedDate, getPostExcerpt } from '$lib/utils/content';

	interface Props {
		post: any;
	}

	let { post }: Props = $props();

	const postSlug = $derived(
		typeof post.slug === 'string' ? post.slug : post.slug?.current
	);
	const postExcerpt = $derived(post.excerpt || getPostExcerpt(post));
</script>

<a href={postSlug ? `${base}/blog/${postSlug}` : `${base}/blog`} class="ui-card-link group">
	{#if post.mainImage}
		<div class="overflow-hidden">
			<img
				src={urlFor(post.mainImage).width(900).height(520).url()}
				alt={post.mainImage.alt || post.title}
				class="aspect-video w-full object-cover transition-transform duration-500 group-hover:scale-105"
				width="900"
				height="520"
				loading="lazy"
				decoding="async"
				fetchpriority="low"
			/>
		</div>
	{:else}
		<div class="aspect-video w-full overflow-hidden" aria-hidden="true">
			<div class="h-full w-full bg-gradient-to-br from-primary/20 via-primary/10 to-[var(--ui-bg-muted)] transition-transform duration-500 group-hover:scale-105"></div>
		</div>
	{/if}
	<div class="flex flex-1 flex-col gap-3 p-5">
		<p class="text-xs font-semibold uppercase tracking-[0.14em] text-primary">Insight</p>
		<h3 class="ui-card-title">{post.title}</h3>
		<p class="line-clamp-3 ui-body">{postExcerpt}</p>
		<p class="mt-auto text-xs [color:var(--ui-text-subtle)]">{formatPublishedDate(post.publishedAt)}</p>
	</div>
</a>

