import { DialogHandler, OpenDialog } from "vscode-extension-tester";

/**
 * Handles open dialogs in vscode
 * @author Marian Lorinc <mlorinc@redhat.com>
 */
class Dialog {

	private constructor() {}

	/**
	 * Selects path
	 * @param path path to be inputted to dialog
	 * @returns promise which resolves with dialog
	 * @author Marian Lorinc <mlorinc@redhat.com>
	 */
	private static async handleDialog(path: string = ""): Promise<OpenDialog> {
		const dialog = await DialogHandler.getOpenDialog();
		await dialog.selectPath(path);
		return dialog;
	}
	
	/**
	 * Selects path and confirms dialog
	 * @param path path to be inputted to dialog
	 * @returns promise which resolves with dialog
	 * @author Marian Lorinc <mlorinc@redhat.com>
	 */
	public static async confirm(path?: string): Promise<OpenDialog> {
		const dialog = await Dialog.handleDialog(path);
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
		const dialog = await Dialog.handleDialog(path);
		await dialog.cancel();
		return dialog;
	}
}

export { Dialog };
export default Dialog;
