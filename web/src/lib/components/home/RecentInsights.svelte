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
	<section class="pb-16 pt-8">
		<div class="mb-12 flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
			<div class="max-w-xl">
				<h2 class="ui-heading-2">{title}</h2>
				<p class="ui-body mt-3">{description}</p>
				<a href={`${base}/blog`} class="ui-link mt-6 inline-flex items-center gap-2 text-sm">
					See all posts
					<span class="material-symbols-outlined text-sm">arrow_forward</span>
				</a>
			</div>
			
			<div class="w-full max-w-md">
				<div class="mb-2 flex items-center justify-between px-1">
					<span class="text-[0.6rem] font-bold uppercase tracking-widest text-slate-500">Writing Activity</span>
					<span class="text-[0.6rem] font-medium text-slate-600">Last 12 Months</span>
				</div>
				<BlogActivityChart {posts} />
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
