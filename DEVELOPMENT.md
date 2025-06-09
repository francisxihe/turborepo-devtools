# Turborepo DevTools 本地开发指南

## 快速开始

### 1. 安装依赖
```bash
pnpm install
```

### 2. 编译扩展
```bash
pnpm run compile
```

### 3. 启动调试模式

在 VS Code 中：
1. 打开此项目
2. 按 `F5` 或者点击 "Run and Debug" 面板中的 "Run Extension"
3. 这将打开一个新的 VS Code 窗口（Extension Development Host）
4. 在新窗口中，您可以测试扩展功能

### 4. 使用扩展

在 Extension Development Host 窗口中：
1. 打开您的 Turborepo 项目
2. 按 `Ctrl+Shift+P` (Windows/Linux) 或 `Cmd+Shift+P` (Mac)
3. 搜索 "Turborepo DevTools" 并选择
4. 扩展面板将会打开

### 5. 开发模式（自动重编译）

如果您要修改代码，建议使用 watch 模式：
```bash
pnpm run watch
```

这样当您修改 TypeScript 文件时，代码会自动重新编译。

## 调试技巧

- 在 Extension Development Host 窗口中按 `Ctrl+Shift+I` (Windows/Linux) 或 `Cmd+Option+I` (Mac) 打开开发者工具
- 查看控制台输出来调试问题
- 修改代码后，在 Extension Development Host 窗口中按 `Ctrl+R` (Windows/Linux) 或 `Cmd+R` (Mac) 重新加载扩展

## 项目结构

```
├── src/
│   ├── extension.ts    # 扩展入口点
│   └── panel.ts        # 主面板逻辑
├── out/                # 编译输出
├── .vscode/
│   ├── launch.json     # 调试配置
│   └── tasks.json      # 任务配置
└── package.json        # 扩展清单
``` 