import {
	after as mochaAfter,
	AsyncFunc,
	before as mochaBefore,
	Context,
	Done,
	Func
} from 'mocha';
import { VSBrowser } from 'vscode-extension-tester';
import sanitize = require('sanitize-filename');

function mochaHandler(name: string, fn?: Func | AsyncFunc) {
	return function (this: Context) {
		return new Promise<void>(async (resolve, reject) => {
			try {
				const done: Done = (err?: any) => {
					if (err) {
						throw err;
					}
					resolve();
				};

				await fn?.call<Context, [Done], void | PromiseLike<void>>(this, done);
				resolve();
			} catch (error) {
				await VSBrowser.instance.takeScreenshot(sanitize(name));
				reject(error);
			}
		});
	}
};

export function before(name: string, fn?: Func | AsyncFunc) {
	mochaBefore(name, mochaHandler(name, fn));
}

export function after(name: string, fn?: Func | AsyncFunc) {
	mochaAfter(name, mochaHandler(name, fn));
}

