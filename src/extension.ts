import * as path from 'path';
import * as vscode from 'vscode';

import * as Parser from 'web-tree-sitter';

import { PythonTreeProvider } from './pythonTree';

export function activate(context: vscode.ExtensionContext) {
	console.log('vscode-pytree extension activated');

	Parser.init().then(() => {
		const pythonPath = path.join(__dirname, "tree-sitter-python.wasm");
		Parser.Language.load(pythonPath).then((lang) => {
			const pythonTreeProvider = new PythonTreeProvider(new Parser(), lang);
			console.log("python provider initialized");
			vscode.window.registerTreeDataProvider('pythonTree', pythonTreeProvider);
		});
	})
}

// This method is called when your extension is deactivated
export function deactivate() {}
