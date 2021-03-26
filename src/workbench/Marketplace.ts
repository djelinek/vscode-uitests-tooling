import { ActivityBar, ViewControl, SideBarView, ExtensionsViewItem, ExtensionsViewSection } from "vscode-extension-tester";

type ExtensionCategories = "Disabled" | "Enabled" | "Installed" | "Outdated" | "Other Recommendations" | "Marketplace";

/**
 * ExtensionsViewSection facade class
 * @author Marian Lorinc <mlorinc@redhat.com>
 */
class Marketplace {

	private static instance: Marketplace | null = null;

	private _isOpen: boolean = false;

	private constructor(private _extensionView: ViewControl, private _marketplaceSideBar: SideBarView) {}

	public get isOpen(): boolean {
		return this._isOpen;
	}

	/**
	 * Gets marketplace section
	 * @param section name of section,
	 * @returns promise which resolves to ExtensionsViewSection
	 */
	public async getExtensions(section: ExtensionCategories = "Marketplace"): Promise<ExtensionsViewSection> {
		return this._marketplaceSideBar.getContent().getSection(section) as Promise<ExtensionsViewSection>;
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

	/**
	 * Finds extension in marketplace. Leaves search bar with title value.
	 * @param title display name of extension
	 * @returns promise which resolves to ExtensionsViewItem(extension)
	 */
	public async findExtension(title: string): Promise<ExtensionsViewItem | undefined> {
		return (await this.getEnabledExtensions()).findItem(title);
	}

	/**
	 * Clears search bar
	 */
	public async clearSearch(): Promise<void> {
		const handler = await this.getEnabledExtensions();
		return handler.clearSearch();
	}

	/**
	 * Closes marketplace 
	 */
	public async close(): Promise<void> {
		this._isOpen = false;
		return this._extensionView.closeView();
	}

	/**
	 * Opens marketplace
	 * @returns marketplace handler
	 */
	public static async open(): Promise<Marketplace> {
		const extensionView = await new ActivityBar().getViewControl("Extensions");
		if(extensionView) {
			const marketplaceView = await extensionView.openView();
			Marketplace.instance = new Marketplace(extensionView, marketplaceView);
			Marketplace.instance._isOpen = true;
			return Marketplace.instance;
		} else {
			throw Error('Cannot find Extensions view');
		}
	}

	/**
	 * Gets open instance of marketplace
	 * @returns marketplace handler
	 */
	public static async getInstance() {
		if (Marketplace.instance !== null) {
			return Marketplace.instance;
		}
		const extensionView = await new ActivityBar().getViewControl("Extensions");
		if(extensionView) {
			Marketplace.instance = new Marketplace(extensionView, new SideBarView());
			return Marketplace.instance;
		} else {
			throw Error('Cannot find Extensions view');
		}
	}
}

export { Marketplace };
