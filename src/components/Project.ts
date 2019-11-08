import * as fs from "fs";
import * as fsExtra from "fs-extra";
import { TitleBar } from "vscode-extension-tester";
import DefaultFileDialog from "../native/DefaultFileDialog";

/**
 * Project class represents VS code workspace. 
 * @author Marian Lorinc <mlorinc@redhat.com>
 */
class Project {
	private _isOpen: boolean;

	/**
	 * Create new object with path. The object does not create project in file system.
	 * @param _path of project
	 */
	constructor(private _path: string) {
		this._isOpen = false;
	}


	public get path(): string {
		return this._path;
	}

	public get exists(): boolean {
		return fs.existsSync(this.path);
	}


	public get isOpen(): boolean {
		return this._isOpen;
	}


	/**
	 * Creates new project in filesystem.
	 */
	public create(): void {
		if (this._isOpen) {
			return;
		}
		fs.mkdirSync(this._path);
	}

	/**
	 * Create new project from project template.
	 * @param path path of existing project
	 */
	public createFrom(path: string): void {
		this.create();
		fsExtra.copySync(path, this._path);
	}

	/**
	 * Opens project in VS code.
	 */
	public async open(): Promise<void> {
		if (this._isOpen) {
			return;
		}
		this._isOpen = true;
		await new DefaultFileDialog().openFolder(this._path);
	}

	/**
	 * Closes project in VS code.
	 */
	public async close(): Promise<void> {
		if (!this._isOpen) {
			return;
		}
		this._isOpen = false;
		const titleBar = new TitleBar();
		await titleBar.select("File", "Close Folder");
	}

	/**
	 * Deletes project in VS code.
	 */
	public async delete(): Promise<void> {
		fsExtra.removeSync(this._path);
	}
}

export { Project };
export default Project;