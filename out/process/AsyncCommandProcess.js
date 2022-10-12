"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AsyncCommandProcess = void 0;
const childProcess = require("child_process");
const AsyncProcess_1 = require("./AsyncProcess");
class AsyncCommandProcess extends AsyncProcess_1.AsyncProcess {
    constructor(command, args, options) {
        super();
        this.command = command;
        this.args = args;
        this.options = options;
    }
    processSpawner() {
        return childProcess.spawn(this.command, this.args, this.options || {});
    }
}
exports.AsyncCommandProcess = AsyncCommandProcess;
//# sourceMappingURL=AsyncCommandProcess.js.map