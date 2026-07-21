# AI人际管家桌面版

桌面版是当前真实使用版本。Electron 加载同一套前端文件，但后续开发、验证、打包和分发都以软件版为准。

## 运行

```powershell
npm.cmd install
npm.cmd run validate
npm.cmd run desktop
```

## 打包

```powershell
npm.cmd run validate
npm.cmd run dist:win
```

打包前必须更新版本号。当前版本号分布在：

- `package.json`
- `package-lock.json`
- `app.js` 的 `appVersion()`

## 用户数据

安装包不会读取或打包本机真实使用数据。API Key、人物库、关系网、聊天记录和本地配置保存在用户数据目录，通常是：

```text
%APPDATA%\AI人际管家
```

安装新版本不会覆盖这些本地缓存。卸载配置也设置为不主动删除用户数据目录。

## 更新策略

当前阶段使用新安装包更新。以后上线服务器后，可以配置自动更新：

```powershell
$env:AI_BUTLER_UPDATE_URL="https://你的域名/updates/"
npm.cmd run dist:win
```

服务器需要提供 `latest.yml`、安装包和 blockmap。自动更新只替换程序文件，不应覆盖用户本地数据。

## release 清理规则

- 保留最新版本完整安装包、blockmap、`latest.yml` 和 unpacked 目录。
- 历史版本只保留 `.exe` 安装包。
- 不保留多个旧 unpacked 目录和旧 blockmap。

## 上线服务器前提醒

正式上线前需要设计：账号登录、云端同步、后端模型代理、限流、加密备份、自动更新源、隐私政策、聊天软件辅助窗口和移动端能力。
