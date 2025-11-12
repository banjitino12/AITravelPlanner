# AI Travel Planner 项目提交文档

## 项目信息

- **项目名称**: AI Travel Planner - 智能旅行规划助手
- **GitHub 仓库**: https://github.com/banjitino12/AITravelPlanner
- **Docker 镜像地址**: `registry.cn-hangzhou.aliyuncs.com/[your-namespace]/ai-travel-planner:latest`
- **项目作者**: [Your Name]
- **提交日期**: 2025年1月6日

---

## 项目概述

本项目是一个基于 AI 的智能旅行规划助手，旨在简化旅行规划过程。用户可以通过语音或文字输入旅行需求，系统将自动生成详细的旅行路线和建议，并提供实时旅行辅助。

---

## 核心功能实现

### ✅ 1. 智能行程规划

- **实现方式**: 
  - 集成阿里云百炼平台（通义千问）
  - 使用大语言模型分析用户需求
  - 自动生成包含交通、住宿、景点、餐厅的详细行程

- **关键文件**:
  - `backend/src/services/aiService.ts` - AI 服务实现
  - `frontend/src/pages/PlannerPage.tsx` - 行程规划页面
  - `frontend/src/services/planService.ts` - 行程 API 服务

### ✅ 2. 语音输入功能

- **实现方式**:
  - 使用浏览器原生 Web Speech API
  - 支持中文语音识别
  - 自动解析关键信息（目的地、日期、预算等）

- **关键文件**:
  - `frontend/src/services/voiceService.ts` - 语音服务
  - `frontend/src/pages/PlannerPage.tsx` - 语音输入集成

### ✅ 3. 费用预算与管理

- **实现方式**:
  - AI 自动分析预算
  - 支持语音记录开销
  - 分类统计和可视化展示

- **关键文件**:
  - `backend/src/routes/expenseRoutes.ts` - 费用 API
  - `frontend/src/services/expenseService.ts` - 费用服务

### ✅ 4. 用户管理与数据存储

- **实现方式**:
  - 使用 Supabase 实现用户认证
  - PostgreSQL 数据库存储数据
  - 云端自动同步

- **关键文件**:
  - `backend/src/middleware/auth.ts` - 认证中间件
  - `frontend/src/store/authStore.ts` - 用户状态管理
  - `supabase_schema.sql` - 数据库架构

### ✅ 5. 地图导航

- **实现方式**:
  - 集成高德地图 API
  - 支持地点标记和路线显示

- **关键文件**:
  - `frontend/index.html` - 地图 SDK 引入
  - `frontend/src/config/config.ts` - 地图配置

---

## 技术栈

### 前端
- React 18 + TypeScript
- Vite (构建工具)
- Tailwind CSS (样式)
- Zustand (状态管理)
- React Router v6 (路由)
- Axios (HTTP 客户端)
- Web Speech API (语音识别)

### 后端
- Node.js 18+
- Express.js + TypeScript
- Supabase (PostgreSQL + 认证)
- 阿里云百炼平台 (AI 服务)

### DevOps
- Docker + Docker Compose
- GitHub Actions (CI/CD)
- 阿里云容器镜像服务

---

## 项目结构

```
AITravelPlanner/
├── frontend/                 # 前端应用
│   ├── src/
│   │   ├── components/      # 可复用组件
│   │   ├── pages/          # 页面组件
│   │   │   ├── Login.tsx
│   │   │   ├── Register.tsx
│   │   │   ├── Dashboard.tsx
│   │   │   ├── PlannerPage.tsx
│   │   │   ├── TripsPage.tsx
│   │   │   └── SettingsPage.tsx
│   │   ├── services/       # API 服务
│   │   ├── store/          # 状态管理
│   │   ├── types/          # TypeScript 类型
│   │   └── config/         # 配置文件
│   └── package.json
│
├── backend/                 # 后端 API
│   ├── src/
│   │   ├── routes/         # API 路由
│   │   ├── services/       # 业务逻辑
│   │   ├── middleware/     # 中间件
│   │   └── config/         # 配置
│   └── package.json
│
├── .github/
│   └── workflows/          # CI/CD 配置
│
├── Dockerfile              # Docker 配置
├── docker-compose.yml      # Docker Compose 配置
├── supabase_schema.sql     # 数据库架构
├── README.md              # 项目文档
├── USAGE.md               # 使用指南
├── DEPLOYMENT.md          # 部署指南
└── LICENSE                # MIT 许可证
```

---

## 运行方式

### 本地开发

1. **安装依赖**
```bash
npm install
cd frontend && npm install
cd ../backend && npm install
```

2. **配置环境变量**
- 复制 `.env.example` 为 `.env`
- 填入 API 密钥

3. **启动服务**
```bash
npm run dev
```

访问 http://localhost:3000

### Docker 运行

1. **使用 Docker Compose**
```bash
docker-compose up -d
```

2. **使用预构建镜像**
```bash
docker pull registry.cn-hangzhou.aliyuncs.com/[namespace]/ai-travel-planner:latest
docker run -d -p 3000:3000 -p 5000:5000 \
  -e SUPABASE_URL=your_url \
  -e SUPABASE_SERVICE_KEY=your_key \
  registry.cn-hangzhou.aliyuncs.com/[namespace]/ai-travel-planner:latest
```

---

## API 密钥说明

### 1. 阿里云百炼平台 API Key

**获取方式**:
1. 访问 https://bailian.console.aliyun.com/
2. 创建应用并获取 API Key
3. 在应用设置页面输入 Key

**有效期**: ⚠️ 保证 3 个月内有效（用于作业批改）

**使用位置**: 前端应用内配置（不在代码中）

### 2. Supabase 密钥

**获取方式**:
1. 访问 https://supabase.com
2. 创建项目
3. 在 Project Settings > API 获取

**配置位置**:
- `SUPABASE_URL`: 环境变量
- `SUPABASE_ANON_KEY`: 前端环境变量
- `SUPABASE_SERVICE_KEY`: 后端环境变量

### 3. 高德地图 API Key (可选)

**获取方式**:
1. 访问 https://console.amap.com/dev/key/app
2. 创建应用并获取 Web 服务 Key

**配置位置**: 应用设置页面

---

## 重要提示

### ⚠️ 安全性

1. **API Key 不在代码中**
   - 所有密钥通过环境变量或应用内设置配置
   - 已添加到 `.gitignore`
   - 用户在应用设置页面输入

2. **环境变量文件**
   - 提供 `.env.example` 模板
   - 实际的 `.env` 文件不提交到 Git

3. **Supabase 安全**
   - 使用 Row Level Security (RLS)
   - 用户只能访问自己的数据

### 📝 提交的 API Key

由于项目需要助教测试，请在此提供可用的 API Key：

```
阿里云百炼平台 API Key: [请在此填入您的 Key]
(保证 3 个月内有效)

Supabase URL: [如需提供]
Supabase Anon Key: [如需提供]

高德地图 Key: [可选]
```

**注意**: 这些信息仅用于作业批改，请确保:
1. API Key 有效期至少 3 个月
2. 账户余额充足
3. 及时在 README 中更新

---

## GitHub 提交记录

本项目保留了详细的 Git 提交记录，包括：

- 初始化项目结构
- 实现前端页面和组件
- 实现后端 API 服务
- 集成 AI 服务
- 实现语音识别功能
- 添加费用管理功能
- Docker 配置
- CI/CD 配置
- 文档完善

**查看提交记录**:
```bash
git log --oneline --graph
```

---

## 功能演示

### 1. 用户注册登录
![登录页面](screenshots/login.png)

### 2. 语音输入创建行程
![行程规划](screenshots/planner.png)

### 3. 查看行程详情
![行程列表](screenshots/trips.png)

### 4. API 密钥设置
![设置页面](screenshots/settings.png)

**注**: 截图文件请自行添加到 `screenshots/` 目录

---

## 测试账号 (可选)

为方便助教测试，可提供测试账号：

```
邮箱: test@example.com
密码: test123456
```

或助教可以自行注册新账号。

---

## 已知问题和改进方向

### 当前版本限制

1. AI 生成速度取决于网络和 API 响应
2. 语音识别需要 HTTPS 或 localhost 环境
3. 地图功能需要配置高德地图 Key

### 未来改进方向

1. 添加行程分享功能
2. 支持多语言
3. 添加离线模式
4. 实现行程导出（PDF）
5. 集成日历同步
6. 添加社交功能

---

## 文档清单

本项目包含以下完整文档：

- [x] README.md - 项目说明
- [x] USAGE.md - 使用指南
- [x] DEPLOYMENT.md - 部署指南
- [x] LICENSE - MIT 许可证
- [x] 本文档 - 提交说明

---

## 联系方式

- GitHub: https://github.com/banjitino12
- Email: [your.email@example.com]

---

## 确认清单

提交前请确认：

- [ ] 代码已推送到 GitHub
- [ ] Docker 镜像已构建并推送
- [ ] README.md 包含所有必要信息
- [ ] API Key 已准备并保证有效期
- [ ] 数据库架构文件已提供
- [ ] 所有功能已实现并测试
- [ ] 文档完整且清晰
- [ ] Git 提交记录清晰详细
- [ ] 不包含敏感信息
- [ ] Docker 运行说明清楚

---

**本项目已完成所有要求的功能，感谢审阅！** 🎉
