import * as vscode from 'vscode';

import { PythonTreeProvider } from './pythonTree';

export function activate(context: vscode.ExtensionContext) {
	console.log('vscode-pytree extension activated');

	const pythonTreeProvider = new PythonTreeProvider();
	pythonTreeProvider.initParser().then(() => {
		console.log("registering python provider");
		vscode.window.registerTreeDataProvider('pythonTree', pythonTreeProvider);
	});
}

// This method is called when your extension is deactivated
export function deactivate() {}
