import { ContentAssist as IContentAssist, EditorGroup, EditorView, Locator, TextEditor as ITextEditor, WebElement } from "vscode-extension-tester";
import { ContentAssist } from "../..";

export class TextEditor extends ITextEditor {
	constructor(view?: EditorView | EditorGroup | undefined, base?: WebElement | Locator | undefined) {
		super(view, base);
	}

	async toggleContentAssist(open: boolean): Promise<ContentAssist | void> {
		const menu = await super.toggleContentAssist(open);
		if (menu instanceof IContentAssist) {
			return new ContentAssist(menu);
		}
	}
}
