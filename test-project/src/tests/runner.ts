import { createTestRunner } from "vscode-uitests-tooling";
import { ReleaseQuality } from "vscode-extension-tester";

async function main() {
	const runner = createTestRunner({
		codeDriverVersion: undefined,
		codeReleaseType: ReleaseQuality.Stable,
		codeSettings: undefined,
		codeVersion: undefined,
		extensionDirectory: "test-extensions",
		mochaConfig: undefined,
		storageFolder: undefined,
		useYarn: false
	});

	await runner.installCode();
	await runner.installCodeDriver();
	await runner.installExtension();
	console.log(`Launching tests from '${process.cwd()}'`);
	await runner.run(`${process.cwd()}/out/tests/**/*.test.js`);
	// runner.run does not wait for ui tests to finish
	// await runner.dispose();
}

if (require.main === module) {
	console.log("Starting tester");
	main();
}
