import type { DriveFileNode, GraphNode, GraphEdge, ObsidianGraph } from './types';

const wikiLinkRegex = /\[\[([^\]|]+)(?:\|[^\]]+)?\]\]/g;
const markdownLinkRegex = /\[[^\]]+\]\(([^)]+\.md)\)/g;

/**
 * Normalize a note reference for comparison.
 * Removes .md extension, decodes URI characters, and lowercases.
 */
const normalizeRef = (ref: string): string =>
	decodeURIComponent(ref)
		.replace(/\.md$/i, '')
		.trim()
		.toLowerCase();

/**
 * Extract the basename from a path (e.g. "folder/My Note.md" → "my note").
 */
const basename = (path: string): string => {
	const parts = path.split('/');
	return normalizeRef(parts[parts.length - 1]);
};

/**
 * Collect all markdown files from the tree into a flat list.
 */
const collectMarkdownFiles = (node: DriveFileNode, result: DriveFileNode[] = []): DriveFileNode[] => {
	if (node.isMarkdown) {
		result.push(node);
	}
	if (node.isFolder && node.children) {
		for (const child of node.children) {
			collectMarkdownFiles(child, result);
		}
	}
	return result;
};

type NoteEntry = {
	id: string;
	name: string;
	path: string;
	normalizedPath: string;
	normalizedBasename: string;
};

/**
 * Build a lookup index for resolving note references to their IDs.
 */
const buildNoteIndex = (files: DriveFileNode[]): NoteEntry[] =>
	files.map((file) => ({
		id: file.id,
		name: file.name,
		path: file.path,
		normalizedPath: normalizeRef(file.path),
		normalizedBasename: basename(file.name)
	}));

/**
 * Resolve a wiki-link or markdown-link reference to a note ID.
 * Tries path match first, then falls back to basename match.
 */
const resolveRef = (ref: string, index: NoteEntry[]): string | null => {
	const normalizedRef = normalizeRef(ref);

	// Try exact path match
	const byPath = index.find((entry) => entry.normalizedPath === normalizedRef);
	if (byPath) return byPath.id;

	// Try basename match
	const refBasename = basename(ref);
	const byBasename = index.find((entry) => entry.normalizedBasename === refBasename);
	if (byBasename) return byBasename.id;

	return null;
};

/**
 * Extract all link references from markdown content.
 */
const extractLinks = (content: string): { ref: string; type: 'wikilink' | 'markdown-link' }[] => {
	const links: { ref: string; type: 'wikilink' | 'markdown-link' }[] = [];

	let match: RegExpExecArray | null;

	wikiLinkRegex.lastIndex = 0;
	while ((match = wikiLinkRegex.exec(content)) !== null) {
		links.push({ ref: match[1], type: 'wikilink' });
	}

	markdownLinkRegex.lastIndex = 0;
	while ((match = markdownLinkRegex.exec(content)) !== null) {
		// Skip absolute URLs and anchors
		const target = match[1];
		if (!target.startsWith('http') && !target.startsWith('#')) {
			links.push({ ref: target, type: 'markdown-link' });
		}
	}

	return links;
};

/**
 * Build a graph from a file tree and a map of file contents.
 * @param treeRoot - The Drive file tree root node.
 * @param contents - Map of file ID to markdown content string.
 */
export const buildObsidianGraph = (
	treeRoot: DriveFileNode,
	contents: Map<string, string>
): ObsidianGraph => {
	const files = collectMarkdownFiles(treeRoot);
	const index = buildNoteIndex(files);

	const nodes: GraphNode[] = files.map((file) => ({
		id: file.id,
		label: file.name.replace(/\.md$/i, ''),
		path: file.path
	}));

	const nodeIds = new Set(nodes.map((n) => n.id));
	const edgeSet = new Set<string>();
	const edges: GraphEdge[] = [];

	for (const file of files) {
		const content = contents.get(file.id);
		if (!content) continue;

		const links = extractLinks(content);

		for (const link of links) {
			const targetId = resolveRef(link.ref, index);
			if (!targetId || !nodeIds.has(targetId)) continue;
			if (targetId === file.id) continue; // Skip self-references

			const edgeKey = `${file.id}->${targetId}`;
			if (edgeSet.has(edgeKey)) continue;

			edgeSet.add(edgeKey);
			edges.push({
				source: file.id,
				target: targetId,
				type: link.type
			});
		}
	}

	return { nodes, edges };
};

/**
 * Build a graph from a tree alone (without content) — produces nodes only, no edges.
 * Useful for quick rendering before all content is fetched.
 */
export const buildGraphNodesOnly = (treeRoot: DriveFileNode): ObsidianGraph => {
	const files = collectMarkdownFiles(treeRoot);
	return {
		nodes: files.map((file) => ({
			id: file.id,
			label: file.name.replace(/\.md$/i, ''),
			path: file.path
		})),
		edges: []
	};
};
