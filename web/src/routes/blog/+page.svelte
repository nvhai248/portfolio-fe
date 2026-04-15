<script lang="ts">
	import { page } from '$app/state';
	import { blogBacklogMessage, blogIntro } from '$lib/content/blog';
	import RecentPostCard from '$lib/components/sections/RecentPostCard.svelte';
	import SectionIntro from '$lib/components/ui/SectionIntro.svelte';
	import SeoHead from '$lib/components/seo/SeoHead.svelte';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
</script>

<SeoHead
	title="Blog | Nguyen Van Hai"
	description="Technical insights by Nguyen Van Hai on backend engineering, architecture decisions, and practical AI implementation."
	pathname={page.url.pathname}
/>

<section class="page-shell max-w-5xl pb-12 pt-14 lg:pt-20">
	<SectionIntro content={blogIntro} />
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
			<h2 class="ui-heading-3">More posts in progress</h2>
			<p class="ui-body mt-2">{blogBacklogMessage}</p>
		</div>
	{/if}
</section>
