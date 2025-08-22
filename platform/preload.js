const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electronAPI", {
  onTerminalData: (callback) =>
    ipcRenderer.on("terminal:data", (_, data) => callback(data)),
  writeToTerminal: (input) => ipcRenderer.send("terminal:write", input),
});
