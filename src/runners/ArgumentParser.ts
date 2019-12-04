import * as yargs from "yargs";
import * as fs from "fs";

/**
 * Ensures json is stored as string in parameters. If file is provided, function transforms it to string.
 * @param argv returns modified arguments, where test parameters are store in string json
 */
function parametersParser(argv: any) {
	// check if test parameters was provided

	const testParameters = argv.test_parameters as string;

	if (testParameters !== undefined) {
		let jsonRawText = null;

		if (testParameters.endsWith(".json")) {
			// it is file, read it and parse it
			jsonRawText = fs.readFileSync(testParameters, { encoding: "utf8" });
		}
		else {
			jsonRawText = testParameters;
		}

		argv.test_parameters = jsonRawText;
	}
	return argv;
}

/**
 * Parse args passed to process.
 * @author Marian Lorinc <mlorinc@redhat.com>
 */
export default function parseArgs(): { [key: string]: any } {
	return yargs
		.middleware(parametersParser)
		.command("run <file_glob>", "Run tests", yargs => {
			yargs
				.positional("file_glob", {
					type: "string",
					describe: "Files to be executed in test"
				})
				.option("yarn", {
					type: "boolean",
					description: "Use yarn when packaging extension",
					default: false
				})
				.option("without_vsix", {
					type: "boolean",
					description: "Do not install extension from source code(useful when testing extension without source code)",
					default: false
				})
				.option("vscode_version", {
					type: "string",
					description: "VS Code version",
					default: "latest"
				})
				.option("vscode_stream", {
					type: "string",
					description: "VS Code stream",
					choices: ["stable", "insider"],
					default: "stable"
				})
				.option("vscode_settings", {
					type: "string",
					description: "VS Code settings",
				})
				.option("test_parameters", {
					type: "string",
					description: "Test data which will be saved in process.env['testParameters']. Requires json or file path"
				});
		})
		.command("clean", "clean workspace")
		.demandCommand()
		.help("h")
		.alias("h", "help")
		.version("v")
		.alias("v", "version")
		.argv;
}
