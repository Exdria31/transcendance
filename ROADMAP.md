# Transcendance — État du projet, décisions & backlog

> Document de continuité pour Claude Code : à relire en début de session pour retrouver
> le contexte complet. Mis à jour à chaque étape majeure. L'historique factuel détaillé
> est dans `git log` et dans le `CHANGELOG` du jsx (popup Nouveautés).

## Vision & statut
- Jeu **idle roguelite** solo dev (Exdria31, non-développeur — tout lui expliquer pas à pas).
- Statut : **ALPHA** (v0.9.3). Passage en **Bêta** quand la boucle de gameplay complète
  sera jugée satisfaisante, puis passe d'optimisation vers la **Release**.
- Les joueurs (l'auteur + des amis) reçoivent chaque version via GitHub Pages
  (popup de mise à jour automatique dans l'exe).

## Systèmes en place (v0.9.x)
- 15 zones × 10 niveaux, mur brutal dès la zone 5 (`zScale`, `BAL.ren`).
- Bestiaire (paliers/maîtrise), Stances (7), jauges méta (7), boutique de run.
- Équipement : 11 slots, 8 raretés (cap 1 Divin porté), affinage 0-10 × Tiers I-III
  (ferraille ⚒ / essence résiduelle ✦), verrouillage, ensembles, priorités d'auto-équipement,
  recyclage auto paramétrable.
- Transcendance (reset de zone → armes de Transcendance, 15 définies).
- **Renaissance** (reset global) → Éclats d'Origine ❖ → Arbre d'Origine (5 branches × 30 nodes),
  Échos (7 types, choix post-Renaissance, slots), Serments (8), Zones altérées (zones 1-5).
- UI : design system CSS en couches, layout 100vh verrouillé sans scroll de page,
  échelle auto par résolution + réglage Graphismes, rail droite contextuelle + objectifs proches,
  toasts/tiroir notifications, journal 3 modes, historique des mises à jour in-game.

## Décisions actées (et pourquoi)
- **Sets d'équipement façon Diablo : REPORTÉS** (demande explicite, plusieurs fois). Ne pas les faire sans demande.
- Repo **public** pour l'instant ; bascule possible plus tard en « 2 repos » (source privé + HTML public). L'utilisateur veut le faire « quand le dev sera bien avancé ».
- **itch.io** : prévu plus tard, il faudra le guider pas à pas.
- Push/publication **à chaque version** (l'utilisateur teste en direct) — sauf grosses passes
  nocturnes : commits par jalons locaux, publication seulement après la batterie de tests.
- Convention versions : 0.X.0 = nouveautés, 0.X.Y = corrections/UI. Version stable de référence déclarée : 0.8.5 (puis 0.9.x).
- Sprites des zones 4-15 = recolorations des zones 1-3 (assumé, passe d'art dédiée plus tard).
- Écho « survie à un coup fatal » remplacé par de la réduction de dégâts (plus sûr).
- L'arme de Transcendance équipée est **dérivée** (recalculée), jamais stockée comme item libre.
- Les items d'ensembles sont auto-verrouillés (🔗) ; délier = seul moyen de déverrouiller.

## Backlog / reporté (par ordre de probabilité)
- Équilibrage fin de tout le pan Origine (coûts nodes, formule Éclats, odds Échos, mur zone 5).
- Arbre d'Origine en **vrai graphe dessiné** (connecteurs courbes, layout non-colonnes) — demandé
  plusieurs fois, amélioré en 0.9.2/0.9.3 (focus branche), mais pas encore « Path of Exile ».
- Zones altérées 6-15 (structure prête dans `ALTERATIONS`).
- Sprites dédiés zones 4-15 + polish pixel-art.
- Système futur au cap zone 10 et au cap zone 15 (« caps symboliques » posés en 0.9.0).
- Mécanique de déplafonnement du nombre d'équipements Divin portés.
- Sets d'équipement Diablo (quand l'utilisateur le décidera).
- Répartition stricte Journal (combat pur) vs Notifications (système) — évoqué, jamais tranché.
- Persistance des préférences UI (logMode, tiroir…) — actuellement état de session.

## Comment travailler sur ce projet (rappels opérationnels)
- Lire `CLAUDE.md` (règles dures : un seul fichier jsx, français, build après chaque modif,
  compat saves via `depuisSave`, verrou 100vh, pas de guillemets doubles dans les messages
  de commit PowerShell).
- Tests headless : export `__test` en fin de jsx ; entry de test conservé dans le scratchpad
  de session (recréable : bundler un entry qui importe `__test` en cjs). 53 assertions en 0.9.x.
- Vérif publication : GET Pages + regex `<meta name="version">` jusqu'à propagation.
- L'exe n'est re-publié que si `main.js`/`preload.js` changent (release GitHub `gh release create`).
- Les grosses specs nocturnes de l'utilisateur sont rédigées par ChatGPT : les traiter par
  jalons avec TaskCreate, poser les questions AVANT s'il est réveillé, sinon trancher et documenter.

## Historique des versions (résumé — détail dans git log / CHANGELOG jsx)
- 0.3.0 socle (3 zones) → 0.4.x versions/maj auto → 0.5.x UI plein écran + polices (Cinzel/Jost)
  → 0.6.0 échelle par résolution → 0.7.x forge (ferraille/affinage/tiers/essence/8 raretés/lock)
  → 0.8.x refonte équipement (Dofus, ensembles, priorités, pièces cuivre→diamant, historique maj)
  → 0.9.0 L'Origine (15 zones, Renaissance, Éclats, Arbre, Échos, Serments, Altérées)
  → 0.9.1/0.9.2/0.9.3 passes UI/UX (design system, échelle, rail contextuelle, game feel).
