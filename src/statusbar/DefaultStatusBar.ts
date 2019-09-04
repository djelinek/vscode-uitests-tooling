import { StatusBar, By } from "vscode-extension-tester";

/**
 * Page object for the status bar at the bottom
 */
export class DefaultStatusBar extends StatusBar {

    /**
     * Get the name of Apache Camel LSP Status Bar item as text
     * Only works with an open editor
     */
    async getItemByID(id: string): Promise<String> {
        return await new StatusBar().findElement(By.id(id)).getText();

    }

    /**
     * Get the name of Apache Camel LSP Status Bar item as text
     * Only works with an open editor
     */
    async getLSPSupport(): Promise<String> {
        return await new StatusBar().findElement(By.id('redhat.vscode-apache-camel')).getText();

    }
}
