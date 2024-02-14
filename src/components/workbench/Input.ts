import { InputBox, QuickOpenBox, QuickPickItem } from "vscode-extension-tester";

interface InputTestProperties {
	text?: string;
	message?: string;
	placeholder?: string;
	quickPicks?: string[];
	isPassword?: boolean;
	hasProgress?: string;
}

class Input {

	private constructor(private _input: InputBox | QuickOpenBox) { }

	/**
	 * Get current text of the input field
	 * @returns Promise resolving to text of the input field
	 */
	public async getText(): Promise<string> {
		return this._input.getText();
	}

	/**
	 * Set (by selecting all and typing) text in the input field
	 * @param text text to set into the input field
	 * @returns Promise resolving when the text is typed in
	 */
	public async setText(text: string): Promise<void> {
		return this._input.setText(text);
	}

	/**
	 * Get the placeholder text for the input field
	 * @returns Promise resolving to input placeholder
	 */
	public async getPlaceHolder(): Promise<string> {
		return this._input.getPlaceHolder();
	}

	/**
	 * Confirm the input field by pressing Enter
	 * @returns Promise resolving when the input is confirmed
	 */
	public async confirm(): Promise<void> {
		return this._input.confirm();
	}

	/**
	 * Cancel the input field by pressing Escape
	 * @returns Promise resolving when the input is cancelled
	 */
	public async cancel(): Promise<void> {
		return this._input.cancel();
	}

	/**
	 * Select (click) a quick pick option.
	 * Search for the item can be done by its text, or index in the quick pick menu.
	 * Note that scrolling does not affect the item's index, but it will
	 * replace some items in the DOM (thus they become unreachable)
	 * 
	 * @param indexOrText index (number) or text (string) of the item to search by
	 * @returns Promise resolving when the given quick pick is selected
	 */
	public async selectQuickPick(indexOrText: string | number): Promise<void> {
		return this._input.selectQuickPick(indexOrText);
	}

	/**
	 * Find whether the input box has an active progress bar
	 * @returns Promise resolving to true/false
	 */
	public hasProgress(): Promise<boolean> {
		return this._input.hasProgress();
	}

	/**
	 * Retrieve the quick pick items currently available in the DOM
	 * (visible in the quick pick menu)
	 * @returns Promise resolving to array of QuickPickItem objects
	 */
	public getQuickPicks(): Promise<QuickPickItem[]> {
		return this._input.getQuickPicks();
	}

	// InputBox only methods

	/**
	 * Get the message below the input field
	 */
	public async getMessage(): Promise<string> {
		if (this._input instanceof InputBox) {
			return (this._input as InputBox).getMessage();
		}
		else {
			throw new Error("Input field is not type of InputBox. It is probable QuickOpenBox");
		}
	}

	/**
	 * Find whether the input is showing an error
	 * @returns Promise resolving to notification message
	 */
	public async hasError(): Promise<boolean> {
		if (this._input instanceof InputBox) {
			return (this._input as InputBox).hasError();
		}
		else {
			throw new Error("Input field is not type of InputBox. It is probable QuickOpenBox");
		}
	}

	/**
	 * Check if the input field is masked (input type password)
	 * @returns Promise resolving to notification message
	 */
	public async isPassword(): Promise<boolean> {
		if (this._input instanceof InputBox) {
			return (this._input as InputBox).isPassword();
		}
		else {
			throw new Error("Input field is not type of InputBox. It is probable QuickOpenBox");
		}
	}

	public static async getInstance(timeout?: number): Promise<Input> {
		let input: InputBox | QuickOpenBox;
		try {
			input = await new InputBox().wait(timeout);
		} catch (e) {
			input = await new QuickOpenBox().wait(timeout);
		}
		return new Input(input);
	}
}

export { Input };
