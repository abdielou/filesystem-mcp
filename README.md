# Filesystem MCP Server (Context-Safe Fork)

Node.js server implementing [Model Context Protocol (MCP)](https://modelcontextprotocol.io/) for filesystem operations, with **pagination and limits on all list/search/read tools** to prevent large directories from blowing up LLM context windows.

Forked from [@modelcontextprotocol/server-filesystem](https://github.com/modelcontextprotocol/servers/tree/main/src/filesystem).

## What's Different

The upstream server returns unbounded output. A single `directory_tree` call on a large project can dump megabytes of JSON into context, killing the conversation. This fork adds:

| Tool | Safeguard | Default |
|---|---|---|
| `list_directory` | `offset` / `limit` pagination | 500 entries |
| `list_directory_with_sizes` | `offset` / `limit` pagination | 500 entries |
| `directory_tree` | `maxDepth` + `maxEntries` | depth 5, 1000 entries |
| `search_files` | `offset` / `limit` pagination | 200 results |
| `read_multiple_files` | `maxFiles` cap | 20 files |
| `read_text_file` | `maxCharacters` truncation | 500KB |

All limits are adjustable per-call. Paginated tools return metadata like `"Showing 1-500 of 12847 entries"` so agents can page through the full result set.

## Features

- Read/write files
- Create/list directories
- Move files/directories
- Search files with glob patterns
- Get file metadata
- Directory tree with depth control
- Dynamic directory access via [MCP Roots](https://modelcontextprotocol.io/docs/learn/client-concepts#roots)

## Setup

```bash
npm install
npm run build
```

## Usage

```bash
node dist/index.js /path/to/allowed/dir1 /path/to/allowed/dir2
```

### Claude Desktop

Add to your `claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "filesystem": {
      "command": "node",
      "args": [
        "/path/to/filesystem-mcp/dist/index.js",
        "/Users/username/Documents",
        "/path/to/other/allowed/dir"
      ]
    }
  }
}
```

### VS Code

Add to `.vscode/mcp.json` or your user MCP configuration:

```json
{
  "servers": {
    "filesystem": {
      "command": "node",
      "args": [
        "/path/to/filesystem-mcp/dist/index.js",
        "${workspaceFolder}"
      ]
    }
  }
}
```

## API

### Tools

#### read_text_file
Read a file as text with optional truncation.

| Param | Type | Default | Description |
|---|---|---|---|
| `path` | string | required | File path |
| `head` | number | - | Return only first N lines |
| `tail` | number | - | Return only last N lines |
| `maxCharacters` | number | 500000 | Max characters to return (when head/tail not used) |

#### read_media_file
Read an image or audio file as base64.

| Param | Type | Default | Description |
|---|---|---|---|
| `path` | string | required | File path |

#### read_multiple_files
Read multiple files at once.

| Param | Type | Default | Description |
|---|---|---|---|
| `paths` | string[] | required | Array of file paths |
| `maxFiles` | number | 20 | Max files to read per call |

#### write_file
Create or overwrite a file.

| Param | Type | Default | Description |
|---|---|---|---|
| `path` | string | required | File path |
| `content` | string | required | File content |

#### edit_file
Make line-based edits with git-style diff output.

| Param | Type | Default | Description |
|---|---|---|---|
| `path` | string | required | File path |
| `edits` | array | required | `[{oldText, newText}]` |
| `dryRun` | boolean | false | Preview without applying |

#### create_directory
Create a directory (including nested).

| Param | Type | Default | Description |
|---|---|---|---|
| `path` | string | required | Directory path |

#### list_directory
List directory contents with `[FILE]`/`[DIR]` prefixes. Paginated.

| Param | Type | Default | Description |
|---|---|---|---|
| `path` | string | required | Directory path |
| `offset` | number | 0 | Entries to skip |
| `limit` | number | 500 | Max entries to return |

#### list_directory_with_sizes
List directory with file sizes. Paginated.

| Param | Type | Default | Description |
|---|---|---|---|
| `path` | string | required | Directory path |
| `sortBy` | string | "name" | Sort by "name" or "size" |
| `offset` | number | 0 | Entries to skip |
| `limit` | number | 500 | Max entries to return |

#### directory_tree
Recursive JSON tree view with depth and entry limits.

| Param | Type | Default | Description |
|---|---|---|---|
| `path` | string | required | Root path |
| `excludePatterns` | string[] | [] | Glob patterns to exclude |
| `maxDepth` | number | 5 | Max recursion depth |
| `maxEntries` | number | 1000 | Max total entries |

#### search_files
Recursive glob search. Paginated.

| Param | Type | Default | Description |
|---|---|---|---|
| `path` | string | required | Starting directory |
| `pattern` | string | required | Glob pattern |
| `excludePatterns` | string[] | [] | Patterns to exclude |
| `offset` | number | 0 | Results to skip |
| `limit` | number | 200 | Max results to return |

#### move_file
Move or rename files/directories.

| Param | Type | Default | Description |
|---|---|---|---|
| `source` | string | required | Source path |
| `destination` | string | required | Destination path |

#### get_file_info
Get file metadata (size, timestamps, permissions, type).

| Param | Type | Default | Description |
|---|---|---|---|
| `path` | string | required | File path |

#### list_allowed_directories
Returns the list of directories the server can access. No parameters.

### Pagination Pattern

All paginated tools follow the same output format when results exceed the limit:

```
Showing 1-500 of 12847 entries
[DIR] node_modules
[FILE] package.json
...
```

An agent can page through with increasing `offset`:
- Call 1: `{offset: 0, limit: 500}` -> "Showing 1-500 of 12847"
- Call 2: `{offset: 500, limit: 500}` -> "Showing 501-1000 of 12847"
- ...

## Directory Access Control

Directories can be specified via command-line arguments or dynamically via [MCP Roots](https://modelcontextprotocol.io/docs/learn/client-concepts#roots).

- **Command-line**: Pass directories as arguments at startup
- **MCP Roots**: Clients supporting roots can dynamically update allowed directories at runtime
- All filesystem operations are restricted to allowed directories
- Symlinks are resolved and validated against allowed directories

## License

MIT License. See the [upstream repository](https://github.com/modelcontextprotocol/servers) for details.
