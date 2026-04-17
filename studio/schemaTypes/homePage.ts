export default {
	name: 'homePage',
	title: 'Home Page',
	type: 'document',
	fields: [
		{
			name: 'language',
			title: 'Language',
			type: 'string',
			initialValue: 'en',
			options: {
				list: [
					{ title: 'English', value: 'en' },
					{ title: 'Vietnamese', value: 'vi' }
				],
				layout: 'radio'
			},
			validation: (Rule: any) => Rule.required()
		},
		{
			name: 'heroTagline',
			title: 'Hero Tagline',
			type: 'string'
		},
		{
			name: 'heroTitle',
			title: 'Hero Title',
			type: 'string'
		},
		{
			name: 'heroDescription',
			title: 'Hero Description',
			type: 'text',
			rows: 3
		},
		{
			name: 'primaryCtaLabel',
			title: 'Primary CTA Label',
			type: 'string'
		},
		{
			name: 'secondaryCtaLabel',
			title: 'Secondary CTA Label',
			type: 'string'
		},
		{
			name: 'show3DHero',
			title: 'Show 3D Hero',
			type: 'boolean',
			initialValue: true
		},
		{
			name: 'opportunityTitle',
			title: 'Opportunity Section Title',
			type: 'string'
		},
		{
			name: 'opportunityDescription',
			title: 'Opportunity Section Description',
			type: 'text',
			rows: 3
		},
		{
			name: 'opportunityButtonLabel',
			title: 'Opportunity Button Label',
			type: 'string'
		}
	],
	preview: {
		select: {
			title: 'heroTitle',
			subtitle: 'language'
		}
	}
};
