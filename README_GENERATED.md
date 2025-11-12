# AI Travel Planner (Generated README)

这是仓库的自动生成说明（中文），包含快速上手、后端与前端运行、AI 调试端点与注意事项。

概览

- 前端：React + TypeScript (Vite)
- 后端：Node.js + TypeScript + Express
- 数据：Supabase (Postgres) 提供认证和持久化
- AI：阿里云 Bailian / dashscope 的 OpenAI-compatible 模式，用于生成旅行计划

本地快速上手

1) 后端准备

- 进入 `backend`：

  cd backend

- 新建 `.env` 并填写（示例）：

  SUPABASE_URL=https://<your-supabase>.supabase.co
  SUPABASE_SERVICE_KEY=<your-service-role-key>
  BAILIAN_API_BASE_URL=https://dashscope.aliyuncs.com/compatible-mode/v1
  BAILIAN_API_KEY=sk-xxxxxxxxxxxx

- 安装并启动：

  npm install
  npm run dev

开发注意：请勿将真实密钥提交到远程仓库。

2) 前端准备

- 进入 `frontend`：

  cd frontend
  npm install
  npm run dev

3) 调试 AI（后端代理）

后端提供开发专用调试端点：

- POST /api/dev/ai-test-raw
  - 把请求原样转发给 Bailian，返回远端响应，便于调试请求结构与 headers
- POST /api/dev/ai-test
  - 使用后端的解析逻辑，返回结构化的旅行计划 JSON

示例请求 body（JSON）:

{
  "destination":"北京",
  "startDate":"2025-12-01",
  "endDate":"2025-12-03",
  "budget":3000,
  "travelers":2,
  "preferences":["美食","文化"]
}

测试

- 后端有集成测试脚本：`backend/scripts/integration-test.js`
- 运行：

  node backend/scripts/integration-test.js

安全和生产说明

- 不要在前端暴露 `SUPABASE_SERVICE_KEY` 或 `BAILIAN_API_KEY`。
- 将 dev-only 端点（`/api/dev/*`）在生产中删除或受限访问。
- 开发环境中可启用自动确认的注册逻辑（仅测试），生产中请使用邮件/验证码流程。

提交规范

- 建议使用 Conventional Commits 风格，例如：
  - feat(ai): add compatible-mode proxy
  - fix(auth): ensure profile insertion
  - docs: update README

如果你需要：我可以把这个 README 的内容合入主 README.md（覆盖或合并），并把所有当前变更提交并推送到远程。或者我也可以把 README 放到 `docs/` 下并在主 README 中链接。请告诉我你的偏好。