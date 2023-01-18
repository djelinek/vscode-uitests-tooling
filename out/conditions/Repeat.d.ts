import { TimeoutError } from './TimeoutPromise';
export interface RepeatArguments {
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
    id?: string;
    /**
     * In case of timeout = 0 and unsuccessful repeat operation the promise will be resolved
     * to undefined instead of throwing RepeatUnsuccessfulException.
     */
    ignoreLoopError?: boolean;
}
export declare class Threshold {
    private start;
    private interval;
    private resetCounter;
    constructor(interval: number);
    reset(): void;
    hasFinished(): boolean;
    get resetCount(): number;
}
export declare enum LoopStatus {
    LOOP_DONE = 0,
    LOOP_UNDONE = 1
}
export declare type RepeatLoopResult<T> = {
    value?: T;
    loopStatus: LoopStatus;
    delay?: number;
};
export declare class RepeatError extends Error {
}
export declare class RepeatExitError extends Error {
}
export declare class RepeatUnsuccessfulException extends TimeoutError {
}
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
export declare class Repeat<T> {
    protected func: (() => T | PromiseLike<T> | RepeatLoopResult<T> | PromiseLike<RepeatLoopResult<T>>);
    protected options?: RepeatArguments | undefined;
    protected timeout?: number;
    protected id: string;
    protected threshold: Threshold;
    private message?;
    private clearTask?;
    private resolve;
    private reject;
    private promise;
    private run;
    private hasStarted;
    private finishedLoop;
    private usingExplicitLoopSignaling;
    constructor(func: (() => T | PromiseLike<T> | RepeatLoopResult<T> | PromiseLike<RepeatLoopResult<T>>), options?: RepeatArguments | undefined);
    /**
     * Perform single loop of the task.
     */
    protected loop(): Promise<void>;
    /**
     * Execute repeat task.
     * @returns A task result.
     */
    execute(): Promise<T>;
    /**
     * Abort repeat task. This function does not return anything but it makes the repeat function
     * return the given value.
     * @param value
     *  Error | undefined :: Abort task and make repeat function return rejected promise.
     *  T :: Abort task but make repeat function return resolved promise with the given value.
     */
    abort(value: Error | T | undefined): void;
    /**
     * Cleanup all timers and setImmediate handlers.
     */
    protected cleanup(): void;
    /**
     * Schedule next loop. If delay is set  then use setTimeout instead of setImmediate.
     * @param delay Minimum time in ms until next iteration is executed.
     */
    private scheduleNextLoop;
}
/**
 * Repeat function until it returns truthy value. For more information
 * please see {@link Repeat}.
 *
 * @param func function to repeat
 * @param options repeat options
 * @returns output value of the {@link func} function.
 */
export declare function repeat<T>(func: (() => T | PromiseLike<T> | RepeatLoopResult<T> | PromiseLike<RepeatLoopResult<T>>), options?: RepeatArguments): Promise<T>;
export { TimeoutError };
