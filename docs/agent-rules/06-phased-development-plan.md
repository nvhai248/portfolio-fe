# 6. Phased Development Plan

To develop this full source systematically, Agents MUST adhere to this exact step-by-step phased approach. Do not jump to later phases until the requirements of the current phase are complete and verified.

## Phase 1: Project Scaffolding & CI/CD
1. **Frontend Setup:** Initialize SvelteKit inside the `web/` directory using standard Vite/TypeScript configurations. 
2. **Backend Setup:** Initialize Sanity securely inside the `studio/` directory.
3. **Styling Setup:** Install and correctly configure Tailwind CSS v4 alongside PostCSS purely inside the SvelteKit application boundary wrapper.
4. **CI/CD Stabilization:** Validate that Vercel deployment pipelines for the `web/` directory via existing GitHub Actions workflows are robust and stable. Add basic automated testing integrations.

## Phase 2: Design System & Core Layout
1. **Global Layout Wrapper:** Implement `web/src/routes/+layout.svelte` — it should apply the global base styles, typography configurations, app shells, and wrap elements contextually. Focus heavily on accessibility (a11y) and responsive structural design.
2. **Theme Engine Logic:** Construct the Tailwind dark mode class strategy functionality. Link it robustly to `localStorage` and system preferences.
3. **Theme Component:** Build an elegant visual `<ThemeToggle />` component with smooth micro-animations. Connect to a globally accessible `theme.ts` store.
4. **Navigation Layer:** Develop the `<Header />` and `<Footer />` components strictly adhering to "Minimal Editorial UI" guidelines with enhanced cross-device UX. Map all routing internally.

## Phase 3: Sanity Schema & Advanced Infrastructure Setup
1. **CMS Schema Definitions:** Carefully construct scalable Sanity schemas for objects: `post`, `project`, `cv`, `author`, `contact_submissions`, and singleton `settings`.
2. **CMS UX Structuring:** Program `deskStructure.ts` to implement a clean logical separation and grouping inside the Sanity Studio app side panel. 
3. **Visual Editing & Previews:** Configure the Presentation tool in Sanity for Live Previews and Visual Editing. Ensure editors can preview content directly in context before publishing.
4. **TypeGen Integration:** Generate and utilize strict TypeScript types from the Sanity schema using Sanity TypeGen to ensure end-to-end type safety between the backend CMS and frontend components.
5. **Frontend Fetch Layer:** Code the core Sanity Client layer helper logic (`web/src/lib/services/sanity.ts`). Write optimized, highly performant GROQ queries adhering to caching best practices.

## Phase 4: Core Pages Integration & Content Rendering
1. **Homepage (`/`):** Translate the hero "mission statement", display a brief tech stack overview, and create standard layout bindings linking to recent portfolio project cards. Embed engaging, subtle enter animations.
2. **Projects Gallery (`/projects/`):** List portfolio implementations comprehensively. Group items in a minimal, perfectly spaced vertical list or pure 2/3 column layout. Implement lazy-loaded, high-resolution imagery and dynamic hover interactions.
3. **About Section (`/about/`):** Render a clear page utilizing Author biography text queried directly from Sanity block content.

## Phase 5: CV/Resume View (`/cv/`)
1. **Resume Mapping:** Seamlessly query structured array parameters (Experience, Education, Certifications) from Sanity and map it perfectly to academic or cleanly organized professional chronological layouts.
2. **Print Optimization Engine:** Inject rigorous `@media print` utilities onto the page structure. Assure that printing the webpage acts visually identical to a pre-generated elegant black & white PDF. Strip interface debris (buttons, navbars).

## Phase 6: Blog & Portable Text Engine (`/blog/`)
1. **Routing Strategy:** Architect the `/blog/` (listing) route properly alongside the nested `/blog/[slug]/` (details view) architecture.
2. **Rich Text Rendering:** Properly bind `@portabletext/svelte` tools into Svelte components to efficiently loop block-type content stored on Sanity backends directly into styled HTML. Support custom blocks seamlessly.
3. **Advanced Code Blocks:** Safely integrate and mount syntax highlighting components into Svelte (e.g. Shiki). Make critical guarantees that snippet themes actively swap or map styles cleanly during system transitions between dark mode and light mode.

## Phase 7: Interactive Elements, Animations & UX Polish
1. **Page Transitions:** Implement fluid page transition animations using Svelte's built-in transition/animation system when navigating between routes (e.g., crossfade, fade, slide).
2. **Scroll Animations:** Leverage `IntersectionObserver` to trigger reveal animations for content as users scroll down (e.g., lazy fade-up components on scroll).
3. **Hover & Micro-interactions:** Add interactive states to buttons, links, project cards, and form elements. Feedback must feel instant, tactile, and premium under modern web standards.
4. **Accessibility Audit:** Ensure full keyboard navigation, perfectly styled focus states, and logical ARIA labeling.

## Phase 8: Contact Form & Gmail Integration
1. **Form UI:** Create a modern, accessible Contact page (`/contact/`) featuring form validation (using libraries like Zod) and a responsive, aesthetic layout. Include visually pleasant success, error, and loading state mechanisms.
2. **API Endpoint Route:** Develop a robust SvelteKit `+server.ts` form action endpoint to capture and securely validate the form submission payload.
3. **SMTP Mailing & Gmail Binding:** Integrate standard SMTP bindings (e.g., Nodemailer) configured to securely relay messages using a Gmail application password. Dispatch beautiful HTML template emails summarizing contact entries to the site administrator, while concurrently saving a backup submission record into a hidden Sanity collection.
