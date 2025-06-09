import React from 'react';
import { Card, Button, Space, Typography, List, Tag, Divider } from '@arco-design/web-react';
import { IconFolder, IconCode, IconSettings } from '@arco-design/web-react/icon';
import { useAppStore } from '../store';
import { WorkspaceInfo } from '../types';

const { Text } = Typography;

const WorkspaceManager: React.FC = () => {
  const { projectInfo, runCommand, openWorkspace } = useAppStore();

  if (!projectInfo) {
    return null;
  }

  const { workspaces } = projectInfo;

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'app': return 'blue';
      case 'package': return 'green';
      default: return 'gray';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'app': return <IconCode />;
      case 'package': return <IconSettings />;
      default: return <IconFolder />;
    }
  };

  const renderWorkspaceItem = (workspace: WorkspaceInfo) => {
    const scripts = Object.keys(workspace.scripts);
    
    return (
      <List.Item
        key={workspace.name}
        style={{
          background: 'var(--vscode-list-hoverBackground)',
          border: '1px solid var(--vscode-panel-border)',
          borderRadius: '6px',
          marginBottom: '8px',
          padding: '16px'
        }}
        actions={[
          <Button
            key="open"
            type="text"
            size="mini"
            icon={<IconFolder />}
            onClick={() => openWorkspace(workspace.path)}
            style={{
              color: 'var(--vscode-descriptionForeground)',
              border: 'none',
              background: 'transparent',
              fontSize: '10px',
              padding: '4px 6px',
              opacity: 0.7
            }}
            title="在IDE中展开此文件夹"
          >
            展开
          </Button>
        ]}
      >
        <List.Item.Meta
          avatar={
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '6px',
              background: 'var(--vscode-button-secondaryBackground)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--vscode-textLink-foreground)',
              fontSize: '18px'
            }}>
              {getTypeIcon(workspace.type)}
            </div>
          }
          title={
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Text style={{ 
                color: 'var(--vscode-editor-foreground)',
                fontWeight: '600',
                fontSize: '16px'
              }}>
                {workspace.name}
              </Text>
              <Tag 
                color={getTypeColor(workspace.type)} 
                size="small"
                style={{ textTransform: 'capitalize' }}
              >
                {workspace.type}
              </Tag>
            </div>
          }
          description={
            <div style={{ marginTop: '8px' }}>
              <div style={{ 
                color: 'var(--vscode-descriptionForeground)',
                fontSize: '12px',
                fontFamily: 'monospace',
                marginBottom: '12px'
              }}>
                {workspace.path}
              </div>
              
              {scripts.length > 0 ? (
                <div>
                  <Text style={{ 
                    color: 'var(--vscode-editor-foreground)',
                    fontSize: '14px',
                    fontWeight: '600',
                    marginBottom: '8px',
                    display: 'block'
                  }}>
                    可用脚本 ({scripts.length})
                  </Text>
                  <div style={{ marginTop: '8px' }}>
                    <Space wrap size="small">
                      {scripts.map(script => (
                        <Button
                          key={script}
                          size="small"
                          type="primary"
                          onClick={() => runCommand(`cd ${workspace.path} && npm run ${script}`)}
                          style={{
                            fontSize: '12px',
                            padding: '6px 12px',
                            height: '28px',
                            background: 'var(--vscode-button-background)',
                            color: 'var(--vscode-button-foreground)',
                            border: '1px solid var(--vscode-button-border)',
                            borderRadius: '4px',
                            fontWeight: '500'
                          }}
                        >
                          {script}
                        </Button>
                      ))}
                    </Space>
                  </div>
                </div>
              ) : (
                <div>
                  <Text style={{ 
                    color: 'var(--vscode-editor-foreground)',
                    fontSize: '14px',
                    fontWeight: '600',
                    marginBottom: '8px',
                    display: 'block'
                  }}>
                    可用脚本 (0)
                  </Text>
                  <Text style={{ 
                    color: 'var(--vscode-descriptionForeground)',
                    fontSize: '12px',
                    fontStyle: 'italic'
                  }}>
                    此工作区没有定义任何脚本
                  </Text>
                </div>
              )}
            </div>
          }
        />
      </List.Item>
    );
  };

  // 按类型分组
  const apps = workspaces.filter(w => w.type === 'app');
  const packages = workspaces.filter(w => w.type === 'package');
  const others = workspaces.filter(w => w.type === 'other');

  return (
    <Card 
      title="工作区管理" 
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
        color: 'var(--vscode-editor-foreground)',
        padding: '16px'
      }}
    >
      {workspaces.length > 0 ? (
        <div>
          {/* 应用列表 */}
          {apps.length > 0 && (
            <div style={{ marginBottom: '24px' }}>
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '8px',
                marginBottom: '12px',
                padding: '8px 0'
              }}>
                <IconCode style={{ color: 'var(--vscode-textLink-foreground)' }} />
                <Text style={{ 
                  color: 'var(--vscode-textLink-foreground)',
                  fontWeight: '600',
                  fontSize: '14px'
                }}>
                  应用 ({apps.length})
                </Text>
              </div>
              <List>
                {apps.map(renderWorkspaceItem)}
              </List>
            </div>
          )}

          {/* 包列表 */}
          {packages.length > 0 && (
            <div style={{ marginBottom: '24px' }}>
              {apps.length > 0 && <Divider style={{ margin: '16px 0' }} />}
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '8px',
                marginBottom: '12px',
                padding: '8px 0'
              }}>
                <IconSettings style={{ color: 'var(--vscode-textLink-foreground)' }} />
                <Text style={{ 
                  color: 'var(--vscode-textLink-foreground)',
                  fontWeight: '600',
                  fontSize: '14px'
                }}>
                  包 ({packages.length})
                </Text>
              </div>
              <List>
                {packages.map(renderWorkspaceItem)}
              </List>
            </div>
          )}

          {/* 其他列表 */}
          {others.length > 0 && (
            <div>
              {(apps.length > 0 || packages.length > 0) && <Divider style={{ margin: '16px 0' }} />}
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '8px',
                marginBottom: '12px',
                padding: '8px 0'
              }}>
                <IconFolder style={{ color: 'var(--vscode-textLink-foreground)' }} />
                <Text style={{ 
                  color: 'var(--vscode-textLink-foreground)',
                  fontWeight: '600',
                  fontSize: '14px'
                }}>
                  其他 ({others.length})
                </Text>
              </div>
              <List>
                {others.map(renderWorkspaceItem)}
              </List>
            </div>
          )}
        </div>
      ) : (
        <div style={{ 
          textAlign: 'center', 
          padding: '60px 20px',
          background: 'var(--vscode-list-hoverBackground)',
          borderRadius: '8px',
          border: '1px solid var(--vscode-panel-border)'
        }}>
          <IconFolder style={{ 
            fontSize: '48px', 
            color: 'var(--vscode-descriptionForeground)',
            marginBottom: '16px'
          }} />
          <div style={{ 
            color: 'var(--vscode-descriptionForeground)',
            fontSize: '18px',
            marginBottom: '8px'
          }}>
            未找到工作区
          </div>
          <div style={{ 
            color: 'var(--vscode-descriptionForeground)',
            fontSize: '14px'
          }}>
            请确保项目包含有效的 package.json 文件
          </div>
        </div>
      )}
    </Card>
  );
};

export default WorkspaceManager; 