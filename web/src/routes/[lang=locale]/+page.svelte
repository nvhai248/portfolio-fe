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

	import Hero from '$lib/components/home/Hero.svelte';
	import QuickProfile from '$lib/components/home/QuickProfile.svelte';
	import RecentInsights from '$lib/components/home/RecentInsights.svelte';
	import OpportunityCTA from '$lib/components/home/OpportunityCTA.svelte';

	let { data }: { data: PageData } = $props();
	const locale = $derived(data.locale);
	const homeContent = $derived(getHomeContent(locale));

	// CMS Fallback Logic
	const homeData = $derived(data.homePageData);
	const heroTagline = $derived(homeData?.heroTagline || homeContent.homeTagline);
	const heroIntro = $derived({
		title: homeData?.heroTitle || homeContent.homeIntro.title,
		description: homeData?.heroDescription || homeContent.homeIntro.description
	});
	const ctaPrimary = $derived(
		homeData?.primaryCtaLabel || (locale === 'vi' ? 'Xem dự án' : 'View Projects')
	);
	const ctaSecondary = $derived(
		homeData?.secondaryCtaLabel || (locale === 'vi' ? 'Xem CV' : 'Read CV')
	);
	const show3DHero = $derived(homeData?.show3DHero ?? true);

	const opportunityTitle = $derived(homeData?.opportunityTitle || homeContent.opportunityCTA.title);
	const opportunityDescription = $derived(
		homeData?.opportunityDescription || homeContent.opportunityCTA.description
	);
	const opportunityButtonLabel = $derived(
		homeData?.opportunityButtonLabel || homeContent.opportunityCTA.buttonLabel
	);
</script>

<SeoHead
	title={heroIntro.title}
	description={heroIntro.description}
	pathname={page.url.pathname}
	type="profile"
	locale={data.locale}
/>

<div class="page-shell overflow-hidden">
	<!-- Hero Section -->
	<section class="pb-16 pt-14 lg:pt-20">
		<Hero
			tagline={heroTagline}
			intro={heroIntro}
			primaryCtaLabel={ctaPrimary}
			secondaryCtaLabel={ctaSecondary}
			{show3DHero}
		/>
	</section>

	<!-- Quick Profile (Floating Section) -->
	<section class="pb-24">
		<div class="grid gap-12 lg:grid-cols-[1.5fr_1fr] lg:items-start">
			<div class="space-y-12">
				<RecentInsights
					title={homeContent.recentInsights.title}
					description={homeContent.recentInsights.description}
					posts={data.posts}
				/>
			</div>
			<div class="sticky top-24">
				<QuickProfile highlights={homeContent.homeHighlights} socials={data.settings?.socials} />
			</div>
		</div>
	</section>

	<!-- Opportunity Section -->
	<section class="pb-24">
		<OpportunityCTA
			title={opportunityTitle}
			description={opportunityDescription}
			buttonLabel={opportunityButtonLabel}
		/>
	</section>
</div>
