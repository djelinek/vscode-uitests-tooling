import { ReleaseQuality } from 'vscode-extension-tester';
import { SimpleTestRunner } from '../SimpleTestRunner';

export interface TestRunner {
	installCode(): Promise<void>;
	installCodeDriver(): Promise<void>;
	installExtension(extension?: string): Promise<void>;
	run(testsGlob: string): Promise<number>;
	dispose(): Promise<void>;
}

export interface TestRunnerParameters {
	codeDriverVersion?: string;
	codeReleaseType?: ReleaseQuality;
	codeSettings?: string;
	codeVersion?: string;
	extensionDirectory?: string;
	mochaConfig?: string;
	storageFolder?: string;
	useYarn?: boolean;
}

export function createTestRunner(parameters: TestRunnerParameters): TestRunner {
	return new SimpleTestRunner(parameters);
}
