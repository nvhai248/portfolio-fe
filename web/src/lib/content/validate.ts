import type {
	AboutContent,
	ProjectContent,
	ProjectsContent,
	TechSkillCategory,
	TechSkillsContent
} from '$lib/types/content';

const assertNonEmptyString = (value: string, path: string) => {
	if (typeof value !== 'string' || value.trim().length === 0) {
		throw new Error(`[content] ${path} must be a non-empty string`);
	}
};

const assertNonEmptyArray = <T>(value: T[], path: string) => {
	if (!Array.isArray(value) || value.length === 0) {
		throw new Error(`[content] ${path} must be a non-empty array`);
	}
};

const assertStringList = (value: string[], path: string) => {
	assertNonEmptyArray(value, path);
	value.forEach((item, index) => assertNonEmptyString(item, `${path}[${index}]`));
};

const validateProjectItem = (project: ProjectContent, path: string) => {
	assertNonEmptyString(project.title, `${path}.title`);
	assertNonEmptyString(project.slug, `${path}.slug`);
	assertNonEmptyString(project.role, `${path}.role`);
	assertNonEmptyString(project.domain, `${path}.domain`);
	assertNonEmptyString(project.overview, `${path}.overview`);
	assertNonEmptyString(project.problemStatement, `${path}.problemStatement`);
	assertNonEmptyArray(project.detailLists, `${path}.detailLists`);
	project.detailLists.forEach((detail, index) => {
		assertNonEmptyString(detail.heading, `${path}.detailLists[${index}].heading`);
		assertStringList(detail.items, `${path}.detailLists[${index}].items`);
	});
	assertStringList(project.techStack, `${path}.techStack`);
	assertStringList(project.responsibilities, `${path}.responsibilities`);
	assertStringList(project.architectureHighlights, `${path}.architectureHighlights`);
	assertStringList(project.deliveryOutcomes, `${path}.deliveryOutcomes`);
	assertStringList(project.lessonsLearned, `${path}.lessonsLearned`);

	if (project.timeline) {
		assertNonEmptyString(project.timeline, `${path}.timeline`);
	}

	if (project.teamContext) {
		assertNonEmptyString(project.teamContext, `${path}.teamContext`);
	}

	if (project.links) {
		assertNonEmptyArray(project.links, `${path}.links`);
		project.links.forEach((link, index) => {
			assertNonEmptyString(link.label, `${path}.links[${index}].label`);
			assertNonEmptyString(link.url, `${path}.links[${index}].url`);
		});
	}
};

const validateSkillCategory = (category: TechSkillCategory, path: string) => {
	assertNonEmptyString(category.heading, `${path}.heading`);
	assertNonEmptyString(category.summary, `${path}.summary`);
	assertNonEmptyString(category.context, `${path}.context`);
};

export const defineAboutContent = (content: AboutContent): AboutContent => {
	assertNonEmptyString(content.seo.title, 'about.seo.title');
	assertNonEmptyString(content.seo.description, 'about.seo.description');
	assertNonEmptyString(content.intro.title, 'about.intro.title');

	if (content.intro.description) {
		assertNonEmptyString(content.intro.description, 'about.intro.description');
	}

	assertNonEmptyArray(content.cards, 'about.cards');
	content.cards.forEach((card, index) => {
		assertNonEmptyString(card.heading, `about.cards[${index}].heading`);
		assertNonEmptyString(card.body, `about.cards[${index}].body`);
	});

	assertNonEmptyString(content.contributionPanel.title, 'about.contributionPanel.title');
	assertNonEmptyArray(content.contributionPanel.items, 'about.contributionPanel.items');
	content.contributionPanel.items.forEach((item, index) => {
		assertNonEmptyString(item.label, `about.contributionPanel.items[${index}].label`);
		assertNonEmptyString(item.text, `about.contributionPanel.items[${index}].text`);
	});

	return content;
};

export const defineProjectsContent = (content: ProjectsContent): ProjectsContent => {
	assertNonEmptyString(content.seo.title, 'projects.seo.title');
	assertNonEmptyString(content.seo.description, 'projects.seo.description');
	assertNonEmptyString(content.intro.title, 'projects.intro.title');
	assertNonEmptyString(content.labels.overview, 'projects.labels.overview');
	assertNonEmptyString(content.labels.techStack, 'projects.labels.techStack');
	assertNonEmptyArray(content.items, 'projects.items');
	content.items.forEach((item, index) => validateProjectItem(item, `projects.items[${index}]`));

	return content;
};

export const defineTechSkillsContent = (content: TechSkillsContent): TechSkillsContent => {
	assertNonEmptyString(content.title, 'techSkills.title');
	assertNonEmptyString(content.description, 'techSkills.description');
	assertNonEmptyArray(content.categories, 'techSkills.categories');
	content.categories.forEach((category, index) =>
		validateSkillCategory(category, `techSkills.categories[${index}]`)
	);

	return content;
};
