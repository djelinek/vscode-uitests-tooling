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
exports.NotificationCenter = void 0;
const vscode_extension_tester_1 = require("vscode-extension-tester");
/**
 * @author jkopriva
 */
class NotificationCenter {
    clearNotifications() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const center = yield new vscode_extension_tester_1.Workbench().openNotificationsCenter();
                return yield center.clearAllNotifications();
            }
            catch (err) {
                console.log(err);
                return null;
            }
        });
    }
}
exports.NotificationCenter = NotificationCenter;
//# sourceMappingURL=NotificationCenter.js.map