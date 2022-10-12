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
exports.NotificationWait = void 0;
const vscode_extension_tester_1 = require("vscode-extension-tester");
/**
 * @author jkopriva
 */
class NotificationWait {
    getNotificationWithMessage(message) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const center = yield new vscode_extension_tester_1.Workbench().openNotificationsCenter();
                const notifications = yield center.getNotifications(vscode_extension_tester_1.NotificationType.Any);
                for (const item of notifications) {
                    const text = yield item.getMessage();
                    if (text.indexOf(message) > -1) {
                        return item;
                    }
                }
                return null;
            }
            catch (err) {
                // do not print err
                return null;
            }
        });
    }
    whileGetNotificationWithMessage(message) {
        return __awaiter(this, void 0, void 0, function* () {
            return !(yield this.getNotificationWithMessage(message));
        });
    }
}
exports.NotificationWait = NotificationWait;
//# sourceMappingURL=NotificationWait.js.map