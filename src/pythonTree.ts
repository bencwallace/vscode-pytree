import * as fs from 'fs';
import * as path from 'path';
import * as vscode from 'vscode';

import * as Parser from 'web-tree-sitter';

export class PythonTreeProvider implements vscode.TreeDataProvider<PythonTreeItem> {
    parser?: Parser

    constructor() {
        console.log("constructing python provider");
        this.parser = undefined;
    }

    async initParser() {
        console.log("initializing python provider");
        await Parser.init();
        this.parser = new Parser();
        const pythonPath = path.join(__dirname, "tree-sitter-python.wasm");
        console.log(`loading python language from ${pythonPath}`)
        const Python = await Parser.Language.load(pythonPath);
        this.parser.setLanguage(Python);
        console.log("python provider initialized");
    }

    getTreeItem(element: PythonTreeItem): vscode.TreeItem | Thenable<vscode.TreeItem> {
        return element;
    }

    getChildren(element?: PythonTreeItem | undefined): vscode.ProviderResult<PythonTreeItem[]> {
        if (element) {
            return element.getChildren();
        } else {
            const testPath = 'test.py';
            try {
                fs.accessSync(testPath);
            } catch (err) {
                console.log('Path ', testPath, ' does not exist.');
                throw err;
            }
            console.log('Path ', testPath, ' exists.');
            const sourceCode = fs.readFileSync(testPath).toString();
            console.log(sourceCode);

            const tree = this.parser.parse(sourceCode);
            const rootNode = tree.rootNode;
            return [new PythonTreeItem(rootNode)];
        }
    }
}

class PythonTreeItem extends vscode.TreeItem {
    constructor(private node: Parser.SyntaxNode) {
        super(node.type, node.children.length > 0 ? vscode.TreeItemCollapsibleState.Collapsed: vscode.TreeItemCollapsibleState.None);
    }

    getChildren(): PythonTreeItem[] {
        return this.node.children.map((child) => new PythonTreeItem(child) )
    }
}
