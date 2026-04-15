export default {
	name: 'contactSubmission',
	title: 'Contact Submission',
	type: 'document',
	readOnly: true,
	fields: [
		{
			name: 'name',
			title: 'Name',
			type: 'string',
			validation: (Rule: any) => Rule.required()
		},
		{
			name: 'email',
			title: 'Email',
			type: 'string',
			validation: (Rule: any) => Rule.required()
		},
		{
			name: 'subject',
			title: 'Subject',
			type: 'string'
		},
		{
			name: 'message',
			title: 'Message',
			type: 'text',
			rows: 6,
			validation: (Rule: any) => Rule.required()
		},
		{
			name: 'submittedAt',
			title: 'Submitted at',
			type: 'datetime',
			initialValue: () => new Date().toISOString(),
			validation: (Rule: any) => Rule.required()
		},
		{
			name: 'read',
			title: 'Read',
			type: 'boolean',
			initialValue: false
		}
	],
	preview: {
		select: {
			title: 'name',
			subtitle: 'email'
		}
	},
	orderings: [
		{
			title: 'Newest first',
			name: 'submittedAtDesc',
			by: [{field: 'submittedAt', direction: 'desc'}]
		}
	]
}
