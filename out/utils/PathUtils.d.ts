export declare module PathUtils {
    /**
     * Remove first and trailing separator from path.
     * @param filePath
     * @returns
     */
    function trimPath(filePath: string): string;
    /**
     * Split path to segments.
     * @param filePath
     * @returns
     */
    function splitPath(filePath: string): string[];
    /**
     * Convert path to tree path.
     * @param filePath
     * @returns
     */
    function convertToTreePath(filePath: string): string[];
    function getRelativePath(filePath: string, root: string): string;
    function normalizePath(filePath: string): string;
    /**
     * Compare paths base on tree order.
     * @param a
     * @param b
     * @param aIsFile
     * @param bIsFile
     * @returns positive value if path a is considered larger than path b, 0 if paths are equals and negative value if path a is smaller.
     */
    function comparePaths(a: string[], b: string[], aIsFile?: boolean, bIsFile?: boolean): number;
    function comparePathsString(a: string, b: string, aIsFile?: boolean, bIsFile?: boolean): Promise<number>;
}
