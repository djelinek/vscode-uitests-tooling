import { ContentAssist as IContentAssist, ContentAssistItem, TextEditor } from "vscode-extension-tester";
export declare class ContentAssist extends IContentAssist {
    constructor(parent: TextEditor | IContentAssist);
    getItem(label: string, timeout?: number): Promise<ContentAssistItem>;
    hasItem(label: string): Promise<boolean>;
}
