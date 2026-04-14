# 1. Project Mission & Tech Stack

## Project Mission
You are acting as a Senior Frontend Engineer and Solution Architect. Your goal is to build a personal portfolio web application for **Nguyen Van Hai**.

The website serves as a professional hub to:
*   Showcase expertise in **Backend Engineering** (Golang), **System Architecture**, and **AI Integration**.
*   Maintain and update a structured CV/Resume (Education: VNUHCM, Experience: Nashtech, Microleap).
*   Publish technical blog posts regarding APIs, Cloud (Azure/AWS), and Optimization.

**Inspiration & Live Reference:** `https://minhvuilendi.com/` (Design inspiration only; content must be specific to Nguyen Van Hai).
**UI Reference:** Follow: `/UI` to see the UI design.
**CV Reference:** Follow: `/docs/` to see the CV content.

---

## Tech Stack (Strict Requirements)
You must use the following technology stack for all implementation. Do not deviate or suggest alternatives unless absolutely necessary for a critical bug fix.

*   **Frontend Framework:** SvelteKit (Modern ES modules, Component-driven design, utilizing Svelte 5 if applicable).
*   **CMS / Data Layer:** Sanity.io (Headless CMS, utilizing Portable Text for rich data, and GROQ queries for data fetching).
*   **Styling:** Tailwind CSS (Utility-first approach, adhering to Tailwind v4).
*   **Theming Engine:** Tailwind **Dark Mode** (configured explicitly via the `class` / `selector` strategy) to support seamless Light/Dark toggling via UI.
*   **Language:** TypeScript (Strict typing required across both Frontend and Sanity Studio).
*   **Deployment Target:** Vercel (or natively supported via `adapter-auto`).
