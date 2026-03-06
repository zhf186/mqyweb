# SSL 证书配置指南 - DNS 验证方式

## 问题说明

由于 Nginx 配置中包含 HTTPS 配置，但 SSL 证书还不存在，导致 Certbot 的 webroot 验证方式失败。

**解决方案**：使用 DNS 验证方式获取 SSL 证书。

---

## 🚀 快速配置步骤

### 步骤 1：在服务器上运行 Certbot（DNS 验证）

```bash
# 连接到服务器
ssh root@47.97.21.33

# 使用 DNS 验证方式获取证书
sudo certbot certonly --manual --preferred-challenges dns \
  -d www.zjmqy.cc \
  -d zjmqy.cc \
  --email 56742186@qq.com \
  --agree-tos
```

### 步骤 2：添加 DNS TXT 记录

Certbot 会显示类似以下信息：

```
Please deploy a DNS TXT record under the name:
_acme-challenge.www.zjmqy.cc

with the following value:
xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

Before continuing, verify the TXT record has been deployed. Depending on the DNS
provider, this may take some time, from a few seconds to multiple minutes. You can
check if it has finished deploying with aid of online tools, such as the Google
Admin Toolbox: https://toolbox.googleapps.com/apps/dig/#TXT/_acme-challenge.www.zjmqy.cc
```

**重要**：不要按 Enter，先完成 DNS 配置！

### 步骤 3：在阿里云添加 DNS 记录

1. **登录阿里云控制台**
   - 访问：https://dns.console.aliyun.com/

2. **进入域名解析**
   - 找到域名：zjmqy.cc
   - 点击"解析设置"

3. **添加第一条 TXT 记录（www 子域名）**
   - 记录类型：TXT
   - 主机记录：`_acme-challenge.www`
   - 记录值：粘贴 Certbot 显示的第一个值
   - TTL：600（10分钟）
   - 点击"确认"

4. **继续 Certbot 流程**
   - Certbot 会要求为第二个域名添加 TXT 记录
   - 显示类似信息：
     ```
     Please deploy a DNS TXT record under the name:
     _acme-challenge.zjmqy.cc
     
     with the following value:
     yyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyy
     ```

5. **添加第二条 TXT 记录（根域名）**
   - 记录类型：TXT
   - 主机记录：`_acme-challenge`
   - 记录值：粘贴 Certbot 显示的第二个值
   - TTL：600（10分钟）
   - 点击"确认"

### 步骤 4：验证 DNS 记录生效

**等待 1-5 分钟**，然后验证：

```bash
# 验证第一条记录（www）
dig _acme-challenge.www.zjmqy.cc TXT +short

# 验证第二条记录（根域名）
dig _acme-challenge.zjmqy.cc TXT +short

# 应该看到刚才添加的 TXT 记录值
```

**或者使用在线工具**：
- https://toolbox.googleapps.com/apps/dig/#TXT/_acme-challenge.www.zjmqy.cc
- https://toolbox.googleapps.com/apps/dig/#TXT/_acme-challenge.zjmqy.cc

### 步骤 5：继续 Certbot 验证

确认 DNS 记录生效后，在 Certbot 终端按 **Enter** 继续。

Certbot 会验证 DNS 记录并获取证书。

### 步骤 6：验证证书获取成功

```bash
# 查看证书
sudo certbot certificates

# 应该看到类似输出：
# Certificate Name: www.zjmqy.cc
#   Domains: www.zjmqy.cc zjmqy.cc
#   Expiry Date: 2026-04-29 (VALID: 89 days)
#   Certificate Path: /etc/letsencrypt/live/www.zjmqy.cc/fullchain.pem
#   Private Key Path: /etc/letsencrypt/live/www.zjmqy.cc/privkey.pem
```

### 步骤 7：启用完整的 HTTPS Nginx 配置

```bash
# 复制完整配置（包含 HTTPS）
sudo cp /opt/mqyweb/deploy/nginx-manqiyou.conf /etc/nginx/sites-available/manqiyou

# 测试配置
sudo nginx -t

# 应该显示：
# nginx: the configuration file /etc/nginx/nginx.conf syntax is ok
# nginx: configuration file /etc/nginx/nginx.conf test is successful

# 重载 Nginx
sudo systemctl reload nginx
```

### 步骤 8：配置自动续期

```bash
# 创建续期钩子脚本
sudo mkdir -p /etc/letsencrypt/renewal-hooks/deploy

sudo tee /etc/letsencrypt/renewal-hooks/deploy/reload-nginx.sh > /dev/null << 'EOF'
#!/bin/bash
systemctl reload nginx
EOF

sudo chmod +x /etc/letsencrypt/renewal-hooks/deploy/reload-nginx.sh

# 测试自动续期（不会真正续期）
sudo certbot renew --dry-run

# 启用 certbot timer
sudo systemctl enable certbot.timer
sudo systemctl start certbot.timer

# 查看 timer 状态
sudo systemctl status certbot.timer
```

### 步骤 9：验证 HTTPS 访问

```bash
# 测试 HTTPS 访问
curl -I https://www.zjmqy.cc

# 应该看到：
# HTTP/2 200
# server: nginx
# ...
```

**在浏览器中访问**：
- https://www.zjmqy.cc
- 应该看到安全锁图标 🔒

---

## 🎉 完成！

SSL 证书配置成功！您的网站现在可以通过 HTTPS 安全访问。

---

## 📋 DNS 记录配置示例

配置完成后，您的 DNS 记录应该包含：

| 记录类型 | 主机记录 | 记录值 | TTL |
|---------|---------|--------|-----|
| A | www | 47.97.21.33 | 600 |
| A | @ | 47.97.21.33 | 600 |
| TXT | _acme-challenge.www | (Certbot 提供的值) | 600 |
| TXT | _acme-challenge | (Certbot 提供的值) | 600 |

**注意**：TXT 记录在证书获取成功后可以删除，但保留它们不会有任何影响。

---

## 🔧 故障排查

### 问题 1：DNS 记录未生效

```bash
# 检查 DNS 记录
dig _acme-challenge.www.zjmqy.cc TXT +short

# 如果没有返回值，等待几分钟后重试
# 阿里云 DNS 通常在 1-5 分钟内生效
```

### 问题 2：Certbot 验证失败

```bash
# 查看详细日志
sudo tail -f /var/log/letsencrypt/letsencrypt.log

# 重新运行 Certbot
sudo certbot certonly --manual --preferred-challenges dns \
  -d www.zjmqy.cc \
  -d zjmqy.cc \
  --email 56742186@qq.com \
  --agree-tos
```

### 问题 3：Nginx 配置测试失败

```bash
# 查看详细错误
sudo nginx -t

# 检查证书文件是否存在
ls -la /etc/letsencrypt/live/www.zjmqy.cc/

# 应该看到：
# fullchain.pem
# privkey.pem
# chain.pem
# cert.pem
```

### 问题 4：HTTPS 访问失败

```bash
# 检查 Nginx 状态
sudo systemctl status nginx

# 查看 Nginx 错误日志
sudo tail -f /var/log/nginx/manqiyou_error.log

# 检查防火墙
sudo ufw status
# 确保 443 端口开放
```

---

## 📖 参考资料

- **Certbot 官方文档**：https://certbot.eff.org/
- **Let's Encrypt 文档**：https://letsencrypt.org/docs/
- **阿里云 DNS 文档**：https://help.aliyun.com/product/29697.html

---

## 🔄 证书续期

Let's Encrypt 证书有效期为 90 天，但已配置自动续期：

```bash
# 查看续期计划
sudo systemctl list-timers | grep certbot

# 手动测试续期
sudo certbot renew --dry-run

# 手动强制续期（如果需要）
sudo certbot renew --force-renewal
```

自动续期会在证书到期前 30 天自动运行，无需手动操作。

---

**版本**: 1.0  
**最后更新**: 2025-01-29  
**预计时间**: 10-15 分钟
