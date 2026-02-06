export default {
    name: 'cv',
    title: 'CV',
    type: 'document',
    fields: [
        {
            name: 'title',
            title: 'Title',
            type: 'string'
        },
        {
            name: 'education',
            title: 'Education',
            type: 'array',
            of: [{
                type: 'object',
                fields: [
                    { name: 'institution', type: 'string', title: 'Institution' },
                    { name: 'degree', type: 'string', title: 'Degree' },
                    { name: 'startDate', type: 'date', title: 'Start Date' },
                    { name: 'endDate', type: 'date', title: 'End Date' },
                    {
                        name: 'description',
                        title: 'Description',
                        type: 'array',
                        of: [{ type: 'block' }]
                    }
                ]
            }]
        },
        {
            name: 'experience',
            title: 'Experience',
            type: 'array',
            of: [{
                type: 'object',
                fields: [
                    { name: 'company', type: 'string', title: 'Company' },
                    { name: 'role', type: 'string', title: 'Role' },
                    { name: 'startDate', type: 'date', title: 'Start Date' },
                    { name: 'endDate', type: 'date', title: 'End Date' },
                    {
                        name: 'description',
                        title: 'Description',
                        type: 'array',
                        of: [{ type: 'block' }]
                    }
                ]
            }]
        },
        {
            name: 'skills',
            title: 'Skills',
            type: 'array',
            of: [{ type: 'string' }]
        }
    ]
}
