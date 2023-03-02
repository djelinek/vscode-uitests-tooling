"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.is = exports.INTERACTIVITY_ERRORS = void 0;
const vscode_extension_tester_1 = require("vscode-extension-tester");
/**
 * List of errors that are usually responsible for WebElement interactivity flakyness.
 */
exports.INTERACTIVITY_ERRORS = [vscode_extension_tester_1.error.StaleElementReferenceError, vscode_extension_tester_1.error.NoSuchElementError, vscode_extension_tester_1.error.ElementNotInteractableError];
/**
 * Check whether thrown error is in the list.
 * @param e thrown error
 * @param errors errors to be checked
 * @returns true if e is in error list, otherwise false
 */
function is(e, ...errors) {
    return errors.find((err) => e instanceof err) !== undefined;
}
exports.is = is;
//# sourceMappingURL=Errors.js.map