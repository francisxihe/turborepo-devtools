import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';

interface TurboConfig {
    pipeline: Record<string, any>;
}

interface PackageJson {
    name: string;
    scripts?: Record<string, string>;
    workspaces?: string[];
}

interface WorkspaceInfo {
    name: string;
    path: string;
    scripts: Record<string, string>;
    type: 'app' | 'package' | 'other';
}

interface ProjectInfo {
    workspaces: WorkspaceInfo[];
    turboConfig: TurboConfig | null;
    packageManager: string;
    turboTasks: string[];
}

export class TurborepoDevtoolsPanel {
    public static currentPanel: TurborepoDevtoolsPanel | undefined;
    public static readonly viewType = 'turborepoDevtools';

    private readonly _panel: vscode.WebviewPanel;
    private readonly _extensionUri: vscode.Uri;
    private _disposables: vscode.Disposable[] = [];
    private _workspaces: WorkspaceInfo[] = [];
    private _turboConfig: TurboConfig | null = null;

    public static createOrShow(extensionUri: vscode.Uri) {
        const column = vscode.window.activeTextEditor
            ? vscode.window.activeTextEditor.viewColumn
            : undefined;

        if (TurborepoDevtoolsPanel.currentPanel) {
            TurborepoDevtoolsPanel.currentPanel._panel.reveal(column);
            return;
        }

        const panel = vscode.window.createWebviewPanel(
            TurborepoDevtoolsPanel.viewType,
            'Turborepo DevTools',
            column || vscode.ViewColumn.One,
            {
                enableScripts: true,
                localResourceRoots: [
                    vscode.Uri.joinPath(extensionUri, 'webview', 'dist')
                ],
                retainContextWhenHidden: true
            }
        );

        TurborepoDevtoolsPanel.currentPanel = new TurborepoDevtoolsPanel(panel, extensionUri);
    }

    private constructor(panel: vscode.WebviewPanel, extensionUri: vscode.Uri) {
        this._panel = panel;
        this._extensionUri = extensionUri;

        // 先设置HTML内容
        this._update();

        this._panel.onDidDispose(() => this.dispose(), null, this._disposables);

        this._panel.webview.onDidReceiveMessage(
            (message: any) => {
                switch (message.command) {
                    case 'runCommand':
                        this._runCommand(message.script);
                        return;
                    case 'runCommandWithOutput':
                        this._runCommandWithOutput(message.script, message.messageId);
                        return;
                    case 'refresh':
                        this._handleRefresh();
                        return;
                    case 'openWorkspace':
                        this._openWorkspaceInExplorer(message.workspacePath);
                        return;
                    case 'ready':
                        // 前端准备好后，发送项目信息
                        console.log('前端已准备好，开始加载项目信息');
                        this._loadProjectInfo();
                        this._sendProjectInfo();
                        return;
                }
            },
            null,
            this._disposables
        );
    }

    public dispose() {
        TurborepoDevtoolsPanel.currentPanel = undefined;

        this._panel.dispose();

        while (this._disposables.length) {
            const x = this._disposables.pop();
            if (x) {
                x.dispose();
            }
        }
    }

    private async _handleRefresh() {
        try {
            this._panel.webview.postMessage({
                command: 'showRefreshStatus',
                status: 'refreshing'
            });

            await this._loadProjectInfo();
            this._sendProjectInfo();

            this._panel.webview.postMessage({
                command: 'showRefreshStatus',
                status: 'completed'
            });

            vscode.window.showInformationMessage('🔄 项目信息刷新完成！');
        } catch (error) {
            console.error('刷新失败:', error);
            this._panel.webview.postMessage({
                command: 'showRefreshStatus',
                status: 'error'
            });
            vscode.window.showErrorMessage('刷新失败: ' + String(error));
        }
    }

    private _openWorkspaceInExplorer(workspacePath: string) {
        const workspaceFolder = vscode.workspace.workspaceFolders?.[0];
        if (!workspaceFolder) {
            vscode.window.showErrorMessage('未找到工作区文件夹');
            return;
        }

        const fullPath = path.join(workspaceFolder.uri.fsPath, workspacePath);
        const uri = vscode.Uri.file(fullPath);
        
        vscode.commands.executeCommand('revealFileInOS', uri).then(() => {
            vscode.window.showInformationMessage(`📁 已在文件管理器中打开: ${workspacePath}`);
        }, (error) => {
            console.error('打开文件夹失败:', error);
            vscode.window.showErrorMessage('打开文件夹失败: ' + String(error));
        });
    }

    private _loadProjectInfo() {
        const workspaceFolder = vscode.workspace.workspaceFolders?.[0];
        if (!workspaceFolder) {
            console.log('未找到工作区文件夹');
            return;
        }

        const rootPath = workspaceFolder.uri.fsPath;
        console.log('项目根路径:', rootPath);
        
        try {
            const packageJsonPath = path.join(rootPath, 'package.json');
            console.log('尝试读取 package.json:', packageJsonPath);
            
            if (!fs.existsSync(packageJsonPath)) {
                console.log('package.json 不存在');
                return;
            }
            
            const packageJsonContent = fs.readFileSync(packageJsonPath, 'utf8');
            const packageJson: PackageJson = JSON.parse(packageJsonContent);
            console.log('package.json 内容:', packageJson);

            try {
                const turboJsonPath = path.join(rootPath, 'turbo.json');
                console.log('尝试读取 turbo.json:', turboJsonPath);
                
                if (fs.existsSync(turboJsonPath)) {
                    const turboJsonContent = fs.readFileSync(turboJsonPath, 'utf8');
                    this._turboConfig = JSON.parse(turboJsonContent);
                    console.log('turbo.json 配置:', this._turboConfig);
                } else {
                    console.log('turbo.json 文件不存在');
                }
            } catch (error) {
                console.log('读取 turbo.json 失败:', error);
            }

            this._workspaces = [];
            if (packageJson.workspaces) {
                console.log('发现工作区配置:', packageJson.workspaces);
                for (const workspace of packageJson.workspaces) {
                    this._scanWorkspace(rootPath, workspace);
                }
            } else {
                console.log('未找到工作区配置');
            }
            
            console.log('扫描到的工作区:', this._workspaces);
        } catch (error) {
            console.error('读取项目信息失败:', error);
        }
    }

    private _scanWorkspace(rootPath: string, workspacePattern: string) {
        try {
            const glob = require('glob');
            const workspacePaths = glob.sync(workspacePattern, { cwd: rootPath });
            
            console.log(`工作区模式 "${workspacePattern}" 匹配到:`, workspacePaths);
            
            for (const workspacePath of workspacePaths) {
                this._scanSingleWorkspace(rootPath, workspacePath);
            }
        } catch (error) {
            console.error(`扫描工作区 "${workspacePattern}" 失败:`, error);
            this._fallbackScanWorkspace(rootPath, workspacePattern);
        }
    }

    private _scanSingleWorkspace(rootPath: string, workspacePath: string) {
        const fullWorkspacePath = path.join(rootPath, workspacePath);
        const packageJsonPath = path.join(fullWorkspacePath, 'package.json');
        
        // 首先检查当前路径是否有package.json
        if (fs.existsSync(packageJsonPath)) {
            try {
                const packageJsonContent = fs.readFileSync(packageJsonPath, 'utf8');
                const packageJson: PackageJson = JSON.parse(packageJsonContent);
                
                const workspaceInfo: WorkspaceInfo = {
                    name: packageJson.name || path.basename(workspacePath),
                    path: workspacePath,
                    scripts: packageJson.scripts || {},
                    type: this._determineWorkspaceType(workspacePath, packageJson)
                };
                
                this._workspaces.push(workspaceInfo);
                console.log(`添加工作区: ${workspaceInfo.name} (${workspaceInfo.type})`);
                return; // 找到package.json就返回，不再递归
            } catch (error) {
                console.error(`解析 ${packageJsonPath} 失败:`, error);
            }
        }
        
        // 如果当前路径没有package.json，但是是一个目录，则递归扫描子目录
        if (fs.existsSync(fullWorkspacePath) && fs.statSync(fullWorkspacePath).isDirectory()) {
            try {
                const items = fs.readdirSync(fullWorkspacePath);
                
                for (const item of items) {
                    const itemPath = path.join(fullWorkspacePath, item);
                    const itemPackageJsonPath = path.join(itemPath, 'package.json');
                    
                    // 检查子目录是否有package.json
                    if (fs.existsSync(itemPackageJsonPath) && fs.statSync(itemPath).isDirectory()) {
                        try {
                            const packageJsonContent = fs.readFileSync(itemPackageJsonPath, 'utf8');
                            const packageJson: PackageJson = JSON.parse(packageJsonContent);
                            
                            const relativePath = path.relative(rootPath, itemPath);
                            const workspaceInfo: WorkspaceInfo = {
                                name: packageJson.name || item,
                                path: relativePath,
                                scripts: packageJson.scripts || {},
                                type: this._determineWorkspaceType(relativePath, packageJson)
                            };
                            
                            this._workspaces.push(workspaceInfo);
                            console.log(`添加嵌套工作区: ${workspaceInfo.name} (${workspaceInfo.type}) 路径: ${relativePath}`);
                        } catch (error) {
                            console.error(`解析嵌套 ${itemPackageJsonPath} 失败:`, error);
                        }
                    }
                }
            } catch (error) {
                console.error(`扫描目录 ${fullWorkspacePath} 失败:`, error);
            }
        } else {
            console.log(`跳过 ${workspacePath}，未找到 package.json 且不是目录`);
        }
    }

    private _determineWorkspaceType(workspacePath: string, packageJson: PackageJson): 'app' | 'package' | 'other' {
        if (workspacePath.includes('apps/') || workspacePath.includes('app/')) {
            return 'app';
        }
        
        if (workspacePath.includes('packages/') || workspacePath.includes('libs/')) {
            return 'package';
        }
        
        if (packageJson.scripts && (packageJson.scripts.dev || packageJson.scripts.start)) {
            return 'app';
        }
        
        return 'other';
    }

    private _fallbackScanWorkspace(rootPath: string, workspacePattern: string) {
        try {
            console.log(`使用备用方法扫描工作区: ${workspacePattern}`);
            
            const possiblePaths = [
                path.join(rootPath, workspacePattern),
                path.join(rootPath, workspacePattern.replace('/*', '')),
            ];
            
            for (const possiblePath of possiblePaths) {
                if (fs.existsSync(possiblePath) && fs.statSync(possiblePath).isDirectory()) {
                    const items = fs.readdirSync(possiblePath);
                    
                    for (const item of items) {
                        const itemPath = path.join(possiblePath, item);
                        const packageJsonPath = path.join(itemPath, 'package.json');
                        
                        if (fs.existsSync(packageJsonPath) && fs.statSync(itemPath).isDirectory()) {
                            try {
                                const packageJsonContent = fs.readFileSync(packageJsonPath, 'utf8');
                                const packageJson: PackageJson = JSON.parse(packageJsonContent);
                                
                                const relativePath = path.relative(rootPath, itemPath);
                                const workspaceInfo: WorkspaceInfo = {
                                    name: packageJson.name || item,
                                    path: relativePath,
                                    scripts: packageJson.scripts || {},
                                    type: this._determineWorkspaceType(relativePath, packageJson)
                                };
                                
                                this._workspaces.push(workspaceInfo);
                                console.log(`备用方法添加工作区: ${workspaceInfo.name} (${workspaceInfo.type})`);
                            } catch (error) {
                                console.error(`备用方法解析 ${packageJsonPath} 失败:`, error);
                            }
                        }
                    }
                }
            }
        } catch (error) {
            console.error(`备用扫描工作区失败:`, error);
        }
    }

    private _update() {
        this._panel.webview.html = this._getHtmlForWebview(this._panel.webview);
        this._sendProjectInfo();
    }

    private _sendProjectInfo() {
        const projectInfo: ProjectInfo = {
            workspaces: this._workspaces,
            turboConfig: this._turboConfig,
            packageManager: this._detectPackageManager(),
            turboTasks: this._getTurboTasks()
        };

        this._panel.webview.postMessage({
            command: 'updateProjectInfo',
            data: projectInfo
        });
    }

    private _runCommand(command: string) {
        const terminal = vscode.window.createTerminal('Turborepo DevTools');
        terminal.show();
        terminal.sendText(command);
        
        vscode.window.showInformationMessage(`🚀 正在执行: ${command}`);
    }

    private async _runCommandWithOutput(command: string, messageId: string) {
        try {
            const workspaceFolder = vscode.workspace.workspaceFolders?.[0];
            if (!workspaceFolder) {
                this._panel.webview.postMessage({
                    command: 'commandOutput',
                    messageId,
                    error: '未找到工作区文件夹'
                });
                return;
            }

            console.log(`执行命令: ${command}, messageId: ${messageId}`);

            const { exec } = require('child_process');
            
            // 使用Promise包装exec，提供更好的错误处理
            const executeCommand = () => {
                return new Promise<string>((resolve, reject) => {
                    const process = exec(command, {
                        cwd: workspaceFolder.uri.fsPath,
                        timeout: 30000, // 30秒超时
                        maxBuffer: 1024 * 1024 * 10 // 10MB buffer
                    }, (error: any, stdout: string, stderr: string) => {
                        if (error) {
                            console.error(`命令执行错误: ${error.message}`);
                            // 如果有stderr输出，优先返回stderr
                            if (stderr) {
                                reject(new Error(stderr));
                            } else {
                                reject(error);
                            }
                        } else {
                            // 返回stdout，如果为空则返回stderr
                            const output = stdout || stderr || '';
                            console.log(`命令输出长度: ${output.length}`);
                            resolve(output);
                        }
                    });

                    // 手动处理超时
                    setTimeout(() => {
                        process.kill('SIGTERM');
                        reject(new Error('命令执行超时 (30秒)'));
                    }, 30000);
                });
            };

            const output = await executeCommand();
            
            console.log(`命令执行成功，输出: ${output.substring(0, 200)}...`);
            
            this._panel.webview.postMessage({
                command: 'commandOutput',
                messageId,
                output: output
            });

        } catch (error: any) {
            console.error(`命令执行失败: ${error.message}`);
            this._panel.webview.postMessage({
                command: 'commandOutput',
                messageId,
                error: error.message || String(error)
            });
        }
    }

    private _getTurboTasks(): string[] {
        if (!this._turboConfig || !this._turboConfig.pipeline) {
            return [];
        }
        
        return Object.keys(this._turboConfig.pipeline);
    }

    private _getHtmlForWebview(webview: vscode.Webview) {
        const webviewDistPath = vscode.Uri.joinPath(this._extensionUri, 'webview', 'dist');
        const indexHtmlPath = vscode.Uri.joinPath(webviewDistPath, 'index.html');
        
        try {
            if (fs.existsSync(indexHtmlPath.fsPath)) {
                let html = fs.readFileSync(indexHtmlPath.fsPath, 'utf8');
                
                // 替换资源路径为 webview 可访问的路径
                const assetsPath = webview.asWebviewUri(vscode.Uri.joinPath(webviewDistPath, 'assets'));
                html = html.replace(/\.\/assets\//g, `${assetsPath.toString()}/`);
                
                // 添加 CSP meta 标签
                const csp = `<meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src ${webview.cspSource} 'unsafe-inline'; script-src ${webview.cspSource} 'unsafe-inline' 'wasm-unsafe-eval'; font-src ${webview.cspSource}; img-src ${webview.cspSource} data: blob:; connect-src ${webview.cspSource};">`;
                html = html.replace('<head>', `<head>\n    ${csp}`);
                
                return html;
            }
        } catch (error) {
            console.error('读取构建后的 HTML 失败:', error);
        }
        
        // 如果构建后的文件不存在，返回开发提示
        return this._getDevHtml();
    }

    private _getDevHtml(): string {
        return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Turborepo DevTools</title>
    <style>
        body {
            font-family: var(--vscode-font-family);
            padding: 40px;
            color: var(--vscode-foreground);
            background-color: var(--vscode-editor-background);
            text-align: center;
        }
        .container {
            max-width: 600px;
            margin: 0 auto;
        }
        .title {
            font-size: 24px;
            margin-bottom: 20px;
            color: var(--vscode-textLink-foreground);
        }
        .message {
            font-size: 16px;
            line-height: 1.6;
            margin-bottom: 30px;
            color: var(--vscode-descriptionForeground);
        }
        .code {
            background-color: var(--vscode-textBlockQuote-background);
            padding: 15px;
            border-radius: 4px;
            font-family: monospace;
            margin: 10px 0;
            border-left: 4px solid var(--vscode-textLink-foreground);
        }
    </style>
</head>
<body>
    <div class="container">
        <h1 class="title">🚀 Turborepo DevTools</h1>
        <div class="message">
            <p>React 前端尚未构建。请运行以下命令来构建前端：</p>
            <div class="code">cd webview && pnpm install && pnpm run build</div>
            <p>然后重新打开此面板。</p>
        </div>
    </div>
</body>
</html>`;
    }

    private _detectPackageManager(): string {
        const workspaceFolder = vscode.workspace.workspaceFolders?.[0];
        if (!workspaceFolder) {
            return 'npm';
        }

        const rootPath = workspaceFolder.uri.fsPath;
        
        if (fs.existsSync(path.join(rootPath, 'pnpm-lock.yaml'))) {
            return 'pnpm';
        } else if (fs.existsSync(path.join(rootPath, 'yarn.lock'))) {
            return 'yarn';
        } else {
            return 'npm';
        }
    }
} 