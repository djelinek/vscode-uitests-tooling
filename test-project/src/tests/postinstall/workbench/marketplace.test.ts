import { Marketplace, repeat } from "vscode-uitests-tooling";
import { expect } from "chai";

describe("Marketplace test", async function () {
	this.timeout(12000);
	let marketplace: Marketplace;
	
	async function open(): Promise<Marketplace> {
		return await Marketplace.open();
	}

	it("Open marketplace", async function () {
		marketplace = await repeat(open, { count: 5 });
		expect(marketplace).not.to.be.undefined;
	});

	it("Find test extension", async function () {
		const extension = await marketplace.findExtension("@installed scenario-test-extension", 10000).catch(expect.fail);
		expect(await extension?.getAuthor(), "Author is not correct").to.be.equal("MarianLorinc");
		expect(await extension?.isInstalled(), "Extension is not installed").to.be.true;
	});
});
