import { contextBridge } from "electron";
import { electronAPI } from "@electron-toolkit/preload";
import { isMac, isWindows, isLinux } from "./platform";
import { vaultAPI } from "../features/vault/preload";

// Custom APIs for renderer
const api = {
  vault: vaultAPI,
};

const environment = {
  isMac,
  isWindows,
  isLinux,
};

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld("electron", electronAPI);
    contextBridge.exposeInMainWorld("api", api);
    contextBridge.exposeInMainWorld("environment", environment);
  } catch (error) {
    console.error(error);
  }
} else {
  // @ts-ignore (define in dts)
  window.electron = electronAPI;
  // @ts-ignore (define in dts)
  window.api = api;
  // @ts-ignore (define in dts)
  window.environment = environment;
}
