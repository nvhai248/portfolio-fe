# SEO Maintenance Guide

## 1) Site URL configuration
- Set `PUBLIC_SITE_URL` in production environment (e.g. `https://your-domain.com`).
- Canonical URLs, robots sitemap reference, and OG absolute URLs all use this value when present.

## 2) Where SEO metadata is managed
- Shared SEO config: `src/lib/seo/site.ts`
- Structured data builders: `src/lib/seo/schema.ts`
- Shared head renderer: `src/lib/components/seo/SeoHead.svelte`

## 3) Updating page SEO
For each route, use `SeoHead` and pass:
- `title`
- `description`
- `pathname`
- optional `type` (`website`, `article`, `profile`)
- optional `structuredData`

## 4) Structured data currently implemented
- Global (layout): `Person`, `WebSite`
- Projects page: `CollectionPage` with `CreativeWork` items
- Blog article page: `Article`

## 5) Sitemap / robots
- `src/routes/sitemap.xml/+server.ts`
- `src/routes/robots.txt/+server.ts`

When new public routes are added, append them to `staticRoutes` in sitemap endpoint.

## 6) Validation checklist before release
Run:
```bash
npm run check
npm run build
npm run test:smoke
```
Manual spot check:
- `/sitemap.xml` is reachable
- `/robots.txt` is reachable and includes sitemap URL
- each indexable page has unique `<title>` and `<meta name="description">`
- each page has a valid `<link rel="canonical">`
