const { app, BrowserWindow, Menu, ipcMain } = require("electron");
const path = require("path");
const fs = require("fs");

const UPDATE_URL = "https://exdria31.github.io/transcendance/transcendance.html";

const htmlTelecharge = () => path.join(app.getPath("userData"), "transcendance.html");

/* Priorité : fichier posé à côté de l'exe (dev / manuel) > dernière version
   téléchargée par le bouton > version embarquée à la compilation. */
function trouverHtml() {
  const candidats = [];
  if (process.env.PORTABLE_EXECUTABLE_DIR) candidats.push(path.join(process.env.PORTABLE_EXECUTABLE_DIR, "transcendance.html"));
  candidats.push(path.join(path.dirname(app.getPath("exe")), "transcendance.html"));
  if (!app.isPackaged) candidats.push(path.join(__dirname, "transcendance.html"));
  candidats.push(htmlTelecharge());
  for (const p of candidats) { try { if (fs.existsSync(p)) return p; } catch (e) {} }
  return path.join(__dirname, "transcendance.html");
}

let win = null;
function chargerJeu() { win.loadFile(trouverHtml()); }

function creerFenetre() {
  win = new BrowserWindow({
    width: 1180, height: 860, minWidth: 900, minHeight: 640,
    backgroundColor: "#0d0f1e", autoHideMenuBar: true, title: "Transcendance",
    webPreferences: { preload: path.join(__dirname, "preload.js") },
  });
  Menu.setApplicationMenu(null);
  chargerJeu();
  win.webContents.on("before-input-event", (ev, input) => {
    if (input.type === "keyDown" && (input.key === "F5" || (input.control && input.key.toLowerCase() === "r"))) {
      chargerJeu(); ev.preventDefault();
    }
  });
}

/* Vérification silencieuse au lancement : renvoie la version disponible en ligne
   (lue dans la balise <meta name="version"> de la page hébergée). */
ipcMain.handle("verif-maj", async () => {
  if (!UPDATE_URL) return { ok: false, msg: "Pas d'URL de mise à jour configurée" };
  try {
    const rep = await fetch(UPDATE_URL + "?t=" + Date.now());
    if (!rep.ok) return { ok: false, msg: "Serveur : " + rep.status };
    const m = (await rep.text()).match(/<meta name="version" content="([^"]+)"/);
    if (!m) return { ok: false, msg: "Version distante introuvable" };
    return { ok: true, version: m[1] };
  } catch (e) { return { ok: false, msg: "Réseau : " + e.message }; }
});

/* Bouton "Mettre à jour le jeu" (⚙ Réglages) : télécharge la dernière version. */
ipcMain.handle("maj-jeu", async () => {
  if (!UPDATE_URL) return { ok: false, msg: "Pas d'URL de mise à jour configurée (voir main.js)" };
  try {
    const rep = await fetch(UPDATE_URL + (UPDATE_URL.includes("?") ? "&" : "?") + "t=" + Date.now());
    if (!rep.ok) return { ok: false, msg: "Serveur : " + rep.status };
    const html = await rep.text();
    if (!html.includes("Transcendance") || html.length < 10000) return { ok: false, msg: "Fichier téléchargé invalide" };
    fs.writeFileSync(htmlTelecharge(), html);
    chargerJeu();
    return { ok: true };
  } catch (e) { return { ok: false, msg: "Réseau : " + e.message }; }
});

app.whenReady().then(() => {
  creerFenetre();
  app.on("activate", () => { if (BrowserWindow.getAllWindows().length === 0) creerFenetre(); });
});
app.on("window-all-closed", () => { if (process.platform !== "darwin") app.quit(); });
