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
exports.InputBoxOpenDialog = void 0;
const clipboardy = require("clipboardy");
const path = require("path");
const vscode_extension_tester_1 = require("vscode-extension-tester");
const Repeat_1 = require("../../conditions/Repeat");
class InputBoxOpenDialog extends vscode_extension_tester_1.InputBox {
    selectPath(filePath, timeout = 15000) {
        return __awaiter(this, void 0, void 0, function* () {
            if (path.isAbsolute(filePath) === false) {
                throw new Error(`Open dialog path must be absolute. Got: "${filePath}".`);
            }
            yield this.wait(timeout);
            let oldClipboard;
            try {
                oldClipboard = clipboardy.readSync();
            }
            catch (e) {
                console.warn(e.message);
            }
            try {
                yield (0, Repeat_1.repeat)(() => __awaiter(this, void 0, void 0, function* () {
                    if ((yield this.getText()) === filePath) {
                        return true;
                    }
                    clipboardy.writeSync(filePath);
                    yield this.sendKeys(vscode_extension_tester_1.Key.chord(vscode_extension_tester_1.Key.SHIFT, vscode_extension_tester_1.Key.HOME), vscode_extension_tester_1.Key.chord(InputBoxOpenDialog.ctlKey, 'v'));
                    return false;
                }), {
                    timeout,
                    message: `Could not set path to open: "${filePath}".`,
                    threshold: 750
                });
            }
            finally {
                if (oldClipboard) {
                    clipboardy.writeSync(oldClipboard);
                }
            }
        });
    }
    confirm(timeout = 15000) {
        const _super = Object.create(null, {
            confirm: { get: () => super.confirm }
        });
        return __awaiter(this, void 0, void 0, function* () {
            yield this.wait(timeout);
            const originalText = yield this.getText();
            yield this.getDriver().wait(() => __awaiter(this, void 0, void 0, function* () {
                try {
                    const displayed = yield this.isDisplayed().catch(() => false);
                    const text = displayed ? yield this.getText() : undefined;
                    if (displayed === false || text !== originalText) {
                        return true;
                    }
                    yield _super.confirm.call(this);
                    return false;
                }
                catch (_a) {
                    // ignore
                    return false;
                }
            }), timeout, 'Could not confirm dialog.');
        });
    }
    cancel(timeout = 15000) {
        const _super = Object.create(null, {
            cancel: { get: () => super.cancel }
        });
        return __awaiter(this, void 0, void 0, function* () {
            yield this.wait(timeout);
            yield this.getDriver().wait(() => __awaiter(this, void 0, void 0, function* () {
                try {
                    const displayed = yield this.isDisplayed().catch(() => false);
                    if (displayed === false) {
                        return true;
                    }
                    yield _super.cancel.call(this);
                    return false;
                }
                catch (_a) {
                    // ignore
                    return false;
                }
            }), timeout, 'Could not cancel dialog.');
        });
    }
}
exports.InputBoxOpenDialog = InputBoxOpenDialog;
//# sourceMappingURL=InputBoxOpenDialogs.js.map