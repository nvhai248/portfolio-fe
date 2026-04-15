<script lang="ts">
	import type { PageData } from './$types';
	import { page } from '$app/state';
	import { getHomeContent } from '$lib/content/home';
	import MetricList from '$lib/components/ui/MetricList.svelte';
	import SocialLinkList from '$lib/components/ui/SocialLinkList.svelte';
	import RecentPostCard from '$lib/components/sections/RecentPostCard.svelte';
	import CtaBlock from '$lib/components/ui/CtaBlock.svelte';
	import SeoHead from '$lib/components/seo/SeoHead.svelte';
	import { getDictionary } from '$lib/i18n/dictionary';

	let { data }: { data: PageData } = $props();
	const content = $derived(getHomeContent(data.locale));
	const t = $derived(getDictionary(data.locale));
</script>

<SeoHead
	title={t.home.seoTitle}
	description={t.home.seoDescription}
	pathname={page.url.pathname}
	type="profile"
	locale={data.locale}
/>

<section class="page-shell pb-16 pt-14 lg:pt-20">
	<div class="grid gap-10 lg:grid-cols-[1.4fr_1fr] lg:items-end">
		<div class="space-y-6">
			<p class="ui-tag">
				<span class="material-symbols-outlined text-sm">auto_awesome</span>
				{content.homeTagline}
			</p>
			<h1 class="ui-heading-hero max-w-3xl">{content.homeIntro.title}</h1>
			<p class="ui-body-lg max-w-2xl">{content.homeIntro.description}</p>
			<div class="flex flex-wrap gap-3">
				<a href={`/${data.locale}/projects`} class="ui-btn ui-btn-primary">{t.home.ctaProjects}</a>
				<a href={`/${data.locale}/cv`} class="ui-btn ui-btn-secondary">{t.home.ctaCv}</a>
			</div>
		</div>

		<div class="ui-panel rounded-2xl p-6 shadow-sm">
			<h2 class="text-sm font-semibold uppercase tracking-[0.16em] [color:var(--ui-text-subtle)]">{t.home.quickProfile}</h2>
			<div class="mt-4">
				<MetricList items={content.homeHighlights} />
			</div>
			{#if data.settings?.socials?.length}
				<div class="mt-6">
					<SocialLinkList items={data.settings.socials} />
				</div>
			{/if}
		</div>
	</div>
</section>

<section class="page-shell pb-16">
	<div class="mb-8 flex items-end justify-between gap-4 border-t ui-divider pt-8">
		<div>
			<h2 class="ui-heading-2">{content.recentInsights.title}</h2>
			<p class="ui-body mt-2">{content.recentInsights.description}</p>
		</div>
		<a href={`/${data.locale}/blog`} class="ui-link text-sm">{t.home.seeAllPosts}</a>
	</div>

	{#if data.posts?.length}
		<div class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
			{#each data.posts as post}
				<RecentPostCard {post} />
			{/each}
		</div>
	{:else}
		<CtaBlock
			title={t.home.emptyTitle}
			description={t.home.emptyDescription}
			href={`/${data.locale}/blog`}
			label={t.home.emptyAction}
		/>
	{/if}
</section>
