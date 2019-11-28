import { TitleBar, DialogHandler, OpenDialog } from 'vscode-extension-tester';

/**
 * Handles File Dialogs 
 * @author Dominik Jelinek <djelinek@redhat.com>
 */
class Dialog {

	private constructor() {}
	
	/**
	 * Open file with specified 'path' via Open File Dialog (File > Open File...)
	 * @param path path to the specific file
	 * @returns resolved dialog
	 */
	public static async openFile(path?: string): Promise<OpenDialog> {
		await new TitleBar().select('File', 'Open File...');
		const dialog = await Dialog.open(path);
		await dialog.confirm();
		return dialog;
	}

	/**
	 * Close and save opened file 
	 * @param save true/false, save file before close editor or not
	 */
	public static async closeFile(save: boolean = true): Promise<void> {
		const titleBar = new TitleBar();
		if(save) {
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
	public static async openFolder(path?: string): Promise<OpenDialog> {
		await new TitleBar().select('File', 'Open Folder...');
		const dialog = await Dialog.open(path);
		await dialog.confirm();
		return dialog;
	}

	/**
	 * Close opened folder
	 */
	public static async closeFolder(): Promise<void> {
		const titleBar = new TitleBar();
		await titleBar.select("File", "Close Folder");
	}

	/**
	 * Selects path and confirms dialog
	 * @param path path to be inputted to dialog
	 * @returns promise which resolves with dialog
	 * @author Marian Lorinc <mlorinc@redhat.com>
	 */
	public static async confirm(path?: string): Promise<OpenDialog> {
		const dialog = await Dialog.open(path);
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
		const dialog = await Dialog.open(path);
		await dialog.cancel();
		return dialog;
	}

	private static async open(path: string = ""): Promise<OpenDialog> {
		const dialog = await DialogHandler.getOpenDialog();
		if (dialog === null) {
			return await Promise.reject('Could not open dialog!');
		}
		await dialog.selectPath(path);
		return dialog;
	}
}

export { Dialog };
export default Dialog;
