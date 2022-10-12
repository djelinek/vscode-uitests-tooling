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
exports.AtlasMapExt = exports.views = exports.commands = exports.notifications = void 0;
const vscode_extension_tester_1 = require("vscode-extension-tester");
var notifications;
(function (notifications) {
    notifications.ATLASMAP_STARTING = "Starting AtlasMap instance at port ";
    notifications.ATLASMAP_RUNNING = "Running AtlasMap instance found";
    notifications.ATLASMAP_WAITING = "Waiting for ";
    notifications.ATLASMAP_STOPPING = "Stopping AtlasMap instance at port";
    notifications.ATLASMAP_STOPPED = "Stopped AtlasMap instance at port";
    notifications.ATLASMAP_UNABLE_LOCATE = "Unable to locate running AtlasMap instance";
})(notifications = exports.notifications || (exports.notifications = {}));
var commands;
(function (commands) {
    commands.START_ATLASMAP = "AtlasMap: Open AtlasMap";
    commands.STOP_ATLASMAP = "AtlasMap: Stop AtlasMap";
})(commands = exports.commands || (exports.commands = {}));
var views;
(function (views) {
    views.ATLASMAP_TITLE = "AtlasMap";
})(views = exports.views || (exports.views = {}));
/**
 * Contains all specific methods, constants, etc. for extension - AtlasMap
 * @author jkopriva
 */
class AtlasMapExt {
    start() {
        return __awaiter(this, void 0, void 0, function* () {
            yield new vscode_extension_tester_1.Workbench().executeCommand(commands.START_ATLASMAP);
        });
    }
    stop() {
        return __awaiter(this, void 0, void 0, function* () {
            yield new vscode_extension_tester_1.Workbench().executeCommand(commands.STOP_ATLASMAP);
        });
    }
    tabIsAccessible() {
        return __awaiter(this, void 0, void 0, function* () {
            yield new vscode_extension_tester_1.EditorView().openEditor(views.ATLASMAP_TITLE);
        });
    }
    windowExists() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const titles = yield new vscode_extension_tester_1.Workbench().getEditorView().getOpenEditorTitles();
                for (const title of titles) {
                    if (title.indexOf(views.ATLASMAP_TITLE) > -1) {
                        return true;
                    }
                }
                return false;
            }
            catch (err) {
                // do not print err
                return false;
            }
        });
    }
}
exports.AtlasMapExt = AtlasMapExt;
//# sourceMappingURL=AtlasMapExt.js.map