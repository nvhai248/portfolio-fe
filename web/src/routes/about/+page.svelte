<script lang="ts">
	import { aboutCards, aboutIntro, contributionItems } from '$lib/content/about';
	import SectionIntro from '$lib/components/ui/SectionIntro.svelte';
	import InfoCardGrid from '$lib/components/sections/InfoCardGrid.svelte';
	import HighlightListPanel from '$lib/components/sections/HighlightListPanel.svelte';
</script>

<svelte:head>
	<title>About | Nguyen Van Hai</title>
	<meta
		name="description"
		content="About Nguyen Van Hai — backend engineer focused on scalable architecture, reliability, and practical AI integration."
	/>
</svelte:head>

<section class="page-shell max-w-5xl pb-14 pt-14 sm:pb-16 lg:pt-20">
	<SectionIntro content={aboutIntro} />
</section>

<section class="page-shell max-w-5xl pb-14 sm:pb-16">
	<InfoCardGrid items={aboutCards} />
</section>

<section class="page-shell max-w-5xl pb-20">
	<HighlightListPanel title="How I contribute inside teams" items={contributionItems} />
</section>
