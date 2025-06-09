import React from 'react';
import { Card, Button, Space, Typography } from '@arco-design/web-react';
import { IconDownload, IconSync, IconDelete } from '@arco-design/web-react/icon';
import { useAppStore } from '../store';

const { Text } = Typography;

const PackageManager: React.FC = () => {
  const { projectInfo, runCommand } = useAppStore();

  if (!projectInfo) {
    return null;
  }

  const { packageManager } = projectInfo;

  return (
    <Card 
      title="包管理" 
      style={{ 
        background: 'var(--vscode-editor-background)',
        border: '1px solid var(--vscode-panel-border)',
        borderRadius: '8px'
      }}
      headerStyle={{
        background: 'var(--vscode-sideBar-background)',
        color: 'var(--vscode-sideBarTitle-foreground)',
        borderBottom: '1px solid var(--vscode-panel-border)'
      }}
      bodyStyle={{
        background: 'var(--vscode-editor-background)',
        color: 'var(--vscode-editor-foreground)'
      }}
    >
      <div style={{ marginBottom: '16px' }}>
        <div style={{ 
          color: 'var(--vscode-descriptionForeground)',
          padding: '8px 12px',
          background: 'var(--vscode-list-hoverBackground)',
          borderRadius: '4px',
          border: '1px solid var(--vscode-panel-border)',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <span style={{ fontSize: '16px' }}>🛠️</span>
          <span>使用</span>
          <span style={{ 
            background: 'var(--vscode-badge-background)',
            color: 'var(--vscode-badge-foreground)',
            padding: '2px 8px',
            borderRadius: '12px',
            fontSize: '12px',
            fontWeight: '500'
          }}>
            {packageManager}
          </span>
          <span>管理项目依赖</span>
        </div>
      </div>
      
      <Space wrap>
        <Button
          type="primary"
          icon={<IconDownload />}
          onClick={() => runCommand(`${packageManager} install`)}
          style={{
            background: 'var(--vscode-button-background)',
            color: 'var(--vscode-button-foreground)',
            border: `1px solid var(--vscode-button-border)`,
            borderRadius: '6px',
            padding: '8px 16px',
            fontWeight: '500'
          }}
        >
          安装依赖
        </Button>
        
        <Button
          type="default"
          icon={<IconSync />}
          onClick={() => runCommand(`${packageManager} update`)}
          style={{
            background: 'var(--vscode-button-secondaryBackground)',
            color: 'var(--vscode-button-secondaryForeground)',
            border: `1px solid var(--vscode-button-border)`,
            borderRadius: '6px',
            padding: '8px 16px'
          }}
        >
          更新依赖
        </Button>
        
        <Button
          type="outline"
          onClick={() => runCommand(`${packageManager} outdated`)}
          style={{
            background: 'var(--vscode-button-secondaryBackground)',
            color: 'var(--vscode-button-secondaryForeground)',
            border: `1px solid var(--vscode-button-border)`,
            borderRadius: '6px',
            padding: '8px 16px'
          }}
        >
          检查过期依赖
        </Button>
        
        <Button
          type="outline"
          icon={<IconDelete />}
          onClick={() => runCommand('turbo prune')}
          style={{
            background: 'var(--vscode-button-secondaryBackground)',
            color: 'var(--vscode-button-secondaryForeground)',
            border: `1px solid var(--vscode-button-border)`,
            borderRadius: '6px',
            padding: '8px 16px'
          }}
        >
          清理 Turbo 缓存
        </Button>
      </Space>
    </Card>
  );
};

export default PackageManager; 