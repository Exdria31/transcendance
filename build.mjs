/* Génère transcendance.html (jeu auto-contenu) depuis src/transcendance.jsx.
   Usage : npm run build */
import { build } from "esbuild";
import { writeFileSync, readFileSync, mkdirSync } from "fs";

mkdirSync(".build", { recursive: true });
await build({
  stdin: {
    contents: `
      import React from "react";
      import { createRoot } from "react-dom/client";
      import App from "./src/transcendance.jsx";
      createRoot(document.getElementById("root")).render(React.createElement(App));
    `,
    resolveDir: process.cwd(),
    loader: "jsx",
  },
  bundle: true,
  minify: true,
  format: "iife",
  loader: { ".jsx": "jsx" },
  outfile: ".build/bundle.js",
});
const bundle = readFileSync(".build/bundle.js", "utf8");
/* La version est extraite du jsx (source de vérité) et exposée dans une balise
   <meta> — c'est elle que l'exe lit pour savoir si une mise à jour existe. */
const mVer = readFileSync("src/transcendance.jsx", "utf8").match(/const VERSION = "([^"]+)"/);
const VERSION = mVer ? mVer[1] : "0.0.0";
const html = `<!doctype html>
<html lang="fr">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="version" content="${VERSION}">
<title>Transcendance</title>
<style>html,body{margin:0;padding:0;background:#0d0f1e;min-height:100vh;overflow-x:hidden;}</style>
<script>
(function(){
  if (window.storage) return;
  window.storage = {
    async get(k){ var v = localStorage.getItem("trx:" + k); return v == null ? null : { key: k, value: v }; },
    async set(k, v){ localStorage.setItem("trx:" + k, v); return { key: k, value: v }; },
    async delete(k){ localStorage.removeItem("trx:" + k); return { key: k, deleted: true }; },
    async list(){ var ks = []; for (var i = 0; i < localStorage.length; i++){ var key = localStorage.key(i); if (key.indexOf("trx:") === 0) ks.push(key.slice(4)); } return { keys: ks }; }
  };
})();
</scr` + `ipt>
</head>
<body>
<div id="root"></div>
<script>
${bundle}
</scr` + `ipt>
</body>
</html>
`;
writeFileSync("transcendance.html", html);
console.log("transcendance.html généré (" + Math.round(html.length / 1024) + " Ko)");
