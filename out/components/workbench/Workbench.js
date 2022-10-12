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
exports.Workbench = void 0;
const vscode_extension_tester_1 = require("vscode-extension-tester");
const InputBoxOpenDialogs_1 = require("../dialog/InputBoxOpenDialogs");
const path = require("path");
const PathUtils_1 = require("../../utils/PathUtils");
const fs = require("fs-extra");
const Repeat_1 = require("../../conditions/Repeat");
class OpenFolderPathError extends Error {
}
class Workbench extends vscode_extension_tester_1.Workbench {
    /**
     * Get path of open folder/workspace
     */
    getOpenFolderPath(timeout = 30000) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield (0, Repeat_1.repeat)(() => __awaiter(this, void 0, void 0, function* () {
                try {
                    console.log(`Title = "${yield new vscode_extension_tester_1.TitleBar().getTitle()}"`);
                    const { folder } = yield parseTitleBar();
                    if (folder) {
                        return folder;
                    }
                    else {
                        throw new OpenFolderPathError('There are not open folders in VS Code. Use Workbench.openFolder function first or try passing absolute path.');
                    }
                }
                catch (e) {
                    if (e.name === 'NoSuchElementError' || e.message.includes('element is not attached to the page document')) {
                        return undefined;
                    }
                    throw e;
                }
            }), {
                timeout,
                message: `Could not get title bar.${yield new vscode_extension_tester_1.TitleBar().getTitle().then((title) => ` title = "${title}"`).catch(() => '')}`
            });
        });
    }
    /**
     * Get path of open folder/workspace
     */
    getOpenFilePath(timeout = 30000) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield (0, Repeat_1.repeat)(() => __awaiter(this, void 0, void 0, function* () {
                try {
                    console.log(`Title = "${yield new vscode_extension_tester_1.TitleBar().getTitle()}"`);
                    const { file } = yield parseTitleBar();
                    if (file) {
                        return file;
                    }
                    else {
                        return undefined;
                    }
                }
                catch (e) {
                    if (e.name === 'NoSuchElementError' || e.message.includes('element is not attached to the page document')) {
                        return undefined;
                    }
                    throw e;
                }
            }), {
                timeout,
                message: `Could not get file path from title bar.${yield new vscode_extension_tester_1.TitleBar().getTitle().then((title) => ` title = "${title}"`).catch(() => '')}`
            });
        });
    }
    /**
     * Open folder. Relative paths are resolved to absolute paths based on current open folder.
     * @param folderPath path to folder
     * @returns promise which is resolved when workbench is ready
     */
    openFolder(folderPath, timeout = 40000) {
        return __awaiter(this, void 0, void 0, function* () {
            yield new vscode_extension_tester_1.TitleBar().select('File', 'Open Folder...');
            const dialog = yield this.getOpenDialog();
            folderPath = PathUtils_1.PathUtils.normalizePath(folderPath);
            if (!path.isAbsolute(folderPath)) {
                folderPath = path.join(yield this.getOpenFolderPath(), folderPath);
            }
            let inputPath = folderPath;
            if (inputPath.endsWith(path.sep) === false) {
                inputPath += path.sep;
            }
            yield dialog.selectPath(inputPath, timeout);
            yield dialog.confirm(timeout);
            yield this.openFolderWaitCondition(folderPath, timeout);
        });
    }
    /**
     * Open file. Relative paths are resolved to absolute paths based on current open folder.
     * @param filePath path to file
     * @returns promise which is resolved when file is open
     */
    openFile(filePath, timeout = 40000) {
        return __awaiter(this, void 0, void 0, function* () {
            yield new vscode_extension_tester_1.TitleBar().select('File', 'Open File...');
            const dialog = yield this.getOpenDialog();
            filePath = PathUtils_1.PathUtils.normalizePath(filePath);
            if (!path.isAbsolute(filePath)) {
                filePath = path.join(yield this.getOpenFolderPath(), filePath);
            }
            yield dialog.selectPath(filePath, timeout);
            yield dialog.confirm(timeout);
            yield (0, Repeat_1.repeat)(() => __awaiter(this, void 0, void 0, function* () { return (yield this.getOpenFilePath()) === filePath; }), {
                timeout,
                message: `Could not open file with path "${filePath}"`
            });
        });
    }
    /**
     * Close open folder.
     * @returns promise which is resolved when folder is closed
     */
    closeFolder(timeout = 40000) {
        return __awaiter(this, void 0, void 0, function* () {
            if (process.env.OPEN_FOLDER && PathUtils_1.PathUtils.normalizePath(process.env.OPEN_FOLDER) === (yield this.getOpenFolderPath())) {
                return;
            }
            try {
                yield this.getOpenFolderPath();
                yield new vscode_extension_tester_1.TitleBar().select('File', 'Close Folder');
                yield this.getDriver().wait(() => __awaiter(this, void 0, void 0, function* () {
                    try {
                        yield this.getOpenFolderPath();
                        return false;
                    }
                    catch (_a) {
                        return true;
                    }
                }), timeout, `Could not close folder.`);
            }
            catch (e) {
                if (e instanceof OpenFolderPathError) {
                    return;
                }
                throw e;
            }
        });
    }
    /**
    * Return existing open dialog object.
    */
    getOpenDialog() {
        return __awaiter(this, void 0, void 0, function* () {
            return new InputBoxOpenDialogs_1.InputBoxOpenDialog();
        });
    }
    openFolderWaitCondition(folderPath, timeout = 40000) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.getDriver().wait(() => __awaiter(this, void 0, void 0, function* () {
                try {
                    return (yield this.getOpenFolderPath()) === folderPath;
                }
                catch (e) {
                    if (e instanceof OpenFolderPathError) {
                        return false;
                    }
                    throw e;
                }
            }), timeout, `Could not find open folder with path "${folderPath}".`);
        });
    }
}
exports.Workbench = Workbench;
function parseTitleBar() {
    return __awaiter(this, void 0, void 0, function* () {
        const title = yield new vscode_extension_tester_1.TitleBar().getTitle();
        const segments = title.split(' - ');
        let file = undefined;
        let folder = undefined;
        for (const segment of segments) {
            try {
                const segmentValue = PathUtils_1.PathUtils.normalizePath(segment);
                const stat = fs.statSync(segmentValue);
                if (stat.isDirectory()) {
                    folder = segmentValue;
                }
                else if (stat.isFile()) {
                    file = segmentValue;
                }
                if (file && folder) {
                    break;
                }
            }
            catch (e) {
                if (e.message.includes('no such file or directory')) {
                    continue;
                }
                throw e;
            }
        }
        return { file, folder };
    });
}
//# sourceMappingURL=Workbench.js.map