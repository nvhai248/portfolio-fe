export default {
	name: 'projectsPage',
	title: 'Projects Page',
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
			name: 'contentSourceNote',
			title: 'Content source',
			type: 'string',
			initialValue: 'Project cards and detail pages are sourced from Project documents.',
			readOnly: true
		}
	],
	preview: {
		select: {
			title: 'intro.title',
			subtitle: 'seo.title'
		}
	}
};
