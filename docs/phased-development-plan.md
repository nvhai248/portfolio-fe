# Admin Obsidian Notes Feature Plan for Svelte Project

Project path on local machine:

```txt
/Users/hainguyenvan/Desktop/PW/portfolio-fe/web
```

## Goal

Add an admin-only Obsidian-like notes tool to the existing Svelte project.

The feature must support:

1. Google login.
2. Admin-only access based on `ADMIN_GOOGLE_USER`.
3. Google Drive connection for the admin account.
4. Default Obsidian Drive folder:

   ```txt
   https://drive.google.com/drive/u/1/folders/1C4UvPfyyiMIiwqa-dPNzhxbuAU1vmE4T
   ```

5. Auto-detect the Obsidian vault from the configured Drive folder.
6. Edit Markdown files.
7. Create folders and Markdown documents.
8. Reveal the current file in the sidebar.
9. View all notes in a graph view similar to Obsidian.
10. Clicking a graph node opens the corresponding document.
11. Auto-save edits back to Google Drive.
12. Show the feature only to the admin user.

---

## Recommended Feature Name

```txt
Admin Obsidian Notes
```

Recommended route:

```txt
/admin/obsidian-notes
```

Recommended sidebar/tool label:

```txt
Admin Obsidian Notes
```

---

## Environment Variables

Add these to the project environment.

For SvelteKit, use `.env`:

```env
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
ADMIN_GOOGLE_USER=your-admin-email@gmail.com
GOOGLE_DRIVE_OBSIDIAN_FOLDER_ID=1C4UvPfyyiMIiwqa-dPNzhxbuAU1vmE4T
GOOGLE_DRIVE_OBSIDIAN_FOLDER_URL=https://drive.google.com/drive/u/1/folders/1C4UvPfyyiMIiwqa-dPNzhxbuAU1vmE4T
SESSION_SECRET=
```

For public client-side usage, only expose safe values:

```env
PUBLIC_GOOGLE_CLIENT_ID=
```

Do **not** expose:

```txt
GOOGLE_CLIENT_SECRET
ADMIN_GOOGLE_USER
SESSION_SECRET
Google refresh tokens
```

---

## Google Cloud Setup

Create or update a Google Cloud OAuth app.

Required OAuth scopes:

```txt
openid
email
profile
https://www.googleapis.com/auth/drive
https://www.googleapis.com/auth/drive.file
```

Recommended redirect URL for local dev:

```txt
http://localhost:5173/auth/google/callback
```

Recommended redirect URL for production:

```txt
https://your-domain.com/auth/google/callback
```

Enable APIs:

```txt
Google Drive API
```

---

## Authentication Design

### Login Flow

1. User clicks "Login with Google".
2. Redirect user to Google OAuth.
3. Google redirects back to:

   ```txt
   /auth/google/callback
   ```

4. Server exchanges the auth code for tokens.
5. Server fetches Google profile.
6. Server stores user session.
7. Server compares user email with:

   ```txt
   ADMIN_GOOGLE_USER
   ```

8. If matched, set:

   ```ts
   user.isAdmin = true;
   ```

9. Only admin users can see and access Admin Obsidian Notes.

### Session User Shape

```ts
export type SessionUser = {
  id: string;
  email: string;
  name?: string;
  picture?: string;
  isAdmin: boolean;
};
```

---

## Admin Guard

All admin UI and APIs must validate admin access.

Do not rely only on hiding buttons in the UI.

Add server-side guard:

```ts
export function requireAdmin(event) {
  const user = event.locals.user;

  if (!user || !user.isAdmin) {
    throw error(403, 'Admin access required');
  }

  return user;
}
```

Use this guard in every Drive/Obsidian API endpoint.

---

## Suggested File Structure

```txt
src/
  lib/
    auth/
      google.ts
      session.ts
      requireAdmin.ts

    google-drive/
      driveClient.server.ts
      driveFiles.server.ts
      driveFolders.server.ts
      markdownDriveSync.server.ts

    obsidian/
      vaultDetector.server.ts
      markdownParser.ts
      graphBuilder.ts
      types.ts

    components/
      admin-obsidian/
        AdminObsidianLayout.svelte
        ObsidianSidebar.svelte
        ObsidianToolbar.svelte
        MarkdownEditor.svelte
        MarkdownPreview.svelte
        GraphView.svelte
        FileTreeItem.svelte

  routes/
    auth/
      google/
        +server.ts
      google/
        callback/
          +server.ts
      logout/
        +server.ts

    admin/
      obsidian-notes/
        +page.server.ts
        +page.svelte

    api/
      admin/
        obsidian/
          vault/
            +server.ts
          tree/
            +server.ts
          file/
            +server.ts
          folder/
            +server.ts
          graph/
            +server.ts
```

Adjust the structure if the current project is not SvelteKit.

---

## Core Data Types

Create:

```txt
src/lib/obsidian/types.ts
```

```ts
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
```

---

## Google Drive Integration

### Drive Client

Create a server-only Google Drive client.

Recommended package:

```bash
npm install googleapis
```

Server file:

```txt
src/lib/google-drive/driveClient.server.ts
```

Responsibilities:

1. Use stored OAuth tokens from the admin user.
2. Refresh access tokens when needed.
3. Return an authenticated Drive client.
4. Never expose tokens to the browser.

---

## Vault Detection

Default folder ID:

```txt
1C4UvPfyyiMIiwqa-dPNzhxbuAU1vmE4T
```

Vault detection logic:

1. Load the default Drive folder.
2. Check if it contains Markdown files or Obsidian folders.
3. Obsidian indicators:

   ```txt
   .obsidian/
   *.md
   attachments/
   assets/
   ```

4. If the root folder contains `.obsidian`, use it as the vault.
5. If not, search one level deep for a folder containing `.obsidian`.
6. If still not found, use the configured Drive folder as the vault root.

Pseudo-code:

```ts
export async function detectVaultRoot(drive, defaultFolderId: string) {
  const children = await listFolderChildren(drive, defaultFolderId);

  const hasObsidianFolder = children.some(
    (item) => item.name === '.obsidian' && item.mimeType === GOOGLE_FOLDER_MIME
  );

  const hasMarkdown = children.some((item) => item.name.endsWith('.md'));

  if (hasObsidianFolder || hasMarkdown) {
    return defaultFolderId;
  }

  for (const folder of children.filter((item) => item.mimeType === GOOGLE_FOLDER_MIME)) {
    const subChildren = await listFolderChildren(drive, folder.id);

    const isVault = subChildren.some(
      (item) => item.name === '.obsidian' || item.name.endsWith('.md')
    );

    if (isVault) {
      return folder.id;
    }
  }

  return defaultFolderId;
}
```

---

## API Endpoints

### `GET /api/admin/obsidian/vault`

Returns detected vault information.

Response:

```json
{
  "vaultRootId": "drive-folder-id",
  "vaultName": "Vault Name"
}
```

### `GET /api/admin/obsidian/tree`

Returns folder and Markdown file tree.

Response:

```json
{
  "root": {
    "id": "folder-id",
    "name": "Vault",
    "isFolder": true,
    "children": []
  }
}
```

### `GET /api/admin/obsidian/file?id=FILE_ID`

Returns one Markdown file.

Response:

```json
{
  "id": "file-id",
  "name": "note.md",
  "path": "folder/note.md",
  "content": "# Note",
  "modifiedTime": "..."
}
```

### `PUT /api/admin/obsidian/file`

Updates a Markdown file in Drive.

Request:

```json
{
  "id": "file-id",
  "content": "# Updated note"
}
```

### `POST /api/admin/obsidian/file`

Creates a Markdown file.

Request:

```json
{
  "parentId": "folder-id",
  "name": "new-note.md",
  "content": ""
}
```

### `POST /api/admin/obsidian/folder`

Creates a folder.

Request:

```json
{
  "parentId": "folder-id",
  "name": "New Folder"
}
```

### `GET /api/admin/obsidian/graph`

Returns graph nodes and edges.

Response:

```json
{
  "nodes": [],
  "edges": []
}
```

---

## UI Layout

### Page

```txt
/admin/obsidian-notes
```

Layout:

```txt
+------------------------------------------------------+
| Admin Obsidian Notes                                 |
+----------------------+-------------------------------+
| Sidebar              | Main Workspace                |
|                      |                               |
| [New Folder]         | [Editor Tab] [Graph Tab]      |
| [New File]           |                               |
| [Reveal Current]     | Markdown editor / graph       |
|                      |                               |
| Folder tree          |                               |
| - folder             |                               |
|   - note.md          |                               |
+----------------------+-------------------------------+
```

---

## Sidebar Requirements

The left sidebar should show:

1. Folder/file tree.
2. Current active file highlighted.
3. Top action buttons:

   ```txt
   Create new folder
   Create new file
   Reveal current file
   Refresh
   ```

4. Click folder to expand/collapse.
5. Click Markdown file to open it.
6. Reveal current file scrolls to and expands the selected file path.

Component:

```txt
ObsidianSidebar.svelte
```

Props:

```ts
export let tree;
export let currentFileId;
export let onOpenFile;
export let onCreateFile;
export let onCreateFolder;
export let onRevealCurrentFile;
```

---

## Markdown Editor Requirements

Component:

```txt
MarkdownEditor.svelte
```

Requirements:

1. Edit `.md` content.
2. Auto-save to Google Drive.
3. Debounce save, recommended:

   ```txt
   800ms - 1500ms
   ```

4. Show save state:

   ```txt
   Saved
   Saving...
   Unsaved changes
   Save failed
   ```

5. Support Markdown shortcuts where practical.
6. Support preview mode or split mode if easy.
7. Auto-format Markdown-like writing experience similar to Obsidian/Notion.

Recommended editor libraries:

```bash
npm install @codemirror/state @codemirror/view @codemirror/lang-markdown @codemirror/commands
```

Optional Markdown rendering:

```bash
npm install marked dompurify
```

---

## Graph View Requirements

Component:

```txt
GraphView.svelte
```

Requirements:

1. Display all Markdown notes as nodes.
2. Detect links:

   ```md
   [[Wiki Link]]
   [[Folder/Note]]
   [Markdown Link](note.md)
   [Markdown Link](folder/note.md)
   ```

3. Draw edges between linked notes.
4. Click a node to open that document.
5. Highlight the current note.
6. Allow zoom/pan if supported.

Recommended graph package:

```bash
npm install d3
```

Alternative:

```bash
npm install cytoscape
```

Graph builder:

```txt
src/lib/obsidian/graphBuilder.ts
```

---

## Markdown Link Parsing

Support Obsidian wiki links:

```md
[[My Note]]
[[My Note|Alias]]
[[folder/My Note]]
```

Support Markdown links:

```md
[My Note](my-note.md)
[My Note](folder/my-note.md)
```

Implementation idea:

```ts
const wikiLinkRegex = /\[\[([^\]|]+)(?:\|[^\]]+)?\]\]/g;
const markdownLinkRegex = /\[[^\]]+\]\(([^)]+\.md)\)/g;
```

Normalize note names:

1. Remove `.md`.
2. Decode URL characters.
3. Compare by path first.
4. Fall back to basename match.

---

## Auto Save Strategy

Recommended behavior:

1. Editor updates local state immediately.
2. Start debounce timer.
3. After debounce, send `PUT /api/admin/obsidian/file`.
4. Server uploads new content to Drive.
5. UI shows save status.
6. On failure, keep local content and show retry.

Important:

Do not save if content is unchanged.

Pseudo-code:

```ts
let saveTimer;

function scheduleSave(content) {
  clearTimeout(saveTimer);

  saveTimer = setTimeout(async () => {
    saveStatus = 'saving';

    try {
      await updateFile(currentFile.id, content);
      saveStatus = 'saved';
    } catch (error) {
      saveStatus = 'failed';
    }
  }, 1000);
}
```

---

## Drive Update Logic

For Google Drive file update:

```ts
await drive.files.update({
  fileId,
  media: {
    mimeType: 'text/markdown',
    body: content
  }
});
```

For creating Markdown file:

```ts
await drive.files.create({
  requestBody: {
    name: ensureMdExtension(name),
    mimeType: 'text/markdown',
    parents: [parentId]
  },
  media: {
    mimeType: 'text/markdown',
    body: content || ''
  },
  fields: 'id,name,mimeType,modifiedTime,parents'
});
```

For creating folder:

```ts
await drive.files.create({
  requestBody: {
    name,
    mimeType: 'application/vnd.google-apps.folder',
    parents: [parentId]
  },
  fields: 'id,name,mimeType,modifiedTime,parents'
});
```

---

## Security Requirements

1. Only admin user can access the route.
2. Only admin user can call the APIs.
3. Do not expose Google Drive access tokens to the frontend.
4. Do not expose `ADMIN_GOOGLE_USER` to the frontend.
5. Validate file names.
6. Prevent creating files outside the configured vault root.
7. Validate Drive parent IDs before creating files/folders.
8. Only allow editing Markdown files.
9. Avoid rendering unsafe HTML from Markdown.

Use sanitization for preview:

```bash
npm install dompurify
```

---

## Route Protection

In `+page.server.ts`:

```ts
import { redirect } from '@sveltejs/kit';
import { requireAdmin } from '$lib/auth/requireAdmin';

export async function load(event) {
  const user = event.locals.user;

  if (!user) {
    throw redirect(302, '/login');
  }

  requireAdmin(event);

  return {
    user
  };
}
```

---

## Navigation Visibility

Only show the tool if:

```ts
user?.isAdmin === true
```

Example:

```svelte
{#if user?.isAdmin}
  <a href="/admin/obsidian-notes">Admin Obsidian Notes</a>
{/if}
```

---

## Implementation Phases

### Phase 1: Auth

- [x] Add Google OAuth login.
- [x] Add callback route.
- [x] Store session.
- [x] Add logout.
- [x] Add `isAdmin` based on `ADMIN_GOOGLE_USER`.
- [x] Hide admin tool for non-admin users.
- [x] Block non-admin access server-side.

### Phase 2: Google Drive Server APIs

- [x] Add Google Drive client.
- [x] Store and refresh admin OAuth tokens safely.
- [x] Add vault detection endpoint.
- [x] Add tree endpoint.
- [x] Add read file endpoint.
- [x] Add update file endpoint.
- [x] Add create file endpoint.
- [x] Add create folder endpoint.

### Phase 3: Obsidian Sidebar

- [x] Build folder tree UI.
- [x] Add expand/collapse.
- [x] Add current file highlight.
- [x] Add create folder button.
- [x] Add create file button.
- [x] Add reveal current file action.
- [x] Add refresh action.

### Phase 4: Markdown Editor

- [x] Add editor component.
- [x] Load selected Markdown file.
- [x] Add debounce auto-save.
- [x] Add save status.
- [x] Add retry behavior.
- [x] Optional: add Markdown preview or split view.

### Phase 5: Graph View

- [x] Fetch all Markdown files.
- [x] Parse wiki links.
- [x] Parse Markdown links.
- [x] Build graph nodes and edges.
- [x] Render graph.
- [x] Click node to open note.
- [x] Highlight current note.

### Phase 6: Polish

- [x] Add loading states.
- [x] Add empty states.
- [x] Add error toasts.
- [x] Add responsive layout.
- [x] Add keyboard shortcuts.
- [x] Add tests for graph parser.
- [x] Add tests for admin guard.
- [x] Add tests for Drive file operations.

---

## Suggested Packages

```bash
npm install googleapis
npm install @codemirror/state @codemirror/view @codemirror/lang-markdown @codemirror/commands
npm install d3
npm install marked dompurify
```

Optional:

```bash
npm install lucide-svelte
```

---

## Testing Checklist

### Auth

- [ ] Non-logged-in user cannot access `/admin/obsidian-notes`.
- [ ] Logged-in non-admin cannot access `/admin/obsidian-notes`.
- [ ] Admin user can access `/admin/obsidian-notes`.
- [ ] Admin tool is hidden for non-admin users.
- [ ] Admin tool is visible for admin user.

### Drive

- [ ] Vault is detected from default Drive folder.
- [ ] Folder tree loads.
- [ ] Markdown file opens.
- [ ] New folder is created in Drive.
- [ ] New Markdown file is created in Drive.
- [ ] Editing a file updates Drive.
- [ ] Auto-save does not duplicate files.
- [ ] API blocks non-admin users.

### Editor

- [ ] Current file content displays correctly.
- [ ] Save status changes correctly.
- [ ] Auto-save works after debounce.
- [ ] Failed save shows error.
- [ ] Reveal current file expands sidebar path.

### Graph

- [ ] All Markdown files appear as graph nodes.
- [ ] `[[Wiki Link]]` creates graph edge.
- [ ] `[Markdown Link](note.md)` creates graph edge.
- [ ] Clicking a node opens the note.
- [ ] Current note is highlighted.

---

## Risks and Notes

### OAuth Token Storage

The admin Drive connection requires token storage.

Recommended options:

1. Database table.
2. Encrypted server-side file.
3. Secure KV store.
4. Existing auth/session storage if the project already has one.

Do not store long-lived Google refresh tokens in localStorage.

### Google Drive Rate Limits

Large vaults may require pagination and caching.

Implement:

```txt
pageToken support
modifiedTime cache
manual refresh button
```

### Conflict Handling

If the same file is edited outside the app while admin is editing, conflicts may occur.

Basic strategy:

1. Track `modifiedTime`.
2. Before saving, compare latest Drive `modifiedTime`.
3. If changed remotely, show conflict warning.
4. Let admin reload or overwrite.

### Large Vault Performance

For large vaults:

1. Lazy-load folders.
2. Cache tree results.
3. Build graph in background after tree load.
4. Only fetch Markdown contents when needed.

---

## Definition of Done

The feature is complete when:

1. Google login works.
2. Admin detection works using `ADMIN_GOOGLE_USER`.
3. Only the admin can see Admin Obsidian Notes.
4. Only the admin can call all Obsidian Drive APIs.
5. The app detects the Obsidian vault from the configured Drive folder.
6. The admin can browse folders and Markdown files.
7. The admin can create folders.
8. The admin can create Markdown documents.
9. The admin can edit Markdown files.
10. Changes are saved back to Google Drive.
11. The sidebar can reveal the current file.
12. The graph view shows note relationships.
13. Clicking a graph node opens that document.
14. Non-admin users cannot see or access the feature.

---

## Recommended First Coding Order

1. Add Google OAuth.
2. Add session and admin guard.
3. Add admin route shell.
4. Add Google Drive client.
5. Add vault detection.
6. Add file tree API.
7. Add sidebar UI.
8. Add file read/update API.
9. Add Markdown editor with auto-save.
10. Add create folder/file actions.
11. Add graph API.
12. Add graph UI.
13. Add polish and tests.
