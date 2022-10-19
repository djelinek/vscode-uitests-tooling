[![npm version](https://badge.fury.io/js/vscode-uitests-tooling.svg?style=flat)](https://badge.fury.io/js/vscode-uitests-tooling) [![contributions welcome](https://img.shields.io/badge/contributions-welcome-brightgreen.svg?style=flat)](https://github.com/djelinek/vscode-uitests-tooling/issues) [![License](https://img.shields.io/badge/license-Apache%202.0-blue.svg?style=flat)](https://github.com/djelinek/vscode-uitests-tooling/blob/master/LICENSE)

# vscode-uitests-tooling
UI Tests Tooling for VS Code extensions is a package built on [VS Code Extension Tester](https://github.com/redhat-developer/vscode-extension-tester). It provides more specific functions, wait conditions, sets of features and others for UI testing of VS Code extensions.

## Installation
- Install _vscode-extension-tester_ into your extension devDependencies:
	```
  npm install --save-dev vscode-extension-tester
  ```

- Install _vscode-uitests-tooling_ into your extension devDependencies:
	- from NPM registry
      ```
      npm install --save-dev vscode-uitests-tooling
      ```
	- or directly from GIT repository
      ```
      npm install --save-dev djelinek/vscode-uitests-tooling#git-devel
      ```

## Local development
These are necessary steps for local contribution and writing tests with _vscode-uitests-tooling_ package.

### Build local changes
1. Inside `vscode-uitests-tooling` project execute prepared script, which will execute necessary steps
	```
	npm run dev
	```

2. In project where you are writing tests, you need to reinstall new local built version of `vscode-uitests-tooling` package
	```
	rimraf node_modules/vscode-uitests-tooling
	npm link vscode-uitests-tooling --install-links
	```

### Publish new changes
Do not forget to include `/out/**` folder in git changes and put them into your PR. Without `/out/**` merged in git repository, the changes won't be available after reinstall of `vscode-uitests-tooling` extension in used project.

### Get new changes from Git
When you need to pull new changes from `vscode-uitests-tooling` Git repository into your project dependency, you just need to reinstall it.
```
npm i -D djelinek/vscode-uitests-tooling#git-devel --no-save
```
`--no-save` flag ensures that the `package-lock.json` file won't be changed with new dependency Hash after each reinstall. To easier that process you can set a new script in your `package.json` scripts section, which you simply execute before each UI tests run (see [Example](#example) bellow).

### Example
Example how to use this library in day-2-day work in some project where you want to write UI tests with usage of `vscode-extension-tester` testing framework and `vscode-uitests-tooling` utils package.

1. Git clone `vscode-uitests-tooling` on same dir level as your project
    ```
    git clone -b git-devel https://github.com/djelinek/vscode-uitests-tooling.git
    ```

2. Modify `package.json` scripts section and add new scripts which will handle
    - common execution of UI tests via extester - `"uitest-run": ...`
    - execution of UI tests used for CI which will always install latest version of `vscode-uitests-tooling` package from Git repository - `"ci-test": ...`
    - local develop of UI tests with link to `vscode-uitests-tooling` package - `"ui-test": ...`

		```
		"scripts": {
			"uitest-run": "extest setup-and-run './out/src/ui-test/*extension_test.js'",
			"ci-test": "npm i -D djelinek/vscode-uitests-tooling#git-devel --no-save && npm run uitest-run",
			"preui-test": "cd ../vscode-uitests-tooling && npm run dev",
			"ui-test": "rimraf node_modules/vscode-uitests-tooling && npm link vscode-uitests-tooling --install-links && npm run uitest-run"
		},
		```
		_More info about setup of extester run script_ - see [Test setup](https://github.com/redhat-developer/vscode-extension-tester/wiki/Test-Setup).
3. update all CI config files to use new `ci-test` script (e.g. `.github/wokflows/**.yml`)
4. Run UI tests
	- execute ```npm run ui-test``` to run tests with current local modifications of utils package
	- execute ```npm run ci-test``` to run tests with actual GIT version of utils package

You can find full history of migration changes for whole described Example approach [HERE](https://github.com/djelinek/camel-lsp-client-vscode/commit/ab5544262bcdbd03c91a3b2825b217b35bf136d6)

In case you don't like to have these kind of script changes in your `package.json` file. You can still have local clone of this package outside of root project with UI tests and you need to only follow [Build local changes](#build-local-changes) before each tests execution.

## Contribution
Did you found some bug? Are you missing some feature? Please feel free to open new [Issue](https://github.com/djelinek/vscode-uitests-tooling/issues) or [Create PR](https://github.com/djelinek/vscode-uitests-tooling/pulls) to our GitHub repository.
