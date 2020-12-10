import * as fs from "fs";
import * as fsExtra from "fs-extra";
import * as path from "path";
import { TitleBar } from "vscode-extension-tester";
import { Dialog } from "./Dialog";
import { Menu, OpenMethod } from "./Menu";

/**
 * Project class represents VS code workspace. 
 * @author Marian Lorinc <mlorinc@redhat.com>
 */
class Project {
	/**
	 * Create new object with path. The object does not create project in file system.
	 * @param _path of project
	 */
	public constructor(private _path: string) {
	}

	public get path(): string {
		return this._path;
	}

	public get exists(): boolean {
		return fs.existsSync(this.path);
	}

	public async isOpen(): Promise<boolean> {
		const title = await new TitleBar().getTitle();
		const parts = title.split("-").map((p) => p.trim());
		return parts.length === 3 && parts[1] === path.basename(this._path);
	}

	/**
	 * Creates new project in filesystem.
	 */
	public async create(): Promise<void> {
		fs.mkdirSync(this._path);
	}

	/**
	 * Create new project from project template.
	 * @param path path of existing project
	 */
	public async createFrom(path: string): Promise<void> {
		await this.create();
		fsExtra.copySync(path, this._path);
	}

	/**
	 * Opens project in VS code.
	 */
	public async open(timeout?: number, openMethod: OpenMethod = OpenMethod.DIALOG): Promise<void> {
		if (!fs.statSync(this._path).isDirectory()) {
			throw new Error(`Cannot open "${this._path}. It is not folder."`);
		}

		await Menu.open(this._path, {
			timeout, openMethod
		});
	}

	/**
	 * Closes project in VS code.
	 */
	public async close(timeout?: number): Promise<void> {
		await Dialog.closeFolder(timeout);
	}

	/**
	 * Deletes project in VS code.
	 */
	public async delete(): Promise<void> {
		fsExtra.removeSync(this._path);
	}
}

export { Project };
