import { SpawnOptions } from "child_process";
import { AsyncCommandProcess } from "./AsyncCommandProcess";

/**
 * Extends options of spawn process with maven options
 * @author Marian Lorinc <mlorinc@redhat.com>
 */
interface MavenOptions extends SpawnOptions {

	/**
	 * Maven properties to be overridden when calling maven.
	 */
	properties?: { [key: string]: string };

	/**
	 * Args to be passed when calling maven.
	 */
	args?: Array<string>;
}

/**
 * @param properties converts object filled with key:value to properties to be passed like in command line
 * @returns formatted array of strings to be passed to maven process
 * @author Marian Lorinc <mlorinc@redhat.com>
 */
function parseVariables(properties?: { [key: string]: string }): Array<string> {
	if (properties === undefined) {
		return [];
	}

	const out: Array<string> = [];
	for (const variableName of Object.keys(properties)) {
		out.push(`-D${variableName}=${properties[variableName]}`);
	}
	return out;
}

/**
 * Creates new AsyncProcess which can be started later.
 * @author Marian Lorinc <mlorinc@redhat.com>
 */
class Maven extends AsyncCommandProcess {

	public constructor(options: MavenOptions) {
		options.args = options.args || [];
		super("mvn", [...parseVariables(options.properties), ...options.args], options);
	}
}

export { Maven };
