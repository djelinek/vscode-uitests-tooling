import { ExtensionsViewItem, ExtensionsViewSection } from "vscode-extension-tester";
declare type ExtensionCategories = "Disabled" | "Enabled" | "Installed" | "Outdated" | "Other Recommendations" | "Marketplace";
/**
 * ExtensionsViewSection facade class
 * @author Marian Lorinc <mlorinc@redhat.com>
 */
declare class Marketplace {
    /**
     * Gets marketplace section
     * @param section name of section,
     * @returns promise which resolves to ExtensionsViewSection
     */
    getExtensions(section?: ExtensionCategories): Promise<ExtensionsViewSection>;
    /**
     * Gets enabled section
     * @returns promise which resolves to ExtensionsViewSection
     */
    getEnabledExtensions(): Promise<ExtensionsViewSection>;
    /**
     * Gets disabled section
     * @returns promise which resolves to ExtensionsViewSection
     */
    getDisabledExtensions(): Promise<ExtensionsViewSection>;
    /**
     * Gets recommended section
     * @returns promise which resolves to ExtensionsViewSection
     */
    getRecommendedExtensions(): Promise<ExtensionsViewSection>;
    getAnySection(timeout?: number): Promise<ExtensionsViewSection>;
    /**
     * Finds extension in marketplace. Leaves search bar with title value.
     * @param title display name of extension
     * @param timeout timeout used when looking for extension
     * @returns promise which resolves to ExtensionsViewItem(extension)
     */
    findExtension(title: string, timeout?: number): Promise<ExtensionsViewItem>;
    /**
     * Clears search bar
     */
    clearSearch(timeout?: number): Promise<void>;
    /**
     * Closes marketplace
     */
    close(timeout?: number): Promise<void>;
    /**
     * Opens marketplace
     * @returns marketplace handler
     */
    static open(timeout?: number): Promise<Marketplace>;
    /**
     * Gets open instance of marketplace
     * @returns marketplace handler
     */
    static getInstance(timeout?: number): Promise<Marketplace>;
}
export { Marketplace };
