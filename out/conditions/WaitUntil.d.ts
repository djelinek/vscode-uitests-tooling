import { ContentAssist, WebDriver } from "vscode-extension-tester";
/**
 * Class containing wait until conditions
 * @author Dominik Jelinek <djelinek@redhat.com>
 */
declare class WaitUntil {
    protected driver: WebDriver;
    constructor();
    /**
     * Waits until invoked Content Assistant has items
     * @param contentAssistant ContentAssist obj
     * @param timePeriod Timeout in ms
     */
    assistHasItems(contentAssistant: ContentAssist, timePeriod: number): Promise<void>;
}
export { WaitUntil };
