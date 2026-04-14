# 2. Architecture & Folder Structure

Agents must follow this exact directory structure to maintain separation of concerns between the Frontend (`web/`) and the Headless CMS (`studio/`).

## Frontend Application (`web/`)

```text
web/src/
├── lib/
│   ├── components/
│   │   ├── layout/    # Structural elements: Header (w/ ThemeToggle), Footer, Navigation
│   │   ├── ui/        # Reusable design system: Buttons, Cards, Typography bindings
│   │   └── blog/      # Content modules: PostBody, Portable Text overrides, CodeBlock
│   ├── stores/
│   │   └── theme.ts   # Svelte store managing Dark/Light state and localStorage sync
│   ├── services/
│   │   └── sanity.ts  # Sanity Client Configuration & GROQ fetch helpers
│   ├── utils/         # Helper functions (e.g., date formatting, class merging)
│   └── styles/        # Global CSS and Tailwind directives (app.css)
│
├── routes/
│   ├── +layout.svelte # Root layout: Initializes theme observer, wraps app shell
│   ├── +page.svelte   # Homepage
│   ├── about/         # Static/Dynamic About page mapping to Sanity Author schema
│   ├── blog/
│   │   ├── +page.svelte           # Blog post listing
│   │   └── [slug]/+page.svelte    # Dynamic route mapping to Sanity Post schema
│   ├── cv/            # Dedicated Resume View
│   └── projects/      # Portfolio Gallery View
```

## Backend CMS (`studio/`)

The Sanity studio should be contained strictly within the `studio/` directory.

```text
studio/
├── schemas/
│   ├── post.ts        # Schema for Blog articles
│   ├── project.ts     # Schema for Portfolio showcase items
│   ├── cv.ts          # Structured schema for resume data (Education, Jobs, Skills)
│   ├── author.ts      # Schema for Author bio (Nguyen Van Hai specific info)
│   └── settings.ts    # Singletons for Global SEO, Site Meta, & Social Links
├── deskStructure.ts   # Custom UI grouping for the Sanity Studio left sidebar
├── sanity.config.ts   # Main Sanity Studio configuration
└── sanity.cli.ts      # Sanity CLI configuration
```
