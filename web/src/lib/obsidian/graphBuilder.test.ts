import { describe, it, expect } from 'vitest';
import { buildObsidianGraph, buildGraphNodesOnly } from './graphBuilder';
import type { DriveFileNode } from './types';

const makeFile = (id: string, name: string, path: string): DriveFileNode => ({
	id,
	name,
	mimeType: 'text/markdown',
	path,
	isFolder: false,
	isMarkdown: true
});

const makeFolder = (id: string, name: string, path: string, children: DriveFileNode[]): DriveFileNode => ({
	id,
	name,
	mimeType: 'application/vnd.google-apps.folder',
	path,
	isFolder: true,
	isMarkdown: false,
	children
});

describe('buildObsidianGraph', () => {
	const tree = makeFolder('root', 'Vault', '', [
		makeFile('a', 'Note A.md', 'Note A.md'),
		makeFile('b', 'Note B.md', 'Note B.md'),
		makeFolder('sub', 'subfolder', 'subfolder', [
			makeFile('c', 'Note C.md', 'subfolder/Note C.md')
		])
	]);

	it('returns all markdown files as graph nodes', () => {
		const graph = buildObsidianGraph(tree, new Map());
		expect(graph.nodes).toHaveLength(3);
		expect(graph.nodes.map((n) => n.id).sort()).toEqual(['a', 'b', 'c']);
	});

	it('labels nodes without .md extension', () => {
		const graph = buildObsidianGraph(tree, new Map());
		const noteA = graph.nodes.find((n) => n.id === 'a');
		expect(noteA?.label).toBe('Note A');
	});

	it('creates edges for wiki links', () => {
		const contents = new Map([['a', '# Note A\n\nSee also [[Note B]] and [[subfolder/Note C]]']]);

		const graph = buildObsidianGraph(tree, contents);

		expect(graph.edges).toHaveLength(2);
		expect(graph.edges).toContainEqual({ source: 'a', target: 'b', type: 'wikilink' });
		expect(graph.edges).toContainEqual({ source: 'a', target: 'c', type: 'wikilink' });
	});

	it('creates edges for wiki links with aliases', () => {
		const contents = new Map([['a', '[[Note B|my alias]]']]);

		const graph = buildObsidianGraph(tree, contents);

		expect(graph.edges).toHaveLength(1);
		expect(graph.edges[0]).toEqual({ source: 'a', target: 'b', type: 'wikilink' });
	});

	it('creates edges for markdown links', () => {
		const contents = new Map([['b', 'Check [this note](Note A.md) and [nested](subfolder/Note C.md)']]);

		const graph = buildObsidianGraph(tree, contents);

		expect(graph.edges).toHaveLength(2);
		expect(graph.edges).toContainEqual({ source: 'b', target: 'a', type: 'markdown-link' });
		expect(graph.edges).toContainEqual({ source: 'b', target: 'c', type: 'markdown-link' });
	});

	it('ignores self-references', () => {
		const contents = new Map([['a', '[[Note A]]']]);

		const graph = buildObsidianGraph(tree, contents);

		expect(graph.edges).toHaveLength(0);
	});

	it('deduplicates edges', () => {
		const contents = new Map([['a', '[[Note B]] and again [[Note B]]']]);

		const graph = buildObsidianGraph(tree, contents);

		expect(graph.edges).toHaveLength(1);
	});

	it('ignores links to non-existent notes', () => {
		const contents = new Map([['a', '[[Non Existent Note]]']]);

		const graph = buildObsidianGraph(tree, contents);

		expect(graph.edges).toHaveLength(0);
	});

	it('ignores external URLs in markdown links', () => {
		const contents = new Map([['a', '[Google](https://google.com) and [anchor](#heading)']]);

		const graph = buildObsidianGraph(tree, contents);

		expect(graph.edges).toHaveLength(0);
	});

	it('resolves basename match when path match fails', () => {
		const contents = new Map([['a', '[[Note C]]']]);

		const graph = buildObsidianGraph(tree, contents);

		expect(graph.edges).toHaveLength(1);
		expect(graph.edges[0]).toEqual({ source: 'a', target: 'c', type: 'wikilink' });
	});

	it('returns empty edges when no content provided', () => {
		const graph = buildObsidianGraph(tree, new Map());

		expect(graph.nodes).toHaveLength(3);
		expect(graph.edges).toHaveLength(0);
	});
});

describe('buildGraphNodesOnly', () => {
	it('returns nodes without edges', () => {
		const tree = makeFolder('root', 'Vault', '', [
			makeFile('a', 'Note A.md', 'Note A.md'),
			makeFile('b', 'Note B.md', 'Note B.md')
		]);

		const graph = buildGraphNodesOnly(tree);

		expect(graph.nodes).toHaveLength(2);
		expect(graph.edges).toHaveLength(0);
	});

	it('skips non-markdown files', () => {
		const tree = makeFolder('root', 'Vault', '', [
			makeFile('a', 'Note.md', 'Note.md'),
			{
				id: 'img',
				name: 'photo.png',
				mimeType: 'image/png',
				path: 'photo.png',
				isFolder: false,
				isMarkdown: false
			}
		]);

		const graph = buildGraphNodesOnly(tree);

		expect(graph.nodes).toHaveLength(1);
		expect(graph.nodes[0].id).toBe('a');
	});
});
