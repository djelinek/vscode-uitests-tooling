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
exports.TextEditor = void 0;
const vscode_extension_tester_1 = require("vscode-extension-tester");
const __1 = require("../..");
class TextEditor extends vscode_extension_tester_1.TextEditor {
    constructor(view, base) {
        super(view, base);
    }
    toggleContentAssist(open) {
        const _super = Object.create(null, {
            toggleContentAssist: { get: () => super.toggleContentAssist }
        });
        return __awaiter(this, void 0, void 0, function* () {
            const menu = yield _super.toggleContentAssist.call(this, open);
            if (menu instanceof vscode_extension_tester_1.ContentAssist) {
                return new __1.ContentAssist(menu);
            }
        });
    }
}
exports.TextEditor = TextEditor;
//# sourceMappingURL=TextEditor.js.map