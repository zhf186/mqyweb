# 部署脚本说明

本目录包含漫骑游项目在阿里云 Ubuntu 24.04 服务器上的自动化部署脚本。

## 📁 文件说明

| 文件 | 说明 | 使用场景 |
|------|------|----------|
| `QUICK-START.md` | 快速部署指南 | 首次部署，5分钟快速上手 |
| `setup-server.sh` | 服务器环境配置脚本 | 首次部署，安装所有依赖 |
| `deploy.sh` | 自动部署脚本 | 首次部署或完整重新部署 |
| `update.sh` | 快速更新脚本 | 日常代码更新 |
| `ssl-setup.sh` | SSL 证书配置脚本 | 配置 HTTPS |
| `upload-to-server.ps1` | Windows 上传脚本 | 从本地上传代码到服务器 |

## 🚀 快速开始

### 首次部署（推荐流程）

1. **配置服务器环境**
   ```bash
   bash deploy/setup-server.sh
   ```

2. **部署项目**
   ```bash
   bash deploy/deploy.sh
   ```

3. **配置 SSL**
   ```bash
   bash deploy/ssl-setup.sh
   ```

### 日常更新

```bash
bash deploy/update.sh
```

## 📋 脚本详细说明

### setup-server.sh - 环境配置

**功能：**
- 更新系统
- 安装 Node.js 20.x
- 安装 Java 17
- 安装 PM2
- 安装 Nginx
- 安装 Certbot
- 配置防火墙

**使用：**
```bash
bash deploy/setup-server.sh
```

**注意：**
- 需要 sudo 权限
- 首次部署必须运行
- 可以重复运行（会跳过已安装的软件）

---

### deploy.sh - 自动部署

**功能：**
- 配置前端环境变量
- 构建前端（npm build）
- 构建后端（Maven package）
- 配置 PM2 管理前端
- 配置 systemd 管理后端
- 配置 Nginx 反向代理

**使用：**
```bash
bash deploy/deploy.sh
```

**交互提示：**
- 会要求输入域名（例如：manqiyou.com）

**前提条件：**
- 已运行 `setup-server.sh`
- 项目代码已上传到 `/var/www/manqiyou`

---

### update.sh - 快速更新

**功能：**
- 拉取最新代码（git pull）
- 更新前端依赖
- 构建前端
- 构建后端
- 重启所有服务

**使用：**
```bash
bash deploy/update.sh
```

**适用场景：**
- 代码更新后快速部署
- 修复 bug 后重新部署
- 功能迭代

**注意：**
- 需要项目使用 Git 管理
- 会自动重启服务（有短暂停机）

---

### ssl-setup.sh - SSL 配置

**功能：**
- 使用 Let's Encrypt 获取免费 SSL 证书
- 自动配置 Nginx HTTPS
- 设置证书自动续期

**使用：**
```bash
bash deploy/ssl-setup.sh
```

**交互提示：**
- 域名（例如：manqiyou.com）
- 邮箱（用于证书到期提醒）

**前提条件：**
- 域名已解析到服务器 IP
- Nginx 已配置并运行
- 防火墙允许 80 和 443 端口

---

### upload-to-server.ps1 - Windows 上传

**功能：**
- 从 Windows 本地上传代码到服务器
- 支持 rsync（快速）或 SCP（兼容）
- 自动排除不需要的文件

**使用：**
```powershell
# 基本用法
.\deploy\upload-to-server.ps1 -ServerIP "1.2.3.4" -Username "ubuntu"

# 指定目标路径
.\deploy\upload-to-server.ps1 -ServerIP "1.2.3.4" -Username "ubuntu" -TargetPath "/var/www/manqiyou"
```

**参数说明：**
- `ServerIP`: 服务器 IP 地址（必填）
- `Username`: SSH 用户名（必填）
- `TargetPath`: 目标路径（可选，默认 /var/www/manqiyou）

**自动排除：**
- node_modules
- target
- .git
- .next
- *.log
- .env.local

---

## 🔧 常用命令

### 查看服务状态

```bash
# 前端
pm2 status
pm2 logs manqiyou-frontend

# 后端
sudo systemctl status manqiyou-backend
sudo journalctl -u manqiyou-backend -f

# Nginx
sudo systemctl status nginx
sudo tail -f /var/log/nginx/manqiyou_error.log
```

### 重启服务

```bash
# 前端
pm2 restart manqiyou-frontend

# 后端
sudo systemctl restart manqiyou-backend

# Nginx
sudo systemctl reload nginx
```

### 停止服务

```bash
# 前端
pm2 stop manqiyou-frontend

# 后端
sudo systemctl stop manqiyou-backend

# Nginx
sudo systemctl stop nginx
```

---

## 🐛 故障排查

### 脚本执行失败

1. **权限问题**
   ```bash
   chmod +x deploy/*.sh
   ```

2. **行尾符问题（Windows 编辑后）**
   ```bash
   sudo apt install dos2unix
   dos2unix deploy/*.sh
   ```

3. **查看详细错误**
   ```bash
   bash -x deploy/deploy.sh
   ```

### 服务启动失败

1. **检查端口占用**
   ```bash
   sudo netstat -tulpn | grep -E ':(3000|8080)'
   ```

2. **查看详细日志**
   ```bash
   pm2 logs manqiyou-frontend --lines 100
   sudo journalctl -u manqiyou-backend -n 100
   ```

3. **手动测试**
   ```bash
   # 前端
   cd /var/www/manqiyou/frontend
   npm run start

   # 后端
   cd /var/www/manqiyou/backend/manqiyou-app
   java -jar target/manqiyou-app-0.0.1-SNAPSHOT.jar
   ```

---

## 📚 更多文档

- [QUICK-START.md](QUICK-START.md) - 快速部署指南
- [../DEPLOYMENT.md](../DEPLOYMENT.md) - 完整部署文档
- [../README.md](../README.md) - 项目说明

---

## 💡 最佳实践

1. **首次部署**
   - 按顺序运行：setup-server.sh → deploy.sh → ssl-setup.sh
   - 确保每一步都成功后再进行下一步

2. **日常更新**
   - 使用 `update.sh` 快速更新
   - 重要更新前先备份数据库

3. **安全建议**
   - 定期更新系统：`sudo apt update && sudo apt upgrade`
   - 使用强密码
   - 配置 fail2ban 防止暴力破解
   - 定期备份数据

4. **监控**
   - 定期检查服务状态
   - 查看日志文件
   - 监控服务器资源使用

---

**祝部署顺利！** 🚀
