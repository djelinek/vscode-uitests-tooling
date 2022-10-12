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
exports.StatusBarExt = void 0;
const vscode_extension_tester_1 = require("vscode-extension-tester");
/**
 * Page object for the status bar at the bottom
 * @author Dominik Jelinek <djelinek@redhat.com>
 */
class StatusBarExt extends vscode_extension_tester_1.StatusBar {
    constructor() {
        super(...arguments);
        this.LSP_BAR_ID = 'redhat.vscode-apache-camel';
    }
    /**
     * Get the name of Apache Camel LSP Status Bar item as text
     * Only works with an open editor
     */
    getItemByID(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield new vscode_extension_tester_1.StatusBar().findElement(vscode_extension_tester_1.By.id(id)).getText();
        });
    }
    /**
     * Get the name of Apache Camel LSP Status Bar item as text
     * Only works with an open editor
     */
    getLSPSupport() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield new vscode_extension_tester_1.StatusBar().findElement(vscode_extension_tester_1.By.id(this.LSP_BAR_ID)).getText();
        });
    }
}
exports.StatusBarExt = StatusBarExt;
//# sourceMappingURL=StatusBarExt.js.map