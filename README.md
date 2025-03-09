# 错题管理系统

一个基于 Next.js 开发的错题管理系统，帮助学生记录、管理和复习错题。

## 功能特点

- **错题记录**：记录错题内容、正确答案、错误原因和解析
- **标签管理**：为错题添加标签，方便分类和筛选
- **复习系统**：智能复习功能，优先复习掌握程度低的错题
- **掌握度评估**：对每道错题的掌握程度进行评估和记录
- **数据统计**：提供错题和复习的统计数据和可视化图表
- **响应式设计**：适配各种设备屏幕大小

## 技术栈

- **前端框架**：Next.js 15
- **UI 组件**：React 19
- **状态管理**：Zustand
- **样式**：Tailwind CSS
- **数据库**：Prisma + SQLite
- **表单处理**：React Hook Form
- **图标**：React Icons

## 快速开始

### 安装依赖

```bash
npm install
```

### 初始化数据库

```bash
npx prisma generate
npx prisma db push
```

### 启动开发服务器

```bash
npm run dev
```

访问 [http://localhost:3000](http://localhost:3000) 查看应用。

## 项目结构

```
src/
├── app/                  # 页面和 API 路由
│   ├── api/              # API 端点
│   ├── add/              # 添加错题页面
│   ├── mistake/          # 错题详情页面
│   ├── review/           # 复习页面
│   └── stats/            # 统计页面
├── components/           # React 组件
│   ├── filter/           # 筛选组件
│   ├── layout/           # 布局组件
│   ├── mistake/          # 错题相关组件
│   ├── review/           # 复习相关组件
│   └── tag/              # 标签相关组件
├── lib/                  # 工具库
│   └── prisma.ts         # Prisma 客户端
└── store/                # 状态管理
    ├── mistakeStore.ts   # 错题状态
    ├── reviewStore.ts    # 复习状态
    ├── tagStore.ts       # 标签状态
    └── userStore.ts      # 用户状态
```

## 使用说明

1. **添加错题**：点击首页的"添加错题"按钮，填写错题信息并提交
2. **查看错题**：在首页查看所有错题，可以按标签筛选或搜索
3. **编辑错题**：点击错题卡片上的编辑按钮进入编辑页面
4. **复习错题**：进入复习页面，开始复习，评估掌握程度
5. **查看统计**：在统计页面查看错题和复习的统计数据

## 许可证

MIT
