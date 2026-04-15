export default {
  name: 'author',
  title: 'Author',
  type: 'document',
  fields: [
    {
      name: 'name',
      title: 'Name',
      type: 'string',
      validation: (Rule: any) => Rule.required().min(2),
    },
    {
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'name',
        maxLength: 96,
      },
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'image',
      title: 'Image',
      type: 'image',
      options: {
        hotspot: true,
      },
    },
    {
      name: 'bio',
      title: 'Bio',
      type: 'array',
      of: [
        {
          title: 'Block',
          type: 'block',
          styles: [{title: 'Normal', value: 'normal'}],
          lists: [],
        },
      ],
    },
    {
      name: 'aboutPage',
      title: 'About Page Content',
      description:
        'Primary source for the /about page in UI. Keep this aligned with public profile messaging.',
      type: 'object',
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
              validation: (Rule: any) => Rule.required().min(3),
            },
            {
              name: 'description',
              title: 'Description',
              type: 'text',
              rows: 3,
              validation: (Rule: any) => Rule.required().min(20),
            },
          ],
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
              validation: (Rule: any) => Rule.required().min(5),
            },
            {
              name: 'description',
              title: 'Description',
              type: 'text',
              rows: 5,
              validation: (Rule: any) => Rule.required().min(20),
            },
          ],
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
                  validation: (Rule: any) => Rule.required().min(2),
                },
                {
                  name: 'body',
                  title: 'Body',
                  type: 'text',
                  rows: 4,
                  validation: (Rule: any) => Rule.required().min(16),
                },
              ],
              preview: {
                select: {title: 'heading', subtitle: 'body'},
              },
            },
          ],
          validation: (Rule: any) => Rule.required().min(4).max(8),
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
              validation: (Rule: any) => Rule.required().min(3),
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
                      validation: (Rule: any) => Rule.required().min(2),
                    },
                    {
                      name: 'text',
                      title: 'Text',
                      type: 'text',
                      rows: 4,
                      validation: (Rule: any) => Rule.required().min(16),
                    },
                  ],
                  preview: {
                    select: {title: 'label', subtitle: 'text'},
                  },
                },
              ],
              validation: (Rule: any) => Rule.required().min(4).max(8),
            },
          ],
        },
      ],
    },
  ],
}
