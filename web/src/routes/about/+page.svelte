<script lang="ts">
	import { page } from '$app/state';
	import { aboutContent } from '$lib/content/about';
	import SectionIntro from '$lib/components/ui/SectionIntro.svelte';
	import InfoCardGrid from '$lib/components/sections/InfoCardGrid.svelte';
	import HighlightListPanel from '$lib/components/sections/HighlightListPanel.svelte';
	import SeoHead from '$lib/components/seo/SeoHead.svelte';
</script>

<SeoHead title={aboutContent.seo.title} description={aboutContent.seo.description} pathname={page.url.pathname} />

<section class="page-shell max-w-5xl pb-14 pt-14 sm:pb-16 lg:pt-20">
	<SectionIntro content={aboutContent.intro} />
</section>

<section class="page-shell max-w-5xl pb-14 sm:pb-16">
	<InfoCardGrid items={aboutContent.cards} />
</section>

<section class="page-shell max-w-5xl pb-20">
	<HighlightListPanel
		title={aboutContent.contributionPanel.title}
		items={aboutContent.contributionPanel.items}
	/>
</section>
