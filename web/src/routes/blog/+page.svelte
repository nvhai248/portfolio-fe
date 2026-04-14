<script lang="ts">
	import { page } from '$app/state';
	import { blogBacklogMessage, blogIntro, featuredPost } from '$lib/content/blog';
	import SectionIntro from '$lib/components/ui/SectionIntro.svelte';
	import FeaturedPostCard from '$lib/components/sections/FeaturedPostCard.svelte';
	import SeoHead from '$lib/components/seo/SeoHead.svelte';
</script>

<SeoHead
	title="Blog | Nguyen Van Hai"
	description="Technical insights by Nguyen Van Hai on backend engineering, architecture decisions, and practical AI implementation."
	pathname={page.url.pathname}
/>

<section class="page-shell max-w-5xl pb-12 pt-14 lg:pt-20">
	<SectionIntro content={blogIntro} />
</section>

<section class="page-shell max-w-5xl pb-12">
	<FeaturedPostCard post={featuredPost} />
</section>

<section class="page-shell max-w-5xl pb-20">
	<div class="ui-panel rounded-xl border-dashed p-6">
		<h2 class="ui-heading-3">More posts in progress</h2>
		<p class="ui-body mt-2">{blogBacklogMessage}</p>
	</div>
</section>
