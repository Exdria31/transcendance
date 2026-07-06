const { contextBridge, ipcRenderer } = require("electron");
contextBridge.exposeInMainWorld("majJeu", () => ipcRenderer.invoke("maj-jeu"));
