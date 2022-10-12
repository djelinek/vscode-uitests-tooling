"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AsyncNodeProcess = void 0;
const childProcess = require("child_process");
const AsyncProcess_1 = require("./AsyncProcess");
class AsyncNodeProcess extends AsyncProcess_1.AsyncProcess {
    constructor(module, args, options) {
        super();
        this.module = module;
        this.args = args;
        this.options = options;
    }
    processSpawner() {
        return childProcess.fork(this.module, this.args, this.options);
    }
}
exports.AsyncNodeProcess = AsyncNodeProcess;
//# sourceMappingURL=AsyncNodeProcess.js.map