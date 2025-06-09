import React from 'react';
import { Card, Statistic, Grid, Button, Space } from '@arco-design/web-react';
import { IconRefresh, IconEye } from '@arco-design/web-react/icon';
import { useAppStore } from '../store';

const { Row, Col } = Grid;

interface ProjectOverviewProps {
  onShowDependencyGraph?: () => void;
}

const ProjectOverview: React.FC<ProjectOverviewProps> = ({ onShowDependencyGraph }) => {
  const { projectInfo, refresh, isLoading } = useAppStore();

  if (!projectInfo) {
    return (
      <Card title="项目概览" style={{ background: 'var(--vscode-editor-background)' }}>
        <div style={{ textAlign: 'center', padding: '20px' }}>
          <p style={{ color: 'var(--vscode-descriptionForeground)' }}>
            未检测到项目信息，请确保这是一个有效的 Turborepo 项目
          </p>
          <Button type="primary" onClick={refresh} loading={isLoading}>
            刷新项目信息
          </Button>
        </div>
      </Card>
    );
  }

  const { workspaces, turboTasks, packageManager } = projectInfo;
  const apps = workspaces.filter(w => w.type === 'app');
  const packages = workspaces.filter(w => w.type === 'package');

  return (
    <Card 
      title="项目概览" 
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
      extra={
        <Space>
          <Button 
            type="text" 
            icon={<IconEye />} 
            onClick={onShowDependencyGraph}
            disabled={!projectInfo}
            style={{
              color: 'var(--vscode-textLink-foreground)',
              border: '1px solid var(--vscode-button-border)',
              background: 'var(--vscode-button-background)'
            }}
          >
            依赖图
          </Button>
          <Button 
            type="text" 
            icon={<IconRefresh />} 
            onClick={refresh}
            loading={isLoading}
            style={{
              color: 'var(--vscode-textLink-foreground)',
              border: '1px solid var(--vscode-button-border)',
              background: 'var(--vscode-button-background)'
            }}
          >
            刷新
          </Button>
        </Space>
      }
    >
      <Row gutter={16}>
        <Col span={6}>
          <div style={{
            padding: '16px',
            background: 'var(--vscode-list-hoverBackground)',
            borderRadius: '8px',
            border: '1px solid var(--vscode-panel-border)',
            textAlign: 'center'
          }}>
            <div style={{ 
              fontSize: '24px', 
              fontWeight: 'bold', 
              color: 'var(--vscode-textLink-foreground)',
              marginBottom: '4px'
            }}>
              {apps.length}
            </div>
            <div style={{ 
              fontSize: '14px', 
              color: 'var(--vscode-descriptionForeground)' 
            }}>
              应用数量
            </div>
          </div>
        </Col>
        <Col span={6}>
          <div style={{
            padding: '16px',
            background: 'var(--vscode-list-hoverBackground)',
            borderRadius: '8px',
            border: '1px solid var(--vscode-panel-border)',
            textAlign: 'center'
          }}>
            <div style={{ 
              fontSize: '24px', 
              fontWeight: 'bold', 
              color: 'var(--vscode-textLink-foreground)',
              marginBottom: '4px'
            }}>
              {packages.length}
            </div>
            <div style={{ 
              fontSize: '14px', 
              color: 'var(--vscode-descriptionForeground)' 
            }}>
              包数量
            </div>
          </div>
        </Col>
        <Col span={6}>
          <div style={{
            padding: '16px',
            background: 'var(--vscode-list-hoverBackground)',
            borderRadius: '8px',
            border: '1px solid var(--vscode-panel-border)',
            textAlign: 'center'
          }}>
            <div style={{ 
              fontSize: '24px', 
              fontWeight: 'bold', 
              color: 'var(--vscode-textLink-foreground)',
              marginBottom: '4px'
            }}>
              {turboTasks.length}
            </div>
            <div style={{ 
              fontSize: '14px', 
              color: 'var(--vscode-descriptionForeground)' 
            }}>
              任务数量
            </div>
          </div>
        </Col>
        <Col span={6}>
          <div style={{
            padding: '16px',
            background: 'var(--vscode-list-hoverBackground)',
            borderRadius: '8px',
            border: '1px solid var(--vscode-panel-border)',
            textAlign: 'center'
          }}>
            <div style={{ 
              fontSize: '16px', 
              fontWeight: 'bold', 
              color: 'var(--vscode-textLink-foreground)',
              marginBottom: '4px',
              background: 'var(--vscode-badge-background)',
              padding: '4px 12px',
              borderRadius: '12px',
              display: 'inline-block'
            }}>
              {packageManager}
            </div>
            <div style={{ 
              fontSize: '14px', 
              color: 'var(--vscode-descriptionForeground)' 
            }}>
              包管理器
            </div>
          </div>
        </Col>
      </Row>
    </Card>
  );
};

export default ProjectOverview; 