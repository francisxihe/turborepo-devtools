# Turborepo DevTools - VSCode 插件

这是一个通用的 Turborepo 项目开发工具，提供可视化的项目管理界面，让你可以轻松管理任何 Turborepo monorepo 项目的启动、构建和部署。

## 🚀 新版本特性

### 现代化技术栈
- **前端**: React 18 + TypeScript + Vite
- **UI 组件库**: Arco Design (字节跳动企业级组件库)
- **状态管理**: Zustand (轻量级状态管理)
- **构建工具**: Vite (快速构建和热更新)

### 架构优势
- **组件化开发**: 模块化的 React 组件，易于维护和扩展
- **类型安全**: 完整的 TypeScript 支持
- **现代化 UI**: 使用 Arco Design 提供丰富的企业级组件
- **高性能**: Vite 提供快速的开发和构建体验
- **可扩展性**: 清晰的代码结构，便于添加新功能

## 功能特性

- 🚀 **智能项目检测** - 自动检测 Turborepo 项目结构和工作区
- 🏗️ **全局任务管理** - 支持在所有工作区中并行执行任务
- 📊 **项目概览** - 显示工作区数量、任务数量和包管理器信息
- 🎯 **过滤执行** - 支持按工作区过滤执行特定任务
- 🔧 **工作区管理** - 为每个工作区提供独立的任务控制
- 📦 **包管理器检测** - 自动检测并使用正确的包管理器（npm/yarn/pnpm）
- 🔄 **实时刷新** - 支持实时刷新项目信息
- 🎨 **现代化界面** - 基于 Arco Design 的美观界面，支持 VSCode 主题

## 安装方法

### 1. 本地开发安装

1. 克隆项目到本地：
   ```bash
   git clone <repository-url>
   cd turborepo-devtools
   ```

2. 安装依赖：
   ```bash
   pnpm install
   ```

3. 构建项目：
   ```bash
   pnpm run build
   ```

4. 在 VSCode 中按 `F5` 启动调试模式

### 2. 打包安装

1. 安装 vsce（VSCode 扩展打包工具）：
   ```bash
   npm install -g vsce
   ```

2. 在项目目录中打包：
   ```bash
   vsce package
   ```

3. 安装生成的 `.vsix` 文件：
   ```bash
   code --install-extension turborepo-devtools-0.0.1.vsix
   ```

## 开发指南

### 项目结构

```
turborepo-devtools/
├── src/                    # VSCode 扩展后端代码
│   ├── extension.ts        # 扩展入口
│   └── panel.ts           # WebView 面板管理
├── webview/               # React 前端应用
│   ├── src/
│   │   ├── components/    # React 组件
│   │   ├── store.ts       # Zustand 状态管理
│   │   ├── types.ts       # TypeScript 类型定义
│   │   └── App.tsx        # 主应用组件
│   ├── package.json       # 前端依赖
│   └── vite.config.ts     # Vite 配置
└── package.json           # 主项目配置
```

### 开发命令

```bash
# 安装依赖
pnpm install

# 构建整个项目
pnpm run build

# 构建扩展后端
pnpm run build:extension

# 构建前端应用
pnpm run build:webview

# 开发前端（热更新）
cd webview && pnpm run dev

# 监听后端变化
pnpm run watch
```

### 添加新功能

1. **添加新的 React 组件**：
   - 在 `webview/src/components/` 目录下创建新组件
   - 使用 Arco Design 组件库
   - 通过 Zustand store 管理状态

2. **添加新的 VSCode 命令**：
   - 在 `src/panel.ts` 中添加消息处理逻辑
   - 在 `package.json` 的 `contributes.commands` 中注册命令

3. **扩展状态管理**：
   - 在 `webview/src/store.ts` 中添加新的状态和操作
   - 在 `webview/src/types.ts` 中定义相关类型

## 使用方法

1. 在 VSCode 中打开你的 Turborepo 项目（包含 `turbo.json` 文件的项目）
2. 使用以下任一方式打开插件面板：
   - 按 `Ctrl+Shift+P`（Windows/Linux）或 `Cmd+Shift+P`（Mac）打开命令面板
   - 输入 "Turborepo DevTools" 并选择
   - 或者在文件资源管理器中右键点击，选择 "Turborepo DevTools"

3. 在打开的面板中，你可以看到以下功能区域：
   - **项目概览**：显示工作区数量、任务数量等信息
   - **全局任务**：在所有工作区中并行执行任务
   - **包管理**：依赖管理和缓存清理
   - **工作区管理**：为每个工作区提供独立控制

## 支持的命令

### 全局任务（基于 turbo.json 配置）
- `turbo run dev` - 在所有工作区中启动开发服务器
- `turbo run build` - 构建所有工作区
- `turbo run test` - 运行所有测试
- `turbo run lint` - 代码检查
- `turbo run clean` - 清理构建文件

### 过滤执行
- `turbo run build --filter=package-name` - 构建特定包
- `turbo run dev --filter=./apps/*` - 只在 apps 目录下运行
- `turbo run build --dry` - 预览构建计划
- `turbo run build --graph` - 查看依赖图

### 包管理（自动检测包管理器）
- `npm/yarn/pnpm install` - 安装依赖
- `npm/yarn/pnpm update` - 更新依赖
- `npm/yarn/pnpm outdated` - 检查过期依赖
- `turbo prune` - 清理 Turbo 缓存

## 技术栈

### 后端（VSCode 扩展）
- **TypeScript** - 类型安全的 JavaScript
- **VSCode API** - 扩展开发接口

### 前端（WebView）
- **React 18** - 现代化的用户界面库
- **TypeScript** - 类型安全
- **Arco Design** - 企业级 UI 组件库
- **Zustand** - 轻量级状态管理
- **Vite** - 快速构建工具

## 项目要求

- 项目根目录必须包含 `turbo.json` 文件
- 项目根目录必须包含 `package.json` 文件，并配置 `workspaces`
- 支持 npm、yarn、pnpm 包管理器

## 故障排除

1. **插件无法启动**：确保已安装所有依赖并成功构建
2. **未检测到工作区**：检查项目根目录是否包含 `package.json` 和 `turbo.json` 文件
3. **命令执行失败**：确保项目是有效的 Turborepo 项目
4. **前端界面显示异常**：尝试重新构建前端应用

## 兼容性

- 支持所有标准的 Turborepo 项目
- 自动适配不同的包管理器
- 兼容各种工作区配置模式
- VSCode 1.74.0 及以上版本

## 版本历史

- **v0.0.1** - 初始版本，现代化架构重构
  - 使用 React + Arco Design 重构前端
  - 引入 Zustand 状态管理
  - 使用 Vite 构建工具
  - 组件化架构，提升可维护性和扩展性

## 贡献指南

欢迎贡献代码！请遵循以下步骤：

1. Fork 项目
2. 创建功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 打开 Pull Request

## 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情。 