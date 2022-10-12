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
exports.PathUtils = void 0;
const path = require("path");
const os = require("os");
var PathUtils;
(function (PathUtils) {
    /**
     * Remove first and trailing separator from path.
     * @param filePath
     * @returns
     */
    function trimPath(filePath) {
        let start = 0;
        let end = filePath.length;
        if (filePath.startsWith(path.sep)) {
            start = 1;
        }
        if (filePath.endsWith(path.sep)) {
            end = -1;
        }
        return filePath.slice(start, end);
    }
    PathUtils.trimPath = trimPath;
    /**
     * Split path to segments.
     * @param filePath
     * @returns
     */
    function splitPath(filePath) {
        return trimPath(filePath).split(path.sep);
    }
    PathUtils.splitPath = splitPath;
    /**
     * Convert path to tree path.
     * @param filePath
     * @returns
     */
    function convertToTreePath(filePath) {
        filePath = normalizePath(filePath);
        const segments = [];
        if (path.isAbsolute(filePath)) {
            segments.push('/');
        }
        return splitPath(filePath);
    }
    PathUtils.convertToTreePath = convertToTreePath;
    function getRelativePath(filePath, root) {
        root = normalizePath(root);
        filePath = normalizePath(filePath);
        if (!path.isAbsolute(root)) {
            throw new Error(`Root path must be absolute. Got: "${root}".`);
        }
        if (!path.isAbsolute(filePath)) {
            return filePath;
        }
        if (root === filePath) {
            throw new Error('Cannot create relative path. Paths are equal.');
        }
        const relativePath = path.relative(root, filePath);
        if (relativePath.startsWith('..' + path.sep)) {
            throw new Error(`Could not create relative path. Got: "${filePath}". Root path: "${root}".`);
        }
        return relativePath;
    }
    PathUtils.getRelativePath = getRelativePath;
    function normalizePath(filePath) {
        filePath = filePath.trim();
        if (filePath.startsWith('~/') || filePath === '~') {
            filePath = filePath.replace('~', os.homedir());
        }
        filePath = path.normalize(filePath);
        let end = filePath.length;
        if (filePath.endsWith(path.sep)) {
            end = -1;
        }
        return filePath.slice(0, end);
    }
    PathUtils.normalizePath = normalizePath;
    /**
     * Compare paths based on file tree ordering.
     * @param a
     * @param b
     * @param parentIndex
     * @param aIsFile
     * @param bIsFile
     * @returns
     */
    function compare(a, b, parentIndex, aIsFile, bIsFile) {
        if (isRoot(a) && isRoot(b)) {
            return 0;
        }
        else if (isRoot(a)) {
            return -1;
        }
        else if (isRoot(b)) {
            return 1;
        }
        const leafIndex = parentIndex + 1;
        aIsFile = isFile(a, leafIndex, aIsFile);
        bIsFile = isFile(b, leafIndex, bIsFile);
        if (aIsFile === bIsFile) {
            return a[leafIndex].localeCompare(b[leafIndex]);
        }
        if (isFile(a, leafIndex, aIsFile)) {
            return 1;
        }
        else {
            return -1;
        }
    }
    function isRoot(a) {
        return a.length === 1 && a[0] === '/';
    }
    function isLeaf(a, index) {
        return a.length === index + 1;
    }
    function isFile(a, index, isFileFlag) {
        return isLeaf(a, index) && isFileFlag;
    }
    /**
     * Compare paths base on tree order.
     * @param a
     * @param b
     * @param aIsFile
     * @param bIsFile
     * @returns positive value if path a is considered larger than path b, 0 if paths are equals and negative value if path a is smaller.
     */
    function comparePaths(a, b, aIsFile = false, bIsFile = false) {
        if (a.length === 0) {
            throw new Error('Path "a" must not be empty');
        }
        if (b.length === 0) {
            throw new Error('Path "b" must not be empty');
        }
        const aSegments = a;
        const bSegments = b;
        const length = Math.min(aSegments.length, bSegments.length);
        let matches = 0;
        while (matches < length) {
            if (aSegments[matches] !== bSegments[matches]) {
                break;
            }
            matches += 1;
        }
        const commonParentIndex = matches > 0 ? matches - 1 : -1;
        // check folder is parent
        if (matches === length) {
            return aSegments.length - bSegments.length;
        }
        return compare(aSegments, bSegments, commonParentIndex, aIsFile, bIsFile);
    }
    PathUtils.comparePaths = comparePaths;
    function comparePathsString(a, b, aIsFile = false, bIsFile = false) {
        return __awaiter(this, void 0, void 0, function* () {
            return PathUtils.comparePaths(PathUtils.convertToTreePath(a), PathUtils.convertToTreePath(b), aIsFile, bIsFile);
        });
    }
    PathUtils.comparePathsString = comparePathsString;
})(PathUtils = exports.PathUtils || (exports.PathUtils = {}));
//# sourceMappingURL=PathUtils.js.map