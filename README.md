# Transcendance

## Mise en route (une fois)
1. Node.js LTS : https://nodejs.org
2. `npm install`
3. `npm start` → le jeu s'ouvre.

## Développer avec Claude Code (workflow recommandé)
Ouvre Claude Code dans ce dossier et demande tes modifs. Il édite
`src/transcendance.jsx`, lance `npm run build`, et toi tu fais F5 dans le
jeu. Aucun fichier à déplacer, jamais.

## Fabriquer l'exe (optionnel)
`npm run dist` → `dist/Transcendance 0.3.0.exe` (portable). L'exe charge en
priorité le `transcendance.html` posé à côté de lui, sinon la dernière version
téléchargée par le bouton de mise à jour, sinon sa version embarquée.

## Bouton "Mettre à jour le jeu" (⚙ Réglages, visible dans l'exe)
1. Crée un repo GitHub, active GitHub Pages, pousse `transcendance.html`.
2. Mets l'URL dans `UPDATE_URL` en haut de `main.js`, recompile une fois.
3. Ensuite : publier une version = pousser le html (Claude Code peut le faire
   avec un simple `git add transcendance.html && git commit && git push`).
   Le bouton télécharge et recharge le jeu tout seul.

## Sauvegardes
Profil Electron (`%APPDATA%\transcendance`) ou localStorage du navigateur.
Export/import texte intégré : ⚙ Réglages → SAUVEGARDE.
