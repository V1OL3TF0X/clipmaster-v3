import { contextBridge, ipcRenderer } from "electron";

const api = {
  writeToClipboard(content: string) {
    ipcRenderer.send("write-to-clipboard", content);
  },
  readFromClipboard(): Promise<string> {
    return ipcRenderer.invoke("read-from-clipboard");
  },
} as const;

export type Api = typeof api;

contextBridge.exposeInMainWorld("api", api);
