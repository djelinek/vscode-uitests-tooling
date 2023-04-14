import * as fs from "fs-extra";
import * as path from "path";
import { InputBox, VSBrowser, Workbench } from "vscode-extension-tester";
import { errors } from "..";
import { repeat } from "../conditions/Repeat";

const WORKSPACE_DEFAULT_PATH = path.join("out", "test-workspace");

export class UnsupportedWorkspace extends Error { }

export interface IWorkspace {
	get path(): string;
	/**
	 * Close folder in browser. It does not check whether folder was actually closed.
	 */
	close(timeout?: number): Promise<void>;
	/**
	 * Create workspace folder.
	 */
	create(): Promise<void>;
	/**
	 * Create workspace folder.
	 */
	createSync(): void;
	/**
	 * Delete workspace folder.
	 */
	delete(): Promise<void>;
	/**
	 * Delete workspace folder.
	 */
	deleteSync(): void;
	/**
	 * Open folder in browser. It does not check whether the folder is open in browser.
	 */
	open(timeout?: number): Promise<void>;
}

class VSCodeWorkspace implements IWorkspace {

	constructor(private _browser: any, private _path: string = WORKSPACE_DEFAULT_PATH) {

	}
	
	public get browser() : any {
		return this._browser;
	}
	

	get path(): string {
		return this._path;
	}

	close(timeout: number = 5000): Promise<void> {
		return this.confirmInput('>Workspaces: Close Workspace', timeout);
	}

	create(): Promise<void> {
		return fs.ensureDir(this.path);
	}

	createSync(): void {
		return fs.ensureDirSync(this.path);
	}

	delete(): Promise<void> {
		return fs.remove(this.path);
	}

	deleteSync(): void {
		return fs.removeSync(this.path);
	}

	open(): Promise<void> {
		return this.browser.openResources(this.path);
	}

	/**
	 * Open input and return its reference when it is ready.
	 * @returns Input ready to be used.
	 */
	private async getInput(): Promise<InputBox> {
		const workbench = new Workbench();
		const input = await workbench.openCommandPrompt() as InputBox;
		return input.wait();
	}

	private async confirmInput(text: string, timeout?: number): Promise<void> {
		await repeat(async () => {
			const input = await this.getInput();
			await input.setText(text);
			await input.confirm();
			return true;
		}, {
			ignoreErrors: errors.INTERACTIVITY_ERRORS,
			message: `could not confirm input with text: ${text}`,
			timeout
		});
	}
}

/**
 * Create new workspace object depending on used browser.
 * @param browser Current browser.
 * @param workspacePath Path to work with.
 * @returns New created instance of workspace.
 */
export function createWorkspace(browser: any, workspacePath?: string): IWorkspace {
	if (browser instanceof VSBrowser) {
		return new VSCodeWorkspace(browser, workspacePath);
	}

	const supported = [VSBrowser.name];
	throw new UnsupportedWorkspace(
		`workspace for "${browser.constructor.name}" is not supported;
		supported browsers:
			${supported.join('\n\t')}`
	);
}
