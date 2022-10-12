"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isRunning = exports.AsyncProcess = void 0;
const readline = require("readline");
const killProcess = require("tree-kill");
const TimeoutPromise_1 = require("../conditions/TimeoutPromise");
/**
 * Checks if process identified with pid is running.
 * @param pid pid of process
 * @author Marian Lorinc <mlorinc@redhat.com>
 */
function isRunning(pid) {
    try {
        return process.kill(pid, 0);
    }
    catch (e) {
        return e.code === 'EPERM';
    }
}
exports.isRunning = isRunning;
/**
 * Provides utility functions to work with asynchronous process.
 * @author Marian Lorinc <mlorinc@redhat.com>
 */
class AsyncProcess {
    /**
     * @param options options of process. Please refer to childProcess.SpawnOptions which can be found in Nodejs documentation
     */
    constructor() {
        /**
         * Handler of started process
         */
        this._psHandler = null;
        /**
         * This variable is used to cache alreade created reader
         */
        this._stdoutLineReader = null;
        /**
         * This variable is used to cache alreade created reader
         */
        this._stderrLineReader = null;
        this._running = false;
        this._started = false;
        this._exitCode = undefined;
        this._exitSignal = undefined;
        this.onExit = this.onExit.bind(this);
    }
    /**
     * Get stdout line reader to read process output.
     * @throws Error if process is not running
     */
    get stdoutLineReader() {
        if (!this.isRunning || this._psHandler === null) {
            throw new Error("Process is not running");
        }
        if (this._stdoutLineReader) {
            return this._stdoutLineReader;
        }
        else {
            this._stdoutLineReader = readline.createInterface({ input: this._psHandler.stdout });
            return this._stdoutLineReader;
        }
    }
    /**
     * Get stderr line reader to read process error output.
     * @throws Error if process is not running
     */
    get stderrLineReader() {
        if (!this.isRunning || this._psHandler === null) {
            throw new Error("Process is not running");
        }
        if (this._stderrLineReader) {
            return this._stderrLineReader;
        }
        else {
            this._stderrLineReader = readline.createInterface({ input: this._psHandler.stderr });
            return this._stderrLineReader;
        }
    }
    /**
     * Get nodejs process object. Useful if we want to use functions from nodejs.
     * @throws Error if process is not running
     */
    get process() {
        if (!this.isRunning) {
            throw new Error("Process is not running");
        }
        return this._psHandler;
    }
    /**
     * Check if process is running.
     * @returns true if the process is running. false if process finished or has not been started.
     */
    get isRunning() {
        return this._running;
    }
    /**
     * Handles failure in this#exitCode() and this#exitSignal methods.
     * @throws Error if process is running
     * @throws Error if process has not been started
     * @throws Error if unknown error has happened
     */
    handleErrorState() {
        let message;
        if (!this._started) {
            message = "Process has not been started";
        }
        else if (this._running && this.process !== null) {
            message = `Process with pid ${this.process.pid} is still running`;
        }
        else {
            message = "Unknown error.";
        }
        throw new Error(message);
    }
    /**
     * Gets exit code of program. It throws exceptions ff program has not been started or is still running.
     * @throws Error if process is running
     * @throws Error if process has not been started
     * @throws Error if unknown error has happened
     */
    get exitCode() {
        if (this._exitCode !== undefined) {
            return this._exitCode;
        }
        this.handleErrorState();
    }
    /**
     * Gets exit signal of program. It throws exceptions ff program has not been started or is still running.
     * @throws Error if process is running
     * @throws Error if process has not been started
     * @throws Error if unknown error has happened
     */
    get exitSignal() {
        if (this._exitSignal !== null) {
            return this._exitSignal;
        }
        this.handleErrorState();
    }
    /**
     * Callback called when process exits.
     * @param code exit code of process
     * @param signal exit signal of process
     * @callback
     */
    onExit(code, signal) {
        if (this._stdoutLineReader !== null) {
            this._stdoutLineReader.close();
        }
        if (this._stderrLineReader !== null) {
            this._stderrLineReader.close();
        }
        this.process.removeAllListeners();
        this._running = false;
        this._exitCode = code;
        this._exitSignal = signal;
    }
    /**
     * Starts new process.
     * @throws Error if process is already running
     */
    spawn() {
        if (this._running) {
            throw new Error(`Process with pid ${this.process.pid} is already running`);
        }
        this._psHandler = this.processSpawner();
        this._psHandler.on("exit", this.onExit);
        this._running = true;
    }
    /**
     * Signals process to exit.
     * @param force force shutdown
     * @param ms timeout in milliseconds
     * @returns promise which resolved with exit code of program
     * @throws Error if process is not running
     */
    exit(force, ms) {
        return __awaiter(this, void 0, void 0, function* () {
            const waitPromise = this.wait(ms);
            const killPromise = new Promise((resolve, reject) => {
                killProcess(this.process.pid, force ? "SIGKILL" : "SIGTERM", (e) => {
                    if (e) {
                        reject(e);
                    }
                    else {
                        resolve();
                    }
                });
            });
            return Promise.all([killPromise, waitPromise]).then(([_, code]) => code);
        });
    }
    /**
     * Simulates Ctrl+C event.
     * @param ms timeout in milliseconds
     * @returns promise which resolved with exit code of program
     * @throws Error if process is not running
     */
    sendInterruptSignal(ms) {
        return __awaiter(this, void 0, void 0, function* () {
            const waitPromise = this.wait(ms);
            this.process.kill("SIGINT");
            return waitPromise;
        });
    }
    /**
     * Waits for process to finish.
     * @param ms timeout in milliseconds
     * @returns promise which resolved with exit code of program
     * @throws Error if process is not running
     */
    wait(ms) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this._running) {
                throw new Error("Process is not running");
            }
            return new TimeoutPromise_1.TimeoutPromise((resolve) => {
                this.process.on("exit", (code) => {
                    resolve(code);
                });
            }, ms);
        });
    }
}
exports.AsyncProcess = AsyncProcess;
//# sourceMappingURL=AsyncProcess.js.map