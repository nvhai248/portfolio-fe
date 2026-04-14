# Content Update Guidelines (Phase 2)

This project now uses **data-driven content modules** for About / Projects / Tech Skills.
The UI should render from schema in `src/lib/content/*` and avoid hardcoded copy in route/components.

## 1) Source of truth

- `src/lib/content/about.ts` → `aboutContent`
- `src/lib/content/projects.ts` → `projectsContent`
- `src/lib/content/cv.ts` → `techSkillsContent`
- `src/lib/types/content.ts` → schema contracts
- `src/lib/content/validate.ts` → runtime guards for required fields

If a text block belongs to About, Projects, or Tech Skills, update it in content files above first.

## 2) Schema snapshot

### About (`AboutContent`)
- `seo.title`, `seo.description`
- `intro.eyebrow?`, `intro.title`, `intro.description?`
- `cards[]` with `heading`, `body`
- `contributionPanel.title`
- `contributionPanel.items[]` with `label`, `text`

### Projects (`ProjectsContent`)
- `seo.title`, `seo.description`
- `intro.*`
- `labels.overview`, `labels.techStack`
- `items[]`:
  - `title`, `role`, `domain`, `overview`
  - `detailLists[]` with `heading`, `items[]`
  - `techStack[]`

### Tech Skills (`TechSkillsContent`)
- `title`, `description`
- `categories[]` with `heading`, `summary`, `context`, `wide?`

## 3) Writing style and tone

- Keep copy concise, outcome-oriented, and evidence-based.
- Prefer concrete impact language (e.g., reliability, latency, deployment confidence).
- Avoid marketing-heavy or vague claims.
- Keep bullets parallel in structure and verb tense.

## 4) Responsive consistency rules

For long titles/list items:
- Use natural sentence case and avoid unnecessary ALL CAPS.
- Keep headings short where possible.
- Break long stacks into multiple items in `techStack[]` instead of one long string.
- Keep each bullet focused on one idea.

UI already includes `break-words` and flexible grid behavior; still keep content readable on mobile.

## 5) Do / Don’t

### Do
- Update only data in content modules for copy changes.
- Keep required fields non-empty.
- Run checks before merge:
  - `npm run check`
  - `npm run build`
  - `npm run test:smoke`

### Don’t
- Hardcode section text in route/component files.
- Collapse list data into giant comma-separated paragraphs.
- Skip validation errors from `src/lib/content/validate.ts`.

## 6) Example edits

- Add new project: append one object to `projectsContent.items` with required fields.
- Rename About panel title: edit `aboutContent.contributionPanel.title`.
- Expand skill section: add one `categories[]` item in `techSkillsContent` (set `wide: true` only when card needs extra width).
