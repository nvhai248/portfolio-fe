# 3. Design System & UI Guide

## Design Philosophy: "Editorial Minimal Portfolio UI"

The UI must adhere tightly to these principles:
*   **Content-Driven:** Use generous white space to let the content breathe. Emphasize a clear typography hierarchy.
*   **Tone:** The site must feel calm, professional, and human-centric. Avoid flashy, chaotic, or overly modern unreadable designs.
*   **Motion:** Apply only soft transitions (e.g., color fades on hover, subtle page reveals). Avoid heavy, distracting animations or bouncy framer-motion effects unless specifically asked.

---

## Detailed UI/UX Guide for Agents

When building components and writing HTML/Svelte files, Agents MUST use the following CSS/Tailwind utilities to enforce the "Editorial Minimal" aesthetic.

### 1. Typography & Spacing
*   **Font Stack:** Stick strictly to standard, clean Sans-serif (like `Inter`, `Roboto`, or `System UI`) via `font-sans`. **Do not use playfully stylized or heavily rounded fonts.**
*   **Readability:** 
    *   Apply `leading-relaxed` or `leading-loose` on all body paragraphs (`<p>`).
    *   Keep character limits comfortable. Limit text block widths using `max-w-3xl` for articles and `max-w-5xl` for broader site layouts, combined with `mx-auto`.
*   **Breathing Room:** Use expansive padding between distinct layout sections. Default to `py-16 md:py-24` or `py-32` rather than cramped `py-8`.

### 2. Palette & Theming Strategy (Strict Class Application)
Always write classes utilizing the `dark:` variant immediately next to the light variant. Look to create a "dim" dark mode to reduce eye strain, rather than a raw `#000000` pitch black.

*   **Backgrounds:**
    *   **Light:** `bg-white` or `bg-neutral-50`.
    *   **Dark:** `dark:bg-neutral-950` or `dark:bg-[#0a0a0a]`.
*   **Text & Headings:**
    *   **Light Elements:** `text-neutral-900` for headings (`<h1>`, `<h2>`), `text-neutral-600` for standard body text.
    *   **Dark Elements:** `dark:text-neutral-50` for headings, `dark:text-neutral-400` for body text.
    *   **Soft Muted Text (e.g., Dates, Captions):** `text-neutral-500 dark:text-neutral-500`.
*   **Borders & Dividers:**
    *   Must be extremely subtle: `border-neutral-200 dark:border-neutral-800`.
*   **Accents:**
    *   Refrain from using bright primary colors (pure red, blue, green). If links or buttons need emphasis, use text underline utilities, muted tones (`text-neutral-500`), or monochrome inversion (e.g., black button with white text in light mode).

### 3. Interactive & Motion States
*   **Hover States:** Instead of color pops, use subtle background shade alterations to indicate interactability (e.g., `hover:bg-neutral-100 dark:hover:bg-neutral-900` on list items or cards).
*   **Transitions:** Universally apply `transition-colors duration-200` to all `<button>`, `<a>`, and interactive icons.
*   **Accessibility (Focus Rings):** Ensure keyboard accessibility by globally applying focus rings where appropriate: `focus-visible:ring-2 focus-visible:ring-neutral-500 focus-visible:outline-none`.
