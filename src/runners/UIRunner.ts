#!/usr/bin/env node

import { ExTester } from "vscode-extension-tester";
import { parseArgs as argumentParser } from "./ArgumentParser";
import * as fs from "fs";
import * as path from "path";

type Command = "run" | "clean";
const parametersEnvKey = "UI_TOOLING_TEST_PARAMETERS";

/**
 * Parse args passed to process.
 * @author Marian Lorinc <mlorinc@redhat.com>
 */
function parseArgs(): { [key: string]: any } {
	const argv = argumentParser();
	// skip "$programPath" args and keep command and other arguments
	const { $0, ...args } = argv;
	return args;
}

function shouldUseYarn(projectPath: string): boolean {
	const yarnLock = path.join(projectPath, "yarn-lock.json");
	return fs.existsSync(yarnLock);
}

function installVsix(tester: ExTester, useYarn?: boolean) {
	// Try to find extension file in local directory
	const projectPath = process.cwd();

	console.log(`Looking for vsix files in ${projectPath}`);
	const files = fs.readdirSync(projectPath).filter(fn => fn.endsWith(".vsix"));
	console.log(`Found ${files.length} vsix files in ${projectPath}`);

	if (files.length === 1) {
		console.log(`Using ${files[0]} as extension`);
		tester.installVsix({ vsixFile: files[0], useYarn: useYarn || shouldUseYarn(projectPath) });
	}
	else if (files.length === 0) {
		console.warn("Compiling extension from source ...");
		tester.installVsix();
	}
	else {
		console.warn("There is multiple vsix files in directory. Compiling extension from source ...");
		tester.installVsix();
	}
}

class UIRunner {
	private _args: { [key: string]: any };

	public constructor() {
		this._args = parseArgs();
	}

	public get args(): { [key: string]: any } {
		return this._args;
	}

	public async run(): Promise<void> {
		// initialize vscode extension tester
		const tester = new ExTester();

		await tester.downloadCode(this.args["vscode_version"], this.args["vscode_stream"]);
		await tester.downloadChromeDriver(this.args["vscode_version"], this.args["vscode_stream"]);

		if (this.args["without_vsix"] === false) {
			console.log("Installing extension from source");
			installVsix(tester, this.args.yarn);
		}

		if (Object.keys(process.env).includes(parametersEnvKey)) {
			throw new Error(`${parametersEnvKey} variable was already passed as env variable`);
		}

		// pass test parameters to environment variable, so tester can access it
		process.env[parametersEnvKey] = this.args["test_parameters"];

		tester.runTests(this.args.file_glob, this.args["vscode_version"], this.args["vscode_stream"], this.args["vscode_settings"]);
	}

	public async main(): Promise<void> {
		// iterate over user specified commands
		for (const command of this.args._ as Array<Command>) {
			switch (command) {
				case "run":
					await this.run();
					break;
				default:
					throw new Error("Unsupported command");
			}
		}
	}

	public static getTestParameters<T>(): T {
		const rawJson = process.env[parametersEnvKey];
		if (rawJson !== undefined) {
			return JSON.parse(rawJson);
		}
		else {
			throw new Error("Test parameters were not provided");
		}
	}
}

// Call main only if module is being executed from command line
if (require.main === module) {
	const runner = new UIRunner();
	runner.main();
}

export { UIRunner, parametersEnvKey };
