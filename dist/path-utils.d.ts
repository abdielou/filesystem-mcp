/**
 * Converts WSL or Unix-style Windows paths to Windows format
 * @param p The path to convert
 * @returns Converted Windows path
 */
export declare function convertToWindowsPath(p: string): string;
/**
 * Normalizes path by standardizing format while preserving OS-specific behavior
 * @param p The path to normalize
 * @returns Normalized path
 */
export declare function normalizePath(p: string): string;
/**
 * Expands home directory tildes in paths
 * @param filepath The path to expand
 * @returns Expanded path
 */
export declare function expandHome(filepath: string): string;
//# sourceMappingURL=path-utils.d.ts.map