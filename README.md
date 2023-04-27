[![npm version](https://badge.fury.io/js/vscode-uitests-tooling.svg?style=flat)](https://badge.fury.io/js/vscode-uitests-tooling) [![contributions welcome](https://img.shields.io/badge/contributions-welcome-brightgreen.svg?style=flat)](https://github.com/djelinek/vscode-uitests-tooling/issues) [![License](https://img.shields.io/badge/license-Apache%202.0-blue.svg?style=flat)](https://github.com/djelinek/vscode-uitests-tooling/blob/master/LICENSE)

# vscode-uitests-tooling

UI Tests Tooling for VS Code extensions is a package built on [VS Code Extension Tester](https://github.com/redhat-developer/vscode-extension-tester). It provides more specific functions, wait conditions, sets of features and others for UI testing of VS Code extensions.

## Installation

- Install _vscode-uitests-tooling_ into your extension devDependencies:
  - from NPM registry
	```
	npm install --save-dev vscode-uitests-tooling
	```

## Local development

These are necessary steps for local contribution and writing tests with _vscode-uitests-tooling_ package.

### Build local changes

1. Inside `vscode-uitests-tooling` project execute prepared script, which will execute necessary steps
	```
	npm run dev
	```

2. **Only for the first time** - in project where you are writing tests, you need to link local version of `vscode-uitests-tooling` package
	```
	npm link vscode-uitests-tooling
	```

### Example
Example how to use this library in day-2-day work in some project where you want to write UI tests with usage of `vscode-extension-tester` testing framework and `vscode-uitests-tooling` utils package.

1. Git clone `vscode-uitests-tooling` on same dir level as your project
    ```
    git clone -b git https://github.com/djelinek/vscode-uitests-tooling.git
    ```

2. To run tests Use `npm --prefix ../vscode-uitests-tooling run dev && npm run ui-test`

You can find full history of migration changes for whole described Example approach [HERE]()

## Contribution

Did you found some bug? Are you missing some feature? Please feel free to open new [Issue](https://github.com/djelinek/vscode-uitests-tooling/issues) or [Create PR](https://github.com/djelinek/vscode-uitests-tooling/pulls) to our GitHub repository.
