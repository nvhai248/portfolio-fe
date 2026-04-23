import {
	cloneDraftState,
	createDefaultDraftState,
	createId,
	isDesignerTab,
	sanitizeRelationships,
	type Column,
	type DesignerDraftState,
	type DesignerTab,
	type Relationship,
	type Table
} from './model';

export type DesignerHistoryEntry = {
	id: string;
	state: DesignerDraftState;
	savedAt: string;
};

export type PersistedDesignerDraft = {
	version: 1;
	currentState: DesignerDraftState;
	history: DesignerHistoryEntry[];
	historyIndex: number;
	updatedAt: string;
};

export const DATABASE_STORAGE_KEY = 'portfolio-database-draft-v1';
export const DATABASE_HISTORY_LIMIT = 80;

function isColumn(value: unknown): value is Column {
	if (!value || typeof value !== 'object') return false;

	const column = value as Record<string, unknown>;
	return (
		typeof column.id === 'string' &&
		typeof column.name === 'string' &&
		typeof column.type === 'string' &&
		typeof column.pk === 'boolean' &&
		typeof column.nullable === 'boolean'
	);
}

function isTable(value: unknown): value is Table {
	if (!value || typeof value !== 'object') return false;

	const table = value as Record<string, unknown>;
	return (
		typeof table.id === 'string' &&
		typeof table.name === 'string' &&
		Array.isArray(table.columns) &&
		table.columns.every(isColumn)
	);
}

function isRelationship(value: unknown): value is Relationship {
	if (!value || typeof value !== 'object') return false;

	const relationship = value as Record<string, unknown>;
	return (
		typeof relationship.id === 'string' &&
		typeof relationship.fromTableId === 'string' &&
		typeof relationship.fromColumnId === 'string' &&
		typeof relationship.toTableId === 'string' &&
		typeof relationship.toColumnId === 'string' &&
		(relationship.type === '1:1' || relationship.type === '1:N' || relationship.type === 'N:1')
	);
}

function normalizeDraftState(raw: unknown): DesignerDraftState | null {
	if (!raw || typeof raw !== 'object') return null;

	const state = raw as Record<string, unknown>;
	if (!Array.isArray(state.tables) || !state.tables.every(isTable)) return null;
	if (!Array.isArray(state.relationships) || !state.relationships.every(isRelationship)) return null;
	if (!isDesignerTab(state.activeTab)) return null;
	if (typeof state.sqlCode !== 'string') return null;

	const tables = state.tables;
	const relationships = sanitizeRelationships(tables, state.relationships);
	const activeTab = state.activeTab as DesignerTab;

	return cloneDraftState({
		tables,
		relationships,
		activeTab,
		sqlCode: state.sqlCode
	});
}

function isHistoryEntry(value: unknown): value is DesignerHistoryEntry {
	if (!value || typeof value !== 'object') return false;

	const entry = value as Record<string, unknown>;
	return (
		typeof entry.id === 'string' &&
		typeof entry.savedAt === 'string' &&
		normalizeDraftState(entry.state) !== null
	);
}

export function serializeDraftState(state: DesignerDraftState): string {
	return JSON.stringify(cloneDraftState(state));
}

export function createHistoryEntry(
	state: DesignerDraftState,
	savedAt = new Date().toISOString()
): DesignerHistoryEntry {
	return {
		id: createId(),
		state: cloneDraftState(state),
		savedAt
	};
}

export function normalizePersistedDraft(raw: unknown): PersistedDesignerDraft | null {
	if (!raw || typeof raw !== 'object') return null;

	const fallbackState = createDefaultDraftState();
	const draft = raw as Record<string, unknown>;
	const currentState = normalizeDraftState(draft.currentState) ?? fallbackState;

	let history = Array.isArray(draft.history)
		? draft.history
			.filter(isHistoryEntry)
			.map((entry) => ({
				id: entry.id,
				state: normalizeDraftState(entry.state) ?? currentState,
				savedAt: entry.savedAt
			}))
		: [];

	if (!history.length) {
		history = [createHistoryEntry(currentState)];
	}

	let historyIndex = typeof draft.historyIndex === 'number'
		? Math.trunc(draft.historyIndex)
		: history.length - 1;

	historyIndex = Math.min(Math.max(historyIndex, 0), history.length - 1);

	const historyState = history[historyIndex]?.state ?? currentState;
	const updatedAt = typeof draft.updatedAt === 'string' ? draft.updatedAt : history[historyIndex]?.savedAt ?? new Date().toISOString();

	if (serializeDraftState(historyState) !== serializeDraftState(currentState)) {
		history = [...history, createHistoryEntry(currentState, updatedAt)];
		if (history.length > DATABASE_HISTORY_LIMIT) {
			history = history.slice(-DATABASE_HISTORY_LIMIT);
		}
		historyIndex = history.length - 1;
	}

	return {
		version: 1,
		currentState,
		history,
		historyIndex,
		updatedAt
	};
}
