import { QuickPickItem } from "vscode-extension-tester";
interface InputTestProperties {
    text?: string;
    message?: string;
    placeholder?: string;
    quickPicks?: string[];
    isPassword?: boolean;
    hasProgress?: string;
}
declare class Input {
    private _input;
    private constructor();
    /**
    * Get current text of the input field
    * @returns Promise resolving to text of the input field
    */
    getText(): Promise<string>;
    /**
     * Set (by selecting all and typing) text in the input field
     * @param text text to set into the input field
     * @returns Promise resolving when the text is typed in
     */
    setText(text: string): Promise<void>;
    /**
     * Get the placeholder text for the input field
     * @returns Promise resolving to input placeholder
     */
    getPlaceHolder(): Promise<string>;
    /**
     * Confirm the input field by pressing Enter
     * @returns Promise resolving when the input is confirmed
     */
    confirm(): Promise<void>;
    /**
     * Cancel the input field by pressing Escape
     * @returns Promise resolving when the input is cancelled
     */
    cancel(): Promise<void>;
    /**
     * Select (click) a quick pick option.
     * Search for the item can be done by its text, or index in the quick pick menu.
     * Note that scrolling does not affect the item's index, but it will
     * replace some items in the DOM (thus they become unreachable)
     *
     * @param indexOrText index (number) or text (string) of the item to search by
     * @returns Promise resolving when the given quick pick is selected
     */
    selectQuickPick(indexOrText: string | number): Promise<void>;
    /**
     * Find whether the input box has an active progress bar
     * @returns Promise resolving to true/false
     */
    hasProgress(): Promise<boolean>;
    /**
     * Retrieve the quick pick items currently available in the DOM
     * (visible in the quick pick menu)
     * @returns Promise resolving to array of QuickPickItem objects
     */
    getQuickPicks(): Promise<QuickPickItem[]>;
    /**
     * Get the message below the input field
     */
    getMessage(): Promise<string>;
    /**
     * Find whether the input is showing an error
     * @returns Promise resolving to notification message
     */
    hasError(): Promise<boolean>;
    /**
     * Check if the input field is masked (input type password)
     * @returns Promise resolving to notification message
     */
    isPassword(): Promise<boolean>;
    /**
     * Tests Input element properties.
     * @param testProperties properties to be tested
     */
    test(testProperties: InputTestProperties): Promise<void>;
    static getInstance(timeout?: number): Promise<Input>;
}
export { Input };
