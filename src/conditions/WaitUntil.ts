import { BottomBarPanel, ContentAssist, VSBrowser, WebDriver } from "vscode-extension-tester";
import { DefaultWait } from '../conditions/DefaultWait';

/**
 * Class containing wait until conditions
 * 
 * @author mlorinc
 */
export class WaitUntil {

    driver: WebDriver;

    constructor() {
        this.driver = VSBrowser.instance.driver;
    }

    /**
     * Waits until predicate returns true
     * 
     * @param predicate predicate to be evaluated
     * @param nextAttemptDelay delay between retry attempts
     */
    async until(predicate: () => Promise<boolean>, nextAttemptDelay = 300) {
        while (!(await predicate())) {
            await new DefaultWait().sleep(nextAttemptDelay);
        }
    }

    /**
     * Waits until Output View contains a specific string
     * 
     * @param str 
     */
    async outputContains(str: string) {
        return this.until(async function () {
            const output = await new BottomBarPanel().openOutputView();
            let outText = await output.getText();
            return outText !== null && outText.includes(str);
        });
    }

    /**
     * Waits until invoked Content Assistant has items
     * 
     * @param contentAssistant ContentAssist obj
     * @param timePeriod Timeout in ms
     */
    async assistHasItems(contentAssistant: ContentAssist, timePeriod: number) {
        await this.driver.wait(
            async function() {
                const items = await contentAssistant.getItems();
                if (items.length > 0) {
                    return true;
                }
                return false;
            }, timePeriod);
    }

}
