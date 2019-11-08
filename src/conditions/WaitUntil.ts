import { ContentAssist, VSBrowser, WebDriver } from "vscode-extension-tester";

/**
 * Class containing wait until conditions
 * 
 * @author mlorinc <mlorinc@redhat.com>
 */
class WaitUntil {

	driver: WebDriver;

	constructor() {
		this.driver = VSBrowser.instance.driver;
	}

	/**
	 * Waits until invoked Content Assistant has items
	 * 
	 * @param contentAssistant ContentAssist obj
	 * @param timePeriod Timeout in ms
	 * @author djelinek
	 */
	public async assistHasItems(contentAssistant: ContentAssist, timePeriod: number) {
		await this.driver.wait(
			async function () {
				const items = await contentAssistant.getItems();
				if (items.length > 0) {
					return true;
				}
				return false;
			}, timePeriod);
	}

}

export { WaitUntil };
export default WaitUntil;
