import { app, BrowserWindow } from "electron";
import { join } from "path";
import { fileURLToPath } from "url";

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

  if (process.env.NODE_ENV === "development") {
    win.loadURL("http://localhost:5173");
    win.webContents.openDevTools();
  } else {
    win.loadFile(join(__dirname, "dist", "index.html"));

    // disable devtools
    win.webContents.on("devtools-opened", () => {
      win.webContents.closeDevTools();
    });

    // prevent any new window from opening
    win.webContents.setWindowOpenHandler(() => {
      return { action: "deny" };
    });
  }
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
