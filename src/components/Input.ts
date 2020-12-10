import { expect } from 'chai';
import {
	Input as TesterInput,
	InputBox,
	QuickOpenBox,
	QuickPickItem
} from 'vscode-extension-tester';
import { WebElementConditions, repeat } from '..';

interface InputTestProperties {
	text?: string;
	message?: string;
	placeholder?: string;
	quickPicks?: string[];
	isPassword?: boolean;
	hasProgress?: string;
}

class Input {
	private _input: TesterInput;

	protected constructor(input: TesterInput | Input) { 
		if (input instanceof Input) {
			this._input = input._input;
		}
		else {
			this._input = input;
		}
	}

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

	/**
	 * Tests Input element properties.
	 * @param testProperties properties to be tested
	 */
	public async test(testProperties: InputTestProperties): Promise<void> {
		if (testProperties.hasProgress !== undefined) {
			expect(await this.hasProgress()).to.equal(testProperties.hasProgress);
		}
		if (testProperties.isPassword !== undefined) {
			expect(await this.isPassword()).to.equal(testProperties.isPassword);
		}
		if (testProperties.message !== undefined) {
			expect(await this.getMessage()).to.equal(testProperties.message);
		}
		if (testProperties.placeholder !== undefined) {
			expect(await this.getPlaceHolder()).to.equal(testProperties.placeholder);
		}
		if (testProperties.quickPicks !== undefined) {
			const quickPicks = await this.getQuickPicks();
			const quickPickTexts = new Set(await Promise.all(quickPicks.map(pick => pick.getText())));
			expect(quickPickTexts).to.have.keys(testProperties.quickPicks);
		}
		if (testProperties.text !== undefined) {
			expect(await this.getText()).to.equal(testProperties.text);
		}
	}

	/**
	 * Type in text and confirm.
	 * @param text command palette input
	 * @param timeout 
	 */
	public async typeAndConfirm(text: string, timeout: number = 5000): Promise<void> {
		await WebElementConditions.waitUntilInteractive(this._input, timeout);
		await this._input.setText(text);
		await repeat(async () => {
			await this._input.confirm().catch(() => {});
			return await WebElementConditions.isHidden(this._input);
		}, {
			timeout
		});
	}

	public static async getInstance(timeout?: number): Promise<Input> {
		let input: InputBox | QuickOpenBox;
		try {
			input = await InputBox.create();
		} catch (e) {
			input = await new QuickOpenBox().wait(timeout);
		}
		return new Input(input);
	}

	/**
	 * Wait for quick picks to show in vscode. If any of required quick pick does show, Error is thrown.
	 * @param input vscode input element (must be visible in vscode)
	 * @param quickPickTexts array of texts to be verified in list of suggested quickpicks
	 * @param timeout time after waiting is stopped unsuccessfully
	 * @throws Error type when any quickpick did not show in suggested quickpicks
	 */
	public static async waitQuickPicks(input: TesterInput, quickPickTexts: string[], timeout: number = 5000): Promise<void> {
		const result = await input.getDriver().wait(async () => {
			const quickPickItems = await input.getQuickPicks().catch(() => []);

			if (quickPickItems.length === 0 && quickPickTexts.length > 0) {
				return false;
			}

			return quickPickItems.every(async q => {
				const text = await q.getText().catch(() => null);

				if (text === null) {
					return false;
				}

				return quickPickTexts.includes(text);
			});
		}, timeout).catch(() => false);

		if (!result) {
			const quickPickTexts = await Promise.all((await input.getQuickPicks()).map(q => q.getText()));
			throw new Error(`Could not find all quick picks.\nExpected: ${quickPickTexts.join(", ")}\nGot: ${quickPickTexts.join(", ")}`);
		}
	}
}

export { Input };
