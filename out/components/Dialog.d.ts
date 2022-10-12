import { InputBox } from 'vscode-extension-tester';
/**
 * Handles File Dialogs
 * @author Dominik Jelinek <djelinek@redhat.com>
 */
declare class Dialog {
    private constructor();
    /**
     * Open file with specified 'path' via Simple Dialog (File > Open File...)
     * @param path path to the specific file
     * @returns resolved dialog
     */
    static openFile(path?: string): Promise<InputBox>;
    /**
     * Close and save opened file
     * @param save true/false, save file before close editor or not
     */
    static closeFile(save?: boolean): Promise<void>;
    /**
     * Open folder with specified 'path' via Open Folder Simple Dialog (File > Open Folder...)
     * @param path path to the specific folder
     * @returns resolved dialog
     */
    static openFolder(path?: string): Promise<InputBox>;
    /**
     * Close opened folder
     */
    static closeFolder(): Promise<void>;
    /**
     * Selects path and confirms dialog
     * @param path path to be inputted to dialog
     * @returns promise which resolves with dialog
     * @author Marian Lorinc <mlorinc@redhat.com>
     */
    static confirm(path?: string): Promise<InputBox>;
    /**
     * Selects path and cancels dialog
     * @param path path to be inputted to dialog
     * @returns promise which resolves with dialog
     * @author Marian Lorinc <mlorinc@redhat.com>
     */
    static cancel(path?: string): Promise<InputBox>;
    private static open;
}
export { Dialog };
