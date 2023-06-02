import * as assert from "assert";
import * as fs from "fs-extra";
import * as path from "path";
import { VSBrowser } from "vscode-extension-tester";
import { IWorkspace } from "./Workspace";

const RESOURCE_DEFAULT_PATH = path.join("src", "ui-test", "resources");

export class UnsupportedResourceManager extends Error { }

export interface IResourceManager {
	/**
	 * Delete resource folder.
	 */
	deleteResourceFolder(): Promise<void>;

	/**
	 * Delete resource folder.
	 */
	deleteResourceFolderSync(): void;

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
	 * Delete a file/folder from workspace directory.
	 * @param what File to be deleted. Path must be relative.
	 */
	delete(what: string): Promise<void>;
	/**
	 * Delete a file/folder from workspace directory.
	 * @param what File to be deleted. Path must be relative.
	 */
	deleteSync(what: string): void;
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
	}

	protected get workspace(): IWorkspace {
		return this._workspace;
	}

	protected get path(): string {
		return this._resourcePath;
	}

	private getDestination(what: string, to: string | undefined): string {
		if (to === undefined) {
			return path.join(this.workspace.path, what);
		}

		return path.join(this.workspace.path, to);
	}

	private getResourceSource(what: string): string {
		return path.join(this.path, what);
	}

	deleteResourceFolder(): Promise<void> {
		return fs.remove(this.path);
	}

	deleteResourceFolderSync(): void {
		return fs.removeSync(this.path);
	}

	async delete(what: string): Promise<void> {
		return fs.remove(this.getDestination(what, undefined));
	}

	deleteSync(what: string): void {
		fs.removeSync(this.getDestination(what, undefined));
	}

	async copy(what: string, to?: string): Promise<void> {
		return fs.copy(this.getResourceSource(what), this.getDestination(what, to));
	}

	copySync(what: string, to?: string): void {
		fs.copySync(this.getResourceSource(what), this.getDestination(what, to));
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
