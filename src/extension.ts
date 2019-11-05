import * as vscode from 'vscode';
import * as http from 'http';

let server: http.Server | undefined = undefined;

export function activate(context: vscode.ExtensionContext) {
	server = http.createServer((req, res) => {
	});

	server.listen(vscode.workspace.getConfiguration('openInEditor').get('port'));
}

// this method is called when your extension is deactivated
export function deactivate() {
	if (server) {
		server.close();
	}
}
