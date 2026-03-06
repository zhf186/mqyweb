# 🎉 漫骑游项目 - 部署就绪

## ✅ 项目状态

**项目已完成开发并准备部署到阿里云服务器！**

---

## 📋 项目信息

### 基本信息
- **项目名称**: 漫骑游官方网站
- **Git 仓库**: git@github.com:zhf186/mqyweb.git
- **服务器 IP**: 47.97.21.33
- **域名**: www.zjmqy.cc
- **部署方式**: Docker + Nginx + Let's Encrypt

### 技术栈
- **前端**: Next.js 14 + TypeScript + Tailwind CSS
- **后端**: Spring Boot 3.2 + Java 17 + PostgreSQL
- **容器化**: Docker + Docker Compose
- **Web 服务器**: Nginx
- **SSL 证书**: Let's Encrypt (自动续期)

---

## 📦 已创建的部署文件

### Docker 配置 (3 个文件)
1. ✅ `docker-compose.prod.yml` - Docker Compose 生产环境配置
2. ✅ `backend/manqiyou-app/Dockerfile` - 后端 Docker 镜像
3. ✅ `frontend/Dockerfile` - 前端 Docker 镜像

### 环境配置 (1 个文件)
4. ✅ `.env.production` - 环境变量模板

### Nginx 配置 (1 个文件)
5. ✅ `deploy/nginx-manqiyou.conf` - Nginx 反向代理配置

### 部署脚本 (3 个文件)
6. ✅ `deploy/quick-deploy.sh` - 一键部署脚本
7. ✅ `deploy/setup-ssl.sh` - SSL 证书配置脚本
8. ✅ `deploy/deploy-to-aliyun.sh` - 完整部署脚本

### 文档文件 (6 个文件)
9. ✅ `deploy/阿里云部署完整方案.md` - 完整部署指南（最重要）
10. ✅ `deploy/README-ALIYUN.md` - 部署文档索引
11. ✅ `deploy/DEPLOYMENT_CHECKLIST.md` - 部署检查清单
12. ✅ `deploy/部署文件说明.md` - 部署文件说明
13. ✅ `PROJECT_SUMMARY.md` - 项目总结
14. ✅ `DEPLOYMENT_READY.md` - 本文档

**总计：14 个新文件**

---

## 🚀 快速部署指南

### 方式一：使用一键部署脚本（推荐）

```bash
# 1. 连接到服务器
ssh root@47.97.21.33

# 2. 克隆代码
sudo mkdir -p /var/www/manqiyou
sudo chown -R $USER:$USER /var/www/manqiyou
git clone git@github.com:zhf186/mqyweb.git /var/www/manqiyou
cd /var/www/manqiyou

# 3. 配置环境变量
cp .env.production .env
nano .env  # 修改密码和密钥

# 4. 运行部署脚本
bash deploy/quick-deploy.sh

# 5. 配置 Nginx
sudo cp deploy/nginx-manqiyou.conf /etc/nginx/sites-available/manqiyou
sudo ln -s /etc/nginx/sites-available/manqiyou /etc/nginx/sites-enabled/
sudo nginx -t && sudo systemctl reload nginx

# 6. 配置 SSL
sudo nano deploy/setup-ssl.sh  # 修改邮箱地址
sudo bash deploy/setup-ssl.sh

# 7. 验证部署
curl https://www.zjmqy.cc
```

### 方式二：按照完整文档部署

详细阅读并执行 `deploy/阿里云部署完整方案.md` 中的所有步骤。

---

## 📖 重要文档

### 必读文档（按顺序）
1. **[PROJECT_SUMMARY.md](./PROJECT_SUMMARY.md)** - 了解项目概况
2. **[deploy/阿里云部署完整方案.md](./deploy/阿里云部署完整方案.md)** - 完整部署指南
3. **[deploy/DEPLOYMENT_CHECKLIST.md](./deploy/DEPLOYMENT_CHECKLIST.md)** - 部署检查清单

### 参考文档
4. **[deploy/README-ALIYUN.md](./deploy/README-ALIYUN.md)** - 快速参考
5. **[deploy/部署文件说明.md](./deploy/部署文件说明.md)** - 文件说明
6. **[README.md](./README.md)** - 项目说明
7. **[DEVELOPMENT.md](./DEVELOPMENT.md)** - 开发指南

---

## ⚠️ 部署前必做事项

### 1. 修改环境变量
编辑 `.env.production` 文件，修改以下内容：

```bash
# 使用强密码（至少 16 位，包含大小写字母、数字、特殊字符）
DB_PASSWORD=your_strong_db_password_here

# 使用强密码
REDIS_PASSWORD=your_strong_redis_password_here

# 使用随机字符串（可以用 openssl rand -base64 32 生成）
JWT_SECRET=your_jwt_secret_change_in_production
```

### 2. 修改 SSL 脚本
编辑 `deploy/setup-ssl.sh`，修改邮箱地址：

```bash
EMAIL="your-email@example.com"  # 改为你的实际邮箱
```

### 3. 确认域名解析
确保域名已正确解析到服务器 IP：

```bash
# 在本地执行
nslookup www.zjmqy.cc
# 应该返回 47.97.21.33
```

### 4. 确认 Git SSH 密钥
确保服务器可以访问 GitHub：

```bash
# 在服务器上执行
ssh -T git@github.com
# 应该返回成功消息
```

---

## 🔍 部署步骤概览

### 阶段一：准备（5 分钟）
- [ ] 连接到服务器
- [ ] 检查环境（Docker, Git, Nginx）
- [ ] 配置 SSH 密钥

### 阶段二：部署（15-20 分钟）
- [ ] 克隆代码
- [ ] 配置环境变量
- [ ] 构建 Docker 镜像
- [ ] 启动容器

### 阶段三：配置（10 分钟）
- [ ] 配置 Nginx
- [ ] 获取 SSL 证书
- [ ] 启用 HTTPS

### 阶段四：验证（5 分钟）
- [ ] 测试网站访问
- [ ] 检查所有功能
- [ ] 验证 SSL 证书

**总计时间：约 35-40 分钟**

---

## ✅ 部署成功标志

部署成功后，你应该能够：

1. ✅ 通过 https://www.zjmqy.cc 访问网站
2. ✅ HTTP 自动跳转到 HTTPS
3. ✅ 浏览器显示安全锁图标
4. ✅ 所有页面正常加载
5. ✅ 图片和静态资源正常显示
6. ✅ API 接口正常工作
7. ✅ 中英文切换正常
8. ✅ 移动端响应式正常

---

## 🔧 常用命令速查

### Docker 管理
```bash
cd /var/www/manqiyou

# 查看容器状态
docker-compose -f docker-compose.prod.yml ps

# 查看日志
docker-compose -f docker-compose.prod.yml logs -f

# 重启服务
docker-compose -f docker-compose.prod.yml restart

# 更新代码并重启
git pull && docker-compose -f docker-compose.prod.yml up -d --build
```

### Nginx 管理
```bash
# 测试配置
sudo nginx -t

# 重载配置
sudo systemctl reload nginx

# 查看日志
sudo tail -f /var/log/nginx/manqiyou_error.log
```

### SSL 管理
```bash
# 查看证书
sudo certbot certificates

# 手动续期
sudo certbot renew

# 查看自动续期状态
sudo systemctl status certbot.timer
```

---

## 🐛 故障排查

### 问题 1：容器无法启动
```bash
# 查看日志
docker-compose -f docker-compose.prod.yml logs

# 检查端口
sudo netstat -tulpn | grep -E ':(3000|8080|5432|6379)'
```

### 问题 2：Nginx 502 错误
```bash
# 检查后端
curl http://localhost:8080/api/health

# 查看 Nginx 日志
sudo tail -f /var/log/nginx/manqiyou_error.log
```

### 问题 3：SSL 证书问题
```bash
# 检查域名解析
nslookup www.zjmqy.cc

# 重新获取证书
sudo certbot delete --cert-name www.zjmqy.cc
sudo bash /var/www/manqiyou/deploy/setup-ssl.sh
```

---

## 📞 获取帮助

### 文档资源
- **完整部署指南**: `deploy/阿里云部署完整方案.md`
- **检查清单**: `deploy/DEPLOYMENT_CHECKLIST.md`
- **快速参考**: `deploy/README-ALIYUN.md`

### 日志位置
- **Docker 日志**: `docker-compose -f docker-compose.prod.yml logs`
- **Nginx 日志**: `/var/log/nginx/manqiyou_*.log`
- **系统日志**: `sudo journalctl -xe`

---

## 🎯 下一步计划

### 部署后立即执行
- [ ] 全面功能测试
- [ ] 性能测试
- [ ] 安全检查
- [ ] 配置监控

### 短期优化（1-2 周）
- [ ] 配置 CDN 加速
- [ ] 优化图片加载
- [ ] 配置数据库备份
- [ ] 设置监控告警

### 中期计划（1-3 个月）
- [ ] 实现在线支付
- [ ] 完善会员系统
- [ ] 开发移动端 App
- [ ] 数据分析和统计

---

## 🎉 准备就绪！

**所有部署文件已创建完成，项目已准备好部署到阿里云服务器！**

### 立即开始部署

1. 打开 `deploy/阿里云部署完整方案.md`
2. 按照文档逐步执行
3. 使用 `deploy/DEPLOYMENT_CHECKLIST.md` 检查每一步
4. 部署完成后访问 https://www.zjmqy.cc

**祝部署顺利！** 🚀

---

**文档版本**: 1.0
**创建日期**: 2025-01-29
**项目状态**: ✅ 准备部署
