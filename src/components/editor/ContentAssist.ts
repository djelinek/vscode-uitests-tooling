import { ContentAssist as IContentAssist, ContentAssistItem, TextEditor } from "vscode-extension-tester";
import { repeat } from "../../conditions/Repeat";

export class ContentAssist extends IContentAssist {
	constructor(parent: TextEditor | IContentAssist) {
		if (parent instanceof TextEditor) {
			super(parent);
		}
		else {
			super(parent.getEnclosingElement() as TextEditor);
		}
	}

	async getItem(label: string, timeout: number = 30000): Promise<ContentAssistItem> {
		return await repeat(() => super.getItem(label), {
			timeout,
			message: `Could not find item with label "${label}".`
		}) as ContentAssistItem;
	}

	async hasItem(label: string): Promise<boolean> {
		try {
			const item = await this.getItem(label, 0);
			return await item.isDisplayed();
		}
		catch {
			return false;
		}
	}
}
