<script lang="ts">
	import { siteConfig, toAbsoluteUrl } from '$lib/seo/site';

	type JsonLd = Record<string, unknown>;

	interface Props {
		title?: string;
		description?: string;
		pathname?: string;
		type?: 'website' | 'article' | 'profile';
		imagePath?: string;
		robots?: string;
		structuredData?: JsonLd | JsonLd[];
		origin?: string;
	}

	let {
		title = siteConfig.defaultTitle,
		description = siteConfig.defaultDescription,
		pathname = '/',
		type = 'website',
		imagePath = siteConfig.defaultOgImagePath,
		robots = 'index,follow,max-snippet:-1,max-image-preview:large,max-video-preview:-1',
		structuredData = [],
		origin
	}: Props = $props();

	const canonicalUrl = $derived(toAbsoluteUrl(pathname, origin));
	const ogImage = $derived(toAbsoluteUrl(imagePath, origin));
	const graphItems = $derived(Array.isArray(structuredData) ? structuredData : [structuredData]);

	const stringifySchema = (payload: JsonLd): string => JSON.stringify(payload).replace(/</g, '\\u003c');
</script>

<svelte:head>
	<title>{title}</title>
	<meta name="description" content={description} />
	<meta name="robots" content={robots} />
	<link rel="canonical" href={canonicalUrl} />

	<meta property="og:type" content={type} />
	<meta property="og:site_name" content={siteConfig.siteName} />
	<meta property="og:locale" content={siteConfig.defaultLocale} />
	<meta property="og:title" content={title} />
	<meta property="og:description" content={description} />
	<meta property="og:url" content={canonicalUrl} />
	<meta property="og:image" content={ogImage} />

	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:site" content={siteConfig.twitterHandle} />
	<meta name="twitter:creator" content={siteConfig.twitterHandle} />
	<meta name="twitter:title" content={title} />
	<meta name="twitter:description" content={description} />
	<meta name="twitter:image" content={ogImage} />

	{#each graphItems as schema}
		<script type="application/ld+json">{stringifySchema(schema)}</script>
	{/each}
</svelte:head>
