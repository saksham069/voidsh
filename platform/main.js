import { app, BrowserWindow, ipcMain } from "electron";
import { join } from "path";
import { fileURLToPath } from "url";
import { createPtyProcess } from "../core/terminal-pty.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = join(__filename, "..");

function createWindow() {
  const win = new BrowserWindow({
    width: 800,
    height: 500,
    minWidth: 400,
    minHeight: 250,
    frame: true,
    webPreferences: {
      preload: join(__dirname, "preload.js"),
      contextIsolation: true,
      nodeIntegration: false,
    },
    icon: join(__dirname, "icon.png"),
    title: "voidsh",
  });

  // hide menu bar
  win.setMenuBarVisibility(false);

  if (process.env.NODE_ENV === "dev") {
    win.loadURL("http://localhost:5173");
    win.webContents.openDevTools();
  } else {
    win.loadFile(join(__dirname, "../ui/src", "index.html"));
  }

  // init pty process
  const ptyProcess = createPtyProcess();

  // send pty output to renderer
  ptyProcess.onData((data) => {
    win.webContents.send("terminal:data", data);
  });

  // receive input from renderer and send to pty
  ipcMain.on("terminal:write", (_, input) => {
    ptyProcess.write(input);
  });
}

app.whenReady().then(() => {
  createWindow();
  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});
