# 漫骑游项目 - 阿里云部署指南

## 📋 部署概览

本指南将帮助你在阿里云 Ubuntu 24.04 服务器上部署漫骑游项目，使用 Nginx 作为反向代理。

### 架构说明
- **前端**: Next.js 14 (端口 3000) → Nginx 反向代理
- **后端**: Spring Boot (端口 8080) → Nginx 反向代理
- **数据库**: PostgreSQL (生产环境) 或 H2 (开发环境)
- **进程管理**: PM2 (前端) + systemd (后端)

---

## 🚀 部署步骤

### 第一步：服务器环境准备

#### 1.1 更新系统
```bash
sudo apt update
sudo apt upgrade -y
```

#### 1.2 安装 Node.js 20.x (前端需要)
```bash
# 安装 Node.js 20.x LTS
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# 验证安装
node --version  # 应该显示 v20.x.x
npm --version
```

#### 1.3 安装 Java 17 (后端需要)
```bash
# 安装 OpenJDK 17
sudo apt install -y openjdk-17-jdk

# 验证安装
java -version  # 应该显示 openjdk version "17.x.x"
```

#### 1.4 安装 PM2 (进程管理)
```bash
sudo npm install -g pm2

# 设置 PM2 开机自启
pm2 startup
sudo env PATH=$PATH:/usr/bin pm2 startup systemd -u $USER --hp $HOME
```

#### 1.5 安装 PostgreSQL (可选，生产环境推荐)
```bash
# 安装 PostgreSQL 16
sudo apt install -y postgresql postgresql-contrib

# 启动服务
sudo systemctl start postgresql
sudo systemctl enable postgresql

# 创建数据库和用户
sudo -u postgres psql << EOF
CREATE DATABASE manqiyou;
CREATE USER manqiyou_user WITH PASSWORD 'your_secure_password';
GRANT ALL PRIVILEGES ON DATABASE manqiyou TO manqiyou_user;
\q
EOF
```

---

### 第二步：上传项目代码

#### 2.1 在服务器上创建项目目录
```bash
# 创建项目目录
sudo mkdir -p /var/www/manqiyou
sudo chown -R $USER:$USER /var/www/manqiyou
cd /var/www/manqiyou
```

#### 2.2 上传代码（从本地）

**方式一：使用 Git (推荐)**
```bash
# 在服务器上
cd /var/www/manqiyou
git clone <你的仓库地址> .
```

**方式二：使用 SCP (从本地 Windows)**
```powershell
# 在本地 Windows PowerShell 中执行
# 压缩项目（排除 node_modules 和 target）
tar -czf manqiyou.tar.gz --exclude=node_modules --exclude=target --exclude=.git .

# 上传到服务器
scp manqiyou.tar.gz username@your-server-ip:/var/www/manqiyou/

# 然后在服务器上解压
ssh username@your-server-ip
cd /var/www/manqiyou
tar -xzf manqiyou.tar.gz
rm manqiyou.tar.gz
```

**方式三：使用 rsync (推荐，支持增量同步)**
```bash
# 在本地执行
rsync -avz --exclude 'node_modules' --exclude 'target' --exclude '.git' \
  ./ username@your-server-ip:/var/www/manqiyou/
```

---

### 第三步：配置和构建项目

#### 3.1 配置前端环境变量
```bash
cd /var/www/manqiyou/frontend

# 创建生产环境配置
cat > .env.production << 'EOF'
NEXT_PUBLIC_API_URL=https://your-domain.com/api
EOF
```

#### 3.2 构建前端
```bash
cd /var/www/manqiyou/frontend

# 安装依赖
npm install --production=false

# 构建生产版本
npm run build

# 测试构建是否成功
npm run start  # 按 Ctrl+C 停止
```

#### 3.3 配置后端环境变量
```bash
cd /var/www/manqiyou/backend

# 创建环境变量文件
cat > .env << 'EOF'
# 数据库配置 (如果使用 PostgreSQL)
DB_HOST=localhost
DB_PORT=5432
DB_NAME=manqiyou
DB_USERNAME=manqiyou_user
DB_PASSWORD=your_secure_password

# JWT 配置
JWT_SECRET=your_jwt_secret_key_change_this_in_production

# 服务器配置
SERVER_PORT=8080
EOF
```

#### 3.4 构建后端
```bash
cd /var/www/manqiyou/backend/manqiyou-app

# 使用 Maven Wrapper 构建
chmod +x mvnw
./mvnw clean package -DskipTests

# 构建产物在 target/manqiyou-app-0.0.1-SNAPSHOT.jar
```

---

### 第四步：配置进程管理

#### 4.1 配置 PM2 管理前端
```bash
cd /var/www/manqiyou/frontend

# 创建 PM2 配置文件
cat > ecosystem.config.js << 'EOF'
module.exports = {
  apps: [{
    name: 'manqiyou-frontend',
    script: 'npm',
    args: 'start',
    cwd: '/var/www/manqiyou/frontend',
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    }
  }]
}
EOF

# 启动前端
pm2 start ecosystem.config.js

# 保存 PM2 配置
pm2 save
```

#### 4.2 配置 systemd 管理后端
```bash
# 创建 systemd 服务文件
sudo tee /etc/systemd/system/manqiyou-backend.service > /dev/null << 'EOF'
[Unit]
Description=Manqiyou Backend Service
After=network.target

[Service]
Type=simple
User=your-username
WorkingDirectory=/var/www/manqiyou/backend/manqiyou-app
EnvironmentFile=/var/www/manqiyou/backend/.env
ExecStart=/usr/bin/java -jar target/manqiyou-app-0.0.1-SNAPSHOT.jar
Restart=on-failure
RestartSec=10
StandardOutput=journal
StandardError=journal

[Install]
WantedBy=multi-user.target
EOF

# 替换 your-username 为实际用户名
sudo sed -i "s/your-username/$USER/g" /etc/systemd/system/manqiyou-backend.service

# 重载 systemd 配置
sudo systemctl daemon-reload

# 启动后端服务
sudo systemctl start manqiyou-backend
sudo systemctl enable manqiyou-backend

# 查看服务状态
sudo systemctl status manqiyou-backend
```

---

### 第五步：配置 Nginx 反向代理

#### 5.1 创建 Nginx 配置文件
```bash
sudo tee /etc/nginx/sites-available/manqiyou << 'EOF'
# 漫骑游项目 Nginx 配置

# 后端 API 上游
upstream manqiyou_backend {
    server 127.0.0.1:8080;
    keepalive 64;
}

# 前端 Next.js 上游
upstream manqiyou_frontend {
    server 127.0.0.1:3000;
    keepalive 64;
}

# HTTP 服务器 (重定向到 HTTPS)
server {
    listen 80;
    listen [::]:80;
    server_name your-domain.com www.your-domain.com;

    # Let's Encrypt 验证路径
    location /.well-known/acme-challenge/ {
        root /var/www/certbot;
    }

    # 重定向到 HTTPS
    location / {
        return 301 https://$server_name$request_uri;
    }
}

# HTTPS 服务器
server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name your-domain.com www.your-domain.com;

    # SSL 证书配置 (使用 Let's Encrypt)
    ssl_certificate /etc/letsencrypt/live/your-domain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/your-domain.com/privkey.pem;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
    ssl_prefer_server_ciphers on;

    # 安全头
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;

    # 日志
    access_log /var/log/nginx/manqiyou_access.log;
    error_log /var/log/nginx/manqiyou_error.log;

    # 客户端上传大小限制
    client_max_body_size 20M;

    # 后端 API 代理
    location /api/ {
        proxy_pass http://manqiyou_backend/api/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }

    # H2 数据库控制台 (仅开发环境，生产环境应删除)
    location /h2-console/ {
        proxy_pass http://manqiyou_backend/h2-console/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    # 静态资源 (品牌素材)
    location /brand_assets/ {
        alias /var/www/manqiyou/frontend/public/brand_assets/;
        expires 30d;
        add_header Cache-Control "public, immutable";
    }

    # Next.js 静态资源
    location /_next/static/ {
        proxy_pass http://manqiyou_frontend/_next/static/;
        expires 365d;
        add_header Cache-Control "public, immutable";
    }

    # 前端应用 (所有其他请求)
    location / {
        proxy_pass http://manqiyou_frontend;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
EOF

# 替换域名
read -p "请输入你的域名 (例如: manqiyou.com): " domain
sudo sed -i "s/your-domain.com/$domain/g" /etc/nginx/sites-available/manqiyou
```

#### 5.2 启用站点配置
```bash
# 创建软链接
sudo ln -s /etc/nginx/sites-available/manqiyou /etc/nginx/sites-enabled/

# 测试 Nginx 配置
sudo nginx -t

# 如果测试通过，重载 Nginx
sudo systemctl reload nginx
```

---

### 第六步：配置 SSL 证书 (Let's Encrypt)

#### 6.1 安装 Certbot
```bash
sudo apt install -y certbot python3-certbot-nginx
```

#### 6.2 获取 SSL 证书
```bash
# 方式一：自动配置 (推荐)
sudo certbot --nginx -d your-domain.com -d www.your-domain.com

# 方式二：仅获取证书
sudo certbot certonly --nginx -d your-domain.com -d www.your-domain.com

# 设置自动续期
sudo systemctl enable certbot.timer
sudo systemctl start certbot.timer
```

#### 6.3 测试证书续期
```bash
sudo certbot renew --dry-run
```

---

### 第七步：配置防火墙

```bash
# 允许 HTTP 和 HTTPS
sudo ufw allow 'Nginx Full'

# 如果需要 SSH
sudo ufw allow OpenSSH

# 启用防火墙
sudo ufw enable

# 查看状态
sudo ufw status
```

---

## 🔧 日常运维命令

### 查看服务状态
```bash
# 前端状态
pm2 status
pm2 logs manqiyou-frontend

# 后端状态
sudo systemctl status manqiyou-backend
sudo journalctl -u manqiyou-backend -f

# Nginx 状态
sudo systemctl status nginx
sudo tail -f /var/log/nginx/manqiyou_access.log
sudo tail -f /var/log/nginx/manqiyou_error.log
```

### 重启服务
```bash
# 重启前端
pm2 restart manqiyou-frontend

# 重启后端
sudo systemctl restart manqiyou-backend

# 重启 Nginx
sudo systemctl restart nginx
```

### 更新代码
```bash
# 1. 拉取最新代码
cd /var/www/manqiyou
git pull

# 2. 更新前端
cd frontend
npm install
npm run build
pm2 restart manqiyou-frontend

# 3. 更新后端
cd ../backend/manqiyou-app
./mvnw clean package -DskipTests
sudo systemctl restart manqiyou-backend
```

---

## 📊 监控和日志

### 设置日志轮转
```bash
# 创建日志轮转配置
sudo tee /etc/logrotate.d/manqiyou << 'EOF'
/var/log/nginx/manqiyou_*.log {
    daily
    missingok
    rotate 14
    compress
    delaycompress
    notifempty
    create 0640 www-data adm
    sharedscripts
    postrotate
        [ -f /var/run/nginx.pid ] && kill -USR1 `cat /var/run/nginx.pid`
    endscript
}
EOF
```

### 性能监控
```bash
# 安装 htop
sudo apt install -y htop

# 查看系统资源
htop

# 查看端口占用
sudo netstat -tulpn | grep -E ':(80|443|3000|8080)'
```

---

## 🔒 安全建议

1. **定期更新系统**
   ```bash
   sudo apt update && sudo apt upgrade -y
   ```

2. **配置 fail2ban 防止暴力破解**
   ```bash
   sudo apt install -y fail2ban
   sudo systemctl enable fail2ban
   sudo systemctl start fail2ban
   ```

3. **禁用 H2 控制台** (生产环境)
   - 从 Nginx 配置中删除 `/h2-console/` location
   - 或在后端配置中禁用 H2 控制台

4. **使用强密码**
   - 数据库密码
   - JWT Secret
   - 服务器 SSH 密钥

5. **定期备份数据库**
   ```bash
   # PostgreSQL 备份脚本
   pg_dump -U manqiyou_user manqiyou > backup_$(date +%Y%m%d).sql
   ```

---

## 🐛 故障排查

### 前端无法访问
```bash
# 检查 PM2 状态
pm2 status
pm2 logs manqiyou-frontend --lines 100

# 检查端口占用
sudo netstat -tulpn | grep :3000

# 手动测试
curl http://localhost:3000
```

### 后端无法访问
```bash
# 检查服务状态
sudo systemctl status manqiyou-backend
sudo journalctl -u manqiyou-backend -n 100

# 检查端口占用
sudo netstat -tulpn | grep :8080

# 手动测试
curl http://localhost:8080/api/health
```

### Nginx 错误
```bash
# 测试配置
sudo nginx -t

# 查看错误日志
sudo tail -f /var/log/nginx/error.log
sudo tail -f /var/log/nginx/manqiyou_error.log
```

---

## 📞 技术支持

如有问题，请检查：
1. 服务日志
2. Nginx 错误日志
3. 系统资源使用情况
4. 防火墙规则
5. 域名 DNS 解析

---

**部署完成后，访问 https://your-domain.com 即可看到网站！** 🎉
