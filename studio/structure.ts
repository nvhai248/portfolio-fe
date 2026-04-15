import type {StructureResolver} from 'sanity/structure'

const HIDDEN_FROM_ROOT = new Set(['author', 'cv', 'projectsPage', 'aboutPage', 'cvPage'])

export const structure: StructureResolver = (S) =>
  S.list()
    .title('Content')
    .items([
      S.listItem()
        .title('Canonical content')
        .child(
          S.list()
            .title('Canonical content')
            .items([
              S.listItem()
                .title('About (/about) — author-main')
                .child(S.document().schemaType('author').documentId('author-main')),
              S.listItem()
                .title('Projects metadata (/projects) — projectsPage.singleton')
                .child(S.document().schemaType('projectsPage').documentId('projectsPage.singleton')),
              S.listItem()
                .title('CV (/cv) — cv-main')
                .child(S.document().schemaType('cv').documentId('cv-main')),
              S.divider(),
              S.documentTypeListItem('project').title('Project items'),
              S.documentTypeListItem('post').title('Blog posts'),
              S.documentTypeListItem('settings').title('Site settings')
            ])
        ),
      S.listItem()
        .title('Legacy / archived')
        .child(
          S.list()
            .title('Legacy / archived')
            .items([
              S.listItem()
                .title('Legacy aboutPage documents')
                .child(S.documentTypeList('aboutPage').title('Legacy aboutPage documents')),
              S.listItem()
                .title('Legacy cvPage documents')
                .child(S.documentTypeList('cvPage').title('Legacy cvPage documents')),
              S.listItem()
                .title('Other author profiles')
                .child(
                  S.documentTypeList('author')
                    .title('Other author profiles')
                    .filter('_type == "author" && _id != "author-main" && _id != "drafts.author-main"')
                )
            ])
        ),
      S.divider(),
      ...S.documentTypeListItems().filter((item) => {
        const id = item.getId()
        return !!id && !HIDDEN_FROM_ROOT.has(id)
      })
    ])
