import { OutputView as Output, BottomBarPanel } from "vscode-extension-tester";

/**
 * Similar object to vscode-extension-tester but with more functionality
 */
class OutputView extends Output {

	private static instance: OutputView | null = null;

	/**
	 * Creates new object but does not open OutputView
	 */
	private constructor(panel: BottomBarPanel = new BottomBarPanel()) {
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

	public static async open(): Promise<OutputView> {
		const panel = new BottomBarPanel();
		await panel.openOutputView();
		OutputView.instance = new OutputView(panel);
		return OutputView.instance;
	}

	public static getInstance(): OutputView {
		if (OutputView.instance !== null) {
			return OutputView.instance;
		}
		throw new Error("OutputView is closed");
	}
}

export { OutputView };
export default OutputView;