import { TitleBar, InputBox, Workbench } from 'vscode-extension-tester';

/**
 * Handles File Dialogs 
 * @author Dominik Jelinek <djelinek@redhat.com>
 */
class FileSystem {

	private constructor() {}
	
	/**
	 * Open file with specified 'path' via Simple Dialog (File > Open File...)
	 * @param path path to the specific file
	 * @returns resolved dialog
	 */
	public static async openFile(path?: string): Promise<InputBox> {
		const input = await FileSystem.open(path);
		await input.confirm();
		return input;
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
	 * Open folder with specified 'path' via Open Folder Simple Dialog (File > Open Folder...)
	 * @param path path to the specific folder
	 * @returns resolved dialog
	 */
	public static async openFolder(path?: string): Promise<InputBox> {
		const input = await FileSystem.open(path);
		await input.confirm();
		return input;
	}

	/**
	 * Close opened folder
	 */
	public static async closeFolder(): Promise<void> {
		const titleBar = new TitleBar();
		await titleBar.select("File", "Close Folder");
	}

	/**
	 * It will revert changes made in currently opened file before save
	 */
	 public static async revertFileChanges(): Promise<void> {
		await new Workbench().executeCommand('File: Revert File');
	}

	/**
	 * Selects path and confirms dialog
	 * @param path path to be inputted to dialog
	 * @returns promise which resolves with dialog
	 * @author Marian Lorinc <mlorinc@redhat.com>
	 */
	public static async confirm(path?: string): Promise<InputBox> {
		const dialog = await FileSystem.open(path);
		await dialog.confirm();
		return dialog;
	}
	
	/**
	 * Selects path and cancels dialog
	 * @param path path to be inputted to dialog
	 * @returns promise which resolves with dialog
	 * @author Marian Lorinc <mlorinc@redhat.com>
	 */
	public static async cancel(path?: string): Promise<InputBox> {
		const dialog = await FileSystem.open(path);
		await dialog.cancel();
		return dialog;
	}

	private static async open(path: string = ""): Promise<InputBox> {
		const input = await InputBox.create();
		if (input === null) {
			return await Promise.reject('Could not open simple dialog!');
		}
		await input.setText(path);
		return input;
	}
}

export { FileSystem };
