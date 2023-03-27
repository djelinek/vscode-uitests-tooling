'use strict';

export * from 'vscode-extension-tester';

/**
 * components
 */
export { ActivityBar } from './components/activityBar/ActivityBar';

export { OutputView } from './components/bottomBar/OutputView';

export * from './components/custom/CommandPalette';
export * from './components/custom/Marketplace';
export * from './components/custom/Project';

export * from './components/dialog/InputBoxOpenDialogs';
export * from './components/dialog/IOpenDialog';

export { ContentAssist } from './components/editor/ContentAssist';
export { TextEditor } from './components/editor/TextEditor';

export { StatusBar } from './components/statusBar/StatusBar';

export { Input } from './components/workbench/Input';
export * from './components/workbench/NotificationCenter';
export { Workbench } from './components/workbench/Workbench';

/**
 * conditions
 */
export * from './conditions/DefaultWait';
export * from './conditions/NotificationWait';
export * from './conditions/Repeat';
export * from './conditions/TimeoutPromise';
export * from './conditions/WaitUntil';

/**
 * extensions - Camel Tooling for VSCode 
 */
// export * as camelk from './extensions/camelk';
// export * as dap from './extensions/dap';
// export * as lsp from './extensions/lsp';

/**
 * utils
 */
export * from './utils/FileSystem';
export * from './utils/LogAnalyzer';
export * from './utils/PathUtils';
export * as errors from './utils/Errors';
