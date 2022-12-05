import { OutputView as IOutputView, BottomBarPanel } from "vscode-extension-tester";
/**
 * Similar object to vscode-extension-tester but with more functionality
 */
declare class OutputView extends IOutputView {
    /**
     * Creates new object but does not open OutputView
     */
    constructor(panel?: BottomBarPanel);
    waitUntilContainsText(text: string, timeout?: number): Promise<boolean>;
    static open(): Promise<OutputView>;
    static getInstance(): OutputView;
}
export { OutputView };
