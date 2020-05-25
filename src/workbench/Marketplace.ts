import {
	ActivityBar,
	ExtensionsViewItem,
	ExtensionsViewSection,
	SideBarView,
	ViewControl,
	VSBrowser
} from 'vscode-extension-tester';

type ExtensionCategories = "Disabled" | "Enabled" | "Installed" | "Outdated" | "Other Recommendations" | "Marketplace" | "Popular";

/**
 * ExtensionsViewSection facade class
 * @author Marian Lorinc <mlorinc@redhat.com>
 */
class Marketplace {

	private static instance: Marketplace | null = null;

	private _isOpen: boolean = false;
	private _lastSection: ExtensionsViewSection | undefined = undefined;

	private constructor(private _extensionView: ViewControl, private _marketplaceSideBar: SideBarView) { }

	public get isOpen(): boolean {
		return this._isOpen;
	}

	/**
	 * Gets marketplace section
	 * @param section name of section,
	 * @returns promise which resolves to ExtensionsViewSection
	 */
	public async getExtensionsSection(section: ExtensionCategories): Promise<ExtensionsViewSection> {
		this._lastSection = await this._marketplaceSideBar.getContent().getSection(section) as ExtensionsViewSection;
		return this._lastSection;
	}

	/**
	 * Gets enabled section
	 * @returns promise which resolves to ExtensionsViewSection
	 */
	public async getEnabledExtensionsSection(): Promise<ExtensionsViewSection> {
		return this.getExtensionsSection("Enabled");
	}

	/**
	 * Gets disabled section
	 * @returns promise which resolves to ExtensionsViewSection
	 */
	public async getDisabledExtensionsSection(): Promise<ExtensionsViewSection> {
		return this.getExtensionsSection("Disabled");
	}

	/**
	 * Gets recommended section
	 * @returns promise which resolves to ExtensionsViewSection
	 */
	public async getRecommendedExtensionsSection(): Promise<ExtensionsViewSection> {
		return this.getExtensionsSection("Other Recommendations");
	}

	/**
	 * Finds extension in marketplace. Leaves search bar with title value.
	 * @param title display name of extension
	 * @returns promise which resolves to ExtensionsViewItem(extension)
	 */
	public async findExtension(title: string, timeout: number = 5000): Promise<ExtensionsViewItem | undefined> {
		// try to get enabled extension first. If vscode does not have any extension installed, get Popular section instead.
		const section = await this.getEnabledExtensionsSection().catch(() => this.getExtensionsSection("Popular"));
		return VSBrowser.instance.driver.wait(() => section.findItem(title).catch(() => undefined), timeout);
	}

	/**
	 * Clears search bar
	 */
	public async clearSearch(): Promise<void> {
		const handler = this._lastSection || await this.getEnabledExtensionsSection();
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
		const extensionView = new ActivityBar().getViewControl("Extensions");
		const marketplaceView = await extensionView.openView();
		Marketplace.instance = new Marketplace(extensionView, marketplaceView);
		Marketplace.instance._isOpen = true;
		return Marketplace.instance;
	}

	/**
	 * Gets open instance of marketplace
	 * @returns marketplace handler
	 */
	public static getInstance() {
		if (Marketplace.instance !== null) {
			return Marketplace.instance;
		}
		Marketplace.instance = new Marketplace(new ActivityBar().getViewControl("Extensions"), new SideBarView());
		return Marketplace.instance;
	}
}

export { Marketplace };
