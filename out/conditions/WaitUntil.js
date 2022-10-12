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
exports.WaitUntil = void 0;
const vscode_extension_tester_1 = require("vscode-extension-tester");
/**
 * Class containing wait until conditions
 * @author Dominik Jelinek <djelinek@redhat.com>
 */
class WaitUntil {
    constructor() {
        this.driver = vscode_extension_tester_1.VSBrowser.instance.driver;
    }
    /**
     * Waits until invoked Content Assistant has items
     * @param contentAssistant ContentAssist obj
     * @param timePeriod Timeout in ms
     */
    assistHasItems(contentAssistant, timePeriod) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.driver.wait(function () {
                return __awaiter(this, void 0, void 0, function* () {
                    const items = yield contentAssistant.getItems();
                    if (items.length > 0) {
                        return true;
                    }
                    return false;
                });
            }, timePeriod);
        });
    }
}
exports.WaitUntil = WaitUntil;
//# sourceMappingURL=WaitUntil.js.map