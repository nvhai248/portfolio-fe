export default {
    name: 'settings',
    title: 'Settings',
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
        },
        {
            name: 'title',
            title: 'Site Title',
            type: 'string',
        },
        {
            name: 'description',
            title: 'Site Description',
            type: 'text',
        },
        {
            name: 'keywords',
            title: 'Keywords',
            type: 'array',
            of: [{ type: 'string' }]
        },
        {
            name: 'socials',
            title: 'Social Links',
            type: 'array',
            of: [{
                type: 'object',
                fields: [
                    { name: 'platform', type: 'string', title: 'Platform' },
                    { name: 'url', type: 'url', title: 'URL' }
                ]
            }]
        }
    ],
}
