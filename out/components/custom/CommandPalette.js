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
exports.CommandPalette = void 0;
const vscode_extension_tester_1 = require("vscode-extension-tester");
/**
 * Represents command palette element in vscode
 * @author Marian Lorinc <mlorinc@redhat.com>
 */
class CommandPalette extends vscode_extension_tester_1.QuickOpenBox {
    constructor() {
        super();
    }
    /**
     * Executes command in command palette
     * @param command command to be executed
     */
    executeCommand(command) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.setText(command.startsWith(">") ? command : ">" + command);
            yield this.confirm();
        });
    }
    /**
     * Opens command palette
     * @returns promise which resolves to command palette object
     */
    static open() {
        return __awaiter(this, void 0, void 0, function* () {
            const titleBar = new vscode_extension_tester_1.TitleBar();
            yield titleBar.select("View", "Command Palette...");
            return new CommandPalette().wait();
        });
    }
    static getInstance() {
        return __awaiter(this, void 0, void 0, function* () {
            return new CommandPalette().wait();
        });
    }
}
exports.CommandPalette = CommandPalette;
//# sourceMappingURL=CommandPalette.js.map