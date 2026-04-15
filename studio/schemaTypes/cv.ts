export default {
	name: 'cv',
	title: 'CV',
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
			name: 'seo',
			title: 'SEO',
			type: 'object',
			validation: (Rule: any) => Rule.required(),
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
			validation: (Rule: any) => Rule.required(),
			fields: [
				{name: 'eyebrow', title: 'Eyebrow', type: 'string'},
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
					validation: (Rule: any) => Rule.required().min(20)
				}
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
							name: 'company',
							title: 'Company',
							type: 'string',
							validation: (Rule: any) => Rule.required().min(2)
						},
						{name: 'employmentType', title: 'Employment type', type: 'string'},
						{name: 'location', title: 'Location', type: 'string'},
						{
							name: 'focus',
							title: 'Focus',
							type: 'string',
							validation: (Rule: any) => Rule.required().min(8)
						},
						{
							name: 'duration',
							title: 'Duration',
							type: 'string',
							validation: (Rule: any) => Rule.required().min(3)
						},
						{
							name: 'impactSummary',
							title: 'Impact summary',
							type: 'text',
							rows: 3
						},
						{
							name: 'stack',
							title: 'Stack',
							type: 'array',
							of: [{type: 'string'}]
						},
						{
							name: 'highlights',
							title: 'Highlights',
							type: 'array',
							of: [{type: 'string'}]
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
							subtitle: 'company'
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
			validation: (Rule: any) => Rule.required(),
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
			validation: (Rule: any) => Rule.required(),
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
				},
				{name: 'specialization', title: 'Specialization', type: 'string'},
				{
					name: 'coursework',
					title: 'Relevant coursework',
					type: 'array',
					of: [{type: 'string'}]
				},
				{
					name: 'awards',
					title: 'Achievements',
					type: 'array',
					of: [{type: 'string'}]
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
};
