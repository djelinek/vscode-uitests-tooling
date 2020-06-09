import { TestRunner, TestRunnerParameters } from "./interfaces/TestRunner";
import { ExTester } from "vscode-extension-tester";
import * as fsExtra from "fs-extra";
import { DisposeException } from "./exceptions/DisposeException";

export class SimpleTestRunner implements TestRunner {
	protected exTester: ExTester;
	private disposed: boolean = false;

	constructor(private parameters: TestRunnerParameters) {
		this.exTester = new ExTester(parameters.storageFolder, parameters.codeReleaseType, parameters.extensionDirectory);

		if (parameters.extensionDirectory) {
			fsExtra.removeSync(parameters.extensionDirectory);
			fsExtra.mkdirSync(parameters.extensionDirectory);
		}
	}

	async dispose(): Promise<void> {
		if (this.disposed) {
			throw new DisposeException('Cannot dispose test runner multiple times.');
		}

		this.disposed = true;
		if (this.parameters.extensionDirectory) {
			return fsExtra.remove(this.parameters.extensionDirectory);
		}
		return Promise.resolve();
	}

	async installCode(): Promise<void> {
		return this.exTester.downloadCode(this.parameters.codeVersion);
	}

	async installCodeDriver(): Promise<void> {
		return this.exTester.downloadChromeDriver(this.parameters.codeVersion);
	}

	async installExtension(extension?: string): Promise<void> {
		return this.exTester.installVsix({
			vsixFile: extension,
			useYarn: this.parameters.useYarn
		});
	}

	async run(testsGlob: string): Promise<number> {
		return this.exTester.runTests(
			testsGlob,
			this.parameters.codeVersion,
			this.parameters.codeSettings,
			false,
			this.parameters.mochaConfig
		).then(() => 0).catch(() => 1);
	}
}
