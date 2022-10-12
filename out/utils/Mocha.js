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
exports.after = exports.before = void 0;
const mocha_1 = require("mocha");
const vscode_extension_tester_1 = require("vscode-extension-tester");
const sanitize = require("sanitize-filename");
function mochaHandler(name, fn) {
    return function () {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            try {
                const done = (err) => {
                    if (err) {
                        throw err;
                    }
                    resolve();
                };
                yield (fn === null || fn === void 0 ? void 0 : fn.call(this, done));
                resolve();
            }
            catch (error) {
                yield vscode_extension_tester_1.VSBrowser.instance.takeScreenshot(sanitize(name));
                reject(error);
            }
        }));
    };
}
;
function before(name, fn) {
    (0, mocha_1.before)(name, mochaHandler(name, fn));
}
exports.before = before;
function after(name, fn) {
    (0, mocha_1.after)(name, mochaHandler(name, fn));
}
exports.after = after;
//# sourceMappingURL=Mocha.js.map