export default {
  name: 'aboutPage',
  title: 'About Page (Legacy)',
  type: 'document',
  readOnly: true,
  deprecated: {
    reason: 'Legacy duplicate. Canonical /about source is author-main.aboutPage.'
  },
  fields: [
    {
      name: 'language',
      title: 'Language',
      type: 'string',
      initialValue: 'en',
      options: {
        list: [
          {title: 'English', value: 'en'},
          {title: 'Vietnamese', value: 'vi'}
        ],
        layout: 'radio'
      },
      validation: (Rule: any) => Rule.required(),
    },
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
      name: 'cards',
      title: 'Cards',
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
              name: 'body',
              title: 'Body',
              type: 'text',
              rows: 3,
              validation: (Rule: any) => Rule.required().min(8)
            }
          ],
          preview: {
            select: {title: 'heading', subtitle: 'body'}
          }
        }
      ],
      validation: (Rule: any) => Rule.required().min(1)
    },
    {
      name: 'contributionPanel',
      title: 'Contribution Panel',
      type: 'object',
      fields: [
        {
          name: 'title',
          title: 'Title',
          type: 'string',
          validation: (Rule: any) => Rule.required().min(3)
        },
        {
          name: 'items',
          title: 'Items',
          type: 'array',
          of: [
            {
              type: 'object',
              fields: [
                {
                  name: 'label',
                  title: 'Label',
                  type: 'string',
                  validation: (Rule: any) => Rule.required().min(2)
                },
                {
                  name: 'text',
                  title: 'Text',
                  type: 'text',
                  rows: 3,
                  validation: (Rule: any) => Rule.required().min(8)
                }
              ],
              preview: {
                select: {title: 'label', subtitle: 'text'}
              }
            }
          ],
          validation: (Rule: any) => Rule.required().min(1)
        }
      ]
    }
  ],
  preview: {
    select: {
      title: 'intro.title',
      subtitle: 'seo.title'
    }
  }
}
