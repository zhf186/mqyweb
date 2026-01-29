# Windows 安装 Git 指南

## 📥 方式一：官网下载安装（推荐）

### 步骤 1：下载 Git

1. 访问 Git 官网：https://git-scm.com/download/win
2. 页面会自动检测您的系统并开始下载
3. 或者点击 "Click here to download manually" 手动下载

**下载链接**：
- 64位系统：https://github.com/git-for-windows/git/releases/download/v2.43.0.windows.1/Git-2.43.0-64-bit.exe
- 32位系统：https://github.com/git-for-windows/git/releases/download/v2.43.0.windows.1/Git-2.43.0-32-bit.exe

### 步骤 2：安装 Git

1. **运行安装程序**
   - 双击下载的 `.exe` 文件
   - 如果出现安全提示，点击"运行"

2. **选择安装位置**
   - 默认：`C:\Program Files\Git`
   - 建议使用默认位置
   - 点击 "Next"

3. **选择组件**（推荐默认选项）
   - ✅ Windows Explorer integration（右键菜单集成）
   - ✅ Git Bash Here
   - ✅ Git GUI Here
   - ✅ Associate .git* configuration files
   - ✅ Associate .sh files to be run with Bash
   - 点击 "Next"

4. **选择开始菜单文件夹**
   - 默认：Git
   - 点击 "Next"

5. **选择默认编辑器**
   - 推荐：Use Visual Studio Code as Git's default editor
   - 或选择：Use Vim (默认)
   - 点击 "Next"

6. **调整 PATH 环境变量**（重要！）
   - 选择：**Git from the command line and also from 3rd-party software**
   - 这样可以在 PowerShell 和 CMD 中使用 Git
   - 点击 "Next"

7. **选择 SSH 可执行文件**
   - 选择：Use bundled OpenSSH
   - 点击 "Next"

8. **选择 HTTPS 传输后端**
   - 选择：Use the OpenSSL library
   - 点击 "Next"

9. **配置行尾转换**
   - 选择：**Checkout Windows-style, commit Unix-style line endings**
   - 点击 "Next"

10. **配置终端模拟器**
    - 选择：Use MinTTY (默认)
    - 点击 "Next"

11. **配置 git pull 行为**
    - 选择：Default (fast-forward or merge)
    - 点击 "Next"

12. **选择凭据助手**
    - 选择：Git Credential Manager
    - 点击 "Next"

13. **配置额外选项**
    - ✅ Enable file system caching
    - ✅ Enable symbolic links
    - 点击 "Next"

14. **实验性功能**
    - 不勾选（保持默认）
    - 点击 "Install"

15. **等待安装完成**
    - 安装需要 1-2 分钟
    - 完成后点击 "Finish"

### 步骤 3：验证安装

打开 PowerShell 或 CMD，输入：

```powershell
git --version
```

应该显示类似：
```
git version 2.43.0.windows.1
```

---

## 📥 方式二：使用 Winget 安装（Windows 11）

如果您使用 Windows 11，可以使用 Winget：

```powershell
# 打开 PowerShell（管理员）
winget install --id Git.Git -e --source winget
```

---

## 📥 方式三：使用 Chocolatey 安装

如果您已安装 Chocolatey：

```powershell
# 打开 PowerShell（管理员）
choco install git -y
```

---

## ⚙️ 配置 Git

安装完成后，需要配置用户信息：

```powershell
# 配置用户名
git config --global user.name "Your Name"

# 配置邮箱
git config --global user.email "your.email@example.com"

# 查看配置
git config --list
```

**示例**：
```powershell
git config --global user.name "zhf186"
git config --global user.email "your-email@example.com"
```

---

## 🔑 配置 SSH 密钥（用于 GitHub）

### 步骤 1：生成 SSH 密钥

```powershell
# 打开 PowerShell 或 Git Bash
ssh-keygen -t ed25519 -C "your-email@example.com"

# 按 Enter 使用默认路径
# 按 Enter 跳过密码（或设置密码）
```

### 步骤 2：查看公钥

```powershell
# 查看公钥内容
cat ~/.ssh/id_ed25519.pub

# 或使用记事本打开
notepad ~/.ssh/id_ed25519.pub
```

### 步骤 3：添加到 GitHub

1. 复制公钥内容
2. 访问：https://github.com/settings/keys
3. 点击 "New SSH key"
4. Title: "Windows 本地电脑"
5. Key: 粘贴公钥内容
6. 点击 "Add SSH key"

### 步骤 4：测试连接

```powershell
ssh -T git@github.com
```

应该显示：
```
Hi zhf186! You've successfully authenticated, but GitHub does not provide shell access.
```

---

## 📝 使用 Git 提交代码

安装并配置完成后，您可以提交代码：

```powershell
# 进入项目目录
cd D:\mrcweb1

# 查看状态
git status

# 添加所有文件
git add .

# 提交
git commit -m "配置生产环境强密码并准备部署"

# 推送到 GitHub
git push origin main
```

---

## 🎯 快速安装命令（复制粘贴）

### 如果使用 Winget（Windows 11）

```powershell
# 1. 安装 Git
winget install --id Git.Git -e --source winget

# 2. 重启 PowerShell

# 3. 验证安装
git --version

# 4. 配置用户信息
git config --global user.name "zhf186"
git config --global user.email "your-email@example.com"

# 5. 生成 SSH 密钥
ssh-keygen -t ed25519 -C "your-email@example.com"

# 6. 查看公钥（添加到 GitHub）
cat ~/.ssh/id_ed25519.pub

# 7. 测试 GitHub 连接
ssh -T git@github.com
```

---

## ❓ 常见问题

### Q1: 安装后 PowerShell 找不到 git 命令

**解决方法**：
1. 关闭并重新打开 PowerShell
2. 或重启电脑
3. 检查环境变量是否包含 Git 路径

### Q2: git push 需要输入密码

**解决方法**：
- 使用 SSH 方式而不是 HTTPS
- 仓库地址应该是：`git@github.com:zhf186/mqyweb.git`
- 不是：`https://github.com/zhf186/mqyweb.git`

### Q3: SSH 连接失败

**解决方法**：
```powershell
# 检查 SSH 密钥是否存在
ls ~/.ssh/

# 重新生成密钥
ssh-keygen -t ed25519 -C "your-email@example.com"

# 确保公钥已添加到 GitHub
```

---

## 🚀 安装完成后的下一步

1. ✅ 验证 Git 安装：`git --version`
2. ✅ 配置用户信息
3. ✅ 生成并配置 SSH 密钥
4. ✅ 测试 GitHub 连接
5. ✅ 提交代码到 GitHub
6. ✅ 继续部署流程

---

## 📖 相关文档

- Git 官方文档：https://git-scm.com/doc
- GitHub SSH 配置：https://docs.github.com/en/authentication/connecting-to-github-with-ssh
- Git 基础教程：https://git-scm.com/book/zh/v2

---

**安装指南版本**: 1.0
**适用系统**: Windows 10/11
**最后更新**: 2025-01-29
