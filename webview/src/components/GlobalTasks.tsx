import React from 'react';
import { Card, Button, Space, Typography } from '@arco-design/web-react';
import { IconCaretRight, IconCode, IconBug, IconCheck, IconDelete } from '@arco-design/web-react/icon';
import { useAppStore } from '../store';

const { Text } = Typography;

const GlobalTasks: React.FC = () => {
  const { projectInfo, runCommand } = useAppStore();

  if (!projectInfo) {
    return null;
  }

  const { turboTasks } = projectInfo;

  const taskButtons = [
    { task: 'dev', label: '启动开发', icon: <IconCaretRight />, type: 'primary' as const },
    { task: 'build', label: '构建项目', icon: <IconCode />, type: 'default' as const },
    { task: 'test', label: '运行测试', icon: <IconBug />, type: 'default' as const },
    { task: 'lint', label: '代码检查', icon: <IconCheck />, type: 'default' as const },
    { task: 'clean', label: '清理缓存', icon: <IconDelete />, type: 'default' as const },
  ];

  const availableTasks = taskButtons.filter(btn => turboTasks.includes(btn.task));

  return (
    <Card 
      title="全局任务" 
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
          border: '1px solid var(--vscode-panel-border)'
        }}>
          💡 在所有工作区中并行执行任务
        </div>
      </div>
      
      <Space wrap>
        {availableTasks.map(({ task, label, icon, type }) => (
          <Button
            key={task}
            type={type}
            icon={icon}
            onClick={() => runCommand(`turbo run ${task}`)}
            style={{
              background: type === 'primary' 
                ? 'var(--vscode-button-background)' 
                : 'var(--vscode-button-secondaryBackground)',
              color: type === 'primary' 
                ? 'var(--vscode-button-foreground)' 
                : 'var(--vscode-button-secondaryForeground)',
              border: `1px solid var(--vscode-button-border)`,
              borderRadius: '6px',
              padding: '8px 16px',
              fontWeight: '500'
            }}
          >
            {label}
          </Button>
        ))}
        
        {/* 过滤执行按钮 */}
        <Button
          type="outline"
          onClick={() => runCommand('turbo run build --dry')}
          style={{
            background: 'var(--vscode-button-secondaryBackground)',
            color: 'var(--vscode-button-secondaryForeground)',
            border: `1px solid var(--vscode-button-border)`,
            borderRadius: '6px',
            padding: '8px 16px'
          }}
        >
          预览构建计划
        </Button>
        
        <Button
          type="outline"
          onClick={() => runCommand('turbo run build --graph')}
          style={{
            background: 'var(--vscode-button-secondaryBackground)',
            color: 'var(--vscode-button-secondaryForeground)',
            border: `1px solid var(--vscode-button-border)`,
            borderRadius: '6px',
            padding: '8px 16px'
          }}
        >
          查看依赖图
        </Button>
      </Space>
      
      {availableTasks.length === 0 && (
        <div style={{ 
          textAlign: 'center', 
          padding: '40px',
          background: 'var(--vscode-list-hoverBackground)',
          borderRadius: '8px',
          border: '1px solid var(--vscode-panel-border)'
        }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>⚠️</div>
          <div style={{ 
            color: 'var(--vscode-descriptionForeground)',
            fontSize: '16px'
          }}>
            未在 turbo.json 中找到可用任务
          </div>
        </div>
      )}
    </Card>
  );
};

export default GlobalTasks; 