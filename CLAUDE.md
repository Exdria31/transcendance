# Transcendance — instructions pour Claude Code

## Projet
Jeu idle roguelite en un seul fichier React : `src/transcendance.jsx` (~1900 lignes, en français).
Die & retry avec jauges méta, 3 zones × 10 niveaux, bestiaire, stances, équipement, monnaie c/a/o/p.

## Règles
- TOUT le jeu vit dans `src/transcendance.jsx`. Ne pas le découper sans demande explicite.
- Code et UI en français (tutoiement dans les textes du jeu).
- Après CHAQUE modification de `src/transcendance.jsx`, lancer `npm run build`
  (régénère `transcendance.html` que le jeu charge). Le joueur recharge avec F5.
- Compat sauvegardes : ne jamais renommer les ids existants (jauges, monstres,
  slots, stances) ; toute migration se fait dans `depuisSave`.
- Sprites : grilles de chaînes (1 char = 1 pixel), toutes les rangées d'une
  grille doivent avoir la même longueur, chaque char doit exister dans la palette `p`.

## Commandes
- `npm run build`  → régénère transcendance.html (à faire après chaque modif)
- `npm start`      → build + fenêtre Electron de test
- `npm run dist`   → build + exe portable Windows dans dist/

## Vérifications avant de conclure une modif
1. `npx esbuild src/transcendance.jsx --loader:.jsx=jsx --outfile=/dev/null` (syntaxe)
2. `npm run build` sans erreur
3. Si le moteur a changé : vérifier qu'une partie neuve ET une vieille
   sauvegarde (via l'export/import des Réglages) se chargent sans crash.
