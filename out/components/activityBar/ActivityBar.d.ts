import { ActivityBar as IActivityBar, ViewControl } from "vscode-extension-tester";
export declare class ActivityBar extends IActivityBar {
    getViewControl(name: string, timeout?: number): Promise<ViewControl>;
    getViewControls(): Promise<ViewControl[]>;
}
