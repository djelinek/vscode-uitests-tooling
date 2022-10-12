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
exports.ActivityBar = void 0;
const vscode_extension_tester_1 = require("vscode-extension-tester");
const __1 = require("../..");
class ActivityBar extends vscode_extension_tester_1.ActivityBar {
    getViewControl(name, timeout = 15000) {
        const _super = Object.create(null, {
            getViewControl: { get: () => super.getViewControl }
        });
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield (0, __1.repeat)(() => _super.getViewControl.call(this, name).catch(() => undefined), {
                    timeout,
                    message: `Could not find view control with name "${name}".`
                });
            }
            catch (e) {
                const titles = yield Promise.all((yield this.getViewControls()).map((control) => control.getTitle()));
                console.error(`Control titles: ${titles.join(', ')}`);
                for (const control of yield this.getViewControls()) {
                    if ((yield control.getTitle()).trim() === '') {
                        console.error(`Warning(unknown title) - ${yield control.getAttribute('innerHTML')}`);
                    }
                }
                throw e;
            }
        });
    }
    getViewControls() {
        const _super = Object.create(null, {
            getViewControls: { get: () => super.getViewControls }
        });
        return __awaiter(this, void 0, void 0, function* () {
            const controls = [];
            for (const control of yield _super.getViewControls.call(this)) {
                if (yield control.isDisplayed().catch(() => false)) {
                    controls.push(control);
                }
            }
            return controls;
        });
    }
}
exports.ActivityBar = ActivityBar;
//# sourceMappingURL=ActivityBar.js.map