<script lang="ts">
	import { base } from '$app/paths';
	import type { Post } from '$lib/types/content';
	import BlogActivityChart from './BlogActivityChart.svelte';
	import { getHomeContent } from '$lib/content/home';
	import { page } from '$app/state';
	import { localeFromPathname } from '$lib/i18n/locale';
	import Reveal from '$lib/components/ui/ScrollReveal.svelte';
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

<section class="py-24 lg:py-32">
	<div class="mb-20 flex flex-col gap-12 lg:flex-row lg:items-end lg:justify-between">
		<Reveal type="slide-right" class="lg:flex-1">
			<div class="max-w-2xl">
				<h2 class="ui-heading-1 mb-6 uppercase tracking-tighter">{title}</h2>
				<p class="ui-body-lg max-w-xl">{description}</p>
				<a href={`${base}/blog`} class="ui-link mt-8 inline-flex items-center gap-2 text-sm uppercase tracking-widest">
					{locale === 'vi' ? 'Đọc thêm bài viết' : 'Explore articles'}
					<span class="material-symbols-outlined text-base">arrow_forward</span>
				</a>
			</div>

		</Reveal>
		<Reveal type="slide-left" delay={60} class="max-w-md lg:flex-1">
			<div class="w-full max-w-md">
				<div class="mb-4 flex items-center justify-between px-1">
					<span class="text-[0.65rem] font-black uppercase tracking-[0.2em] [color:var(--ui-text-subtle)]">{locale === 'vi' ? 'Nhịp viết của tôi' : 'Activity Index'}</span>
					<span class="text-[0.65rem] font-bold [color:var(--ui-text-subtle)]">{locale === 'vi' ? '12 tháng qua' : '12M Window'}</span>
				</div>
				<BlogActivityChart {posts} {locale} />
			</div>
		</Reveal>
	</div>

	{#if posts?.length}
		<div class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
			{#each posts as post, i (post._id)}
				<Reveal type="slide-up" delay={(i % 3) * 60}>
					<RecentPostCard {post} />
				</Reveal>
			{/each}
		</div>
	{:else}
		<Reveal type="slide-up">
			<CtaBlock
				title={homeContent.recentInsights.fallbackTitle}
				description={homeContent.recentInsights.fallbackDescription}
				href={`${base}/blog`}
				label={locale === 'vi' ? 'Ghé trang bài viết' : 'Visit Blog'}
			/>
		</Reveal>
	{/if}
</section>
