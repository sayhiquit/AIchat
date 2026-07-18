const path = require("node:path");
const { app, BrowserWindow, Menu, shell } = require("electron");

const UPDATE_URL = process.env.AI_BUTLER_UPDATE_URL || "";
const APP_TITLE = "\u0041\u0049\u4eba\u9645\u7ba1\u5bb6";

function createWindow() {
  const win = new BrowserWindow({
    width: 1360,
    height: 860,
    minWidth: 860,
    minHeight: 580,
    title: APP_TITLE,
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
      label: "\u6587\u4ef6",
      submenu: [
        { label: "\u91cd\u65b0\u52a0\u8f7d", accelerator: "CmdOrCtrl+R", click: () => win.reload() },
        { label: "\u9000\u51fa", role: "quit" }
      ]
    },
    {
      label: "\u89c6\u56fe",
      submenu: [
        { label: "\u653e\u5927", role: "zoomIn" },
        { label: "\u7f29\u5c0f", role: "zoomOut" },
        { label: "\u91cd\u7f6e\u7f29\u653e", role: "resetZoom" },
        { type: "separator" },
        { label: "\u5168\u5c4f", role: "togglefullscreen" }
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
    autoUpdater.on("update-available", () => sendUpdateStatus(win, "\u53d1\u73b0\u65b0\u7248\u672c\uff0c\u6b63\u5728\u4e0b\u8f7d\u3002"));
    autoUpdater.on("update-downloaded", () => sendUpdateStatus(win, "\u65b0\u7248\u672c\u5df2\u4e0b\u8f7d\uff0c\u91cd\u542f\u8f6f\u4ef6\u540e\u751f\u6548\u3002"));
    autoUpdater.on("error", () => sendUpdateStatus(win, "\u81ea\u52a8\u66f4\u65b0\u6682\u65f6\u4e0d\u53ef\u7528\u3002"));
    autoUpdater.checkForUpdatesAndNotify();
  } catch {
    sendUpdateStatus(win, "\u81ea\u52a8\u66f4\u65b0\u6a21\u5757\u672a\u542f\u7528\u3002");
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
