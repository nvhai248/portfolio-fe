<script lang="ts">
	import { base } from '$app/paths';
	import type { Post } from '$lib/types/content';
	import BlogActivityChart from './BlogActivityChart.svelte';
	import { getHomeContent } from '$lib/content/home';
	import { page } from '$app/state';
	import { localeFromPathname } from '$lib/i18n/locale';
	import Reveal from '$lib/components/ui/Reveal.svelte';
	import RecentPostCard from '$lib/components/sections/RecentPostCard.svelte';
	import CtaBlock from '$lib/components/ui/CtaBlock.svelte';

	interface Props {
		title: string;
		description: string;
		posts: Post[];
	}

	let { title, description, posts }: Props = $props();
	const locale = $derived(localeFromPathname(page.url.pathname));
	const homeContent = $derived(getHomeContent(locale));
</script>

<Reveal type="fade" delay={200} duration={1200}>
	<section class="py-24 lg:py-32">
		<div class="mb-20 flex flex-col gap-12 lg:flex-row lg:items-end lg:justify-between">
			<div class="max-w-2xl">
				<h2 class="ui-heading-1 mb-6 uppercase tracking-tighter">{title}</h2>
				<p class="ui-body-lg max-w-xl">{description}</p>
				<a href={`${base}/blog`} class="ui-link mt-8 inline-flex items-center gap-2 text-sm uppercase tracking-widest">
					Explore articles
					<span class="material-symbols-outlined text-base">arrow_forward</span>
				</a>
			</div>
			
			<div class="w-full max-w-md">
				<div class="mb-4 flex items-center justify-between px-1">
					<span class="text-[0.65rem] font-black uppercase tracking-[0.2em] [color:var(--ui-text-subtle)]">Activity Index</span>
					<span class="text-[0.65rem] font-bold [color:var(--ui-text-subtle)]">12M Window</span>
				</div>
				<div class="rounded-2xl border [border-color:var(--ui-border)] bg-primary/2 dark:bg-white/2 p-2">
					<BlogActivityChart {posts} />
				</div>
			</div>
		</div>

		{#if posts?.length}
			<div class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
				{#each posts as post, i}
					<Reveal type="slide-up" delay={300 + i * 100}>
						<RecentPostCard {post} />
					</Reveal>
				{/each}
			</div>
		{:else}
			<CtaBlock
				title={homeContent.recentInsights.fallbackTitle}
				description={homeContent.recentInsights.fallbackDescription}
				href={`${base}/blog`}
				label="Visit Blog"
			/>
		{/if}
	</section>
</Reveal>
