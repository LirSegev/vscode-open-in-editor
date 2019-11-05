import * as vscode from 'vscode';
import * as http from 'http';
// @ts-ignore
import * as bodyJson from 'body/json';

let server: http.Server | undefined = undefined;

export function activate(context: vscode.ExtensionContext) {
	server = http.createServer((req, res) => {
		bodyJson(
			req,
			res,
			(err: Error, body: { path: string; line?: number; column?: number }) => {
				if (err) {
					console.error(err);
					res.statusCode = 400;
					res.end();
				} else {
					const { path, line, column } = body;
					vscode.workspace.openTextDocument(path).then(
						doc => {
							res.end();
							vscode.window.showTextDocument(doc).then(editor => {
								const position = new vscode.Position(line || 0, column || 0);
								editor.revealRange(
									new vscode.Range(position, position),
									vscode.TextEditorRevealType.InCenter
								);
								editor.selection = new vscode.Selection(position, position);
							});
						},
						err => {
							res.statusCode = 500;
							res.end();
							vscode.window.showErrorMessage(
								'Could not open document ' + body.path
							);
							console.error(err);
						}
					);
				}
			}
		);
	});

	server.listen(vscode.workspace.getConfiguration('openInEditor').get('port'));
}

// this method is called when your extension is deactivated
export function deactivate() {
	if (server) {
		server.close();
	}
}
