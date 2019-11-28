[![npm version](https://badge.fury.io/js/vscode-uitests-tooling.svg?style=flat)](https://badge.fury.io/js/vscode-uitests-tooling) [![contributions welcome](https://img.shields.io/badge/contributions-welcome-brightgreen.svg?style=flat)](https://github.com/djelinek/vscode-uitests-tooling/issues) [![License](https://img.shields.io/badge/license-Apache%202.0-blue.svg?style=flat)](https://github.com/djelinek/vscode-uitests-tooling/blob/master/LICENSE)

# vscode-uitests-tooling
UI Tests Tooling for VS Code extensions is a package built on [VS Code Extension Tester](https://github.com/redhat-developer/vscode-extension-tester). It provides more specific functions, wait conditions, sets of features and others for testing of VS Code extensions.

## Usage
First simply install _vscode-extension-tester_ into your extension devDependencies:

```
> npm install -D vscode-extension-tester
```

Then install _vscode-uitests-tooling_ into your extension devDependencies:

```
> npm install -D vscode-uitests-tooling
```

After that just setup ui-test run script and thats all. (see [Test setup](https://github.com/redhat-developer/vscode-extension-tester/wiki/Test-Setup)).

## Contribution
If you want to provide any new functionality, please create Issue or PR to this repository.

### Local development steps
These are necessary steps for local contribution and testing of _vscode-uitests-tooling_ package. The ```npm pack``` step is very important, because of peerDependency on _vscode-extension-tester_.

##### Inside _vscode-uitests-tooling_ package run
```
> npm run dev
```

##### Inside developed extension run
```
> npm uninstall -D vscode-uitests-tooling
> npm install -D file:../vscode-uitests-tooling/vscode-uitests-tooling-2.0.0.tgz
```