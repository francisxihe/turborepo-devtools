export interface WorkspaceInfo {
  name: string;
  path: string;
  scripts: Record<string, string>;
  type: 'app' | 'package' | 'other';
}

export interface TurboConfig {
  pipeline: Record<string, any>;
}

export interface ProjectInfo {
  workspaces: WorkspaceInfo[];
  turboConfig: TurboConfig | null;
  packageManager: string;
  turboTasks: string[];
}

export interface VSCodeAPI {
  postMessage: (message: any) => void;
  getState: () => any;
  setState: (state: any) => void;
}

declare global {
  interface Window {
    acquireVsCodeApi: () => VSCodeAPI;
  }
} 