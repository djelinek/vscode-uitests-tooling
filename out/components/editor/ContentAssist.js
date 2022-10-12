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
exports.ContentAssist = void 0;
const vscode_extension_tester_1 = require("vscode-extension-tester");
const Repeat_1 = require("../../conditions/Repeat");
class ContentAssist extends vscode_extension_tester_1.ContentAssist {
    constructor(parent) {
        if (parent instanceof vscode_extension_tester_1.TextEditor) {
            super(parent);
        }
        else {
            super(parent.getEnclosingElement());
        }
    }
    getItem(label, timeout = 30000) {
        const _super = Object.create(null, {
            getItem: { get: () => super.getItem }
        });
        return __awaiter(this, void 0, void 0, function* () {
            return yield (0, Repeat_1.repeat)(() => _super.getItem.call(this, label), {
                timeout,
                message: `Could not find item with label "${label}".`
            });
        });
    }
    hasItem(label) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const item = yield this.getItem(label, 0);
                return yield item.isDisplayed();
            }
            catch (_a) {
                return false;
            }
        });
    }
}
exports.ContentAssist = ContentAssist;
//# sourceMappingURL=ContentAssist.js.map