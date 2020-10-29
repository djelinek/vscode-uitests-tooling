import {
	after,
	before,
	beforeEach,
	describe,
	it
} from "mocha";
import { expect } from "chai";
import { getPackageData } from "../extension/package/interfaces/Package";
import { Input as InputUtils } from "../components/Input";
import { Marketplace } from "../workbench/Marketplace";
import {
	ExtensionsViewItem,
	InputBox,
	Workbench,
	Input,
} from "vscode-extension-tester";


export interface StageTimeouts {
	marketplaceOpen?: number;
	marketplaceClose?: number;
	findExtension?: number;
	verifications?: number;
	commandTests?: number;
}

export interface StagingParameters {
	commands?: string[];
	description?: string;
	displayName?: string;
	publisher: string;
	testTitle?: string;
	timeouts?: StageTimeouts;
}

/**
 * Perform following test:
 * 1. open marketplace
 * 2. find the extension in marketplace
 * 3. verify the extension is installed
 * 4. verify the extension title
 * 5. verify the extension publisher
 * 6. verify the extension description
 * 7. verify the extension commands
 * 	7.1 open command palette
 * 		7.1.1 clear input text
 * 		7.1.2 type in command title
 * 		7.1.3 verify the command exists
 * 	7.2 close command palette
 * 8. close marketplace and all editors
 * 
 * @requires Test extension must be installed
 * @param parameters test configuration
 */
export function stageTest(parameters: StagingParameters) {
	const packageData = getPackageData();
	const packageJson = packageData.getData<StagingParameters>();
	packageJson.commands = packageData.getCommands().map((c) => c.title);

	parameters = {
		...packageJson,
		...parameters
	};

	describe(parameters.testTitle || "Staging test", function () {
		let marketplace: Marketplace;
		let extension: ExtensionsViewItem | undefined;

		before("Init tester and get package data", async function () {
			this.timeout(parameters?.timeouts?.marketplaceOpen || 10000);
			marketplace = await Marketplace.open();
		});

		after("Clear workspace", async function () {
			this.timeout(parameters?.timeouts?.marketplaceClose || 5000);
			await marketplace.clearSearch();
			await marketplace.close();
		});

		it("Find extension", async function () {
			this.timeout(parameters?.timeouts?.findExtension || 10000);
			extension = await marketplace.findExtension(`@installed ${parameters.displayName}`, (parameters?.timeouts?.findExtension || 10000) - 1000);
			expect(extension, `Could not find extension "${parameters?.displayName}"`).not.to.be.undefined;
		});

		it("Extension is installed", async function () {
			this.timeout(parameters?.timeouts?.verifications || 3500);
			expect(await extension!.isInstalled()).to.be.true;
		});

		it("Extensions has expected title", async function () {
			this.timeout(parameters?.timeouts?.verifications || 3500);
			expect(await extension!.getTitle()).to.equal(parameters.displayName);
		});

		it("Publisher of the extension is correct", async function () {
			this.timeout(parameters?.timeouts?.verifications || 3500);
			expect(await extension!.getAuthor()).to.equal(parameters.publisher);
		});

		it("The extension has correct description", async function () {
			this.timeout(parameters?.timeouts?.verifications || 3500);
			expect(await extension!.getDescription()).to.equal(parameters.description);
		});

		describe("Exported commands", async function () {
			let cmd: Input | undefined = undefined;

			before("Open command palette", async function () {
				cmd = await new Workbench().openCommandPrompt();
			});

			after("Close command palette", async function () {
				await cmd?.cancel();
			});

			beforeEach("Clear input text", async function () {
				await cmd?.clear();
			});

			for (const command of (parameters.commands as string[])) {
				it(command, async function () {
					this.timeout(parameters?.timeouts?.commandTests || 15000);
					const cmd = await new Workbench().openCommandPrompt() as InputBox;
					await cmd.setText(`>${command}`);
					await InputUtils.waitQuickPicks(cmd, [command]).catch((e: Error) => expect.fail(e.message));
				});
			}
		});
	});
}


