import React, { useEffect, useState } from 'react';
import { Layout, Typography, Spin, Card } from '@arco-design/web-react';
import { useAppStore } from './store';
import ProjectOverview from './components/ProjectOverview';
import GlobalTasks from './components/GlobalTasks';
import WorkspaceManager from './components/WorkspaceManager';
import PackageManager from './components/PackageManager';
import DependencyGraph from './components/DependencyGraph';

const { Header, Content } = Layout;
const { Title } = Typography;

function App() {
  const { initVSCodeApi, isLoading, projectInfo } = useAppStore();
  const [showDependencyGraph, setShowDependencyGraph] = useState(false);

  useEffect(() => {
    console.log('App component mounted');
    initVSCodeApi();
  }, [initVSCodeApi]);

  console.log('App rendering, projectInfo:', projectInfo, 'isLoading:', isLoading);

  return (
    <Layout style={{ minHeight: '100vh', background: 'var(--vscode-editor-background)' }}>
      <Header style={{ 
        background: 'var(--vscode-editor-background)', 
        borderBottom: '1px solid var(--vscode-panel-border)',
        padding: '0 20px'
      }}>
        <Title style={{ 
          margin: 0, 
          color: 'var(--vscode-foreground)',
          display: 'flex',
          alignItems: 'center',
          height: '64px',
          fontSize: '24px'
        }}>
          🚀 Turborepo DevTools
        </Title>
      </Header>
      
      <Content style={{ padding: '20px' }}>
        <Card 
          title="状态信息" 
          style={{ 
            marginBottom: '20px',
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
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '8px',
              padding: '8px 12px',
              background: 'var(--vscode-list-hoverBackground)',
              borderRadius: '4px'
            }}>
              <span style={{ fontSize: '16px' }}>✅</span>
              <span style={{ color: 'var(--vscode-textLink-foreground)', fontWeight: '500' }}>
                React 应用已成功渲染！
              </span>
            </div>
            
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '8px',
              padding: '8px 12px',
              background: 'var(--vscode-list-hoverBackground)',
              borderRadius: '4px'
            }}>
              <span style={{ fontSize: '16px' }}>⚡</span>
              <span style={{ color: 'var(--vscode-editor-foreground)' }}>
                加载状态: 
              </span>
              <span style={{ 
                color: isLoading ? 'var(--vscode-notificationsWarningIcon-foreground)' : 'var(--vscode-notificationsInfoIcon-foreground)',
                fontWeight: '500'
              }}>
                {isLoading ? '加载中...' : '已完成'}
              </span>
            </div>
            
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '8px',
              padding: '8px 12px',
              background: 'var(--vscode-list-hoverBackground)',
              borderRadius: '4px'
            }}>
              <span style={{ fontSize: '16px' }}>📦</span>
              <span style={{ color: 'var(--vscode-editor-foreground)' }}>
                项目信息: 
              </span>
              <span style={{ 
                color: projectInfo ? 'var(--vscode-notificationsInfoIcon-foreground)' : 'var(--vscode-notificationsErrorIcon-foreground)',
                fontWeight: '500'
              }}>
                {projectInfo ? `已加载 (${projectInfo.workspaces.length} 个工作区)` : '未加载'}
              </span>
            </div>
            
            {projectInfo && (
              <>
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '8px',
                  padding: '8px 12px',
                  background: 'var(--vscode-list-hoverBackground)',
                  borderRadius: '4px'
                }}>
                  <span style={{ fontSize: '16px' }}>🛠️</span>
                  <span style={{ color: 'var(--vscode-editor-foreground)' }}>
                    包管理器: 
                  </span>
                  <span style={{ 
                    color: 'var(--vscode-textLink-foreground)',
                    fontWeight: '500',
                    background: 'var(--vscode-badge-background)',
                    padding: '2px 8px',
                    borderRadius: '12px',
                    fontSize: '12px'
                  }}>
                    {projectInfo.packageManager}
                  </span>
                </div>
                
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '8px',
                  padding: '8px 12px',
                  background: 'var(--vscode-list-hoverBackground)',
                  borderRadius: '4px'
                }}>
                  <span style={{ fontSize: '16px' }}>⚙️</span>
                  <span style={{ color: 'var(--vscode-editor-foreground)' }}>
                    Turbo任务: 
                  </span>
                  <span style={{ 
                    color: 'var(--vscode-textLink-foreground)',
                    fontWeight: '500'
                  }}>
                    {projectInfo.turboTasks.length > 0 ? projectInfo.turboTasks.join(', ') : '无'}
                  </span>
                </div>
              </>
            )}
          </div>
        </Card>
        
        <Spin loading={isLoading} style={{ width: '100%' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <ProjectOverview onShowDependencyGraph={() => setShowDependencyGraph(true)} />
            <WorkspaceManager />
            <GlobalTasks />
            <PackageManager />
          </div>
        </Spin>
        
        <DependencyGraph 
          visible={showDependencyGraph}
          onClose={() => setShowDependencyGraph(false)}
        />
      </Content>
    </Layout>
  );
}

export default App; 