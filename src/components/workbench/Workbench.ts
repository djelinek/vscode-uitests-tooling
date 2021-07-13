import { TitleBar, Workbench as IWorkbench } from "vscode-extension-tester";
import { InputBoxOpenDialog } from "../dialog/InputBoxOpenDialogs";
import { IOpenDialog } from "../dialog/IOpenDialog";
import * as path from "path";
import { PathUtils } from "../../utils/PathUtils";
import * as fs from "fs-extra";
import { repeat } from "../../conditions/Repeat";

class OpenFolderPathError extends Error { }

export class Workbench extends IWorkbench {
	/**
	 * Get path of open folder/workspace
	 */
	async getOpenFolderPath(timeout: number = 30000): Promise<string> {
		return await repeat(async () => {
			try {
				console.log(`Title = "${await new TitleBar().getTitle()}"`);

				const { folder } = await parseTitleBar();
				if (folder) {
					return folder;
				}
				else {
					throw new OpenFolderPathError('There are not open folders in VS Code. Use Workbench.openFolder function first or try passing absolute path.');
				}
			}
			catch (e) {
				if (e.name === 'NoSuchElementError' || e.message.includes('element is not attached to the page document')) {
					return undefined;
				}
				throw e;
			}
		}, {
			timeout,
			message: `Could not get title bar.${await new TitleBar().getTitle().then((title) => ` title = "${title}"`).catch(() => '')
			}`
		}) as string;
	}

	/**
	 * Get path of open folder/workspace
	 */
	async getOpenFilePath(timeout: number = 30000): Promise<string> {
		return await repeat(async () => {
			try {
				console.log(`Title = "${await new TitleBar().getTitle()}"`);

				const { file } = await parseTitleBar();
				if (file) {
					return file;
				}
				else {
					return undefined;
				}
			}
			catch (e) {
				if (e.name === 'NoSuchElementError' || e.message.includes('element is not attached to the page document')) {
					return undefined;
				}
				throw e;
			}
		}, {
			timeout,
			message: `Could not get file path from title bar.${await new TitleBar().getTitle().then((title) => ` title = "${title}"`).catch(() => '')
			}`
		}) as string;
	}

	/**
	 * Open folder. Relative paths are resolved to absolute paths based on current open folder.
	 * @param folderPath path to folder
	 * @returns promise which is resolved when workbench is ready
	 */
	async openFolder(folderPath: string, timeout: number = 40000): Promise<void> {
		await new TitleBar().select('File', 'Open Folder...');

		const dialog = await this.getOpenDialog();
		folderPath = PathUtils.normalizePath(folderPath);

		if (!path.isAbsolute(folderPath)) {
			folderPath = path.join(await this.getOpenFolderPath(), folderPath);
		}

		let inputPath = folderPath;
		if (inputPath.endsWith(path.sep) === false) {
			inputPath += path.sep;
		}

		await dialog.selectPath(inputPath, timeout);
		await dialog.confirm(timeout);
		await this.openFolderWaitCondition(folderPath, timeout);
	}

	/**
	 * Open file. Relative paths are resolved to absolute paths based on current open folder.
	 * @param filePath path to file
	 * @returns promise which is resolved when file is open
	 */
	async openFile(filePath: string, timeout: number = 40000): Promise<void> {
		await new TitleBar().select('File', 'Open File...');

		const dialog = await this.getOpenDialog();
		filePath = PathUtils.normalizePath(filePath);

		if (!path.isAbsolute(filePath)) {
			filePath = path.join(await this.getOpenFolderPath(), filePath);
		}

		await dialog.selectPath(filePath, timeout);
		await dialog.confirm(timeout);
		await repeat(async () => await this.getOpenFilePath() === filePath, {
			timeout,
			message: `Could not open file with path "${filePath}"`
		});
	}

	/**
	 * Close open folder.
	 * @returns promise which is resolved when folder is closed
	 */
	async closeFolder(timeout: number = 40000): Promise<void> {
		if (process.env.OPEN_FOLDER && PathUtils.normalizePath(process.env.OPEN_FOLDER) === await this.getOpenFolderPath()) {
			return;
		}

		try {
			await this.getOpenFolderPath();
			await new TitleBar().select('File', 'Close Folder');
			await this.getDriver().wait(async () => {
				try {
					await this.getOpenFolderPath();
					return false;
				}
				catch {
					return true;
				}
			}, timeout, `Could not close folder.`);
		}
		catch (e) {
			if (e instanceof OpenFolderPathError) {
				return;
			}

			throw e;
		}
	}

	/**
	* Return existing open dialog object.
	*/
	async getOpenDialog(): Promise<IOpenDialog> {
		return new InputBoxOpenDialog();
	}

	private async openFolderWaitCondition(folderPath: string, timeout: number = 40000): Promise<void> {
		await this.getDriver().wait(async () => {
			try {
				return await this.getOpenFolderPath() === folderPath;
			}
			catch (e) {
				if (e instanceof OpenFolderPathError) {
					return false;
				}
				throw e;
			}
		}, timeout, `Could not find open folder with path "${folderPath}".`);
	}
}

async function parseTitleBar(): Promise<{ file: string | undefined; folder: string | undefined }> {
	const title = await new TitleBar().getTitle();

	const segments = title.split(' - ');
	let file: string | undefined = undefined;
	let folder: string | undefined = undefined;

	for (const segment of segments) {
		try {
			const segmentValue = PathUtils.normalizePath(segment);
			const stat = fs.statSync(segmentValue);
			if (stat.isDirectory()) {
				folder = segmentValue;
			}
			else if (stat.isFile()) {
				file = segmentValue;
			}

			if (file && folder) {
				break;
			}
		}
		catch (e) {
			if (e.message.includes('no such file or directory')) {
				continue;
			}
			throw e;
		}
	}

	return { file, folder };
}
