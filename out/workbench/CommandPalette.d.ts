import { QuickOpenBox } from "vscode-extension-tester";
/**
 * Represents command palette element in vscode
 * @author Marian Lorinc <mlorinc@redhat.com>
 */
declare class CommandPalette extends QuickOpenBox {
    private constructor();
    /**
     * Executes command in command palette
     * @param command command to be executed
     */
    executeCommand(command: string): Promise<void>;
    /**
     * Opens command palette
     * @returns promise which resolves to command palette object
     */
    static open(): Promise<CommandPalette>;
    static getInstance(): Promise<CommandPalette>;
}
export { CommandPalette };
