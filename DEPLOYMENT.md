# AI Travel Planner - 部署指南

本文档详细说明如何部署 AI Travel Planner 到生产环境。

## 目录

1. [前置准备](#前置准备)
2. [Supabase 配置](#supabase-配置)
3. [本地部署](#本地部署)
4. [Docker 部署](#docker-部署)
5. [云服务器部署](#云服务器部署)
6. [GitHub Actions CI/CD](#github-actions-cicd)
7. [域名和 HTTPS](#域名和-https)
8. [监控和维护](#监控和维护)

---

## 前置准备

### 需要准备的账号和服务

1. **Supabase 账号**
   - 网址：https://supabase.com
   - 创建一个新项目

2. **阿里云账号**
   - 开通百炼平台服务
   - 获取 API Key

3. **高德地图账号**（可选）
   - 网址：https://lbs.amap.com
   - 申请 Web 服务 API Key

4. **服务器**（选择其一）
   - 阿里云 ECS
   - 腾讯云 CVM
   - AWS EC2
   - 其他 VPS

---

## Supabase 配置

### 1. 创建 Supabase 项目

1. 登录 Supabase
2. 点击"New Project"
3. 填写项目信息：
   - Name: ai-travel-planner
   - Database Password: [设置强密码]
   - Region: 选择离用户最近的区域

### 2. 创建数据库表

1. 进入项目的 SQL Editor
2. 复制 `supabase_schema.sql` 的内容
3. 执行 SQL 脚本
4. 确认表已创建：
   - `travel_plans`
   - `expenses`

### 3. 获取 API 密钥

在 Project Settings > API 中获取：
- `Project URL` → `SUPABASE_URL`
- `anon public` → `SUPABASE_ANON_KEY`
- `service_role` → `SUPABASE_SERVICE_KEY`

**注意**：`service_role` key 需要保密，只在后端使用。

---

## 本地部署

### 1. 克隆项目

```bash
git clone https://github.com/banjitino12/AITravelPlanner.git
cd AITravelPlanner
```

### 2. 安装依赖

```bash
# 安装 root 依赖
npm install

# 安装前端依赖
cd frontend
npm install

# 安装后端依赖
cd ../backend
npm install
cd ..
```

### 3. 配置环境变量

**前端配置** (`frontend/.env`):
```env
VITE_API_BASE_URL=http://localhost:5000
VITE_SUPABASE_URL=你的_supabase_url
VITE_SUPABASE_ANON_KEY=你的_supabase_anon_key
VITE_AMAP_KEY=你的_高德地图_key
```

**后端配置** (`backend/.env`):
```env
PORT=5000
NODE_ENV=development
SUPABASE_URL=你的_supabase_url
SUPABASE_SERVICE_KEY=你的_supabase_service_key
```

### 4. 启动服务

```bash
# 开发模式（同时启动前后端）
npm run dev

# 或者分别启动
npm run dev:frontend  # 前端 http://localhost:3000
npm run dev:backend   # 后端 http://localhost:5000
```

---

## Docker 部署

### 方法一：使用 Docker Compose（推荐）

1. **准备环境变量**

创建 `.env` 文件：
```env
SUPABASE_URL=你的_supabase_url
SUPABASE_SERVICE_KEY=你的_supabase_service_key
```

2. **构建并启动**

```bash
docker-compose up -d
```

3. **查看日志**

```bash
docker-compose logs -f
```

4. **停止服务**

```bash
docker-compose down
```

### 方法二：手动构建

1. **构建镜像**

```bash
docker build -t ai-travel-planner:latest .
```

2. **运行容器**

```bash
docker run -d \
  --name ai-travel-planner \
  -p 3000:3000 \
  -p 5000:5000 \
  -e SUPABASE_URL=你的_url \
  -e SUPABASE_SERVICE_KEY=你的_key \
  ai-travel-planner:latest
```

3. **查看日志**

```bash
docker logs -f ai-travel-planner
```

---

## 云服务器部署

### 以阿里云 ECS 为例

#### 1. 服务器配置要求

- **最低配置**：
  - CPU: 1核
  - 内存: 2GB
  - 存储: 40GB
  - 带宽: 1Mbps

- **推荐配置**：
  - CPU: 2核
  - 内存: 4GB
  - 存储: 40GB
  - 带宽: 3Mbps

#### 2. 安装依赖

```bash
# 更新系统
sudo apt update && sudo apt upgrade -y

# 安装 Node.js 18
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# 安装 Docker
curl -fsSL https://get.docker.com | sh
sudo usermod -aG docker $USER

# 安装 Docker Compose
sudo apt install docker-compose-plugin
```

#### 3. 部署应用

```bash
# 克隆项目
git clone https://github.com/banjitino12/AITravelPlanner.git
cd AITravelPlanner

# 配置环境变量
nano backend/.env
# 填入 Supabase 配置

nano frontend/.env
# 填入前端配置

# 使用 Docker Compose 部署
docker-compose up -d
```

#### 4. 配置防火墙

```bash
# 开放端口
sudo ufw allow 3000/tcp
sudo ufw allow 5000/tcp
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw enable
```

#### 5. 配置反向代理（Nginx）

安装 Nginx:
```bash
sudo apt install nginx
```

创建配置文件 `/etc/nginx/sites-available/ai-travel-planner`:
```nginx
server {
    listen 80;
    server_name your-domain.com;

    # 前端
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    # 后端 API
    location /api {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

启用配置:
```bash
sudo ln -s /etc/nginx/sites-available/ai-travel-planner /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

---

## GitHub Actions CI/CD

### 1. 配置 Secrets

在 GitHub 仓库的 Settings > Secrets and variables > Actions 中添加：

- `ALIYUN_USERNAME`: 阿里云账号
- `ALIYUN_PASSWORD`: 阿里云密码
- `ALIYUN_NAMESPACE`: 镜像命名空间

### 2. 触发自动部署

当代码推送到 `main` 分支时，GitHub Actions 会自动：
1. 构建 Docker 镜像
2. 推送到阿里云容器镜像服务
3. 打上 `latest` 和 git SHA 标签

### 3. 拉取最新镜像

在服务器上：
```bash
# 登录阿里云镜像仓库
docker login registry.cn-hangzhou.aliyuncs.com

# 拉取最新镜像
docker pull registry.cn-hangzhou.aliyuncs.com/your-namespace/ai-travel-planner:latest

# 重启容器
docker-compose down
docker-compose up -d
```

---

## 域名和 HTTPS

### 1. 配置域名

1. 购买域名
2. 添加 A 记录指向服务器 IP
3. 等待 DNS 生效（通常几分钟）

### 2. 配置 HTTPS (Let's Encrypt)

```bash
# 安装 Certbot
sudo apt install certbot python3-certbot-nginx

# 获取证书
sudo certbot --nginx -d your-domain.com

# 自动续期
sudo certbot renew --dry-run
```

Certbot 会自动修改 Nginx 配置，添加 HTTPS 支持。

---

## 监控和维护

### 1. 查看日志

```bash
# Docker 日志
docker-compose logs -f

# Nginx 日志
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log
```

### 2. 监控系统资源

```bash
# 查看资源使用
docker stats

# 查看磁盘使用
df -h

# 查看内存使用
free -h
```

### 3. 备份数据

Supabase 会自动备份数据库，但建议定期导出：

```bash
# 使用 Supabase CLI 导出
supabase db dump -f backup.sql
```

### 4. 更新应用

```bash
# 拉取最新代码
git pull origin main

# 重新构建并启动
docker-compose up -d --build
```

### 5. 健康检查

应用提供健康检查端点：
```bash
curl http://localhost:5000/health
```

返回：
```json
{
  "status": "ok",
  "timestamp": "2025-01-06T12:00:00.000Z"
}
```

---

## 故障排查

### 容器无法启动

```bash
# 查看容器状态
docker ps -a

# 查看错误日志
docker logs container_name
```

### 端口被占用

```bash
# 查看端口占用
sudo lsof -i :3000
sudo lsof -i :5000

# 终止进程
sudo kill -9 PID
```

### 数据库连接失败

1. 检查 Supabase URL 和 Key 是否正确
2. 检查网络连接
3. 查看 Supabase 项目状态

### 内存不足

```bash
# 清理 Docker
docker system prune -a

# 重启 Docker
sudo systemctl restart docker
```

---

## 生产环境检查清单

部署前确认：

- [ ] 所有 API Key 已配置
- [ ] Supabase 数据库表已创建
- [ ] 防火墙规则已配置
- [ ] HTTPS 证书已配置
- [ ] 环境变量已设置
- [ ] 域名解析已生效
- [ ] 备份策略已设置
- [ ] 监控已配置
- [ ] 日志系统正常
- [ ] 健康检查通过

---

## 安全建议

1. **不要在代码中硬编码密钥**
2. **使用环境变量管理敏感信息**
3. **定期更新依赖包**
4. **启用 HTTPS**
5. **设置强密码**
6. **限制 API 访问频率**
7. **定期备份数据**
8. **监控异常访问**

---

## 性能优化

1. **启用 CDN**：加速静态资源加载
2. **启用 Gzip**：压缩传输数据
3. **使用缓存**：减少 API 调用
4. **优化镜像**：使用多阶段构建
5. **负载均衡**：多实例部署

---

需要帮助？查看 [GitHub Issues](https://github.com/banjitino12/AITravelPlanner/issues)
