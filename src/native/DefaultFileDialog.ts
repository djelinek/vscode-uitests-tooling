import { TitleBar, DialogHandler } from 'vscode-extension-tester';

/**
 * Handles File Dialogs 
 * 
 * @author djelinek
 */
class DefaultFileDialog {
	
	/**
	 * Open file with specified 'path' via Open File Dialog (File > Open File...)
	 * 
	 * @param path 
	 */
	public  async openFile(path: string): Promise<void> {
		await new TitleBar().select('File', 'Open File...');
		await this.open(path);
	}

	/**
	 * Open folder with specified 'path' via Open Folder Dialog (File > Open Folder...)
	 * 
	 * @param path 
	 */
	public async openFolder(path: string): Promise<void> {
		await new TitleBar().select('File', 'Open Folder...');
		await this.open(path);
	}

	private async open(path: string): Promise<void> {
		const dialog = await DialogHandler.getOpenDialog();
		if (dialog === null) {
			return Promise.reject('Could not open dialog!');
		}
		await dialog.selectPath(path);
		await dialog.confirm();
	}
}

export { DefaultFileDialog };
export default DefaultFileDialog;
