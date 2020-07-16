import { EditorView, ExtensionsViewItem } from 'vscode-extension-tester';
import { expect } from 'chai';
import { getPackageData } from '../extension/package/interfaces/Package';
import { Marketplace } from '../workbench/Marketplace';

export interface InstallTimeouts {
	marketplaceOpen?: number;
	marketplaceClose?: number;
	findExtension?: number;
	verifyInstalled?: number;
	installExtension?: number;
}

export interface InstallParameters {
	/**
	 * Test suite title
	 */
	testTitle?: string;
	/**
	 * Name of extension in vscode marketplace
	 */
	displayName?: string;
	/**
	 * Timeout configuration
	 */
	timeouts?: InstallTimeouts;
}

/**
 * Perform following test:
 * 1. open marketplace
 * 2. find the extension in marketplace
 * 3. verify the extension is not installed
 * 4. install extension and verify result
 * 5. close marketplace and all editors
 * 
 * @requires Test extension must not be installed
 * @param parameters test configuration
 */
export function test(parameters?: InstallParameters) {
	const packageData = getPackageData();
	const packageJson = packageData.getData<InstallParameters>();

	parameters = {
		...packageJson,
		...parameters
	};

	describe(parameters.testTitle || 'Extension install test', function () {
		let marketplace: Marketplace;
		let extension: ExtensionsViewItem | undefined;

		before('Init tester and get package data', async function () {
			this.timeout(parameters?.timeouts?.marketplaceOpen || 10000);
			marketplace = await Marketplace.open();
		});

		after('Clear workspace', async function () {
			this.timeout(parameters?.timeouts?.marketplaceClose || 10000);
			await marketplace.clearSearch();
			await Promise.all([
				marketplace.close(),
				new EditorView().closeAllEditors()
			]);
		});

		it('Find extension', async function () {
			this.timeout(parameters?.timeouts?.findExtension || 10000);
			extension = await marketplace.findExtension(parameters?.displayName as string);
			expect(extension, `Could not find extension '${parameters?.displayName}'`).not.to.be.undefined;
		});

		it('Extension is not installed', async function () {
			this.timeout(parameters?.timeouts?.verifyInstalled || 3500);
			expect(await extension!.isInstalled()).to.be.false;
		});

		it('Installs extension', async function () {
			this.timeout(parameters?.timeouts?.installExtension || 40000);
			await extension!.install().catch((e) => expect.fail('Could not install extension: ' + e));
			expect(await extension!.isInstalled()).to.be.true;
		});
	});
}

