export interface RepeatArguments {
    /**
     * Repeat function <count> times. If undefined function will be repeated infinitely or until time outs.
     */
    count?: number;
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
    message?: string;
    log?: boolean;
    id?: string;
}
/**
 * Repeat function until it returns truthy value.
 *
 * @param func function to repeat
 * @param options repeat options
 */
export declare function repeat<T>(func: (() => T | PromiseLike<T>), options?: RepeatArguments): Promise<T>;
