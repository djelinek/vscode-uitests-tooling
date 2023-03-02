import { errors } from '..';
import { ErrorType } from '../utils/Errors';
import { Rejecter, Resolver, TimeoutError, TimeoutPromise } from './TimeoutPromise';

type NonUndefined<T> = T extends undefined ? never : T;

export interface RepeatArguments {
	/**
	 * Errors to be ignored by the loop.
	 */
	ignoreErrors?: ErrorType[];

	/**
	 * Repeat timeout after promise is rejected. If undefined function will be repeated <count> times or infinitely.
	 */
	timeout?: number;

	/**
	 * Do not resolve repeat operation immediately. Wait until truthy value is returned consequently for <threshold> milliseconds.
	 */
	threshold?: number;

	/**
	 * Error message when repeat time outs.
	 */
	message?: string | (() => string | PromiseLike<string>);

	// Repeat identification. For log purposes.
	id?: string;

	/**
	 * In case of timeout = 0 and unsuccessful repeat operation the promise will be resolved
	 * to undefined instead of throwing RepeatUnsuccessfulException.
	 */
	ignoreLoopError?: boolean;
}

export enum LoopStatus {
	LOOP_DONE, LOOP_UNDONE
}

export type RepeatLoopResult<T> = {
	value?: T;
	loopStatus: LoopStatus;
	delay?: number;
};

export class RepeatError extends Error { }
export class RepeatExitError extends Error { }
export class RepeatUnsuccessfulException extends TimeoutError { }

export class Threshold {
	private start: number;
	private interval: number;
	private resetCounter: number;

	constructor(interval: number) {
		this.interval = interval;
		this.start = Date.now();
		this.resetCounter = 0;
	}

	reset(): void {
		this.start = Date.now();
		this.resetCounter++;
	}

	hasFinished(): boolean {
		return Date.now() - this.start >= this.interval;
	}


	public get resetCount(): number {
		return this.resetCounter;
	}
}

class RepeatManager {
	private _repeats: Map<string, Repeat<never>>;

	constructor() {
		this._repeats = new Map();
		process.on('exit', this.abortAll.bind(this));
	}

	public get size(): number {
		return this._repeats.size;
	}

	abortAll(): void {
		for (const [_, repeat] of this._repeats.entries()) {
			repeat.abort(undefined);
			this.remove(repeat);
		}
	}

	add(repeat: Repeat<never>): void {
		this._repeats.set(repeat.id, repeat);
	}

	has(repeat: Repeat<never>): boolean {
		return this._repeats.has(repeat.id);
	}

	remove(repeat: Repeat<never>): boolean {
		return this._repeats.delete(repeat.id);
	}
}

const FUNCTION_RESULT_KEYS = new Set<string>(['value', 'delay', 'loopStatus']);

/**
 * Repeat class was heavily inspired by Selenium WebDriver.wait method.
 * However it was not possible to use in [@theia-extension-tester/abstract-element](https://www.npmjs.com/package/@theia-extension-tester/abstract-element)
 * due to recursion problem when searching elements. By the time the functionality was
 * extended even further and the repeat function was prioritized more than driver.wait function.
 * Primarily to emulate [vscode-extension-tester](https://www.npmjs.com/package/vscode-extension-tester) behavior
 * timeout usage was changed. All about that and other features will be described further in next paragraphs.
 *
 * The Repeat class implements the same features as driver.wait but there are some key differences:
 *  1. Method behavior when timeout = 0 :: driver.wait uses infinity timeout instead / the Repeat class performs single iteration
 *  2. Method behavior when timeout = undefined :: The same behavior. Loop indefinitely.
 *  3. The Repeat class supports threshold timer. Timer which does not resolve promise immediately but checks
 *  returned value was truthful for duration of threshold time. Useful when some page object is laggy.
 *
 *  Single loop in the class is one execution of given function as argument. This behavior can be overridden
 *  by returning object in the given function. The object has the following format:
 *  ```ts
 *  {
 *      // Value to be checked and returned.
 *      value?: T;
 *      // Use one of these to mark loop end.
 *      // If given LOOP_DONE and timeout = 0 then the repeat returns the value.
 *      loopStatus: LoopStatus.LOOP_DONE | LoopStatus.LOOP_UNDONE
 *      // Delay next loop. Default is 0.
 *      delay?: number;
 *  }
 * ```
 *
 *  Support for delaying next iteration. Some operations requires multiple checks but the checks cannot be repeated rapidly
 *  in consecutive manner. This feature was for example used in TextEditor page object. Without delays Eclipse Che web sockets
 *  were failing. To see how to use delays please refer to example above.
 *
 * Verify Input page object does not have error message when given input.
 * This action is sometimes flaky and therefore repeat might be good for this situation.
 * @example
 * const input = await InputBox.create();
 * // Do not await on purpose of demonstration.
 * input.setText("hello@world.com");
 * // Verify email validation went through.
 * await repeat(async () => {
 *  try {
 *      // In case the input becomes stale.
 *      const in = await InputBox.create();
 *      return await in.hasError() === false;
 *      // or
 *      // return {
 *      //   value: await in.hasError() === false,
 *      //   loopStatus: LoopStatus.LOOP_DONE,
 *      //   delay: 150
 *      // };
 *  }
 *  catch (e) {
 *      return false;
 *  }
 * }, {
 *  timeout: 30000,
 *  message: "Email could not be successfully verified.",
 *  // Make sure the result is stable.
 *  threshold: 1000
 * })
 */
export class Repeat<T> {
	private static ID_GENERATOR = idGenerator();
	public static MANAGER: RepeatManager = new RepeatManager();
	public static DEFAULT_TIMEOUT: number | undefined = undefined;

	protected _timeout?: number;
	protected _id: string;
	protected threshold: Threshold;
	private _message?: string | (() => string | PromiseLike<string>);
	private clearTask?: () => void;
	private resolve!: Resolver<NonUndefined<T>>;
	private reject!: Rejecter;
	private _promise!: Promise<NonUndefined<T>>;
	private _run: boolean = false;
	private _hasStarted: boolean = false;
	private _finishedLoop: boolean = false;
	private _usingExplicitLoopSignaling: boolean = false;
	private _ignoreErrors: ErrorType[];

	constructor(protected func: (() => T | PromiseLike<T> | RepeatLoopResult<T> | PromiseLike<RepeatLoopResult<T>>), protected options?: RepeatArguments) {
		this._timeout = options?.timeout ?? Repeat.DEFAULT_TIMEOUT;
		this._id = options?.id ?? Repeat.ID_GENERATOR.next().value;
		this.threshold = new Threshold(options?.threshold ?? 0);
		this._message = options?.message;
		this._ignoreErrors = options?.ignoreErrors ?? [];
		this.loop = this.loop.bind(this);
		this.cleanup = this.cleanup.bind(this);
	}


	public get id(): string {
		return this._id;
	}

	/**
	 * Perform single loop of the task.
	 */
	protected async loop(): Promise<void> {
		// task has been started
		this.clearTask = undefined;

		if (this._run === false || process.exitCode !== undefined) {
			this.reject(new RepeatExitError(`Aborted task with id "${this._id}".`));
		}

		let delay = 0;
		try {
			const functionResult = await this.func();

			let value: T | undefined = undefined;

			// check if repeat object was returned
			if (functionResult !== undefined && functionResult !== null && Object.keys(functionResult).some((k) => FUNCTION_RESULT_KEYS.has(k))) {
				const status = functionResult as RepeatLoopResult<T>;
				delay = status.delay ?? 0;
				this._finishedLoop = this._finishedLoop || status.loopStatus === LoopStatus.LOOP_DONE;
				value = status.value;
			}
			else {
				value = functionResult as T;
			}

			if (value && this.threshold.hasFinished()) {
				this.resolve(value as NonUndefined<T>);
			}
			else if (value) {
				this.scheduleNextLoop(delay);
			}
			else {
				this.threshold.reset();
				if (this._run) {
					this.scheduleNextLoop(delay);
				}
			}
		}
		catch (e) {
			if (!errors.is(e, ...this._ignoreErrors)) {
				this.reject(e);
			}
			else {
				this.scheduleNextLoop();
			}
		}
	}

	/**
	 * Execute repeat task.
	 * @returns A task result.
	 */
	async execute(): Promise<NonUndefined<T>> {
		if (this._hasStarted) {
			throw new RepeatError('It is not possible to run Repeat task again. Create new instance.');
		}

		Repeat.MANAGER.add(this as unknown as Repeat<never>);
		this._hasStarted = true;
		try {
			this._promise = new Promise<NonUndefined<T>>((resolve, reject) => {
				this.resolve = resolve;
				this.reject = reject;
				this._run = true;
				process.nextTick(() => this.loop());
			});

			if (this._timeout !== 0) {
				this._promise = TimeoutPromise.createFrom(this._promise, this._timeout, {
					id: this._id,
					message: this._message
				});
			}

			return await this._promise;
		}
		finally {
			this.cleanup();
		}
	}

	/**
	 * Abort repeat task. This function does not return anything but it makes the repeat function
	 * return the given value.
	 * @param value
	 *  Error | undefined :: Abort task and make repeat function return rejected promise.
	 *  T :: Abort task but make repeat function return resolved promise with the given value.
	 */
	abort(value: Error | NonUndefined<T> | undefined): void {
		if (!this._hasStarted) {
			throw new RepeatError('Repeat has not been started.');
		}

		this._run = false;

		if (value === undefined) {
			this.reject(new RepeatError(`Aborted task with id"${this._id}".`));
		}
		else if (value instanceof Error) {
			this.reject(value);
		}
		else {
			this.resolve(value);
		}
	}

	/**
	 * Cleanup all timers and setImmediate handlers.
	 */
	protected cleanup(): void {
		this._run = false;
		Repeat.MANAGER.remove(this as unknown as Repeat<never>);
		if (this.clearTask) {
			this.clearTask();
			this.clearTask = undefined;
		}
	}

	/**
	 * Schedule next loop. If delay is set  then use setTimeout instead of setImmediate.
	 * @param delay Minimum time in ms until next iteration is executed.
	 */
	private scheduleNextLoop(delay: number = 0): void {
		if (this._timeout !== 0 || (this._usingExplicitLoopSignaling && !this._finishedLoop)) {
			if (delay === 0) {
				const handler = setImmediate(this.loop);
				this.clearTask = () => clearImmediate(handler);
			}
			else {
				const handler = setTimeout(this.loop, delay);
				this.clearTask = () => clearTimeout(handler);
			}
		}
		else if (this._usingExplicitLoopSignaling === false || this._finishedLoop) {
			if (this.options?.ignoreLoopError) {
				// @ts-expect-error
				// output will be ignored
				this.resolve(undefined);
			}
			else {
				this.reject(new RepeatUnsuccessfulException(this.resolve, 'Cannot iterate more than 1 times. Timeout is set to 0.', this._id));
			}
		}
		else {
			throw new RepeatError('Unexpected state.');
		}
	}
}

/**
 * Repeat function until it returns truthy value. For more information
 * please see {@link Repeat}.
 *
 * @param func function to repeat
 * @param options repeat options
 * @returns output value of the {@link func} function.
 */
export async function repeat<T>(func: (() => (T | PromiseLike<T> | RepeatLoopResult<T> | PromiseLike<RepeatLoopResult<T>>)), options?: RepeatArguments): Promise<NonUndefined<T>> {
	return await new Repeat(func, options).execute() as NonUndefined<T>;
}

function* idGenerator(): Generator<string, string, unknown> {
	let i = 1;
	while (true) {
		yield `Task #${i}`;
		i++;
	}
}

export { TimeoutError };
