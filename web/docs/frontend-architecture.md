# Frontend Architecture Handover

## Goals of this refactor
- Reduce page-level duplication across `Home/About/Projects/CV/Blog`.
- Keep UI output stable while making content and layout easier to maintain.
- Clarify module boundaries for components, content, utilities, and shared types.

## Folder structure

```text
src/
  lib/
    components/
      layout/               # App shell components (Header, Footer)
      sections/             # Domain-ish composed blocks (ProjectCard, ExperienceCard...)
      ui/                   # Reusable UI primitives (SectionIntro, MetricList, CtaBlock...)
    content/                # Static page content/constants (about.ts, projects.ts, ...)
    types/                  # Shared interfaces/contracts
    utils/                  # Pure helpers (formatting, mapping)
  routes/
    ...                     # Thin route templates, mostly composition + metadata
```

## Conventions
- **Component naming:** PascalCase (`ProjectCard.svelte`, `SectionIntro.svelte`).
- **Helpers/utilities:** camelCase exports (`formatPublishedDate`, `getPostExcerpt`).
- **Import alias:** prefer `$lib/...` for internal modules.
- **Routes:** keep business/content data outside route files when possible.

## Styling approach
- Keep semantic token usage from `app.css` (`--ui-*` variables).
- Reuse existing utility classes (`ui-panel`, `ui-chip`, `ui-body`, etc.) in components.
- Avoid large hardcoded class blocks in route files; extract repeated patterns into section/ui components.

## How to add a new section/page block
1. Put static copy/data in `src/lib/content/<page>.ts`.
2. If markup is reusable, create component in `src/lib/components/sections` or `ui`.
3. Add/update interface in `src/lib/types/content.ts` when data is shared.
4. Compose in route file with lightweight wiring only.

## Validation checklist
- Run `npm run check` for type + Svelte diagnostics.
- Run `npm run build` for production compile.
- Smoke check key routes in dev/preview: `/`, `/about`, `/projects`, `/cv`, `/blog`.
