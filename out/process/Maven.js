"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Maven = void 0;
const AsyncCommandProcess_1 = require("./AsyncCommandProcess");
/**
 * @param properties converts object filled with key:value to properties to be passed like in command line
 * @returns formatted array of strings to be passed to maven process
 * @author Marian Lorinc <mlorinc@redhat.com>
 */
function parseVariables(properties) {
    if (properties === undefined) {
        return [];
    }
    const out = [];
    for (const variableName of Object.keys(properties)) {
        out.push(`-D${variableName}=${properties[variableName]}`);
    }
    return out;
}
/**
 * Creates new AsyncProcess which can be started later.
 * @author Marian Lorinc <mlorinc@redhat.com>
 */
class Maven extends AsyncCommandProcess_1.AsyncCommandProcess {
    constructor(options) {
        options.args = options.args || [];
        super("mvn", [...parseVariables(options.properties), ...options.args], options);
    }
}
exports.Maven = Maven;
//# sourceMappingURL=Maven.js.map