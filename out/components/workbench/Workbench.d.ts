import { Workbench as IWorkbench } from "vscode-extension-tester";
import { IOpenDialog } from "../dialog/IOpenDialog";
export declare class Workbench extends IWorkbench {
    /**
     * Get path of open folder/workspace
     */
    getOpenFolderPath(timeout?: number): Promise<string>;
    /**
     * Get path of open folder/workspace
     */
    getOpenFilePath(timeout?: number): Promise<string>;
    /**
     * Open folder. Relative paths are resolved to absolute paths based on current open folder.
     * @param folderPath path to folder
     * @returns promise which is resolved when workbench is ready
     */
    openFolder(folderPath: string, timeout?: number): Promise<void>;
    /**
     * Open file. Relative paths are resolved to absolute paths based on current open folder.
     * @param filePath path to file
     * @returns promise which is resolved when file is open
     */
    openFile(filePath: string, timeout?: number): Promise<void>;
    /**
     * Close open folder.
     * @returns promise which is resolved when folder is closed
     */
    closeFolder(timeout?: number): Promise<void>;
    /**
    * Return existing open dialog object.
    */
    getOpenDialog(): Promise<IOpenDialog>;
    private openFolderWaitCondition;
}
