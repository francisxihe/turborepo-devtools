import * as vscode from 'vscode';
import { TurborepoDevtoolsPanel } from './panel';

export function activate(context: vscode.ExtensionContext) {
    console.log('🚀 Turborepo DevTools 插件开始激活');
    
    // 立即显示激活消息
    vscode.window.showInformationMessage('🎉 Turborepo DevTools 扩展已激活！');
    
    const disposable = vscode.commands.registerCommand('turborepoDevtools.showPanel', () => {
        console.log('📋 用户点击了 showPanel 命令');
        
        // 显示一个简单的消息确认命令被执行
        vscode.window.showInformationMessage('正在打开 Turborepo DevTools 面板...');
        
        try {
            TurborepoDevtoolsPanel.createOrShow(context.extensionUri);
            console.log('✅ 面板创建成功');
        } catch (error) {
            console.error('❌ 创建面板失败:', error);
            vscode.window.showErrorMessage('创建面板失败: ' + String(error));
        }
    });

    context.subscriptions.push(disposable);
    console.log('✅ 命令注册完成，插件激活成功');
}

export function deactivate() {
    console.log('🔄 Turborepo DevTools 插件已停用');
} 