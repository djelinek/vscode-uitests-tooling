export type Resolver<T> = (value: T | PromiseLike<T>) => void;
export type Rejecter = (reason?: any) => void;
type Executor<T> = (resolve: Resolver<T>, reject: Rejecter) => void;

export interface TimeoutPromiseOptions {
	/**
     * Message to be shown when promise is rejected due to timeout.
     */
	message?: string | (() => string | PromiseLike<string>);
	/**
     * Debug information when promise is rejected.
     */
	id?: string;
	/**
     * Include call stack information when promise is rejected.
     * This is primarily used in [@theia-extension-tester/repeat](https://www.npmjs.com/package/@theia-extension-tester/repeat)
     * because setImmediate and setTimeout do not preserve
     * caller call stack.
     */
	callStack?: any;
}

function captureStackTrace(limit: number = 50): any {
	const temp = Error.stackTraceLimit;
	try {
		Error.stackTraceLimit = limit;
		// get call stack
		let callStack: any = {};
		Error.captureStackTrace(callStack, captureStackTrace);
		return callStack.stack;
	}
	finally {
		Error.stackTraceLimit = temp;
	}
}

/**
 * Error signaling timeout of assigned promise.
 */
export class TimeoutError extends Error {
	/**
     * Save index where next message can be inserted.
     */
	private messageIndex!: number;

	/**
     * Owner object of this promise.
     * Used for timeout rejects raised
     * by children promises.
     */
	private owner: object;

	/**
     * Create new TimeoutError.
     * @param owner Owner of the error. Currently promises are identified by resolve functions.
     * @param message Base message to be shown.
     * @param callStack Call stack log to be included as part of the error.
     * @param id Promise debug identification. Arbitrary value for debugging purposes.
     */
	constructor(owner: object, message?: string, callStack?: string | object, id?: string) {
		if (message) {
			super(`Promise(id=${id}) ${message}\r\n\r\n${callStack}`);
		}
		else {
			super(`Promise(id=${id}) timed out after 1 cycle (zero timeout).\r\n\r\n$${callStack}`);
		}
		this.owner = owner;
		this.name = 'TimeoutError';
		this.setMessageIndex();
	}

	private setMessageIndex(): void {
		this.messageIndex = this.message.indexOf('\r\n\r\n') + '\r\n\r\n'.length;
	}

	/**
     * Check if some promise has thrown this error.
     * @param obj Resolve function of the promise.
     * @returns Boolean value according if the promise has thrown the error.
     */
	isThrownBy(obj: object): boolean {
		return this.owner === obj;
	}

	/**
     * Prepend additional call stack to current call stack.
     * @param callStack Call stack to be prepended.
     */
	prependCallStack(callStack: string | object): void {
		this.message = `${this.message.substring(0, this.messageIndex)}${callStack}${this.message.substring(this.messageIndex)}`;
	}

	/**
     * Append error message to existing error message.
     * @param message Error message to be appended.
     */
	appendMessage(message: string): void {
		const endMessageIndex = this.messageIndex - '\r\n\r\n'.length;
		this.message = `${this.message.substring(0, endMessageIndex)}${message}${this.message.substring(this.messageIndex)}`;
		this.setMessageIndex();
	}
}

/**
 * Class with single static method and a constructor to create new TimeoutPromise instance.
 * When timeout is reached, the promise is rejected with {@link TimeoutError}.
 *
 * @example
 * // Create new TimeoutPromise with Executor.
 * new TimeoutPromise((resolve) => resolve(5), 5000, {id: "Return 5", message: "Could not return 5."});
 * @example
 * // Crate new TimeoutPromise from existing promise.
 * TimeoutPromise.createFrom(returnFivePromise, 5000, {id: "Return 5", message: "Could not return 5."});
 */
class TimeoutPromise<T> extends Promise<T> {

	/**
     * Create new TimeoutPromise.
     * @param executor Executor functions resolve and reject known from promises.
     * @param timeout Timeout in ms.
     * @param options Additional {@link TimeoutPromiseOptions}.
     * @example
     * // Create new TimeoutPromise with Executor.
     * new TimeoutPromise((resolve) => resolve(5), 5000, {id: "Return 5", message: "Could not return 5."});
     */
	public constructor(executor: Executor<T>, timeout?: number, options?: TimeoutPromiseOptions) {
		super(TimeoutPromise.create(executor, timeout, options));
	}

	/**
     * Decorate resolve and reject functions to clear timer. Reject is decorated to add call stack if it was reason of
     * TimeoutError.
     * @param resolver Either resolve or reject function.
     * @param timer NodeJS.Timeout object assigned to this promise.
     * @param resolve In this case resolve function is used as promise id.
     * @param callStack Additional information about call stack.
     * @returns Decorated resolve / reject function.
     */
	private static decorateResolver<T>(resolver: Resolver<T> | Rejecter, timer: NodeJS.Timeout | null, resolve?: Resolver<T>, callStack?: any): Resolver<T> {
		return (value: T | PromiseLike<T>) => {
			if (timer) {
				clearTimeout(timer);
			}

			// in case of reject prepend additional call stack
			if (resolve && (value instanceof TimeoutError) && !value.isThrownBy(resolve)) {
				value.prependCallStack(callStack);
			}

			resolver(value);
		};
	}

	private static create<T>(executor: Executor<T>, timeout?: number, options?: TimeoutPromiseOptions): Executor<T> {
		// get call stack
		const callStack = options?.callStack ?? captureStackTrace();

		return async (resolve: (value: T | PromiseLike<T>) => void,
			reject: (reason?: any) => void) => {

			let timer: NodeJS.Timeout | null = null;
			const id = options?.id || "anonymous";

			if (typeof timeout === 'number' && timeout < 0) {
				throw new Error('Timeout cannot be negative.');
			}

			if (timeout !== undefined) {
				const start = Date.now();

				timer = setTimeout(async () => {
					let message = `Promise(id=${id}) timed out after ${Date.now() - start}ms.`;
					if (options?.message) {
						message += ` Reason: ${options.message instanceof Function ? await options.message() : options.message}`;
					}

					reject(new TimeoutError(resolve, message, callStack, id));
				}, timeout);
			}

			resolve = this.decorateResolver(resolve, timer);
			reject = this.decorateResolver(reject, timer, resolve, callStack);

			try {
				executor(resolve, reject);
			}
			catch (e) {
				reject(e);
			}
		};
	}

	/**
     * Create new TimeoutPromise from existing promise.
     * @param promise Existing promise to be wrapped.
     * @param timeout Timeout in ms.
     * @param options Additional information about call stack.
     * @returns New TimeoutPromise.
     * @example
     * // Crate new TimeoutPromise from existing promise.
     * TimeoutPromise.createFrom(returnFivePromise, 5000, {id: "Return 5", message: "Could not return 5."});
     */
	static createFrom<T>(promise: Promise<T>, timeout?: number, options?: TimeoutPromiseOptions): TimeoutPromise<T> {
		return new TimeoutPromise<T>((resolve, reject) => {
			promise.then(resolve);
			promise.catch(reject);
		}, timeout, options);
	}
}

export { TimeoutPromise };
