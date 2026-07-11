const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("desktopBridge", {
  onUpdateStatus(callback) {
    if (typeof callback !== "function") return;
    ipcRenderer.on("desktop:update-status", (_event, message) => callback(message));
  }
});
