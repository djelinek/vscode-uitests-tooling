import { OutputView, BottomBarPanel } from "vscode-extension-tester";

/**
 * Similar object to vscode-extension-tester but with more functionality
 */
class OutputViewExt extends OutputView {

	private static instance: OutputViewExt | null = null;

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

	public static async open(): Promise<OutputViewExt> {
		const panel = new BottomBarPanel();
		await panel.openOutputView();
		OutputViewExt.instance = new OutputViewExt(panel);
		return OutputViewExt.instance;
	}

	public static getInstance(): OutputViewExt {
		if (OutputViewExt.instance !== null) {
			return OutputViewExt.instance;
		}
		throw new Error("OutputView is closed");
	}
}

export { OutputViewExt };
