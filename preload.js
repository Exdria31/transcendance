const { contextBridge, ipcRenderer } = require("electron");
contextBridge.exposeInMainWorld("majJeu", () => ipcRenderer.invoke("maj-jeu"));
contextBridge.exposeInMainWorld("verifMaj", () => ipcRenderer.invoke("verif-maj"));
