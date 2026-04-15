export default {
    name: 'post',
    title: 'Post',
    type: 'document',
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
            name: 'title',
            title: 'Title',
            type: 'string',
            validation: (Rule: any) => Rule.required().min(3),
        },
        {
            name: 'slug',
            title: 'Slug',
            type: 'slug',
            options: {
                source: 'title',
                maxLength: 96,
            },
            validation: (Rule: any) => Rule.required(),
        },
        {
            name: 'author',
            title: 'Author',
            type: 'reference',
            to: { type: 'author' },
        },
        {
            name: 'mainImage',
            title: 'Main image',
            type: 'image',
            options: {
                hotspot: true,
            },
        },
        {
            name: 'excerpt',
            title: 'Excerpt',
            description: 'Short summary for SEO meta descriptions and post listing cards.',
            type: 'text',
            rows: 3,
            validation: (Rule: any) => Rule.max(300),
        },
        {
            name: 'categories',
            title: 'Categories',
            type: 'array',
            of: [{ type: 'string' }],
        },
        {
            name: 'readTime',
            title: 'Read time',
            description: 'Estimated reading time (e.g. "8 min read").',
            type: 'string',
        },
        {
            name: 'publishedAt',
            title: 'Published at',
            type: 'datetime',
        },
        {
            name: 'body',
            title: 'Body',
            type: 'array',
            of: [
                {
                    type: 'block',
                    styles: [
                        {title: 'Normal', value: 'normal'},
                        {title: 'H2', value: 'h2'},
                        {title: 'H3', value: 'h3'},
                        {title: 'H4', value: 'h4'},
                        {title: 'Quote', value: 'blockquote'},
                    ],
                },
                {
                    type: 'image',
                    options: { hotspot: true }
                },
                {
                    type: 'code',
                    title: 'Code Block',
                    options: {
                        withFilename: true,
                    },
                },
            ],
        },
    ],
    preview: {
        select: {
            title: 'title',
            subtitle: 'publishedAt',
            media: 'mainImage',
        },
    },
}
