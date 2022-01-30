// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "documentation-generator" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	let disposable = vscode.commands.registerCommand('documentation-generator.DGFlutterDoc', async () => {
		// The code you place here will be executed every time your command is executed
		const fs = require('fs');
		var path = require('path');
		const yaml = require('js-yaml');
		const dirTree = require("directory-tree");
		const options: vscode.OpenDialogOptions = {
			canSelectMany: false,
			openLabel: 'Open',
			canSelectFolders: true
		};
		
		const dir = await vscode.window.showOpenDialog(options);

		const pubspec = yaml.load(fs.readFileSync(dir![0].fsPath+'/pubspec.yaml', 'utf8'));

		let text = "# "+ pubspec.name+" Documentation\n"+"###### Description : " + pubspec.description+"\n\n\n"+
		"## Project Tree\n```";
		let text2 = "";

		
		const tree = dirTree(dir![0].fsPath, {exclude:[/android/, /assets/, /build/, /documentation/, /ios/, /web/]});
		tree.children.forEach((element: { name: any; children: any }) => {
			if (element.name[0] !== '.' && element.name !== 'build') {
				text = text + "\n" + element.name;
				if(element.name.split('.').pop() === element.name){
					text2 = text2 + "| **" + element.name + "** |" + "|\n";
				}
				if (element.hasOwnProperty('children')) {
					element.children.forEach((element: { name: any; children: any }, index: number, array: string | any[]) => {
						if (element.name[0] !== '.') {
							if(element.name.split('.').pop() === element.name){
							text2 = text2 + "| **" + element.name + "** |" + "|\n";
							}
							if (index === (array.length - 1)) {
								text = text + "\n" + "└── " + element.name;
							} else {
								text = text + "\n" + "├── " + element.name;
							}
							if (element.hasOwnProperty('children')) {
								element.children.forEach((element: { name: any; children: any }, index: number, array: string | any[]) => {
									if (element.name[0] !== '.') {
										if(element.name.split('.').pop() === element.name){
										text2 = text2 + "| **" + element.name + "** |" + "|\n";
										}
										if (index === (array.length - 1)) {
											text = text + "\n" + "│   └── " + element.name;
										} else {
											text = text + "\n" + "│   ├── " + element.name;
										}
										if (element.hasOwnProperty('children')) {
											element.children.forEach((element: { name: any; children: any }, index: number, array: string | any[]) => {
												if (element.name[0] !== '.') {
													if(element.name.split('.').pop() === element.name){
													text2 = text2 + "| **" + element.name + "** |" + "|\n";
													}
													if (index === (array.length - 1)) {
														text = text + "\n" + "│   │   └── " + element.name;
													} else {
														text = text + "\n" + "│   │   ├── " + element.name;
													}
													if (element.hasOwnProperty('children')) {
														element.children.forEach((element: { name: any; children: any }, index: number, array: string | any[]) => {
															if (element.name[0] !== '.') {
																if(element.name.split('.').pop() === element.name){
																text2 = text2 + "| **" + element.name + "** |" + "|\n";
																}
																if (index === (array.length - 1)) {
																	text = text + "\n" + "│   │   │   └── " + element.name;
																} else {
																	text = text + "\n" + "│   │   │   ├── " + element.name;
																}

															}
														});
													}

												}
											});
										}
									}
								});
							}
						}
					});
				}
			}
		});
		text = text + "\n```";
		text = text + "\n## Directory Documentation\n";
		text = text + "|Directory Name|Details| \n";
		text = text + "|------------------------|--------------------------------------------|\n";
		text = text + text2;
		if (!fs.existsSync(dir![0].fsPath + "/documentation")) {
			fs.mkdirSync(dir![0].fsPath + "/documentation", { recursive: true });
		}
		fs.writeFile(dir![0].fsPath + "/documentation/doc-" + Date.now() + ".md", text, function (err: any) {
			if (err) {
				return vscode.window.showInformationMessage(err);
			} else {
				return vscode.window.showInformationMessage('Documentation Successfully Created !');
			}

		});

	});

	context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
export function deactivate() { }
