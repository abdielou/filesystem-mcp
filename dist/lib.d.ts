export declare function setAllowedDirectories(directories: string[]): void;
export declare function getAllowedDirectories(): string[];
interface FileInfo {
    size: number;
    created: Date;
    modified: Date;
    accessed: Date;
    isDirectory: boolean;
    isFile: boolean;
    permissions: string;
}
export interface SearchOptions {
    excludePatterns?: string[];
}
export interface SearchResult {
    path: string;
    isDirectory: boolean;
}
export declare function formatSize(bytes: number): string;
export declare function normalizeLineEndings(text: string): string;
export declare function createUnifiedDiff(originalContent: string, newContent: string, filepath?: string): string;
export declare function validatePath(requestedPath: string): Promise<string>;
export declare function getFileStats(filePath: string): Promise<FileInfo>;
export declare function readFileContent(filePath: string, encoding?: string): Promise<string>;
export declare function writeFileContent(filePath: string, content: string): Promise<void>;
interface FileEdit {
    oldText: string;
    newText: string;
}
export declare function applyFileEdits(filePath: string, edits: FileEdit[], dryRun?: boolean): Promise<string>;
export declare function tailFile(filePath: string, numLines: number): Promise<string>;
export declare function headFile(filePath: string, numLines: number): Promise<string>;
export declare function searchFilesWithValidation(rootPath: string, pattern: string, allowedDirectories: string[], options?: SearchOptions): Promise<string[]>;
export {};
//# sourceMappingURL=lib.d.ts.map