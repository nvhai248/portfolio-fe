# Sanity content migration checklist (hardcode -> Studio)

## Source of truth reviewed
- `web/src/lib/content/about.ts`
- `web/src/lib/content/projects.ts`
- `web/src/lib/content/cv.ts`
- `web/src/lib/types/content.ts`

## Contract coverage checklist

### About page (`aboutPage`)
- [x] `seo.title`
- [x] `seo.description`
- [x] `intro.eyebrow`
- [x] `intro.title`
- [x] `intro.description`
- [x] `cards[].heading`
- [x] `cards[].body`
- [x] `contributionPanel.title`
- [x] `contributionPanel.items[].label`
- [x] `contributionPanel.items[].text`

### Projects page (`projectsPage`)
- [x] `seo.title`
- [x] `seo.description`
- [x] `intro.eyebrow`
- [x] `intro.title`
- [x] `intro.description`
- [x] `labels.overview`
- [x] `labels.techStack`
- [x] `items[].title`
- [x] `items[].role`
- [x] `items[].domain`
- [x] `items[].overview`
- [x] `items[].detailLists[].heading`
- [x] `items[].detailLists[].items[]`
- [x] `items[].techStack[]`

### CV page (`cvPage`)
- [x] `seo.title`
- [x] `seo.description`
- [x] `intro.eyebrow`
- [x] `intro.title`
- [x] `intro.description`
- [x] `contactEmail`
- [x] `experienceItems[].role`
- [x] `experienceItems[].focus`
- [x] `experienceItems[].duration`
- [x] `experienceItems[].achievements[]`
- [x] `techSkills.title`
- [x] `techSkills.description`
- [x] `techSkills.categories[].heading`
- [x] `techSkills.categories[].summary`
- [x] `techSkills.categories[].context`
- [x] `techSkills.categories[].wide`
- [x] `education.school`
- [x] `education.degree`
- [x] `education.details`

## Seed/import artifacts
- NDJSON file: `studio/scripts/seed-content.ndjson`
- Import command:

```bash
cd studio
npm run seed:content
```

This import creates singleton docs:
- `aboutPage.singleton`
- `projectsPage.singleton`
- `cvPage.singleton`
