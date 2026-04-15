<script lang="ts">
	import { page } from '$app/state';
	import { getBlogContent } from '$lib/content/blog';
	import RecentPostCard from '$lib/components/sections/RecentPostCard.svelte';
	import SectionIntro from '$lib/components/ui/SectionIntro.svelte';
	import SeoHead from '$lib/components/seo/SeoHead.svelte';
	import { getDictionary } from '$lib/i18n/dictionary';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
	const content = $derived(getBlogContent(data.locale));
	const t = $derived(getDictionary(data.locale));
</script>

<SeoHead title={t.blog.seoTitle} description={t.blog.seoDescription} pathname={page.url.pathname} locale={data.locale} />

<section class="page-shell max-w-5xl pb-12 pt-14 lg:pt-20">
	<SectionIntro content={content.blogIntro} />
</section>

<section class="page-shell max-w-5xl pb-20">
	{#if data.posts?.length}
		<div class="grid gap-6 md:grid-cols-2">
			{#each data.posts as post (post._id)}
				<RecentPostCard {post} />
			{/each}
		</div>
	{:else}
		<div class="ui-panel rounded-xl border-dashed p-6">
			<h2 class="ui-heading-3">{t.blog.emptyTitle}</h2>
			<p class="ui-body mt-2">{content.blogBacklogMessage}</p>
		</div>
	{/if}
</section>
