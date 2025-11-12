# 🚀 AI Travel Planner - 快速参考

## 一键安装

### Windows
```cmd
setup.bat
```

### Linux/Mac
```bash
chmod +x setup.sh
./setup.sh
```

---

## 快速命令

### 开发模式
```bash
npm run dev              # 同时启动前后端
npm run dev:frontend     # 仅启动前端
npm run dev:backend      # 仅启动后端
```

### 构建
```bash
npm run build            # 构建所有
npm run build:frontend   # 构建前端
npm run build:backend    # 构建后端
```

### Docker
```bash
docker-compose up -d     # 启动
docker-compose down      # 停止
docker-compose logs -f   # 查看日志
```

---

## 环境变量速查

### 前端 (frontend/.env)
```env
VITE_API_BASE_URL=http://localhost:5000
VITE_SUPABASE_URL=你的_url
VITE_SUPABASE_ANON_KEY=你的_key
VITE_AMAP_KEY=你的_key (可选)
```

### 后端 (backend/.env)
```env
PORT=5000
SUPABASE_URL=你的_url
SUPABASE_SERVICE_KEY=你的_key
```

---

## API 密钥获取

| 服务 | 地址 | 用途 |
|------|------|------|
| Supabase | https://supabase.com | 数据库+认证 |
| 阿里云百炼 | https://bailian.console.aliyun.com/ | AI 服务 |
| 高德地图 | https://console.amap.com/dev/key/app | 地图 (可选) |

---

## 常见问题

### 语音不工作？
- 使用 Chrome/Edge 浏览器
- 允许麦克风权限
- 必须是 HTTPS 或 localhost

### AI 生成失败？
- 检查阿里云 API Key
- 确认账户有余额
- 在设置页面正确输入 Key

### 端口被占用？
```bash
# Windows
netstat -ano | findstr :3000
netstat -ano | findstr :5000

# Linux/Mac
lsof -i :3000
lsof -i :5000
```

---

## 项目结构速览

```
AITravelPlanner/
├── frontend/           前端应用
│   ├── src/pages/     页面组件
│   └── src/services/  API 服务
├── backend/            后端 API
│   ├── src/routes/    路由
│   └── src/services/  业务逻辑
└── docker-compose.yml  Docker 配置
```

---

## 重要链接

- 📖 完整文档: [README.md](README.md)
- 📱 使用指南: [USAGE.md](USAGE.md)
- 🚀 部署指南: [DEPLOYMENT.md](DEPLOYMENT.md)
- 📝 提交文档: [SUBMISSION.md](SUBMISSION.md)
- 🐛 报告问题: [GitHub Issues](https://github.com/banjitino12/AITravelPlanner/issues)

---

## 快速测试

1. **安装**: 运行 `setup.bat` (Windows) 或 `setup.sh` (Linux/Mac)
2. **配置**: 编辑 `.env` 文件
3. **启动**: 运行 `npm run dev`
4. **访问**: http://localhost:3000
5. **注册**: 创建账号
6. **设置**: 配置 API Key
7. **使用**: 开始创建行程！

---

Made with ❤️ by [banjitino12](https://github.com/banjitino12)
