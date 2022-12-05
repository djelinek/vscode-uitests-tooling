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
exports.OutputView = void 0;
const vscode_extension_tester_1 = require("vscode-extension-tester");
/**
 * Similar object to vscode-extension-tester but with more functionality
 */
class OutputView extends vscode_extension_tester_1.OutputView {
    /**
     * Creates new object but does not open OutputView
     */
    constructor(panel = new vscode_extension_tester_1.BottomBarPanel()) {
        super(panel);
    }
    waitUntilContainsText(text, timeout) {
        return __awaiter(this, void 0, void 0, function* () {
            let contains = false;
            yield this.getDriver()
                .wait(() => __awaiter(this, void 0, void 0, function* () {
                const outputText = yield this.getText();
                return outputText.includes(text);
            }), timeout)
                .then(() => contains = true)
                .catch(() => contains = false);
            return contains;
        });
    }
    static open() {
        return __awaiter(this, void 0, void 0, function* () {
            const panel = new vscode_extension_tester_1.BottomBarPanel();
            yield panel.toggle(true);
            yield panel.openOutputView();
            return new OutputView(panel);
        });
    }
    static getInstance() {
        return new OutputView();
    }
}
exports.OutputView = OutputView;
//# sourceMappingURL=OutputView.js.map