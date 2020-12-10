import { expect } from "chai";
import { it } from "mocha";
import { repeat } from "vscode-uitests-tooling";

describe("Repeat", function () {

	it("Count works", async function () {
		let count = 0;
		const func = () => (++count) === 4;

		await repeat(func, {
			count: 5
		});

		expect(count).to.equal(4);
	});

	it("Count works (count exceeds)", async function () {
		let count = 0;
		const func = () => (++count) > 10;

		try {
			await repeat(func, {
				count: 5,
				id: "Test"
			});
		}
		catch (e) {
			expect((e as Error).message).equal("[Test] Cannot repeat function more than 5 times.");
		}
	});

	it("Timeout works", async function () {
		this.timeout(6000);
		const func = () => false;

		try {
			await repeat(func, {
				timeout: 2000,
				id: "Test"
			});
			expect.fail("Repeat did not throw error");
		}
		catch (e) {
			expect(((e as Error)).message).includes("Promise(id=Test) timed out after");
		}
	});

	it("Timeout and count works (repeat does not time out)", async function () {
		this.timeout(6000);

		let count = 0;
		const func = () => (++count) === 4;

		try {
			await repeat(func, {
				count: 5,
				timeout: 2000
			});
			expect(count).to.equal(4);
		}
		catch (e) {
			expect.fail(e);
		}
	});

	it("Timeout and count works (repeat times out)", async function () {
		this.timeout(6000);

		const repeatCount = Number.MAX_SAFE_INTEGER;
		const func = () => false;

		try {
			await repeat(func, {
				count: repeatCount,
				timeout: 20,
				id: "Test"
			});
			expect.fail("Repeat did not throw error");
		}
		catch (e) {
			expect((e as Error).message).includes("Promise(id=Test) timed out after");
		}
	});
});
