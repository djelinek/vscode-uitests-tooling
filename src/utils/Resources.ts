import * as assert from "assert";
import * as fs from "fs-extra";
import * as path from "path";
import { VSBrowser } from "vscode-extension-tester";
import { IWorkspace } from "./Workspace";

const RESOURCE_DEFAULT_PATH = path.join("src", "ui-test", "resources");

export class UnsupportedResourceManager extends Error {}

export interface IResourceManager {
	/**
	 * Remove files created by resource manager.
	 */
	cleanup(): Promise<void>;
	/**
	 * Remove files created by resource manager.
	 */
	cleanupSync(): void;
	/**
	 * Copy a file/folder from resources folder to workspace folder.
	 * @param what File path relative to resources path.
	 * @param to Destination path relative to workspace path. 
	 * If omitted, the path is determined by 'what' parameter.
	 */
	copy(what: string, to?: string): Promise<void>;
	/**
	 * Copy a file/folder from resources folder to workspace folder.
	 * @param what File path relative to resources path.
	 * @param to Destination path relative to workspace path. 
	 * If omitted, the path is determined by 'what' parameter.
	 */
	copySync(what: string, to?: string): void;
	/**
	 * Delete store folder from resources folder.
	 */
	deleteStore(): Promise<void>;
	/**
	 * Delete store folder from resources folder.
	 */
	deleteStoreSync(): void;
	/**
	 * Delete a file/folder from store directory.
	 * @param what File to be deleted. Path must be relative.
	 */
	deleteFromStore(what: string): Promise<void>;
	/**
	 * Delete a file/folder from store directory.
	 * @param what File to be deleted. Path must be relative.
	 */
	deleteFromStoreSync(what: string): void;
	/**
	 * Copy stored file/folder to workspace folder.
	 * @param what File to be restored. Path must be relative.
	 * @param to Destination path in workspace. 
	 * If omitted, the path is determined by 'what' parameter.
	 */
	restore(what: string, to?: string): Promise<void>;
	/**
	 * Copy stored file/folder to workspace folder.
	 * @param what File to be restored. Path must be relative.
	 * @param to Destination path in workspace. 
	 * If omitted, the path is determined by 'what' parameter.
	 */
	restoreSync(what: string, to?: string): void;
	/**
	 * Copy file from workspace to resources store folder.
	 * Useful when some file must be persisted between workspaces
	 * or archived as artifact.
	 * @param what File to be stored. Must be relative to workspace path.
	 * @param to Destination path in store folder.
	 */
	store(what: string, to?: string): Promise<void>;
	/**
	 * Copy file from workspace to resources store folder.
	 * Useful when some file must be persisted between workspaces
	 * or archived as artifact.
	 * @param what File to be stored. Must be relative to workspace path.
	 * @param to Destination path in store folder.
	 */
	storeSync(what: string, to?: string): void;
}

class FileSystemResources implements IResourceManager {
	constructor(private _workspace: IWorkspace, private _resourcePath: string = RESOURCE_DEFAULT_PATH) {
		// make sure the path is child (can be transitive) of the $CWD
		assert.ok(
			path.relative(this.path, process.cwd()).startsWith(".."),
			`$CWD must be parent directory of the resource path; got: ${this.path}, cwd: ${process.cwd()}`
		);
		assert.ok(
			path.relative(this.workspace.path, process.cwd()).startsWith(".."),
			`$CWD must be parent directory of the workspace path; got: ${this.workspace.path}, cwd: ${process.cwd()}`
		);

		fs.ensureDirSync(this.path);
		fs.ensureDirSync(this.dataPath);
		fs.ensureDirSync(this.storePath);
	}

	protected get workspace() : IWorkspace {
		return this._workspace;
	}

	protected get path() : string {
		return this._resourcePath;
	}

	protected get dataPath() : string {
		return path.join(this.path, "data");
	}

	protected get storePath(): string {
		return path.join(this.path, "store");
	}

	private getDestination(what: string, to: string | undefined): string {
		if (to === undefined) {
			return path.join(this.workspace.path, what);
		}

		return path.join(this.workspace.path, to);
	}

	private getDataSource(what: string): string {
		return path.join(this.dataPath, what);
	}

	private getStoreSource(what: string, to: string | undefined): string {
		if (to === undefined) {
			return path.join(this.storePath, what);
		}

		return path.join(this.storePath, to);
	}

	cleanup(): Promise<void> {
		return fs.remove(this.path);
	}
	
	cleanupSync(): void {
		return fs.removeSync(this.path);
	}

	deleteStore(): Promise<void> {
		return fs.remove(this.storePath);
	}

	deleteStoreSync(): void {
		fs.removeSync(this.storePath);
	}

	async deleteFromStore(what: string): Promise<void> {
		return fs.remove(this.getStoreSource(what, undefined));
	}

	deleteFromStoreSync(what: string): void {
		fs.removeSync(this.getStoreSource(what, undefined));
	}

	copySync(what: string, to?: string | undefined): void {
		fs.copySync(this.getDataSource(what), this.getDestination(what, to));
	}

	restoreSync(what: string, to?: string | undefined): void {
		fs.copySync(this.getStoreSource(what, undefined), this.getDestination(what, to));
	}

	storeSync(what: string, to?: string | undefined): void {
		fs.copySync(this.getDestination(what, undefined), this.getStoreSource(what, to));
	}

	async copy(what: string, to?: string): Promise<void> {
		return fs.copy(this.getDataSource(what), this.getDestination(what, to));
	}

	async restore(what: string, to?: string): Promise<void> {
		return fs.copy(this.getStoreSource(what, undefined), this.getDestination(what, to));
	}

	async store(what: string, to?: string): Promise<void> {
		return fs.copy(this.getDestination(what, undefined), this.getStoreSource(what, to));
	}
}

/**
 * Create new resource manager depending on used browser.
 * @param browser Current browser.
 * @param workspace Workspace to be utilized.
 * @param resourcePath Path to resources folder.
 * @returns New resource manager ready to be used.
 */
export function createResourceManager(browser: any, workspace: IWorkspace, resourcePath?: string): IResourceManager {
	if (browser instanceof VSBrowser) {
		return new FileSystemResources(workspace, resourcePath);
	}

	const supported = [VSBrowser.name];
	throw new UnsupportedResourceManager(
		`resource manager for "${browser.constructor.name}" is not supported;
		supported browsers:
			${supported.join('\n\t')}`
	);
}
