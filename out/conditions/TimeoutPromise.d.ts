export declare type Resolver<T> = (value: T | PromiseLike<T>) => void;
export declare type Rejecter = (reason?: any) => void;
declare type Executor<T> = (resolve: Resolver<T>, reject: Rejecter) => void;
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
/**
 * Error signaling timeout of assigned promise.
 */
export declare class TimeoutError extends Error {
    /**
     * Save index where next message can be inserted.
     */
    private messageIndex;
    /**
     * Owner object of this promise.
     * Used for timeout rejects raised
     * by children promises.
     */
    private owner;
    /**
     * Create new TimeoutError.
     * @param owner Owner of the error. Currently promises are identified by resolve functions.
     * @param message Base message to be shown.
     * @param callStack Call stack log to be included as part of the error.
     * @param id Promise debug identification. Arbitrary value for debugging purposes.
     */
    constructor(owner: object, message?: string, callStack?: string | object, id?: string);
    private setMessageIndex;
    /**
     * Check if some promise has thrown this error.
     * @param obj Resolve function of the promise.
     * @returns Boolean value according if the promise has thrown the error.
     */
    isThrownBy(obj: object): boolean;
    /**
     * Prepend additional call stack to current call stack.
     * @param callStack Call stack to be prepended.
     */
    prependCallStack(callStack: string | object): void;
    /**
     * Append error message to existing error message.
     * @param message Error message to be appended.
     */
    appendMessage(message: string): void;
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
declare class TimeoutPromise<T> extends Promise<T> {
    /**
     * Create new TimeoutPromise.
     * @param executor Executor functions resolve and reject known from promises.
     * @param timeout Timeout in ms.
     * @param options Additional {@link TimeoutPromiseOptions}.
     * @example
     * // Create new TimeoutPromise with Executor.
     * new TimeoutPromise((resolve) => resolve(5), 5000, {id: "Return 5", message: "Could not return 5."});
     */
    constructor(executor: Executor<T>, timeout?: number, options?: TimeoutPromiseOptions);
    /**
     * Decorate resolve and reject functions to clear timer. Reject is decorated to add call stack if it was reason of
     * TimeoutError.
     * @param resolver Either resolve or reject function.
     * @param timer NodeJS.Timeout object assigned to this promise.
     * @param resolve In this case resolve function is used as promise id.
     * @param callStack Additional information about call stack.
     * @returns Decorated resolve / reject function.
     */
    private static decorateResolver;
    private static create;
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
    static createFrom<T>(promise: Promise<T>, timeout?: number, options?: TimeoutPromiseOptions): TimeoutPromise<T>;
}
export { TimeoutPromise };
