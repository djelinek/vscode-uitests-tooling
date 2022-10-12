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
exports.Project = void 0;
const fs = require("fs");
const fsExtra = require("fs-extra");
const Dialog_1 = require("./Dialog");
/**
 * Project class represents VS code workspace.
 * @author Marian Lorinc <mlorinc@redhat.com>
 */
class Project {
    /**
     * Create new object with path. The object does not create project in file system.
     * @param _path of project
     */
    constructor(_path) {
        this._path = _path;
        this._isOpen = false;
    }
    get path() {
        return this._path;
    }
    get exists() {
        return fs.existsSync(this.path);
    }
    get isOpen() {
        return this._isOpen;
    }
    /**
     * Creates new project in filesystem.
     */
    create() {
        if (this._isOpen) {
            return;
        }
        fs.mkdirSync(this._path);
    }
    /**
     * Create new project from project template.
     * @param path path of existing project
     */
    createFrom(path) {
        this.create();
        fsExtra.copySync(path, this._path);
    }
    /**
     * Opens project in VS code.
     */
    open() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this._isOpen) {
                return;
            }
            this._isOpen = true;
            yield Dialog_1.Dialog.openFolder(this._path);
        });
    }
    /**
     * Closes project in VS code.
     */
    close() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this._isOpen) {
                return;
            }
            this._isOpen = false;
            yield Dialog_1.Dialog.closeFolder();
        });
    }
    /**
     * Deletes project in VS code.
     */
    delete() {
        return __awaiter(this, void 0, void 0, function* () {
            fsExtra.removeSync(this._path);
        });
    }
}
exports.Project = Project;
//# sourceMappingURL=Project.js.map