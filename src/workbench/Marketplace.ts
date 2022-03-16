import { SideBarView, ExtensionsViewItem, ExtensionsViewSection, TitleBar, InputBox, Workbench } from "vscode-extension-tester";
import { ActivityBar } from "..";
import { repeat } from "../conditions/Repeat";
import { platform } from 'process';

type ExtensionCategories = "Disabled" | "Enabled" | "Installed" | "Outdated" | "Other Recommendations" | "Marketplace";

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
	public async getExtensions(section: ExtensionCategories = "Marketplace"): Promise<ExtensionsViewSection> {
		return new SideBarView().getContent().getSection(section) as Promise<ExtensionsViewSection>;
	}

	/**
	 * Gets enabled section
	 * @returns promise which resolves to ExtensionsViewSection
	 */
	public async getEnabledExtensions(): Promise<ExtensionsViewSection> {
		return this.getExtensions("Enabled");
	}

	/**
	 * Gets disabled section
	 * @returns promise which resolves to ExtensionsViewSection
	 */
	public async getDisabledExtensions(): Promise<ExtensionsViewSection> {
		return this.getExtensions("Disabled");
	}

	/**
	 * Gets recommended section
	 * @returns promise which resolves to ExtensionsViewSection
	 */
	public async getRecommendedExtensions(): Promise<ExtensionsViewSection> {
		return this.getExtensions("Other Recommendations");
	}

	public async getAnySection(timeout: number = 30000): Promise<ExtensionsViewSection> {
		return await repeat(async () => {
			const content = new SideBarView().getContent();

			for (const section of await content.getSections()) {
				if (section instanceof ExtensionsViewSection) {
					return section;
				}
			}

			return undefined;
		}, {
			timeout,
			message: 'Could not find any marketplace sections.'
		}) as ExtensionsViewSection;
	}

	/**
	 * Finds extension in marketplace. Leaves search bar with title value.
	 * @param title display name of extension
	 * @param timeout timeout used when looking for extension
	 * @returns promise which resolves to ExtensionsViewItem(extension)
	 */
	public async findExtension(title: string, timeout: number = 30000): Promise<ExtensionsViewItem> {
		const section = await this.getAnySection(timeout);
		return await repeat(() => section.findItem(title), {
			timeout,
			message: `Could not find extension with title "${title}".`
		}) as ExtensionsViewItem;
	}

	/**
	 * Clears search bar
	 */
	public async clearSearch(timeout: number = 30000): Promise<void> {
		const section = await this.getAnySection(timeout);
		return section.clearSearch();
	}

	/**
	 * Closes marketplace 
	 */
	public async close(timeout: number = 30000): Promise<void> {
		const view = await new ActivityBar().getViewControl("Extensions", timeout);
		return await view.closeView();
	}

	/**
	 * Opens marketplace
	 * @returns marketplace handler
	 */
	public static async open(timeout?: number): Promise<Marketplace> {
		var isMac = platform === "darwin";
		return await repeat(async () => {
			if(isMac) {
				await new Workbench().executeCommand('View: Open View');
				const input = await InputBox.create();
				await input.setText('view Extensions');
				await input.confirm();
			} else {
				await new TitleBar().select('View', 'Extensions');
			}
			const marketplace = new Marketplace();
			try {
				await marketplace.getAnySection(1000);
				return marketplace;
			}
			catch {
				return undefined;
			}
		}, {
			timeout,
			message: 'Could not open marketplace.'
		}) as Marketplace;
	}

	/**
	 * Gets open instance of marketplace
	 * @returns marketplace handler
	 */
	public static async getInstance(timeout?: number) {
		return Marketplace.open(timeout);
	}
}

export { Marketplace };
