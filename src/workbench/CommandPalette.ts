import { Input, InputBox, TitleBar } from "vscode-extension-tester";
import { Input as InputHelper } from "../components/Input";

/**
 * Represents command palette element in vscode
 * @author Marian Lorinc <mlorinc@redhat.com>
 */
class CommandPalette extends InputHelper {

	private constructor(input: Input | InputHelper) {
		super(input);
	}

	/**
	 * Executes command in command palette
	 * @param command command to be executed
	 */
	public async executeCommand(command: string, timeout: number = 5000): Promise<void> {
		return this.typeAndConfirm(command.startsWith(">") ? command : ">" + command, timeout);
	}

	/**
	 * Opens command palette
	 * @returns promise which resolves to command palette object
	 */
	public static async open(): Promise<CommandPalette> {
		const titleBar = new TitleBar();
		await titleBar.select("View", "Command Palette...");
		return this.getInstance();
	}

	public static async getInstance(): Promise<CommandPalette> {
		return new CommandPalette(await InputBox.create());
	}
}

export { CommandPalette };
