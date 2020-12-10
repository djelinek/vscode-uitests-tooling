import * as fs from "fs";
import { handleOpenFolder } from "./Dialog";
import { Input } from "./Input";
import { TitleBar, VSBrowser } from "vscode-extension-tester";

export enum OpenMethod {
	DIALOG, INPUT
}

export interface OpenMenuOptions {
	/**
	 * timeout in ms
	 */
	timeout?: number;
	/**
	 * Open file/folder method. Can be INPUT - command palette method or DIALOG - native dialog method. 
	 */
	openMethod?: OpenMethod;
}

export class Menu {
	constructor() { }

	/**
	 * Default open file/folder method.
	 */
	public static defaultOpenMethod = OpenMethod.DIALOG;

	/**
	 * Open folder or file in VS Code
	 * @param path absolute path to file/folder
	 * @param options open options
	 */
	static async open(path: string, options?: OpenMenuOptions) {
		const timeout = options?.timeout || 5000;
		const method = options?.openMethod || Menu.defaultOpenMethod;

		const menu = new TitleBar();
		const fileStat = fs.statSync(path);
		if (fileStat.isFile()) {
			await menu.select("File", "Open File...");
		}
		else if (fileStat.isDirectory()) {
			await menu.select("File", "Open Folder...");
		}
		else {
			throw new Error(`Unsupported file: ${path}`);
		}

		switch (method) {
			case +OpenMethod.INPUT:
				const input = await Input.getInstance(timeout);
				await input.typeAndConfirm(path, timeout);
				break;
			case +OpenMethod.DIALOG:
				await handleOpenFolder(path, timeout);
				break;
			default:
				throw new Error("Not implemented");
		}
		await VSBrowser.instance.waitForWorkbench();
	}
}
