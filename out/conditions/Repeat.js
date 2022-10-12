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
exports.repeat = void 0;
const TimeoutPromise_1 = require("./TimeoutPromise");
/**
 * Repeat function until it returns truthy value.
 *
 * @param func function to repeat
 * @param options repeat options
 */
function repeat(func, options) {
    return __awaiter(this, void 0, void 0, function* () {
        let { count, timeout } = options || { count: undefined, timeout: undefined };
        let run = true;
        let start = 0;
        let plannedTask = undefined;
        const id = (options === null || options === void 0 ? void 0 : options.id) || "anonymous";
        const threshold = (options === null || options === void 0 ? void 0 : options.threshold) || 0;
        const log = (options === null || options === void 0 ? void 0 : options.log) ? (message, loggerFunction = console.log) => {
            loggerFunction(`[${id}] ${message}`);
        } : () => { };
        if (count !== undefined && count <= 0) {
            throw new Error("Count must be larger than 0");
        }
        if (timeout === 0 && count === undefined) {
            count = 1;
            timeout = undefined;
        }
        function closure(cnt, resolve, reject, callStack) {
            return __awaiter(this, void 0, void 0, function* () {
                if (cnt !== undefined && cnt === 0) {
                    plannedTask = undefined;
                    reject(new TimeoutPromise_1.TimeoutError(`[${id}] Cannot repeat function more than ${count} times.\n${callStack}`));
                    return;
                }
                try {
                    const value = yield func();
                    if (value && ((start !== 0 && Date.now() - start >= threshold) || (threshold === 0))) {
                        plannedTask = undefined;
                        resolve(value);
                        log("Threshold reached");
                    }
                    else if (value) {
                        if (start === 0) {
                            start = Date.now();
                        }
                        log("Threshold not reached");
                        plannedTask = setImmediate(closure, cnt, resolve, reject);
                    }
                    else {
                        start = 0;
                        if (run) {
                            plannedTask = setImmediate(closure, cnt !== undefined ? cnt - 1 : undefined, resolve, reject);
                        }
                        else {
                            plannedTask = undefined;
                        }
                    }
                }
                catch (e) {
                    e.message += '\n' + callStack;
                    plannedTask = undefined;
                    reject(e);
                }
            });
        }
        // get call stack
        let callStack = undefined;
        try {
            throw new Error();
        }
        catch (e) {
            callStack = e.stack;
            callStack = callStack === null || callStack === void 0 ? void 0 : callStack.split('\n\t').join('\t\n');
        }
        return new TimeoutPromise_1.TimeoutPromise((resolve, reject) => {
            plannedTask = setImmediate(closure, count, resolve, reject, callStack);
        }, timeout, {
            onTimeout: () => {
                run = false;
                if (plannedTask) {
                    clearImmediate(plannedTask);
                    plannedTask = undefined;
                }
            },
            id: options === null || options === void 0 ? void 0 : options.id,
            message: options === null || options === void 0 ? void 0 : options.message,
            callStack
        });
    });
}
exports.repeat = repeat;
//# sourceMappingURL=Repeat.js.map