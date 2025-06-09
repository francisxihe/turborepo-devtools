import { create } from 'zustand';
import { ProjectInfo, WorkspaceInfo, VSCodeAPI } from './types';

interface AppState {
  projectInfo: ProjectInfo | null;
  isLoading: boolean;
  vscodeApi: VSCodeAPI | null;
  
  // Actions
  setProjectInfo: (info: ProjectInfo) => void;
  setLoading: (loading: boolean) => void;
  initVSCodeApi: () => void;
  runCommand: (command: string) => void;
  runCommandWithOutput: (command: string) => Promise<string>;
  refresh: () => void;
  openWorkspace: (workspacePath: string) => void;
}

export const useAppStore = create<AppState>((set, get) => ({
  projectInfo: null,
  isLoading: false,
  vscodeApi: null,

  setProjectInfo: (info) => set({ projectInfo: info }),
  setLoading: (loading) => set({ isLoading: loading }),
  
  initVSCodeApi: () => {
    if (typeof window !== 'undefined' && window.acquireVsCodeApi) {
      const api = window.acquireVsCodeApi();
      set({ vscodeApi: api });
      
      // 监听来自VSCode的消息
      window.addEventListener('message', (event) => {
        const message = event.data;
        console.log('收到VSCode消息:', message);
        
        switch (message.command) {
          case 'updateProjectInfo':
            console.log('更新项目信息:', message.data);
            set({ projectInfo: message.data, isLoading: false });
            break;
          case 'showRefreshStatus':
            console.log('刷新状态:', message.status);
            if (message.status === 'refreshing') {
              set({ isLoading: true });
            } else {
              set({ isLoading: false });
            }
            break;
          case 'commandOutput':
            console.log('命令输出消息:', message);
            // 这个消息会被runCommandWithOutput中的监听器处理
            break;
          default:
            console.log('未知消息类型:', message.command);
        }
      });
      
      // 通知后端前端已准备好
      setTimeout(() => {
        console.log('发送ready消息到后端');
        api.postMessage({ command: 'ready' });
      }, 100);
    }
  },

  runCommand: (command) => {
    const { vscodeApi } = get();
    if (vscodeApi) {
      vscodeApi.postMessage({
        command: 'runCommand',
        script: command
      });
    }
  },

  runCommandWithOutput: (command) => {
    return new Promise((resolve, reject) => {
      const { vscodeApi } = get();
      if (!vscodeApi) {
        reject(new Error('VSCode API not available'));
        return;
      }

      const messageId = Date.now().toString();
      
      // 监听命令输出
      const handleMessage = (event: MessageEvent) => {
        const message = event.data;
        if (message.command === 'commandOutput' && message.messageId === messageId) {
          window.removeEventListener('message', handleMessage);
          if (message.error) {
            reject(new Error(message.error));
          } else {
            resolve(message.output);
          }
        }
      };

      window.addEventListener('message', handleMessage);

      // 发送命令
      vscodeApi.postMessage({
        command: 'runCommandWithOutput',
        script: command,
        messageId
      });

      // 设置超时
      setTimeout(() => {
        window.removeEventListener('message', handleMessage);
        reject(new Error('Command timeout'));
      }, 30000);
    });
  },

  refresh: () => {
    const { vscodeApi } = get();
    if (vscodeApi) {
      set({ isLoading: true });
      vscodeApi.postMessage({
        command: 'refresh'
      });
    }
  },

  openWorkspace: (workspacePath) => {
    const { vscodeApi } = get();
    if (vscodeApi) {
      vscodeApi.postMessage({
        command: 'openWorkspace',
        workspacePath
      });
    }
  }
})); 