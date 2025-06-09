# Turborepo DevTools - VSCode 扩展

通用的 Turborepo 项目开发工具，提供可视化的项目管理界面，让你可以轻松管理任何 Turborepo monorepo 项目。

## ✨ 功能特性

### 🚀 核心功能
- **智能项目检测** - 自动检测 Turborepo 项目结构和工作区
- **全局任务管理** - 支持在所有工作区中并行执行任务
- **项目概览** - 显示工作区数量、任务数量和包管理器信息
- **过滤执行** - 支持按工作区过滤执行特定任务
- **工作区管理** - 为每个工作区提供独立的任务控制
- **包管理器检测** - 自动检测并使用正确的包管理器（npm/yarn/pnpm）

### 🔗 依赖关系图
- **实时生成** - 执行 `turbo run build --graph` 获取最新依赖关系
- **可视化渲染** - 使用 Graphviz 将 DOT 格式转换为 SVG 图形
- **交互式界面** - 模态窗口展示，支持缩放和滚动查看
- **导出功能** - 支持将依赖图导出为 SVG 文件

### 🎨 现代化技术栈
- **前端**: React 18 + TypeScript + Vite
- **UI 组件库**: Arco Design
- **状态管理**: Zustand
- **图形渲染**: @viz-js/viz (Graphviz)

## 📦 安装使用

### VS Code 应用市场安装
1. 在 VS Code 中搜索 "Turborepo DevTools"
2. 点击安装
3. 或访问：https://marketplace.visualstudio.com/items?itemName=francisxihe.turborepo-devtools

### 使用方法
1. 在 VSCode 中打开你的 Turborepo 项目（包含 `turbo.json` 文件）
2. 按 `Ctrl+Shift+P` 打开命令面板，搜索 "Turborepo DevTools"
3. 或在文件资源管理器中右键点击，选择 "Turborepo DevTools"

## 🛠️ 本地开发

### 快速开始
```bash
# 安装依赖
pnpm install

# 构建项目
pnpm run build

# 启动调试模式（在 VS Code 中按 F5）
```

### 开发命令
```bash
# 构建扩展后端
pnpm run build:extension

# 构建前端应用
pnpm run build:webview

# 前端开发模式（热更新）
cd webview && pnpm run dev

# 监听后端变化
pnpm run watch
```

### 项目结构
```
├── src/                    # VSCode 扩展后端
│   ├── extension.ts        # 扩展入口
│   └── panel.ts           # WebView 面板管理
├── webview/               # React 前端应用
│   ├── src/components/    # React 组件
│   ├── src/store.ts       # Zustand 状态管理
│   └── src/App.tsx        # 主应用组件
└── out/                   # 编译输出
```

## 🎯 支持的项目类型

### 全栈应用项目
```
my-app/
├── apps/
│   ├── web/          # React/Vue/Angular 前端
│   ├── mobile/       # React Native 移动端
│   └── api/          # Node.js/Express 后端
├── packages/
│   ├── ui/           # 共享 UI 组件库
│   ├── utils/        # 工具函数
│   └── config/       # 配置包
├── package.json
└── turbo.json
```

### 微服务架构
```
microservices/
├── services/
│   ├── user-service/
│   ├── order-service/
│   └── payment-service/
├── libs/
│   ├── shared/
│   └── types/
├── package.json
└── turbo.json
```

## 📋 使用示例

### 配置文件示例

**turbo.json**
```json
{
  "pipeline": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": ["dist/**"]
    },
    "dev": {
      "cache": false,
      "persistent": true
    },
    "test": {
      "dependsOn": ["build"],
      "outputs": ["coverage/**"]
    },
    "lint": {},
    "clean": {
      "cache": false
    }
  }
}
```

**package.json**
```json
{
  "name": "my-turborepo",
  "private": true,
  "workspaces": [
    "apps/*",
    "packages/*"
  ],
  "scripts": {
    "dev": "turbo run dev",
    "build": "turbo run build",
    "test": "turbo run test"
  }
}
```

### 实际使用场景

#### 启动开发环境
- 传统方式：需要多个终端分别启动各个服务
- 使用插件：点击 "dev (全部)" 按钮，一键启动所有服务

#### 查看依赖关系
- 点击 "依赖图" 按钮
- 自动执行 `turbo run build --graph`
- 可视化显示包之间的依赖关系

#### 过滤执行任务
- 点击 "按工作区过滤" 按钮
- 输入过滤条件：`@myapp/ui,@myapp/utils`
- 选择任务：`build`

## 🔧 故障排除

1. **插件无法启动**：确保已安装所有依赖并成功构建
2. **未检测到工作区**：检查项目根目录是否包含 `package.json` 和 `turbo.json` 文件
3. **命令执行失败**：确保项目是有效的 Turborepo 项目
4. **依赖图生成失败**：检查项目是否为有效的 Turborepo 项目，确保有构建任务

## 📋 项目要求

- 项目根目录必须包含 `turbo.json` 文件
- 项目根目录必须包含 `package.json` 文件，并配置 `workspaces`
- 支持 npm、yarn、pnpm 包管理器
- VSCode 1.74.0 及以上版本

## 🤝 贡献指南

欢迎贡献代码！请遵循以下步骤：

1. Fork 项目
2. 创建功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 打开 Pull Request

## 📄 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情。 