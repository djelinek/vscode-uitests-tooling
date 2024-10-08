import { StatusBar as IStatusBar, By } from "vscode-extension-tester";

/**
 * Page object for the status bar at the bottom
 * @author Dominik Jelinek <djelinek@redhat.com>
 */
class StatusBar extends IStatusBar {

	protected readonly LSP_BAR_ID: string = 'redhat.vscode-apache-camel';

	/**
	 * Get the name of Apache Camel LSP Status Bar item as text
	 * Only works with an open editor
	 */
	public async getItemByID(id: string): Promise<string> {
		return await new StatusBar().findElement(By.id(id)).getText();
	}

	/**
	 * Get the name of Apache Camel LSP Status Bar item as text
	 * Only works with an open editor
	 */
	public async getLSPSupport(): Promise<string> {
		return await new StatusBar().findElement(By.id(this.LSP_BAR_ID)).getText();
	}
}

export { StatusBar };
