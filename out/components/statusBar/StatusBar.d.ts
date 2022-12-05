import { StatusBar as IStatusBar } from "vscode-extension-tester";
/**
 * Page object for the status bar at the bottom
 * @author Dominik Jelinek <djelinek@redhat.com>
 */
declare class StatusBar extends IStatusBar {
    protected readonly LSP_BAR_ID: string;
    /**
     * Get the name of Apache Camel LSP Status Bar item as text
     * Only works with an open editor
     */
    getItemByID(id: string): Promise<String>;
    /**
     * Get the name of Apache Camel LSP Status Bar item as text
     * Only works with an open editor
     */
    getLSPSupport(): Promise<String>;
}
export { StatusBar };
