import { ActivityBar as IActivityBar, ViewControl } from "vscode-extension-tester";
import { repeat } from "../..";

export class ActivityBar extends IActivityBar {

	async getViewControl(name: string, timeout: number = 15000): Promise<ViewControl> {
		try {
			return await repeat(() => super.getViewControl(name).catch(() => undefined), {
				timeout,
				message: `Could not find view control with name "${name}".`
			}) as ViewControl;
		}
		catch (e) {
			const titles = await Promise.all((await this.getViewControls()).map((control) => control.getTitle()));
			console.error(`Control titles: ${titles.join(', ')}`);

			for (const control of await this.getViewControls()) {
				if ((await control.getTitle()).trim() === '') {
					console.error(`Warning(unknown title) - ${await control.getAttribute('innerHTML')}`);
				}
			}
			throw e;
		}
	}

	async getViewControls(): Promise<ViewControl[]> {
		const controls = [];

		for (const control of await super.getViewControls()) {
			if (await control.isDisplayed().catch(() => false)) {
				controls.push(control);
			}
		}
		return controls;
	}
}
