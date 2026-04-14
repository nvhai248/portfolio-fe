<script lang="ts">
	import { blogBacklogMessage, blogIntro, featuredPost } from '$lib/content/blog';
	import SectionIntro from '$lib/components/ui/SectionIntro.svelte';
	import FeaturedPostCard from '$lib/components/sections/FeaturedPostCard.svelte';
</script>

<svelte:head>
	<title>Blog | Nguyen Van Hai</title>
	<meta
		name="description"
		content="Technical insights by Nguyen Van Hai on backend engineering, architecture decisions, and practical AI implementation."
	/>
</svelte:head>

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
