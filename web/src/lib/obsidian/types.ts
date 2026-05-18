export type DriveFileNode = {
	id: string;
	name: string;
	mimeType: string;
	parentId?: string;
	path: string;
	isFolder: boolean;
	isMarkdown: boolean;
	modifiedTime?: string;
	children?: DriveFileNode[];
};

export type MarkdownNote = {
	id: string;
	name: string;
	path: string;
	content: string;
	modifiedTime?: string;
};

export type GraphNode = {
	id: string;
	label: string;
	path: string;
};

export type GraphEdge = {
	source: string;
	target: string;
	type: 'wikilink' | 'markdown-link';
};

export type ObsidianGraph = {
	nodes: GraphNode[];
	edges: GraphEdge[];
};

