import { StatusBar, By } from "vscode-extension-tester";

/**
 * Page object for the status bar at the bottom
 * @author Dominik Jelinek <djelinek@redhat.com>
 */
class StatusBarExt extends StatusBar {

	protected readonly LSP_BAR_ID: string = 'redhat.vscode-apache-camel';

	/**
	 * Get the name of Apache Camel LSP Status Bar item as text
	 * Only works with an open editor
	 */
	public async getItemByID(id: string): Promise<String> {
		return await new StatusBar().findElement(By.id(id)).getText();
	}

	/**
	 * Get the name of Apache Camel LSP Status Bar item as text
	 * Only works with an open editor
	 */
	public async getLSPSupport(): Promise<String> {
		return await new StatusBar().findElement(By.id(this.LSP_BAR_ID)).getText();
	}
}

export { StatusBarExt };
