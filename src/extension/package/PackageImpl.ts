import { Package, Command, PackageData } from "./interfaces/Package";

export class PackageImpl implements Package {
	constructor(private packageData: any) {}
	getData<T>(): T {
		return this.packageData;
	}
	getCommands(): Command[] {
		const castedData = this.packageData as PackageData;
		return castedData.contributes?.commands || [];
	}
	getDescription(): string {
		return this.packageData["description"];
	}
	getDisplayName(): string {
		return this.packageData["displayName"];
	}
}
