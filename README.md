<h1 align="center">
  <br>
  [Deprecated] UI tests Utils for Camel Tooling
</h1>

<p align="center">
  <a href="https://www.npmjs.com/package/vscode-uitests-tooling"><img src="https://img.shields.io/npm/v/vscode-uitests-tooling?label=npmjs&color=orange&style=for-the-badge" alt="UI tests Utils for Camel Tooling"/></a>
  <a href="https://github.com/djelinek/vscode-uitests-tooling/blob/main/LICENSE"><img src="https://img.shields.io/badge/license-Apache%202-blue.svg?style=for-the-badge&logo=appveyor" alt="License"/></a>
  <a href="https://github.com/djelinek/vscode-uitests-tooling/actions/workflows/main.yml"><img src="https://img.shields.io/github/actions/workflow/status/djelinek/vscode-uitests-tooling/main.yml?label=Main%20CI&style=for-the-badge" alt="Main CI"></a>
</p><br/>

<p align="center">
  <a href="#installation">Installation</a> •
  <a href="#local-development">Local Usage</a> •
  <a href="https://github.com/redhat-developer/vscode-extension-tester/wiki/">Documentation</a> •
  <a href="https://github.com/redhat-developer/vscode-extension-tester/blob/main/KNOWN_ISSUES.md">Known Issues</a>
</p>

<p align="center">
UI tests Utils for Camel tooling is a package built on <a href="https://github.com/redhat-developer/vscode-extension-tester">ExTester</a>. It provides more specific functions, wait conditions, sets of features and others for UI testing of <a href="https://github.com/camel-tooling">Camel Tooling extensions</a> for Visual Studio Code.
</p><br/>

## Installation

Install _vscode-uitests-tooling_ into your extension devDependencies:

```nodejs
npm install --save-dev vscode-uitests-tooling@latest
```

## Local development

These are necessary steps for local contribution and writing tests with _vscode-uitests-tooling_ package.

### Build local changes

1. Inside `vscode-uitests-tooling` project execute prepared script, which includes all necessary steps

    ```nodejs
    npm run dev
    ```

2. **Only for the first time** - inside project where you are writing tests, you need to link local version of `vscode-uitests-tooling` package

   ```nodejs
   npm link vscode-uitests-tooling
   ```

### Example

Example how to use this library in daily work in some project where you want to write UI tests with usage of `vscode-extension-tester` testing framework and `vscode-uitests-tooling` utils package.

1. Git clone `vscode-uitests-tooling` on same dir level as your project

   ```git
   git clone https://github.com/djelinek/vscode-uitests-tooling.git
   ```

2. Inside tests use only `import { XYZ } from 'vscode-uitests-tooling'` package to import all page-objects including `vscode-extension-tester` ones

3. To easily build made utils changes and run tests in one step you can use

   ```nodejs
   npm --prefix ../vscode-uitests-tooling run dev && npm run ui-test
   ```

## Migration to 3.0.0

In this version we are trying to simplify whole process of maintaining utils in one place and writing tests in another. To enable this approach we are now re-exporting whole `vscode-extension-tester` API which means this dependency is not required to be installed in destination where the tests are written because it will be provided as transitive dependency.

It also means that `vscode-extension-tester` version upgrades can be done only in one place and it will be propagated to all dependant proejcts.

To use `vscode-uitests-tooling` package in version 3.0.0 you need to change just few easy things and other should stay same.

1. Remove `ExTester` devDependency

   ```nodejs
   npm uninstall vscode-extension-tester
   ```

2. Install `UI tests Utils for Camel Tooling` package in version 3.0.0

   ```nodejs
   npm install -D vscode-uitests-tooling@3.0.0
   ```

3. Replace all `vscode-extension-tester` imports by `vscode-uitests-tooling`
4. Run tests!

## Contribution

Did you found some bug? Are you missing some feature? Please feel free to open new [Issue](https://github.com/djelinek/vscode-uitests-tooling/issues) or [Create PR](https://github.com/djelinek/vscode-uitests-tooling/pulls) to our GitHub repository.
