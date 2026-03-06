# 阿里云部署文档索引

## 📚 文档列表

### 主要文档
1. **[阿里云部署完整方案.md](./阿里云部署完整方案.md)** - 完整的分步部署指南（推荐阅读）
2. **[DEPLOYMENT.md](../DEPLOYMENT.md)** - 通用部署文档

### 配置文件
1. **[docker-compose.prod.yml](../docker-compose.prod.yml)** - Docker Compose 生产环境配置
2. **[.env.production](../.env.production)** - 环境变量模板
3. **[nginx-manqiyou.conf](./nginx-manqiyou.conf)** - Nginx 配置文件

### Dockerfile
1. **[backend/Dockerfile](../backend/manqiyou-app/Dockerfile)** - 后端 Docker 镜像
2. **[frontend/Dockerfile](../frontend/Dockerfile)** - 前端 Docker 镜像

### 部署脚本
1. **[quick-deploy.sh](./quick-deploy.sh)** - 一键部署脚本
2. **[setup-ssl.sh](./setup-ssl.sh)** - SSL 证书配置脚本
3. **[deploy-to-aliyun.sh](./deploy-to-aliyun.sh)** - 完整部署脚本

---

## 🚀 快速开始

### 方式一：使用一键部署脚本（推荐）

```bash
# 1. 连接到服务器
ssh root@47.97.21.33

# 2. 下载部署脚本
curl -O https://raw.githubusercontent.com/zhf186/mqyweb/main/deploy/quick-deploy.sh

# 3. 运行部署脚本
bash quick-deploy.sh

# 4. 按照提示完成后续配置
```

### 方式二：手动部署

按照 [阿里云部署完整方案.md](./阿里云部署完整方案.md) 文档逐步执行。

---

## 📋 部署信息

### 服务器信息
- **IP 地址**: 47.97.21.33
- **域名**: www.zjmqy.cc
- **操作系统**: Ubuntu 24.04
- **Web 服务器**: Nginx

### 项目信息
- **Git 仓库**: git@github.com:zhf186/mqyweb.git
- **项目目录**: /var/www/manqiyou
- **前端端口**: 3000 (Docker 内部)
- **后端端口**: 8080 (Docker 内部)
- **数据库端口**: 5432 (Docker 内部)
- **Redis 端口**: 6379 (Docker 内部)

### 容器列表
- `manqiyou-frontend` - Next.js 前端应用
- `manqiyou-backend` - Spring Boot 后端应用
- `manqiyou-postgres` - PostgreSQL 数据库
- `manqiyou-redis` - Redis 缓存

---

## 🔧 常用命令

### Docker 容器管理

```bash
# 进入项目目录
cd /var/www/manqiyou

# 查看容器状态
docker-compose -f docker-compose.prod.yml ps

# 查看日志
docker-compose -f docker-compose.prod.yml logs -f

# 重启所有服务
docker-compose -f docker-compose.prod.yml restart

# 重启特定服务
docker-compose -f docker-compose.prod.yml restart frontend
docker-compose -f docker-compose.prod.yml restart backend

# 停止所有服务
docker-compose -f docker-compose.prod.yml stop

# 启动所有服务
docker-compose -f docker-compose.prod.yml start

# 重新构建并启动
docker-compose -f docker-compose.prod.yml up -d --build
```

### Nginx 管理

```bash
# 测试配置
sudo nginx -t

# 重载配置
sudo systemctl reload nginx

# 重启 Nginx
sudo systemctl restart nginx

# 查看状态
sudo systemctl status nginx

# 查看日志
sudo tail -f /var/log/nginx/manqiyou_access.log
sudo tail -f /var/log/nginx/manqiyou_error.log
```

### SSL 证书管理

```bash
# 查看证书信息
sudo certbot certificates

# 手动续期
sudo certbot renew

# 测试续期
sudo certbot renew --dry-run

# 查看自动续期状态
sudo systemctl status certbot.timer
```

### 代码更新

```bash
# 拉取最新代码
cd /var/www/manqiyou
git pull origin main

# 重新构建并启动
docker-compose -f docker-compose.prod.yml up -d --build

# 查看更新日志
docker-compose -f docker-compose.prod.yml logs -f
```

### 数据库管理

```bash
# 进入数据库容器
docker exec -it manqiyou-postgres psql -U manqiyou_user -d manqiyou

# 备份数据库
docker exec manqiyou-postgres pg_dump -U manqiyou_user manqiyou > backup_$(date +%Y%m%d).sql

# 恢复数据库
docker exec -i manqiyou-postgres psql -U manqiyou_user manqiyou < backup_YYYYMMDD.sql
```

---

## 🐛 故障排查

### 容器无法启动

```bash
# 查看详细日志
docker-compose -f docker-compose.prod.yml logs

# 检查端口占用
sudo netstat -tulpn | grep -E ':(3000|8080|5432|6379)'

# 重启 Docker
sudo systemctl restart docker
```

### Nginx 502 错误

```bash
# 检查后端是否运行
curl http://localhost:8080/api/health

# 查看 Nginx 错误日志
sudo tail -f /var/log/nginx/manqiyou_error.log

# 检查容器状态
docker-compose -f docker-compose.prod.yml ps
```

### SSL 证书问题

```bash
# 检查证书状态
sudo certbot certificates

# 重新获取证书
sudo certbot delete --cert-name www.zjmqy.cc
sudo bash /var/www/manqiyou/deploy/setup-ssl.sh
```

---

## 📞 获取帮助

### 查看日志

```bash
# Docker 容器日志
docker-compose -f docker-compose.prod.yml logs -f

# Nginx 日志
sudo tail -f /var/log/nginx/manqiyou_error.log

# 系统日志
sudo journalctl -xe
```

### 系统监控

```bash
# 查看容器资源使用
docker stats

# 查看系统资源
htop

# 查看磁盘使用
df -h

# 查看内存使用
free -h
```

---

## ✅ 部署检查清单

### 部署前
- [ ] 服务器已准备好（Ubuntu 24.04）
- [ ] Docker 和 Docker Compose 已安装
- [ ] Git 已安装并配置 SSH 密钥
- [ ] 域名 DNS 已解析到服务器 IP
- [ ] 防火墙已配置（开放 80, 443 端口）

### 部署中
- [ ] 代码已克隆到 /var/www/manqiyou
- [ ] 环境变量已配置（.env 文件）
- [ ] Docker 容器已构建并运行
- [ ] Nginx 配置已创建并启用
- [ ] SSL 证书已获取
- [ ] HTTPS 已启用并测试

### 部署后
- [ ] 网站可通过 HTTPS 访问
- [ ] 所有页面正常加载
- [ ] API 接口正常工作
- [ ] 图片和静态资源正常显示
- [ ] SSL 自动续期已配置
- [ ] 日志轮转已配置
- [ ] 数据库备份已配置

---

## 📖 相关文档

- [项目 README](../README.md)
- [开发文档](../DEVELOPMENT.md)
- [通用部署文档](../DEPLOYMENT.md)
- [项目规格说明](../漫骑游官方网站开发全案说明书.md)

---

**最后更新**: 2025-01-29
**文档版本**: 1.0
