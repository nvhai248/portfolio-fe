# AGENTS.md

## 1. Project Mission
You are acting as a Senior Frontend Engineer and Solution Architect. Your goal is to build a personal portfolio web application for **Nguyen Van Hai**.

The website serves as a professional hub to:
*   Showcase expertise in **Backend Engineering** (Golang), **System Architecture**, and **AI Integration**.
*   Maintain and update a structured CV/Resume (Education: VNUHCM, Experience: Nashtech, Microleap).
*   Publish technical blog posts regarding APIs, Cloud (Azure/AWS), and Optimization.

**Inspiration & Live Reference:** `https://minhvuilendi.com/` (Design inspiration only; content must be specific to Nguyen Van Hai).

## 2. Tech Stack (Strict)
You must use the following technology stack:
*   **Frontend:** SvelteKit (Modern ES modules, Component-driven).
*   **CMS:** Sanity.io (Headless CMS, Portable Text, GROQ queries).
*   **Styling:** Tailwind CSS (Utility-first).
*   **Theming:** Tailwind **Dark Mode** (configured as `class` strategy) to support Light/Dark toggling.
*   **Language:** TypeScript.
*   **Deployment:** Vercel or Netlify.

## 3. Design Philosophy: "Editorial Minimal Portfolio UI"
The UI must adhere to the following principles:
*   **Content-Driven:** Generous white space, clear typography hierarchy.
*   **Tone:** Calm, professional, and human-centric.
*   **Typography:** Sans-serif for body text; Line height 1.6–1.8.
*   **Motion:** Soft transitions only; avoid heavy animations.
*   **Color Palette (Theming):**
    *   **Light Mode:** High brightness, magazine feel. Background: `#ffffff` or `#fafafa`. Text: Dark Gray (`#171717`).
    *   **Dark Mode:** "Dim" rather than true black to reduce eye strain. Background: `#171717` or `#0a0a0a`. Text: Off-white (`#e5e5e5`). Borders: Subtle gray (`#262626`).

## 4. Folder Structure (Scaffolding)
Follow this exact directory structure:

### Frontend (`web/`)
```text
web/src/
├── lib/
│   ├── components/
│   │   ├── layout/    # Header (w/ ThemeToggle), Footer, Nav
│   │   ├── ui/        # Buttons, Cards, Typography
│   │   └── blog/      # PostBody, CodeBlock
│   ├── stores/
│   │   └── theme.ts   # Svelte store for Dark/Light state
│   ├── services/
│   │   └── sanity.ts  # Sanity Client Config
│   ├── utils/
│   └── styles/        # Tailwind imports
│
├── routes/
│   ├── +layout.svelte # Handles theme initialization
│   ├── +page.svelte   # Homepage
│   ├── about/
│   ├── blog/
│   │   └── [slug]/    # Dynamic route for posts
│   ├── cv/
│   └── projects/
```

### Backend (`studio/`)
```text
studio/
├── schemas/
│   ├── post.ts        # Blog articles
│   ├── project.ts     # Portfolio projects
│   ├── cv.ts          # Structured resume data
│   ├── author.ts      # Author bio (Nguyen Van Hai)
│   └── settings.ts    # Global SEO & Socials
├── deskStructure.ts
└── sanity.config.ts
```

## 5. Core Features & Implementation Details

### A. Theming (Light/Dark Mode)
*   **Strategy:** Use Tailwind's `darkMode: 'class'`.
*   **Persistence:** Store user preference in `localStorage` and a Svelte Store (`theme.ts`).
*   **System Default:** Check `window.matchMedia('(prefers-color-scheme: dark')` on first load to respect system settings.
*   **UI:** Include a minimal "Sun/Moon" toggle icon in the main navigation.

### B. Portfolio & CV
*   **Resume:** Build a structured data view for Education (VNUHCM - GPA 3.2/4), Experience (Nashtech, Microleap), and Skills.
*   **Printability:** Ensure the CV page has a `@media print` stylesheet that forces a white background and black text, regardless of the active Dark Mode setting, to ensure clean PDF exports.

### C. Blog System
*   **Format:** Support Markdown or Portable Text via Sanity.
*   **Code Blocks:** Ensure syntax highlighting (e.g., PrismJS or Shiki) is accessible in both Light and Dark modes.
*   **SEO:** Implement Server-Side Rendering (SSR) for unique meta descriptions.

### D. Context for Dummy Data
When generating placeholder content, use **Nguyen Van Hai's** specific expertise:
*   **Languages:** Golang (Gin, GORM), C#/.NET, TypeScript/NestJS, PHP.
*   **Cloud & DevOps:** Azure (Functions, APIM), AWS (S3, EC2), Docker, Terraform, GitHub Actions.
*   **AI Integration:** Google Vertex AI, Ollama, Qdrant (Vector DB), Gemini Pro.
*   **Projects:** "Microleap AI Food Detector", "Open University Moodle".

## 6. Coding Standards
*   **Accessibility:** Semantic HTML, WCAG AA contrast (crucial for Dark Mode text), keyboard navigation.
*   **Code Quality:** Separate UI logic from data fetching. Use Svelte stores for Theme management.
*   **CSS:** Use Tailwind classes for theming (e.g., `bg-white dark:bg-neutral-900 text-black dark:text-neutral-100`).
```