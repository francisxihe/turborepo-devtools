#!/bin/bash

echo "🚀 Turborepo DevTools 插件安装脚本"
echo "=================================="

# 检查是否在正确的目录
if [ ! -f "package.json" ]; then
    echo "❌ 错误：请在插件根目录运行此脚本"
    exit 1
fi

# 安装依赖
echo "📦 安装依赖..."
pnpm install

if [ $? -ne 0 ]; then
    echo "❌ 依赖安装失败"
    exit 1
fi

# 编译插件
echo "🔨 编译插件..."
npm run compile

if [ $? -ne 0 ]; then
    echo "❌ 编译失败"
    exit 1
fi

echo "✅ 插件安装完成！"
echo ""
echo "📋 使用方法："
echo "1. 在 VSCode 中按 F5 启动插件开发模式"
echo "2. 在新窗口中打开你的 Turborepo 项目"
echo "3. 按 Ctrl+Shift+P 打开命令面板"
echo "4. 输入 'Turborepo DevTools' 并选择"
echo ""
echo "🎉 享受使用吧！" 