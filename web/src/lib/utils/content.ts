const socialIconMap: Record<string, string> = {
	github: 'code',
	linkedin: 'work',
	twitter: 'chat',
	medium: 'edit_note'
};

export const getSocialIcon = (platform = ''): string => socialIconMap[platform.toLowerCase()] ?? 'link';

export const getPostExcerpt = (post: { body?: any[] } | null | undefined): string =>
	post?.body?.[0]?.children?.find((child: { text?: string }) => child?.text)?.text ??
	'Practical lessons on shipping resilient systems with strong engineering standards.';

export const formatPublishedDate = (iso?: string): string =>
	iso
		? new Date(iso).toLocaleDateString('en-US', {
			year: 'numeric',
			month: 'short',
			day: 'numeric'
		})
		: 'Draft';
