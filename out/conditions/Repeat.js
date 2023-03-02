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
exports.TimeoutError = exports.repeat = exports.Repeat = exports.Threshold = exports.RepeatUnsuccessfulException = exports.RepeatExitError = exports.RepeatError = exports.LoopStatus = void 0;
const __1 = require("..");
const TimeoutPromise_1 = require("./TimeoutPromise");
Object.defineProperty(exports, "TimeoutError", { enumerable: true, get: function () { return TimeoutPromise_1.TimeoutError; } });
var LoopStatus;
(function (LoopStatus) {
    LoopStatus[LoopStatus["LOOP_DONE"] = 0] = "LOOP_DONE";
    LoopStatus[LoopStatus["LOOP_UNDONE"] = 1] = "LOOP_UNDONE";
})(LoopStatus = exports.LoopStatus || (exports.LoopStatus = {}));
class RepeatError extends Error {
}
exports.RepeatError = RepeatError;
class RepeatExitError extends Error {
}
exports.RepeatExitError = RepeatExitError;
class RepeatUnsuccessfulException extends TimeoutPromise_1.TimeoutError {
}
exports.RepeatUnsuccessfulException = RepeatUnsuccessfulException;
class Threshold {
    constructor(interval) {
        this.interval = interval;
        this.start = Date.now();
        this.resetCounter = 0;
    }
    reset() {
        this.start = Date.now();
        this.resetCounter++;
    }
    hasFinished() {
        return Date.now() - this.start >= this.interval;
    }
    get resetCount() {
        return this.resetCounter;
    }
}
exports.Threshold = Threshold;
class RepeatManager {
    constructor() {
        this._repeats = new Map();
        process.on('exit', this.abortAll.bind(this));
    }
    get size() {
        return this._repeats.size;
    }
    abortAll() {
        for (const [_, repeat] of this._repeats.entries()) {
            repeat.abort(undefined);
            this.remove(repeat);
        }
    }
    add(repeat) {
        this._repeats.set(repeat.id, repeat);
    }
    has(repeat) {
        return this._repeats.has(repeat.id);
    }
    remove(repeat) {
        return this._repeats.delete(repeat.id);
    }
}
const FUNCTION_RESULT_KEYS = new Set(['value', 'delay', 'loopStatus']);
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
class Repeat {
    constructor(func, options) {
        var _a, _b, _c, _d;
        this.func = func;
        this.options = options;
        this._run = false;
        this._hasStarted = false;
        this._finishedLoop = false;
        this._usingExplicitLoopSignaling = false;
        this._timeout = (_a = options === null || options === void 0 ? void 0 : options.timeout) !== null && _a !== void 0 ? _a : Repeat.DEFAULT_TIMEOUT;
        this._id = (_b = options === null || options === void 0 ? void 0 : options.id) !== null && _b !== void 0 ? _b : Repeat.ID_GENERATOR.next().value;
        this.threshold = new Threshold((_c = options === null || options === void 0 ? void 0 : options.threshold) !== null && _c !== void 0 ? _c : 0);
        this._message = options === null || options === void 0 ? void 0 : options.message;
        this._ignoreErrors = (_d = options === null || options === void 0 ? void 0 : options.ignoreErrors) !== null && _d !== void 0 ? _d : [];
        this.loop = this.loop.bind(this);
        this.cleanup = this.cleanup.bind(this);
    }
    get id() {
        return this._id;
    }
    /**
     * Perform single loop of the task.
     */
    loop() {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            // task has been started
            this.clearTask = undefined;
            if (this._run === false || process.exitCode !== undefined) {
                this.reject(new RepeatExitError(`Aborted task with id "${this._id}".`));
            }
            let delay = 0;
            try {
                const functionResult = yield this.func();
                let value = undefined;
                // check if repeat object was returned
                if (functionResult !== undefined && functionResult !== null && Object.keys(functionResult).some((k) => FUNCTION_RESULT_KEYS.has(k))) {
                    const status = functionResult;
                    delay = (_a = status.delay) !== null && _a !== void 0 ? _a : 0;
                    this._finishedLoop = this._finishedLoop || status.loopStatus === LoopStatus.LOOP_DONE;
                    value = status.value;
                }
                else {
                    value = functionResult;
                }
                if (value && this.threshold.hasFinished()) {
                    this.resolve(value);
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
                if (!__1.errors.is(e, ...this._ignoreErrors)) {
                    this.reject(e);
                }
                else {
                    this.scheduleNextLoop();
                }
            }
        });
    }
    /**
     * Execute repeat task.
     * @returns A task result.
     */
    execute() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this._hasStarted) {
                throw new RepeatError('It is not possible to run Repeat task again. Create new instance.');
            }
            Repeat.MANAGER.add(this);
            this._hasStarted = true;
            try {
                this._promise = new Promise((resolve, reject) => {
                    this.resolve = resolve;
                    this.reject = reject;
                    this._run = true;
                    process.nextTick(() => this.loop());
                });
                if (this._timeout !== 0) {
                    this._promise = TimeoutPromise_1.TimeoutPromise.createFrom(this._promise, this._timeout, {
                        id: this._id,
                        message: this._message
                    });
                }
                return yield this._promise;
            }
            finally {
                this.cleanup();
            }
        });
    }
    /**
     * Abort repeat task. This function does not return anything but it makes the repeat function
     * return the given value.
     * @param value
     *  Error | undefined :: Abort task and make repeat function return rejected promise.
     *  T :: Abort task but make repeat function return resolved promise with the given value.
     */
    abort(value) {
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
    cleanup() {
        this._run = false;
        Repeat.MANAGER.remove(this);
        if (this.clearTask) {
            this.clearTask();
            this.clearTask = undefined;
        }
    }
    /**
     * Schedule next loop. If delay is set  then use setTimeout instead of setImmediate.
     * @param delay Minimum time in ms until next iteration is executed.
     */
    scheduleNextLoop(delay = 0) {
        var _a;
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
            if ((_a = this.options) === null || _a === void 0 ? void 0 : _a.ignoreLoopError) {
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
exports.Repeat = Repeat;
Repeat.ID_GENERATOR = idGenerator();
Repeat.MANAGER = new RepeatManager();
Repeat.DEFAULT_TIMEOUT = undefined;
/**
 * Repeat function until it returns truthy value. For more information
 * please see {@link Repeat}.
 *
 * @param func function to repeat
 * @param options repeat options
 * @returns output value of the {@link func} function.
 */
function repeat(func, options) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield new Repeat(func, options).execute();
    });
}
exports.repeat = repeat;
function* idGenerator() {
    let i = 1;
    while (true) {
        yield `Task #${i}`;
        i++;
    }
}
//# sourceMappingURL=Repeat.js.map