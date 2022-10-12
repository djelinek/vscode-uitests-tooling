export declare type Resolver<T> = (value: T | PromiseLike<T>) => void;
export declare type Rejecter = (reason?: any) => void;
declare type Executor<T> = (resolve: Resolver<T>, reject: Rejecter) => void;
export interface TimeoutPromiseOptions {
    onTimeout?: () => any;
    /**
     * Message which is shown when promise time outs.
     */
    message?: string;
    /**
     * Promise id. Used for identification in logs.
     */
    id?: string;
    /**
     * JavaScript call stack. The call stack will be attached to error message
     * which does not show actual call stack.
     */
    callStack?: string;
}
/**
 * Error representing timed out promise.
 */
export declare class TimeoutError extends Error {
    constructor(message?: string, callStack?: string, id?: string);
}
/**
 * Object representing promise with timeout.
 */
declare class TimeoutPromise<T> extends Promise<T> {
    /**
     *
     * @param executor promise executor (resolve, reject) => ...;
     * @param timeout promise timeout. If timeout value is zero or undefined, timeout is infinite.
     * @param options promise options
     */
    constructor(executor: Executor<T>, timeout?: number, options?: TimeoutPromiseOptions);
    private static decorateResolver;
    private static create;
}
export { TimeoutPromise };
