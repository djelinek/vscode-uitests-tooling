[![License](https://img.shields.io/badge/license-Apache%202.0-blue.svg)]()

# vscode-uitests-tooling
UI Tests Tooling for VS Code extensions is a package built on [VS Code Extension Tester](https://github.com/jrichter1/vscode-extension-tester). It provides more specific functions, wait conditions, sets of features and others for testing of VS Code extensions.

## Usage
First simply install _vscode-extension-tester_ into your extension devDependencies:

```
npm install -D vscode-extension-tester
```

Then install _vscode-uitests-tooling_ into your extension devDependencies:

```
npm install -D vscode-uitests-tooling
```

After that just setup ui-test run script and thats all. (see [Test setup](https://github.com/jrichter1/vscode-extension-tester/wiki/Test-Setup)).

## Contribution
If you want to provide any new functionality, please create Issue or PR to this repository.

### Local development steps
These are necessary steps for local contribution and testing of _vscode-uitests-tooling_ package. The 'npm pack' step is very important, because of peerDependency on _vscode-extension-tester_.

vscode-uitests-tooling
1. npm run clean
2. npm install
3. npm run compile
4. npm pack

tested extension
1. rm -rf _node_modules/_ _package-lock.json_
2. npm install -D _file:../vscode-uitests-tooling/vscode-uitests-tooling-1.0.0.tgz_