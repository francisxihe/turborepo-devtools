# Turborepo DevTools 演示

## 支持的项目类型

这个插件可以用于任何标准的 Turborepo 项目，包括但不限于：

### 1. 全栈应用项目
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

### 2. 微服务架构
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

### 3. 组件库项目
```
design-system/
├── packages/
│   ├── components/
│   ├── tokens/
│   ├── icons/
│   └── docs/
├── apps/
│   └── storybook/
├── package.json
└── turbo.json
```

## 插件功能演示

### 自动检测项目信息
- ✅ 自动扫描 `workspaces` 配置
- ✅ 读取 `turbo.json` 中的任务定义
- ✅ 检测包管理器类型（npm/yarn/pnpm）
- ✅ 显示每个工作区的可用脚本

### 智能任务管理
- ✅ 基于 `turbo.json` 动态生成任务按钮
- ✅ 支持全局任务执行（所有工作区）
- ✅ 支持单个工作区任务执行
- ✅ 支持过滤器语法

### 实际使用场景

#### 场景 1：启动开发环境
```bash
# 传统方式需要多个终端
cd apps/web && npm run dev
cd apps/api && npm run dev
cd packages/ui && npm run build:watch

# 使用插件：点击 "dev (全部)" 按钮
# 执行：turbo run dev
```

#### 场景 2：构建特定包
```bash
# 传统方式
turbo run build --filter=@myapp/ui --filter=@myapp/utils

# 使用插件：点击 "按工作区过滤" 按钮
# 输入：@myapp/ui,@myapp/utils
# 输入任务：build
```

#### 场景 3：查看依赖关系
```bash
# 点击 "查看依赖图" 按钮
# 执行：turbo run build --graph
```

## 配置示例

### turbo.json 示例
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

### package.json 示例
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

## 插件界面预览

插件会根据你的项目配置动态生成界面：

1. **项目概览区域**
   - 显示检测到的工作区数量
   - 显示 turbo.json 中定义的任务数量
   - 显示检测到的包管理器

2. **全局任务区域**
   - 根据 turbo.json 动态生成按钮
   - 每个按钮对应一个 pipeline 任务

3. **工作区管理区域**
   - 为每个工作区生成独立的卡片
   - 显示工作区名称和路径
   - 显示该工作区可用的脚本

4. **过滤执行区域**
   - 提供高级过滤功能
   - 支持 Turbo 的所有过滤语法

## 兼容性说明

- ✅ 支持所有符合 Turborepo 规范的项目
- ✅ 兼容 npm、yarn、pnpm 包管理器
- ✅ 支持嵌套工作区配置
- ✅ 支持自定义 turbo.json 配置
- ✅ 支持 Turbo 的所有命令行参数 