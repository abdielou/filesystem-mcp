import type { Root } from '@modelcontextprotocol/sdk/types.js';
/**
 * Resolves requested root directories from MCP root specifications.
 *
 * Converts root URI specifications (file:// URIs or plain paths) into normalized
 * directory paths, validating that each path exists and is a directory.
 * Includes symlink resolution for security.
 *
 * @param requestedRoots - Array of root specifications with URI and optional name
 * @returns Promise resolving to array of validated directory paths
 */
export declare function getValidRootDirectories(requestedRoots: readonly Root[]): Promise<string[]>;
//# sourceMappingURL=roots-utils.d.ts.map