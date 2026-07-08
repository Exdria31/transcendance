# Transcendance — instructions pour Claude Code

> EN DÉBUT DE SESSION : lire `ROADMAP.md` (état du projet, décisions actées,
> idées écartées, backlog). Le tenir à jour après chaque étape majeure.

## Projet
Jeu idle roguelite en un seul fichier React : `src/transcendance.jsx` (~3500 lignes, en français).
Die & retry avec jauges méta, 15 zones × 10 niveaux (mur brutal dès la zone 5, scaling
centralisé dans `zScale`), bestiaire, stances, équipement (affinage/tiers/raretés),
Transcendance (reset de zone) et Renaissance (reset global → Éclats d'Origine, Arbre
d'Origine 5 branches ×30 nodes, Échos, Serments, Zones altérées). Monnaies : pièces
(cuivre→diamant), ferraille, essence résiduelle, tokens, éclats d'origine.
Tests headless : export `__test` en fin de jsx — bundler un entry Node avec esbuild
(cjs) et appeler les fonctions du moteur directement.

## Règles
- TOUT le jeu vit dans `src/transcendance.jsx`. Ne pas le découper sans demande explicite.
- Code et UI en français (tutoiement dans les textes du jeu).
- Après CHAQUE modification de `src/transcendance.jsx`, lancer `npm run build`
  (régénère `transcendance.html` que le jeu charge). Le joueur recharge avec F5.
- Compat sauvegardes : ne jamais renommer les ids existants (jauges, monstres,
  slots, stances) ; toute migration se fait dans `depuisSave`.
- Sprites : grilles de chaînes (1 char = 1 pixel), toutes les rangées d'une
  grille doivent avoir la même longueur, chaque char doit exister dans la palette `p`.

## Versions & mises à jour
- Source de vérité : `const VERSION` dans `src/transcendance.jsx` ; garder
  `"version"` de package.json synchronisé.
- Convention : 0.X.0 = nouveautés de gameplay, 0.X.Y = corrections.
- À chaque version : ajouter une entrée EN TÊTE de `CHANGELOG` (dans le jsx) —
  la popup « Nouveautés » s'affiche automatiquement chez les joueurs dont
  `meta.versionVue` est antérieure.
- Release : commit + tag `vX.Y.Z` + `git push origin master --tags`. GitHub Pages
  (repo Exdria31/transcendance, branche master) sert `transcendance.html` ; le bouton
  « Mettre à jour le jeu » de l'exe télécharge cette page (UPDATE_URL dans main.js)
  puis recharge — la popup Nouveautés fait le reste. Un push de transcendance.html
  suffit donc à mettre à jour tous les joueurs ; ne re-publier un exe
  (`npm run dist` + `gh release create vX.Y.Z "dist\Transcendance X.Y.Z.exe"`)
  que si la coquille (main.js/preload.js) change. gh est dans
  `C:\Program Files\GitHub CLI\gh.exe` (pas toujours dans le PATH).
- Ne pas retirer `"overrides": { "yauzl": ... }` de package.json : il contourne
  une régression Node 24.16+ qui casse silencieusement l'install d'Electron.

## Commandes
- `npm run build`  → régénère transcendance.html (à faire après chaque modif)
- `npm start`      → build + fenêtre Electron de test
- `npm run dist`   → build + exe portable Windows dans dist/

## Vérifications avant de conclure une modif
1. `npx esbuild src/transcendance.jsx --loader:.jsx=jsx --outfile=/dev/null` (syntaxe)
2. `npm run build` sans erreur
3. Si le moteur a changé : vérifier qu'une partie neuve ET une vieille
   sauvegarde (via l'export/import des Réglages) se chargent sans crash.
