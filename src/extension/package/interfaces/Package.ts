import * as fs from 'fs';
import * as path from 'path';
import { assert } from 'chai';
import { PackageImpl } from '../PackageImpl';

let projectPath: string = process.cwd();
assert.ok(fs.existsSync(path.join(projectPath, 'package.json')), `Project path is invalid. package.json was not found. (projectPath=${projectPath})`);

export interface Command {
	command: string;
	title: string;
}

export interface Contributes {
	commands: Array<Command>;
}

export interface PackageData {
	contributes?: Contributes;
}

/**
 * NPM package helper object
 */
export interface Package {
	/**
	 * @returns package.json interface instance casted to generic type T
	 * @example interface PackageJson {
	 * 	name: string;
	 * 	displayName: string;
	 * 	description: string;
	 * }
	 * const package = getPackageData();
	 * const packageJson: PackageJson = package.getData();
	 */
	getData<T>(): T;
	getCommands(): Command[];
	getDescription(): string;
	getDisplayName(): string;
}

/**
 * Read package.json data and return helper object.
 * @param packagePath path to package.json. Default value: $CWD/package.json
 */
export function getPackageData(packagePath?: string): Package {
	return new PackageImpl(JSON.parse(packagePath || fs.readFileSync(path.join(projectPath, 'package.json'), { encoding: 'utf8' })));
}

/**
 * Get project path. Project path is always value of process.cwd() function.
 * @returns the project path
 */
export function getProjectPath(): string {
	return projectPath;
}
