# 4. Core Features & Context Data

## Implementation Modules

### A. Theming (Light/Dark Mode)
*   **Strategy:** Utilize Tailwind's `darkMode: 'class'` (or the v4 `selector` variant) entirely. Do not rely on inline styling for dark mode.
*   **Persistence Layer:** Store user preference in standard `localStorage` and a Svelte Store (`web/src/lib/stores/theme.ts`).
*   **System Default:** Upon initial load, the core layout must check `window.matchMedia('(prefers-color-scheme: dark)')` to respect operating system settings if no override exists in `localStorage`.
*   **UI Controls:** Place a minimal "Sun/Moon" icon toggle button intuitively within the main navigation header.

### B. Portfolio & CV / Resume
*   **Architecture:** Rely heavily on structured data models built in Sanity (e.g., `web/src/routes/cv/+page.server.ts` fetching `cv.ts` document schemas).
*   **Resume Composition:** The CV must neatly display:
    *   **Education:** Focus on VNUHCM - GPA 3.2/4.
    *   **Experience:** Map out timelines at Nashtech, Microleap, etc.
    *   **Skills:** Categorize dynamically.
*   **Printability (Crucial Rule):** The route (`/cv`) MUST be robustly responsive and support native PDF exporting. Ensure a strict `@media print` stylesheet is present that forces:
    *   White background regardless of system or toggled state (`!bg-white`).
    *   Black text (`!text-black`).
    *   Hidden navigation bars / footers (`print:hidden`).
    *   Cleanly hidden link underlines.

### C. Blog System
*   **Format:** Posts must utilize the `Portable Text` specification heavily from Sanity.
*   **Code Blocks:** Utilize syntax highlighting plugins (e.g., Shiki or pure Prism JS) inside Portable Text custom block resolvers. Ensure that block themes intelligently switch color palettes aligned to the Light/Dark mode state of the page container.
*   **SEO:** Every blog post `/[slug]/` route must heavily rely on SvelteKit SSR features to compute unique standard meta descriptions, OG titles, and canonical tags.

---

## Context for Dummy & Placeholder Data
If at any point during development real data is missing from the CMS, Agents are required to generate dummy data strictly aligned with **Nguyen Van Hai's** real-world expertise:

*   **Languages:** Golang (Gin, GORM), C#/.NET, TypeScript/NestJS, PHP.
*   **Cloud & DevOps Ecosystem:** Azure (Functions, APIM), AWS (S3, EC2), Docker, Terraform, GitHub Actions.
*   **AI Integration Expertise:** Google Vertex AI, Ollama, Qdrant (Vector DB), Gemini Pro.
*   **Notable Projects:** "Microleap AI Food Detector", "Open University Moodle".
