# 5. Coding Standards

Agents must abide by the following engineering practices consistently across the repository:

## Accessibility (a11y)
*   **Semantics:** Use proper HTML5 semantic elements (`<header>`, `<main>`, `<footer>`, `<article>`, `<nav>`).
*   **Contrast:** Pay close attention to WCAG AA contrast ratios, particularly when authoring Dark Mode text over varying shades of dark gray backgrounds.
*   **Keyboard Navigation:** All interactive elements (`<button>`, `<a>`, `<input>`) must handle focus gracefully via `focus-visible`. Do not remove `outline` without replacing it with a `ring`.
*   **Aria Tags:** Include `aria-label` tags on icons serving as buttons (like the Theme Toggle, external links).

## Code Quality & SvelteKit Best Practices
*   **Module Separation:** Strictly separate UI and component-level logic from data fetching mechanisms. Data fetching happens in `+page.server.ts` or `+page.ts` where possible.
*   **State Management:** Extensively use Svelte context or standard Svelte Stores for global variables (like `theme.ts` for managing Light/Dark mode). Do not prop-drill global state down deep trees unnecessarily.
*   **Type Safety:** The project is configured for TypeScript. Define standard Types/Interfaces for data bridging between Sanity and the frontend components natively. Do not resort to `any` types.

## Styling (CSS & Tailwind)
*   **Rule Set:** Use standard utility composition. Avoid large scoped `<style>` blocks in Svelte components unless it involves dynamic complex logic unreachable via utility classes.
*   **PostCSS:** Avoid SCSS/SASS processing; exclusively use vanilla CSS enhanced with PostCSS plugins through Tailwind v4 configuration.
*   **Theming Implementation:** Maintain the class implementation pattern: `class="text-neutral-900 dark:text-neutral-50"`. Do not write deeply specific dark mode overrides inside `<style>`.
