import { EditorGroup, EditorView, Locator, TextEditor as ITextEditor, WebElement } from "vscode-extension-tester";
import { ContentAssist } from "../..";
export declare class TextEditor extends ITextEditor {
    constructor(view?: EditorView | EditorGroup | undefined, base?: WebElement | Locator | undefined);
    toggleContentAssist(open: boolean): Promise<ContentAssist | void>;
}
