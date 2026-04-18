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
	import CurrencyTicker from '$lib/components/home/CurrencyTicker.svelte';

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
	<!-- Hero Section: Identity & Real-time Context -->
	<section class="pb-24 pt-14 lg:pt-20">
		<Hero
			tagline={heroTagline}
			intro={heroIntro}
			primaryCtaLabel={ctaPrimary}
			secondaryCtaLabel={ctaSecondary}
			{show3DHero}
		/>
	</section>

	<!-- Market Dynamics Section: Currency & Global Data -->
	<section class="py-24 lg:py-32">
		<CurrencyTicker />
	</section>

	<!-- Technical Capacity Section: System Status & Metrics -->
	<section class="py-24 lg:py-32">
		<QuickProfile highlights={homeContent.homeHighlights} socials={data.settings?.socials} />
	</section>

	<!-- Knowledge Transfer Section: Recent Technical Writing -->
	<RecentInsights
		title={homeContent.recentInsights.title}
		description={homeContent.recentInsights.description}
		posts={data.posts}
	/>

	<!-- Opportunity Acquisition Section -->
	<section class="pb-32 pt-24 lg:pt-32">
		<OpportunityCTA
			title={opportunityTitle}
			description={opportunityDescription}
			buttonLabel={opportunityButtonLabel}
		/>
	</section>
</div>
