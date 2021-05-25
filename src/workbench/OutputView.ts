import { OutputView, BottomBarPanel } from "vscode-extension-tester";

/**
 * Similar object to vscode-extension-tester but with more functionality
 */
class OutputViewExt extends OutputView {

	/**
	 * Creates new object but does not open OutputView
	 */
	constructor(panel: BottomBarPanel = new BottomBarPanel()) {
		super(panel);
	}

	public async waitUntilContainsText(text: string, timeout?: number): Promise<boolean> {
		let contains = false;

		await this.getDriver()
			.wait(async () => {
				const outputText = await this.getText();
				return outputText.includes(text);
			}, timeout)
			.then(() => contains = true)
			.catch(() => contains = false);

		return contains;
	}

	public static async open(): Promise<OutputViewExt> {
		const panel = new BottomBarPanel();
		await panel.toggle(true);
		await panel.openOutputView();
		return new OutputViewExt(panel);
	}

	public static getInstance(): OutputViewExt {
		return new OutputViewExt();
	}
}

export { OutputViewExt };
