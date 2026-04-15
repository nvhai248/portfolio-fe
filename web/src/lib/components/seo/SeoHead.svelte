<script lang="ts">
	import { localeToOg, locales, type Locale } from '$lib/i18n/config';
	import { localeFromPathname, localizePath, stripLocalePrefix } from '$lib/i18n/locale';
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
		locale?: Locale;
	}

	let {
		title = siteConfig.defaultMetaByLocale.en.title,
		description = siteConfig.defaultMetaByLocale.en.description,
		pathname = '/',
		type = 'website',
		imagePath = siteConfig.defaultOgImagePath,
		robots = 'index,follow,max-snippet:-1,max-image-preview:large,max-video-preview:-1',
		structuredData = [],
		origin,
		locale: inputLocale
	}: Props = $props();

	const locale = $derived((inputLocale ?? localeFromPathname(pathname)) as Locale);
	const canonicalUrl = $derived(toAbsoluteUrl(pathname, origin));
	const ogImage = $derived(toAbsoluteUrl(imagePath, origin));
	const graphItems = $derived(Array.isArray(structuredData) ? structuredData : [structuredData]);
	const barePath = $derived(stripLocalePrefix(pathname));
	const alternateLinks = $derived(
		locales.map((item) => ({
			locale: item,
			href: toAbsoluteUrl(localizePath(barePath, item), origin)
		}))
	);

	const stringifySchema = (payload: JsonLd): string => JSON.stringify(payload).replace(/</g, '\\u003c');
</script>

<svelte:head>
	<title>{title}</title>
	<meta name="description" content={description} />
	<meta name="robots" content={robots} />
	<link rel="canonical" href={canonicalUrl} />
	{#each alternateLinks as alt}
		<link rel="alternate" hreflang={alt.locale} href={alt.href} />
	{/each}
	<link rel="alternate" hreflang="x-default" href={alternateLinks[0].href} />

	<meta property="og:type" content={type} />
	<meta property="og:site_name" content={siteConfig.siteName} />
	<meta property="og:locale" content={localeToOg[locale]} />
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
