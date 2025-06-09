# 插件测试指南

## 测试步骤

1. **启动调试模式**
   - 在 VSCode 中打开 `turborepo-devtools` 项目
   - 按 `F5` 启动调试模式
   - 这会打开一个新的 VSCode 窗口（Extension Development Host）

2. **打开测试项目**
   - 在新窗口中打开一个 Turborepo 项目
   - 或者创建一个简单的测试项目

3. **激活插件**
   - 按 `Ctrl+Shift+P` (Windows/Linux) 或 `Cmd+Shift+P` (Mac)
   - 输入 "Turborepo DevTools"
   - 选择命令执行

4. **检查控制台输出**
   - 在原始 VSCode 窗口中打开 "输出" 面板
   - 选择 "Extension Host" 输出通道
   - 查看调试信息

## 预期结果

如果一切正常，你应该看到：
- 一个新的 webview 面板打开
- 显示 "🚀 Turborepo DevTools" 标题
- 显示 "React 应用已成功渲染！" 消息
- 控制台输出包含调试信息

## 故障排除

### 如果看到空白面板
1. 检查控制台是否有错误信息
2. 确认 `webview/dist/` 目录存在且包含构建文件
3. 重新运行 `pnpm run build`

### 如果看到 "React 前端尚未构建" 消息
1. 运行 `cd webview && pnpm run build`
2. 重新启动调试会话

### 如果插件无法激活
1. 检查 `out/` 目录是否包含编译后的 JS 文件
2. 运行 `pnpm run build:extension`
3. 重新启动调试会话

## 调试信息

在控制台中查找以下调试信息：
- "Webview dist path: ..."
- "Index HTML exists: true/false"
- "Original HTML: ..."
- "Modified HTML: ..."

这些信息可以帮助诊断问题所在。 