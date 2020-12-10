import { TimeoutPromise } from "../promise/TimeoutPromise";
import { until, VSBrowser, WebElement } from "vscode-extension-tester";
import { repeat } from "./Repeat";

export class WebElementConditions {

	constructor() {

	}

	static async isHidden(element: WebElement): Promise<boolean> {
		return !(await element.isDisplayed().catch(() => false));
	}

	static async isInteractive(element: WebElement): Promise<boolean> {
		try {
			return await element.isDisplayed() && await element.isEnabled();
		}
		catch {
			return false;
		}
	}

	static async waitUntilInteractive(element: WebElement, timeout: number): Promise<boolean> {
		return repeat(() => WebElementConditions.isInteractive(element), {
			timeout
		});
	}

	static async waitUntilStale(element: WebElement, timeout: number): Promise<void> {
		let run = true;

		function closure(resolve: () => void): void {
			if (until.stalenessOf(element).fn(VSBrowser.instance.driver)) {
				resolve();
			}
			else if (run) {
				setImmediate(closure, resolve);
			}
		}

		return new TimeoutPromise<void>((resolve) => setImmediate(closure, resolve), timeout, { onTimeout: () => run = false });
	}
}
