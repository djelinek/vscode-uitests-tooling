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
exports.TimeoutPromise = exports.TimeoutError = void 0;
function captureStackTrace(limit = 50) {
    const temp = Error.stackTraceLimit;
    try {
        Error.stackTraceLimit = limit;
        // get call stack
        let callStack = {};
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
class TimeoutError extends Error {
    /**
     * Create new TimeoutError.
     * @param owner Owner of the error. Currently promises are identified by resolve functions.
     * @param message Base message to be shown.
     * @param callStack Call stack log to be included as part of the error.
     * @param id Promise debug identification. Arbitrary value for debugging purposes.
     */
    constructor(owner, message, callStack, id) {
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
    setMessageIndex() {
        this.messageIndex = this.message.indexOf('\r\n\r\n') + '\r\n\r\n'.length;
    }
    /**
     * Check if some promise has thrown this error.
     * @param obj Resolve function of the promise.
     * @returns Boolean value according if the promise has thrown the error.
     */
    isThrownBy(obj) {
        return this.owner === obj;
    }
    /**
     * Prepend additional call stack to current call stack.
     * @param callStack Call stack to be prepended.
     */
    prependCallStack(callStack) {
        this.message = `${this.message.substring(0, this.messageIndex)}${callStack}${this.message.substring(this.messageIndex)}`;
    }
    /**
     * Append error message to existing error message.
     * @param message Error message to be appended.
     */
    appendMessage(message) {
        const endMessageIndex = this.messageIndex - '\r\n\r\n'.length;
        this.message = `${this.message.substring(0, endMessageIndex)}${message}${this.message.substring(this.messageIndex)}`;
        this.setMessageIndex();
    }
}
exports.TimeoutError = TimeoutError;
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
class TimeoutPromise extends Promise {
    /**
     * Create new TimeoutPromise.
     * @param executor Executor functions resolve and reject known from promises.
     * @param timeout Timeout in ms.
     * @param options Additional {@link TimeoutPromiseOptions}.
     * @example
     * // Create new TimeoutPromise with Executor.
     * new TimeoutPromise((resolve) => resolve(5), 5000, {id: "Return 5", message: "Could not return 5."});
     */
    constructor(executor, timeout, options) {
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
    static decorateResolver(resolver, timer, resolve, callStack) {
        return (value) => {
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
    static create(executor, timeout, options) {
        var _a;
        // get call stack
        const callStack = (_a = options === null || options === void 0 ? void 0 : options.callStack) !== null && _a !== void 0 ? _a : captureStackTrace();
        return (resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            let timer = null;
            const id = (options === null || options === void 0 ? void 0 : options.id) || "anonymous";
            if (typeof timeout === 'number' && timeout < 0) {
                throw new Error('Timeout cannot be negative.');
            }
            if (timeout !== undefined) {
                const start = Date.now();
                timer = setTimeout(() => __awaiter(this, void 0, void 0, function* () {
                    let message = `Promise(id=${id}) timed out after ${Date.now() - start}ms.`;
                    if (options === null || options === void 0 ? void 0 : options.message) {
                        message += ` Reason: ${options.message instanceof Function ? yield options.message() : options.message}`;
                    }
                    reject(new TimeoutError(resolve, message, callStack, id));
                }), timeout);
            }
            resolve = this.decorateResolver(resolve, timer);
            reject = this.decorateResolver(reject, timer, resolve, callStack);
            try {
                executor(resolve, reject);
            }
            catch (e) {
                reject(e);
            }
        });
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
    static createFrom(promise, timeout, options) {
        return new TimeoutPromise((resolve, reject) => {
            promise.then(resolve);
            promise.catch(reject);
        }, timeout, options);
    }
}
exports.TimeoutPromise = TimeoutPromise;
//# sourceMappingURL=TimeoutPromise.js.map