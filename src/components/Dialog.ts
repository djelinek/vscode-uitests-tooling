import * as fs from "fs";
import * as path from "path";
import { ActivityBar, SideBarView, TitleBar } from 'vscode-extension-tester';
import { DialogHandler, OpenDialog } from 'vscode-extension-tester-native';
import { repeat } from "../conditions/Repeat";

export const FILE_HELPER_NAME = ".AAAVSCODE_UITEST_TOOLING_OPEN_FOLDER";

/**
 * Handles File Dialogs 
 * @author Dominik Jelinek <djelinek@redhat.com>
 */
class Dialog {
	private constructor() { }

	/**
	 * Open file with specified 'path' via Open File Dialog (File > Open File...)
	 * @param path path to the specific file
	 * @returns resolved dialog
	 */
	public static async openFile(path?: string): Promise<OpenDialog> {
		await new TitleBar().select('File', 'Open File...');
		const dialog = await openDialog(path);
		await dialog.confirm();
		return dialog;
	}

	/**
	 * Close and save opened file 
	 * @param save true/false, save file before close editor or not
	 */
	public static async closeFile(save: boolean = true): Promise<void> {
		const titleBar = new TitleBar();
		if (save) {
			await titleBar.select("File", "Save");
		} else {
			await titleBar.select("File", "Revert File");
		}
		await titleBar.select("File", "Close Editor");
	}

	/**
	 * Open folder with specified 'path' via Open Folder Dialog (File > Open Folder...)
	 * @param path path to the specific folder
	 * @returns resolved dialog
	 */
	public static async openFolder(filePath: string, timeout: number = 30000): Promise<OpenDialog> {
		if (filePath && fs.existsSync(filePath)) {
			fs.closeSync(fs.openSync(path.join(filePath, FILE_HELPER_NAME), "w"));
		}
		const menu = new TitleBar();
		await menu.select('File', 'Open Folder...');
		return handleOpenFolder(filePath, timeout);
	}

	/**
	 * Close opened folder
	 */
	public static async closeFolder(timeout: number = 30000): Promise<void> {
		let titleBar = new TitleBar();
		await titleBar.select("File", "Close Folder");
		await repeat(async () => {
			titleBar = new TitleBar();
			const parts = (await titleBar.getTitle()).split("-").map((p) => p.trim());
			return parts.length === 2 && parts[0] === "Welcome";
		}, { timeout, log: true, id: "Close folder" });
	}

	/**
	 * Selects path and confirms dialog
	 * @param path path to be inputted to dialog
	 * @returns promise which resolves with dialog
	 * @author Marian Lorinc <mlorinc@redhat.com>
	 */
	public static async confirm(path?: string): Promise<OpenDialog> {
		const dialog = await openDialog(path);
		await dialog.confirm();
		return dialog;
	}

	/**
	 * Selects path and cancels dialog
	 * @param path path to be inputted to dialog
	 * @returns promise which resolves with dialog
	 * @author Marian Lorinc <mlorinc@redhat.com>
	 */
	public static async cancel(path?: string): Promise<OpenDialog> {
		const dialog = await openDialog(path);
		await dialog.cancel();
		return dialog;
	}
}

async function openDialog(path: string = ""): Promise<OpenDialog> {
	const dialog = await DialogHandler.getOpenDialog();
	if (dialog === null) {
		return await Promise.reject('Could not open dialog!');
	}
	await dialog.selectPath(path);
	return dialog;
}

async function handleOpenFolder(filePath: string, timeout: number): Promise<OpenDialog> {
	const dialog = await openDialog(filePath);
	await dialog.confirm();

	if (filePath && fs.existsSync(filePath)) {
		await openFileExplorer();
		await findFile(FILE_HELPER_NAME, path.basename(filePath), timeout);
		fs.unlinkSync(path.join(filePath, FILE_HELPER_NAME));
	}

	return dialog;
}

async function openFileExplorer(): Promise<void> {
	const activityBar = new ActivityBar();
	await activityBar.getViewControl("Explorer").openView();
}

async function findFile(fileName: string, folderName: string, timeout: number = 30000): Promise<void> {
	const start = Date.now();
	const section = await repeat(() => new SideBarView().getContent().getSection(folderName), { timeout, log: true, id: `Find section ${folderName}` });
	timeout = timeout - (Date.now() - start);

	await repeat(() => section.findItem(fileName, 1), { timeout, log: true, id: `findFile(${fileName})` });
}

export { Dialog, handleOpenFolder };
