export default {
  name: 'cvPage',
  title: 'CV Page (Legacy)',
  type: 'document',
  readOnly: true,
  deprecated: {
    reason: 'Legacy duplicate. Canonical /cv source is cv-main (type: cv).'
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
      validation: (Rule: any) => Rule.required()
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
          validation: (Rule: any) => Rule.required().min(3)
        },
        {name: 'description', title: 'Description', type: 'text', rows: 4}
      ]
    },
    {
      name: 'contactEmail',
      title: 'Contact email',
      type: 'string',
      validation: (Rule: any) => Rule.required().email()
    },
    {
      name: 'experienceItems',
      title: 'Experience items',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'role',
              title: 'Role',
              type: 'string',
              validation: (Rule: any) => Rule.required().min(3)
            },
            {
              name: 'focus',
              title: 'Focus',
              type: 'string',
              validation: (Rule: any) => Rule.required().min(3)
            },
            {
              name: 'duration',
              title: 'Duration',
              type: 'string',
              validation: (Rule: any) => Rule.required().min(3)
            },
            {
              name: 'achievements',
              title: 'Achievements',
              type: 'array',
              of: [{type: 'string'}],
              validation: (Rule: any) => Rule.required().min(1)
            }
          ],
          preview: {
            select: {
              title: 'role',
              subtitle: 'duration'
            }
          }
        }
      ],
      validation: (Rule: any) => Rule.required().min(1)
    },
    {
      name: 'techSkills',
      title: 'Tech skills',
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
          rows: 4,
          validation: (Rule: any) => Rule.required().min(12)
        },
        {
          name: 'categories',
          title: 'Categories',
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
                  name: 'summary',
                  title: 'Summary',
                  type: 'text',
                  rows: 2,
                  validation: (Rule: any) => Rule.required().min(5)
                },
                {
                  name: 'context',
                  title: 'Context',
                  type: 'text',
                  rows: 3,
                  validation: (Rule: any) => Rule.required().min(8)
                },
                {name: 'wide', title: 'Wide card', type: 'boolean', initialValue: false}
              ]
            }
          ],
          validation: (Rule: any) => Rule.required().min(1)
        }
      ]
    },
    {
      name: 'education',
      title: 'Education',
      type: 'object',
      fields: [
        {
          name: 'school',
          title: 'School',
          type: 'string',
          validation: (Rule: any) => Rule.required().min(3)
        },
        {
          name: 'degree',
          title: 'Degree',
          type: 'string',
          validation: (Rule: any) => Rule.required().min(3)
        },
        {
          name: 'details',
          title: 'Details',
          type: 'string',
          validation: (Rule: any) => Rule.required().min(3)
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
