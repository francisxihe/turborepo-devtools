# 🔗 依赖关系图功能

## 功能概述

新增的依赖关系图功能可以可视化显示 Turborepo 项目中各个包的构建依赖关系，帮助开发者更好地理解项目结构和依赖链。

## 主要特性

### 🎯 核心功能
- **实时生成**：执行 `turbo run build --graph` 命令获取最新的依赖关系
- **可视化渲染**：使用 Graphviz 将 DOT 格式转换为 SVG 图形
- **交互式界面**：模态窗口展示，支持缩放和滚动查看
- **导出功能**：支持将依赖图导出为 SVG 文件

### 🛠 技术实现
- **前端**：React + @viz-js/viz（Graphviz JavaScript 实现）
- **后端**：VSCode 扩展 API + Node.js child_process
- **UI组件**：Arco Design Modal、Button、Alert 等
- **状态管理**：Zustand store 管理加载状态和错误处理

## 使用方法

### 1. 打开依赖图
1. 启动 Turborepo DevTools 插件
2. 在项目概览卡片中点击 **"依赖图"** 按钮
3. 系统会自动执行 `turbo run build --graph` 命令
4. 等待图形渲染完成

### 2. 查看依赖关系
- **节点**：代表项目中的包或应用
- **箭头**：表示依赖方向（A → B 表示 A 依赖于 B）
- **颜色**：使用 VSCode 主题色彩，适配暗色/亮色模式

### 3. 操作功能
- **刷新**：重新生成最新的依赖图
- **下载**：将当前依赖图保存为 SVG 文件
- **关闭**：关闭依赖图窗口

## 示例输出

基于您提供的 `turbo run build --graph` 输出，依赖图会显示：

```
life-toolkit-web → @life-toolkit/api
life-toolkit-web → @life-toolkit/components-repeat  
life-toolkit-web → @life-toolkit/tabs
life-toolkit-server → @life-toolkit/components-repeat
@life-toolkit/components-repeat → @life-toolkit/common-calendar
@life-toolkit/components-repeat → @life-toolkit/common-web-utils
```

## 错误处理

### 常见问题
1. **命令执行失败**：检查项目是否为有效的 Turborepo 项目
2. **图形渲染失败**：确保 DOT 格式数据正确
3. **超时错误**：大型项目可能需要更长时间，已设置 30 秒超时

### 调试信息
- 错误信息会在界面中显示
- 支持重新尝试生成
- 控制台会输出详细的调试日志

## 技术架构

### 前端组件
```typescript
// DependencyGraph.tsx
- 状态管理：loading、graphData、svgContent、error
- 命令执行：runCommandWithOutput('turbo run build --graph')
- 图形渲染：@viz-js/viz 库处理 DOT → SVG
- UI交互：Modal + Button + Alert 组件
```

### 后端支持
```typescript
// panel.ts
- 消息处理：runCommandWithOutput 命令
- 命令执行：child_process.exec 异步执行
- 结果返回：stdout/stderr 输出或错误信息
- 超时控制：30 秒执行超时限制
```

### 数据流
1. 用户点击"依赖图"按钮
2. 前端调用 `runCommandWithOutput('turbo run build --graph')`
3. 后端执行命令并返回输出
4. 前端解析 DOT 格式数据
5. 使用 Graphviz 渲染为 SVG
6. 在模态窗口中显示结果

## 扩展性

### 未来改进
- **多种图形格式**：支持 PNG、PDF 导出
- **交互式节点**：点击节点查看详细信息
- **过滤功能**：按包类型或依赖深度过滤
- **布局选项**：支持不同的图形布局算法
- **性能优化**：大型项目的渲染优化

### 自定义样式
当前使用 VSCode 主题变量，支持：
- `--vscode-foreground`：文本颜色
- `--vscode-panel-border`：边框颜色  
- `--vscode-editor-background`：背景色
- `--color-primary`：主色调（Arco Design）

## 总结

依赖关系图功能为 Turborepo DevTools 插件增加了强大的可视化能力，帮助开发者：
- 🔍 **理解项目结构**：直观查看包之间的依赖关系
- 🚀 **优化构建顺序**：识别构建瓶颈和并行机会
- 📊 **项目分析**：评估架构合理性和重构需求
- 🛠 **调试依赖**：快速定位循环依赖等问题

这个功能完美集成了现代前端技术栈，提供了流畅的用户体验和强大的可视化能力。 