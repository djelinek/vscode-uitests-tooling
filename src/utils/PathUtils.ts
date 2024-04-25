import * as path from 'path';
import * as os from 'os';

export module PathUtils {
	/**
	 * Remove first and trailing separator from path.
	 * @param filePath 
	 * @returns 
	 */
	export function trimPath(filePath: string): string {
		let start = 0;
		let end = filePath.length;

		if (filePath.startsWith(path.sep)) {
			start = 1;
		}
		if (filePath.endsWith(path.sep)) {
			end = -1;
		}

		return filePath.slice(start, end);
	}

	/**
	 * Split path to segments.
	 * @param filePath 
	 * @returns 
	 */
	export function splitPath(filePath: string): string[] {
		return trimPath(filePath).split(path.sep);
	}

	/**
	 * Convert path to tree path.
	 * @param filePath 
	 * @returns 
	 */
	export function convertToTreePath(filePath: string): string[] {
		filePath = normalizePath(filePath);
		const segments: string[] = [];
		if (path.isAbsolute(filePath)) {
			segments.push('/');
		}
		return splitPath(filePath);
	}

	export function getRelativePath(filePath: string, root: string) {
		root = normalizePath(root);
		filePath = normalizePath(filePath);

		if (!path.isAbsolute(root)) {
			throw new Error(`Root path must be absolute. Got: "${root}".`);
		}

		if (!path.isAbsolute(filePath)) {
			return filePath;
		}

		if (root === filePath) {
			throw new Error('Cannot create relative path. Paths are equal.');
		}

		const relativePath = path.relative(root, filePath);

		if (relativePath.startsWith('..' + path.sep)) {
			throw new Error(`Could not create relative path. Got: "${filePath}". Root path: "${root}".`);
		}

		return relativePath;
	}

	export function normalizePath(filePath: string): string {
		filePath = filePath.trim();
		if (filePath.startsWith('~/') || filePath === '~') {
			filePath = filePath.replace('~', os.homedir());
		}
		filePath = path.normalize(filePath);

		let end = filePath.length;
		if (filePath.endsWith(path.sep)) {
			end = -1;
		}

		return filePath.slice(0, end);
	}


	/**
	 * Compare paths based on file tree ordering.
	 * @param a 
	 * @param b 
	 * @param parentIndex 
	 * @param aIsFile 
	 * @param bIsFile 
	 * @returns 
	 */
	export function compare(a: string[], b: string[], parentIndex: number, aIsFile: boolean, bIsFile: boolean): number {
		if (isRoot(a) && isRoot(b)) {
			return 0;
		}
		else if (isRoot(a)) {
			return -1;
		}
		else if (isRoot(b)) {
			return 1;
		}

		const leafIndex = parentIndex + 1;
		aIsFile = isFile(a, leafIndex, aIsFile);
		bIsFile = isFile(b, leafIndex, bIsFile);

		if (aIsFile === bIsFile) {
			return a[leafIndex].localeCompare(b[leafIndex]);
		}

		if (isFile(a, leafIndex, aIsFile)) {
			return 1;
		}
		else {
			return -1;
		}
	}

	export function isRoot(a: string[]) {
		return a.length === 1 && a[0] === '/';
	}

	export function isLeaf(a: string[], index: number): boolean {
		return a.length === index + 1;
	}

	export function isFile(a: string[], index: number, isFileFlag: boolean): boolean {
		return isLeaf(a, index) && isFileFlag;
	}

	/**
	 * Compare paths base on tree order.
	 * @param a 
	 * @param b 
	 * @param aIsFile 
	 * @param bIsFile 
	 * @returns positive value if path a is considered larger than path b, 0 if paths are equals and negative value if path a is smaller.
	 */
	export function comparePaths(a: string[], b: string[], aIsFile: boolean = false, bIsFile: boolean = false): number {
		if (a.length === 0) {
			throw new Error('Path "a" must not be empty');
		}

		if (b.length === 0) {
			throw new Error('Path "b" must not be empty');
		}

		const aSegments = a;
		const bSegments = b;

		const length = Math.min(aSegments.length, bSegments.length);

		let matches = 0;
		while (matches < length) {
			if (aSegments[matches] !== bSegments[matches]) {
				break;
			}
			matches += 1;
		}

		const commonParentIndex = matches > 0 ? matches - 1 : -1;

		// check folder is parent
		if (matches === length) {
			return aSegments.length - bSegments.length;
		}

		return compare(aSegments, bSegments, commonParentIndex, aIsFile, bIsFile);
	}

	export async function comparePathsString(a: string, b: string, aIsFile: boolean = false, bIsFile: boolean = false): Promise<number> {
		return PathUtils.comparePaths(PathUtils.convertToTreePath(a), PathUtils.convertToTreePath(b), aIsFile, bIsFile);
	}
}
