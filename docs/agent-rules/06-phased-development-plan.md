# 6. Phased Development Plan

To develop this full source systematically, Agents MUST adhere to this exact step-by-step phased approach. Do not jump to later phases until the requirements of the current phase are complete and verified.

## Phase 1: Project Scaffolding & CI/CD
1. **Frontend Setup:** Initialize SvelteKit inside the `web/` directory using standard Vite/TypeScript configurations. 
2. **Backend Setup:** Initialize Sanity securely inside the `studio/` directory.
3. **Styling Setup:** Install and correctly configure Tailwind CSS v4 alongside PostCSS purely inside the SvelteKit application boundary wrapper.
4. **CI/CD Stabilization:** Validate that Vercel deployment pipelines for the `web/` directory via existing GitHub Actions workflows are robust and stable.

## Phase 2: Design System & Core Layout
1. **Global Layout Wrapper:** Implement `web/src/routes/+layout.svelte` — it should apply the global base styles, typography configurations, app shells, and wrap elements contextually.
2. **Theme Engine Logic:** Construct the Tailwind dark mode class strategy functionality. Link it robustly to `localStorage`.
3. **Theme Component:** Build the visual `<ThemeToggle />` component and wire it to a globally accessible `theme.ts` store.
4. **Navigation Layer:** Develop the `<Header />` and `<Footer />` components strictly adhering to the "Minimal Editorial UI" guidelines. Map all routing internally.

## Phase 3: Sanity Schema & Infrastructure Setup
1. **CMS Schema Definitions:** Carefully construct Sanity schemas for objects: `post`, `project`, `cv`, `author`, and singleton `settings`.
2. **CMS UX Structuring:** Program `deskStructure.ts` to implement a clean logical separation and grouping inside the Sanity Studio app side panel.
3. **Frontend Fetch Layer:** Code the core Sanity Client layer helper logic (`web/src/lib/services/sanity.ts`). Write basic GROQ query tests to ensure connectivity to the backend CMS project data endpoint.

## Phase 4: Core Pages Integration
1. **Homepage (`/`):** Translate the hero "mission statement", display a brief tech stack overview layout, and create standard layout bindings linking to recent portfolio project cards.
2. **Projects Gallery (`/projects/`):** List portfolio implementations comprehensively. Group items in a minimal, perfectly spaced vertical list or pure 2/3 column layout. Focus exclusively on clear type headings and high resolution imagery loading patterns.
3. **About Section (`/about/`):** Render a clear page utilizing Author biography text queried directly from Sanity block content.

## Phase 5: CV/Resume View (`/cv/`)
1. **Resume Mapping:** Seamlessly query structured array parameters (Experience, Education, Certifications) from Sanity and map it perfectly to academic or cleanly organized professional chronological layouts.
2. **Print Optimization Engine:** Inject rigorous `@media print` utilities onto the page structure. Assure that printing the webpage acts visually identical to a pre-generated elegant black & white PDF. Strip interface debris (buttons, navbars).

## Phase 6: Blog & Portable Text Engine (`/blog/`)
1. **Routing Strategy:** Architect the `/blog/` (listing) route properly alongside the nested `/blog/[slug]/` (details view) architecture.
2. **Rich Text Rendering:** Properly bind `@portabletext/svelte` tools into Svelte components to efficiently loop block-type content stored on Sanity backends directly into styled HTML.
3. **Advanced Code Blocks:** Safely integrate and mount syntax highlighting components into Svelte (e.g. Prism/Shiki). Make critical guarantees that snippet themes actively swap or map styles cleanly during system transitions between dark mode and light mode.
