/// <reference types="node" />
/// <reference types="node" />
import * as childProcess from "child_process";
import * as readline from "readline";
/**
 * Checks if process identified with pid is running.
 * @param pid pid of process
 * @author Marian Lorinc <mlorinc@redhat.com>
 */
declare function isRunning(pid: number): any;
/**
 * Provides utility functions to work with asynchronous process.
 * @author Marian Lorinc <mlorinc@redhat.com>
 */
declare abstract class AsyncProcess {
    /**
     * Handler of started process
     */
    private _psHandler;
    /**
     * This variable is used to cache alreade created reader
     */
    private _stdoutLineReader;
    /**
     * This variable is used to cache alreade created reader
     */
    private _stderrLineReader;
    /**
     * Flag signalizing if process is running
     */
    private _running;
    /**
     * Flag signalizing if process has ever started
     */
    private _started;
    /**
     * Exit code of process. Undefined if process has not been started or is still running
     */
    private _exitCode;
    /**
     * Exit signal of process. Undefined if process has not been started or is still running
     */
    private _exitSignal;
    /**
     * @param options options of process. Please refer to childProcess.SpawnOptions which can be found in Nodejs documentation
     */
    constructor();
    protected abstract processSpawner(): childProcess.ChildProcess;
    /**
     * Get stdout line reader to read process output.
     * @throws Error if process is not running
     */
    get stdoutLineReader(): readline.Interface;
    /**
     * Get stderr line reader to read process error output.
     * @throws Error if process is not running
     */
    get stderrLineReader(): readline.Interface;
    /**
     * Get nodejs process object. Useful if we want to use functions from nodejs.
     * @throws Error if process is not running
     */
    get process(): childProcess.ChildProcess | null;
    /**
     * Check if process is running.
     * @returns true if the process is running. false if process finished or has not been started.
     */
    get isRunning(): boolean;
    /**
     * Handles failure in this#exitCode() and this#exitSignal methods.
     * @throws Error if process is running
     * @throws Error if process has not been started
     * @throws Error if unknown error has happened
     */
    private handleErrorState;
    /**
     * Gets exit code of program. It throws exceptions ff program has not been started or is still running.
     * @throws Error if process is running
     * @throws Error if process has not been started
     * @throws Error if unknown error has happened
     */
    get exitCode(): number | void;
    /**
     * Gets exit signal of program. It throws exceptions ff program has not been started or is still running.
     * @throws Error if process is running
     * @throws Error if process has not been started
     * @throws Error if unknown error has happened
     */
    get exitSignal(): string | void;
    /**
     * Callback called when process exits.
     * @param code exit code of process
     * @param signal exit signal of process
     * @callback
     */
    private onExit;
    /**
     * Starts new process.
     * @throws Error if process is already running
     */
    spawn(): void;
    /**
     * Signals process to exit.
     * @param force force shutdown
     * @param ms timeout in milliseconds
     * @returns promise which resolved with exit code of program
     * @throws Error if process is not running
     */
    exit(force?: boolean, ms?: number): Promise<number>;
    /**
     * Simulates Ctrl+C event.
     * @param ms timeout in milliseconds
     * @returns promise which resolved with exit code of program
     * @throws Error if process is not running
     */
    sendInterruptSignal(ms?: number): Promise<number>;
    /**
     * Waits for process to finish.
     * @param ms timeout in milliseconds
     * @returns promise which resolved with exit code of program
     * @throws Error if process is not running
     */
    wait(ms?: number): Promise<number>;
}
export { AsyncProcess, isRunning };
