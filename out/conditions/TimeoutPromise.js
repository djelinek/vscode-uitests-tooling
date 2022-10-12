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
/**
 * Error representing timed out promise.
 */
class TimeoutError extends Error {
    constructor(message, callStack, id) {
        if (message) {
            super(message + `\n${callStack}`);
        }
        else {
            super(`Promise(id=${id}) timed out after 1 cycle (zero timeout).\n${callStack}`);
        }
        this.name = 'TimeoutError';
    }
}
exports.TimeoutError = TimeoutError;
/**
 * Object representing promise with timeout.
 */
class TimeoutPromise extends Promise {
    /**
     *
     * @param executor promise executor (resolve, reject) => ...;
     * @param timeout promise timeout. If timeout value is zero or undefined, timeout is infinite.
     * @param options promise options
     */
    constructor(executor, timeout, options) {
        super(TimeoutPromise.create(executor, timeout, options));
    }
    static decorateResolver(resolver, timer) {
        return (value) => {
            if (timer) {
                clearTimeout(timer);
            }
            resolver(value);
        };
    }
    static create(executor, timeout, options) {
        return (resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            let timer = null;
            const id = (options === null || options === void 0 ? void 0 : options.id) || "anonymous";
            if (typeof timeout === 'number' && timeout < 0) {
                throw new Error('Timeout cannot be negative.');
            }
            if (timeout !== undefined && timeout !== 0) {
                const start = Date.now();
                // get call stack
                let callStack = options === null || options === void 0 ? void 0 : options.callStack;
                try {
                    if (callStack === undefined) {
                        throw new Error();
                    }
                }
                catch (e) {
                    callStack = e.stack;
                    callStack = callStack === null || callStack === void 0 ? void 0 : callStack.split('\n\t').join('\t\n');
                }
                timer = setTimeout(() => {
                    let message = `Promise(id=${id}) timed out after ${Date.now() - start}ms.`;
                    if (options === null || options === void 0 ? void 0 : options.message) {
                        message += ` Reason: ${options.message}`;
                    }
                    reject(new TimeoutError(message, callStack, id));
                    if (options === null || options === void 0 ? void 0 : options.onTimeout) {
                        options === null || options === void 0 ? void 0 : options.onTimeout();
                    }
                }, timeout);
            }
            resolve = this.decorateResolver(resolve, timer);
            reject = this.decorateResolver(reject, timer);
            try {
                executor(resolve, reject);
            }
            catch (e) {
                reject(e);
            }
        });
    }
}
exports.TimeoutPromise = TimeoutPromise;
//# sourceMappingURL=TimeoutPromise.js.map