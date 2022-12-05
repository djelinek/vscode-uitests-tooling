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
exports.FileSystem = void 0;
const vscode_extension_tester_1 = require("vscode-extension-tester");
/**
 * Handles File Dialogs
 * @author Dominik Jelinek <djelinek@redhat.com>
 */
class FileSystem {
    constructor() { }
    /**
     * Open file with specified 'path' via Simple Dialog (File > Open File...)
     * @param path path to the specific file
     * @returns resolved dialog
     */
    static openFile(path) {
        return __awaiter(this, void 0, void 0, function* () {
            const input = yield FileSystem.open(path);
            yield input.confirm();
            return input;
        });
    }
    /**
     * Close and save opened file
     * @param save true/false, save file before close editor or not
     */
    static closeFile(save = true) {
        return __awaiter(this, void 0, void 0, function* () {
            const titleBar = new vscode_extension_tester_1.TitleBar();
            if (save) {
                yield titleBar.select("File", "Save");
            }
            else {
                yield titleBar.select("File", "Revert File");
            }
            yield titleBar.select("File", "Close Editor");
        });
    }
    /**
     * Open folder with specified 'path' via Open Folder Simple Dialog (File > Open Folder...)
     * @param path path to the specific folder
     * @returns resolved dialog
     */
    static openFolder(path) {
        return __awaiter(this, void 0, void 0, function* () {
            const input = yield FileSystem.open(path);
            yield input.confirm();
            return input;
        });
    }
    /**
     * Close opened folder
     */
    static closeFolder() {
        return __awaiter(this, void 0, void 0, function* () {
            const titleBar = new vscode_extension_tester_1.TitleBar();
            yield titleBar.select("File", "Close Folder");
        });
    }
    /**
     * It will revert changes made in currently opened file before save
     */
    static revertFileChanges() {
        return __awaiter(this, void 0, void 0, function* () {
            yield new vscode_extension_tester_1.Workbench().executeCommand('File: Revert File');
        });
    }
    /**
     * Selects path and confirms dialog
     * @param path path to be inputted to dialog
     * @returns promise which resolves with dialog
     * @author Marian Lorinc <mlorinc@redhat.com>
     */
    static confirm(path) {
        return __awaiter(this, void 0, void 0, function* () {
            const dialog = yield FileSystem.open(path);
            yield dialog.confirm();
            return dialog;
        });
    }
    /**
     * Selects path and cancels dialog
     * @param path path to be inputted to dialog
     * @returns promise which resolves with dialog
     * @author Marian Lorinc <mlorinc@redhat.com>
     */
    static cancel(path) {
        return __awaiter(this, void 0, void 0, function* () {
            const dialog = yield FileSystem.open(path);
            yield dialog.cancel();
            return dialog;
        });
    }
    static open(path = "") {
        return __awaiter(this, void 0, void 0, function* () {
            const input = yield vscode_extension_tester_1.InputBox.create();
            if (input === null) {
                return yield Promise.reject('Could not open simple dialog!');
            }
            yield input.setText(path);
            return input;
        });
    }
}
exports.FileSystem = FileSystem;
//# sourceMappingURL=FileSystem.js.map