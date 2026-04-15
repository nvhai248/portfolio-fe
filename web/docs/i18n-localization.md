# i18n localization (vi/en)

## Routing

- Locale-prefixed routes are now canonical: `/vi/*`, `/en/*`.
- `src/hooks.server.ts` redirects non-prefixed pages to preferred locale (`Accept-Language` fallback).
- New locale matcher: `src/params/locale.ts`.

## SEO

- `SeoHead` now outputs:
  - localized canonical URLs
  - `hreflang` alternates (`vi`, `en`, `x-default`)
  - locale-aware OpenGraph locale
- Sitemap now includes both `/vi/*` and `/en/*` routes with alternate links.

## Sanity localization approach

Chosen approach: **document-per-locale** (additive, backward-compatible).

- Added required `language` field (`en` / `vi`) to schemas:
  - `author`, `aboutPage`, `projectsPage`, `project`, `cv`, `cvPage`
- Web queries now resolve by locale first, then safely fallback to legacy docs without `language`.
- No destructive migration; existing docs continue to work.

## Seed/migration content

- Existing seed/JSON docs now mark canonical docs with `language: "en"`.
- Added Vietnamese variants for canonical docs and project docs:
  - `studio/scripts/author-main.vi.json`
  - `studio/scripts/cv-main.vi.json`
  - `studio/scripts/projectsPage.vi.singleton.json`
  - `studio/scripts/project-*.vi.json`
  - `studio/scripts/seed-content.i18n.ndjson`

## Import order suggestion

1. Existing baseline seed (`seed-content.ndjson`)
2. Canonical JSON docs (`author-main*.json`, `cv-main*.json`, `projectsPage*.json`, `project*.json`)
3. i18n add-on seed (`seed-content.i18n.ndjson`)

This keeps migration additive and allows rollback by ignoring locale-specific docs.
