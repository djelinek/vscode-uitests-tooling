/**
 * General open native dialog
 */
export interface IOpenDialog {
    /**
     * Confirms the dialog
     */
    confirm(timeout?: number): void | Promise<void>;
    /**
     * Cancels the dialog
     */
    cancel(timeout?: number): void | Promise<void>;
    /**
     * Enters the given path into the dialog selection
     * @param path path to select
     */
    selectPath(path: string, timeout?: number): void | Promise<void>;
}
