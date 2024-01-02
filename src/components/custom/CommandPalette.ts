import { QuickOpenBox, TitleBar } from "vscode-extension-tester";

/**
 * Represents command palette element in VS Code
 * @author Marian Lorinc <mlorinc@redhat.com>
 */
class CommandPalette extends QuickOpenBox {

	private constructor() {
		super();
	}

	/**
	 * Executes command in command palette
	 * @param command command to be executed
	 */
	public async executeCommand(command: string): Promise<void> {
		await this.setText(command.startsWith(">") ? command : ">" + command);
		await this.confirm();
	}

	/**
	 * Opens command palette
	 * @returns promise which resolves to command palette object
	 */
	public static async open(): Promise<CommandPalette> {
		const titleBar = new TitleBar();
		await titleBar.select("View", "Command Palette...");
		return new CommandPalette().wait();
	}

	public static async getInstance(): Promise<CommandPalette> {
		return new CommandPalette().wait();
	}
}

export { CommandPalette };
