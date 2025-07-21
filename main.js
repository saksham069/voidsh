import { app, BrowserWindow } from "electron";
import { join } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = join(__filename, "..");

function createWindow() {
  const win = new BrowserWindow({
    width: 800,
    height: 500,
    webPreferences: {
      preload: join(__dirname, "preload.js"),
    },
    icon: join(__dirname, "icon.png"),
    title: "voidsh",
  });

  if (process.env.NODE_ENV === "development") {
    win.loadURL("http://localhost:5173");
  } else {
    win.loadFile(join(__dirname, "dist", "index.html"));
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
