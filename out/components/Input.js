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
exports.Input = void 0;
const vscode_extension_tester_1 = require("vscode-extension-tester");
const chai_1 = require("chai");
class Input {
    constructor(_input) {
        this._input = _input;
    }
    /**
    * Get current text of the input field
    * @returns Promise resolving to text of the input field
    */
    getText() {
        return __awaiter(this, void 0, void 0, function* () {
            return this._input.getText();
        });
    }
    /**
     * Set (by selecting all and typing) text in the input field
     * @param text text to set into the input field
     * @returns Promise resolving when the text is typed in
     */
    setText(text) {
        return __awaiter(this, void 0, void 0, function* () {
            return this._input.setText(text);
        });
    }
    /**
     * Get the placeholder text for the input field
     * @returns Promise resolving to input placeholder
     */
    getPlaceHolder() {
        return __awaiter(this, void 0, void 0, function* () {
            return this._input.getPlaceHolder();
        });
    }
    /**
     * Confirm the input field by pressing Enter
     * @returns Promise resolving when the input is confirmed
     */
    confirm() {
        return __awaiter(this, void 0, void 0, function* () {
            return this._input.confirm();
        });
    }
    /**
     * Cancel the input field by pressing Escape
     * @returns Promise resolving when the input is cancelled
     */
    cancel() {
        return __awaiter(this, void 0, void 0, function* () {
            return this._input.cancel();
        });
    }
    /**
     * Select (click) a quick pick option.
     * Search for the item can be done by its text, or index in the quick pick menu.
     * Note that scrolling does not affect the item's index, but it will
     * replace some items in the DOM (thus they become unreachable)
     *
     * @param indexOrText index (number) or text (string) of the item to search by
     * @returns Promise resolving when the given quick pick is selected
     */
    selectQuickPick(indexOrText) {
        return __awaiter(this, void 0, void 0, function* () {
            return this._input.selectQuickPick(indexOrText);
        });
    }
    /**
     * Find whether the input box has an active progress bar
     * @returns Promise resolving to true/false
     */
    hasProgress() {
        return this._input.hasProgress();
    }
    /**
     * Retrieve the quick pick items currently available in the DOM
     * (visible in the quick pick menu)
     * @returns Promise resolving to array of QuickPickItem objects
     */
    getQuickPicks() {
        return this._input.getQuickPicks();
    }
    // InputBox only methods
    /**
     * Get the message below the input field
     */
    getMessage() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this._input instanceof vscode_extension_tester_1.InputBox) {
                return this._input.getMessage();
            }
            else {
                throw new Error("Input field is not type of InputBox. It is probable QuickOpenBox");
            }
        });
    }
    /**
     * Find whether the input is showing an error
     * @returns Promise resolving to notification message
     */
    hasError() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this._input instanceof vscode_extension_tester_1.InputBox) {
                return this._input.hasError();
            }
            else {
                throw new Error("Input field is not type of InputBox. It is probable QuickOpenBox");
            }
        });
    }
    /**
     * Check if the input field is masked (input type password)
     * @returns Promise resolving to notification message
     */
    isPassword() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this._input instanceof vscode_extension_tester_1.InputBox) {
                return this._input.isPassword();
            }
            else {
                throw new Error("Input field is not type of InputBox. It is probable QuickOpenBox");
            }
        });
    }
    /**
     * Tests Input element properties.
     * @param testProperties properties to be tested
     */
    test(testProperties) {
        return __awaiter(this, void 0, void 0, function* () {
            if (testProperties.hasProgress !== undefined) {
                (0, chai_1.expect)(yield this.hasProgress()).to.equal(testProperties.hasProgress);
            }
            if (testProperties.isPassword !== undefined) {
                (0, chai_1.expect)(yield this.isPassword()).to.equal(testProperties.isPassword);
            }
            if (testProperties.message !== undefined) {
                (0, chai_1.expect)(yield this.getMessage()).to.equal(testProperties.message);
            }
            if (testProperties.placeholder !== undefined) {
                (0, chai_1.expect)(yield this.getPlaceHolder()).to.equal(testProperties.placeholder);
            }
            if (testProperties.quickPicks !== undefined) {
                const quickPicks = yield this.getQuickPicks();
                const quickPickTexts = new Set(yield Promise.all(quickPicks.map(pick => pick.getText())));
                (0, chai_1.expect)(quickPickTexts).to.have.keys(testProperties.quickPicks);
            }
            if (testProperties.text !== undefined) {
                (0, chai_1.expect)(yield this.getText()).to.equal(testProperties.text);
            }
        });
    }
    static getInstance(timeout) {
        return __awaiter(this, void 0, void 0, function* () {
            let input;
            try {
                input = yield new vscode_extension_tester_1.InputBox().wait(timeout);
            }
            catch (e) {
                input = yield new vscode_extension_tester_1.QuickOpenBox().wait(timeout);
            }
            return new Input(input);
        });
    }
}
exports.Input = Input;
//# sourceMappingURL=Input.js.map