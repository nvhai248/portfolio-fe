import fs from 'node:fs/promises'
import path from 'node:path'
import {fileURLToPath} from 'node:url'
import {getCliClient} from 'sanity/cli'

type AnyRecord = Record<string, unknown>

type AuthorDoc = {
  _id: string
  _type: 'author'
  name?: string
  slug?: {_type: 'slug'; current: string}
  bio?: unknown[]
  aboutPage?: AnyRecord
}

type CvDoc = {
  _id: string
  _type: 'cv'
  seo?: AnyRecord
  intro?: AnyRecord
  contactEmail?: string
  experienceItems?: unknown[]
  techSkills?: AnyRecord
  education?: AnyRecord
}

type AboutPageDoc = {
  _id: string
  _type: 'aboutPage'
  seo?: AnyRecord
  intro?: AnyRecord
  cards?: unknown[]
  contributionPanel?: AnyRecord
}

type CvPageDoc = {
  _id: string
  _type: 'cvPage'
  seo?: AnyRecord
  intro?: AnyRecord
  contactEmail?: string
  experienceItems?: unknown[]
  techSkills?: AnyRecord
  education?: AnyRecord
}

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const client = getCliClient({apiVersion: '2024-01-01'})

const isObject = (value: unknown): value is AnyRecord =>
  typeof value === 'object' && value !== null && !Array.isArray(value)

const deepMergeMissing = <T>(target: T, source: unknown): T => {
  if (Array.isArray(target) || Array.isArray(source)) {
    return target
  }

  if (!isObject(target) || !isObject(source)) {
    return target
  }

  const output: AnyRecord = {...target}

  for (const [key, sourceValue] of Object.entries(source)) {
    const current = output[key]

    if (current === undefined || current === null) {
      output[key] = sourceValue
      continue
    }

    if (isObject(current) && isObject(sourceValue)) {
      output[key] = deepMergeMissing(current, sourceValue)
    }
  }

  return output as T
}

const pickLegacyAboutPage = (legacy: AboutPageDoc | null): AnyRecord | null => {
  if (!legacy) {
    return null
  }

  const out: AnyRecord = {}
  for (const key of ['seo', 'intro', 'cards', 'contributionPanel'] as const) {
    const value = legacy[key]
    if (value !== undefined && value !== null) {
      out[key] = value
    }
  }

  return Object.keys(out).length > 0 ? out : null
}

const pickLegacyCv = (legacy: CvPageDoc | null): Partial<CvDoc> | null => {
  if (!legacy) {
    return null
  }

  const out: Partial<CvDoc> = {}
  for (const key of ['seo', 'intro', 'contactEmail', 'experienceItems', 'techSkills', 'education'] as const) {
    const value = legacy[key]
    if (value !== undefined && value !== null) {
      out[key] = value
    }
  }

  return Object.keys(out).length > 0 ? out : null
}

const run = async () => {
  const [authorMain, authorFallback, aboutLegacy, cvMain, cvLegacy, projectsPage] = await Promise.all([
    client.fetch<AuthorDoc | null>(`*[_id == 'author-main'][0]`),
    client.fetch<AuthorDoc | null>(`*[_type == 'author' && slug.current == 'hai-nguyen' && !(_id in path('drafts.**'))][0]`),
    client.fetch<AboutPageDoc | null>(`*[_type == 'aboutPage'][0]`),
    client.fetch<CvDoc | null>(`*[_id == 'cv-main'][0]`),
    client.fetch<CvPageDoc | null>(`*[_type == 'cvPage'][0]`),
    client.fetch<AnyRecord | null>(`*[_type == 'projectsPage'][0]`),
  ])

  const backupDir = path.resolve(__dirname, 'backups')
  await fs.mkdir(backupDir, {recursive: true})
  const stamp = new Date().toISOString().replace(/[:.]/g, '-')
  const backupPath = path.join(backupDir, `${stamp}-canonical-migration-backup.json`)
  await fs.writeFile(
    backupPath,
    JSON.stringify(
      {
        createdAt: new Date().toISOString(),
        docs: {authorMain, authorFallback, aboutLegacy, cvMain, cvLegacy, projectsPage},
      },
      null,
      2,
    ),
    'utf8',
  )

  let authorAction = 'noop'
  const legacyAbout = pickLegacyAboutPage(aboutLegacy)

  if (!authorMain && legacyAbout) {
    const seedSource = authorFallback ?? null
    const doc: AuthorDoc = {
      _id: 'author-main',
      _type: 'author',
      name: seedSource?.name ?? 'Nguyen Van Hai',
      slug: seedSource?.slug ?? {_type: 'slug', current: 'nguyen-van-hai'},
      bio: seedSource?.bio ?? [],
      aboutPage: legacyAbout,
    }

    await client.createIfNotExists(doc)
    authorAction = 'created author-main from legacy aboutPage source'
  } else if (authorMain && legacyAbout) {
    const merged = deepMergeMissing(authorMain.aboutPage ?? {}, legacyAbout)
    const changed = JSON.stringify(merged) !== JSON.stringify(authorMain.aboutPage ?? {})

    if (changed) {
      await client.patch('author-main').set({aboutPage: merged}).commit({autoGenerateArrayKeys: true})
      authorAction = 'patched author-main.aboutPage with missing legacy fields'
    }
  }

  let cvAction = 'noop'
  const legacyCv = pickLegacyCv(cvLegacy)

  if (!cvMain && legacyCv) {
    await client.createIfNotExists({_id: 'cv-main', _type: 'cv', ...legacyCv})
    cvAction = 'created cv-main from legacy cvPage source'
  } else if (cvMain && legacyCv) {
    const merged = deepMergeMissing(cvMain, legacyCv)

    const patchPayload: Partial<CvDoc> = {}
    for (const key of ['seo', 'intro', 'contactEmail', 'experienceItems', 'techSkills', 'education'] as const) {
      const nextValue = merged[key]
      const oldValue = cvMain[key]
      if (JSON.stringify(nextValue) !== JSON.stringify(oldValue) && nextValue !== undefined) {
        patchPayload[key] = nextValue
      }
    }

    if (Object.keys(patchPayload).length > 0) {
      await client.patch('cv-main').set(patchPayload).commit({autoGenerateArrayKeys: true})
      cvAction = 'patched cv-main with missing legacy fields'
    }
  }

  const projectCount = await client.fetch<number>(`count(*[_type == 'project' && !(_id in path('drafts.**'))])`)

  console.log(
    JSON.stringify(
      {
        ok: true,
        backupPath,
        authorAction,
        cvAction,
        checks: {
          hasAuthorMain: !!(authorMain || legacyAbout),
          hasCvMain: !!(cvMain || legacyCv),
          projectCount,
          projectsPageHasMetadata: !!projectsPage,
        },
      },
      null,
      2,
    ),
  )
}

run().catch((error) => {
  console.error('canonical migration failed:', error)
  process.exit(1)
})
