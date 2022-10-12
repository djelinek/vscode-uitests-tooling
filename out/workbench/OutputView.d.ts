import { OutputView, BottomBarPanel } from "vscode-extension-tester";
/**
 * Similar object to vscode-extension-tester but with more functionality
 */
declare class OutputViewExt extends OutputView {
    /**
     * Creates new object but does not open OutputView
     */
    constructor(panel?: BottomBarPanel);
    waitUntilContainsText(text: string, timeout?: number): Promise<boolean>;
    static open(): Promise<OutputViewExt>;
    static getInstance(): OutputViewExt;
}
export { OutputViewExt };
