export default {
	name: 'project',
	title: 'Project',
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
			validation: (Rule: any) => Rule.required().min(3)
		},
		{
			name: 'slug',
			title: 'Slug',
			type: 'slug',
			options: {
				source: 'title',
				maxLength: 96
			},
			validation: (Rule: any) => Rule.required()
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
			name: 'problemStatement',
			title: 'Problem statement',
			type: 'text',
			rows: 6,
			validation: (Rule: any) => Rule.required().min(30)
		},
		{
			name: 'detailLists',
			title: 'Key contribution / impact lists',
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
					],
					preview: {
						select: {
							title: 'heading'
						}
					}
				}
			],
			validation: (Rule: any) => Rule.required().min(1)
		},
		{
			name: 'responsibilities',
			title: 'Responsibilities',
			type: 'array',
			of: [{type: 'string'}],
			validation: (Rule: any) => Rule.required().min(1)
		},
		{
			name: 'architectureHighlights',
			title: 'Architecture highlights',
			type: 'array',
			of: [{type: 'string'}],
			validation: (Rule: any) => Rule.required().min(1)
		},
		{
			name: 'deliveryOutcomes',
			title: 'Delivery outcomes',
			type: 'array',
			of: [{type: 'string'}],
			validation: (Rule: any) => Rule.required().min(1)
		},
		{
			name: 'lessonsLearned',
			title: 'Lessons learned',
			type: 'array',
			of: [{type: 'string'}],
			validation: (Rule: any) => Rule.required().min(1)
		},
		{
			name: 'techStack',
			title: 'Tech stack',
			type: 'array',
			of: [{type: 'string'}],
			validation: (Rule: any) => Rule.required().min(1)
		},
		{
			name: 'timeline',
			title: 'Timeline',
			type: 'string'
		},
		{
			name: 'teamContext',
			title: 'Team context',
			type: 'text',
			rows: 3
		},
		{
			name: 'links',
			title: 'Related links',
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
							name: 'url',
							title: 'URL',
							type: 'string',
							validation: (Rule: any) => Rule.required().min(1)
						}
					],
					preview: {
						select: {
							title: 'label',
							subtitle: 'url'
						}
					}
				}
			]
		},
		{
			name: 'sortOrder',
			title: 'Sort order',
			type: 'number',
			initialValue: 10,
			validation: (Rule: any) => Rule.required().integer().min(1)
		}
	],
	preview: {
		select: {
			title: 'title',
			subtitle: 'role'
		}
	}
};
