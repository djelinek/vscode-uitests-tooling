import * as childProcess from "child_process";
import * as stream from "stream";
import * as readline from "readline";
import killProcess = require("tree-kill");
import { TimeoutPromise } from "../conditions/TimeoutPromise";


/**
 * Checks if process identified with pid is running.
 * @param pid pid of process
 * @author Marian Lorinc <mlorinc@redhat.com>
 */
function isRunning(pid: number): any {
	try {
		return process.kill(pid, 0);
	}
	catch (e) {
		return e.code === 'EPERM';
	}
}

/**
 * Provides utility functions to work with asynchronous process.
 * @author Marian Lorinc <mlorinc@redhat.com>
 */
abstract class AsyncProcess {

	/**
	 * Handler of started process
	 */
	private _psHandler: childProcess.ChildProcess | null = null;

	/**
	 * This variable is used to cache alreade created reader
	 */
	private _stdoutLineReader: readline.Interface | null = null;

	/**
	 * This variable is used to cache alreade created reader
	 */
	private _stderrLineReader: readline.Interface | null = null;

	/**
	 * Flag signalizing if process is running 
	 */
	private _running: boolean;

	/**
	 * Flag signalizing if process has ever started 
	 */
	private _started: boolean;

	/**
	 * Exit code of process. Undefined if process has not been started or is still running
	 */
	private _exitCode: number | undefined;

	/**
	 * Exit signal of process. Undefined if process has not been started or is still running
	 */
	private _exitSignal: string | undefined;

	/**
	 * @param options options of process. Please refer to childProcess.SpawnOptions which can be found in Nodejs documentation
	 */
	public constructor() {
		this._running = false;
		this._started = false;
		this._exitCode = undefined;
		this._exitSignal = undefined;
		this.onExit = this.onExit.bind(this);
	}

	protected abstract processSpawner(): childProcess.ChildProcess;

	/**
	 * Get stdout line reader to read process output.
	 * @throws Error if process is not running
	 */
	public get stdoutLineReader(): readline.Interface {
		if (!this.isRunning || this._psHandler === null) {
			throw new Error("Process is not running");
		}

		if (this._stdoutLineReader) {
			return this._stdoutLineReader;
		}
		else {
			this._stdoutLineReader = readline.createInterface({ input: this._psHandler.stdout as stream.Readable });
			return this._stdoutLineReader;
		}
	}

	/**
	 * Get stderr line reader to read process error output.
	 * @throws Error if process is not running
	 */
	public get stderrLineReader(): readline.Interface {
		if (!this.isRunning || this._psHandler === null) {
			throw new Error("Process is not running");
		}

		if (this._stderrLineReader) {
			return this._stderrLineReader;
		}
		else {
			this._stderrLineReader = readline.createInterface({ input: this._psHandler.stderr as stream.Readable });
			return this._stderrLineReader;
		}
	}

	/**
	 * Get nodejs process object. Useful if we want to use functions from nodejs.
	 * @throws Error if process is not running
	 */
	public get process() {
		if (!this.isRunning) {
			throw new Error("Process is not running");
		}
		return this._psHandler;
	}

	/**
	 * Check if process is running.
	 * @returns true if the process is running. false if process finished or has not been started.
	 */
	public get isRunning(): boolean {
		return this._running;
	}


	/**
	 * Handles failure in this#exitCode() and this#exitSignal methods.
	 * @throws Error if process is running
	 * @throws Error if process has not been started
	 * @throws Error if unknown error has happened
	 */
	private handleErrorState(): never {
		let message: string;

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
	public get exitCode(): number | void {
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
	public get exitSignal(): string | void {
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
	private onExit(code: number, signal: string): void {
		if (this._stdoutLineReader !== null) {
			this._stdoutLineReader.close();
		}

		if (this._stderrLineReader !== null) {
			this._stderrLineReader.close();
		}

		this.process!.removeAllListeners();

		this._running = false;
		this._exitCode = code;
		this._exitSignal = signal;
	}

	/**
	 * Starts new process.
	 * @throws Error if process is already running
	 */
	public spawn(): void {
		if (this._running) {
			throw new Error(`Process with pid ${this.process!.pid} is already running`);
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
	public async exit(force?: boolean, ms?: number): Promise<number> {
		const waitPromise = this.wait(ms);
		
		const killPromise = new Promise<void>((resolve, reject) => {
			if(this.process?.pid !== undefined) {
				killProcess(this.process.pid, force ? "SIGKILL" : "SIGTERM", (e?: Error) => {
					if (e) {
						reject(e);
					}
					else {
						resolve();
					}
				});
			}
		});

		return Promise.all([killPromise, waitPromise]).then(([_, code]) => code);
	}

	/**
	 * Simulates Ctrl+C event.
	 * @param ms timeout in milliseconds
	 * @returns promise which resolved with exit code of program
	 * @throws Error if process is not running
	 */
	public async sendInterruptSignal(ms?: number): Promise<number> {
		const waitPromise = this.wait(ms);
		this.process!.kill("SIGINT");
		return waitPromise;
	}

	/**
	 * Waits for process to finish.
	 * @param ms timeout in milliseconds
	 * @returns promise which resolved with exit code of program
	 * @throws Error if process is not running
	 */
	public async wait(ms?: number): Promise<number> {
		if (!this._running) {
			throw new Error("Process is not running");
		}

		return new TimeoutPromise((resolve) => {
			this.process!.on("exit", (code: number) => {
				resolve(code);
			});
		}, ms);
	}
}

export { AsyncProcess, isRunning };
