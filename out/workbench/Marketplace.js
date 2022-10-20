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
exports.Marketplace = void 0;
const vscode_extension_tester_1 = require("vscode-extension-tester");
const __1 = require("..");
const Repeat_1 = require("../conditions/Repeat");
const process_1 = require("process");
/**
 * ExtensionsViewSection facade class
 * @author Marian Lorinc <mlorinc@redhat.com>
 */
class Marketplace {
    /**
     * Gets marketplace section
     * @param section name of section,
     * @returns promise which resolves to ExtensionsViewSection
     */
    getExtensions(section = "Marketplace") {
        return __awaiter(this, void 0, void 0, function* () {
            return new vscode_extension_tester_1.SideBarView().getContent().getSection(section);
        });
    }
    /**
     * Gets enabled section
     * @returns promise which resolves to ExtensionsViewSection
     */
    getEnabledExtensions() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.getExtensions("Enabled");
        });
    }
    /**
     * Gets disabled section
     * @returns promise which resolves to ExtensionsViewSection
     */
    getDisabledExtensions() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.getExtensions("Disabled");
        });
    }
    /**
     * Gets recommended section
     * @returns promise which resolves to ExtensionsViewSection
     */
    getRecommendedExtensions() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.getExtensions("Other Recommendations");
        });
    }
    getAnySection(timeout = 30000) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield (0, Repeat_1.repeat)(() => __awaiter(this, void 0, void 0, function* () {
                const content = new vscode_extension_tester_1.SideBarView().getContent();
                for (const section of yield content.getSections()) {
                    if (section instanceof vscode_extension_tester_1.ExtensionsViewSection) {
                        return section;
                    }
                }
                return undefined;
            }), {
                timeout,
                message: 'Could not find any marketplace sections.'
            });
        });
    }
    /**
     * Finds extension in marketplace. Leaves search bar with title value.
     * @param title display name of extension
     * @param timeout timeout used when looking for extension
     * @returns promise which resolves to ExtensionsViewItem(extension)
     */
    findExtension(title, timeout = 30000) {
        return __awaiter(this, void 0, void 0, function* () {
            const section = yield this.getAnySection(timeout);
            return yield (0, Repeat_1.repeat)(() => section.findItem(title), {
                timeout,
                message: `Could not find extension with title "${title}".`
            });
        });
    }
    /**
     * Clears search bar
     */
    clearSearch(timeout = 30000) {
        return __awaiter(this, void 0, void 0, function* () {
            const section = yield this.getAnySection(timeout);
            return section.clearSearch();
        });
    }
    /**
     * Closes marketplace
     */
    close(timeout = 30000) {
        return __awaiter(this, void 0, void 0, function* () {
            const view = yield new __1.ActivityBar().getViewControl("Extensions", timeout);
            return yield view.closeView();
        });
    }
    /**
     * Opens marketplace
     * @returns marketplace handler
     */
    static open(timeout) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("Opening Marketplace from GIT!!!...");
            let isMac = process_1.platform === "darwin";
            return yield (0, Repeat_1.repeat)(() => __awaiter(this, void 0, void 0, function* () {
                if (isMac) {
                    yield new vscode_extension_tester_1.Workbench().executeCommand('View: Open View');
                    const input = yield vscode_extension_tester_1.InputBox.create();
                    yield input.setText('view Extensions');
                    yield input.confirm();
                }
                else {
                    yield new vscode_extension_tester_1.TitleBar().select('View', 'Extensions');
                }
                const marketplace = new Marketplace();
                try {
                    yield marketplace.getAnySection(1000);
                    return marketplace;
                }
                catch (_a) {
                    return undefined;
                }
            }), {
                timeout,
                message: 'Could not open marketplace.'
            });
        });
    }
    /**
     * Gets open instance of marketplace
     * @returns marketplace handler
     */
    static getInstance(timeout) {
        return __awaiter(this, void 0, void 0, function* () {
            return Marketplace.open(timeout);
        });
    }
}
exports.Marketplace = Marketplace;
//# sourceMappingURL=Marketplace.js.map