# 快速部署指南

## 🚀 5 分钟快速部署

### 前提条件
- 阿里云 Ubuntu 24.04 服务器
- 域名已解析到服务器 IP
- 本地已安装 Git 和 SSH 客户端

---

## 方式一：自动化部署（推荐）

### 步骤 1：在服务器上配置环境

SSH 登录服务器后，运行：

```bash
# 下载项目代码
cd ~
git clone <你的仓库地址> manqiyou-temp
cd manqiyou-temp

# 运行环境配置脚本
bash deploy/setup-server.sh
```

### 步骤 2：创建项目目录并上传代码

```bash
# 创建项目目录
sudo mkdir -p /opt/mqyweb
sudo chown -R $USER:$USER /opt/mqyweb

# 移动代码到项目目录
mv ~/manqiyou-temp/* /opt/mqyweb/
mv ~/manqiyou-temp/.* /opt/mqyweb/ 2>/dev/null || true
rm -rf ~/manqiyou-temp
```

### 步骤 3：运行部署脚本

```bash
cd /opt/mqyweb
bash deploy/deploy.sh
```

脚本会提示输入域名，然后自动完成：
- ✅ 构建前端和后端
- ✅ 配置进程管理
- ✅ 配置 Nginx

### 步骤 4：配置 SSL 证书

```bash
bash deploy/ssl-setup.sh
```

输入域名和邮箱，自动获取 Let's Encrypt 证书。

### 完成！🎉

访问 `https://your-domain.com` 查看网站。

---

## 方式二：从本地上传部署

### 步骤 1：在本地上传代码

**Windows PowerShell:**
```powershell
cd D:\mrcweb1
.\deploy\upload-to-server.ps1 -ServerIP "your-server-ip" -Username "your-username"
```

**Linux/Mac:**
```bash
cd /path/to/mrcweb1
rsync -avz --exclude 'node_modules' --exclude 'target' --exclude '.git' \
  ./ username@your-server-ip:/opt/mqyweb/
```

### 步骤 2：SSH 登录服务器

```bash
ssh username@your-server-ip
cd /opt/mqyweb
```

### 步骤 3：运行部署脚本

```bash
# 配置环境（首次部署）
bash deploy/setup-server.sh

# 部署项目
bash deploy/deploy.sh

# 配置 SSL
bash deploy/ssl-setup.sh
```

---

## 方式三：手动部署

如果自动化脚本遇到问题，可以参考 [DEPLOYMENT.md](../DEPLOYMENT.md) 进行手动部署。

---

## 📊 部署后检查

### 检查服务状态

```bash
# 前端状态
pm2 status

# 后端状态
sudo systemctl status manqiyou-backend

# Nginx 状态
sudo systemctl status nginx
```

### 查看日志

```bash
# 前端日志
pm2 logs manqiyou-frontend

# 后端日志
sudo journalctl -u manqiyou-backend -f

# Nginx 日志
sudo tail -f /var/log/nginx/manqiyou_error.log
```

### 测试 API

```bash
# 测试后端健康检查
curl http://localhost:8080/api/health

# 测试前端
curl http://localhost:3000

# 测试 Nginx 代理
curl http://your-domain.com/api/health
```

---

## 🔄 日常更新

### 更新代码

```bash
cd /opt/mqyweb
bash deploy/update.sh
```

这个脚本会自动：
1. 拉取最新代码
2. 构建前后端
3. 重启服务

---

## 🐛 常见问题

### 1. 端口被占用

```bash
# 查看端口占用
sudo netstat -tulpn | grep -E ':(80|443|3000|8080)'

# 停止占用端口的进程
sudo kill -9 <PID>
```

### 2. 前端构建失败

```bash
cd /opt/mqyweb/frontend
rm -rf node_modules .next
npm install
npm run build
```

### 3. 后端启动失败

```bash
# 查看详细日志
sudo journalctl -u manqiyou-backend -n 100 --no-pager

# 检查 Java 版本
java -version

# 手动测试启动
cd /opt/mqyweb/backend/manqiyou-app
java -jar "$(ls target/manqiyou-app-*.jar | grep -v '\.original$' | head -n 1)"
```

### 4. Nginx 配置错误

```bash
# 测试配置
sudo nginx -t

# 查看错误日志
sudo tail -f /var/log/nginx/error.log

# 重新加载配置
sudo systemctl reload nginx
```

### 5. SSL 证书获取失败

确保：
- 域名已正确解析到服务器 IP
- 防火墙允许 80 和 443 端口
- Nginx 正在运行

```bash
# 检查域名解析
nslookup your-domain.com

# 检查防火墙
sudo ufw status

# 手动获取证书
sudo certbot --nginx -d your-domain.com -d www.your-domain.com
```

---

## 📞 获取帮助

如果遇到问题：

1. 查看详细部署文档：[DEPLOYMENT.md](../DEPLOYMENT.md)
2. 检查服务日志
3. 确认所有依赖已正确安装
4. 检查防火墙和安全组规则

---

## 🎯 性能优化建议

### 1. 启用 Gzip 压缩

在 Nginx 配置中添加：
```nginx
gzip on;
gzip_vary on;
gzip_min_length 1024;
gzip_types text/plain text/css text/xml text/javascript application/javascript application/json;
```

### 2. 配置缓存

```nginx
# 静态资源缓存
location ~* \.(jpg|jpeg|png|gif|ico|css|js)$ {
    expires 1y;
    add_header Cache-Control "public, immutable";
}
```

### 3. 增加 PM2 实例数

```bash
# 编辑 ecosystem.config.js
# 将 instances: 1 改为 instances: 'max'
pm2 restart manqiyou-frontend
```

---

**部署愉快！** 🚀
