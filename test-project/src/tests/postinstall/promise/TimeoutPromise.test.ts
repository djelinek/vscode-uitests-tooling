import { expect } from "chai";
import { TimeoutPromise } from "vscode-uitests-tooling";

describe("TimeoutPromise", function () {
	it("Simple resolve", async function () {
		try {
			await new TimeoutPromise<number>(((resolve) => {
				resolve(5);
			}));
		}
		catch {
			expect.fail("Promise must be resolved");
		}
	});
	it("Simple reject", async function () {
		try {
			await new TimeoutPromise<void>(((_, reject) => {
				reject();
			}));
			expect.fail("Promise must be rejected");
		}
		catch { }
	});
	it("Promise time outs", async function () {
		this.timeout(6000);
		let timer: NodeJS.Timer | null = null;

		try {
			await new TimeoutPromise<number>(((resolve) => {
				timer = setTimeout(resolve, 5000);
			}), 2000);
			expect.fail("Promise should timeout and be rejected");
		}
		catch {
			if (timer !== null) {
				clearTimeout(timer);
			}
		}
	});
});
