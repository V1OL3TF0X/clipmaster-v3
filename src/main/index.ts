import { join } from "node:path";
import {
  app,
  BrowserWindow,
  clipboard,
  ipcMain,
  globalShortcut,
  Notification,
} from "electron";

const createWindow = () => {
  const mainWindow = new BrowserWindow({
    width: 400,
    height: 600,
    minWidth: 300,
    minHeight: 400,
    maxHeight: 800,
    maxWidth: 450,
    maximizable: false,
    titleBarStyle: "hidden",
    titleBarOverlay: true,
    webPreferences: {
      preload: join(__dirname, "preload.js"),
    },
  });

  if (MAIN_WINDOW_VITE_DEV_SERVER_URL) {
    mainWindow.loadURL(MAIN_WINDOW_VITE_DEV_SERVER_URL);
  } else {
    mainWindow.loadFile(
      join(__dirname, `../renderer/${MAIN_WINDOW_VITE_NAME}/index.html`),
    );
  }

  mainWindow.webContents.openDevTools({ mode: "detach" });

  return mainWindow;
};

app.on("ready", () => {
  const window = createWindow();
  globalShortcut.register("CommandOrControl+Shift+Alt+C", () => {
    app.focus();
    window.show();
    window.focus();
  });

  globalShortcut.register("CommandOrControl+Shift+Alt+V", () => {
    const content = clipboard.readText().toUpperCase();
    clipboard.writeText(content);
    new Notification({
      title: "Capitilized clipboard",
      subtitle: "Copied to clipboard",
      body: content,
    }).show();
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

app.on("quit", () => {
  globalShortcut.unregisterAll();
});

ipcMain.on("write-to-clipboard", (_, content: string) => {
  console.log(content);
  clipboard.writeText(content);
});

ipcMain.handle("read-from-clipboard", (_) => {
  return clipboard.readText();
});
