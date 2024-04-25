import * as path from 'path';
import { InputBox, Key } from 'vscode-extension-tester';
import { IOpenDialog } from './IOpenDialog';
import { repeat } from '../../conditions/Repeat';

export class InputBoxOpenDialog extends InputBox implements IOpenDialog {
	async selectPath(filePath: string, timeout: number = 15000): Promise<void> {
		const clipboardy = (await import('clipboardy')).default;
		if (path.isAbsolute(filePath) === false) {
			throw new Error(`Open dialog path must be absolute. Got: "${filePath}".`);
		}
		
		await this.wait(timeout);
		let oldClipboard: string | undefined;
		try {
			oldClipboard = clipboardy.readSync();
		}
		catch (e: any) {
			console.warn(e.message);
		}

		try {
			await repeat(async () => {
				if (await this.getText() === filePath) {
					return true;
				}

				clipboardy.writeSync(filePath);
				await this.sendKeys(
					Key.chord(Key.SHIFT, Key.HOME),
					Key.chord(InputBoxOpenDialog.ctlKey, 'v')
				);

				return false;
			}, {
				timeout,
				message: `Could not set path to open: "${filePath}".`,
				threshold: 750
			});
		}
		finally {
			if (oldClipboard) {
				clipboardy.writeSync(oldClipboard);
			}
		}
	}

	async confirm(timeout: number = 15000): Promise<void> {
		await this.wait(timeout);
		const originalText = await this.getText();
		await this.getDriver().wait(async () => {
			try {
				const displayed = await this.isDisplayed().catch(() => false);
				const text = displayed ? await this.getText() : undefined;
				if (displayed === false || text !== originalText) {
					return true;
				}

				await super.confirm();
				return false;
			}
			catch {
				// ignore
				return false;
			}
		}, timeout, 'Could not confirm dialog.');
	}

	async cancel(timeout: number = 15000): Promise<void> {
		await this.wait(timeout);
		await this.getDriver().wait(async () => {
			try {
				const displayed = await this.isDisplayed().catch(() => false);
				if (displayed === false) {
					return true;
				}

				await super.cancel();
				return false;
			}
			catch {
				// ignore
				return false;
			}
		}, timeout, 'Could not cancel dialog.');
	}
}
