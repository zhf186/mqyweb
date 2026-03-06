# 漫骑游项目 - 部署检查清单

## 📋 部署前检查

### 本地准备
- [ ] 所有代码已提交到 Git
- [ ] 代码已推送到 GitHub (git@github.com:zhf186/mqyweb.git)
- [ ] 本地测试通过（前端和后端都能正常运行）
- [ ] 环境变量模板已创建 (.env.production)
- [ ] Docker 配置文件已创建
  - [ ] docker-compose.prod.yml
  - [ ] backend/manqiyou-app/Dockerfile
  - [ ] frontend/Dockerfile
- [ ] Nginx 配置文件已创建 (deploy/nginx-manqiyou.conf)
- [ ] 部署脚本已创建
  - [ ] deploy/quick-deploy.sh
  - [ ] deploy/setup-ssl.sh

### 服务器准备
- [ ] 服务器可访问 (SSH 连接正常)
- [ ] 服务器 IP: 47.97.21.33
- [ ] Docker 已安装并运行
- [ ] Docker Compose 已安装
- [ ] Git 已安装
- [ ] Nginx 已安装并运行
- [ ] SSH 密钥已配置（用于 Git）
- [ ] 域名 DNS 已解析到服务器 IP
  - [ ] www.zjmqy.cc → 47.97.21.33
  - [ ] zjmqy.cc → 47.97.21.33

### 端口检查
- [ ] 80 端口可用（HTTP）
- [ ] 443 端口可用（HTTPS）
- [ ] 3000 端口可用（前端 Docker 内部）
- [ ] 8080 端口可用（后端 Docker 内部）
- [ ] 5432 端口可用（PostgreSQL Docker 内部）
- [ ] 6379 端口可用（Redis Docker 内部）

---

## 🚀 部署步骤

### 第一步：连接服务器
```bash
ssh root@47.97.21.33
# 或
ssh your-username@47.97.21.33
```
- [ ] 成功连接到服务器

### 第二步：检查环境
```bash
docker --version
docker-compose --version
git --version
nginx -v
```
- [ ] Docker 版本正常
- [ ] Docker Compose 版本正常
- [ ] Git 版本正常
- [ ] Nginx 版本正常

### 第三步：配置 SSH 密钥
```bash
ssh-keygen -t ed25519 -C "your-email@example.com"
cat ~/.ssh/id_ed25519.pub
# 将公钥添加到 GitHub
ssh -T git@github.com
```
- [ ] SSH 密钥已生成
- [ ] 公钥已添加到 GitHub
- [ ] Git SSH 连接测试通过

### 第四步：克隆代码
```bash
sudo mkdir -p /var/www/manqiyou
sudo chown -R $USER:$USER /var/www/manqiyou
cd /var/www/manqiyou
git clone git@github.com:zhf186/mqyweb.git .
```
- [ ] 项目目录已创建
- [ ] 代码已克隆成功
- [ ] 文件结构正确

### 第五步：配置环境变量
```bash
cd /var/www/manqiyou
cp .env.production .env
nano .env
```
修改以下内容：
- [ ] DB_PASSWORD 已设置（强密码）
- [ ] REDIS_PASSWORD 已设置（强密码）
- [ ] JWT_SECRET 已设置（随机字符串）
- [ ] NEXT_PUBLIC_API_URL 已确认（https://www.zjmqy.cc/api）

### 第六步：构建并启动 Docker 容器
```bash
cd /var/www/manqiyou
docker-compose -f docker-compose.prod.yml up -d --build
```
- [ ] 构建过程无错误
- [ ] 所有容器已启动
- [ ] 容器健康检查通过

### 第七步：验证服务
```bash
docker-compose -f docker-compose.prod.yml ps
curl http://localhost:8080/api/health
curl http://localhost:3000
```
- [ ] 4 个容器都在运行
- [ ] 后端 API 响应正常
- [ ] 前端页面响应正常

### 第八步：配置 Nginx
```bash
sudo cp /var/www/manqiyou/deploy/nginx-manqiyou.conf /etc/nginx/sites-available/manqiyou
sudo ln -s /etc/nginx/sites-available/manqiyou /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```
- [ ] Nginx 配置文件已复制
- [ ] 软链接已创建
- [ ] Nginx 配置测试通过
- [ ] Nginx 已重载

### 第九步：配置 SSL 证书
```bash
sudo mkdir -p /var/www/certbot
cd /var/www/manqiyou/deploy
sudo nano setup-ssl.sh  # 修改邮箱地址
chmod +x setup-ssl.sh
sudo ./setup-ssl.sh
```
- [ ] Certbot 已安装
- [ ] SSL 证书已获取
- [ ] 证书文件存在
- [ ] 自动续期已配置
- [ ] 续期测试通过

### 第十步：启用 HTTPS
```bash
sudo nginx -t
sudo systemctl reload nginx
```
- [ ] Nginx 配置测试通过
- [ ] Nginx 已重载
- [ ] HTTPS 可访问

---

## ✅ 部署后验证

### 功能测试
- [ ] 访问 https://www.zjmqy.cc 正常
- [ ] HTTP 自动跳转到 HTTPS
- [ ] SSL 证书有效（浏览器显示锁图标）
- [ ] 首页加载正常
- [ ] 所有页面可访问
  - [ ] /about
  - [ ] /routes
  - [ ] /ebike
  - [ ] /community
  - [ ] /partners
  - [ ] /goods
- [ ] 图片正常显示
- [ ] 动画效果正常
- [ ] 中英文切换正常
- [ ] 移动端响应式正常
- [ ] API 接口正常
  - [ ] /api/health
  - [ ] /api/routes
  - [ ] /api/categories

### 性能测试
```bash
curl -w "@-" -o /dev/null -s https://www.zjmqy.cc/ <<'EOF'
    time_total:  %{time_total}\n
EOF
```
- [ ] 首页加载时间 < 3 秒
- [ ] API 响应时间 < 500ms
- [ ] 图片加载正常

### 安全检查
- [ ] HTTPS 强制跳转正常
- [ ] SSL 证书有效期 > 60 天
- [ ] 安全响应头已配置
- [ ] 防火墙已配置
- [ ] 只开放必要端口（80, 443）

### 日志检查
```bash
docker-compose -f docker-compose.prod.yml logs --tail=50
sudo tail -50 /var/log/nginx/manqiyou_access.log
sudo tail -50 /var/log/nginx/manqiyou_error.log
```
- [ ] Docker 容器日志无错误
- [ ] Nginx 访问日志正常
- [ ] Nginx 错误日志无严重错误

---

## 🔧 配置检查

### Docker 容器
```bash
docker-compose -f docker-compose.prod.yml ps
```
预期结果：
- [ ] manqiyou-frontend (Up, healthy)
- [ ] manqiyou-backend (Up, healthy)
- [ ] manqiyou-postgres (Up, healthy)
- [ ] manqiyou-redis (Up, healthy)

### Nginx 配置
```bash
sudo nginx -t
sudo systemctl status nginx
```
- [ ] Nginx 配置语法正确
- [ ] Nginx 服务运行中
- [ ] 监听 80 和 443 端口

### SSL 证书
```bash
sudo certbot certificates
sudo systemctl status certbot.timer
```
- [ ] 证书存在且有效
- [ ] 自动续期 timer 运行中
- [ ] 下次续期时间正常

### 防火墙
```bash
sudo ufw status
```
- [ ] 防火墙已启用
- [ ] 80/tcp 已开放
- [ ] 443/tcp 已开放
- [ ] SSH 端口已开放

---

## 📊 监控配置

### 日志轮转
```bash
ls -la /etc/logrotate.d/manqiyou
```
- [ ] 日志轮转配置已创建
- [ ] 配置文件权限正确

### 数据库备份
```bash
ls -la /var/www/manqiyou/backup.sh
crontab -l | grep backup
```
- [ ] 备份脚本已创建
- [ ] 备份脚本可执行
- [ ] Cron 任务已配置

### 系统监控
```bash
docker stats --no-stream
free -h
df -h
```
- [ ] 容器资源使用正常
- [ ] 内存使用 < 80%
- [ ] 磁盘使用 < 80%

---

## 🐛 常见问题检查

### 容器无法启动
- [ ] 检查端口占用
- [ ] 检查环境变量
- [ ] 查看容器日志
- [ ] 检查 Docker 服务状态

### Nginx 502 错误
- [ ] 检查后端容器是否运行
- [ ] 检查后端端口是否正确
- [ ] 查看 Nginx 错误日志
- [ ] 检查 upstream 配置

### SSL 证书问题
- [ ] 检查域名 DNS 解析
- [ ] 检查 80 端口可访问
- [ ] 查看 Certbot 日志
- [ ] 检查证书文件权限

### 页面无法访问
- [ ] 检查 Nginx 配置
- [ ] 检查防火墙规则
- [ ] 检查域名解析
- [ ] 查看浏览器控制台错误

---

## 📝 部署完成记录

### 部署信息
- 部署日期: _______________
- 部署人员: _______________
- 服务器 IP: 47.97.21.33
- 域名: www.zjmqy.cc
- Git Commit: _______________

### 服务版本
- Node.js: _______________
- Java: _______________
- PostgreSQL: _______________
- Redis: _______________
- Nginx: _______________

### 容器信息
- Frontend Image: _______________
- Backend Image: _______________
- Postgres Image: postgres:16-alpine
- Redis Image: redis:7-alpine

### SSL 证书
- 颁发日期: _______________
- 到期日期: _______________
- 续期状态: _______________

---

## 🎉 部署完成

所有检查项都已完成，项目已成功部署！

**访问地址**: https://www.zjmqy.cc

**下一步**:
1. 通知团队部署完成
2. 进行全面功能测试
3. 监控系统运行状态
4. 准备运营推广

---

**检查清单版本**: 1.0
**最后更新**: 2025-01-29
