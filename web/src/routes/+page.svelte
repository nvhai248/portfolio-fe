<script lang="ts">
	import type { PageData } from './$types';
	import { base } from '$app/paths';
	import { page } from '$app/state';
	import { homeHighlights, homeIntro, homeTagline, recentInsights } from '$lib/content/home';
	import MetricList from '$lib/components/ui/MetricList.svelte';
	import SocialLinkList from '$lib/components/ui/SocialLinkList.svelte';
	import RecentPostCard from '$lib/components/sections/RecentPostCard.svelte';
	import CtaBlock from '$lib/components/ui/CtaBlock.svelte';
	import SeoHead from '$lib/components/seo/SeoHead.svelte';

	let { data }: { data: PageData } = $props();
</script>

<SeoHead
	title="Nguyen Van Hai | Backend Engineer & System Architect"
	description="Portfolio of Nguyen Van Hai — backend engineering, system architecture, and practical AI integration for scalable products."
	pathname={page.url.pathname}
	type="profile"
/>

<section class="page-shell pb-16 pt-14 lg:pt-20">
	<div class="grid gap-10 lg:grid-cols-[1.4fr_1fr] lg:items-end">
		<div class="space-y-6">
			<p class="ui-tag">
				<span class="material-symbols-outlined text-sm">auto_awesome</span>
				{homeTagline}
			</p>
			<h1 class="ui-heading-hero max-w-3xl">{homeIntro.title}</h1>
			<p class="ui-body-lg max-w-2xl">{homeIntro.description}</p>
			<div class="flex flex-wrap gap-3">
				<a href={`${base}/projects`} class="ui-btn ui-btn-primary">View Projects</a>
				<a href={`${base}/cv`} class="ui-btn ui-btn-secondary">Read CV</a>
			</div>
		</div>

		<div class="ui-panel rounded-2xl p-6 shadow-sm">
			<h2 class="text-sm font-semibold uppercase tracking-[0.16em] [color:var(--ui-text-subtle)]">Quick profile</h2>
			<div class="mt-4">
				<MetricList items={homeHighlights} />
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
			<h2 class="ui-heading-2">{recentInsights.title}</h2>
			<p class="ui-body mt-2">{recentInsights.description}</p>
		</div>
		<a href={`${base}/blog`} class="ui-link text-sm">See all posts</a>
	</div>

	{#if data.posts?.length}
		<div class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
			{#each data.posts as post}
				<RecentPostCard {post} />
			{/each}
		</div>
	{:else}
		<CtaBlock
			title="Insights coming soon"
			description="No published posts yet. New articles about backend architecture and AI product delivery will be added soon."
			href={`${base}/blog`}
			label="Visit Blog"
		/>
	{/if}
</section>
