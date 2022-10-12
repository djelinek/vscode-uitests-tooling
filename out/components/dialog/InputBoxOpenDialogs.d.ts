import { InputBox } from 'vscode-extension-tester';
import { IOpenDialog } from './IOpenDialog';
export declare class InputBoxOpenDialog extends InputBox implements IOpenDialog {
    selectPath(filePath: string, timeout?: number): Promise<void>;
    confirm(timeout?: number): Promise<void>;
    cancel(timeout?: number): Promise<void>;
}
