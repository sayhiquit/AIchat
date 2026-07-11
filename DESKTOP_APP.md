# AI 人际管家桌面版

桌面版使用 Electron 1:1 加载现有网页版文件，网页版本继续保留。

## 本地运行

```powershell
npm.cmd install
npm.cmd run desktop
```

## 打包 Windows 安装包

```powershell
npm.cmd run dist:win
```

安装包会输出到 `release/` 目录。

## 用户数据不会被打包

源码里只包含默认模板和页面代码。真实使用时配置的 API Key、人物、人际网、聊天记录都在用户本机的应用数据目录里：

```text
%APPDATA%\AI人际管家
```

打包安装包时不会读取浏览器里的 localStorage，也不会把你自己真实使用时新增的人物和 key 打包给别人。

## 更新策略

当前阶段可以通过新安装包覆盖更新。`electron-builder` 的 NSIS 配置不会在更新时删除用户数据，卸载时也不会自动删除应用数据目录。

以后上线服务器后，可以启用自动更新：

```powershell
$env:AI_BUTLER_UPDATE_URL="https://你的域名/updates/"
npm.cmd run dist:win
```

服务器需要放置 `latest.yml` 和安装包文件。自动更新只替换程序文件，不覆盖用户本地缓存。

## 后期提醒

上线服务器时需要重新评估这些能力：

- 账号登录和云同步
- 端到端加密或至少服务端密文存储
- DeepSeek / OpenAI 兼容模型后端代理
- 桌面端自动更新通道
- 聊天软件实时识别与悬浮窗助手
- 手机端实时监控、声纹记录和事后分析
