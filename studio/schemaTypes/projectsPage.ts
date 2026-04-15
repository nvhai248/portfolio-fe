export default {
  name: 'projectsPage',
  title: 'Projects Page',
  type: 'document',
  fields: [
    {
      name: 'seo',
      title: 'SEO',
      type: 'object',
      fields: [
        {
          name: 'title',
          title: 'Title',
          type: 'string',
          validation: (Rule: any) => Rule.required().min(3)
        },
        {
          name: 'description',
          title: 'Description',
          type: 'text',
          rows: 3,
          validation: (Rule: any) => Rule.required().min(20)
        }
      ]
    },
    {
      name: 'intro',
      title: 'Intro',
      type: 'object',
      fields: [
        {name: 'eyebrow', title: 'Eyebrow', type: 'string'},
        {
          name: 'title',
          title: 'Title',
          type: 'string',
          validation: (Rule: any) => Rule.required().min(5)
        },
        {name: 'description', title: 'Description', type: 'text', rows: 4}
      ]
    },
    {
      name: 'labels',
      title: 'Labels',
      type: 'object',
      fields: [
        {
          name: 'overview',
          title: 'Overview label',
          type: 'string',
          validation: (Rule: any) => Rule.required().min(2)
        },
        {
          name: 'techStack',
          title: 'Tech stack label',
          type: 'string',
          validation: (Rule: any) => Rule.required().min(2)
        }
      ]
    },
    {
      name: 'items',
      title: 'Projects',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'title',
              title: 'Title',
              type: 'string',
              validation: (Rule: any) => Rule.required().min(3)
            },
            {
              name: 'role',
              title: 'Role',
              type: 'string',
              validation: (Rule: any) => Rule.required().min(3)
            },
            {
              name: 'domain',
              title: 'Domain',
              type: 'string',
              validation: (Rule: any) => Rule.required().min(2)
            },
            {
              name: 'overview',
              title: 'Overview',
              type: 'text',
              rows: 4,
              validation: (Rule: any) => Rule.required().min(20)
            },
            {
              name: 'detailLists',
              title: 'Detail lists',
              type: 'array',
              of: [
                {
                  type: 'object',
                  fields: [
                    {
                      name: 'heading',
                      title: 'Heading',
                      type: 'string',
                      validation: (Rule: any) => Rule.required().min(2)
                    },
                    {
                      name: 'items',
                      title: 'Items',
                      type: 'array',
                      of: [{type: 'string'}],
                      validation: (Rule: any) => Rule.required().min(1)
                    }
                  ]
                }
              ],
              validation: (Rule: any) => Rule.required().min(1)
            },
            {
              name: 'techStack',
              title: 'Tech stack',
              type: 'array',
              of: [{type: 'string'}],
              validation: (Rule: any) => Rule.required().min(1)
            }
          ],
          preview: {
            select: {
              title: 'title',
              subtitle: 'role'
            }
          }
        }
      ],
      validation: (Rule: any) => Rule.required().min(1)
    }
  ],
  preview: {
    select: {
      title: 'intro.title',
      subtitle: 'seo.title'
    }
  }
}
