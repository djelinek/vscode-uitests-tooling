import { BottomBarPanel } from "vscode-extension-tester";
import { DefaultWait } from '../conditions/DefaultWait';

/**
 * Class containing wait until conditions
 * 
 * @author mlorinc
 */
export class WaitUntil {

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
    async untiOutputContains(str: string) {
        return this.until(async function () {
            const output = await new BottomBarPanel().openOutputView();
            let outText = await output.getText();
            return outText !== null && outText.includes(str);
        });
    }
}
