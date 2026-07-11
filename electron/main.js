const path = require("node:path");
const { app, BrowserWindow, Menu, shell } = require("electron");

const UPDATE_URL = process.env.AI_BUTLER_UPDATE_URL || "";

function createWindow() {
  const win = new BrowserWindow({
    width: 1360,
    height: 860,
    minWidth: 860,
    minHeight: 580,
    title: "AI人际管家",
    backgroundColor: "#f7f4ec",
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true
    }
  });

  win.loadFile(path.join(__dirname, "..", "index.html"));

  win.webContents.setWindowOpenHandler(({ url }) => {
    if (/^https?:\/\//i.test(url)) shell.openExternal(url);
    return { action: "deny" };
  });

  configureMenu(win);
  configureAutoUpdate(win);
  return win;
}

function configureMenu(win) {
  const template = [
    {
      label: "文件",
      submenu: [
        { label: "重新加载", accelerator: "CmdOrCtrl+R", click: () => win.reload() },
        { label: "退出", role: "quit" }
      ]
    },
    {
      label: "视图",
      submenu: [
        { label: "放大", role: "zoomIn" },
        { label: "缩小", role: "zoomOut" },
        { label: "重置缩放", role: "resetZoom" },
        { type: "separator" },
        { label: "全屏", role: "togglefullscreen" }
      ]
    }
  ];
  Menu.setApplicationMenu(Menu.buildFromTemplate(template));
}

function configureAutoUpdate(win) {
  if (!app.isPackaged || !UPDATE_URL) return;

  try {
    const { autoUpdater } = require("electron-updater");
    autoUpdater.setFeedURL({ provider: "generic", url: UPDATE_URL });
    autoUpdater.autoDownload = true;
    autoUpdater.on("update-available", () => sendUpdateStatus(win, "发现新版本，正在下载。"));
    autoUpdater.on("update-downloaded", () => sendUpdateStatus(win, "新版本已下载，重启软件后生效。"));
    autoUpdater.on("error", () => sendUpdateStatus(win, "自动更新暂时不可用。"));
    autoUpdater.checkForUpdatesAndNotify();
  } catch {
    sendUpdateStatus(win, "自动更新模块未启用。");
  }
}

function sendUpdateStatus(win, message) {
  win.webContents.send("desktop:update-status", message);
}

app.setAppUserModelId("com.ai.relationship.butler");

app.whenReady().then(() => {
  createWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});
