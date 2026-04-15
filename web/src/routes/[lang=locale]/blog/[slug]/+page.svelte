<script lang="ts">
	import { page } from '$app/state';
	import { onMount } from 'svelte';
	import type { PageData } from './$types';
	import SeoHead from '$lib/components/seo/SeoHead.svelte';
	import PortableTextRenderer from '$lib/components/blog/PortableTextRenderer.svelte';
	import { urlFor } from '$lib/sanity';
	import { formatPublishedDate } from '$lib/utils/content';
	import { getDictionary } from '$lib/i18n/dictionary';

	let { data }: { data: PageData } = $props();
	const post = $derived(data.post);
	const t = $derived(getDictionary(data.locale));

	const pageTitle = $derived(`${post.title} | ${t.blog.seoTitle}`);
	const metaDescription = $derived(
		post.excerpt || t.blog.seoDescription
	);

	let scrollProgress = $state(0);

	onMount(() => {
		const updateProgress = () => {
			const scrollTop = window.scrollY;
			const docHeight = document.body.offsetHeight;
			const winHeight = window.innerHeight;
			const scrollPercent = scrollTop / (docHeight - winHeight);
			scrollProgress = Math.min(Math.max(scrollPercent * 100, 0), 100);
		};

		window.addEventListener('scroll', updateProgress);
		updateProgress();
		return () => window.removeEventListener('scroll', updateProgress);
	});
</script>

<SeoHead
	title={pageTitle}
	description={metaDescription}
	pathname={page.url.pathname}
	locale={data.locale}
	type="article"
/>

<!-- Reading progress bar -->
<div class="fixed left-0 top-0 z-[100] h-1 w-full bg-[var(--ui-surface)]/85 backdrop-blur-md">
	<div class="h-full bg-primary transition-all duration-100 ease-out" style="width: {scrollProgress}%;"></div>
</div>

<div class="page-shell max-w-[1200px] py-10 md:px-8 md:py-12">
	<div class="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-12">
		<!-- Sidebar -->
		<aside class="hidden lg:col-span-3 lg:block">
			<div class="sticky top-28 flex flex-col gap-8">
				<div class="flex flex-col gap-2">
					<h3 class="text-xs font-bold uppercase tracking-widest [color:var(--ui-text-subtle)]">Reading Progress</h3>
					<span class="text-sm font-semibold text-primary">{Math.round(scrollProgress)}% Completed</span>
					<div class="h-1.5 w-full overflow-hidden rounded-full bg-[var(--ui-bg-muted)]">
						<div class="h-full bg-primary transition-all duration-100 ease-out" style="width: {scrollProgress}%;"></div>
					</div>
				</div>

				{#if post.readTime || post.categories?.length}
					<div class="flex flex-col gap-2 border-t ui-divider pt-6">
						{#if post.readTime}
							<span class="text-sm [color:var(--ui-text-subtle)]">{post.readTime}</span>
						{/if}
						{#if post.categories?.length}
							<div class="flex flex-wrap gap-1.5">
								{#each post.categories as cat}
									<span class="ui-chip text-[10px] uppercase tracking-widest">{cat}</span>
								{/each}
							</div>
						{/if}
					</div>
				{/if}
			</div>
		</aside>

		<!-- Article content -->
		<article class="lg:col-span-9 xl:col-span-8 xl:col-start-4">
			<header class="mb-10">
				<div class="mb-6 flex flex-wrap items-center gap-2">
					{#if post.categories?.length}
						{#each post.categories as cat}
							<span class="ui-chip text-[10px] uppercase tracking-widest">{cat}</span>
						{/each}
						<span class="[color:var(--ui-text-subtle)]">•</span>
					{/if}
					{#if post.publishedAt}
						<span class="text-sm [color:var(--ui-text-subtle)]">{formatPublishedDate(post.publishedAt)}</span>
					{/if}
					{#if post.readTime}
						<span class="[color:var(--ui-text-subtle)]">•</span>
						<span class="text-sm [color:var(--ui-text-subtle)]">{post.readTime}</span>
					{/if}
				</div>

				<h1 class="ui-heading-hero mb-8">{post.title}</h1>

				{#if post.excerpt}
					<p class="mb-8 text-xl font-light italic leading-relaxed [color:var(--ui-text-subtle)]">
						{post.excerpt}
					</p>
				{/if}

				{#if post.mainImage}
					<img
						src={urlFor(post.mainImage).width(1200).height(630).auto('format').url()}
						alt={post.mainImage.alt || post.title}
						class="mb-8 w-full rounded-xl object-cover"
						width="1200"
						height="630"
						loading="eager"
					/>
				{/if}

				<!-- Author card -->
				<div class="ui-panel-soft flex items-center gap-4 p-4">
					{#if post.author?.image}
						<img
							src={urlFor(post.author.image).width(48).height(48).url()}
							alt={post.author.name}
							class="size-12 rounded-full object-cover"
							width="48"
							height="48"
						/>
					{:else}
						<div class="flex size-12 items-center justify-center rounded-full bg-[var(--ui-bg-muted)] text-[var(--ui-text-subtle)]">
							<span class="material-symbols-outlined text-2xl">person</span>
						</div>
					{/if}
					<div>
						<p class="mb-1 text-sm font-bold leading-none [color:var(--ui-text)]">
							{post.author?.name || 'Nguyen Van Hai'}
						</p>
						<p class="text-xs [color:var(--ui-text-subtle)]">Backend Engineer & System Architect</p>
					</div>
				</div>
			</header>

			<!-- Portable Text body -->
			{#if post.body}
				<PortableTextRenderer value={post.body} />
			{:else}
				<div class="ui-panel rounded-xl border-dashed p-6">
					<p class="ui-body">This post doesn't have content yet. Check back soon!</p>
				</div>
			{/if}

			<!-- Footer navigation -->
			<div class="mt-16 border-t ui-divider pt-8">
				<a class="ui-link text-sm" href={`/${data.locale}/blog`}>← Back to all posts</a>
			</div>
		</article>
	</div>
</div>
