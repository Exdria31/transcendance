import React, { useState, useEffect, useRef } from "react";

/* ============================================================
   TRANSCENDANCE — prototype v1 (Zone Forêt)
   Idle roguelite : die & retry, jauges méta actées en fin de run,
   bestiaire-scaling, stances, équipement persistant.
   ============================================================ */

/* ---------- version & nouveautés ----------
   VERSION est la source de vérité (garder package.json synchronisé).
   Convention : 0.X.0 = nouveautés de gameplay, 0.X.Y = corrections.
   À chaque version : ajouter une entrée EN TÊTE de CHANGELOG — la popup
   « Nouveautés » s'affiche automatiquement chez les joueurs concernés. */
const VERSION = "0.9.0";
const CHANGELOG = [
  { v: "0.9.0", date: "8 juillet 2026", titre: "L'Origine — le monde s'agrandit", points: [
    "Le continent passe à 15 zones : Montagne, Plaines Orageuses, Glacier, Volcan, Marais Putride, Ruines Anciennes, Citadelle Astrale, Jungle Primordiale, Abysses, Désert de Verre, Ciel Fragmenté et le Cœur du Monde — chacune avec ses 11 créatures, son Gardien et son arme de Transcendance.",
    "Attention : à partir de la zone 5, le monde devient brutal. C'est voulu.",
    "☀ La Renaissance : le nouveau reset global, au-dessus de la Transcendance. Dès la zone 4, l'onglet Origine apparaît ; dès la zone 5, tu peux dissoudre ton cycle entier contre des ❖ Éclats d'Origine, permanents.",
    "🌳 L'Arbre d'Origine : 5 branches (Corps, Âme, Mémoire, Héritage, Destin), 150 nodes de bonus permanents à acheter avec tes Éclats.",
    "🌀 Les Échos : des reliques permanentes à choisir après chaque Renaissance — 7 types, 8 raretés, slots limités. La branche Destin améliore leurs raretés, niveaux et choix.",
    "🕯 Les Serments : 8 défis optionnels qui durcissent le cycle contre plus d'Éclats et de meilleurs Échos (débloqués via Destin).",
    "🌗 Les Zones altérées : des variantes plus dangereuses et plus rentables des zones 1 à 5 (après ta première Renaissance).",
    "Tes anciennes sauvegardes fonctionnent telles quelles. L'équilibrage s'affinera dans les prochaines versions.",
  ] },
  { v: "0.8.5", date: "7 juillet 2026", titre: "Pièces sonnantes & historique", points: [
    "La bourse affiche de vraies pièces colorées : Cuivre, Argent, Or, Platine, Émeraude, Rubis, Saphir, Diamant — chacune vaut 100 fois la précédente.",
    "Historique des mises à jour consultable dans Paramètres : tout le changelog depuis le début du jeu.",
    "Les stances rejoignent la fenêtre Commandes ; le Journal de combat retrouve de la hauteur.",
  ] },
  { v: "0.8.4", date: "7 juillet 2026", titre: "Fenêtres alignées", points: [
    "Dans l'onglet Équipement, toutes les fenêtres prennent la hauteur de la plus grande, et leur conteneur s'y ajuste exactement.",
  ] },
  { v: "0.8.3", date: "7 juillet 2026", titre: "Cadres ajustés & stance affichée", points: [
    "Les cadres de l'onglet Équipement épousent leur contenu — fini les grandes zones vides en bas.",
    "La stance active et son niveau s'affichent sous le personnage, dans un cadre central élargi.",
  ] },
  { v: "0.8.2", date: "7 juillet 2026", titre: "Boutons du vestiaire lisibles", points: [
    "Les quatre boutons de l'onglet Équipement affichent leur nom complet : Ensemble Équipement, Priorités Équipement, Recyclage Automatique, Arme Transcendance.",
    "Le personnage et ses compartiments remontent juste sous le titre, et l'inventaire cède la largeur nécessaire aux boutons.",
  ] },
  { v: "0.8.1", date: "7 juillet 2026", titre: "Le vestiaire prend ses aises", points: [
    "L'onglet Équipement est réagencé en trois panneaux : détails de la pièce sélectionnée à gauche, personnage au centre, inventaire à droite — plus d'espace perdu.",
    "Quatre boutons à droite ouvrent leurs fenêtres dédiées : Ensembles (E E), Priorités (PE), Recyclage auto (RA) et Armes de Transcendance (AT).",
    "Les statistiques de combat sont catégorisées : Offensives, Défensives, Bonus, Divers — avec deux nouvelles lignes (dégâts boss, remplissage des jauges).",
    "Les stances ne s'affichent plus dans l'onglet Équipement.",
  ] },
  { v: "0.8.0", date: "7 juillet 2026", titre: "Le grand vestiaire", points: [
    "L'onglet Équipement occupe désormais toute la largeur : journal, commandes et notifications s'effacent pour te laisser gérer ton stuff (les stats de combat restent à droite).",
    "Nouveau visuel d'équipement en compartiments autour de ton héros — survole pour les détails, clique pour affiner, clic droit pour verrouiller.",
    "Vrai inventaire à cases : chaque objet dans sa case colorée par rareté, badges de tier et de verrou, survol pour les stats.",
    "Tri automatique (rareté puis tier puis niveau) et filtres par type d'équipement (armes, anneaux, boucles…).",
    "Ensembles d'équipement : sauvegarde ta panoplie actuelle, rééquipe-la en un clic, renomme-la, range-la dans des groupes. Les pièces liées à un ensemble sont automatiquement 🔗 verrouillées.",
    "« Équiper le meilleur » configurable : construis ton ordre de priorité (Or → Attaque → PV…), et sauvegarde-le en profils réutilisables.",
  ] },
  { v: "0.7.1", date: "7 juillet 2026", titre: "Finitions de forge", points: [
    "L'essence résiduelle brille désormais en rouge rubis, et son nom complet s'affiche dans le bandeau.",
    "Les ressources du bandeau sont encadrées d'un liseré doré — chaque monnaie a son écrin.",
    "Clic droit sur un objet (inventaire ou équipé) pour le 🔒 verrouiller/déverrouiller instantanément.",
  ] },
  { v: "0.7.0", date: "7 juillet 2026", titre: "La forge : affinage, tiers et nouvelles raretés", points: [
    "La vente d'équipement ne rapporte plus d'or mais des ⚒ morceaux de ferraille, la nouvelle monnaie de forge.",
    "Affinage : chaque objet peut être affiné 10 fois à la ferraille (+5% de stats par niveau), puis évoluer en Tier II et III — jusqu'à ×2,5 les stats de base.",
    "✦ Essence résiduelle : lâchée par le Gardien de chaque zone (niveau 10/10), une seule fois par run et par zone — il faut relancer pour en récolter à nouveau. Elle paie les évolutions de Tier.",
    "4 nouvelles raretés : Magique, Héroïque, Mythique et Divin. Un seul équipement Divin peut être porté… pour l'instant.",
    "Verrouillage 🔒 : un objet verrouillé ne peut plus être vendu, ni à l'unité ni par les ventes de masse.",
    "Clique sur un objet équipé pour l'affiner directement. Prochaine étape : la grande refonte visuelle de l'équipement (inventaire à cases, ensembles, priorités).",
  ] },
  { v: "0.6.0", date: "7 juillet 2026", titre: "Le jeu s'adapte à ton écran", points: [
    "Mise à l'échelle automatique : le jeu détecte la taille de ta fenêtre et s'ajuste — plus de barres de défilement sur les petits écrans.",
    "Nouvelle section Graphismes dans les Paramètres : si l'automatique ne te convient pas, force l'échelle à 100 %, 90 %, 80 % ou 70 %, comme dans n'importe quel jeu.",
  ] },
  { v: "0.5.9", date: "7 juillet 2026", titre: "Notifications élargies", points: [
    "La fenêtre Notifications affiche maintenant 5 lignes.",
    "Le reste de l'interface s'est légèrement resserré pour compenser — toujours zéro défilement, ni sur la page ni sur les jauges.",
  ] },
  { v: "0.5.8", date: "7 juillet 2026", titre: "Notifications à leur taille", points: [
    "La fenêtre Notifications colle enfin à son contenu : la liste remplit toute la boîte, sans grand vide en dessous.",
    "L'espace récupéré remonte aux jauges méta : les 7 jauges tiennent sans défilement.",
  ] },
  { v: "0.5.7", date: "7 juillet 2026", titre: "Le scroll est mort, pour de bon", points: [
    "La page est désormais verrouillée à la taille de l'écran : il est structurellement impossible qu'elle défile.",
    "Si un onglet a vraiment trop de contenu (gros inventaire…), c'est sa fenêtre intérieure qui défile discrètement, comme dans tout jeu.",
    "En-tête compacté et barres légèrement affinées pour que la Boutique tienne sans défiler du tout.",
  ] },
  { v: "0.5.6", date: "7 juillet 2026", titre: "Contours, cadrage & meilleur équipement", points: [
    "Tous les textes ont maintenant un contour noir de 1px, façon jeu vidéo — lisibles sur n'importe quel fond.",
    "La scène de combat est recadrée : héros et monstres tiennent entièrement dans le cadre.",
    "Interface resserrée : tout tient à l'écran sans défilement.",
    "Nouveau bouton « ⚡ Équiper le meilleur » (onglet Équipement) : calcule la valeur de chaque objet et équipe automatiquement la meilleure combinaison, slots jumeaux compris.",
  ] },
  { v: "0.5.5", date: "7 juillet 2026", titre: "Une police qui se lit, enfin", points: [
    "Les textes et les chiffres passent sur une police nette et moderne (Jost) — la précédente était élégante mais illisible sur fond sombre. Les titres gardent leur style FF13.",
    "Les chiffres sur les barres ont maintenant un contour sombre : lisibles quel que soit le remplissage.",
  ] },
  { v: "0.5.4", date: "7 juillet 2026", titre: "Jauges XXL", points: [
    "Les jauges méta sont deux fois plus hautes, les chiffres dessus enfin lisibles, et la fenêtre est bien remplie.",
    "Toutes les écritures passent en blanc et en gras — terminé le texte fantôme pénible à lire.",
  ] },
  { v: "0.5.3", date: "6 juillet 2026", titre: "Alignements au cordeau", points: [
    "Journal de combat et Commandes intervertis : les 4 boutons en colonne à côté des stats, le journal en pleine largeur en dessous — et son bas s'aligne avec la fenêtre de gauche.",
    "Plus de trou à droite : les fenêtres se partagent toute la largeur de l'écran.",
    "Notifications compactées : tout tient à l'écran, sans défilement.",
    "Tokens : chiffre et libellé agrandis, icône alignée.",
  ] },
  { v: "0.5.2", date: "6 juillet 2026", titre: "Fenêtre de notifications & finitions", points: [
    "Les notifications ne flottent plus au milieu de l'écran : elles ont leur fenêtre dédiée en bas, sur toute la largeur, avec historique.",
    "Statistiques de combat et Journal de combat : même hauteur, plus larges ; la fenêtre Commandes s'étend sous les deux.",
    "Textes en blanc pur — le contraste ne pique plus les yeux.",
    "Le compteur de tokens en attente (+x) est enfin lisible.",
  ] },
  { v: "0.5.1", date: "6 juillet 2026", titre: "Lisibilité & agencement peaufinés", points: [
    "Textes nettement plus grands et plus contrastés — fini de plisser les yeux.",
    "Plus aucun débordement : le jeu tient dans l'écran, sans barre de défilement.",
    "Les onglets s'étendent sur toute la largeur ; statistiques et journal passent juste en dessous.",
    "Nouvelle fenêtre Commandes en bas à droite : AFK, ZONE, RESET RUN et Paramètres.",
    "Barre du haut réorganisée : tokens de boss à gauche, zone au centre, or à droite — en plus gros.",
  ] },
  { v: "0.5.0", date: "6 juillet 2026", titre: "Grand écran & armes de Transcendance", points: [
    "Le jeu occupe enfin tout l'écran : statistiques de combat et journal de combat ont leurs propres fenêtres, à droite.",
    "Nouvelle direction artistique des textes — polices élégantes façon FF13.",
    "Vente d'équipement par rareté (un bouton par rareté, avec compteur).",
    "Recyclage automatique du butin, paramétrable par rareté, par type et par niveau — fini le tri à la main.",
    "Anneaux et boucles d'oreille : tu choisis maintenant dans quel emplacement les équiper. Les armes secondaires s'appellent des Lames, et chaque objet affiche son type.",
    "Les Armes de Transcendance ne se ramassent plus : elles se forgent en transcendant une zone. Forêt = or, Désert = attaque, Océan = PV. Uniques, indestructibles, elles se renforcent à chaque transcendance — la meilleure s'équipe toute seule, et tu peux choisir la tienne.",
  ] },
  { v: "0.4.1", date: "6 juillet 2026", titre: "La mise à jour vient à toi", points: [
    "Au lancement, l'application vérifie toute seule si une nouvelle version existe et te propose de l'installer — tu peux toujours refuser et le faire plus tard.",
  ] },
  { v: "0.4.0", date: "6 juillet 2026", titre: "Le jeu apprend à se mettre à jour", points: [
    "Le jeu a maintenant un numéro de version, visible dans les Réglages.",
    "Cette fenêtre de nouveautés s'affiche après chaque mise à jour — tu ne rateras plus rien.",
    "Dans l'application de bureau, le bouton « Mettre à jour le jeu » (Réglages) récupère la dernière version en ligne.",
  ] },
  { v: "0.3.0", date: "juin 2026", titre: "La base du monde", points: [
    "3 zones × 10 niveaux : Forêt, Désert, Océan, chacune gardée par son Gardien.",
    "Bestiaire, stances, équipement persistant et jauges de transcendance.",
  ] },
];
function cmpVer(a, b) {
  const pa = String(a || "0").split("."), pb = String(b || "0").split(".");
  for (let i = 0; i < 3; i++) { const d = (parseInt(pa[i], 10) || 0) - (parseInt(pb[i], 10) || 0); if (d) return d; }
  return 0;
}

const BAL = {
  hero: { atk: 10, hp: 100, as: 1.0, critC: 5, critD: 150 },
  mob:  { hp: 30, hpG: 1.36, atk: 3.2, atkG: 1.27, gold: 7, goldG: 1.31, as: 0.8 },
  boss: { hp: 5.0, atk: 1.5, gold: 8,  as: 0.62 },
  zbos: { hp: 10,  atk: 1.7, gold: 20, as: 0.55 },
  shop: { atkC: 12, atkCG: 1.18, atkV: 5, hpC: 15, hpCG: 1.20, hpV: 5, heal: 0.3 },
  drop: { normal: 0.05, mini: 0.45, zone: 1.0, tw_mini: 0.10, tw_zone: 0.35 },
  defK: 150, spawn: 0.7, healKill: 0.02, bestDmg: 3, bestRes: 3, bestGold: 2, transReq: 2.5,
  /* Scaling de continent centralisé : à partir de la zone murZone+1 (index murZone),
     chaque zone multiplie brutalement les ennemis. Seule source de vérité. */
  ren: { murZone: 3, multHp: 8, multAtk: 6.5, multGold: 4.5 },
};
/* Multiplicateur de zone (index 0-based). Neutre jusqu'à l'index murZone-1. */
function zScale(zi) {
  const n = Math.max(0, zi - BAL.ren.murZone);
  return { hp: Math.pow(BAL.ren.multHp, n), atk: Math.pow(BAL.ren.multAtk, n), gold: Math.pow(BAL.ren.multGold, n) };
}

/* ---------- utils ---------- */
const R = Math.random;
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const SUF = ["", "k", "M", "B", "T", "q", "Q"];
function fmt(n) {
  if (!isFinite(n)) return "∞";
  if (n < 0) return "-" + fmt(-n);
  if (n < 1000) return n < 10 && n % 1 !== 0 ? n.toFixed(1).replace(".", ",") : String(Math.floor(n));
  let i = 0;
  while (n >= 1000 && i < SUF.length - 1) { n /= 1000; i++; }
  return (n >= 100 ? Math.floor(n) : n.toFixed(1).replace(".", ",")) + " " + SUF[i];
}
/* Pi\u00e8ces : chaque type vaut 100 fois le pr\u00e9c\u00e9dent. */
const PIECES = [
  { id: "cuivre",   nom: "Cuivre",   u: "c", col: "#b87333" },
  { id: "argent",   nom: "Argent",   u: "a", col: "#cdd3dd" },
  { id: "or",       nom: "Or",       u: "o", col: "#ffd45e" },
  { id: "platine",  nom: "Platine",  u: "p", col: "#9fe3dc" },
  { id: "emeraude", nom: "\u00c9meraude", u: "e", col: "#3ecf6e" },
  { id: "rubis",    nom: "Rubis",    u: "r", col: "#ff3b5c" },
  { id: "saphir",   nom: "Saphir",   u: "s", col: "#4a7dff" },
  { id: "diamant",  nom: "Diamant",  u: "d", col: "#d8ecff" },
];
const MON_SUP = ["", "", "\u00b2", "\u00b3", "\u2074", "\u2075", "\u2076", "\u2077", "\u2078", "\u2079"];
function fmtM(v) {
  v = Math.floor(Math.max(0, v));
  if (v < 100) return v + "c";
  let mag = 0, x = v;
  while (x >= 100) { x = Math.floor(x / 100); mag++; }
  const unit = (m) => PIECES[m % 8].u + (m >= 8 ? MON_SUP[Math.floor(m / 8) + 1] : "");
  const p = Math.pow(100, mag);
  const top = Math.floor(v / p);
  const rem = Math.floor((v % p) / (p / 100));
  return top + unit(mag) + (rem > 0 ? " " + rem + unit(mag - 1) : "");
}
const pct = (v) => (v > 0 ? "+" : "") + (Math.round(v * 10) / 10).toString().replace(".", ",") + "%";
let UID = 1; const uid = () => UID++;
/* Mélange une couleur hex vers une autre (k = 0..1). Sert aux sprites recolorés des zones 4-15. */
function teinte(hex, vers, k) {
  const a = parseInt(hex.slice(1), 16), b = parseInt(vers.slice(1), 16);
  const mx = (x, y) => Math.round(x + (y - x) * k);
  const r = mx((a >> 16) & 255, (b >> 16) & 255), g = mx((a >> 8) & 255, (b >> 8) & 255), bl = mx(a & 255, b & 255);
  return "#" + ((1 << 24) + (r << 16) + (g << 8) + bl).toString(16).slice(1);
}

/* ---------- sprites (pixel art 16×16, dessinés main) ---------- */
const P = {
  k: "#241b2f", w: "#f6f2ff", W: "#d9d2ef",
  g1: "#8be05f", g2: "#5cb84a", g3: "#3d8a3a", g4: "#2a6330",
  r1: "#ff6b6b", r2: "#d94a5a", cr: "#ffe9c9",
  b1: "#6ad4ff", b2: "#3d9be0",
  y1: "#ffd45e", y2: "#e0a63d", y3: "#a8762a",
  p1: "#c59bff", p2: "#9a6ae0", p3: "#6b46a8",
  n1: "#c9a06a", n2: "#9a7448", n3: "#6e4f2f", n4: "#4a3420",
  s1: "#b9c2d9", s2: "#8a93b3", s3: "#5d6485",
  o1: "#ff9d5c", x1: "#79589e",
};
const SPR = {
  hero: { p: { k: P.k, o: "#ff9a4a", f: "#ffe4c9", e: "#3fa4ff", w: "#eef2fa", s: "#9aa3b8", S: "#667090", g: P.y1 }, g: [
    "......kkkkkkkk......",
    "....kkooooooookk....",
    "...koooooooooook....",
    "..kooooooooooooook..",
    "..kooooooooooooook..",
    "..kooffffffffffook..",
    "..koofeeffffeefook..",
    "..koofeeffffeefook..",
    ".wkooffffkkffffook..",
    ".wkoooffffffffoook..",
    ".wkoook......koook..",
    ".w......kffk........",
    ".w..kssssssssssk....",
    ".wk.kssgssssgssk....",
    ".gkkssssssssssk.....",
    "....kssssssssk......",
    "....ksskkkkssk......",
    "....kssk..kssk......",
    "....kSSk..kSSk......",
    "....kkkk..kkkk......"
  ]},
  slime: { p: { k: P.k, a: P.g1, b: P.g2, c: P.g3, m: P.g4, w: P.w, e: P.k }, g: [
    "................",
    "................",
    "................",
    "......kkkk......",
    "....kkaaaakk....",
    "...kaaaaaaaak...",
    "..kaawaaaawaak..",
    "..kaaaaaaaaaak..",
    ".kaaekaaaakeaak.",
    ".kaaaaammaaaaak.",
    ".kbaamaaaamaabk.",
    ".kbbaaaaaaaabbk.",
    ".kcbbaammaabbck.",
    "..kccbbbbbbcck..",
    "...kkkkkkkkkk...",
    "................"
  ]},
  champi: { p: { k: P.k, r: P.r1, R: P.r2, w: P.w, f: P.cr, e: P.k }, g: [
    "................",
    "......kkkk......",
    "....kkrrrrkk....",
    "...krrwwrrrrk...",
    "..krrwwrrrwwrk..",
    ".krrrrrrrrwwrrk.",
    ".krwwrrrrrrrrrk.",
    ".kRRRRRRRRRRRRk.",
    "..kkkkkkkkkkkk..",
    "...kffffffffk...",
    "...kfekffekfk...",
    "...kffkkkkffk...",
    "...kffffffffk...",
    "....kffffffk....",
    ".....kkkkkk.....",
    "................"
  ]},
  lutin: { p: { k: P.k, g: P.g2, G: P.g3, f: "#b8e08a", e: P.y1, l: P.g4, w: P.w }, g: [
    "................",
    ".......kk.......",
    "......klgk......",
    "....kklggkk.....",
    "...klgggggglk...",
    "..kggggggggggk..",
    "...kffffffffk...",
    "...kfekffekfk...",
    "...kffffffffk...",
    "....kfkwwkfk....",
    ".....kffffk.....",
    "....kgggggkk....",
    "...kgkgggkgGk...",
    "...kk.kgk..kk...",
    "......kkkk......",
    "................"
  ]},
  frelon: { p: { k: P.k, j: P.y1, J: P.y2, n: P.k, a: "#cfe8ff", w: P.w, e: P.r2 }, g: [
    "................",
    "....aa....aa....",
    "...aaaa..aaaa...",
    "...aaaaaaaaaa...",
    "....aaakkaaa....",
    "....kkjjjjkk....",
    "...kjjwjjwjjk...",
    "...kjjejjejjk...",
    "....kjjjjjjk....",
    "...kjjjjjjjjk...",
    "...knnjjjjnnk...",
    "....kjjjjjjk....",
    "...knnjjjjnnk...",
    "....kjjjjjjk....",
    ".....kkkkk......",
    ".......kk......."
  ]},
  loup: { p: { k: P.k, s: P.s2, S: P.s3, w: P.w, e: P.b1, n: P.k, f: P.s1 }, g: [
    "................",
    "..kk........kk..",
    ".kssk......kssk.",
    ".ksssk....ksssk.",
    ".ksssskkkkssssk.",
    ".kssssssssssssk.",
    ".kfsessssseesfk.",
    "..kssssssssssk..",
    "..kssknnkksssk..",
    "...kssssssssk...",
    "..kssssssssssk..",
    ".kssSkssssSkssk.",
    ".ksk.kssssk.ksk.",
    ".kk..ksk.ksk.kk.",
    ".....kk...kk....",
    "................"
  ]},
  treant: { p: { k: P.k, t: P.n2, T: P.n3, d: P.n4, v: P.g2, V: P.g3, e: P.y1 }, g: [
    "......kkkk......",
    "....kkvvvvkk....",
    "...kvvVvvVvvk...",
    "..kvVvvvvvvVvk..",
    "..kvvvvVvvvvvk..",
    "...kvvvvvvvvk...",
    "....kkttttkk....",
    "....kttttttk....",
    "...kttekketkk...",
    "...ktttttttttk..",
    "..kttdttttdttk..",
    "..kttttddttttk..",
    "..kTtttttttTtk..",
    "...kTtk..ktTk...",
    "...kkk....kkk...",
    "................"
  ]},
  araignee: { p: { k: P.k, c: P.x1, C: "#4e3766", e: P.r1, w: P.w, l: P.k }, g: [
    "................",
    "..k....kk....k..",
    "..kk..kcck..kk..",
    "...kkkccccjkk...".replace("j","k"),
    "..kkcccccccckk..",
    ".kk.kcecceck.kk.",
    "kk..kcccccck..kk",
    "k..kccccccck...k",
    "..kkcCccccCkk...",
    ".kk.kcccccck.kk.",
    "kk..kCccccCk..kk",
    "k....kkkkkk....k",
    "k..............k",
    "................",
    "................",
    "................"
  ]},
  sanglier: { p: { k: P.k, b: P.n2, B: P.n3, d: P.n4, t: P.cr, e: P.r2, n: P.k }, g: [
    "................",
    "................",
    "....kk.....kk...",
    "...kbbkkkkkbbk..",
    "..kbdddbbbbbbbk.",
    ".kbddbbbbbbbbbk.",
    ".kbbbebbbbbebbk.",
    ".kbbbbbbbbbbbbk.",
    ".kbnnbbbbbbbbbk.",
    ".ktkbbbbbbbbbtk.",
    ".ktkbbbbbbbbktk.",
    "..kkBbbkkbbBkk..",
    "...kBbk..kBbk...",
    "...kkk....kkk...",
    "................",
    "................"
  ]},
  golem: { p: { k: P.k, s: P.s2, S: P.s3, d: "#454b66", v: P.g2, e: P.y1, m: P.g3 }, g: [
    "..kkk......kkk..",
    ".kvvvk....kvvvk.",
    "kkssskkkkkksskk.",
    "ksssssssssssssk.",
    "ksSseskksesSsk..".replace("j","k"),
    "kssssskkssssssk.",
    ".ksssssssssssk..",
    "kksSSssssSSskkk.",
    "kssksssssskssk..",
    "kssksmmmmskssk..",
    "kSSkssssssKSSk.".replace("K","k") + ".",
    ".kkksSssSskkk...",
    "...ksskkssk.....",
    "...kssk.kssk....",
    "..kSSSk.kSSSk...",
    "..kkkk...kkkk..."
  ]},
  spore: { p: { k: P.k, p: P.p2, q: P.p3, l: P.p1, w: P.w, f: P.cr, e: P.b1, d: "#3a2a52" }, g: [
    ".....kkkkkk.....",
    "...kkpppppkkk...",
    "..kpplppppplpk..",
    ".kppppplpppppqk.",
    ".kplppppppplpqk.",
    "kpppplppplppppqk",
    "kqppppppppppqqk.".replace("j","k"),
    "kqqqqqqqqqqqqqk.",
    ".kkkkkkkkkkkkk..",
    "...kffffffffk...",
    "...kfekffekfk...",
    "...kffffffffk...",
    "...kdffffffdk...",
    "....kdffffdk....",
    ".....kkkkkk.....",
    "................"
  ]},
  gardien: { p: { k: P.k, w: P.w, W: P.W, o: P.y1, O: P.y2, e: P.b1, v: P.g1, m: P.s2 }, g: [
    "ko..o......o..ok",
    "kko.oo....oo.okk",
    ".kooook..kooook.",
    "..ko.kokko.kok..",
    "....kkwwwwkk....",
    "...kwwwwwwwwk...",
    "...kwewwwwewk...",
    "...kwwwwwwwwk...",
    "....kwwkkwwk....",
    "...kkwwwwwwkk...",
    "..kwwWwwwwWwwk..",
    ".kwvwwwwwwwwvwk.",
    ".kwkwwWwwWwwkwk.",
    ".kk.kwwkkwwk.kk.",
    "....kwk..kwk....",
    "....kk....kk...."
  ]},
  scarabee: { p: { k: "#241b2f", y: "#ffd45e", Y: "#c89a2e", d: "#7a5c34", w: "#f6f2ff" }, g: [
    "................",
    "................",
    "....kk....kk....",
    "...k..k..k..k...",
    "....kkkkkkkk....",
    "...kyyyykyyyyk..",
    "..kyyywykyyyyyk.",
    "..kyyyyykyyyyyk.",
    ".kyyyyyykyyyyyyk",
    ".kYyyyyykyyyyYyk",
    ".kYYyyyykyyyYYk.",
    "..kYYYyykyYYYk..",
    "...kkYYkkYYkk...",
    "..kdk.kdk.kdk...",
    "..k...k...k.....",
    "................"
  ]},
  cactus: { p: { k: "#241b2f", v: "#4f9a4f", V: "#3f7a3f", d: "#2a5c30", p: "#ff9ec2", y: "#ffd45e", e: "#241b2f", w: "#f6f2ff" }, g: [
    "......kppk......",
    ".....kpykpk.....",
    "......kvvk......",
    ".....kvvvvk.....",
    ".kk..kvvvvk..kk.",
    "kvvk.kvVvvk.kvvk",
    "kvvkkvvvvvkkvvk.",
    "kvvvkvwvvwkvvvk.",
    ".kvvkvevvevkvvk.",
    "..kkkvvvvvkkkk..",
    ".....kvkkvk.....",
    ".....kvvvvk.....",
    ".....kVvvVk.....",
    ".....kVvvVk.....",
    "......kkkk......",
    "................"
  ]},
  serpent: { p: { k: "#241b2f", j: "#e8cc8e", J: "#c8a45e", d: "#a8834a", e: "#ff5f6b", w: "#f6f2ff", r: "#ff6b6b" }, g: [
    "....kkkk........",
    "...kjjjjk.......",
    "..kjjwjwjk......",
    "..kjjejejk......",
    "..kjjjjjjk..kr..",
    "...kjjjjjk.kr...",
    "....kdjjjkk.....",
    ".....kjjjjkk....",
    "..kkkjdjjjjkk...",
    ".kjjjjjjdjjjjk..",
    "kjjdjjjjjjjdjjk.",
    "kjjjjkkkkkjjjjk.",
    ".kjjjk...kjjjk..",
    "..kkkk...kkkk...",
    "................",
    "................"
  ]},
  scorpion: { p: { k: "#241b2f", r: "#c0453a", R: "#8a3028", d: "#5e2019", e: "#ffd45e", w: "#f6f2ff" }, g: [
    "..........kk....",
    ".........krrk...",
    "..........krrk..",
    ".......kk..kk...",
    "......krrk......",
    "......krrk......",
    "..kk..krrk..kk..",
    ".krrk.kkkk.krrk.",
    "krrkkrrrrrrkkrrk",
    "krkkrrerrerkkrk.",
    ".kkrrrrrrrrrkk..",
    "..krRrrrrrRrk...",
    "..kRkrkkrkRk....",
    "..kk.kk.kk.kk...",
    "................",
    "................"
  ]},
  fennec: { p: { k: "#241b2f", c: "#f0d8a8", C: "#d8b878", w: "#f6f2ff", e: "#241b2f", n: "#241b2f", r: "#ffb0a0" }, g: [
    "..kk........kk..",
    ".kcck......kcck.",
    ".kcrck....kcrck.",
    ".kcrrck..kcrrck.",
    "..kccckkkkccck..",
    "..kcccccccccck..",
    "..kcecccccceck..",
    "...kccknnkcck...",
    "....kccccccck...",
    "..kkccccccccck..",
    ".kcckcccccckcck.",
    ".kcc.kcccck.cck.",
    ".kkk.kCkkCk.kkk.",
    "......kk.kk.....",
    "................",
    "................"
  ]},
  vautour: { p: { k: "#241b2f", n: "#5a4a5e", N: "#3e3244", p: "#e8a0a0", w: "#f6f2ff", e: "#ffd45e", b: "#ffd45e" }, g: [
    ".....kpppk......",
    "....kpwpepk.....",
    "....kppppbk.....",
    ".....kppk.......",
    "...kknnkk.......",
    "..knnnnnnk......",
    ".knnnnnnnnk.....",
    "knnNnnnnnNnk....",
    "knNnnnnnnnNnk...",
    "knnnnnnnnnnnk...",
    ".knnnnnnnnnk....",
    "..knnnnnnnk.....",
    "...kkNNNkk......",
    ".....kbk.kbk....",
    ".....kk...kk....",
    "................"
  ]},
  momie: { p: { k: "#241b2f", w: "#e8e4d8", W: "#c0bcae", d: "#8a8678", e: "#5fd0ff", n: "#241b2f" }, g: [
    ".....kkkkk......",
    "....kwwwwwk.....",
    "...kwWwwwWwk....",
    "...kwwkkwwwk....",
    "...kwekwwwwk....",
    "...kwwkwwWwk....",
    "....kwwwwwk.....",
    "...kkwwWwwkk....",
    "..kwwkwwwkwwk...",
    ".kwwkwWwwwkwwk..",
    ".kWk.kwwwWk.kWk.",
    ".kk..kwWwwk..k..",
    "....kwwkkwwk....",
    "....kwwk.kwwk...",
    "....kkk...kkk...",
    "................"
  ]},
  djinn: { p: { k: "#241b2f", b: "#7a9ae8", B: "#5a72c8", v: "#4a5ae0", w: "#f6f2ff", e: "#ffd45e", f: "#a8c0ff" }, g: [
    ".....kkkkk......",
    "....kbbbbbk.....",
    "...kbbfbfbbk....",
    "...kbbebebbk....",
    "...kbbbbbbbk....",
    "....kbfffbk.....",
    "..kkkbbbbbkkk...",
    ".kbbkbbbbbkbbk..",
    ".kbk.kbbbbk.kbk.",
    ".kk..kBbbBk..kk.",
    "......kBbBk.....",
    ".....kBbBk......",
    "......kBbk......",
    ".....kBk........",
    "......k.........",
    "................"
  ]},
  golemgres: { p: { k: "#241b2f", s: "#c8a45e", S: "#a8834a", d: "#7a5c34", e: "#ff9d5c", m: "#d8b878" }, g: [
    "..kkk......kkk..",
    ".ksssk....ksssk.",
    "kkssskkkkkksskk.",
    "ksssssssssssssk.",
    "ksSseskksesSsk..",
    "kssssskkssssssk.",
    ".ksssssssssssk..",
    "kksSSssssSSskkk.",
    "kssksssssskssk..",
    "kssksmmmmskssk..",
    "kSSkssssssksSk..",
    ".kkksSssSskkk...",
    "...ksskkssk.....",
    "...kssk.kssk....",
    "..kSSSk.kSSSk...",
    "..kkkk...kkkk..."
  ]},
  verdunes: { p: { k: "#241b2f", v: "#d8b0a0", V: "#b08878", d: "#8a6050", t: "#f6f2ff", e: "#241b2f", s: "#e8cc8e", S: "#c8a45e" }, g: [
    "......kkkk......",
    ".....kvvvvk.....",
    "....kvvvvvvk....",
    "....kvkkkkvk....",
    "...kvktttkvvk...",
    "...kvkkkkkvvk...",
    "...kvvkttkvvk...",
    "...kVvkkkkvVk...",
    "...kVvvvvvvVk...",
    "...kVvvvvvvVk...",
    "....kVvvvvVk....",
    "..kkkVVvvVVkkk..",
    ".kssskkkkkksssk.",
    "kssssssssssssssk",
    "kSsSsSsSsSsSsSsk",
    ".kkkkkkkkkkkkkk."
  ]},
  sphinx: { p: { k: "#241b2f", y: "#ffd45e", Y: "#e0a63d", b: "#3a6ae0", B: "#2a4aa8", f: "#ffe4c9", e: "#241b2f", w: "#f6f2ff" }, g: [
    "....kbbbbbbk....",
    "...kbybybybbk...",
    "..kbybybybybbk..",
    "..kbffffffbbk...",
    "..kbfeffefbbk...",
    "..kbffffffbbk...",
    "...kbfkkfbbk....",
    "..kkyffffykk....",
    ".kyyykffkyyyk...",
    "kyyyykyykyyyyk..",
    "kyyyyyyyyyyyyk..",
    "kyYyyyyyyyyYyk..",
    "kyykyyyyyykyyk..",
    "kYk.kyykyy.kYk..",
    ".k..kkk.kkk.k...",
    "................"
  ]},
  crabe: { p: { k: "#241b2f", r: "#ff6b5a", R: "#d94a3a", d: "#a83028", w: "#f6f2ff", e: "#241b2f" }, g: [
    "..kk........kk..",
    ".krrk......krrk.",
    "krrrrk....krrrrk",
    "krrkrk....krkrrk",
    ".kkk.k.kk.k.kkk.",
    "....kwk..kwk....",
    "....kekkkkek....",
    "...krrrrrrrrk...",
    "..krrrRrrRrrrk..",
    ".krrrrrrrrrrrrk.",
    ".krRrrrrrrrrRrk.",
    "..krrrrrrrrrrk..",
    "...kkRkRRkRkk...",
    "..kdk.kddk.kdk..",
    "..k....kk....k..",
    "................"
  ]},
  meduse: { p: { k: "#241b2f", p: "#ffb0d0", P: "#e088b0", l: "#ffd0e4", w: "#f6f2ff", e: "#241b2f", t: "#e088b0" }, g: [
    "................",
    "......kkkk......",
    "....kkpppplk....",
    "...kpplppppplk..",
    "..kppppppppppk..",
    "..kplppppplppk..",
    ".kppppppppppppk.",
    ".kpepppppppepk..",
    ".kppppkkppppppk.",
    "..kPpppppppPk...",
    "...kkkkkkkkkk...",
    "..ktk.ktk..ktk..",
    "...kt.kt..kt....",
    "..kt...kt...kt..",
    "...k....k....k..",
    "................"
  ]},
  poissonglobe: { p: { k: "#241b2f", y: "#ffd45e", Y: "#e0a63d", w: "#f6f2ff", e: "#241b2f", s: "#f6f2ff", o: "#ff9d5c" }, g: [
    "....k...k..k....",
    "..k..k.k..k..k..",
    "...k.kkkkkk.k...",
    "..kkyyyyyyykk...",
    ".kyyyyyyyyyyyk..",
    "kkyywyyyyywyykk.",
    ".kyyeyyyyyeyyk..",
    "kkyyyyyyyyyyykk.",
    ".kyyyykkokyyyk..",
    "kkyyyyykkyyyykk.",
    ".kyYyyyyyyyYyk..",
    "..kkYyyyyyYkk...",
    "...k.kkkkk.k....",
    "..k..k...k..k...",
    "....k..k..k.....",
    "................"
  ]},
  murene: { p: { k: "#241b2f", v: "#5a9a5a", V: "#3a7a44", d: "#2a5c34", w: "#f6f2ff", e: "#ffd45e", t: "#f6f2ff" }, g: [
    "..kkkkk.........",
    ".kvvvvvk........",
    "kvvwvvvvk.......",
    "kvvevvvvk.......",
    "kvvvvvkvkk......",
    "kvktktkvvvk.....",
    "kvvkkkvvvvvk....",
    ".kvvvvkvvvvk....",
    "..kkkvvkvvvvk...",
    "....kkvvkvvvk...",
    "..kkvvvvkvvvk...",
    ".kvvvvvkvvvvk...",
    ".kvvvkkvvvvk....",
    "..kvvvvvvvk.....",
    "...kkkkkkk......",
    "................"
  ]},
  etoile: { p: { k: "#241b2f", o: "#ff9d5c", O: "#e07838", d: "#c05828", w: "#f6f2ff", e: "#241b2f", r: "#ffb0a0" }, g: [
    ".......kk.......",
    "......kook......",
    "......kook......",
    ".....koooOk.....",
    ".....kooook.....",
    "kkkkkoooooookkkk",
    ".koooooooooooook",
    "..koooooooooook.",
    "...koowookwook..",
    "...kooeookeook..",
    "....koooooook...",
    "....kookkkook...",
    "...kooOk.kOook..",
    "..kooOk...kOook.",
    ".kkkkk.....kkkkk",
    "................"
  ]},
  hippocampe: { p: { k: "#241b2f", t: "#5fd0c0", T: "#3aa89a", d: "#2a8078", w: "#f6f2ff", e: "#241b2f", n: "#ffd45e" }, g: [
    ".....kkk........",
    "....kttkk.......",
    "...kttttkk......",
    "..kttwtttk......",
    "..kttetttk......",
    "..kttttttkkk....",
    "...kkkttnnnk....",
    "....kttttkk.....",
    "....ktttk.......",
    "....kTtttk......",
    ".....kTtttk.....",
    "....kkTtttk.....",
    "...kttkTttk.....",
    "...kttkTtk......",
    "....kkttk.......",
    ".....kkk........"
  ]},
  tortue: { p: { k: "#241b2f", v: "#7ec06e", V: "#5a9a52", n: "#a8834a", N: "#7a5c34", d: "#5e4426", w: "#f6f2ff", e: "#241b2f" }, g: [
    "................",
    "......kkkkk.....",
    ".....knnnnnk....",
    "....knnNnnnnk...",
    "...knNnnnnNnnk..",
    "..knnnnNnnnnnk..",
    "..knNnnnnnNnnk..",
    "kkknnnnNnnnnnkk.",
    "kvvkNnnnnnnNkvvk",
    "kvwvkkkkkkkkvvvk",
    "kvevvvvvvvvvvvk.",
    ".kvvkvvkkvvkvk..",
    "..kk.kvk.kvk.k..",
    "......k...k.....",
    "................",
    "................"
  ]},
  anguille: { p: { k: "#241b2f", b: "#3a5ac8", B: "#2a4098", y: "#ffd45e", w: "#f6f2ff", e: "#ffd45e" }, g: [
    "...kkkk.........",
    "..kbbbbk........",
    ".kbwbbbbk.......",
    ".kbebbbbk.......",
    ".kbbbbbbk.......",
    ".kbybbbkk.......",
    ".kbbybbk........",
    "..kbbybbk.......",
    "...kbbybbkkk....",
    "...kkbbybbbbk...",
    "..kbbkbbybbbbk..",
    ".kbbbbkbbybbbk..",
    ".kbybbbbkbbbk...",
    "..kbbybbbbbk....",
    "...kkkkkkkk.....",
    "................"
  ]},
  golemcorail: { p: { k: "#241b2f", K: "#e86a8a", c: "#ff9eb8", C: "#c04868", s: "#e8dcc8", S: "#c0b498", e: "#5fd0ff" }, g: [
    ".kK.k.....k.Kk..",
    ".kckcK...Kckck..",
    "..kcckk.kkcck...",
    "kkkccckkccckkk..",
    "kssscssscsssk...",
    "kssseskksessk...",
    "kssssskkssssk...",
    ".ksssssssssk....",
    "kkscccsssccsskk.",
    "kssksssssskssk..",
    "ksskscccssksSk..",
    ".kkkssssssskk...",
    "...ksskkssk.....",
    "...kssk.kssk....",
    "..kSSSk.kSSSk...",
    "..kkkk...kkkk..."
  ]},
  krakenjr: { p: { k: "#241b2f", p: "#a878e0", P: "#8050b8", d: "#5c3890", w: "#f6f2ff", e: "#ffd45e" }, g: [
    "......kkkk......",
    "....kkppppkk....",
    "...kpppppppppk..",
    "..kpppPpppPppk..",
    "..kppppppppppk..",
    ".kppwppppppwppk.",
    ".kppeppppppeppk.",
    ".kppppppppppppk.",
    "..kppppkkppppk..",
    "..kPpppppppPpk..",
    "..kpkpkppkpkpk..",
    ".kpk.kpkkpk.kpk.",
    ".kp..kp..kp..pk.",
    "..k..k....k..k..",
    "................",
    "................"
  ]},
  leviathan: { p: { k: "#241b2f", b: "#4a90d0", B: "#2a68a8", d: "#1a4878", w: "#f6f2ff", e: "#5fffe0", f: "#7fd0ff", n: "#f6f2ff" }, g: [
    "..kk......kkk...",
    ".kffk...kkbbbk..",
    ".kfffk.kbbbbbbk.",
    "..kffkkbbwbbbbk.",
    "...kkbbbebbbbbk.",
    "..kbbbbbbbkkkk..",
    ".kbbbfbbbbk.....",
    ".kbbbbbbbnnk....",
    "..kkkbbbbknk....",
    "..kffkbbbbkk....",
    ".kfffkbbbbbk....",
    "..kkkbbbbbbbk...",
    ".kbbbbbkkbbbbk..",
    "kbbbbbk..kbbbk..",
    ".kkkkk....kkk...",
    "................"
  ]},
};
/* mini-icônes 10×10 pour les slots d'équipement */
const ICO = {
  armeP: { p: { k: P.k, s: P.s1, S: P.s2, o: P.y1 }, g: ["........k.",".......ks.","......kss.",".....kssk.","....kssk..","..k.kssk..",".koksskk..","..koook...","..kokok...",".kk...k..."] },
  armeT: { p: { k: P.k, c: P.b1, C: P.b2, o: P.p1 }, g: ["........k.",".......kc.","......kcC.",".....kcCk.","....kcCk..","..k.kcCk..",".kokcckk..","..koook...","..kokok...",".kk...k..."] },
  armeS: { p: { k: P.k, s: P.s1, o: P.n2 }, g: ["..........","......k...",".....ks...","....ksk...","...ksk....","..ksk.....",".kokk.....","koook.....",".kok......","..k......."] },
  anneau: { p: { k: P.k, o: P.y1, O: P.y2, g: P.b1 }, g: ["....gg....","...kggk...","...kkkk...","..ko..ok..",".ko....ok.",".ko....ok.",".kO....Ok.","..kO..Ok..","...kOOk...","....kk...."] },
  amulette: { p: { k: P.k, o: P.y2, g: P.g1, G: P.g3 }, g: ["...k..k...","..k....k..","..k....k..","...k..k...","....kk....","...kggk...","..kggggk..","..kgGggk..","...kggk...","....kk...."] },
  armure: { p: { k: P.k, s: P.s1, S: P.s2, o: P.y1 }, g: ["..k....k..",".kskkkksk.",".ksssssk..".replace("j","k"),".kssosssk.",".ksssssok.","..kssssk..","..kssssk..","..ksSSsk..","...kssk...","....kk...."] },
  bottes: { p: { k: P.k, n: P.n2, N: P.n3, o: P.y1 }, g: ["..kk......","..knk.....","..knk.....","..knnk....","..knnk....","..knnnkk..","..knnnnnk.","..kNNNNNk.","..kkkkkkk.",".........."] },
  gants: { p: { k: P.k, n: P.cr, N: "#e0c9a0", o: P.y2 }, g: ["...kkk....","..knnnkk..","..knnnnnk.",".kknnnnnk.","kNknnnnnk.","kNnnnnnnk.",".knnnnnok.",".knnnnnk..","..kkkkk...",".........."] },
  boucle: { p: { k: P.k, o: P.y1, O: P.y2, g: P.p1 }, g: ["....kk....","...k..k...","...k..k...","....kk....","....ko....","...kook...","...kgOk...","...kggk...","....kk....",".........."] },
};

/* ---------- bestiaires des zones ---------- */
const MONSTRES = [
  /* — Forêt — */
  { id: "slime",    zone: "foret", nom: "Slime Mousse",      type: "normal", spr: "slime",    hpM: 1.0, atkM: 0.9,  asM: 0.80, goldM: 1.0, tiers: [1, 8, 30, 80, 200],  desc: "Une flaque de gelée couverte de mousse. Absorbe la rosée du matin." },
  { id: "champi",   zone: "foret", nom: "Champi Boudeur",    type: "normal", spr: "champi",   hpM: 1.1, atkM: 1.0,  asM: 0.70, goldM: 1.1, tiers: [1, 8, 30, 80, 200],  desc: "Il boude depuis qu'on a marché sur son chapeau. Rancunier." },
  { id: "lutin",    zone: "foret", nom: "Lutin Sylvestre",   type: "normal", spr: "lutin",    hpM: 0.9, atkM: 1.1,  asM: 0.95, goldM: 1.3, tiers: [1, 8, 30, 80, 200],  desc: "Voleur de baies notoire. Garde toujours une pièce dans sa poche." },
  { id: "frelon",   zone: "foret", nom: "Frelon Vif",        type: "normal", spr: "frelon",   hpM: 0.6, atkM: 0.8,  asM: 1.45, goldM: 0.9, tiers: [1, 8, 30, 80, 200],  desc: "Frappe vite, pique fort, vit peu. Un concentré de nervosité." },
  { id: "loup",     zone: "foret", nom: "Loup Cendré",       type: "normal", spr: "loup",     hpM: 1.0, atkM: 1.25, asM: 1.00, goldM: 1.1, tiers: [1, 8, 30, 80, 200],  desc: "Chasse seul depuis que sa meute l'a trouvé trop intense." },
  { id: "araignee", zone: "foret", nom: "Araignée Tisseuse", type: "normal", spr: "araignee", hpM: 0.8, atkM: 1.15, asM: 1.15, goldM: 1.0, tiers: [1, 8, 30, 80, 200],  desc: "Tisse des pièges d'une précision troublante. Huit yeux, zéro pitié." },
  { id: "sanglier", zone: "foret", nom: "Sanglier Bourru",   type: "normal", spr: "sanglier", hpM: 1.5, atkM: 1.2,  asM: 0.65, goldM: 1.2, tiers: [1, 8, 30, 80, 200],  desc: "Charge d'abord, réfléchit jamais. Ses défenses ont raclé bien des écorces." },
  { id: "treant",   zone: "foret", nom: "Tréant Juvénile",   type: "normal", spr: "treant",   hpM: 2.0, atkM: 1.0,  asM: 0.50, goldM: 1.4, tiers: [1, 8, 30, 80, 200],  desc: "À peine trois cents ans. Encore un gamin, mais un gamin en bois massif." },
  { id: "golem",    zone: "foret", nom: "Golem de Racines",  type: "mini",   spr: "golem",    hpM: 1.0, atkM: 1.0,  asM: 1.0,  goldM: 1.0, tiers: [1, 4, 12, 30, 70],   desc: "La forêt a donné des bras à sa colère. Boss de niveau." },
  { id: "spore",    zone: "foret", nom: "Spore Ancien",      type: "mini",   spr: "spore",    hpM: 0.85, atkM: 1.15, asM: 1.1, goldM: 1.1, tiers: [1, 4, 12, 30, 70],  desc: "Un champignon plus vieux que les chemins. Ses spores embrument l'esprit." },
  { id: "gardien",  zone: "foret", nom: "Gardien de la Forêt", type: "zone", spr: "gardien",  hpM: 1.0, atkM: 1.0,  asM: 1.0,  goldM: 1.0, tiers: [1, 3, 8, 18, 40],   desc: "L'esprit-cerf qui veille sur la Forêt. Le vaincre ouvre le Désert." },
  /* — Désert — */
  { id: "scarabee", zone: "desert", nom: "Scarabée Doré",    type: "normal", spr: "scarabee", hpM: 1.0, atkM: 0.9,  asM: 0.85, goldM: 1.5, tiers: [1, 8, 30, 80, 200],  desc: "Sa carapace vaut plus que sa vie. Lui le sait, toi aussi." },
  { id: "cactus",   zone: "desert", nom: "Cactus Grognon",   type: "normal", spr: "cactus",   hpM: 1.4, atkM: 0.95, asM: 0.55, goldM: 1.1, tiers: [1, 8, 30, 80, 200],  desc: "Immobile depuis quarante ans. Il déteste ça, et donc toi." },
  { id: "serpent",  zone: "desert", nom: "Serpent des Sables", type: "normal", spr: "serpent", hpM: 0.85, atkM: 1.2, asM: 1.1, goldM: 1.0, tiers: [1, 8, 30, 80, 200], desc: "Ondule sous la dune et frappe à la cheville. Classique mais efficace." },
  { id: "scorpion", zone: "desert", nom: "Scorpion Nacré",   type: "normal", spr: "scorpion", hpM: 0.7, atkM: 1.0,  asM: 1.4,  goldM: 1.0, tiers: [1, 8, 30, 80, 200],  desc: "Deux pinces, un dard, aucun scrupule." },
  { id: "fennec",   zone: "desert", nom: "Fennec Chapardeur", type: "normal", spr: "fennec",  hpM: 0.8, atkM: 1.05, asM: 1.2,  goldM: 1.4, tiers: [1, 8, 30, 80, 200], desc: "Ces oreilles entendent tinter une bourse à trois dunes de distance." },
  { id: "vautour",  zone: "desert", nom: "Vautour Pelé",     type: "normal", spr: "vautour",  hpM: 0.9, atkM: 1.15, asM: 1.05, goldM: 1.1, tiers: [1, 8, 30, 80, 200], desc: "Patient. Très patient. Trop patient pour être honnête." },
  { id: "momie",    zone: "desert", nom: "Momie Égarée",     type: "normal", spr: "momie",    hpM: 1.7, atkM: 1.1,  asM: 0.55, goldM: 1.3, tiers: [1, 8, 30, 80, 200],  desc: "Cherche son tombeau depuis deux mille ans. De très mauvaise humeur." },
  { id: "djinn",    zone: "desert", nom: "Djinn Mineur",     type: "normal", spr: "djinn",    hpM: 1.0, atkM: 1.3,  asM: 0.9,  goldM: 1.2, tiers: [1, 8, 30, 80, 200],  desc: "N'exauce aucun vœu, mais distribue volontiers des malédictions." },
  { id: "golemgres", zone: "desert", nom: "Golem de Grès",   type: "mini",   spr: "golemgres", hpM: 1.0, atkM: 1.0, asM: 1.0,  goldM: 1.0, tiers: [1, 4, 12, 30, 70],  desc: "Le désert aussi sait se fabriquer des poings. Boss de niveau." },
  { id: "verdunes", zone: "desert", nom: "Ver des Dunes",    type: "mini",   spr: "verdunes", hpM: 1.2, atkM: 0.95, asM: 0.85, goldM: 1.2, tiers: [1, 4, 12, 30, 70],  desc: "Ce que tu prends pour une dune respire. Boss de niveau." },
  { id: "sphinx",   zone: "desert", nom: "Sphinx des Mirages", type: "zone", spr: "sphinx",   hpM: 1.0, atkM: 1.0,  asM: 1.0,  goldM: 1.0, tiers: [1, 3, 8, 18, 40],   desc: "Il ne pose plus d'énigmes. Il a arrêté d'être déçu. Le vaincre ouvre l'Océan." },
  /* — Océan — */
  { id: "crabe",    zone: "ocean", nom: "Crabe Pinceur",     type: "normal", spr: "crabe",    hpM: 1.3, atkM: 1.0,  asM: 0.7,  goldM: 1.1, tiers: [1, 8, 30, 80, 200],  desc: "Marche de travers, pince tout droit." },
  { id: "meduse",   zone: "ocean", nom: "Méduse Rose",       type: "normal", spr: "meduse",   hpM: 0.8, atkM: 1.2,  asM: 0.95, goldM: 1.0, tiers: [1, 8, 30, 80, 200],  desc: "Jolie, translucide, urticante. Dans cet ordre." },
  { id: "poissonglobe", zone: "ocean", nom: "Poisson-Globe", type: "normal", spr: "poissonglobe", hpM: 1.1, atkM: 0.95, asM: 0.8, goldM: 1.1, tiers: [1, 8, 30, 80, 200], desc: "Se gonfle quand il a peur. Il a toujours peur." },
  { id: "murene",   zone: "ocean", nom: "Murène Sournoise",  type: "normal", spr: "murene",   hpM: 0.95, atkM: 1.3, asM: 1.05, goldM: 1.0, tiers: [1, 8, 30, 80, 200], desc: "Sort de son trou pile quand tu regardes ailleurs." },
  { id: "etoile",   zone: "ocean", nom: "Étoile Vorace",     type: "normal", spr: "etoile",   hpM: 1.5, atkM: 0.9,  asM: 0.6,  goldM: 1.2, tiers: [1, 8, 30, 80, 200],  desc: "Cinq bras, un estomac, zéro table de conversation." },
  { id: "hippocampe", zone: "ocean", nom: "Hippocampe Zélé", type: "normal", spr: "hippocampe", hpM: 0.75, atkM: 1.1, asM: 1.35, goldM: 1.1, tiers: [1, 8, 30, 80, 200], desc: "Le seul poisson qui fait du zèle. Les autres le trouvent épuisant." },
  { id: "tortue",   zone: "ocean", nom: "Tortue Cuirassée",  type: "normal", spr: "tortue",   hpM: 2.2, atkM: 0.95, asM: 0.45, goldM: 1.4, tiers: [1, 8, 30, 80, 200],  desc: "Trois siècles de carapace. Elle a le temps, pas toi." },
  { id: "anguille", zone: "ocean", nom: "Anguille Voltaïque", type: "normal", spr: "anguille", hpM: 0.7, atkM: 1.25, asM: 1.45, goldM: 1.0, tiers: [1, 8, 30, 80, 200], desc: "Dix mille volts de mauvaise foi." },
  { id: "golemcorail", zone: "ocean", nom: "Golem de Corail", type: "mini",  spr: "golemcorail", hpM: 1.0, atkM: 1.0, asM: 1.0, goldM: 1.0, tiers: [1, 4, 12, 30, 70], desc: "Un récif qui a décidé de marcher. Boss de niveau." },
  { id: "krakenjr", zone: "ocean", nom: "Kraken Juvénile",   type: "mini",   spr: "krakenjr", hpM: 0.9, atkM: 1.15, asM: 1.05, goldM: 1.1, tiers: [1, 4, 12, 30, 70],  desc: "Encore petit. Huit bras quand même. Boss de niveau." },
  { id: "leviathan", zone: "ocean", nom: "Léviathan des Abysses", type: "zone", spr: "leviathan", hpM: 1.0, atkM: 1.0, asM: 1.0, goldM: 1.0, tiers: [1, 3, 8, 18, 40], desc: "Le fond de l'océan a un maître, et il n'aime pas la visite." },
];
const MON_BY_ID = Object.fromEntries(MONSTRES.map((m) => [m.id, m]));
const ZONES = [
  { id: "foret",  nom: "Forêt",  col: "#7ee06e" },
  { id: "desert", nom: "Désert", col: "#ffb75e" },
  { id: "ocean",  nom: "Océan",  col: "#5fc8ff" },
];
const ZONE_BY_ID = Object.fromEntries(ZONES.map((z) => [z, z]) .map((p) => [p[0].id, p[1]]));
const monstresDe = (zid) => MONSTRES.filter((m) => m.zone === zid);

/* ---------- stances ---------- */
/* principal : monte niveau par niveau (tokens). subs : bougent par palier d'évolution (1 évo / 5 niveaux). */
const STANCES = [
  { id: "voyageur",  nom: "Voyageur",  ico: "✦", col: "#b9c2d9", fixe: true, desc: "Posture neutre, sans bonus ni malus.", principal: null, subs: [] },
  { id: "berserker", nom: "Berserker", ico: "⚔", col: "#ff6b6b", desc: "Tout dans la lame. La peau, on verra plus tard.",
    principal: { stat: "atk", base: 30, parNiv: 6 },
    subs: [ { stat: "critC", base: 5, parEvo: 3 }, { stat: "def", base: -25, parEvo: 5 }, { stat: "hp", base: -15, parEvo: 3 } ] },
  { id: "rempart",   nom: "Rempart",   ico: "⛨", col: "#6ad4ff", desc: "Encaisser, c'est un métier. Idéal pour nourrir la jauge Endurance.",
    principal: { stat: "def", base: 40, parNiv: 8 },
    subs: [ { stat: "hp", base: 15, parEvo: 4 }, { stat: "atk", base: -30, parEvo: 5 }, { stat: "as", base: -10, parEvo: 2 } ] },
  { id: "pillard",   nom: "Pillard",   ico: "◆", col: "#ffd45e", desc: "L'or d'abord. Farme les tranches faciles.",
    principal: { stat: "gold", base: 30, parNiv: 6 },
    subs: [ { stat: "vsMon", base: 10, parEvo: 3 }, { stat: "atk", base: -20, parEvo: 4 }, { stat: "vsBoss", base: -20, parEvo: 4 } ] },
  { id: "chasseur",  nom: "Chasseur",  ico: "➶", col: "#8be05f", desc: "Spécialiste du menu fretin. Les boss, très peu pour lui.",
    principal: { stat: "vsMon", base: 35, parNiv: 7 },
    subs: [ { stat: "critC", base: 5, parEvo: 2 }, { stat: "vsBoss", base: -25, parEvo: 5 } ] },
  { id: "regicide",  nom: "Régicide",  ico: "♛", col: "#c59bff", desc: "Ne vit que pour les gros. Swap juste avant le 10ᵉ monstre.",
    principal: { stat: "vsBoss", base: 35, parNiv: 7 },
    subs: [ { stat: "def", base: 10, parEvo: 3 }, { stat: "vsMon", base: -25, parEvo: 5 } ] },
  { id: "zephyr",    nom: "Zéphyr",    ico: "»", col: "#79d0c3", desc: "Frapper deux fois plutôt que fort. Monte vite la jauge Célérité.",
    principal: { stat: "as", base: 25, parNiv: 5 },
    subs: [ { stat: "critC", base: 5, parEvo: 2 }, { stat: "atk", base: -20, parEvo: 4 } ] },
];
const STANCE_BY_ID = Object.fromEntries(STANCES.map((s) => [s.id, s]));
const NOM_STAT = { atk: "ATQ", hp: "PV max", def: "DÉF", as: "Vit. attaque", critC: "Chance crit.", critD: "Dégâts crit.", gold: "Or", vsMon: "Dégâts monstres", vsBoss: "Dégâts boss" };
const nivCost = (n) => Math.ceil(Math.pow(1.28, n - 1));
const stanceVals = (def, st) => {
  const niv = st ? st.niv : 1, evo = st ? st.evo : 0;
  return {
    principal: def.principal ? def.principal.base + def.principal.parNiv * (niv - 1) : 0,
    subs: def.subs.map((s) => ({ stat: s.stat, val: s.base < 0 ? Math.min(0, s.base + s.parEvo * evo) : s.base + s.parEvo * evo })),
  };
};

/* ---------- jauges méta ---------- */
const GAUGES = [
  { id: "puissance",  nom: "Puissance",  src: "Dégâts infligés",   eff: "+1% ATQ / palier",            par: 1,   base: 150, r: 1.65, col: "#ff9d5c", ico: "⚔" },
  { id: "endurance",  nom: "Endurance",  src: "Dégâts encaissés",  eff: "+1% PV max / palier",         par: 1,   base: 55,  r: 1.62, col: "#ff6b6b", ico: "♥" },
  { id: "fortune",    nom: "Fortune",    src: "Or restant en fin de run", eff: "+1% or / palier",      par: 1,   base: 50,  r: 1.65, col: "#ffd45e", ico: "◆" },
  { id: "celerite",   nom: "Célérité",   src: "Attaques portées",  eff: "+0,5% vit. attaque / palier", par: 0.5, base: 80,  r: 1.55, col: "#6ad4ff", ico: "»" },
  { id: "precision",  nom: "Critique",   src: "Coups critiques portés", eff: "+2% dégâts crit. / palier", par: 2, base: 5, r: 1.52, col: "#c59bff", ico: "✳" },
  { id: "domination", nom: "Domination", src: "Boss vaincus",      eff: "+1% dégâts boss / palier",    par: 1,   base: 1,   r: 1.6,  col: "#8be05f", ico: "♛" },
  { id: "extermination", nom: "Extermination", src: "Monstres tués", eff: "−1% coût boutique / palier (composé)", par: 1, rabais: true, base: 9, r: 1.55, col: "#79d0c3", ico: "☠" },
];
const cumReq = (g, t) => g.base * (Math.pow(g.r, t) - 1) / (g.r - 1);
function tiersFromTotal(g, total) { let t = 0; while (cumReq(g, t + 1) <= total && t < 500) t++; return t; }

/* ---------- équipement ---------- */
const RARS = [
  { id: "commun",     nom: "Commun",     col: "#b9c2d9", mult: 1.0,  subs: 0, w: 46 },
  { id: "magique",    nom: "Magique",    col: "#7aa2ff", mult: 1.15, subs: 1, w: 24 },
  { id: "rare",       nom: "Rare",       col: "#6ad4ff", mult: 1.35, subs: 1, w: 14 },
  { id: "heroique",   nom: "Héroïque",   col: "#58e0a0", mult: 1.55, subs: 2, w: 8 },
  { id: "epique",     nom: "Épique",     col: "#c59bff", mult: 1.8,  subs: 2, w: 4.5 },
  { id: "legendaire", nom: "Légendaire", col: "#ffd45e", mult: 2.2,  subs: 3, w: 2.2 },
  { id: "mythique",   nom: "Mythique",   col: "#ff5fd0", mult: 2.8,  subs: 3, w: 1 },
  { id: "divin",      nom: "Divin",      col: "#ffffff", mult: 3.6,  subs: 4, w: 0.3 },
];
const RAR_BY_ID = Object.fromEntries(RARS.map((r) => [r.id, r]));
/* stats: f=flat, p=pourcentage */
const SLOTS = [
  { id: "armeP",   nom: "Arme principale",       ico: "armeP",  base: "Arme", main: { stat: "atkF", base: 6 },  pool: ["atkP", "critD", "critC"] },
  { id: "armeT",   nom: "Arme de Transcendance", ico: "armeT",  main: { stat: "atkP", base: 22 }, pool: ["gaugeP", "critD", "vsBossP"], trans: true },
  { id: "armeS",   nom: "Arme secondaire",       ico: "armeS",  base: "Lame", main: { stat: "atkP", base: 8 },  pool: ["critC", "asP", "critD"] },
  { id: "anneau1", nom: "Anneau 1",              ico: "anneau", main: { stat: "goldP", base: 6 }, pool: ["atkP", "hpP", "critD"] },
  { id: "anneau2", nom: "Anneau 2",              ico: "anneau", main: { stat: "atkP", base: 6 },  pool: ["goldP", "hpP", "critC"] },
  { id: "amulette", nom: "Amulette",             ico: "amulette", main: { stat: "hpP", base: 8 }, pool: ["goldP", "atkP", "defF"] },
  { id: "armure",  nom: "Armure",                ico: "armure", main: { stat: "hpF", base: 30 },  pool: ["defF", "hpP", "asP"] },
  { id: "bottes",  nom: "Bottes",                ico: "bottes", main: { stat: "asP", base: 6 },   pool: ["defF", "hpF", "goldP"] },
  { id: "gants",   nom: "Gants",                 ico: "gants",  main: { stat: "critC", base: 4 }, pool: ["atkP", "atkF", "critD"] },
  { id: "boucle1", nom: "Boucle d'oreille 1",    ico: "boucle", main: { stat: "critD", base: 10 }, pool: ["critC", "goldP", "atkP"] },
  { id: "boucle2", nom: "Boucle d'oreille 2",    ico: "boucle", main: { stat: "critC", base: 3 }, pool: ["critD", "goldP", "hpP"] },
];
/* Familles : pour le recyclage auto (types) et les slots jumeaux (destination au choix). */
const FAM_SLOT = { armeP: "arme", armeS: "arme", anneau1: "anneau", anneau2: "anneau", boucle1: "boucle", boucle2: "boucle" };
const fam = (sid) => FAM_SLOT[sid] || sid;
const FAMS = [
  { id: "arme", nom: "Armes" }, { id: "anneau", nom: "Anneaux" }, { id: "boucle", nom: "Boucles" },
  { id: "amulette", nom: "Amulettes" }, { id: "armure", nom: "Armures" }, { id: "bottes", nom: "Bottes" }, { id: "gants", nom: "Gants" },
];
const TWINS = { anneau1: ["anneau1", "anneau2"], anneau2: ["anneau1", "anneau2"], boucle1: ["boucle1", "boucle2"], boucle2: ["boucle1", "boucle2"] };
const slotsCibles = (sid) => TWINS[sid] || [sid];
const SLOT_BY_ID = Object.fromEntries(SLOTS.map((s) => [s.id, s]));
const NOM_ISTAT = { atkF: "ATQ", atkP: "% ATQ", hpF: "PV", hpP: "% PV", defF: "DÉF", asP: "% Vit. attaque", critC: "% Chance crit.", critD: "% Dégâts crit.", goldP: "% Or", vsBossP: "% Dégâts boss", gaugeP: "% Remplissage jauges" };
const IBASE = { atkF: 5, atkP: 6, hpF: 24, hpP: 6, defF: 6, asP: 4, critC: 3, critD: 8, goldP: 6, vsBossP: 8, gaugeP: 6 };
const PREFIX = {
  commun: ["Simple", "Usé", "Banal"], magique: ["Enchanté", "Imprégné", "Scintillant"],
  rare: ["Solide", "Affûté", "Poli"], heroique: ["Vaillant", "Indomptable", "Glorieux"],
  epique: ["Sylvestre", "Runique", "Féroce"], legendaire: ["Ancestral", "Éclatant", "Immémorial"],
  mythique: ["Fabuleux", "Primordial", "Céleste"], divin: ["Divin", "Transcendant", "Absolu"],
};
const SUFFIX = ["du Loup", "des Racines", "du Frelon", "de l'Aube", "du Gardien", "des Spores", "de la Mousse", "du Crépuscule"];
const pick = (a) => a[Math.floor(R() * a.length)];
function rollRarity(ilvl) {
  /* Plus le niveau monte, plus les hautes raretés pèsent lourd (jusqu'à ×3 à haut niveau). */
  const bonus = Math.min(3, 1 + ilvl * 0.045);
  const w = RARS.map((r, i) => (i === 0 ? r.w / bonus : r.w * (1 + (bonus - 1) * (i / (RARS.length - 1)))));
  let s = w.reduce((a, b) => a + b, 0), x = R() * s;
  for (let i = 0; i < RARS.length; i++) { x -= w[i]; if (x <= 0) return RARS[i]; }
  return RARS[0];
}
function genItem(slotId, ilvl, forceRar) {
  const slot = SLOT_BY_ID[slotId];
  const rar = forceRar ? RAR_BY_ID[forceRar] : rollRarity(ilvl);
  const scale = (1 + 0.17 * (ilvl - 1)) * rar.mult;
  const stats = {}; stats[slot.main.stat] = Math.max(1, Math.round(slot.main.base * scale));
  const pool = slot.pool.slice();
  for (let i = 0; i < rar.subs && pool.length; i++) {
    const st = pool.splice(Math.floor(R() * pool.length), 1)[0];
    stats[st] = (stats[st] || 0) + Math.max(1, Math.round(IBASE[st] * scale * (0.6 + R() * 0.5)));
  }
  const baseNom = slot.base || slot.nom.split(" ")[0];
  return { id: uid(), slot: slotId, rar: rar.id, ilvl, nom: pick(PREFIX[rar.id]) + " " + baseNom + " " + pick(SUFFIX), stats, t: 1, a: 0 };
}
/* ---------- affinage & tiers ----------
   stats de base × (1 + 5% par niveau d'affinage cumulé sur les tiers) :
   Tier I aff.10 = ×1,5 · Tier II aff.10 = ×2 · Tier III aff.10 = ×2,5. */
const multAff = (it) => 1 + 0.05 * ((it.a || 0) + 10 * ((it.t || 1) - 1));
function statsEff(it) { const m = multAff(it); if (m === 1) return it.stats; const o = {}; for (const k in it.stats) o[k] = Math.round(it.stats[k] * m); return o; }
const coutAffinage = (it) => Math.max(1, Math.round(it.ilvl * RAR_BY_ID[it.rar].mult * (it.t || 1) * (1 + 0.3 * (it.a || 0))));
function trouverItem(meta, id) {
  const i = meta.inv.find((x) => x.id === id); if (i) return i;
  for (const k in meta.equip) if (meta.equip[k] && meta.equip[k].id === id) return meta.equip[k];
  return null;
}
function affiner(G, itemId) {
  const meta = G.meta, it = trouverItem(meta, itemId);
  if (!it || it.nv || (it.a || 0) >= 10) return;
  const c = coutAffinage(it); if (meta.ferraille < c) return;
  meta.ferraille -= c; it.a = (it.a || 0) + 1; it.t = it.t || 1;
  sfx("tier", meta.opts.sfx); G.saveNow = true;
}
function evoluerTier(G, itemId) {
  const meta = G.meta, it = trouverItem(meta, itemId);
  if (!it || it.nv || (it.a || 0) < 10 || (it.t || 1) >= 3) return;
  const c = it.t || 1; if (meta.essence < c) return;
  meta.essence -= c; it.t = (it.t || 1) + 1; it.a = 0;
  toast(G, it.nom + " évolue — Tier " + rome(it.t), RAR_BY_ID[it.rar].col);
  sfx("boss", meta.opts.sfx); G.saveNow = true;
}
/* ---------- ensembles d'équipement ----------
   Une pièce liée à un ensemble est automatiquement verrouillée : pour la
   déverrouiller, il faut la retirer de l'ensemble (ou supprimer l'ensemble). */
function estLie(meta, itemId) {
  return (meta.ensembles || []).some((e) => Object.values(e.items).includes(itemId));
}
const verrou = (meta, it) => !!(it.lock || estLie(meta, it.id));
function basculerLock(G, itemId) {
  const it = trouverItem(G.meta, itemId); if (!it || it.nv) return;
  if (estLie(G.meta, itemId)) { toast(G, "Pièce liée à un ensemble 🔗 — retire-la de l'ensemble pour la déverrouiller", "#ffd45e"); return; }
  it.lock = !it.lock; sfx("equip", G.meta.opts.sfx); G.saveNow = true;
}
function sauverEnsemble(G) {
  const meta = G.meta;
  const items = {};
  for (const k in meta.equip) if (meta.equip[k] && !meta.equip[k].nv) items[k] = meta.equip[k].id;
  if (!Object.keys(items).length) { toast(G, "Rien d'équipé à sauvegarder", "#ffd45e"); return; }
  meta.ensembles.push({ id: uid(), nom: "Ensemble " + (meta.ensembles.length + 1), grp: meta.grpEns[0], items });
  toast(G, "Ensemble sauvegardé (" + Object.keys(items).length + " pièces) — renomme-le avec ✎", "#8be05f");
  sfx("tier", meta.opts.sfx); G.saveNow = true;
}
function equiperEnsemble(G, ensId) {
  const meta = G.meta, ens = meta.ensembles.find((e) => e.id === ensId); if (!ens) return;
  let manque = 0;
  for (const slotId in ens.items) {
    const iid = ens.items[slotId];
    if (meta.equip[slotId] && meta.equip[slotId].id === iid) continue;
    let it = null;
    const ii = meta.inv.findIndex((x) => x.id === iid);
    if (ii >= 0) it = meta.inv.splice(ii, 1)[0];
    else for (const k in meta.equip) if (meta.equip[k] && meta.equip[k].id === iid && k !== slotId) { it = meta.equip[k]; meta.equip[k] = null; break; }
    if (!it) { manque++; continue; }
    const old = meta.equip[slotId];
    meta.equip[slotId] = it;
    if (old) meta.inv.unshift(old);
  }
  toast(G, "« " + ens.nom + " » équipé" + (manque ? " — " + manque + " pièce(s) introuvable(s)" : ""), "#8be05f");
  sfx("equip", meta.opts.sfx); G.saveNow = true;
}
function supprimerEnsemble(G, ensId) {
  const meta = G.meta;
  meta.ensembles = meta.ensembles.filter((e) => e.id !== ensId);
  G.saveNow = true;
}
/* ---------- priorités d'équipement automatique ---------- */
const GRP_STATS = [
  { id: "or", nom: "Or", stats: { goldP: 1 } },
  { id: "atq", nom: "Attaque", stats: { atkP: 1, atkF: 0.2 } },
  { id: "pv", nom: "PV", stats: { hpP: 1, hpF: 0.06 } },
  { id: "crit", nom: "Critique", stats: { critC: 2, critD: 1 } },
  { id: "vit", nom: "Vitesse", stats: { asP: 1 } },
  { id: "def", nom: "Défense", stats: { defF: 1 } },
  { id: "boss", nom: "Boss", stats: { vsBossP: 1 } },
  { id: "jauges", nom: "Jauges", stats: { gaugeP: 1 } },
];
const GRP_BY_ID = Object.fromEntries(GRP_STATS.map((g) => [g.id, g]));
function scoreGroupe(it, g) { const se = statsEff(it); let s = 0; for (const k in g.stats) s += (se[k] || 0) * g.stats[k]; return s; }
function cmpPrio(a, b, ordres) {
  for (const gid of ordres) {
    const g = GRP_BY_ID[gid]; if (!g) continue;
    const d = scoreGroupe(b, g) - scoreGroupe(a, g);
    if (Math.abs(d) > 0.001) return d;
  }
  return scoreItem(b) - scoreItem(a);
}
function trierInventaire(G) {
  const idx = Object.fromEntries(RARS.map((r, i) => [r.id, i]));
  G.meta.inv.sort((a, b) => (idx[b.rar] - idx[a.rar]) || ((b.t || 1) - (a.t || 1)) || (b.ilvl - a.ilvl) || ((b.a || 0) - (a.a || 0)));
  G.saveNow = true; sfx("equip", G.meta.opts.sfx);
}
function equipTotals(meta) {
  const t = { atkF: 0, atkP: 0, hpF: 0, hpP: 0, defF: 0, asP: 0, critC: 0, critD: 0, goldP: 0, vsBossP: 0, gaugeP: 0 };
  for (const sid in meta.equip) { const it = meta.equip[sid]; if (!it) continue; const se = statsEff(it); for (const k in se) t[k] += se[k]; }
  return t;
}

/* ---------- armes de Transcendance ----------
   Forgées en transcendant une zone (plus de drop aléatoire), uniques,
   indestructibles, légendaires. Le bonus principal dépend de la zone et
   grimpe fort à chaque niveau de transcendance de cette zone. */
const ARMES_T = {
  foret:  { nom: "Sylvaria, Lame du Bosquet",   col: "#8be05f", main: { stat: "goldP", parNiv: 50 }, subs: [{ stat: "gaugeP", parNiv: 10 }, { stat: "atkP", parNiv: 8 }] },
  desert: { nom: "Simoun, Croc des Dunes",      col: "#ffd45e", main: { stat: "atkP", parNiv: 45 }, subs: [{ stat: "critD", parNiv: 20 }, { stat: "vsBossP", parNiv: 10 }] },
  ocean:  { nom: "Abyssale, Dent des Marées",   col: "#6ad4ff", main: { stat: "hpP", parNiv: 50 }, subs: [{ stat: "defF", parNiv: 15 }, { stat: "hpF", parNiv: 60 }] },
  montagne:  { nom: "Égide, Rempart des Cimes",      col: "#cbb69d", main: { stat: "hpP", parNiv: 45 }, subs: [{ stat: "defF", parNiv: 25 }, { stat: "hpF", parNiv: 120 }] },
  plaines:   { nom: "Foudroyeuse, Sœur de l'Orage",  col: "#a8d8ff", main: { stat: "asP", parNiv: 30 }, subs: [{ stat: "critC", parNiv: 4 }, { stat: "critD", parNiv: 15 }] },
  glacier:   { nom: "Hivernale, Morsure du Gel",     col: "#bfe8ff", main: { stat: "hpP", parNiv: 40 }, subs: [{ stat: "hpF", parNiv: 250 }, { stat: "gaugeP", parNiv: 8 }] },
  volcan:    { nom: "Pyrelame, Colère du Magma",     col: "#ff7a45", main: { stat: "atkP", parNiv: 55 }, subs: [{ stat: "critD", parNiv: 30 }] },
  marais:    { nom: "Bourbierre, Faux des Vases",    col: "#9fb85a", main: { stat: "gaugeP", parNiv: 22 }, subs: [{ stat: "goldP", parNiv: 20 }] },
  ruines:    { nom: "Mémoria, Éclat du Passé",       col: "#d8cfa8", main: { stat: "gaugeP", parNiv: 18 }, subs: [{ stat: "goldP", parNiv: 15 }, { stat: "vsBossP", parNiv: 10 }] },
  citadelle: { nom: "Astralis, Juge des Étoiles",    col: "#c59bff", main: { stat: "vsBossP", parNiv: 50 }, subs: [{ stat: "critD", parNiv: 20 }] },
  jungle:    { nom: "Prédatrice, Croc Primordial",   col: "#45d06a", main: { stat: "goldP", parNiv: 45 }, subs: [{ stat: "atkP", parNiv: 18 }] },
  abysses:   { nom: "Nocturne, Serre des Profondeurs", col: "#7a6aff", main: { stat: "hpP", parNiv: 55 }, subs: [{ stat: "defF", parNiv: 30 }, { stat: "gaugeP", parNiv: 8 }] },
  verre:     { nom: "Prismatique, Aiguille Solaire", col: "#e8f4ff", main: { stat: "critD", parNiv: 40 }, subs: [{ stat: "critC", parNiv: 3 }, { stat: "goldP", parNiv: 15 }] },
  ciel:      { nom: "Céleste, Plume du Firmament",   col: "#8ad4ff", main: { stat: "asP", parNiv: 35 }, subs: [{ stat: "gaugeP", parNiv: 12 }] },
  coeur:     { nom: "Originelle, Battement Premier", col: "#ff5fd0", main: { stat: "atkP", parNiv: 22 }, subs: [{ stat: "hpP", parNiv: 22 }, { stat: "goldP", parNiv: 22 }, { stat: "gaugeP", parNiv: 10 }] },
};
const ROME = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X"];
const rome = (n) => ROME[n - 1] || "×" + n;
function statsArmeT(zid, niv, meta) {
  const d = ARMES_T[zid]; if (!d || niv < 1) return null;
  const stats = {}; stats[d.main.stat] = d.main.parNiv * niv;
  d.subs.forEach((s) => { stats[s.stat] = (stats[s.stat] || 0) + s.parNiv * niv; });
  if (meta && meta.origine) {
    const mArm = 1 + (bonusOrigine(meta).armeT || 0) / 100;
    if (mArm > 1) for (const k in stats) stats[k] = Math.round(stats[k] * mArm);
  }
  return stats;
}
function genArmeT(zid, niv, meta) {
  const stats = statsArmeT(zid, niv, meta); if (!stats) return null;
  return { id: uid(), slot: "armeT", rar: "legendaire", ilvl: niv * 10, nom: ARMES_T[zid].nom + " " + rome(niv), stats, nv: true, zone: zid, niv };
}
/* L'arme équipée est dérivée : le choix du joueur s'il est valide, sinon la
   plus haute transcendance. Rappelée après chaque transcendance / choix / chargement. */
function armeTEquipee(meta) {
  const possedees = ZONES.filter((z) => ARMES_T[z.id] && (meta.zones[z.id] || {}).trans >= 1);
  if (!possedees.length) return null;
  let zid = meta.armeTChoix && possedees.some((z) => z.id === meta.armeTChoix) ? meta.armeTChoix : null;
  if (!zid) zid = possedees.reduce((a, b) => (meta.zones[b.id].trans > meta.zones[a.id].trans ? b : a)).id;
  return genArmeT(zid, meta.zones[zid].trans, meta);
}
/* ---------- recyclage automatique du butin ---------- */
function recyclable(meta, it) {
  const r = meta.recy;
  return !!(r && r.on && r.rars[it.rar] && r.fams[fam(it.slot)] && (!r.nivMax || it.ilvl <= r.nivMax));
}
/* ---------- équiper le meilleur ----------
   Score pondéré par stat (valeur relative approximative d'un point de chaque
   stat) ; pour les slots jumeaux, les 2 meilleurs candidats sont répartis. */
const POIDS_STAT = { atkF: 1, atkP: 2.2, hpF: 0.35, hpP: 1.6, defF: 1.2, asP: 2.0, critC: 2.2, critD: 1.1, goldP: 1.5, vsBossP: 0.8, gaugeP: 1.2 };
function scoreItem(it) { let s = 0; const se = statsEff(it); for (const k in se) s += (POIDS_STAT[k] || 1) * se[k]; return s; }
function equiperMeilleur(G) {
  const meta = G.meta; let changes = 0, nbDivin = 0;
  const traites = new Set();
  SLOTS.filter((s) => !s.trans).forEach((s) => {
    const cibles = slotsCibles(s.id), key = cibles.join("+");
    if (traites.has(key)) return; traites.add(key);
    const cands = [];
    cibles.forEach((cid) => { if (meta.equip[cid]) cands.push(meta.equip[cid]); });
    meta.inv.forEach((it) => { if (slotsCibles(it.slot).join("+") === key) cands.push(it); });
    if (!cands.length) return;
    const ordres = (meta.prios && meta.prios.ordres) || [];
    cands.sort((a, b) => (ordres.length ? cmpPrio(a, b, ordres) : scoreItem(b) - scoreItem(a)));
    const top = [];
    for (const c of cands) {
      if (top.length >= cibles.length) break;
      if (c.rar === "divin") { if (nbDivin >= 1) continue; nbDivin++; }
      top.push(c);
    }
    const topIds = new Set(top.map((t) => t.id));
    cibles.forEach((cid) => {
      const cur = meta.equip[cid];
      if (cur && !topIds.has(cur.id)) { meta.inv.unshift(cur); meta.equip[cid] = null; }
    });
    meta.inv = meta.inv.filter((it) => !topIds.has(it.id));
    const dejaEquipes = new Set(cibles.map((cid) => meta.equip[cid] && meta.equip[cid].id).filter(Boolean));
    const restants = top.filter((t) => !dejaEquipes.has(t.id));
    cibles.forEach((cid) => {
      if (!meta.equip[cid] && restants.length) { meta.equip[cid] = restants.shift(); changes++; }
    });
  });
  if (changes > 0) { toast(G, "Meilleur équipement : " + changes + " changement" + (changes > 1 ? "s" : ""), "#8be05f"); sfx("equip", meta.opts.sfx); }
  else toast(G, "Tu portes déjà le meilleur équipement disponible", "#ccd6f4");
  G.saveNow = true;
}

/* ---------- sauvegarde ---------- */
const SAVE_KEY = "transcendance-v1";
const memStore = {};
async function sauver(data) {
  const s = JSON.stringify(data); memStore[SAVE_KEY] = s;
  try { if (typeof window !== "undefined" && window.storage) { await window.storage.set(SAVE_KEY, s); return "cloud"; } } catch (e) {}
  return "mem";
}
async function charger() {
  try { if (typeof window !== "undefined" && window.storage) { const r = await window.storage.get(SAVE_KEY); if (r && r.value) return JSON.parse(r.value); } } catch (e) {}
  if (memStore[SAVE_KEY]) { try { return JSON.parse(memStore[SAVE_KEY]); } catch (e) {} }
  return null;
}

/* ---------- SFX (WebAudio minimal) ---------- */
let AC = null;
function sfx(type, on) {
  if (!on) return;
  try {
    AC = AC || new (window.AudioContext || window.webkitAudioContext)();
    if (AC.state === "suspended") AC.resume();
    const t = AC.currentTime, o = AC.createOscillator(), g = AC.createGain();
    o.connect(g); g.connect(AC.destination);
    const conf = {
      hit:   [["square", 160, 120], 0.05, 0.05],
      crit:  [["square", 520, 880], 0.09, 0.07],
      coin:  [["triangle", 880, 1318], 0.08, 0.05],
      boss:  [["sawtooth", 110, 55], 0.25, 0.09],
      mort:  [["sawtooth", 220, 60], 0.5, 0.1],
      tier:  [["triangle", 523, 1046], 0.22, 0.08],
      equip: [["triangle", 392, 523], 0.1, 0.05],
    }[type] || [["sine", 440, 440], 0.05, 0.03];
    o.type = conf[0][0]; o.frequency.setValueAtTime(conf[0][1], t);
    o.frequency.exponentialRampToValueAtTime(Math.max(30, conf[0][2]), t + conf[1]);
    g.gain.setValueAtTime(conf[2], t); g.gain.exponentialRampToValueAtTime(0.001, t + conf[1]);
    o.start(t); o.stop(t + conf[1] + 0.02);
  } catch (e) {}
}

/* ============================================================
   MOTEUR DE JEU (opère sur un objet G mutable, rendu à ~10 fps)
   ============================================================ */
let SEUIL_MAIT_CACHE = 0; /* rempli par heroStats via bonusOrigine ; évite un recalcul par appel */
const reqMult = (meta, zid) => Math.pow(BAL.transReq, (meta.zones[zid] || { trans: 0 }).trans) * (1 - Math.min(60, SEUIL_MAIT_CACHE) / 100);
const maxTrans = (meta) => Math.max(...ZONES.map((z) => meta.zones[z.id].trans));
const tierOf = (def, kills, rm) => def.tiers.reduce((t, req) => t + (kills >= Math.ceil(req * rm) ? 1 : 0), 0);
const estMaitrise = (def, kills, rm) => tierOf(def, kills, rm) >= def.tiers.length;
function bestGoldBonus(meta) {
  let b = 0;
  const orM = meta.origine ? (function () { let s = 0; for (const nid in meta.origine.arbre) { const n = NODE_BY_ID[nid]; if (n && n.eff === "orMaitrise") s += n.val * meta.origine.arbre[nid]; } ((meta.origine.echosEq || [])).forEach((eid) => { const e = (meta.origine.echos || []).find((x) => x.id === eid); if (e) (e.effets || []).forEach((ef) => { if (ef.e === "orMaitrise") s += ef.v; }); }); return s; })() : 0;
  for (const z of ZONES) {
    const rm = reqMult(meta, z.id);
    const n = monstresDe(z.id).reduce((a, m) => a + (estMaitrise(m, meta.best[m.id] || 0, rm) ? 1 : 0), 0);
    b += n * (BAL.bestGold + orM) * Math.pow(2, (meta.zones[z.id] || { trans: 0 }).trans);
  }
  return b;
}

function metaInitiale() {
  return {
    gauges: Object.fromEntries(GAUGES.map((g) => [g.id, { total: 0, applied: 0 }])),
    tokens: 0,
    stances: Object.fromEntries(STANCES.filter((s) => !s.fixe).map((s) => [s.id, { niv: 1, evo: 0 }])),
    best: Object.fromEntries(MONSTRES.map((m) => [m.id, 0])),
    zones: Object.fromEntries(ZONES.map((z) => [z.id, { trans: 0 }])),
    equip: Object.fromEntries(SLOTS.map((s) => [s.id, null])),
    inv: [],
    vie: { runs: 0, meilleure: 0, kills: 0, or: 0 },
    opts: { sfx: true, vitesse: 1, autoZone: true, autoRelance: false, echelle: "auto" },
    versionVue: VERSION,
    recy: { on: false, rars: { commun: true, magique: false, rare: false, heroique: false, epique: false, legendaire: false, mythique: false, divin: false }, nivMax: 0, fams: { arme: true, anneau: true, boucle: true, amulette: true, armure: true, bottes: true, gants: true } },
    armeTChoix: null,
    ferraille: 0,
    essence: 0,
    ensembles: [],
    grpEns: ["Général"],
    prios: { ordres: [], list: [], actif: null },
    /* v0.9.0 — permanent à travers les Renaissances */
    origine: {
      ren: 0, eclats: 0, eclatsTot: 0, eclatsDep: 0, meilleurGain: 0,
      bestZone: 0, bestNiv: 0,
      arbre: {}, echos: [], echosEq: [], echoChoix: null,
      sermentsActifs: [], altSel: {},
    },
    /* v0.9.0 — stats du cycle en cours (remises à zéro par la Renaissance) */
    cycle: { maxZone: 0, maxNiv: 1, gardiens: {}, kills: 0, bestRar: 0 },
  };
}
function runInitiale() {
  return {
    zoneIdx: 0, niveau: 1, nivZone: ZONES.map(() => 1), debloque: 0, kills: 0, stance: "voyageur",
    lvlAtk: 0, lvlHp: 0, gold: 0, tokensPend: 0,
    hp: -1, mon: null, spawnT: BAL.spawn * 0.6, hG: 0, mG: 0,
    over: false, morte: false, gains: null, essences: [],
    stats: { kills: 0, or: 0, degats: 0, subis: 0 },
  };
}

function heroStats(G) {
  const meta = G.meta, run = G.run;
  const b = bonusOrigine(meta);
  const m = malusSerments(meta, b.sermMalus);
  G.oB = b; G.oM = m;
  SEUIL_MAIT_CACHE = b.seuilMaitrise;
  const eq = equipTotals(meta);
  const sd = STANCE_BY_ID[run.stance];
  const sv = stanceVals(sd, meta.stances[sd.id]);
  const S = { atk: 0, hp: 0, def: 0, as: 0, critC: 0, critD: 0, gold: 0, vsMon: 0, vsBoss: 0 };
  if (!m.stancesOff) {
    if (sd.principal) S[sd.principal.stat] += sv.principal;
    sv.subs.forEach((s) => { S[s.stat] += s.val; });
  }
  const T = {}; GAUGES.forEach((g) => { T[g.id] = meta.gauges[g.id].applied; });
  const nbTrans = ZONES.reduce((a, z) => a + (((meta.zones[z.id] || {}).trans || 0) >= 1 ? 1 : 0), 0);
  const gGlobal = 1 + (b.statsG + b.parZoneTrans * nbTrans + (run.zoneIdx < 3 ? b.earlyZ : 0)) / 100;
  b.seuilJActif = GAUGES.reduce((a, g) => a + (meta.gauges[g.id].applied >= 10 ? 1 : 0), 0) >= 3;
  const atk = (BAL.hero.atk + eq.atkF + b.atkDep + b.atkParGardien * Object.keys((meta.cycle || {}).gardiens || {}).length) * (1 + 0.01 * T.puissance) * (1 + 0.05 * run.lvlAtk * (1 + b.effShop / 100)) * (1 + (eq.atkP + b.atkP) / 100) * (1 + S.atk / 100) * gGlobal;
  const hpMax = (BAL.hero.hp + eq.hpF + b.hpDep) * (1 + 0.01 * T.endurance) * (1 + 0.05 * run.lvlHp * (1 + b.effShop / 100)) * (1 + (eq.hpP + b.hpP) / 100) * (1 + S.hp / 100) * (1 + (b.statsG + b.parZoneTrans * nbTrans) / 100) * (1 - Math.min(70, m.hpMoins) / 100);
  const defV = Math.max(0, (10 + eq.defF + b.defDep) * (1 + S.def / 100));
  const red = clamp(defV / (defV + BAL.defK), 0, 0.85);
  return {
    atk, hpMax, def: defV, red,
    as: BAL.hero.as * (1 + 0.005 * T.celerite) * (1 + (eq.asP + b.asP) / 100) * (1 + S.as / 100),
    critC: clamp(BAL.hero.critC + eq.critC + S.critC + b.critC, 0, 80),
    critD: BAL.hero.critD + 2 * T.precision + eq.critD + S.critD,
    gold: (1 + 0.01 * T.fortune) * (1 + (eq.goldP + b.goldP) / 100) * (1 + bestGoldBonus(meta) / 100) * (1 + S.gold / 100),
    vsMon: (1 + S.vsMon / 100) * (1 + b.vsMonP / 100),
    vsBoss: (1 + 0.01 * T.domination) * (1 + (eq.vsBossP + b.vsBossP) / 100) * (1 + S.vsBoss / 100),
    gaugeF: 1 + eq.gaugeP / 100,
  };
}

function creerMonstre(G, zoneIdx, niveau, idx) {
  const meta = G.meta;
  const z = ZONES[zoneIdx];
  const estBoss = idx === 9;
  const monz = monstresDe(z.id);
  let def;
  if (estBoss) {
    if (niveau >= 10) def = monz.find((m) => m.type === "zone");
    else { const minis = monz.filter((m) => m.type === "mini"); def = minis[niveau % 2 === 1 ? 0 : 1] || minis[0]; }
  } else {
    const normaux = monz.filter((m) => m.type === "normal");
    def = pick(normaux.slice(0, Math.min(3 + (niveau - 1), normaux.length)));
  }
  const L = zoneIdx * 10 + niveau;
  const bm = estBoss ? (def.type === "zone" ? BAL.zbos : BAL.boss) : null;
  const zs = zScale(zoneIdx);
  const alt = altMods(meta, z.id);
  const mm = G.oM || MALUS_NEUTRE;
  const hp = BAL.mob.hp * Math.pow(BAL.mob.hpG, L - 1) * def.hpM * (bm ? bm.hp : 1) * (estBoss ? 1 : 1 + idx * 0.05) * zs.hp * alt.hp * (estBoss && alt.bossHp ? alt.bossHp : 1);
  return {
    def, estBoss, hp, hpMax: hp,
    atk: BAL.mob.atk * Math.pow(BAL.mob.atkG, L - 1) * def.atkM * (bm ? bm.atk : 1) * zs.atk * alt.atk * mm.mobAtk,
    gold: BAL.mob.gold * Math.pow(BAL.mob.goldG, L - 1) * def.goldM * (bm ? bm.gold : 1) * zs.gold * alt.gold,
    as: BAL.mob.as * def.asM * (bm ? bm.as : 1) * alt.as,
  };
}

const ALT_GJ = { gJEndu: "endurance", gJPuis: "puissance", gJCrit: "precision", gJDomi: "domination", gJCele: "celerite" };
const gAdd = (G, id, v) => {
  const b = G.oB;
  if (b) {
    let p = (b.gJ[id] || 0) + (b.gTous || 0) + (b.seuilJActif ? (b.seuilJ || 0) : 0);
    const zid = ZONES[G.run.zoneIdx] && ZONES[G.run.zoneIdx].id;
    if (zid && altActive(G.meta, zid)) {
      const rew = ALT_BY_ZONE[zid].rew;
      for (const k in ALT_GJ) if (rew[k] && ALT_GJ[k] === id) p += rew[k];
    }
    v *= 1 + p / 100;
  }
  G.meta.gauges[id].total += v;
};
function addFloat(G, txt, cls, side) {
  G.floats.push({ id: uid(), txt, cls, side, x: 8 + R() * 44, t: G.now });
  if (G.floats.length > 24) G.floats.splice(0, G.floats.length - 24);
}
function toast(G, txt, col) { G.toasts.push({ id: uid(), txt, col: col || "#f6f2ff", t: G.now }); if (G.toasts.length > 30) G.toasts.shift(); }
function log(G, txt, col) { if (!G.log) G.log = []; G.log.push({ id: uid(), txt, col: col || "#eef0ff" }); if (G.log.length > 30) G.log.shift(); }

function rollDrop(G, mon) {
  const meta = G.meta;
  let p = mon.estBoss ? (mon.def.type === "zone" ? BAL.drop.zone : BAL.drop.mini) : BAL.drop.normal;
  p *= 1 + ((G.oB && G.oB.dropP) || 0) / 100;
  p *= 1 - Math.min(90, (G.oM && G.oM.dropMoins) || 0) / 100;
  if (R() > p) return;
  const zTrans = meta.zones[ZONES[G.run.zoneIdx].id].trans;
  const slotId = pick(SLOTS.filter((s) => !s.trans)).id;
  const it = genItem(slotId, G.run.zoneIdx * 10 + G.run.niveau + zTrans * 10, mon.def.type === "zone" && R() < 0.35 ? "legendaire" : null);
  const riCyc = RARS.findIndex((r) => r.id === it.rar);
  if (riCyc > (meta.cycle.bestRar || 0)) meta.cycle.bestRar = riCyc;
  if (recyclable(meta, it)) {
    const v = gainFerraille(G, prixFerraille(it)); meta.ferraille += v;
    log(G, "♻ Recyclé : " + it.nom + " · +" + fmt(v) + " ⚒", "#9aa3c7");
    return;
  }
  if (meta.inv.length >= 60) {
    const v = gainFerraille(G, prixFerraille(it)); meta.ferraille += v;
    toast(G, "Inventaire plein — " + it.nom + " recyclé +" + fmt(v) + " ⚒", "#b9c2d9");
  } else { meta.inv.unshift(it); G.dropFlag = true; toast(G, "Butin : " + it.nom, RAR_BY_ID[it.rar].col); log(G, "Butin : " + it.nom, RAR_BY_ID[it.rar].col); }
  sfx("equip", meta.opts.sfx);
}
/* La vente d'équipement ne rapporte plus d'or : elle produit des morceaux
   de ferraille ⚒, la monnaie d'affinage. */
const prixFerraille = (it) => Math.max(1, Math.round(it.ilvl * RAR_BY_ID[it.rar].mult * (1 + 0.5 * ((it.t || 1) - 1) + 0.05 * (it.a || 0))));
const gainFerraille = (G, v) => Math.round(v * (1 + (((G.oB && G.oB.ferrailleP) || 0) + (altActive(G.meta, ZONES[G.run.zoneIdx].id) ? (ALT_BY_ZONE[ZONES[G.run.zoneIdx].id].rew.ferraille || 0) : 0)) / 100));

function tuerMonstre(G) {
  const run = G.run, meta = G.meta, st = G.st, mon = run.mon;
  const oB = G.oB || {}, oM = G.oM || MALUS_NEUTRE;
  let g = mon.gold * st.gold;
  if (mon.estBoss) {
    if (mon.def.type === "zone") g *= 1 + (oB.gainGardien || 0) / 100;
    g *= 1 - Math.min(90, oM.bossGold || 0) / 100;
  } else g *= 1 - Math.min(90, oM.mobGold || 0) / 100;
  if (run.zoneIdx < 3) g *= 1 - Math.min(90, oM.exilEarly || 0) / 100;
  if (run.zoneIdx >= 5) g *= 1 + (oB.exilLoin || 0) / 100;
  run.hp = st.hpMax;
  run.gold += g; run.stats.or += g; meta.vie.or += g;
  addFloat(G, "+" + fmtM(g), "gold", "mon");
  log(G, mon.def.nom + " vaincu · +" + fmtM(g), "#ffd45e");
  sfx("coin", meta.opts.sfx);
  gAdd(G, "extermination", 1 * st.gaugeF);
  run.stats.kills++; meta.vie.kills++;
  meta.cycle.kills = (meta.cycle.kills || 0) + 1;
  meta.cycle.maxZone = Math.max(meta.cycle.maxZone || 0, run.zoneIdx);
  meta.cycle.maxNiv = Math.max(meta.cycle.maxNiv || 1, run.zoneIdx * 10 + run.niveau);
  const rm = reqMult(meta, mon.def.zone);
  const avant = tierOf(mon.def, meta.best[mon.def.id] || 0, rm);
  meta.best[mon.def.id] = (meta.best[mon.def.id] || 0) + 1;
  const apres = tierOf(mon.def, meta.best[mon.def.id], rm);
  if (apres > avant) {
    const zc = ZONE_BY_ID[mon.def.zone].col;
    toast(G, "Bestiaire ↑ " + mon.def.nom + " — palier " + apres + "/" + mon.def.tiers.length, zc);
    log(G, "Bestiaire ↑ " + mon.def.nom + " — palier " + apres, zc);
    sfx("tier", meta.opts.sfx);
  }
  if (mon.estBoss) {
    run.tokensPend++; gAdd(G, "domination", 1 * st.gaugeF);
    if (R() * 100 < (oB.tokensB || 0)) { run.tokensPend++; log(G, "Trophée royal — token de boss bonus ⬡", "#c59bff"); }
    addFloat(G, "+1 ⬡", "token", "mon");
    log(G, "+1 token de boss ⬡", "#c59bff");
    if (mon.def.type === "zone") {
      const zidB = mon.def.zone;
      meta.cycle.gardiens[zidB] = Math.max(meta.cycle.gardiens[zidB] || 0, altActive(meta, zidB) ? 2 : 1);
      if (!Array.isArray(run.essences)) run.essences = [];
      if (!run.essences.includes(zidB)) {
        run.essences.push(zidB);
        let chanceDouble = (oB.essenceB || 0) + (altActive(meta, zidB) ? (ALT_BY_ZONE[zidB].rew.essence || 0) : 0);
        let nEss = 1;
        while (chanceDouble >= 100) { nEss++; chanceDouble -= 100; }
        if (R() * 100 < chanceDouble) nEss++;
        meta.essence += nEss;
        toast(G, "✦ Essence résiduelle ×" + nEss + " — " + ZONE_BY_ID[zidB].nom + " (1/run)", "#ff3b5c");
        log(G, "✦ +" + nEss + " Essence résiduelle (" + ZONE_BY_ID[zidB].nom + ")", "#ff3b5c");
        G.saveNow = true;
      }
    }
    sfx("boss", meta.opts.sfx);
  }
  rollDrop(G, mon);
  run.mon = null; run.mG = 0; run.spawnT = BAL.spawn;
  run.kills++;
  if (run.kills >= 10) {
    run.kills = 0;
    if (run.niveau < 10) {
      run.niveau++;
      run.nivZone[run.zoneIdx] = run.niveau;
      toast(G, ZONES[run.zoneIdx].nom + " — niveau " + run.niveau + "/10", "#6ad4ff");
    } else {
      if (run.zoneIdx < ZONES.length - 1 && run.debloque < run.zoneIdx + 1) {
        run.debloque = run.zoneIdx + 1;
        toast(G, ZONES[run.zoneIdx + 1].nom + " débloqué pour cette run !", ZONES[run.zoneIdx + 1].col);
        log(G, ZONES[run.zoneIdx + 1].nom + " débloqué !", ZONES[run.zoneIdx + 1].col);
      }
      if (meta.opts.autoZone && run.zoneIdx < ZONES.length - 1) {
        run.nivZone[run.zoneIdx] = 10;
        run.zoneIdx++;
        run.niveau = run.nivZone[run.zoneIdx] || 1;
        toast(G, "Zone suivante : " + ZONES[run.zoneIdx].nom + " — niveau " + run.niveau, ZONES[run.zoneIdx].col);
      } else {
        toast(G, "Le Gardien se reforme — farm du niveau 10", "#c59bff");
      }
    }
  }
}

function finRun(G, morte) {
  const run = G.run, meta = G.meta;
  if (run.over) return;
  run.over = true; run.morte = morte;
  const stF = (G.st || heroStats(G)).gaugeF;
  const orRestant = Math.round(run.gold);
  gAdd(G, "fortune", run.gold * stF);
  const paliers = [];
  GAUGES.forEach((g) => {
    const gs = meta.gauges[g.id];
    const nt = tiersFromTotal(g, gs.total);
    if (nt > gs.applied) paliers.push({ g, avant: gs.applied, apres: nt });
    gs.applied = nt;
  });
  meta.tokens += run.tokensPend;
  meta.vie.runs++;
  meta.vie.meilleure = Math.max(meta.vie.meilleure, run.zoneIdx * 10 + run.niveau);
  run.overT = G.now;
  run.gains = { paliers, tokens: run.tokensPend, fortuneOr: orRestant };
  log(G, morte ? "Défaite — jauges et or restant actés" : "Run encaissée — jauges et or restant actés", "#8be05f");
  sfx(morte ? "mort" : "tier", meta.opts.sfx);
  G.saveNow = true;
}

function tick(G, dt) {
  const run = G.run;
  if (run.over) return;
  const st = heroStats(G); G.st = st;
  if (run.hp < 0) run.hp = st.hpMax;
  run.hp = Math.min(run.hp, st.hpMax);
  if (!run.mon) {
    run.spawnT -= dt;
    if (run.spawnT <= 0) { run.mon = creerMonstre(G, run.zoneIdx, run.niveau, run.kills); run.mG = 0; }
    return;
  }
  run.hG += dt * st.as;
  run.mG += dt * run.mon.as;
  let garde = 0;
  while (run.hG >= 1 && run.mon && garde++ < 20) {
    run.hG -= 1;
    const crit = R() * 100 < st.critC;
    const rmT = reqMult(G.meta, run.mon.def.zone);
    const tier = tierOf(run.mon.def, G.meta.best[run.mon.def.id] || 0, rmT);
    let d = st.atk * (crit ? st.critD / 100 : 1) * (run.mon.estBoss ? st.vsBoss : st.vsMon) * (1 + (BAL.bestDmg * tier) / 100);
    if (G.oB && G.oB.vsMaitrise > 0 && estMaitrise(run.mon.def, G.meta.best[run.mon.def.id] || 0, rmT)) d *= 1 + G.oB.vsMaitrise / 100;
    d = Math.max(1, d);
    run.mon.hp -= d; run.stats.degats += d;
    gAdd(G, "puissance", d * st.gaugeF);
    gAdd(G, "celerite", 1 * st.gaugeF);
    if (crit) gAdd(G, "precision", 1 * st.gaugeF);
    addFloat(G, fmt(d), crit ? "crit" : "dmg", "mon");
    log(G, (crit ? "CRITIQUE ! " : "Tu infliges ") + fmt(d) + " dégâts", crit ? "#ffd45e" : "#eef0ff");
    if (!crit && R() < 0.4) sfx("hit", G.meta.opts.sfx);
    if (crit) sfx("crit", G.meta.opts.sfx);
    G.heroAtk = G.now;
    if (run.mon.hp <= 0) { tuerMonstre(G); return; }
  }
  garde = 0;
  while (run.mon && run.mG >= 1 && garde++ < 20) {
    run.mG -= 1;
    const tier = tierOf(run.mon.def, G.meta.best[run.mon.def.id] || 0, reqMult(G.meta, run.mon.def.zone));
    let d = run.mon.atk * (1 - st.red) * (1 - (BAL.bestRes * tier) / 100);
    if (G.oM && G.oM.degatsPlus > 0) d *= 1 + G.oM.degatsPlus / 100;
    if (G.oB && G.oB.redSubis > 0) d *= 1 - Math.min(70, G.oB.redSubis) / 100;
    d = Math.max(1, d);
    run.hp -= d; run.stats.subis += d;
    gAdd(G, "endurance", d * st.gaugeF);
    addFloat(G, "-" + fmt(d), "hurt", "hero");
    log(G, ((G.meta.best[run.mon.def.id] || 0) > 0 ? run.mon.def.nom : "? ? ?") + " te frappe : −" + fmt(d) + " PV", "#ff6b6b");
    G.monAtk = G.now;
    if (run.hp <= 0) { run.hp = 0; finRun(G, true); return; }
  }
}

/* ---------- actions joueur ---------- */
const coutShop = (base, g, lvl) => Math.ceil(base * Math.pow(g, lvl));
const rabaisShop = (meta) => Math.pow(0.99, meta.gauges.extermination ? meta.gauges.extermination.applied : 0);
const coutReel = (G, quoi) => {
  const r = G.run;
  const oB = G.oB || { coutShop: 0 }, oM = G.oM || MALUS_NEUTRE;
  const modO = (1 - Math.min(60, oB.coutShop) / 100) * (1 + (oM.shopPlus || 0) / 100);
  return Math.ceil((quoi === "atk" ? coutShop(BAL.shop.atkC, BAL.shop.atkCG, r.lvlAtk) : coutShop(BAL.shop.hpC, BAL.shop.hpCG, r.lvlHp)) * rabaisShop(G.meta) * modO);
};
function acheter(G, quoi, max) {
  const run = G.run; if (run.over) return;
  let n = 0;
  while (n < (max ? 1000 : 1)) {
    const c = coutReel(G, quoi);
    if (run.gold < c) break;
    run.gold -= c;
    if (quoi === "atk") run.lvlAtk++;
    else { run.lvlHp++; const st = heroStats(G); run.hp = Math.min(st.hpMax, run.hp + st.hpMax * BAL.shop.heal); }
    n++;
  }
  if (n > 0) { sfx("equip", G.meta.opts.sfx); if (quoi === "hp") addFloat(G, "+PV", "heal", "hero"); }
}
function equiper(G, itemId, slotCible) {
  const meta = G.meta;
  const i = meta.inv.findIndex((x) => x.id === itemId); if (i < 0) return;
  const it = meta.inv[i];
  const cible = slotCible && slotsCibles(it.slot).includes(slotCible) ? slotCible : it.slot;
  if (SLOT_BY_ID[cible].trans || SLOT_BY_ID[it.slot].trans) { toast(G, "Les Armes de Transcendance se forgent en transcendant une zone", "#c59bff"); return; }
  if (it.rar === "divin") {
    const nbDivin = Object.keys(meta.equip).filter((k) => k !== cible && meta.equip[k] && meta.equip[k].rar === "divin").length;
    if (nbDivin >= 1) { toast(G, "Un seul équipement Divin peut être porté pour l'instant", "#ffffff"); return; }
  }
  meta.inv.splice(i, 1);
  const old = meta.equip[cible];
  meta.equip[cible] = it;
  if (old) meta.inv.unshift(old);
  sfx("equip", meta.opts.sfx); G.saveNow = true;
}
function vendreItem(G, itemId) {
  const meta = G.meta;
  const i = meta.inv.findIndex((x) => x.id === itemId); if (i < 0) return;
  if (verrou(meta, meta.inv[i])) { toast(G, "Équipement verrouillé — déverrouille-le d'abord", "#ffd45e"); return; }
  const v = gainFerraille(G, prixFerraille(meta.inv[i]));
  meta.ferraille += v;
  meta.inv.splice(i, 1);
  toast(G, "+" + fmt(v) + " ⚒ ferraille", "#b9c2d9");
  sfx("coin", meta.opts.sfx); G.saveNow = true;
}
function vendreRarete(G, rarId) {
  const meta = G.meta; let tot = 0, n = 0;
  meta.inv = meta.inv.filter((it) => { if (it.rar === rarId && !verrou(meta, it)) { tot += prixFerraille(it); n++; return false; } return true; });
  tot = gainFerraille(G, tot);
  if (tot > 0) { meta.ferraille += tot; toast(G, n + " objet" + (n > 1 ? "s" : "") + " " + RAR_BY_ID[rarId].nom.toLowerCase() + (n > 1 ? "s" : "") + " → +" + fmt(tot) + " ⚒", RAR_BY_ID[rarId].col); sfx("coin", meta.opts.sfx); G.saveNow = true; }
}
function ameliorerStance(G, id) {
  const meta = G.meta, st = meta.stances[id]; if (!st) return;
  const c = nivCost(st.niv);
  if (meta.tokens < c) return;
  meta.tokens -= c; st.niv++;
  sfx("tier", meta.opts.sfx); G.saveNow = true;
}
function evoluerStance(G, id) {
  const meta = G.meta, st = meta.stances[id]; if (!st) return;
  if (Math.floor(st.niv / 5) <= st.evo) return;
  st.evo++;
  toast(G, STANCE_BY_ID[id].nom + " évolue — palier " + st.evo, STANCE_BY_ID[id].col);
  sfx("boss", meta.opts.sfx); G.saveNow = true;
}
function transcender(G, zid) {
  const meta = G.meta, rm = reqMult(meta, zid);
  const monz = monstresDe(zid);
  if (!monz.every((m) => estMaitrise(m, meta.best[m.id] || 0, rm))) return;
  meta.zones[zid].trans++;
  monz.forEach((m) => { meta.best[m.id] = 0; });
  toast(G, ZONE_BY_ID[zid].nom.toUpperCase() + " — TRANSCENDANCE niveau " + meta.zones[zid].trans, "#c59bff");
  const ad = ARMES_T[zid];
  if (ad) {
    meta.equip.armeT = armeTEquipee(meta);
    const txt = ad.nom + " " + rome(meta.zones[zid].trans) + (meta.zones[zid].trans > 1 ? " — l'arme se renforce" : " — arme de Transcendance forgée");
    toast(G, txt, ad.col); log(G, txt, ad.col);
  }
  sfx("boss", meta.opts.sfx); G.saveNow = true;
}
/* ============================================================
   RENAISSANCE (v0.9.0) — le reset global, au-dessus de la Transcendance.
   ============================================================ */
const renaissanceVisible = (meta) => ((meta.cycle && (meta.cycle.maxZone || 0) >= 3) || (meta.origine && meta.origine.ren > 0));
const renaissanceDispo = (meta) => !!(meta.cycle && ((meta.cycle.maxZone || 0) >= 4 || meta.cycle.gardiens[ZONES[3].id]));
/* Calcule les Éclats d'Origine du cycle en cours, avec détail des sources. */
function calcEclats(G) {
  const meta = G.meta, cy = meta.cycle, o = meta.origine;
  const det = [];
  const add = (nom, v) => { v = Math.floor(v); if (v > 0) det.push([nom, v]); return Math.max(0, v); };
  let t = 0;
  const mz = (cy.maxZone || 0) + 1;
  t += add("Zones atteintes (" + mz + ")", mz * mz * 2);
  t += add("Niveau global max (" + (cy.maxNiv || 1) + ")", (cy.maxNiv || 1) * 0.8);
  const gd = Object.values(cy.gardiens || {});
  t += add("Gardiens vaincus (" + gd.length + ")", gd.reduce((a, b) => a + (b >= 2 ? 9 : 6), 0));
  const zt = ZONES.filter((z) => ((meta.zones[z.id] || {}).trans || 0) >= 1).length;
  const st = ZONES.reduce((a, z) => a + ((meta.zones[z.id] || {}).trans || 0), 0);
  t += add("Zones transcendées (" + zt + ")", zt * 10 + st * 5);
  let mait = 0, tiersTot = 0;
  MONSTRES.forEach((m) => { const k = meta.best[m.id] || 0; const r = reqMult(meta, m.zone); tiersTot += tierOf(m, k, r); if (estMaitrise(m, k, r)) mait++; });
  t += add("Monstres maîtrisés (" + mait + ")", mait * 2);
  t += add("Bestiaire (paliers)", tiersTot / 5);
  t += add("Armes de Transcendance", st * 4);
  t += add("Meilleure rareté trouvée", (cy.bestRar || 0) * (cy.bestRar || 0));
  let eqScore = 0; for (const k in meta.equip) if (meta.equip[k]) eqScore += scoreItem(meta.equip[k]);
  t += add("Puissance d'équipement", Math.sqrt(eqScore) / 4);
  t += add("Monstres tués (" + fmt(cy.kills || 0) + ")", Math.sqrt(cy.kills || 0));
  let mult = 1;
  (o.sermentsActifs || []).forEach((sid) => { const s = SERMENT_BY_ID[sid]; if (s) mult *= s.eclatsM; });
  const b = bonusOrigine(meta);
  mult *= 1 + (b.eclatsP || 0) / 100;
  return { total: Math.floor(t * mult), det, mult: Math.round(mult * 100) / 100, brut: Math.floor(t) };
}
function performRenaissance(G) {
  const meta = G.meta, o = meta.origine;
  if (!renaissanceDispo(meta)) return;
  const calc = calcEclats(G);
  const b = bonusOrigine(meta);
  o.bestZone = Math.max(o.bestZone || 0, (meta.cycle.maxZone || 0) + 1);
  o.bestNiv = Math.max(o.bestNiv || 0, meta.cycle.maxNiv || 0);
  o.meilleurGain = Math.max(o.meilleurGain || 0, calc.total);
  o.ren++;
  o.eclats += calc.total; o.eclatsTot += calc.total;
  /* — reset du cycle — */
  GAUGES.forEach((g) => {
    const gs = meta.gauges[g.id];
    const garde = Math.min(0.5, (b.gardeJauges || 0) / 100);
    gs.total = Math.floor(gs.total * garde);
    gs.applied = tiersFromTotal(g, gs.total);
  });
  meta.tokens = 0;
  for (const k in meta.stances) { meta.stances[k].niv = 1; meta.stances[k].evo = 0; }
  for (const k in meta.best) meta.best[k] = 0;
  if ((b.killsVirt || 0) > 0) MONSTRES.forEach((m) => { meta.best[m.id] = Math.floor(b.killsVirt); });
  ZONES.forEach((z) => { meta.zones[z.id].trans = 0; });
  for (const k in meta.equip) meta.equip[k] = null;
  meta.inv = [];
  meta.ensembles = [];
  meta.ferraille = 0;
  meta.essence = 0;
  meta.armeTChoix = null;
  meta.cycle = { maxZone: 0, maxNiv: 1, gardiens: {}, kills: 0, bestRar: 0 };
  o.echoChoix = generateEchoOptions(meta);
  G.run = runInitiale();
  G.floats = []; G.log = [];
  toast(G, "☀ RENAISSANCE " + o.ren + " — +" + fmt(calc.total) + " ❖ Éclats d'Origine", "#ffe08a");
  log(G, "Le monde se reforme. Renaissance n°" + o.ren + " · +" + fmt(calc.total) + " ❖", "#ffe08a");
  sfx("boss", meta.opts.sfx);
  G.saveNow = true;
}

function choisirArmeT(G, zid) {
  const meta = G.meta;
  if (!ARMES_T[zid] || (meta.zones[zid] || {}).trans < 1) return;
  meta.armeTChoix = zid;
  meta.equip.armeT = armeTEquipee(meta);
  sfx("equip", meta.opts.sfx); G.saveNow = true;
}
function changerZone(G, dir) {
  const run = G.run;
  if (run.over) return;
  const cible = run.zoneIdx + dir;
  if (cible < 0 || cible > run.debloque || cible >= ZONES.length) return;
  run.nivZone[run.zoneIdx] = run.niveau;
  run.zoneIdx = cible;
  run.niveau = run.nivZone[cible] || 1;
  run.kills = 0; run.mon = null; run.mG = 0; run.hG = 0; run.spawnT = BAL.spawn;
  toast(G, ZONES[cible].nom + " — niveau " + run.niveau, ZONES[cible].col);
  sfx("equip", G.meta.opts.sfx);
}
function relancer(G) {
  const stance = G.run.stance;
  G.run = runInitiale();
  G.run.stance = stance;
  G.floats = []; G.saveNow = true;
}

/* ---------- (dé)sérialisation ---------- */
function versSave(G) {
  const r = G.run;
  return { v: 2, meta: G.meta, run: r.over ? null : { zoneIdx: r.zoneIdx, niveau: r.niveau, nivZone: r.nivZone, debloque: r.debloque, kills: r.kills, stance: r.stance, lvlAtk: r.lvlAtk, lvlHp: r.lvlHp, gold: r.gold, tokensPend: r.tokensPend, hp: r.hp, stats: r.stats, essences: r.essences || [] } };
}
function depuisSave(d) {
  const meta = metaInitiale();
  if (d && d.meta) {
    Object.assign(meta.vie, d.meta.vie || {});
    Object.assign(meta.opts, d.meta.opts || {});
    for (const z of ZONES) if (d.meta.zones && d.meta.zones[z.id]) Object.assign(meta.zones[z.id], d.meta.zones[z.id]);
    if (d.meta.zone && typeof d.meta.zone.trans === "number") meta.zones.foret.trans = Math.max(meta.zones.foret.trans, d.meta.zone.trans);
    meta.tokens = d.meta.tokens || 0;
    meta.inv = Array.isArray(d.meta.inv) ? d.meta.inv : [];
    for (const k in meta.gauges) if (d.meta.gauges && d.meta.gauges[k]) Object.assign(meta.gauges[k], d.meta.gauges[k]);
    for (const k in meta.stances) if (d.meta.stances && d.meta.stances[k]) Object.assign(meta.stances[k], d.meta.stances[k]);
    for (const k in meta.best) if (d.meta.best && typeof d.meta.best[k] === "number") meta.best[k] = d.meta.best[k];
    for (const k in meta.equip) if (d.meta.equip && d.meta.equip[k]) meta.equip[k] = d.meta.equip[k];
    meta.versionVue = typeof d.meta.versionVue === "string" ? d.meta.versionVue : "0.3.0";
    if (d.meta.recy) {
      meta.recy.on = !!d.meta.recy.on;
      meta.recy.nivMax = d.meta.recy.nivMax || 0;
      Object.assign(meta.recy.rars, d.meta.recy.rars || {});
      Object.assign(meta.recy.fams, d.meta.recy.fams || {});
    }
    meta.armeTChoix = typeof d.meta.armeTChoix === "string" ? d.meta.armeTChoix : null;
    meta.ferraille = d.meta.ferraille || 0;
    meta.essence = d.meta.essence || 0;
    meta.ensembles = Array.isArray(d.meta.ensembles) ? d.meta.ensembles : [];
    meta.grpEns = Array.isArray(d.meta.grpEns) && d.meta.grpEns.length ? d.meta.grpEns : ["Général"];
    if (d.meta.prios) {
      meta.prios.ordres = Array.isArray(d.meta.prios.ordres) ? d.meta.prios.ordres : [];
      meta.prios.list = Array.isArray(d.meta.prios.list) ? d.meta.prios.list : [];
      meta.prios.actif = d.meta.prios.actif || null;
    }
    /* v0.9.0 — migration Origine/cycle, tolérante aux vieilles saves */
    if (d.meta.origine) {
      const o = d.meta.origine;
      ["ren", "eclats", "eclatsTot", "eclatsDep", "meilleurGain", "bestZone", "bestNiv"].forEach((k) => { if (typeof o[k] === "number") meta.origine[k] = o[k]; });
      if (o.arbre && typeof o.arbre === "object") meta.origine.arbre = o.arbre;
      if (Array.isArray(o.echos)) meta.origine.echos = o.echos;
      if (Array.isArray(o.echosEq)) meta.origine.echosEq = o.echosEq;
      if (Array.isArray(o.echoChoix)) meta.origine.echoChoix = o.echoChoix;
      if (Array.isArray(o.sermentsActifs)) meta.origine.sermentsActifs = o.sermentsActifs;
      if (o.altSel && typeof o.altSel === "object") meta.origine.altSel = o.altSel;
    }
    if (d.meta.cycle && typeof d.meta.cycle === "object") Object.assign(meta.cycle, d.meta.cycle);
    if (!meta.cycle.gardiens || typeof meta.cycle.gardiens !== "object") meta.cycle.gardiens = {};
    /* v0.5.0 : les armes de Transcendance ne sont plus des drops — on purge
       les anciennes de l'inventaire, l'arme équipée est re-dérivée plus bas. */
    meta.inv = meta.inv.filter((it) => it.slot !== "armeT");
    let mx = 0; meta.inv.forEach((i) => { mx = Math.max(mx, typeof i.id === "number" ? i.id : 0); });
    for (const k in meta.equip) if (meta.equip[k]) mx = Math.max(mx, typeof meta.equip[k].id === "number" ? meta.equip[k].id : 0);
    meta.ensembles.forEach((e) => { mx = Math.max(mx, typeof e.id === "number" ? e.id : 0); });
    meta.prios.list.forEach((p) => { mx = Math.max(mx, typeof p.id === "number" ? p.id : 0); });
    meta.origine.echos.forEach((e) => { mx = Math.max(mx, typeof e.id === "number" ? e.id : 0); });
    (meta.origine.echoChoix || []).forEach((e) => { mx = Math.max(mx, typeof e.id === "number" ? e.id : 0); });
    UID = mx + 1;
    meta.equip.armeT = armeTEquipee(meta);
  }
  const run = runInitiale();
  if (d && d.run) {
    Object.assign(run, d.run, { mon: null, spawnT: BAL.spawn, hG: 0, mG: 0, over: false, morte: false, gains: null });
    if (typeof d.run.tranche === "number" && typeof d.run.zoneIdx !== "number") {
      run.zoneIdx = Math.min(ZONES.length - 1, Math.floor((d.run.tranche - 1) / 10));
      run.niveau = ((d.run.tranche - 1) % 10) + 1;
      run.debloque = run.zoneIdx;
      delete run.tranche;
    }
    if (!Array.isArray(run.essences)) run.essences = [];
    if (!Array.isArray(run.nivZone) || run.nivZone.length !== ZONES.length) run.nivZone = ZONES.map(() => 1);
    run.nivZone[run.zoneIdx] = run.niveau;
    if (typeof run.debloque !== "number") run.debloque = run.zoneIdx || 0;
  }
  return { meta, run };
}

/* ============================================================
   COMPOSANTS UI
   ============================================================ */
function Spr({ id, scale = 4, flip, cls = "", style, silhouette }) {
  const ref = useRef(null);
  useEffect(() => {
    const spr = SPR[id] || ICO[id];
    if (!spr || !ref.current) return;
    const g = spr.g, h = g.length, w = g[0].length;
    const c = ref.current; c.width = w; c.height = h;
    const ctx = c.getContext("2d"); ctx.clearRect(0, 0, w, h);
    for (let y = 0; y < h; y++) for (let x = 0; x < g[y].length; x++) {
      const col = spr.p[g[y][x]];
      if (col) { ctx.fillStyle = col; ctx.fillRect(x, y, 1, 1); }
    }
  }, [id]);
  const spr = SPR[id] || ICO[id];
  const w = spr ? spr.g[0].length : 16, h = spr ? spr.g.length : 16;
  return <canvas ref={ref} className={"px " + cls} style={{ width: w * scale, height: h * scale, imageRendering: "pixelated", filter: silhouette ? "brightness(0) opacity(0.8)" : "none", transform: flip ? "scaleX(-1)" : "none", ...style }} />;
}
function Bar({ v, max, col, h = 14, txt, glow }) {
  const p = clamp(max > 0 ? (v / max) * 100 : 0, 0, 100);
  return (
    <div className="bar" style={{ height: h, boxShadow: glow ? "0 0 8px " + col : "none" }}>
      <div className="barfill" style={{ width: p + "%", background: col }} />
      {txt ? <span className="bartxt">{txt}</span> : null}
    </div>
  );
}
function Piece({ mag, taille = 15 }) {
  const c = PIECES[Math.min(mag, PIECES.length - 1)].col;
  return <i className="piece" title={PIECES[Math.min(mag, PIECES.length - 1)].nom} style={{ width: taille, height: taille, background: "radial-gradient(circle at 34% 28%, rgba(255,255,255,.85), " + c + " 52%, " + c + ")", borderColor: c }} />;
}
function Monnaie({ v }) {
  v = Math.floor(Math.max(0, v));
  let mag = 0; while (mag < PIECES.length - 1 && v >= Math.pow(100, mag + 1)) mag++;
  const p = Math.pow(100, mag);
  const top = Math.floor(v / p);
  const rem = mag > 0 ? Math.floor((v % p) / (p / 100)) : 0;
  return (
    <span className="monnaie" title={top + " " + PIECES[mag].nom + (rem > 0 ? " · " + rem + " " + PIECES[mag - 1].nom : "")}>
      <b>{top}</b><Piece mag={mag} />
      {rem > 0 ? <><b>{rem}</b><Piece mag={mag - 1} taille={12} /></> : null}
    </span>
  );
}
function Pips({ kills }) {
  return (
    <div className="pips">
      {Array.from({ length: 10 }).map((_, i) => (
        <span key={i} className={"pip" + (i < kills ? " ok" : "") + (i === kills ? " cur" : "") + (i === 9 ? " boss" : "")}>{i === 9 ? "☠" : ""}</span>
      ))}
    </div>
  );
}

/* ---------- scène de combat ---------- */
function mulberry(seed) { let a = seed >>> 0; return function () { a = (a + 0x6D2B79F5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }
const FONDS = [
  { hb: [168, 208, 166], hg: [70, 42, 58], blobs: ["#245c33", "#2f7040", "#3b8a4d", "#4aa054"], tA: "#4a3a28", tB: "#5e4a32", canop: true, solA: "#4da653", solB: "#46994c", ch: "#b39066", chC: "#c4a878", herbe: "#3d8a44", deco: ["#ff9ec2", "#ffd45e", "#ffffff", "#c59bff", "#ff8a8a"], ray: 0.12 },
  { hb: [226, 198, 148], hg: [42, 40, 34], blobs: ["#c8a45e", "#b8945a", "#d8b878", "#e0c890"], tA: "#3f7a3f", tB: "#4f9a4f", canop: false, solA: "#d8bc84", solB: "#d0b478", ch: "#b89454", chC: "#c8a868", herbe: "#c0a05e", deco: ["#8a7a5e", "#ffffff", "#e86a5a", "#5a8a5a", "#ffd45e"], ray: 0.09 },
  { hb: [64, 128, 178], hg: [55, 65, 60], blobs: ["#1f6a7a", "#2a8a8a", "#e86a8a", "#3aa89a"], tA: "#2a7a4a", tB: "#3a9a5a", canop: false, solA: "#c8b890", solB: "#c0b088", ch: "#b0a078", chC: "#c4b48c", herbe: "#2a8a7a", deco: ["#ffd45e", "#ff9ec2", "#ffffff", "#5fffe0", "#e86a8a"], ray: 0.2 },
];

/* ============================================================
   ZONES 4 → 15 — générées data-driven (v0.9.0)
   Chaque zone réutilise les grilles de sprites d'une zone source,
   recolorées vers sa teinte (sprites dédiés lors d'une passe de polish).
   11 monstres par zone : 8 normaux, 2 mini-boss, 1 Gardien.
   ============================================================ */
const ZONES_EXT = [
  { id: "montagne", nom: "Montagne", col: "#cbb69d", tint: "#8d8d9c", src: "foret",
    theme: "Les cimes où l'air se raréfie et où la pierre se souvient.",
    noms: ["Bouquetin Têtu", "Aigle Royal", "Éboulis Vivant", "Yéti Bougon", "Harpie Criarde", "Lynx des Neiges", "Chèvre Possédée", "Mouflon Blindé", "Golem de Granit", "Wyverne des Cimes", "Colosse des Cimes"] },
  { id: "plaines", nom: "Plaines Orageuses", col: "#a8d8ff", tint: "#5a7ac8", src: "desert",
    theme: "Des herbes hautes fouettées par une tempête qui ne finit jamais.",
    noms: ["Zébu Foudroyé", "Rapace Voltaïque", "Herbe-qui-Mord", "Taureau Tonnerre", "Feu Follet", "Coyote Crépitant", "Épouvantail Frappé", "Élémentaire d'Orage", "Golem de Foudre", "Nuée Hurlante", "Seigneur des Tempêtes"] },
  { id: "glacier", nom: "Glacier", col: "#bfe8ff", tint: "#7ab8e8", src: "ocean",
    theme: "Un froid si ancien qu'il a sa propre volonté.",
    noms: ["Pingouin Batailleur", "Loup Polaire", "Stalactite Animée", "Morse Grognon", "Spectre Gelé", "Renard Arctique", "Élémentaire de Givre", "Ours Ronchon", "Golem de Glace", "Wendigo Affamé", "Cœur du Blizzard"] },
  { id: "volcan", nom: "Volcan", col: "#ff7a45", tint: "#c8402a", src: "foret",
    theme: "La montagne qui gronde. Tout y brûle, même les regrets.",
    noms: ["Salamandre Ardente", "Chauve-souris de Cendre", "Magma Rampant", "Diablotin Rieur", "Scorie Vivante", "Cerbère Nain", "Phénix Déplumé", "Élémentaire de Lave", "Golem d'Obsidienne", "Éfrit Colérique", "Titan Magmatique"] },
  { id: "marais", nom: "Marais Putride", col: "#9fb85a", tint: "#5a6e2a", src: "desert",
    theme: "Chaque pas s'enfonce. Chaque bulle qui éclate raconte une fin.",
    noms: ["Sangsue Géante", "Crapaud Bilieux", "Moustique Obèse", "Tentacule Vaseux", "Feu Putride", "Alligator Vétéran", "Champignon Vénéneux", "Limon Affamé", "Golem de Tourbe", "Hydre Naine", "Matriarche du Bourbier"] },
  { id: "ruines", nom: "Ruines Anciennes", col: "#d8cfa8", tint: "#9a8a68", src: "ocean",
    theme: "Une civilisation entière dort ici. Elle a le sommeil léger.",
    noms: ["Squelette Poussiéreux", "Gargouille Fissurée", "Scarabée Runique", "Spectre Érudit", "Armure Hantée", "Serpent de Pierre", "Scribe Maudit", "Statue Pleureuse", "Golem d'Albâtre", "Sphinx Déchu", "Roi Oublié"] },
  { id: "citadelle", nom: "Citadelle Astrale", col: "#c59bff", tint: "#7a5ac8", src: "desert",
    theme: "Une forteresse suspendue entre les étoiles et l'oubli.",
    noms: ["Sentinelle Astrale", "Chérubin Déchu", "Vitrail Animé", "Astre Mineur", "Templier Spectral", "Comète Naine", "Oracle Aveugle", "Griffon Stellaire", "Golem Céleste", "Séraphin Terni", "Archonte Astral"] },
  { id: "jungle", nom: "Jungle Primordiale", col: "#45d06a", tint: "#1e8a3e", src: "foret",
    theme: "La vie à l'état brut. Elle pousse, elle grimpe, elle mord.",
    noms: ["Panthère Ombreuse", "Perroquet Braillard", "Liane Étrangleuse", "Singe Hurleur", "Grenouille Fluo", "Fourmi Soldate", "Plante Carnivore", "Jaguar Tacheté", "Golem de Lianes", "Basilic Émeraude", "Ancien de la Canopée"] },
  { id: "abysses", nom: "Abysses", col: "#7a6aff", tint: "#3a2a8a", src: "ocean",
    theme: "Là où la lumière renonce, autre chose a appris à voir.",
    noms: ["Poisson-Lanterne", "Ver Aveugle", "Ombre Rampante", "Crabe Colossal", "Anguille Spectrale", "Pieuvre d'Encre", "Horreur Naissante", "Méduse Noire", "Golem Abyssal", "Léviathan Larvaire", "Dévoreur des Profondeurs"] },
  { id: "verre", nom: "Désert de Verre", col: "#e8f4ff", tint: "#a8c8e8", src: "desert",
    theme: "Un ancien désert fondu en miroir. Le soleil s'y coupe lui-même.",
    noms: ["Éclat Dansant", "Scorpion de Verre", "Rose des Sables", "Serpent Prismatique", "Mirage Solide", "Vortex de Silice", "Dune Chantante", "Reflet Hostile", "Golem de Cristal", "Djinn de Quartz", "Prisme Éternel"] },
  { id: "ciel", nom: "Ciel Fragmenté", col: "#8ad4ff", tint: "#4a8ac8", src: "ocean",
    theme: "Des îles brisées dérivent dans un ciel sans bas ni haut.",
    noms: ["Nuage Mordeur", "Îlot Errant", "Zéphyr Sauvage", "Raie des Vents", "Moine Flottant", "Fragment Chanteur", "Aigle de Foudre", "Astre Perdu", "Golem d'Azur", "Roc Millénaire", "Gardien du Firmament"] },
  { id: "coeur", nom: "Cœur du Monde", col: "#ff5fd0", tint: "#c82a8a", src: "foret",
    theme: "Le battement originel. Tout ce qui existe en descend.",
    noms: ["Pulsation", "Écho Errant", "Souvenir Brisé", "Sentinelle du Noyau", "Flamme Originelle", "Racine du Monde", "Larme de Gaïa", "Avatar Mineur", "Golem Primordial", "Aube Dévorante", "Cœur Battant du Monde"] },
];
const ZONE_EXT_BY_ID = Object.fromEntries(ZONES_EXT.map((z) => [z.id, z]));
function fondTeinte(ze) {
  const n = parseInt(ze.col.slice(1), 16);
  const c = [(n >> 16) & 255, (n >> 8) & 255, n & 255];
  const sh = (h, k) => teinte(h, "#000000", k), li = (h, k) => teinte(h, "#ffffff", k);
  return {
    hb: [Math.min(215, c[0] * 0.72 + 30) | 0, Math.min(215, c[1] * 0.72 + 30) | 0, Math.min(215, c[2] * 0.72 + 30) | 0],
    hg: [42, 42, 48],
    blobs: [sh(ze.col, 0.55), sh(ze.col, 0.4), sh(ze.col, 0.25), li(ze.col, 0.12)],
    tA: sh(ze.tint, 0.45), tB: sh(ze.tint, 0.25), canop: false,
    solA: sh(ze.col, 0.35), solB: sh(ze.col, 0.42), ch: sh(ze.tint, 0.2), chC: li(ze.tint, 0.12), herbe: sh(ze.col, 0.3),
    deco: [li(ze.col, 0.5), "#ffffff", ze.tint, li(ze.col, 0.2), "#ffd45e"], ray: 0.12,
  };
}
(function genererZonesExt() {
  ZONES_EXT.forEach((ze) => {
    ZONES.push({ id: ze.id, nom: ze.nom, col: ze.col });
    const srcMons = MONSTRES.filter((m) => m.zone === ze.src);
    srcMons.forEach((sm, i) => {
      const nid = ze.id + "_" + i;
      const base = SPR[sm.spr];
      const p2 = {}; for (const key in base.p) p2[key] = teinte(base.p[key], ze.tint, 0.45);
      SPR[nid] = { p: p2, g: base.g };
      MONSTRES.push({
        id: nid, zone: ze.id, nom: ze.noms[i], type: sm.type, spr: nid,
        hpM: sm.hpM, atkM: sm.atkM, asM: sm.asM, goldM: sm.goldM, tiers: sm.tiers.slice(),
        desc: sm.type === "zone" ? ze.noms[i] + " — le Gardien de " + ze.nom + ". Le vaincre ouvre la suite du continent." : ze.noms[i] + ". " + ze.theme,
      });
    });
    FONDS.push(fondTeinte(ze));
  });
  Object.assign(MON_BY_ID, Object.fromEntries(MONSTRES.map((m) => [m.id, m])));
  Object.assign(ZONE_BY_ID, Object.fromEntries(ZONES.map((z) => [z.id, z])));
})();

/* ============================================================
   SERMENTS (v0.9.0) — modificateurs optionnels de cycle.
   Malus immédiats, bonus + multiplicateur d'Éclats à la Renaissance.
   Débloqués via la branche Destin (node sermUnlock) sauf mention.
   ============================================================ */
const SERMENTS = [
  { id: "pauvrete", nom: "Serment de Pauvreté", ico: "🕳", desc: "La boutique coûte bien plus cher.",
    malus: { shopPlus: 60 }, bonus: {}, eclatsM: 1.35, echoRar: 0 },
  { id: "fragilite", nom: "Serment de Fragilité", ico: "🥀", desc: "PV max réduits, mais l'âme s'aiguise.",
    malus: { hpMoins: 40 }, bonus: { "gJ.puissance": 30, "gJ.celerite": 30 }, eclatsM: 1.3, echoRar: 0 },
  { id: "chasseur", nom: "Serment du Chasseur", ico: "🏹", desc: "Les boss rapportent moins, le menu fretin bien plus.",
    malus: { bossGold: 50 }, bonus: { vsMonP: 25, orMaitrise: 2 }, eclatsM: 1.15, echoRar: 0 },
  { id: "regicide", nom: "Serment du Régicide", ico: "👑", desc: "Les monstres normaux rapportent moins, les Gardiens deviennent des mines d'or.",
    malus: { mobGold: 40 }, bonus: { gainGardien: 60, "gJ.domination": 40 }, eclatsM: 1.2, echoRar: 0 },
  { id: "silence", nom: "Serment du Silence", ico: "🤐", desc: "Les stances se taisent : aucun de leurs bonus ne s'applique.",
    malus: { stancesOff: 1 }, bonus: {}, eclatsM: 1.5, echoRar: 0 },
  { id: "vide", nom: "Serment du Vide", ico: "🌑", desc: "L'équipement se fait rare, mais les Échos répondent plus fort.",
    malus: { dropMoins: 60 }, bonus: {}, eclatsM: 1.2, echoRar: 1 },
  { id: "cendre", nom: "Serment de Cendre", ico: "🔥", desc: "Les ennemis frappent plus fort. L'Endurance s'en souviendra.",
    malus: { degatsPlus: 50 }, bonus: { "gJ.endurance": 50 }, eclatsM: 1.3, echoRar: 0 },
  { id: "exil", nom: "Serment d'Exil", ico: "🚪", desc: "Les zones 1-3 rapportent moins d'or ; les zones 6+ bien davantage.",
    malus: { exilEarly: 50 }, bonus: { exilLoin: 80 }, eclatsM: 1.25, echoRar: 0 },
];
const SERMENT_BY_ID = Object.fromEntries(SERMENTS.map((s) => [s.id, s]));
const MALUS_NEUTRE = { shopPlus: 0, hpMoins: 0, bossGold: 0, mobGold: 0, mobAtk: 1, stancesOff: 0, dropMoins: 0, degatsPlus: 0, exilEarly: 0 };
/* Malus agrégés des serments actifs (réduits par le node Destin sermMalus). */
function malusSerments(meta, sermMalusPct) {
  const m = { ...MALUS_NEUTRE };
  const red = 1 - Math.min(0.6, (sermMalusPct || 0) / 100);
  ((meta.origine && meta.origine.sermentsActifs) || []).forEach((sid) => {
    const s = SERMENT_BY_ID[sid]; if (!s) return;
    for (const k in s.malus) {
      if (k === "stancesOff") m.stancesOff = 1;
      else m[k] = (m[k] || 0) + s.malus[k] * red;
    }
  });
  m.mobAtk = 1; /* réservé aux futures altérations/serments */
  return m;
}

/* ============================================================
   ZONES ALTÉRÉES (v0.9.0) — variantes plus dures et plus rentables.
   Débloquées après la 1re Renaissance ou via le node Destin altUnlock.
   Structure prête pour les zones 6-15.
   ============================================================ */
const ALTERATIONS = [
  { id: "alt_foret", zoneId: "foret", nom: "Forêt Altérée", desc: "La sève noire rend tout plus coriace.",
    mob: { hp: 2.2, atk: 1.3, as: 1 }, rew: { gold: 1.6, best: 2, gJEndu: 40 } },
  { id: "alt_desert", zoneId: "desert", nom: "Désert Brûlé", desc: "Le sable fond ; tout y est plus rapide.",
    mob: { hp: 1.5, atk: 1.4, as: 1.35 }, rew: { gold: 1.7, gJPuis: 30, gJCrit: 30 } },
  { id: "alt_ocean", zoneId: "ocean", nom: "Océan Abyssal", desc: "Les boss y sont gonflés d'une eau ancienne.",
    mob: { hp: 1.6, atk: 1.3, as: 1, bossHp: 2.5 }, rew: { gold: 1.6, essence: 100, gJDomi: 40 } },
  { id: "alt_montagne", zoneId: "montagne", nom: "Montagne Fracturée", desc: "La roche vive blinde les créatures.",
    mob: { hp: 2.6, atk: 1.25, as: 0.9 }, rew: { gold: 1.5, ferraille: 80 } },
  { id: "alt_plaines", zoneId: "plaines", nom: "Plaines Déchaînées", desc: "L'orage ne tombe plus : il chasse.",
    mob: { hp: 1.6, atk: 1.5, as: 1.4 }, rew: { gold: 1.8, gJCele: 40, echoRar: 1 } },
];
const ALT_BY_ZONE = Object.fromEntries(ALTERATIONS.map((a) => [a.zoneId, a]));
const ALT_NEUTRE = { hp: 1, atk: 1, as: 1, gold: 1, bossHp: 0 };
function altActive(meta, zid) {
  return !!(meta.origine && meta.origine.altSel && meta.origine.altSel[zid] && ALT_BY_ZONE[zid]);
}
const altsDebloquees = (meta) => !!((meta.origine && meta.origine.ren >= 1) || bonusOrigine(meta).altUnlock > 0);
function basculerAlt(G, zid) {
  const meta = G.meta;
  if (!altsDebloquees(meta) || !ALT_BY_ZONE[zid]) return;
  meta.origine.altSel[zid] = !meta.origine.altSel[zid];
  const a = ALT_BY_ZONE[zid];
  toast(G, meta.origine.altSel[zid] ? a.nom + " activée — danger et récompenses accrus" : ZONE_BY_ID[zid].nom + " revient à la normale", meta.origine.altSel[zid] ? "#ff6b6b" : "#ccd6f4");
  sfx("equip", meta.opts.sfx); G.saveNow = true;
}
const sermentsDebloques = (meta) => bonusOrigine(meta).sermUnlock > 0;
const sermentsMax = (meta) => 2 + Math.min(3, Math.floor(bonusOrigine(meta).sermMax || 0));
function basculerSerment(G, sid) {
  const o = G.meta.origine;
  if (!sermentsDebloques(G.meta)) { toast(G, "Les Serments se débloquent via la branche Destin de l'Arbre d'Origine", "#ff5fd0"); return; }
  if (o.sermentsActifs.includes(sid)) {
    o.sermentsActifs = o.sermentsActifs.filter((x) => x !== sid);
    toast(G, SERMENT_BY_ID[sid].nom + " rompu", "#ccd6f4");
  } else {
    if (o.sermentsActifs.length >= sermentsMax(G.meta)) { toast(G, "Maximum de " + sermentsMax(G.meta) + " Serments actifs", "#ffd45e"); return; }
    o.sermentsActifs.push(sid);
    toast(G, "⚠ " + SERMENT_BY_ID[sid].nom + " prêté — le cycle sera plus dur, la Renaissance plus riche", "#ff6b6b");
  }
  sfx("boss", G.meta.opts.sfx); G.saveNow = true;
}
function altMods(meta, zid) {
  if (!altActive(meta, zid)) return ALT_NEUTRE;
  const a = ALT_BY_ZONE[zid];
  return { hp: a.mob.hp, atk: a.mob.atk, as: a.mob.as, gold: a.rew.gold, bossHp: a.mob.bossHp || 0 };
}

/* ============================================================
   ARBRE D'ORIGINE (v0.9.0) — 5 branches × 30 nodes, data-driven.
   Chaque node : [nom, description, effet, valeur/rang, rangs max, palier 0-3].
   Chaîne linéaire par branche (le node précédent est le prérequis).
   ============================================================ */
const BRANCHES = [
  { id: "corps", nom: "Corps", ico: "💪", col: "#ff9d5c", theme: "Accélérer chaque début de cycle." },
  { id: "ame", nom: "Âme", ico: "🔮", col: "#c59bff", theme: "Nourrir les jauges méta." },
  { id: "memoire", nom: "Mémoire", ico: "📖", col: "#6ad4ff", theme: "Bestiaire, maîtrise et zones." },
  { id: "heritage", nom: "Héritage", ico: "⚔", col: "#ffd45e", theme: "Transcendance et armes légendaires." },
  { id: "destin", nom: "Destin", ico: "✨", col: "#ff5fd0", theme: "Échos, Serments et règles du endgame." },
];
const NODE_COUT_T = [12, 45, 180, 520];
/* [nom, desc, effet, val/rang, max, palier] */
const NODES_DEF = {
  corps: [
    ["Vigueur", "+{v} ATQ de départ", "atkDep", 3, 5, 0], ["Robustesse", "+{v} PV de départ", "hpDep", 25, 5, 0],
    ["Carapace", "+{v} DÉF de départ", "defDep", 2, 5, 0], ["Réflexes", "+{v}% vitesse d'attaque", "asP", 2, 5, 0],
    ["Marchandage", "−{v}% coût boutique", "coutShop", 2, 5, 0], ["Poigne", "+{v} ATQ de départ", "atkDep", 8, 3, 0],
    ["Souffle", "+{v} PV de départ", "hpDep", 60, 3, 0], ["Économie", "−{v}% coût boutique", "coutShop", 3, 3, 0],
    ["Entraînement", "+{v}% efficacité des achats boutique", "effShop", 5, 3, 0], ["Célérité mineure", "+{v}% vitesse d'attaque", "asP", 3, 3, 0],
    ["Force ancrée", "+{v} ATQ de départ", "atkDep", 25, 4, 1], ["Sang de titan", "+{v} PV de départ", "hpDep", 180, 4, 1],
    ["Peau de pierre", "+{v} DÉF de départ", "defDep", 8, 4, 1], ["Frénésie", "+{v}% vitesse d'attaque", "asP", 4, 4, 1],
    ["Négociant", "−{v}% coût boutique", "coutShop", 4, 3, 1], ["Maître d'armes", "+{v}% efficacité des achats boutique", "effShop", 10, 3, 1],
    ["Conditionnement", "+{v}% ATQ et PV globaux", "statsG", 3, 4, 1], ["Éveil", "+{v}% ATQ et PV globaux", "statsG", 5, 2, 1],
    ["Chasseur d'aube", "+{v}% dégâts dans les zones 1-3", "earlyZ", 15, 3, 1], ["Pas de géant", "+{v}% dégâts dans les zones 1-3", "earlyZ", 25, 2, 1],
    ["Colosse", "+{v}% ATQ et PV globaux", "statsG", 8, 3, 2], ["Arsenal inné", "+{v} ATQ de départ", "atkDep", 120, 3, 2],
    ["Rempart intérieur", "+{v} PV de départ", "hpDep", 800, 3, 2], ["Impulsion", "+{v}% vitesse d'attaque", "asP", 8, 2, 2],
    ["Marché noir", "−{v}% coût boutique", "coutShop", 8, 2, 2],
    ["Titan", "+{v}% ATQ et PV globaux", "statsG", 15, 3, 3], ["Héros-né", "+{v} ATQ de départ", "atkDep", 600, 3, 3],
    ["Immortel précoce", "+{v} PV de départ", "hpDep", 4000, 3, 3], ["Tempête", "+{v}% vitesse d'attaque", "asP", 15, 2, 3],
    ["Seigneur marchand", "−{v}% coût boutique", "coutShop", 12, 1, 3],
  ],
  ame: [
    ["Braise", "+{v}% gain de Puissance", "gJ.puissance", 5, 5, 0], ["Cuirasse", "+{v}% gain d'Endurance", "gJ.endurance", 5, 5, 0],
    ["Pactole", "+{v}% gain de Fortune", "gJ.fortune", 5, 5, 0], ["Zéphyr intérieur", "+{v}% gain de Célérité", "gJ.celerite", 5, 5, 0],
    ["Œil aiguisé", "+{v}% gain de Critique", "gJ.precision", 5, 5, 0], ["Poigne royale", "+{v}% gain de Domination", "gJ.domination", 5, 5, 0],
    ["Faucheuse", "+{v}% gain d'Extermination", "gJ.extermination", 5, 5, 0], ["Flux", "+{v}% gain de toutes les jauges", "gTous", 2, 3, 0],
    ["Ancrage", "conserve {v}% des jauges à la Renaissance", "gardeJauges", 3, 4, 0], ["Persistance", "conserve {v}% des jauges à la Renaissance", "gardeJauges", 5, 2, 0],
    ["Braise ardente", "+{v}% gain de Puissance", "gJ.puissance", 12, 4, 1], ["Cuirasse épaisse", "+{v}% gain d'Endurance", "gJ.endurance", 12, 4, 1],
    ["Trésorerie", "+{v}% gain de Fortune", "gJ.fortune", 12, 4, 1], ["Bourrasque", "+{v}% gain de Célérité", "gJ.celerite", 12, 4, 1],
    ["Œil du faucon", "+{v}% gain de Critique", "gJ.precision", 12, 4, 1], ["Sceptre", "+{v}% gain de Domination", "gJ.domination", 12, 4, 1],
    ["Grande faux", "+{v}% gain d'Extermination", "gJ.extermination", 12, 4, 1], ["Flux majeur", "+{v}% gain de toutes les jauges", "gTous", 5, 3, 1],
    ["Résonance", "+{v}% jauges si 3 jauges ont atteint le palier 10", "seuilJ", 10, 2, 1], ["Torrent", "+{v}% gain de toutes les jauges", "gTous", 8, 1, 1],
    ["Éveil de l'âme", "+{v}% gain de toutes les jauges", "gTous", 12, 2, 2], ["Mémoire des jauges", "conserve {v}% des jauges à la Renaissance", "gardeJauges", 10, 2, 2],
    ["Résonance profonde", "+{v}% jauges si 3 jauges ont atteint le palier 10", "seuilJ", 20, 1, 2], ["Fortune de l'âme", "+{v}% gain de Fortune", "gJ.fortune", 30, 2, 2],
    ["Fureur de l'âme", "+{v}% gain de Puissance", "gJ.puissance", 30, 2, 2],
    ["Transcendance intérieure", "+{v}% gain de toutes les jauges", "gTous", 20, 2, 3], ["Continuité", "conserve {v}% des jauges à la Renaissance", "gardeJauges", 15, 1, 3],
    ["Harmonie", "+{v}% jauges si 3 jauges ont atteint le palier 10", "seuilJ", 35, 1, 3], ["Omniflux", "+{v}% gain de toutes les jauges", "gTous", 30, 1, 3],
    ["Âme éternelle", "conserve {v}% des jauges à la Renaissance", "gardeJauges", 20, 1, 3],
  ],
  memoire: [
    ["Souvenirs", "−{v}% seuils de maîtrise du bestiaire", "seuilMaitrise", 2, 5, 0], ["Instinct", "{v} kill(s) virtuels sur chaque monstre après Renaissance", "killsVirt", 1, 5, 0],
    ["Traqueur", "+{v}% d'or par monstre maîtrisé", "orMaitrise", 1, 5, 0], ["Prédateur", "+{v}% dégâts contre les monstres maîtrisés", "vsMaitrise", 3, 5, 0],
    ["Cartographe", "+{v}% dégâts contre les monstres normaux", "vsMonP", 2, 5, 0], ["Archives", "−{v}% seuils de maîtrise du bestiaire", "seuilMaitrise", 3, 3, 0],
    ["Réminiscence", "{v} kills virtuels après Renaissance", "killsVirt", 2, 3, 0], ["Butin familier", "+{v}% d'or par monstre maîtrisé", "orMaitrise", 2, 3, 0],
    ["Faiblesse connue", "+{v}% dégâts contre les monstres maîtrisés", "vsMaitrise", 5, 3, 0], ["Éclaireur", "+{v}% dégâts contre les monstres normaux", "vsMonP", 3, 3, 0],
    ["Mémoire vive", "−{v}% seuils de maîtrise", "seuilMaitrise", 4, 3, 1], ["Déjà-vu", "{v} kills virtuels après Renaissance", "killsVirt", 5, 3, 1],
    ["Collection", "+{v}% d'or par monstre maîtrisé", "orMaitrise", 3, 3, 1], ["Exécution", "+{v}% dégâts contre les maîtrisés", "vsMaitrise", 8, 3, 1],
    ["Vétéran", "+{v}% dégâts contre les monstres normaux", "vsMonP", 5, 3, 1], ["Sentier balisé", "+{v}% dégâts zones 1-3", "earlyZ", 20, 2, 1],
    ["Albums de chasse", "+{v}% d'or par monstre maîtrisé", "orMaitrise", 4, 2, 1], ["Terres connues", "+{v}% d'or dans les zones altérées", "altGold", 15, 2, 1],
    ["Rituel du retour", "{v} kills virtuels après Renaissance", "killsVirt", 8, 2, 1], ["Encyclopédie", "−{v}% seuils de maîtrise", "seuilMaitrise", 6, 2, 1],
    ["Omniscience mineure", "−{v}% seuils de maîtrise", "seuilMaitrise", 8, 2, 2], ["Réincarnation savante", "{v} kills virtuels après Renaissance", "killsVirt", 15, 2, 2],
    ["Trophées", "+{v}% d'or par monstre maîtrisé", "orMaitrise", 6, 2, 2], ["Chasseur parfait", "+{v}% dégâts contre les maîtrisés", "vsMaitrise", 15, 2, 2],
    ["Terres altérées", "+{v}% d'or dans les zones altérées", "altGold", 30, 2, 2],
    ["Mémoire du monde", "−{v}% seuils de maîtrise", "seuilMaitrise", 12, 1, 3], ["Vies antérieures", "{v} kills virtuels après Renaissance", "killsVirt", 40, 1, 3],
    ["Fortune du savant", "+{v}% d'or par monstre maîtrisé", "orMaitrise", 10, 1, 3], ["Némésis", "+{v}% dégâts contre les maîtrisés", "vsMaitrise", 25, 1, 3],
    ["Maître des variantes", "+{v}% d'or dans les zones altérées", "altGold", 50, 1, 3],
  ],
  heritage: [
    ["Écho des lames", "+{v}% stats des armes de Transcendance", "armeT", 4, 5, 0], ["Legs", "+{v}% stats des armes de Transcendance", "armeT", 6, 3, 0],
    ["Offrande", "+{v}% chance d'essence résiduelle double", "essenceB", 4, 5, 0], ["Tribut", "+{v}% récompenses des Gardiens", "gainGardien", 4, 5, 0],
    ["Trophée royal", "+{v}% chance d'un token de boss bonus", "tokensB", 5, 5, 0], ["Forge ancienne", "+{v}% ferraille", "ferrailleP", 4, 5, 0],
    ["Récupération", "+{v}% ferraille", "ferrailleP", 6, 3, 0], ["Sang des gardiens", "+{v}% récompenses des Gardiens", "gainGardien", 6, 3, 0],
    ["Résidu", "+{v}% chance d'essence double", "essenceB", 6, 3, 0], ["Armurier", "+{v}% stats des armes de Transcendance", "armeT", 8, 2, 0],
    ["Héritage vif", "+{v}% stats des armes de Transcendance", "armeT", 12, 3, 1], ["Pacte des zones", "+{v}% ATQ/PV par zone transcendée", "parZoneTrans", 2, 4, 1],
    ["Moisson d'essence", "+{v}% chance d'essence double", "essenceB", 10, 2, 1], ["Chasseur de rois", "+{v}% récompenses des Gardiens", "gainGardien", 10, 3, 1],
    ["Couronne", "+{v}% chance de token bonus", "tokensB", 10, 3, 1], ["Forge du legs", "+{v}% ferraille", "ferrailleP", 10, 3, 1],
    ["Signature", "+{v}% stats des armes de Transcendance", "armeT", 15, 2, 1], ["Semence de transcendance", "+{v}% ATQ/PV par zone transcendée", "parZoneTrans", 3, 2, 1],
    ["Saignée", "+{v}% récompenses des Gardiens", "gainGardien", 15, 2, 1], ["Double tribut", "+{v}% chance d'essence double", "essenceB", 15, 1, 1],
    ["Reliquat", "+{v}% stats des armes de Transcendance", "armeT", 25, 2, 2], ["Monde gravé", "+{v}% ATQ/PV par zone transcendée", "parZoneTrans", 5, 2, 2],
    ["Sève originelle", "+{v}% chance d'essence double", "essenceB", 25, 1, 2], ["Régicide né", "+{v}% récompenses des Gardiens", "gainGardien", 25, 2, 2],
    ["Diadème", "+{v}% chance de token bonus", "tokensB", 20, 2, 2],
    ["Arme éternelle", "+{v}% stats des armes de Transcendance", "armeT", 50, 1, 3], ["Continent intérieur", "+{v}% ATQ/PV par zone transcendée", "parZoneTrans", 8, 1, 3],
    ["Source d'essence", "+{v}% chance d'essence double", "essenceB", 40, 1, 3], ["Tombeur de gardiens", "+{v}% récompenses des Gardiens", "gainGardien", 50, 1, 3],
    ["Trésor des rois", "+{v}% chance de token bonus", "tokensB", 40, 1, 3],
  ],
  destin: [
    ["Regard du destin", "+{v} au tirage de rareté des Échos", "echoRarPts", 2, 5, 0], ["Écho murmuré", "+{v} niveau moyen des Échos", "echoNiv", 1, 5, 0],
    ["Étoile mineure", "+{v}% d'Éclats d'Origine", "eclatsP", 2, 5, 0], ["Aube magique", "+{v} au tirage (Écho Magique ou mieux)", "echoRarPts", 4, 2, 0],
    ["Main du destin", "+{v}% d'Éclats d'Origine", "eclatsP", 3, 3, 0], ["Serment scellé", "débloque les Serments", "sermUnlock", 1, 1, 0],
    ["Rite d'altération", "débloque les Zones altérées", "altUnlock", 1, 1, 0], ["Souffle du néant", "+{v} niveau moyen des Échos", "echoNiv", 2, 3, 0],
    ["Deuxième regard", "+{v} choix d'Écho proposé après Renaissance", "echoChoix", 1, 1, 0], ["Petite étoile", "+{v}% d'Éclats d'Origine", "eclatsP", 4, 2, 0],
    ["Chemin rare", "+{v} au tirage (Écho Rare ou mieux)", "echoRarPts", 6, 2, 1], ["Geste héroïque", "+{v} au tirage (Écho Héroïque ou mieux)", "echoRarPts", 8, 2, 1],
    ["Réceptacle", "+{v} slot d'Écho équipé", "echoSlots", 1, 1, 1], ["Volonté double", "+{v} Serment actif maximum", "sermMax", 1, 1, 1],
    ["Pacte adouci", "−{v}% malus des Serments", "sermMalus", 10, 3, 1], ["Pacte enrichi", "+{v}% bonus des Serments", "sermBonus", 10, 3, 1],
    ["Constellation", "+{v}% d'Éclats d'Origine", "eclatsP", 6, 3, 1], ["Écho affûté", "+{v} niveau moyen des Échos", "echoNiv", 3, 2, 1],
    ["Troisième regard", "+{v} choix d'Écho après Renaissance", "echoChoix", 1, 1, 1], ["Étoile filante", "+{v}% d'Éclats d'Origine", "eclatsP", 8, 2, 1],
    ["Élan épique", "+{v} au tirage (Écho Épique ou mieux)", "echoRarPts", 12, 2, 2], ["Second réceptacle", "+{v} slot d'Écho équipé", "echoSlots", 1, 1, 2],
    ["Volonté triple", "+{v} Serment actif maximum", "sermMax", 1, 1, 2], ["Pacte du vide", "+{v}% bonus des Serments", "sermBonus", 20, 2, 2],
    ["Supernova", "+{v}% d'Éclats d'Origine", "eclatsP", 12, 2, 2],
    ["Étincelle légendaire", "{v}% de chance qu'un Écho soit Légendaire ou mieux", "echoLeg", 3, 2, 3], ["Réceptacle ultime", "+{v} slot d'Écho équipé", "echoSlots", 1, 1, 3],
    ["Quatrième regard", "+{v} choix d'Écho après Renaissance", "echoChoix", 1, 1, 3], ["Serment-roi", "+{v} Serment actif maximum", "sermMax", 1, 1, 3],
    ["Cœur stellaire", "+{v}% d'Éclats d'Origine", "eclatsP", 20, 1, 3],
  ],
};
const NODES = [];
BRANCHES.forEach((br) => {
  let prev = null, posT = [0, 0, 0, 0];
  (NODES_DEF[br.id] || []).forEach((df, i) => {
    const [nom, desc, eff, val, max, tier] = df;
    const id = br.id + "_" + i;
    NODES.push({ id, br: br.id, nom, desc, eff, val, max, tier, req: prev, cout: Math.ceil(NODE_COUT_T[tier] * (1 + posT[tier] * 0.18)) });
    posT[tier]++;
    prev = id;
  });
});
const NODE_BY_ID = Object.fromEntries(NODES.map((n) => [n.id, n]));
const coutNode = (n, rang) => Math.ceil(n.cout * Math.pow(1.55, rang));
function acheterNode(G, nid) {
  const meta = G.meta, o = meta.origine, n = NODE_BY_ID[nid]; if (!n) return;
  const rang = o.arbre[nid] || 0;
  if (rang >= n.max) return;
  if (n.req && !(o.arbre[n.req] > 0)) { toast(G, "Node précédent requis", "#ffd45e"); return; }
  const c = coutNode(n, rang);
  if (o.eclats < c) { toast(G, "Pas assez d'Éclats d'Origine (" + c + " ❖)", "#ff6b6b"); return; }
  o.eclats -= c; o.eclatsDep += c;
  o.arbre[nid] = rang + 1;
  toast(G, "❖ " + n.nom + (n.max > 1 ? " " + (rang + 1) + "/" + n.max : "") + " acquis", "#ffe08a");
  sfx("tier", meta.opts.sfx); G.saveNow = true;
}
/* ============================================================
   ÉCHOS (v0.9.0) — objets méta permanents, séparés de l'équipement.
   Choisis après chaque Renaissance, équipés dans des slots limités.
   ============================================================ */
const ECHO_LIB = {
  atkDep: "ATQ de départ", hpDep: "PV de départ", defDep: "DÉF de départ", asP: "% vitesse d'attaque",
  "gJ.puissance": "% gain de Puissance", "gJ.endurance": "% gain d'Endurance", "gJ.fortune": "% gain de Fortune",
  "gJ.celerite": "% gain de Célérité", "gJ.precision": "% gain de Critique", "gJ.domination": "% gain de Domination",
  "gJ.extermination": "% gain d'Extermination", gTous: "% gain de toutes les jauges",
  vsBossP: "% dégâts boss", vsMonP: "% dégâts monstres", atkParGardien: "ATQ par Gardien vaincu (cycle)",
  redSubis: "% dégâts subis en moins", hpP: "% PV max", goldP: "% or", dropP: "% chance de butin",
  ferrailleP: "% ferraille", orMaitrise: "% or par monstre maîtrisé", seuilMaitrise: "% seuils de maîtrise en moins",
  killsVirt: "kills virtuels après Renaissance", vsMaitrise: "% dégâts contre maîtrisés", altGold: "% or en zones altérées",
  tokensB: "% chance de token bonus", essenceB: "% chance d'essence double", gainGardien: "% récompenses des Gardiens",
  eclatsP: "% Éclats d'Origine", critC: "% chance critique", coutShop: "% réduction coût boutique",
};
const ECHO_TYPES = [
  { id: "puissance", nom: "Puissance", ico: "⚔", col: "#ff9d5c", pool: [["atkDep", 8, 1.2], ["gJ.puissance", 6, 0.8], ["vsBossP", 4, 0.5], ["vsMonP", 4, 0.5], ["atkParGardien", 2, 0.5]] },
  { id: "endurance", nom: "Endurance", ico: "♥", col: "#ff6b6b", pool: [["hpDep", 40, 7], ["defDep", 2, 0.35], ["gJ.endurance", 6, 0.8], ["redSubis", 2, 0.3], ["hpP", 3, 0.4]] },
  { id: "fortune", nom: "Fortune", ico: "◆", col: "#ffd45e", pool: [["goldP", 5, 0.7], ["dropP", 4, 0.6], ["ferrailleP", 5, 0.7], ["gJ.fortune", 6, 0.8], ["orMaitrise", 1, 0.25]] },
  { id: "memoire", nom: "Mémoire", ico: "📖", col: "#6ad4ff", pool: [["seuilMaitrise", 2, 0.3], ["killsVirt", 2, 0.6], ["vsMaitrise", 4, 0.6], ["orMaitrise", 1, 0.3], ["altGold", 5, 0.8]] },
  { id: "domination", nom: "Domination", ico: "♛", col: "#8be05f", pool: [["vsBossP", 6, 0.8], ["tokensB", 4, 0.6], ["essenceB", 4, 0.6], ["gainGardien", 5, 0.7], ["eclatsP", 2, 0.3]] },
  { id: "celerite", nom: "Célérité", ico: "»", col: "#79d0c3", pool: [["asP", 3, 0.45], ["gJ.celerite", 6, 0.8], ["critC", 2, 0.3], ["gTous", 2, 0.3], ["vsMonP", 3, 0.45]] },
  { id: "neant", nom: "Néant", ico: "🌌", col: "#7a6aff", paires: [
    [["hpP", -12, -1], ["gTous", 8, 1.1]],
    [["redSubis", -8, -0.7], ["eclatsP", 4, 0.5]],
    [["coutShop", -12, -1], ["dropP", 8, 1.1]],
    [["vsMonP", -8, -0.7], ["gainGardien", 12, 1.4], ["eclatsP", 2, 0.3]],
    [["goldP", -10, -0.8], ["gJ.puissance", 10, 1.2], ["gJ.endurance", 10, 1.2]],
  ] },
];
const ECHO_TYPE_BY_ID = Object.fromEntries(ECHO_TYPES.map((t) => [t.id, t]));
const nomEcho = (e) => "Écho " + (e.type === "neant" ? "du Néant" : "de " + ECHO_TYPE_BY_ID[e.type].nom) + " " + rome(Math.min(10, e.niv));
const echoSlotsMax = (meta) => 2 + Math.min(3, Math.floor(bonusOrigine(meta).echoSlots || 0));
/* Poids de rareté : poussés par les Renaissances, la zone max, Destin et les Serments. */
function echoRarWeights(meta) {
  const b = bonusOrigine(meta);
  const o = meta.origine || {};
  const pts = Math.min(70, (b.echoRarPts || 0)
    + (o.ren || 0) * 2
    + Math.min(20, ((meta.cycle && meta.cycle.maxZone) || 0) * 1.5)
    + (o.sermentsActifs || []).reduce((a, sid) => a + ((SERMENT_BY_ID[sid] || {}).echoRar || 0) * 8, 0)
    + (ALTERATIONS.some((al) => altActive(meta, al.zoneId) && al.rew.echoRar) ? 5 : 0));
  const base = [40, 24, 14, 9, 6, 4, 2, 1];
  const w = base.map((x, i) => (i === 0 ? x / (1 + pts / 15) : x * (1 + (pts / 25) * (i / 7))));
  return { w, legFloor: Math.min(15, b.echoLeg || 0) };
}
function generateEcho(meta, forcedType) {
  const t = forcedType ? ECHO_TYPE_BY_ID[forcedType] : pick(ECHO_TYPES);
  const { w, legFloor } = echoRarWeights(meta);
  let ri = 0;
  if (R() * 100 < legFloor) ri = 5 + (R() < 0.2 ? 1 : 0) + (R() < 0.05 ? 1 : 0);
  else { const s = w.reduce((a, x) => a + x, 0); let x = R() * s; for (let i = 0; i < w.length; i++) { x -= w[i]; if (x <= 0) { ri = i; break; } } }
  ri = Math.min(ri, RARS.length - 1);
  const b = bonusOrigine(meta);
  const niv = Math.max(1, 1 + Math.floor(Math.sqrt(((meta.origine || {}).ren || 0))) + Math.floor(b.echoNiv || 0) + Math.floor(R() * 3) - 1);
  const nbEff = [1, 2, 2, 3, 3, 4, 4, 5][ri];
  const mult = RARS[ri].mult;
  let effets = [];
  if (t.id === "neant") {
    effets = pick(t.paires).map(([e, base2, sc]) => ({ e, v: Math.round((base2 + sc * niv) * mult * 10) / 10 }));
  } else {
    const pool = t.pool.slice();
    for (let i = 0; i < nbEff && pool.length; i++) {
      const [e, base2, sc] = pool.splice(Math.floor(R() * pool.length), 1)[0];
      effets.push({ e, v: Math.round((base2 + sc * niv) * mult * 10) / 10 });
    }
  }
  return { id: uid(), type: t.id, rar: RARS[ri].id, niv, effets };
}
function generateEchoOptions(meta) {
  const n = 3 + Math.min(3, Math.floor(bonusOrigine(meta).echoChoix || 0));
  return Array.from({ length: n }, () => generateEcho(meta));
}
function choisirEcho(G, echoId) {
  const o = G.meta.origine;
  const e = (o.echoChoix || []).find((x) => x.id === echoId); if (!e) return;
  if (o.echos.length >= 60) { toast(G, "Inventaire d'Échos plein (60) — recycle d'abord", "#ff6b6b"); return; }
  o.echos.push(e);
  if (o.echosEq.length < echoSlotsMax(G.meta)) o.echosEq.push(e.id);
  o.echoChoix = null;
  toast(G, nomEcho(e) + " rejoint ton Origine", RAR_BY_ID[e.rar].col);
  sfx("tier", G.meta.opts.sfx); G.saveNow = true;
}
function equiperEcho(G, id) {
  const o = G.meta.origine;
  if (o.echosEq.includes(id)) return;
  if (o.echosEq.length >= echoSlotsMax(G.meta)) { toast(G, "Tous les slots d'Écho sont occupés", "#ffd45e"); return; }
  if (!o.echos.find((e) => e.id === id)) return;
  o.echosEq.push(id); sfx("equip", G.meta.opts.sfx); G.saveNow = true;
}
function retirerEcho(G, id) {
  const o = G.meta.origine;
  o.echosEq = o.echosEq.filter((x) => x !== id);
  sfx("equip", G.meta.opts.sfx); G.saveNow = true;
}
function recyclerEcho(G, id) {
  const o = G.meta.origine;
  const e = o.echos.find((x) => x.id === id); if (!e) return;
  o.echosEq = o.echosEq.filter((x) => x !== id);
  o.echos = o.echos.filter((x) => x.id !== id);
  const gain = (RARS.findIndex((r) => r.id === e.rar) + 1) * 2 + Math.min(10, e.niv);
  o.eclats += gain; o.eclatsTot += gain;
  toast(G, nomEcho(e) + " dissous : +" + gain + " ❖", "#ffe08a");
  sfx("coin", G.meta.opts.sfx); G.saveNow = true;
}

/* Agrégat de tous les bonus permanents : Arbre + Échos équipés + bonus de Serments. */
const CLES_BONUS = ["atkDep", "hpDep", "defDep", "asP", "coutShop", "effShop", "statsG", "earlyZ", "gTous", "gardeJauges", "seuilJ",
  "seuilMaitrise", "killsVirt", "orMaitrise", "vsMaitrise", "vsMonP", "altGold", "armeT", "parZoneTrans", "essenceB", "gainGardien", "tokensB", "ferrailleP",
  "echoRarPts", "echoNiv", "echoChoix", "echoSlots", "echoLeg", "sermUnlock", "sermMax", "sermMalus", "sermBonus", "altUnlock", "eclatsP",
  "vsBossP", "critC", "redSubis", "goldP", "dropP", "atkP", "hpP", "exilLoin", "atkParGardien"];
function bonusOrigine(meta) {
  const b = Object.fromEntries(CLES_BONUS.map((k) => [k, 0]));
  b.gJ = { puissance: 0, endurance: 0, fortune: 0, celerite: 0, precision: 0, domination: 0, extermination: 0 };
  const appl = (key, val) => {
    if (typeof key !== "string") return;
    if (key.startsWith("gJ.")) { const g = key.slice(3); if (b.gJ[g] !== undefined) b.gJ[g] += val; }
    else if (b[key] !== undefined) b[key] += val;
  };
  const o = meta.origine || {};
  for (const nid in (o.arbre || {})) { const n = NODE_BY_ID[nid]; if (n) appl(n.eff, n.val * o.arbre[nid]); }
  (o.echosEq || []).forEach((eid) => {
    const e = (o.echos || []).find((x) => x.id === eid);
    if (e) (e.effets || []).forEach((ef) => appl(ef.e, ef.v));
  });
  (o.sermentsActifs || []).forEach((sid) => {
    const s = SERMENT_BY_ID[sid]; if (!s) return;
    const amp = 1 + b.sermBonus / 100;
    for (const k in s.bonus) appl(k, s.bonus[k] * amp);
  });
  return b;
}
function Fond({ zi }) {
  const ref = useRef(null);
  useEffect(() => {
    const c = ref.current; if (!c) return;
    const F = FONDS[zi] || FONDS[0];
    const W = 192, H = 108; c.width = W; c.height = H;
    const x = c.getContext("2d"); const rnd = mulberry(20260705 + zi * 777);
    for (let j = 0; j < H; j++) for (let i = 0; i < W; i++) {
      const dx = (i - W / 2) / (W / 2), dy = j / H;
      const gl = Math.max(0, 1 - Math.hypot(dx * 1.15, dy * 1.7));
      x.fillStyle = "rgb(" + ((F.hb[0] + F.hg[0] * gl) | 0) + "," + ((F.hb[1] + F.hg[1] * gl) | 0) + "," + ((F.hb[2] + F.hg[2] * gl) | 0) + ")";
      x.fillRect(i, j, 1, 1);
    }
    const blob = (cx, cy, r, col) => { x.fillStyle = col; for (let j = -r; j <= r; j++) for (let i = -r; i <= r; i++) { if (i * i + j * j <= r * r * (0.55 + rnd() * 0.5)) x.fillRect((cx + i) | 0, (cy + j) | 0, 1, 1); } };
    if (F.canop) for (let k = 0; k < 26; k++) blob(rnd() * W, rnd() * 16 - 4, 6 + rnd() * 9, F.blobs[(rnd() * 3) | 0]);
    for (let k = 0; k < 12; k++) { const g = rnd() < 0.5; blob(g ? rnd() * 30 : W - rnd() * 30, 10 + rnd() * 50, 6 + rnd() * 9, F.blobs[(rnd() * F.blobs.length) | 0]); }
    for (let k = 0; k < 9; k++) {
      const g = rnd() < 0.5; const tx = (g ? 4 + rnd() * 52 : W - 8 - rnd() * 52) | 0; const ty = (F.canop ? 8 + rnd() * 14 : 26 + rnd() * 30) | 0;
      x.fillStyle = F.tA; x.fillRect(tx, ty, 2, F.canop ? 62 : 84 - ty);
      x.fillStyle = F.tB; x.fillRect(tx + 2, ty, 1, F.canop ? 60 : 82 - ty);
      if (F.canop) blob(tx + 1, ty - 2, 7 + rnd() * 5, F.blobs[(rnd() * 3) | 0]);
    }
    for (let k = 0; k < 30; k++) { const g = rnd() < 0.5; blob(g ? rnd() * 62 : W - rnd() * 62, 62 + rnd() * 22, 4 + rnd() * 7, F.blobs[(rnd() * F.blobs.length) | 0]); }
    for (let j = 84; j < H; j++) {
      x.fillStyle = j % 2 ? F.solA : F.solB; x.fillRect(0, j, W, 1);
      const hw = 9 + (j - 84) * 1.7;
      x.fillStyle = F.ch; x.fillRect((W / 2 - hw) | 0, j, (hw * 2) | 0, 1);
      x.fillStyle = F.chC; for (let k = 0; k < 6; k++) x.fillRect((W / 2 - hw + rnd() * hw * 2) | 0, j, 1, 1);
      x.fillStyle = F.herbe; for (let k = 0; k < 5; k++) x.fillRect((rnd() * W) | 0, j, 1, 1);
    }
    for (let k = 0; k < 60; k++) { const fx = rnd() * W, fy = 60 + rnd() * 46; if (Math.abs(fx - W / 2) < 12 && fy > 84) continue; x.fillStyle = F.deco[(rnd() * F.deco.length) | 0]; x.fillRect(fx | 0, fy | 0, 1, 1); }
    x.globalAlpha = F.ray; x.fillStyle = "#ffffff";
    for (let k = 0; k < 3; k++) x.fillRect((W / 2 - 22 + k * 16) | 0, 0, 5, 66);
    x.globalAlpha = 1;
  }, [zi]);
  return <canvas ref={ref} className="px fond" />;
}
function Scene({ G }) {
  const run = G.run, st = G.st, now = G.now;
  const mon = run.mon;
  const vu = mon ? (G.meta.best[mon.def.id] || 0) > 0 : false;
  const heroLunge = now - G.heroAtk < 160, heroHurt = now - G.monAtk < 160;
  const bossT = mon && mon.estBoss;
  const monCol = bossT ? (mon.def.type === "zone" ? "#ffd45e" : "#ff4fd8") : "#ffcc33";
  return (
    <div className="scene">
      <Fond zi={run.zoneIdx} />
      <div className="lucioles">{[0, 1, 2, 3, 4, 5].map((i) => <i key={i} className="luciole" style={{ left: 6 + i * 16 + "%", animationDelay: i * 1.3 + "s", animationDuration: 7 + (i % 3) * 2 + "s" }} />)}</div>
      <div className="vsband"><span className="g">Héros</span><span className="vsm">VS</span><span className="g">{mon ? (vu ? mon.def.nom : "? ? ?") : "…"}</span></div>
      <div className="combattant hero">
        <div className="floats">{G.floats.filter((f) => f.side === "hero").map((f) => <span key={f.id} className={"float " + f.cls} style={{ left: f.x + "%" }}>{f.txt}</span>)}</div>
        <div className={"sprwrap bob" + (heroLunge ? " lunge" : "") + (heroHurt ? " flash" : "")}><Spr id="hero" scale={5} flip /></div>
        <div className="plate">
          <div className="pname">Héros <span className="psub">{STANCE_BY_ID[run.stance].ico} {STANCE_BY_ID[run.stance].nom}</span></div>
          <Bar v={run.hp} max={st.hpMax} col="#ff4252" h={16} txt={fmt(Math.max(0, run.hp)) + " / " + fmt(st.hpMax)} />
          <Bar v={run.hG % 1} max={1} col="#6ad4ff" h={5} />
        </div>
      </div>
      <div className="combattant mon">
        <div className="floats">{G.floats.filter((f) => f.side === "mon").map((f) => <span key={f.id} className={"float " + f.cls} style={{ left: f.x + "%" }}>{f.txt}</span>)}</div>
        {mon ? (
          <>
            <div className={"sprwrap bob2" + (now - G.heroAtk < 160 ? " flash" : "")}>
              <Spr id={mon.def.spr} scale={bossT ? 7 : 5} silhouette={!vu} />
            </div>
            <div className="plate">
              <div className="pname" style={{ color: bossT ? monCol : "#fff" }}>
                {vu ? mon.def.nom : "? ? ?"}
                {bossT ? <span className="psub" style={{ color: monCol }}>{mon.def.type === "zone" ? "GARDIEN DE ZONE" : "BOSS DE NIVEAU"}</span> : null}
              </div>
              <Bar v={mon.hp} max={mon.hpMax} col={monCol} h={16} txt={fmt(Math.max(0, mon.hp)) + " / " + fmt(mon.hpMax)} />
              <Bar v={run.mG % 1} max={1} col="#ff9d5c" h={5} />
            </div>
          </>
        ) : (
          <div className="apparait">un monstre approche…</div>
        )}
      </div>
    </div>
  );
}
/* ---------- onglets ---------- */
function TabBoutique({ G, maj }) {
  const run = G.run;
  const cA = coutReel(G, "atk");
  const cH = coutReel(G, "hp");
  const rab = rabaisShop(G.meta);
  return (
    <div>
      <p className="note">Améliorations de run — payées en or, <b>réinitialisées à la fin de la run</b>. L'or <b>non dépensé</b> n'est pas perdu : il est encaissé dans la jauge Fortune à la fin.{rab < 1 ? <span className="rabchip"> · Extermination : coûts −{(100 * (1 - rab)).toFixed(1).replace(".", ",")}%</span> : null}</p>
      <div className="grid2">
        {[
          { k: "atk", nom: "Entraînement d'attaque", lvl: run.lvlAtk, cout: cA, eff: "+5% ATQ / niveau", cur: "+" + run.lvlAtk * BAL.shop.atkV + "% ATQ", col: "#ff9d5c", ico: "⚔" },
          { k: "hp", nom: "Vitalité", lvl: run.lvlHp, cout: cH, eff: "+5% PV max / niveau · soigne 25% à l'achat", cur: "+" + run.lvlHp * BAL.shop.hpV + "% PV", col: "#5fc25f", ico: "♥" },
        ].map((c) => (
          <div key={c.k} className="carte">
            <div className="ctitre"><span style={{ color: c.col }}>{c.ico}</span> {c.nom} <span className="niv">niv {c.lvl}</span></div>
            <div className="cinfo">{c.eff}</div>
            <div className="cinfo" style={{ color: c.col }}>Actuel : {c.cur}</div>
            <div className="crow">
              <button className="btn" disabled={run.gold < c.cout || run.over} onClick={() => { acheter(G, c.k, false); maj(); }}>+1 · {fmtM(c.cout)}</button>
              <button className="btn ghost" disabled={run.gold < c.cout || run.over} onClick={() => { acheter(G, c.k, true); maj(); }}>MAX</button>
            </div>
          </div>
        ))}
      </div>
      <div className="msep" style={{ marginTop: 6 }}>JAUGES MÉTA</div>
      <TabJauges G={G} />
    </div>
  );
}
function TabJauges({ G }) {
  return (
    <div>
      <p className="note">Chaque action nourrit sa jauge <b>en direct</b>, mais les paliers ne sont <b>activés qu'à la fin de la run</b> — meurs ou encaisse pour toucher tes gains.</p>
      {GAUGES.map((g) => {
        const gs = G.meta.gauges[g.id];
        const pend = tiersFromTotal(g, gs.total) - gs.applied;
        const t = gs.applied + pend;
        const deja = cumReq(g, t), prochain = cumReq(g, t + 1);
        const F = g.id === "fortune" ? fmtM : fmt;
        return (
          <div key={g.id} className="jauge">
            <div className="jhead">
              <span className="jico" style={{ color: g.col }}>{g.ico}</span>
              <span className="jnom">{g.nom}</span>
              <span className="jsrc">{g.src}</span>
              {pend > 0 ? <span className="pend">+{pend} palier{pend > 1 ? "s" : ""} en attente</span> : null}
              <span className="jpal" style={{ color: g.col }}>palier {gs.applied}{pend > 0 ? " → " + t : ""}</span>
            </div>
            <Bar v={gs.total - deja} max={prochain - deja} col={g.col} h={18} glow={pend > 0} txt={F(gs.total - deja) + " / " + F(prochain - deja)} />
            <div className="jeff">{g.eff} — actif : <b style={{ color: g.col }}>{g.rabais ? "−" + (100 * (1 - Math.pow(0.99, gs.applied))).toFixed(1).replace(".", ",") + "%" : "+" + (gs.applied * g.par).toString().replace(".", ",") + "%"}</b>{g.id === "fortune" ? <span className="dim"> · or de la run en attente : +{fmtM(G.run.gold)}</span> : null}</div>
          </div>
        );
      })}
    </div>
  );
}
function TabStances({ G, maj }) {
  const meta = G.meta, run = G.run;
  return (
    <div>
      <div className="tokrow"><span className="tok">⬡ {meta.tokens}</span> tokens de boss{run.tokensPend > 0 ? <span className="pend"> +{run.tokensPend} crédités en fin de run</span> : null}</div>
      <p className="note">Le bonus <b>principal</b> monte niveau par niveau (tokens). Tous les 5 niveaux, une <b>évolution</b> améliore toutes les sous-stats — jamais le principal.</p>
      <div className="grid2">
        {STANCES.map((sd) => {
          const st = meta.stances[sd.id];
          const sv = stanceVals(sd, st);
          const active = run.stance === sd.id;
          const cout = st ? nivCost(st.niv) : 0;
          const evoDispo = st ? Math.floor(st.niv / 5) > st.evo : false;
          return (
            <div key={sd.id} className={"carte stance" + (active ? " active" : "")} style={{ borderColor: active ? sd.col : undefined }}>
              <div className="ctitre"><span style={{ color: sd.col }}>{sd.ico}</span> {sd.nom} {st ? <span className="niv">niv {st.niv} · évo {st.evo}</span> : <span className="niv">fixe</span>}</div>
              <div className="cinfo dim">{sd.desc}</div>
              {sd.principal ? (
                <div className="cinfo"><b style={{ color: sd.col }}>{pct(sv.principal)} {NOM_STAT[sd.principal.stat]}</b> <span className="dim">(+{sd.principal.parNiv}%/niv)</span></div>
              ) : <div className="cinfo dim">Aucun modificateur.</div>}
              {sv.subs.map((s, i) => (
                <div key={i} className="cinfo sub" style={{ color: s.val >= 0 ? "#8be05f" : "#ff6b6b" }}>{pct(s.val)} {NOM_STAT[s.stat]}</div>
              ))}
              <div className="crow">
                <button className={"btn" + (active ? " on" : "")} onClick={() => { run.stance = sd.id; sfx("equip", meta.opts.sfx); maj(); }}>{active ? "ACTIVE" : "Activer"}</button>
                {st ? <button className="btn ghost" disabled={meta.tokens < cout} onClick={() => { ameliorerStance(G, sd.id); maj(); }}>+1 niv · ⬡{cout}</button> : null}
                {evoDispo ? <button className="btn evo" onClick={() => { evoluerStance(G, sd.id); maj(); }}>ÉVOLUER</button> : null}
              </div>
              {st && !evoDispo ? <div className="cinfo dim" style={{ marginTop: 4 }}>évolution {st.evo + 1} au niveau {(st.evo + 1) * 5}</div> : null}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function AffinageCtrl({ G, it, maj }) {
  const meta = G.meta;
  if (!it || it.nv) return null;
  const t = it.t || 1, a = it.a || 0;
  return (
    <div className="cinfo togline">
      <span>Affinage <b>Tier {rome(t)}</b> · {a}/10 <span className="dim">(stats ×{multAff(it).toFixed(2).replace(".", ",")})</span></span>
      {a < 10 ? (
        <button className="btn mini" disabled={meta.ferraille < coutAffinage(it)} onClick={() => { affiner(G, it.id); maj(); }}>Affiner · ⚒ {fmt(coutAffinage(it))}</button>
      ) : t < 3 ? (
        <button className="btn mini evo" disabled={meta.essence < t} onClick={() => { evoluerTier(G, it.id); maj(); }}>Évoluer Tier {rome(t + 1)} · ✦ {t}</button>
      ) : <span className="dim">Tier maximum atteint</span>}
      <button className="btn mini ghost" onClick={() => { basculerLock(G, it.id); maj(); }}>{it.lock ? "🔒 Verrouillé" : "🔓 Verrouiller"}</button>
    </div>
  );
}

const DOLL_G = ["armeP", "armeS", "armeT", "armure", "gants", "bottes"];
const DOLL_D = ["amulette", "anneau1", "anneau2", "boucle1", "boucle2"];
const FAM_ICO = { arme: "armeP", anneau: "anneau", boucle: "boucle", amulette: "amulette", armure: "armure", bottes: "bottes", gants: "gants" };

function TabEquipement({ G, sel, setSel, maj }) {
  const meta = G.meta;
  const [cible, setCible] = useState(null);
  const [selEq, setSelEq] = useState(null);
  const [filtre, setFiltre] = useState("tout");
  const [edit, setEdit] = useState(null);
  const [fenetre, setFenetre] = useState(null);
  const selIt = sel != null ? meta.inv.find((x) => x.id === sel) : null;
  const eqIt = selEq && meta.equip[selEq] ? meta.equip[selEq] : null;
  const cibles = selIt ? slotsCibles(selIt.slot) : [];
  const slotCible = selIt ? (cible && cibles.includes(cible) ? cible : selIt.slot) : null;
  const eqSel = selIt ? meta.equip[slotCible] : null;
  const seSel = selIt ? statsEff(selIt) : null;
  const seEq = eqSel ? statsEff(eqSel) : null;
  const cles = selIt ? Array.from(new Set([...Object.keys(seSel), ...(seEq ? Object.keys(seEq) : [])])) : [];
  const nbRar = Object.fromEntries(RARS.map((r) => [r.id, meta.inv.filter((it) => it.rar === r.id && !verrou(meta, it)).length]));
  const recy = meta.recy;
  const invFiltre = filtre === "tout" ? meta.inv : meta.inv.filter((it) => fam(it.slot) === filtre);
  const Case = (s) => {
    const it = meta.equip[s.id];
    const locked = s.trans && maxTrans(meta) < 1;
    return (
      <div key={s.id} className={"dcase" + (locked ? " locked" : "") + (selEq === s.id ? " selrow" : "")}
        title={locked ? "Transcende une zone pour déverrouiller" : it ? it.nom + " · " + RAR_BY_ID[it.rar].nom + " · niv " + it.ilvl : s.nom + " (vide)"}
        style={it ? { borderColor: RAR_BY_ID[it.rar].col } : null}
        onClick={() => { if (it) { setSelEq(selEq === s.id ? null : s.id); setSel(null); } }}
        onContextMenu={(e) => { e.preventDefault(); if (it) { basculerLock(G, it.id); maj(); } }}>
        <Spr id={s.ico} scale={4} silhouette={!it} />
        {it && verrou(meta, it) ? <span className="dlock">{estLie(meta, it.id) ? "🔗" : "🔒"}</span> : null}
        {it && ((it.t || 1) > 1 || (it.a || 0) > 0) ? <span className="dtier">T{rome(it.t || 1)}{it.a ? "·" + it.a : ""}</span> : null}
        <div className="dnom" style={it ? { color: RAR_BY_ID[it.rar].col } : null}>{s.nom}</div>
      </div>
    );
  };
  return (
    <>
    <div className="equipzone">
      <div className="eqpanel eqinfo">
        <div className="ctitel">Équipement sélectionné</div>
        {selIt ? (
          <div className="eqdetail" style={{ borderColor: RAR_BY_ID[selIt.rar].col }}>
            <div className="ctitre"><Spr id={SLOT_BY_ID[selIt.slot].ico} scale={2} /> <span style={{ color: RAR_BY_ID[selIt.rar].col }}>{selIt.nom}</span> <span className="niv">{RAR_BY_ID[selIt.rar].nom} · niv {selIt.ilvl}</span></div>
            {cibles.length > 1 ? (
              <div className="cinfo togline">Destination : {cibles.map((cid) => (
                <button key={cid} className={"btn mini" + (slotCible === cid ? " on" : " ghost")} onClick={() => setCible(cid)}>
                  {SLOT_BY_ID[cid].nom}{meta.equip[cid] ? "" : " (vide)"}
                </button>
              ))}</div>
            ) : null}
            {cles.map((k) => {
              const a = seSel[k] || 0, b = seEq ? (seEq[k] || 0) : 0, d = a - b;
              return (
                <div key={k} className="cinfo statline">
                  <span>{NOM_ISTAT[k]}</span>
                  <span><b>{a > 0 ? "+" + fmt(a) : "—"}</b>{eqSel ? <span className={"diff " + (d > 0 ? "up" : d < 0 ? "down" : "eq")}> {d > 0 ? "▲+" + fmt(d) : d < 0 ? "▼" + fmt(-d) : "="}</span> : null}</span>
                </div>
              );
            })}
            {eqSel ? <div className="cinfo dim">comparé à : {eqSel.nom} (niv {eqSel.ilvl}) — {SLOT_BY_ID[slotCible].nom}</div> : <div className="cinfo dim">{SLOT_BY_ID[slotCible].nom} : actuellement vide</div>}
            <AffinageCtrl G={G} it={selIt} maj={maj} />
            <div className="crow">
              <button className="btn" onClick={() => { equiper(G, selIt.id, slotCible); setSel(null); setCible(null); maj(); }}>Équiper → {SLOT_BY_ID[slotCible].nom}</button>
              <button className="btn ghost" disabled={verrou(meta, selIt)} onClick={() => { vendreItem(G, selIt.id); setSel(null); maj(); }}>{verrou(meta, selIt) ? "🔒 Verrouillé" : "Recycler +" + fmt(prixFerraille(selIt)) + " ⚒"}</button>
              <button className="btn ghost" onClick={() => { setSel(null); setCible(null); }}>Fermer</button>
            </div>
          </div>
        ) : eqIt ? (
          <div className="eqdetail" style={{ borderColor: RAR_BY_ID[eqIt.rar].col }}>
            <div className="ctitre"><Spr id={SLOT_BY_ID[eqIt.slot].ico} scale={2} /> <span style={{ color: RAR_BY_ID[eqIt.rar].col }}>{eqIt.nom}</span> <span className="niv">équipé — {SLOT_BY_ID[selEq].nom} · {RAR_BY_ID[eqIt.rar].nom} · niv {eqIt.ilvl}</span></div>
            {Object.entries(statsEff(eqIt)).map(([k, v]) => <div key={k} className="cinfo statline"><span>{NOM_ISTAT[k]}</span><b>+{fmt(v)}</b></div>)}
            <AffinageCtrl G={G} it={eqIt} maj={maj} />
            <div className="crow"><button className="btn ghost" onClick={() => setSelEq(null)}>Fermer</button></div>
          </div>
        ) : (
          <div className="cinfo dim" style={{ marginTop: 10 }}>Sélectionne une pièce d'équipement — dans l'inventaire à droite ou sur le personnage au centre — pour voir ses détails, la comparer, l'affiner et l'équiper.<br /><br />Astuce : clic droit = 🔒 verrouiller/déverrouiller.</div>
        )}
      </div>
      <div className="eqpanel eqdoll">
        <div className="ctitel">Personnage</div>
        <div className="doll">
          <div className="dollcol">{DOLL_G.map((sid) => Case(SLOT_BY_ID[sid]))}</div>
          <div className="dollmid">
            <Spr id="hero" scale={6} flip />
            <div className="dstance" style={{ color: STANCE_BY_ID[G.run.stance].col }}>{STANCE_BY_ID[G.run.stance].ico} {STANCE_BY_ID[G.run.stance].nom}</div>
            <div className="cinfo dim">{meta.stances[G.run.stance] ? "niv " + meta.stances[G.run.stance].niv + " · évo " + meta.stances[G.run.stance].evo : "stance fixe"}</div>
          </div>
          <div className="dollcol">{DOLL_D.map((sid) => Case(SLOT_BY_ID[sid]))}</div>
        </div>
      </div>
      <div className="eqpanel eqinv">
        <div className="ctitel">Inventaire — {meta.inv.length}/60</div>
        <div className="invhead">
          <button className="btn mini" onClick={() => { trierInventaire(G); maj(); }}>⇅ Tri auto</button>
          <button className="btn mini" onClick={() => { equiperMeilleur(G); setSel(null); setCible(null); maj(); }}>⚡ Équiper le meilleur</button>
        </div>
        <div className="invhead">
          <span className="vendrow">
            <button className={"btn mini" + (filtre === "tout" ? " on" : " ghost")} onClick={() => setFiltre("tout")}>Tout</button>
            {FAMS.map((f) => (
              <button key={f.id} className={"btn mini filtrico" + (filtre === f.id ? " on" : " ghost")} title={f.nom} onClick={() => setFiltre(filtre === f.id ? "tout" : f.id)}>
                <Spr id={FAM_ICO[f.id]} scale={2} />
              </button>
            ))}
          </span>
        </div>
        <div className="invhead">
          <span className="vendrow">Recycler : {RARS.map((r) => (
            <button key={r.id} className="btn mini ghost" style={{ borderColor: r.col, color: r.col }} disabled={!nbRar[r.id]} title={"Recycler tous les " + r.nom.toLowerCase() + "s non verrouillés"}
              onClick={() => { vendreRarete(G, r.id); setSel(null); maj(); }}>{r.nom.slice(0, 3)}. ({nbRar[r.id]})</button>
          ))}</span>
        </div>
        <div className="invgrid">
          {invFiltre.map((it) => (
            <div key={it.id} className={"icell" + (sel === it.id ? " selrow" : "")}
              title={it.nom + " · " + RAR_BY_ID[it.rar].nom + " · niv " + it.ilvl + ((it.t || 1) > 1 || (it.a || 0) > 0 ? " · T" + rome(it.t || 1) + " " + (it.a || 0) + "/10" : "") + "\n" + Object.entries(statsEff(it)).map(([k, v]) => "+" + fmt(v) + " " + NOM_ISTAT[k]).join(" · ")}
              style={{ borderColor: RAR_BY_ID[it.rar].col }}
              onClick={() => { setSel(sel === it.id ? null : it.id); setCible(null); setSelEq(null); }}
              onContextMenu={(e) => { e.preventDefault(); basculerLock(G, it.id); maj(); }}>
              <Spr id={SLOT_BY_ID[it.slot].ico} scale={3} />
              {verrou(meta, it) ? <span className="ilock">{estLie(meta, it.id) ? "🔗" : "🔒"}</span> : null}
              {(it.t || 1) > 1 || (it.a || 0) > 0 ? <span className="itier">T{rome(it.t || 1)}</span> : null}
            </div>
          ))}
          {filtre === "tout" ? Array.from({ length: Math.max(0, 60 - meta.inv.length) }).map((_, i) => <div key={"v" + i} className="icell vide" />) : null}
        </div>
      </div>
      <div className="eqbtns">
        <button className="eqbtn" onClick={() => setFenetre("ens")}>🧰<small>Ensemble Équipement</small></button>
        <button className="eqbtn" onClick={() => setFenetre("prio")}>🎯<small>Priorités Équipement</small></button>
        <button className="eqbtn" onClick={() => setFenetre("recy")}>♻<small>Recyclage Automatique</small></button>
        <button className="eqbtn" onClick={() => setFenetre("at")}>✦<small>Arme Transcendance</small></button>
      </div>
    </div>
    {fenetre ? (
      <div className="voile" onClick={() => setFenetre(null)}>
        <div className="modale large" onClick={(e) => e.stopPropagation()}>
    {fenetre === "at" ? (
      <>
        <div className="mtitre" style={{ color: "#c59bff" }}>ARMES DE TRANSCENDANCE</div>
        <div className="cinfo dim" style={{ textAlign: "center" }}>uniques · indestructibles · la meilleure s'équipe seule</div>
          <div className="grid2">
            {ZONES.map((z) => {
              const d = ARMES_T[z.id]; if (!d) return null;
              const tr = meta.zones[z.id].trans;
              const stats = tr >= 1 ? statsArmeT(z.id, tr, meta) : null;
              const equipee = meta.equip.armeT && meta.equip.armeT.zone === z.id;
              return (
                <div key={z.id} className="carte" style={{ borderColor: tr >= 1 ? d.col : undefined, opacity: tr >= 1 ? 1 : 0.55 }}>
                  <div className="ctitre small" style={{ color: tr >= 1 ? d.col : undefined }}><Spr id="armeT" scale={2} /> {d.nom}{tr >= 1 ? " " + rome(tr) : ""} <span className="niv">{z.nom}</span></div>
                  {stats ? Object.keys(stats).map((k) => <div key={k} className="cinfo">+{fmt(stats[k])} {NOM_ISTAT[k]}</div>)
                    : <div className="cinfo dim">Transcende cette zone pour la forger.</div>}
                  {stats ? <div className="crow"><button className={"btn" + (equipee ? " on" : "")} disabled={equipee} onClick={() => { choisirArmeT(G, z.id); maj(); }}>{equipee ? "ÉQUIPÉE" : "Équiper"}</button></div> : null}
                </div>
              );
            })}
          </div>
      </>
    ) : null}
    {fenetre === "ens" ? (
      <>
        <div className="mtitre" style={{ color: "#8be05f" }}>ENSEMBLES D'ÉQUIPEMENT</div>
        <div className="cinfo togline" style={{ justifyContent: "center" }}>
          <span className="dim">équipe une panoplie en un clic · pièces liées 🔗 verrouillées</span>
          <button className="btn mini" onClick={() => { sauverEnsemble(G); maj(); }}>+ Sauver l'équipement actuel</button>
          <button className="btn mini ghost" onClick={() => { meta.grpEns.push("Groupe " + (meta.grpEns.length + 1)); G.saveNow = true; maj(); }}>+ Groupe</button>
        </div>
        {meta.ensembles.length === 0 ? <div className="cinfo dim">Équipe ta panoplie idéale puis clique « + Sauver l'équipement actuel » — tu pourras la rééquiper d'un clic (ex. un ensemble « Farm Or »).</div> : null}
        {meta.grpEns.map((grp, gi) => (
          <div key={gi}>
            {(meta.ensembles.length > 0 || meta.grpEns.length > 1) ? (
              <div className="cinfo togline grptitre">
                {edit && edit.type === "grp" && edit.id === gi ? (
                  <input className="inpt" autoFocus value={edit.val} onChange={(e) => setEdit({ ...edit, val: e.target.value })}
                    onKeyDown={(e) => { if (e.key === "Enter") { const nv = edit.val.trim() || grp; meta.ensembles.forEach((en) => { if (en.grp === grp) en.grp = nv; }); meta.grpEns[gi] = nv; G.saveNow = true; setEdit(null); maj(); } if (e.key === "Escape") setEdit(null); }} />
                ) : <b>▸ {grp}</b>}
                <button className="btn mini ghost" title="Renommer le groupe" onClick={() => setEdit({ type: "grp", id: gi, val: grp })}>✎</button>
                {meta.grpEns.length > 1 && !meta.ensembles.some((e) => e.grp === grp) ? (
                  <button className="btn mini ghost danger" title="Supprimer le groupe (vide)" onClick={() => { meta.grpEns.splice(gi, 1); G.saveNow = true; maj(); }}>✕</button>
                ) : null}
              </div>
            ) : null}
            {meta.ensembles.filter((e) => e.grp === grp).map((e) => (
              <div key={e.id} className="cinfo togline ensrow">
                {edit && edit.type === "ens" && edit.id === e.id ? (
                  <input className="inpt" autoFocus value={edit.val} onChange={(ev) => setEdit({ ...edit, val: ev.target.value })}
                    onKeyDown={(ev) => { if (ev.key === "Enter") { e.nom = edit.val.trim() || e.nom; G.saveNow = true; setEdit(null); maj(); } if (ev.key === "Escape") setEdit(null); }} />
                ) : <span><b>{e.nom}</b> <span className="dim">({Object.keys(e.items).length} pièces)</span></span>}
                <button className="btn mini" onClick={() => { equiperEnsemble(G, e.id); maj(); }}>Équiper</button>
                <button className="btn mini ghost" title="Renommer" onClick={() => setEdit({ type: "ens", id: e.id, val: e.nom })}>✎</button>
                {meta.grpEns.length > 1 ? <button className="btn mini ghost" title="Déplacer vers le groupe suivant" onClick={() => { e.grp = meta.grpEns[(meta.grpEns.indexOf(e.grp) + 1) % meta.grpEns.length]; G.saveNow = true; maj(); }}>⇄</button> : null}
                <button className="btn mini ghost danger" title="Supprimer l'ensemble (délie ses pièces)" onClick={() => { supprimerEnsemble(G, e.id); maj(); }}>✕</button>
              </div>
            ))}
          </div>
        ))}
      </>
    ) : null}
    {fenetre === "prio" ? (
      <>
        <div className="mtitre" style={{ color: "#ffd45e" }}>PRIORITÉS D'ÉQUIPEMENT</div>
        <div className="cinfo dim" style={{ textAlign: "center" }}>clique pour bâtir l'ordre suivi par « ⚡ Équiper le meilleur » · vide = équilibre général</div>
        <div className="cinfo togline">{GRP_STATS.map((g) => {
          const pos = meta.prios.ordres.indexOf(g.id);
          return (
            <button key={g.id} className={"btn mini" + (pos >= 0 ? " on" : " ghost")}
              onClick={() => { if (pos >= 0) meta.prios.ordres.splice(pos, 1); else meta.prios.ordres.push(g.id); meta.prios.actif = null; G.saveNow = true; maj(); }}>
              {pos >= 0 ? (pos + 1) + "· " : ""}{g.nom}
            </button>
          );
        })}
        {meta.prios.ordres.length ? <button className="btn mini ghost" onClick={() => { meta.prios.ordres = []; meta.prios.actif = null; G.saveNow = true; maj(); }}>Vider</button> : null}
        </div>
        <div className="cinfo togline">Profils :
          {meta.prios.list.length === 0 ? <span className="dim">aucun — bâtis un ordre puis sauvegarde-le</span> : null}
          {meta.prios.list.map((p) => (
            <span key={p.id} className="togline">
              <button className={"btn mini" + (meta.prios.actif === p.id ? " on" : "")} title={p.ordres.map((x) => GRP_BY_ID[x] ? GRP_BY_ID[x].nom : x).join(" → ")}
                onClick={() => { meta.prios.ordres = p.ordres.slice(); meta.prios.actif = p.id; G.saveNow = true; maj(); }}>{p.nom}</button>
              <button className="btn mini ghost danger" onClick={() => { meta.prios.list = meta.prios.list.filter((x) => x.id !== p.id); if (meta.prios.actif === p.id) meta.prios.actif = null; G.saveNow = true; maj(); }}>✕</button>
            </span>
          ))}
          {meta.prios.ordres.length ? (
            edit && edit.type === "prof" ? (
              <input className="inpt" autoFocus placeholder="Nom du profil…" value={edit.val} onChange={(e) => setEdit({ ...edit, val: e.target.value })}
                onKeyDown={(e) => { if (e.key === "Enter" && edit.val.trim()) { const p = { id: uid(), nom: edit.val.trim(), ordres: meta.prios.ordres.slice() }; meta.prios.list.push(p); meta.prios.actif = p.id; G.saveNow = true; setEdit(null); maj(); } if (e.key === "Escape") setEdit(null); }} />
            ) : <button className="btn mini" onClick={() => setEdit({ type: "prof", val: "" })}>💾 Sauver ce profil</button>
          ) : null}
        </div>
      </>
    ) : null}
    {fenetre === "recy" ? (
      <>
        <div className="mtitre" style={{ color: "#79d0c3" }}>RECYCLAGE AUTOMATIQUE</div>
        <div className="cinfo togline" style={{ justifyContent: "center" }}>
          <span className="dim">le butin qui matche est vendu en ⚒ dès qu'il tombe</span>
          <button className={"btn mini" + (recy.on ? " on" : "")} onClick={() => { recy.on = !recy.on; G.saveNow = true; maj(); }}>{recy.on ? "ACTIF" : "INACTIF"}</button>
        </div>
        {recy.on ? (
          <>
            <div className="cinfo togline">Raretés : {RARS.map((r) => (
              <button key={r.id} className={"btn mini" + (recy.rars[r.id] ? " on" : " ghost")} style={recy.rars[r.id] ? { borderColor: r.col, color: r.col } : null}
                onClick={() => { recy.rars[r.id] = !recy.rars[r.id]; G.saveNow = true; maj(); }}>{r.nom}</button>
            ))}</div>
            <div className="cinfo togline">Types : {FAMS.map((f) => (
              <button key={f.id} className={"btn mini" + (recy.fams[f.id] ? " on" : " ghost")}
                onClick={() => { recy.fams[f.id] = !recy.fams[f.id]; G.saveNow = true; maj(); }}>{f.nom}</button>
            ))}</div>
            <div className="cinfo togline">Niveau max recyclé :
              <input type="number" min="0" className="numin" value={recy.nivMax || ""} placeholder="∞"
                onChange={(e) => { recy.nivMax = Math.max(0, parseInt(e.target.value, 10) || 0); G.saveNow = true; maj(); }} />
              <span className="dim">vide = tous les niveaux · au-dessus, le butin est gardé</span>
            </div>
          </>
        ) : null}
      </>
    ) : null}
          <button className="btn" style={{ marginTop: 10 }} onClick={() => setFenetre(null)}>Fermer</button>
        </div>
      </div>
    ) : null}
    </>
  );
}

function TabBestiaire({ G, maj }) {
  const meta = G.meta;
  return (
    <div>
      <p className="note">Bonus d'or de maîtrise global : <b style={{ color: "#ffd45e" }}>+{bestGoldBonus(meta)}%</b>. Chaque palier de connaissance donne +{BAL.bestDmg}% infligés / −{BAL.bestRes}% subis contre le monstre. Transcender une zone remet ses connaissances à zéro (seuils ×2,5) mais double ses bonus de maîtrise — et débloque l'Arme de Transcendance.</p>
      {ZONES.map((z, zi) => {
        const monz = monstresDe(z.id);
        const rm = reqMult(meta, z.id);
        const maitres = monz.filter((m) => estMaitrise(m, meta.best[m.id] || 0, rm)).length;
        const tous = maitres === monz.length;
        const trans = meta.zones[z.id].trans;
        return (
          <div key={z.id} style={{ marginBottom: 16 }}>
            <div className="carte" style={{ marginBottom: 10, borderColor: z.col }}>
              <div className="ctitre"><span style={{ color: z.col }}>✦</span> {z.nom} <span className="niv">maîtrise {maitres}/{monz.length} · transcendance {trans}{rm > 1 ? " · seuils ×" + String(rm).replace(".", ",") : ""}</span></div>
              <div className="crow"><button className="btn evo" disabled={!tous} onClick={() => { transcender(G, z.id); maj(); }}>TRANSCENDER — {z.nom}</button></div>
            </div>
            <div className="grid2">
              {monz.map((m) => {
                const kills = meta.best[m.id] || 0, t = tierOf(m, kills, rm), vu = kills > 0;
                const seuils = m.tiers.map((x) => Math.ceil(x * rm));
                const Lm = zi * 10 + (zi === G.run.zoneIdx ? G.run.niveau : 1);
                const bm = m.type === "zone" ? BAL.zbos : m.type === "mini" ? BAL.boss : null;
                const zsB = zScale(zi);
                const hp = BAL.mob.hp * Math.pow(BAL.mob.hpG, Lm - 1) * m.hpM * (bm ? bm.hp : 1) * zsB.hp;
                const atk = BAL.mob.atk * Math.pow(BAL.mob.atkG, Lm - 1) * m.atkM * (bm ? bm.atk : 1) * zsB.atk;
                const gold = BAL.mob.gold * Math.pow(BAL.mob.goldG, Lm - 1) * m.goldM * (bm ? bm.gold : 1) * zsB.gold;
                return (
                  <div key={m.id} className="carte bestc">
                    <div className="bestrow">
                      <Spr id={m.spr} scale={3} silhouette={!vu} />
                      <div style={{ flex: 1 }}>
                        <div className="ctitre small">{vu ? m.nom : "? ? ?"}{m.type !== "normal" ? <span className="badge" style={{ color: m.type === "zone" ? "#ffd45e" : "#c59bff" }}>{m.type === "zone" ? "GARDIEN" : "BOSS"}</span> : null}</div>
                        <div className="tierpips">{[0, 1, 2, 3, 4].map((i) => <span key={i} className={"tp" + (i < t ? " on" : "")} />)}</div>
                        <div className="cinfo dim">{fmt(kills)} kill{kills > 1 ? "s" : ""}{t < 5 ? " · palier suivant : " + fmt(seuils[t]) : " · MAÎTRISÉ ★"}</div>
                      </div>
                    </div>
                    {vu ? <div className="cinfo dim it">{m.desc}</div> : <div className="cinfo dim it">Terrasse-le une première fois pour l'identifier.</div>}
                    {t >= 1 ? <div className="cinfo" style={{ color: z.col }}>+{BAL.bestDmg * t}% infligés · −{BAL.bestRes * t}% subis</div> : null}
                    {t >= 2 ? <div className="cinfo">PV <span className="dim">(niveau {Lm})</span> : <b>{fmt(hp)}</b></div> : null}
                    {t >= 3 ? <div className="cinfo">ATQ : <b>{fmt(atk)}</b> · cadence <b>{String(Math.round(BAL.mob.as * m.asM * (bm ? bm.as : 1) * 100) / 100).replace(".", ",")}</b>/s</div> : null}
                    {t >= 4 ? <div className="cinfo">Or : <b style={{ color: "#ffd45e" }}>{fmtM(gold)}</b></div> : null}
                    {t >= 5 ? <div className="cinfo" style={{ color: "#ffd45e" }}>★ Maîtrisé — +{BAL.bestGold * Math.pow(2, trans)}% or global</div> : null}
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}

/* ---------- modales ---------- */
function ModaleFin({ G, maj }) {
  const run = G.run;
  if (!run.over) return null;
  const g = run.gains || { paliers: [], tokens: 0, fortuneOr: 0 };
  return (
    <div className="voile">
      <div className="modale">
        <div className="mtitre" style={{ color: run.morte ? "#ff6b6b" : "#ffd45e" }}>{run.morte ? "VAINCU" : "RUN ENCAISSÉE"}</div>
        <div className="cinfo">{ZONES[run.zoneIdx].nom} · niveau {run.niveau} <span className="dim">(global {run.zoneIdx * 10 + run.niveau} · record {G.meta.vie.meilleure})</span> · run n°{G.meta.vie.runs}</div>
        <div className="mstats">
          <div>☠ <b>{fmt(run.stats.kills)}</b> monstres</div>
          <div>◆ <b>{fmtM(run.stats.or)}</b> or ramassé</div>
          <div>⚔ <b>{fmt(run.stats.degats)}</b> infligés</div>
          <div>♥ <b>{fmt(run.stats.subis)}</b> subis</div>
        </div>
        <div className="msep">GAINS MÉTA ACTIVÉS MAINTENANT</div>
        {g.paliers.length === 0 && g.tokens === 0 ? <p className="note">Aucun nouveau palier cette fois. Pousse plus loin, tanke plus, ou farme plus d'or — chaque action compte pour la prochaine.</p> : null}
        {g.paliers.map((p, i) => (
          <div key={i} className="mgain" style={{ color: p.g.col }}>{p.g.ico} {p.g.nom} : palier {p.avant} → <b>{p.apres}</b> <span className="dim">({p.g.eff})</span></div>
        ))}
        {g.tokens > 0 ? <div className="mgain" style={{ color: "#c59bff" }}>⬡ +{g.tokens} token{g.tokens > 1 ? "s" : ""} de stance</div> : null}
        {g.fortuneOr > 0 ? <div className="mgain" style={{ color: "#ffd45e" }}>◆ {fmtM(g.fortuneOr)} or restant encaissé → Fortune</div> : null}
        <button className="btn big" onClick={() => { relancer(G); maj(); }}>RELANCER — Forêt niveau 1</button>
      </div>
    </div>
  );
}

function ModaleNouveautes({ G, fermer }) {
  const notes = CHANGELOG.filter((c) => cmpVer(c.v, G.meta.versionVue) > 0);
  const histo = notes.length === 0;
  const liste = histo ? CHANGELOG : notes;
  return (
    <div className="voile" onClick={fermer}>
      <div className="modale" onClick={(e) => e.stopPropagation()}>
        <div className="mtitre" style={{ color: "#c59bff" }}>{histo ? "HISTORIQUE DES MISES À JOUR" : "NOUVEAUTÉS"}</div>
        <div className="cinfo dim">Transcendance v{VERSION}{histo ? " · " + CHANGELOG.length + " versions depuis le début" : ""}</div>
        {liste.map((c) => (
          <div key={c.v}>
            <div className="msep">v{c.v} · {c.date} — {c.titre}</div>
            {c.points.map((p, i) => <div key={i} className="mgain">• {p}</div>)}
          </div>
        ))}
        <button className="btn big" onClick={fermer}>C'EST PARTI !</button>
      </div>
    </div>
  );
}

function ModaleMaj({ G, version, fermer, maj }) {
  const [enCours, setEnCours] = useState(false);
  return (
    <div className="voile">
      <div className="modale">
        <div className="mtitre" style={{ color: "#6ad4ff" }}>MISE À JOUR DISPONIBLE</div>
        <div className="cinfo">La version <b>v{version}</b> est sortie <span className="dim">(tu joues en v{VERSION})</span>.</div>
        <p className="note">La mise à jour prend quelques secondes et conserve ta sauvegarde. Les nouveautés s'afficheront juste après.</p>
        <button className="btn big" disabled={enCours} onClick={async () => {
          setEnCours(true); maj();
          try { const r = await window.majJeu(); if (r && !r.ok) { toast(G, r.msg || "Mise à jour impossible", "#ff6b6b"); setEnCours(false); maj(); } }
          catch (e) { toast(G, "Mise à jour impossible", "#ff6b6b"); setEnCours(false); maj(); }
        }}>{enCours ? "TÉLÉCHARGEMENT…" : "METTRE À JOUR MAINTENANT"}</button>
        <button className="btn ghost" disabled={enCours} onClick={fermer}>Plus tard</button>
      </div>
    </div>
  );
}

function ModaleOpts({ G, fermer, maj, voirNotes }) {
  const [io, setIo] = useState("");
  const [exp, setExp] = useState("");
  const [conf, setConf] = useState(false);
  const o = G.meta.opts;
  return (
    <div className="voile" onClick={fermer}>
      <div className="modale" onClick={(e) => e.stopPropagation()}>
        <div className="mtitre" style={{ color: "#6ad4ff" }}>RÉGLAGES</div>
        <div className="cinfo">Version <b>v{VERSION}</b> <button className="btn mini ghost" onClick={voirNotes}>📜 Historique des mises à jour</button></div>
        <div className="cinfo">Vitesse <span className="dim">(mode test — pour valider la boucle sans attendre)</span></div>
        <div className="crow">{[1, 2, 5].map((v) => <button key={v} className={"btn" + (o.vitesse === v ? " on" : "")} onClick={() => { o.vitesse = v; maj(); }}>{v}×</button>)}</div>
        <div className="crow"><button className={"btn" + (o.sfx ? " on" : "")} onClick={() => { o.sfx = !o.sfx; G.saveNow = true; maj(); }}>Sons : {o.sfx ? "OUI" : "NON"}</button></div>
        <div className="msep">GRAPHISMES</div>
        <div className="cinfo">Échelle de l'interface <span className="dim">(Auto = adaptée à la résolution de ton écran)</span></div>
        <div className="crow">{["auto", 1, 0.9, 0.8, 0.7].map((v) => (
          <button key={String(v)} className={"btn" + ((o.echelle || "auto") === v ? " on" : "")}
            onClick={() => { o.echelle = v; G.saveNow = true; maj(); }}>{v === "auto" ? "AUTO" : Math.round(v * 100) + "%"}</button>
        ))}</div>
        <div className="msep">SAUVEGARDE</div>
        <div className="crow">
          <button className="btn ghost" onClick={() => setExp(JSON.stringify(versSave(G)))}>Exporter</button>
          <button className="btn ghost" onClick={() => {
            try { const d = JSON.parse(io); const r = depuisSave(d); G.meta = r.meta; G.run = r.run; G.saveNow = true; toast(G, "Sauvegarde importée", "#8be05f"); }
            catch (e) { toast(G, "Import invalide — JSON illisible", "#ff6b6b"); }
            maj();
          }}>Importer</button>
        </div>
        {exp ? <textarea className="ta" readOnly value={exp} onFocus={(e) => e.target.select()} /> : null}
        <textarea className="ta" placeholder="Colle une sauvegarde exportée ici puis Importer" value={io} onChange={(e) => setIo(e.target.value)} />
        {typeof window !== "undefined" && window.majJeu ? (
          <>
            <div className="msep">MISE À JOUR</div>
            <button className="btn" onClick={async () => {
              toast(G, "Recherche de mise à jour…", "#6ad4ff"); maj();
              try { const r = await window.majJeu(); if (r && !r.ok) { toast(G, r.msg || "Mise à jour impossible", "#ff6b6b"); maj(); } }
              catch (e) { toast(G, "Mise à jour impossible", "#ff6b6b"); maj(); }
            }}>Mettre à jour le jeu</button>
          </>
        ) : null}
        <div className="msep">DANGER</div>
        <button className="btn danger" onClick={() => { if (!conf) { setConf(true); setTimeout(() => setConf(false), 3000); return; } G.meta = metaInitiale(); G.run = runInitiale(); G.saveNow = true; setConf(false); maj(); }}>{conf ? "SÛR ? Clique encore pour TOUT effacer" : "Réinitialiser toute la progression"}</button>
        <button className="btn" onClick={fermer}>Fermer</button>
      </div>
    </div>
  );
}

/* ============================================================
   ONGLET ORIGINE (v0.9.0)
   ============================================================ */
function EchoCard({ G, e, maj, mode }) {
  const o = G.meta.origine;
  const t = ECHO_TYPE_BY_ID[e.type], rc = RAR_BY_ID[e.rar];
  return (
    <div className="carte echocard" style={{ borderColor: rc.col }}>
      <div className="ctitre small"><span style={{ color: t.col }}>{t.ico}</span> <span style={{ color: rc.col }}>{nomEcho(e)}</span> <span className="niv">{rc.nom} · niv {e.niv}</span></div>
      {e.effets.map((ef, i) => (
        <div key={i} className="cinfo" style={{ color: ef.v < 0 ? "#ff6b6b" : "#8be05f" }}>{ef.v > 0 ? "+" : ""}{String(ef.v).replace(".", ",")} {ECHO_LIB[ef.e] || ef.e}</div>
      ))}
      <div className="crow">
        {mode === "choix" ? <button className="btn" onClick={() => { choisirEcho(G, e.id); maj(); }}>CHOISIR</button> : null}
        {mode === "inv" ? (
          o.echosEq.includes(e.id)
            ? <button className="btn on" onClick={() => { retirerEcho(G, e.id); maj(); }}>ÉQUIPÉ · retirer</button>
            : <button className="btn" onClick={() => { equiperEcho(G, e.id); maj(); }}>Équiper</button>
        ) : null}
        {mode === "inv" ? <button className="btn mini ghost danger" title="Dissoudre en Éclats" onClick={() => { recyclerEcho(G, e.id); maj(); }}>Dissoudre</button> : null}
      </div>
    </div>
  );
}

function TabOrigine({ G, maj }) {
  const meta = G.meta, o = meta.origine, cy = meta.cycle;
  const [sub, setSub] = useState("ren");
  const [confirmRen, setConfirmRen] = useState(false);
  const calc = calcEclats(G);
  const dispo = renaissanceDispo(meta);
  const b = bonusOrigine(meta);
  return (
    <div>
      <div className="crow" style={{ marginBottom: 10, alignItems: "center" }}>
        {[["ren", "☀ Renaissance"], ["arbre", "🌳 Arbre d'Origine"], ["echos", "🌀 Échos"], ["serments", "🕯 Serments"], ["alt", "🌗 Zones altérées"]].map(([id, nom]) => (
          <button key={id} className={"btn" + (sub === id ? " on" : " ghost")} onClick={() => setSub(id)}>{nom}{id === "echos" && o.echoChoix ? " ●" : ""}</button>
        ))}
        <span className="reschip tbside" style={{ marginLeft: "auto", color: "#ffe08a", fontSize: 17 }}>❖ {fmt(o.eclats)} <span className="tbdim">Éclats d'Origine</span></span>
      </div>

      {sub === "ren" ? (
        <div>
          <p className="note">La <b>Renaissance</b> dissout le cycle entier — zones, Transcendances, équipement, forge, jauges, stances — et le convertit en <b>❖ Éclats d'Origine</b>, la monnaie permanente de l'Arbre d'Origine. Disponible en atteignant la <b>zone 5</b> (ou en battant le Gardien de la zone 4).</p>
          <div className="grid2">
            <div className="carte">
              <div className="ctitre small">☀ Cycle en cours</div>
              <div className="cinfo statline"><span>Zone max atteinte</span><b>{ZONES[cy.maxZone] ? ZONES[cy.maxZone].nom : "—"} ({cy.maxZone + 1}/15)</b></div>
              <div className="cinfo statline"><span>Niveau global max</span><b>{cy.maxNiv || 1}</b></div>
              <div className="cinfo statline"><span>Gardiens vaincus</span><b>{Object.keys(cy.gardiens || {}).length}</b></div>
              <div className="cinfo statline"><span>Monstres tués (cycle)</span><b>{fmt(cy.kills || 0)}</b></div>
              <div className="cinfo statline"><span>Serments actifs</span><b>{(o.sermentsActifs || []).length} (×{String(calc.mult).replace(".", ",")} Éclats)</b></div>
            </div>
            <div className="carte">
              <div className="ctitre small">📜 Historique d'Origine</div>
              <div className="cinfo statline"><span>Renaissances</span><b>{o.ren}</b></div>
              <div className="cinfo statline"><span>Meilleure zone (lifetime)</span><b>{o.bestZone || "—"}</b></div>
              <div className="cinfo statline"><span>Meilleur gain d'Éclats</span><b>❖ {fmt(o.meilleurGain || 0)}</b></div>
              <div className="cinfo statline"><span>Éclats gagnés au total</span><b>❖ {fmt(o.eclatsTot || 0)}</b></div>
              <div className="cinfo statline"><span>Éclats dépensés</span><b>❖ {fmt(o.eclatsDep || 0)}</b></div>
            </div>
          </div>
          <div className="carte" style={{ marginTop: 10, borderColor: "#ffe08a" }}>
            <div className="ctitre small">❖ Gain estimé à la Renaissance : <b style={{ color: "#ffe08a" }}>{fmt(calc.total)}</b> <span className="niv">base {fmt(calc.brut)} × {String(calc.mult).replace(".", ",")}</span></div>
            <div className="cinfo togline">{calc.det.map(([nom2, v], i) => <span key={i} className="slottag">{nom2} : +{fmt(v)}</span>)}</div>
            <div className="crow">
              <button className="btn big" style={{ borderColor: "#ffe08a", color: "#ffe08a" }} disabled={!dispo} onClick={() => setConfirmRen(true)}>
                {dispo ? "☀ RENAÎTRE" : "☀ RENAÎTRE — atteins la zone 5 pour débloquer (" + (cy.maxZone + 1) + "/5)"}
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {sub === "arbre" ? (
        <div>
          <div className="arbretronc">🌳 LE TRONC · {o.ren} Renaissance{o.ren > 1 ? "s" : ""} · ❖ {fmt(o.eclats)} disponibles</div>
          <div className="arbre">
            {BRANCHES.map((br) => (
              <div key={br.id} className="branche">
                <div className="brtitre" style={{ color: br.col }}>{br.ico} {br.nom}<div className="brtheme">{br.theme}</div></div>
                <div className="brnodes" style={{ borderColor: br.col }}>
                  {NODES.filter((n) => n.br === br.id).map((n) => {
                    const rang = o.arbre[n.id] || 0;
                    const reqOk = !n.req || (o.arbre[n.req] > 0);
                    const maxed = rang >= n.max;
                    const c = coutNode(n, rang);
                    const desc = n.desc.replace("{v}", String(n.val).replace(".", ","));
                    return (
                      <div key={n.id} className={"node" + (maxed ? " maxed" : reqOk ? (o.eclats >= c ? " dispo" : " cher") : " verrou")}
                        style={maxed ? { borderColor: br.col } : null}
                        title={desc + (rang > 0 ? " — total actuel : " + String(Math.round(n.val * rang * 100) / 100).replace(".", ",") : "") + (reqOk ? "" : " (node précédent requis)")}
                        onClick={() => { if (reqOk && !maxed) { acheterNode(G, n.id); maj(); } }}>
                        <div className="nodenom">{n.nom}</div>
                        <div className="nodedesc">{desc}</div>
                        <div className="nodebas">{maxed ? "MAX " + rang + "/" + n.max : rang + "/" + n.max + " · ❖ " + fmt(c)}</div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : null}

      {sub === "echos" ? (
        <div>
          {o.echoChoix ? (
            <div className="carte" style={{ borderColor: "#7a6aff", marginBottom: 10 }}>
              <div className="ctitre small">🌀 Un Écho t'attend — choisis-en <b>un seul</b> :</div>
              <div className="grid2">{o.echoChoix.map((e) => <EchoCard key={e.id} G={G} e={e} maj={maj} mode="choix" />)}</div>
            </div>
          ) : <p className="note">Les Échos sont des reliques permanentes, séparées de l'équipement : tu en choisis un après chaque Renaissance. Slots équipés : <b>{o.echosEq.length}/{echoSlotsMax(meta)}</b> (extensibles via Destin).</p>}
          {o.echos.length === 0 && !o.echoChoix ? <div className="cinfo dim">Aucun Écho pour l'instant — accomplis ta première Renaissance.</div> : null}
          <div className="grid2">
            {o.echos.slice().sort((a, bb) => (o.echosEq.includes(bb.id) ? 1 : 0) - (o.echosEq.includes(a.id) ? 1 : 0)).map((e) => <EchoCard key={e.id} G={G} e={e} maj={maj} mode="inv" />)}
          </div>
        </div>
      ) : null}

      {sub === "serments" ? (
        <div>
          <p className="note">Les <b>Serments</b> durcissent le cycle en échange d'un multiplicateur d'Éclats à la Renaissance{sermentsDebloques(meta) ? "" : " — débloque-les via le node « Serment scellé » de la branche Destin"}. Actifs : <b>{(o.sermentsActifs || []).length}/{sermentsMax(meta)}</b> · Multiplicateur total : <b style={{ color: "#ffe08a" }}>×{String(calc.mult).replace(".", ",")}</b></p>
          <div className="grid2">
            {SERMENTS.map((s) => {
              const actif = (o.sermentsActifs || []).includes(s.id);
              const locked = !sermentsDebloques(meta);
              return (
                <div key={s.id} className="carte" style={{ borderColor: actif ? "#ff6b6b" : undefined, opacity: locked ? 0.5 : 1 }}>
                  <div className="ctitre small">{s.ico} {s.nom} <span className="niv">×{String(s.eclatsM).replace(".", ",")} Éclats{s.echoRar ? " · Échos plus rares" : ""}</span></div>
                  <div className="cinfo dim">{s.desc}</div>
                  <div className="crow"><button className={"btn" + (actif ? " danger" : "")} disabled={locked} onClick={() => { basculerSerment(G, s.id); maj(); }}>{locked ? "🔒 Verrouillé" : actif ? "ROMPRE" : "PRÊTER SERMENT"}</button></div>
                </div>
              );
            })}
          </div>
        </div>
      ) : null}

      {sub === "alt" ? (
        <div>
          <p className="note">Les <b>Zones altérées</b> sont des variantes plus dures et plus rentables des zones{altsDebloquees(meta) ? "" : " — débloquées après ta première Renaissance (ou via le node « Rite d'altération »)"}. Les Gardiens vaincus en zone altérée rapportent plus d'Éclats. Zones 6-15 : altérations à venir.</p>
          <div className="grid2">
            {ALTERATIONS.map((a) => {
              const actif = altActive(meta, a.zoneId);
              const locked = !altsDebloquees(meta);
              return (
                <div key={a.id} className="carte" style={{ borderColor: actif ? ZONE_BY_ID[a.zoneId].col : undefined, opacity: locked ? 0.5 : 1 }}>
                  <div className="ctitre small" style={{ color: ZONE_BY_ID[a.zoneId].col }}>🌗 {a.nom} <span className="niv">{ZONE_BY_ID[a.zoneId].nom}</span></div>
                  <div className="cinfo dim">{a.desc}</div>
                  <div className="cinfo" style={{ color: "#ff6b6b" }}>PV ×{String(a.mob.hp).replace(".", ",")} · ATQ ×{String(a.mob.atk).replace(".", ",")}{a.mob.as !== 1 ? " · Vitesse ×" + String(a.mob.as).replace(".", ",") : ""}{a.mob.bossHp ? " · PV boss ×" + String(a.mob.bossHp).replace(".", ",") : ""}</div>
                  <div className="cinfo" style={{ color: "#8be05f" }}>Or ×{String(a.rew.gold).replace(".", ",")}{a.rew.essence ? " · essence ×2" : ""}{a.rew.ferraille ? " · +" + a.rew.ferraille + "% ferraille" : ""}{a.rew.echoRar ? " · Échos plus rares" : ""}</div>
                  <div className="crow"><button className={"btn" + (actif ? " danger" : "")} disabled={locked} onClick={() => { basculerAlt(G, a.zoneId); maj(); }}>{locked ? "🔒 Verrouillé" : actif ? "DÉSACTIVER" : "ALTÉRER"}</button></div>
                </div>
              );
            })}
          </div>
        </div>
      ) : null}

      {confirmRen ? (
        <div className="voile" onClick={() => setConfirmRen(false)}>
          <div className="modale" onClick={(e) => e.stopPropagation()}>
            <div className="mtitre" style={{ color: "#ffe08a" }}>RENAISSANCE</div>
            <div className="cinfo" style={{ textAlign: "center" }}>Gain : <b style={{ color: "#ffe08a" }}>❖ {fmt(calc.total)} Éclats d'Origine</b></div>
            <div className="msep" style={{ color: "#ff6b6b" }}>SERA DISSOUS</div>
            <div className="cinfo dim">Run et or · progression et déblocage des zones · bestiaire et maîtrises · Transcendances et armes de Transcendance · jauges méta{b.gardeJauges > 0 ? " (" + Math.min(50, b.gardeJauges) + "% conservés)" : ""} · niveaux de stances · équipement, inventaire, ensembles · ferraille et essence résiduelle</div>
            <div className="msep" style={{ color: "#8be05f" }}>SERA CONSERVÉ</div>
            <div className="cinfo dim">Éclats d'Origine · Arbre d'Origine · Échos · Serments débloqués · Zones altérées · statistiques lifetime · réglages, recyclage, priorités</div>
            <button className="btn big" style={{ borderColor: "#ffe08a", color: "#ffe08a" }} onClick={() => { performRenaissance(G); setConfirmRen(false); setSub("echos"); maj(); }}>☀ RENAÎTRE MAINTENANT</button>
            <button className="btn ghost" onClick={() => setConfirmRen(false)}>Pas encore</button>
          </div>
        </div>
      ) : null}
    </div>
  );
}

/* ============================================================
   APPLICATION
   ============================================================ */
function EncaisserBtn({ G, maj }) {
  const [arme, setArme] = useState(false);
  useEffect(() => { if (!arme) return; const t = setTimeout(() => setArme(false), 2600); return () => clearTimeout(t); }, [arme]);
  return (
    <button className={"btn " + (arme ? "danger" : "ghost")} disabled={G.run.over}
      onClick={() => { if (!arme) { setArme(true); return; } finRun(G, false); setArme(false); maj(); }}>
      {arme ? "Sûr ? Les jauges seront actées" : "↺ RESET RUN"}
    </button>
  );
}

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;700&family=Jost:wght@400;500;600;700&display=swap');
.trx{ --bg:#161b2e; --panel:#1f2540; --panel2:#262d4d; --line:#3a4270; --txt:#ffffff; --dim:#ccd6f4; --leaf:#7ee06e; --gold:#ffd45e; --cyan:#6ad4ff; --violet:#c59bff; --rouge:#ff6b6b;
  background: radial-gradient(1200px 500px at 50% -10%, #2a3358 0%, #161b2e 60%), #161b2e;
  color:var(--txt); font-family:'Jost', 'Segoe UI', sans-serif; font-size:16px; font-weight:500; line-height:1.4;
  height:100vh; overflow:hidden; padding:8px 14px; display:flex; flex-direction:column; gap:8px; width:100%; margin:0 auto; box-sizing:border-box;
  text-shadow:-1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000, 0 -1px 0 #000, 0 1px 0 #000, -1px 0 0 #000, 1px 0 0 #000; }
.trx *{ box-sizing:border-box; }
.trx b{ font-weight:700; }
.trx button{ font-family:'Cinzel', Georgia, serif; }
.px{ image-rendering:pixelated; display:block; }
.titre{ text-align:center; font-size:18px; letter-spacing:6px; color:var(--leaf); text-shadow:0 0 12px rgba(126,224,110,.35), 2px 2px 0 #0c0f1e; margin:2px 0 0; }
.stitre{ text-align:center; font-size:10px; letter-spacing:3px; color:var(--dim); text-transform:uppercase; }
.topbar{ display:flex; flex-wrap:wrap; gap:8px 14px; align-items:center; background:var(--panel); border:2px solid var(--line); border-radius:10px; padding:8px 12px; }
.zlabel{ font-size:12px; letter-spacing:2px; text-transform:uppercase; }
.zlabel b{ color:var(--leaf); }
.res{ display:flex; gap:14px; margin-left:auto; align-items:center; font-size:13px; }
.gold{ color:var(--gold); } .tokc{ color:var(--violet); }
.pips{ display:flex; gap:3px; align-items:center; }
.pip{ width:11px; height:11px; border:2px solid var(--line); background:#12162a; border-radius:2px; font-size:8px; line-height:8px; text-align:center; color:var(--dim); }
.pip.ok{ background:var(--leaf); border-color:var(--leaf); color:#0c0f1e; }
.pip.boss.ok{ background:var(--violet); border-color:var(--violet); }
.pip.cur{ animation:pulse 1.1s infinite; border-color:var(--cyan); }
.gear{ background:none; border:none; color:var(--dim); font-size:17px; cursor:pointer; padding:2px 4px; }
.gear:hover{ color:var(--txt); }
.scene{ position:relative; height:218px; border:3px solid var(--line); border-radius:12px; overflow:hidden;
  background:linear-gradient(#2e3a68 0%, #232b52 42%, #1a2138 100%);
  display:flex; align-items:flex-end; justify-content:space-between; padding:0 4%; }
.treeline{ position:absolute; left:-2%; right:-2%; bottom:30px; height:88px; background:#1e3326; opacity:.9;
  clip-path:polygon(0% 100%,0% 55%,4% 30%,8% 58%,12% 22%,17% 60%,21% 35%,26% 65%,30% 18%,35% 58%,40% 38%,45% 66%,50% 25%,55% 60%,60% 30%,65% 64%,70% 20%,75% 58%,80% 36%,85% 62%,90% 26%,95% 58%,100% 40%,100% 100%); }
.treeline.t2{ bottom:26px; height:64px; background:#152619; opacity:1;
  clip-path:polygon(0% 100%,0% 60%,6% 38%,11% 62%,16% 30%,22% 64%,28% 42%,34% 68%,40% 30%,46% 62%,52% 40%,58% 66%,64% 28%,70% 60%,76% 38%,82% 64%,88% 30%,94% 60%,100% 44%,100% 100%); }
.sol{ position:absolute; left:0; right:0; bottom:0; height:32px; background:linear-gradient(#2c4a2e, #1b2c1e); border-top:4px solid #3a6038; }
.lucioles{ position:absolute; inset:0; pointer-events:none; }
.luciole{ position:absolute; top:30%; width:4px; height:4px; background:#ffe9a0; box-shadow:0 0 7px 2px rgba(255,212,94,.55); animation:luciole 8s ease-in-out infinite; }
.combattant{ position:relative; width:min(380px,42%); display:flex; flex-direction:column; align-items:center; justify-content:flex-end; gap:7px; padding-bottom:40px; z-index:2; height:100%; }
.sprwrap{ filter:drop-shadow(0 6px 0 rgba(0,0,0,.35)); transition:margin .1s; }
.bob{ animation:bob 2.1s ease-in-out infinite; }
.bob2{ animation:bob 2.6s ease-in-out infinite; }
.lunge{ margin-left:30px; }
.flash .px{ filter:brightness(2.6) saturate(.4); }
.plate{ width:100%; background:rgba(12,15,30,.86); border:2px solid var(--line); border-radius:8px; padding:6px 8px; display:flex; flex-direction:column; gap:4px; }
.pname{ font-size:11px; letter-spacing:1px; display:flex; justify-content:space-between; gap:6px; text-transform:uppercase; }
.psub{ font-size:9px; color:var(--dim); }
.vs{ align-self:center; margin-bottom:120px; font-size:20px; opacity:.3; z-index:2; }
.apparait{ color:var(--dim); font-size:12px; padding-bottom:80px; animation:pulse 1.4s infinite; }
.floats{ position:absolute; inset:0; pointer-events:none; z-index:6; }
.float{ position:absolute; top:34%; font-weight:bold; font-size:13px; text-shadow:1px 1px 0 #000; animation:floatUp .9s ease-out forwards; white-space:nowrap; }
.float.dmg{ color:#fff; } .float.crit{ color:var(--gold); font-size:17px; }
.float.gold{ color:var(--gold); font-size:11px; top:48%; }
.float.hurt{ color:var(--rouge); } .float.token{ color:var(--violet); font-size:15px; top:26%; }
.bar{ position:relative; background:#10142a; border:2px solid #0b0e1e; border-radius:3px; overflow:hidden; width:100%; }
.barfill{ height:100%; transition:width .12s linear; }
.bartxt{ position:absolute; inset:0; display:flex; align-items:center; justify-content:center; font-size:9px; letter-spacing:.5px; text-shadow:1px 1px 0 #000; color:#fff; }
.statsrow{ display:flex; flex-wrap:wrap; gap:6px; }
.schip{ background:var(--panel); border:2px solid var(--line); border-radius:6px; padding:3px 8px; font-size:11px; color:var(--dim); }
.schip b{ color:var(--txt); }
.chips{ display:flex; gap:6px; overflow-x:auto; padding:2px; }
.chip{ flex:0 0 auto; background:var(--panel2); border:2px solid var(--line); border-radius:8px; padding:5px 10px; font-size:11px; color:var(--txt); cursor:pointer; box-shadow:0 3px 0 #0c0f1e; }
.chip:active{ transform:translateY(2px); box-shadow:none; }
.chip.on{ box-shadow:0 0 10px rgba(126,224,110,.25), 0 3px 0 #0c0f1e; }
.tabsbar{ display:flex; border:2px solid var(--line); border-radius:10px; overflow:hidden; background:var(--panel); }
.tabbtn{ flex:1; background:none; border:none; border-bottom:3px solid transparent; color:var(--dim); padding:9px 4px; font-size:11px; letter-spacing:1px; text-transform:uppercase; cursor:pointer; position:relative; }
.tabbtn.on{ color:var(--leaf); border-bottom-color:var(--leaf); background:var(--panel2); }
.tabbtn .bulle{ position:absolute; top:4px; right:8px; width:8px; height:8px; background:var(--gold); border-radius:50%; animation:pulse 1s infinite; }
.panneau{ background:var(--panel); border:2px solid var(--line); border-radius:10px; padding:12px; min-height:240px; }
.note{ font-size:11px; color:var(--dim); background:rgba(0,0,0,.22); border-left:3px solid var(--line); border-radius:4px; padding:7px 9px; margin:0 0 10px; }
.grid2{ display:grid; grid-template-columns:1fr 1fr; gap:10px; }
@media (max-width:680px){ .grid2{ grid-template-columns:1fr; } .combattant{ width:46%; } }
.carte{ background:var(--panel2); border:2px solid #39406a; border-radius:10px; padding:10px; display:flex; flex-direction:column; gap:5px; }
.carte.active{ box-shadow:0 0 12px rgba(126,224,110,.18); }
.ctitre{ display:flex; align-items:center; gap:6px; font-size:13px; letter-spacing:.5px; }
.ctitre.small{ font-size:12px; }
.niv{ margin-left:auto; font-size:10px; color:var(--dim); letter-spacing:.5px; }
.badge{ margin-left:6px; font-size:9px; letter-spacing:1px; }
.cinfo{ font-size:11px; }
.cinfo.it{ font-style:italic; }
.cinfo.sub{ font-size:11px; }
.dim{ color:var(--dim); }
.crow{ display:flex; gap:6px; flex-wrap:wrap; margin-top:4px; }
.btn{ background:var(--panel); border:2px solid var(--line); border-radius:7px; color:var(--txt); padding:6px 10px; font-size:11px; letter-spacing:.5px; cursor:pointer; box-shadow:0 3px 0 #0c0f1e; text-transform:uppercase; }
.btn:not(:disabled):active{ transform:translateY(2px); box-shadow:none; }
.btn:disabled{ opacity:.38; cursor:default; }
.btn.on{ border-color:var(--leaf); color:var(--leaf); }
.btn.ghost{ background:transparent; }
.btn.evo{ border-color:var(--violet); color:var(--violet); }
.btn.danger{ border-color:var(--rouge); color:var(--rouge); }
.btn.big{ padding:10px; font-size:13px; margin-top:8px; border-color:var(--leaf); color:var(--leaf); }
.tokrow{ font-size:13px; margin-bottom:6px; }
.tok{ color:var(--violet); font-weight:bold; }
.pend{ color:var(--gold); font-size:10px; animation:pulse 1.2s infinite; margin-left:6px; }
.jauge{ margin-bottom:12px; }
.jhead{ display:flex; align-items:baseline; gap:8px; font-size:12px; margin-bottom:3px; flex-wrap:wrap; }
.jico{ font-size:14px; } .jnom{ letter-spacing:1px; text-transform:uppercase; }
.jsrc{ color:var(--dim); font-size:10px; } .jpal{ margin-left:auto; font-size:11px; }
.jeff{ font-size:10px; color:var(--dim); margin-top:3px; }
.paperdoll{ display:grid; grid-template-columns:repeat(auto-fill,minmax(200px,1fr)); gap:8px; margin-bottom:10px; }
.slot{ display:flex; gap:8px; align-items:center; background:var(--panel2); border:2px solid #39406a; border-radius:8px; padding:6px 8px; }
.slot.locked{ opacity:.55; }
.slotnom{ font-size:10px; color:var(--dim); text-transform:uppercase; letter-spacing:.5px; }
.slotit{ font-size:11px; } .slotvide{ font-size:10px; color:var(--dim); font-style:italic; }
.invhead{ display:flex; justify-content:space-between; align-items:center; gap:8px; margin:8px 0; font-size:12px; flex-wrap:wrap; }
.invlist{ display:flex; flex-direction:column; }
.invrow{ display:flex; gap:8px; align-items:center; padding:6px 6px; border-bottom:1px solid #2c335a; cursor:pointer; flex-wrap:wrap; }
.invrow:hover{ background:rgba(255,255,255,.04); }
.invrow.selrow{ outline:2px solid var(--cyan); border-radius:6px; }
.invnom{ font-size:12px; }
.invstats{ font-size:10px; flex-basis:100%; padding-left:28px; }
.detail{ margin-bottom:10px; }
.statline{ display:flex; justify-content:space-between; }
.diff.up{ color:var(--leaf); } .diff.down{ color:var(--rouge); } .diff.eq{ color:var(--dim); }
.bestrow{ display:flex; gap:10px; align-items:center; }
.tierpips{ display:flex; gap:3px; margin:3px 0; }
.tp{ width:9px; height:9px; border:2px solid var(--line); background:#12162a; border-radius:2px; }
.tp.on{ background:var(--leaf); border-color:var(--leaf); }
.voile{ position:fixed; inset:0; background:rgba(8,10,22,.82); display:flex; align-items:center; justify-content:center; z-index:60; padding:14px; }
.modale{ width:min(540px,94vw); max-height:88vh; overflow:auto; background:var(--panel); border:3px solid var(--line); border-radius:12px; padding:16px; display:flex; flex-direction:column; gap:7px; }
.mtitre{ font-size:20px; letter-spacing:4px; text-align:center; text-shadow:2px 2px 0 #0c0f1e; }
.mstats{ display:grid; grid-template-columns:1fr 1fr; gap:5px; font-size:12px; }
.msep{ font-size:10px; letter-spacing:2px; color:var(--dim); border-top:1px solid #333a63; padding-top:9px; margin-top:5px; }
.mgain{ font-size:12px; }
.ta{ width:100%; min-height:56px; background:#12162a; color:var(--txt); border:2px solid var(--line); border-radius:6px; font-family:inherit; font-size:10px; padding:6px; }
.toasts{ position:fixed; top:12px; left:50%; transform:translateX(-50%); display:flex; flex-direction:column; gap:6px; z-index:70; pointer-events:none; width:min(480px,92vw); }
.toast{ background:rgba(15,19,38,.94); border:2px solid var(--line); border-left-width:5px; border-radius:8px; padding:7px 10px; font-size:11px; animation:toastIn .18s ease-out; }
.charge{ min-height:60vh; display:flex; align-items:center; justify-content:center; color:var(--dim); letter-spacing:2px; }
@keyframes bob{ 0%,100%{ transform:translateY(0);} 50%{ transform:translateY(-5px);} }
@keyframes pulse{ 0%,100%{ opacity:1;} 50%{ opacity:.4;} }
@keyframes floatUp{ from{ transform:translateY(0); opacity:1;} to{ transform:translateY(-48px); opacity:0;} }
@keyframes luciole{ 0%,100%{ transform:translate(0,0); opacity:.2;} 25%{ opacity:1;} 50%{ transform:translate(14px,-26px); opacity:.5;} 75%{ opacity:.9;} }
@keyframes toastIn{ from{ transform:translateY(-8px); opacity:0;} to{ transform:translateY(0); opacity:1;} }
@media (prefers-reduced-motion: reduce){ .bob,.bob2,.pip.cur,.pend,.luciole,.apparait{ animation:none; } }
.titre,.mtitre,.vsband,.tabbtn,.pname,.btn.big,.zlabel,.msep,.jnom,.slotnom,.ctitel{ font-family:'Cinzel', Georgia, serif; }
.titre{ font-size:24px; } .mtitre{ font-size:20px; } .tabbtn{ font-size:15px; letter-spacing:1px; } .pname{ font-size:12px; } .btn.big{ font-size:15px; }
.cinfo{ font-size:15.5px; } .note{ font-size:15px; } .btn{ font-size:13.5px; } .schip{ font-size:16px; }
.invnom{ font-size:16px; } .invstats{ font-size:14px; } .slotit{ font-size:14.5px; } .slotvide{ font-size:13.5px; } .slotnom{ font-size:11.5px; }
.jhead{ font-size:18px; margin-bottom:1px; } .jsrc{ font-size:15px; } .jpal{ font-size:16px; font-weight:700; } .jeff{ font-size:15px; margin-top:1px; font-weight:600; } .niv{ font-size:13px; }
.jnom{ font-weight:700; } .jauge{ margin-bottom:5px; }
.bartxt{ font-size:13.5px; }
.jeff,.jsrc{ color:#e8edff; }
.bartxt{ font-size:15px; font-weight:700; letter-spacing:.6px; color:#fff; text-shadow:0 1px 2px #000, 0 0 5px #000, 1px 1px 0 #000; }
.pend{ font-size:13px; }
.toast{ font-size:15px; } .bartxt{ font-size:11px; } .mgain{ font-size:15px; } .mstats{ font-size:15px; } .cinfo.sub{ font-size:14.5px; }
.zlabel{ font-size:16px; } .chip{ font-size:13.5px; font-family:'Jost', 'Segoe UI', sans-serif; font-weight:600; }
.ta{ font-family:ui-monospace, 'Courier New', monospace; }
.note{ background:rgba(0,0,0,.34); color:#f0f3ff; margin:0 0 6px; padding:5px 9px; }
.schip{ color:#f0f3ff; }
.invstats,.slotvide{ color:#dbe2fa; }
.jauge{ margin-bottom:8px; }
.panneau{ padding:8px 12px; }
.tabbtn{ padding:7px 4px; }
.topbar{ padding:6px 12px; }
.toast{ padding:4px 9px; font-size:14px; }
.entete{ display:flex; align-items:baseline; justify-content:center; gap:12px; flex:0 0 auto; }
.titre{ font-size:16px; letter-spacing:5px; margin:0; }
.stitre{ font-size:8px; letter-spacing:2px; }
.carte{ padding:8px; gap:3px; }
.topbar,.scene,.tabsbar{ flex:0 0 auto; }
.colonnes{ display:grid; grid-template-columns:minmax(0,1.1fr) minmax(380px,0.9fr); gap:8px; align-items:stretch; flex:1; min-height:0; }
.colG{ display:flex; flex-direction:column; gap:8px; min-width:0; min-height:0; }
.colG .panneau{ flex:1; min-height:0; overflow-y:auto; }
.trx ::-webkit-scrollbar{ width:9px; height:9px; }
.trx ::-webkit-scrollbar-track{ background:transparent; }
.trx ::-webkit-scrollbar-thumb{ background:var(--line); border-radius:5px; }
.trx ::-webkit-scrollbar-thumb:hover{ background:#4d568a; }
.zoneDroite{ display:grid; grid-template-columns:1fr 1fr; grid-template-rows:auto minmax(0,1fr); gap:8px; align-items:stretch; }
.pcote{ min-height:0; }
.pstats{ display:flex; flex-direction:column; overflow-y:auto; }
.zoneDroite .chips{ flex-wrap:wrap; overflow:visible; }
.pcmd .cmdcol{ display:flex; flex-direction:column; gap:8px; }
.pjournal{ grid-column:1 / -1; display:flex; flex-direction:column; min-height:120px; overflow:hidden; }
.pnotifs{ width:100%; flex:0 0 188px; min-height:0; display:flex; flex-direction:column; }
.notiflist{ display:flex; flex-direction:column; gap:4px; flex:1; min-height:0; overflow-y:auto; }
.zoneDroite{ min-height:0; }
.pstats{ min-height:0; }
.ctitel{ font-size:14px; letter-spacing:2px; color:var(--dim); text-transform:uppercase; border-bottom:1px solid var(--line); padding-bottom:6px; margin-bottom:9px; }
.statcol{ display:flex; flex-direction:column; gap:6px; margin-bottom:14px; }
.statcol .schip{ display:flex; justify-content:space-between; align-items:baseline; }
.colM .chips{ flex-wrap:wrap; overflow:visible; }
.loglist{ display:flex; flex-direction:column; gap:4px; font-size:15px; flex:1; min-height:0; overflow-y:auto; }
.loglist div{ text-shadow:1px 1px 0 #000; }
.cmdcol .btn{ width:100%; text-align:center; padding:10px; }
.topbar{ display:grid; grid-template-columns:1fr auto 1fr; align-items:center; gap:10px; }
.tbcentre{ display:flex; gap:14px; align-items:center; justify-content:center; flex-wrap:wrap; }
.tbgauche{ display:flex; align-items:center; gap:10px; flex-wrap:wrap; }
.tbgauche .tbside{ font-size:18px; }
.reschip{ border:2px solid #c9a227; border-radius:9px; padding:2px 11px; background:rgba(0,0,0,.28); box-shadow:inset 0 0 8px rgba(201,162,39,.12); }
.tbdroite{ display:flex; justify-content:flex-end; }
.monnaie{ display:inline-flex; align-items:center; gap:6px; }
.piece{ display:inline-block; border-radius:50%; border:2px solid rgba(0,0,0,.55); box-shadow:0 1px 3px rgba(0,0,0,.6), inset -1px -2px 3px rgba(0,0,0,.35); flex:0 0 auto; }
.pcmd .chips{ flex-wrap:wrap; overflow:visible; }
.tbside{ font-size:22px; font-weight:700; display:flex; align-items:center; gap:7px; }
.tbside .pend{ font-size:18px; margin-left:0; }
.tbdim{ font-size:16px; color:var(--dim); font-weight:500; }
.tbdroite{ justify-content:flex-end; }
.slottag{ font-size:11px; text-transform:uppercase; letter-spacing:.5px; border:1px solid var(--line); border-radius:4px; padding:1px 6px; font-family:'Cinzel', Georgia, serif; }
.vendrow{ display:flex; gap:5px; align-items:center; flex-wrap:wrap; }
.togline{ display:flex; gap:5px; align-items:center; flex-wrap:wrap; }
.colonnes.modeEquip{ grid-template-columns:minmax(0,1fr) 340px; }
.colonnes.modeEquip .zoneDroite{ grid-template-columns:1fr; }
.colonnes.modeEquip .colG .panneau{ display:flex; flex-direction:column; overflow:hidden; flex:0 0 auto; }
.equipzone{ display:grid; grid-template-columns:minmax(240px,1fr) auto minmax(240px,1fr) 152px; gap:10px; flex:0 0 auto; min-height:0; align-items:stretch; }
.eqpanel{ border:2px solid var(--line); border-radius:12px; background:rgba(0,0,0,.16); padding:8px 10px; display:flex; flex-direction:column; min-height:0; min-width:0; }
.eqinfo{ overflow-y:auto; }
.eqdetail{ border-left:3px solid var(--line); padding-left:8px; display:flex; flex-direction:column; gap:4px; }
.eqdoll{ align-items:center; }
.eqdoll .doll{ margin-bottom:0; flex:0 0 auto; margin-top:4px; }
.eqinv .invgrid{ overflow-y:auto; max-height:46vh; min-height:0; align-content:start; }
.eqinv .invhead{ margin:4px 0; }
.eqbtns{ display:flex; flex-direction:column; gap:10px; width:152px; }
.eqbtn{ width:100%; padding:12px 8px; border:2px solid var(--line); border-radius:12px; background:var(--panel2); cursor:pointer; color:var(--txt); display:flex; flex-direction:column; align-items:center; justify-content:center; gap:5px; font-size:22px; box-shadow:0 3px 0 #0c0f1e; }
.eqbtn:hover{ border-color:var(--gold); }
.eqbtn:active{ transform:translateY(2px); box-shadow:none; }
.eqbtn small{ font-size:11.5px; font-family:'Cinzel', Georgia, serif; letter-spacing:.5px; color:var(--txt); white-space:normal; line-height:1.3; text-align:center; }
.modale.large{ width:min(880px,94vw); }
.ctitel2{ font-family:'Cinzel', Georgia, serif; font-size:11.5px; letter-spacing:1.5px; text-transform:uppercase; margin:2px 0 4px; }
.eqdoll .dollmid{ flex:0 1 270px; min-width:220px; padding:16px 18px; }
.arbretronc{ font-family:'Cinzel', Georgia, serif; text-align:center; font-size:15px; letter-spacing:2px; color:#ffe08a; border:2px solid #c9a227; border-radius:10px; padding:7px; margin-bottom:10px; background:rgba(201,162,39,.07); }
.arbre{ display:grid; grid-template-columns:repeat(5, minmax(0,1fr)); gap:8px; align-items:start; }
.branche{ min-width:0; }
.brtitre{ font-family:'Cinzel', Georgia, serif; font-size:14px; font-weight:700; text-align:center; margin-bottom:6px; }
.brtheme{ font-family:'Jost', sans-serif; font-size:11.5px; color:var(--dim); font-weight:500; letter-spacing:0; }
.brnodes{ display:flex; flex-direction:column; gap:5px; border-left:2px solid var(--line); padding-left:8px; margin-left:4px; }
.node{ position:relative; border:2px solid #39406a; border-radius:9px; background:var(--panel2); padding:5px 7px; cursor:pointer; }
.node::before{ content:""; position:absolute; left:-10px; top:50%; width:8px; height:2px; background:inherit; border-top:2px solid #39406a; }
.node.verrou{ opacity:.38; cursor:default; }
.node.cher{ opacity:.72; }
.node.dispo{ border-color:#8be05f; box-shadow:0 0 7px rgba(139,224,95,.25); }
.node.maxed{ background:rgba(255,224,138,.09); cursor:default; }
.nodenom{ font-family:'Cinzel', Georgia, serif; font-size:12px; font-weight:700; }
.nodedesc{ font-size:12.5px; color:var(--dim); line-height:1.25; }
.nodebas{ font-size:12px; color:#ffe08a; margin-top:2px; }
.echocard{ min-width:0; }
.dstance{ font-family:'Cinzel', Georgia, serif; font-size:15px; font-weight:700; margin-top:8px; text-align:center; }
.pstats .statcol{ margin-bottom:8px; gap:5px; }
.doll{ display:flex; gap:14px; justify-content:center; align-items:stretch; margin-bottom:10px; }
.dollcol{ display:flex; flex-direction:column; gap:6px; }
.dollmid{ display:flex; flex-direction:column; align-items:center; justify-content:center; gap:10px; flex:0 1 340px;
  background:radial-gradient(300px 200px at 50% 40%, rgba(126,224,110,.10) 0%, rgba(0,0,0,.28) 70%); border:2px solid var(--line); border-radius:16px; padding:10px 20px; }
.dcase{ position:relative; width:82px; border:2px solid #39406a; border-radius:10px; background:var(--panel2); display:flex; flex-direction:column; align-items:center; padding:7px 4px 4px; cursor:pointer; }
.dcase:hover{ background:#2c345c; }
.dcase.locked{ opacity:.45; cursor:default; }
.dcase.selrow{ outline:2px solid var(--cyan); }
.dcase .px{ margin:0 auto; }
.dnom{ font-size:9px; color:var(--dim); text-transform:uppercase; letter-spacing:.3px; text-align:center; line-height:1.15; margin-top:4px; font-family:'Cinzel', Georgia, serif; }
.dlock{ position:absolute; top:2px; right:3px; font-size:11px; }
.dtier{ position:absolute; top:2px; left:4px; font-size:10px; color:var(--gold); font-weight:700; }
.invgrid{ display:grid; grid-template-columns:repeat(auto-fill, minmax(58px, 1fr)); gap:6px; }
.icell{ position:relative; aspect-ratio:1/1; border:2px solid #39406a; border-radius:9px; background:rgba(0,0,0,.25); display:flex; align-items:center; justify-content:center; cursor:pointer; }
.icell:hover{ background:rgba(255,255,255,.06); }
.icell.vide{ opacity:.3; cursor:default; }
.icell.selrow{ outline:2px solid var(--cyan); }
.ilock{ position:absolute; top:0px; right:2px; font-size:10px; }
.itier{ position:absolute; bottom:0px; left:4px; font-size:9.5px; color:var(--gold); font-weight:700; }
.filtrico{ display:inline-flex; align-items:center; gap:4px; }
.ensrow{ padding-left:16px; }
.grptitre{ margin-top:4px; }
.inpt{ background:#12162a; border:2px solid var(--line); border-radius:6px; color:var(--txt); padding:2px 8px; font-family:inherit; font-size:14px; width:180px; }
.btn.mini.danger{ border-color:var(--rouge); color:var(--rouge); }
.numin{ width:76px; background:#12162a; border:2px solid var(--line); border-radius:6px; color:var(--txt); padding:3px 6px; font-family:inherit; font-size:15px; }
@media (max-width:1560px){ .zoneDroite{ grid-template-columns:280px 330px; } }
@media (max-width:1200px){ .colonnes{ grid-template-columns:1fr; } .colcote{ position:static; } .zoneDroite{ grid-template-columns:1fr 1fr; } .pstats,.pjournal{ height:330px; } }
.panneau{ border-radius:16px; background:rgba(26,29,50,.92); }
.carte{ border-radius:14px; } .btn{ border-radius:10px; } .topbar{ border-radius:14px; background:rgba(26,29,50,.92); }
.scene{ border-radius:18px; border-color:#4a5178; }
.plate{ border-radius:12px; background:rgba(10,12,24,.74); }
.fond{ position:absolute; inset:0; width:100%; height:100%; }
.vsband{ position:absolute; top:0; left:0; right:0; z-index:4; display:flex; align-items:center; padding:9px 14px; background:linear-gradient(rgba(8,10,18,.74), rgba(8,10,18,.32)); font-size:11px; color:#fff; text-shadow:2px 2px 0 #000; }
.vsband .g{ flex:1; text-align:center; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }
.vsm{ flex:0 0 42px; text-align:center; opacity:.85; font-size:9px; }
.logbox{ background:rgba(14,16,30,.88); border:2px solid var(--line); border-radius:14px; padding:8px 12px; font-size:11px; display:flex; flex-direction:column; gap:3px; min-height:74px; justify-content:flex-end; }
.logbox div{ white-space:nowrap; overflow:hidden; text-overflow:ellipsis; text-shadow:1px 1px 0 #000; }
.float.heal{ color:#7ef29a; }
.combattant{ padding-bottom:28px; }
.rabchip{ color:#79d0c3; }
.modale{ border-radius:16px; background:rgba(26,29,50,.97); }
.zarrow{ background:var(--panel2); border:2px solid var(--line); border-radius:8px; color:var(--txt); width:26px; height:24px; cursor:pointer; font-size:10px; padding:0; margin:0 4px; vertical-align:middle; }
.zarrow:disabled{ opacity:.3; cursor:default; }
.btn.mini{ padding:4px 7px; font-size:10px; text-transform:none; }
`;

/* Accès de test headless (Node) — aucun effet en jeu. */
export const __test = {
  metaInitiale, runInitiale, depuisSave, versSave, heroStats, tick, creerMonstre,
  calcEclats, performRenaissance, renaissanceDispo, renaissanceVisible,
  acheterNode, coutNode, bonusOrigine, malusSerments, coutReel,
  generateEcho, generateEchoOptions, choisirEcho, equiperEcho, retirerEcho, recyclerEcho, echoSlotsMax,
  basculerSerment, sermentsDebloques, sermentsMax, basculerAlt, altsDebloquees, altActive, altMods,
  zScale, tuerMonstre, transcender, statsArmeT,
  ZONES, MONSTRES, NODES, NODE_BY_ID, BRANCHES, SERMENTS, ALTERATIONS, GAUGES, RARS, ECHO_TYPES, ARMES_T, SLOTS,
};

export default function Transcendance() {
  const Gref = useRef(null);
  const [, setT] = useState(0);
  const maj = () => setT((t) => t + 1);
  const [tab, setTab] = useState("boutique");
  const [sel, setSel] = useState(null);
  const [opts, setOpts] = useState(false);
  const [notes, setNotes] = useState(false);
  const [majDispo, setMajDispo] = useState(null);
  const [choixVu, setChoixVu] = useState(0);
  const [pret, setPret] = useState(false);
  const lastSave = useRef(0);

  useEffect(() => {
    let mort = false;
    charger().then((d) => {
      if (mort) return;
      const r = depuisSave(d);
      Gref.current = { meta: r.meta, run: r.run, st: null, floats: [], toasts: [], log: [], now: Date.now(), heroAtk: 0, monAtk: 0, saveNow: false, dropFlag: false };
      Gref.current.st = heroStats(Gref.current);
      if (cmpVer(VERSION, r.meta.versionVue) > 0) setNotes(true);
      setPret(true);
      if (typeof window !== "undefined" && window.verifMaj && window.majJeu) {
        window.verifMaj().then((v) => { if (!mort && v && v.ok && cmpVer(v.version, VERSION) > 0) setMajDispo(v.version); }).catch(() => {});
      }
    });
    return () => { mort = true; };
  }, []);

  useEffect(() => {
    if (!pret) return;
    const iv = setInterval(() => {
      const G = Gref.current; if (!G) return;
      G.now = Date.now();
      const v = G.meta.opts.vitesse || 1;
      for (let i = 0; i < v; i++) tick(G, 0.1);
      G.floats = G.floats.filter((f) => G.now - f.t < 900);
      if (G.run.over && G.meta.opts.autoRelance && G.now - (G.run.overT || 0) > 1600) {
        const gg = G.run.gains || { paliers: [], tokens: 0 };
        toast(G, "Auto-relance · +" + gg.paliers.length + " palier(s) · +" + gg.tokens + " ⬡", "#8be05f");
        relancer(G);
      }
      if (G.saveNow || G.now - lastSave.current > 20000) { G.saveNow = false; lastSave.current = G.now; sauver(versSave(G)); }
      setT((t) => t + 1);
    }, 100);
    return () => clearInterval(iv);
  }, [pret]);

  if (!pret) return <div className="trx"><style>{CSS}</style><div className="charge">CHARGEMENT DE LA FORÊT…</div></div>;
  const G = Gref.current;
  const run = G.run, st = G.st || heroStats(G);
  /* Échelle : auto = adaptée à la hauteur de la fenêtre (réf. 1240px de design,
     plancher 72%), sinon valeur forcée dans Paramètres > Graphismes.
     Recalculée à chaque rendu — le tick 10 Hz suit les redimensionnements. */
  const echPref = G.meta.opts.echelle || "auto";
  const zoomV = echPref !== "auto" ? echPref : Math.round(Math.max(0.72, Math.min(1, (typeof window !== "undefined" ? window.innerHeight : 1240) / 1240)) * 1000) / 1000;
  return (
    <div className="trx" style={zoomV !== 1 ? { zoom: zoomV, height: "calc(100vh / " + zoomV + ")" } : null}>
      <style>{CSS}</style>
      <div className="entete"><span className="titre">TRANSCENDANCE</span><span className="stitre">idle roguelite — v{VERSION}</span></div>
      <div className="topbar">
        <span className="tbgauche">
          <span className="tbside reschip tokc">⬡ {G.meta.tokens}{run.tokensPend > 0 ? <span className="pend">+{run.tokensPend}</span> : null} <span className="tbdim">tokens</span></span>
          <span className="tbside reschip" style={{ color: "#b9c2d9" }}>⚒ {fmt(G.meta.ferraille)} <span className="tbdim">ferraille</span></span>
          <span className="tbside reschip" style={{ color: "#ff3b5c" }}>✦ {G.meta.essence} <span className="tbdim">essence{G.meta.essence > 1 ? "s" : ""} résiduelle{G.meta.essence > 1 ? "s" : ""}</span></span>
          {renaissanceVisible(G.meta) ? <span className="tbside reschip" style={{ color: "#ffe08a" }}>❖ {fmt(G.meta.origine.eclats)} <span className="tbdim">éclats</span></span> : null}
        </span>
        <span className="tbcentre">
          <span className="zlabel">
            <button className="zarrow" disabled={run.zoneIdx <= 0 || run.over} onClick={() => { changerZone(G, -1); maj(); }} title="Zone précédente">◀</button>
            <b style={{ color: ZONES[run.zoneIdx].col }}>{ZONES[run.zoneIdx].nom}</b> · niv {run.niveau}/10
            <button className="zarrow" disabled={run.zoneIdx >= run.debloque || run.zoneIdx >= ZONES.length - 1 || run.over} onClick={() => { changerZone(G, 1); maj(); }} title="Zone suivante (débloquée en battant le Gardien)">▶</button>
          </span>
          <Pips kills={run.kills} />
        </span>
        <span className="tbdroite"><span className="tbside reschip gold"><Monnaie v={run.gold} /></span></span>
      </div>
      <Scene G={G} />
      <div className="tabsbar">
        {[["boutique", "Boutique"], ["stances", "Stances"], ["equip", "Équipement"], ["best", "Bestiaire"]].concat(renaissanceVisible(G.meta) ? [["origine", "☀ Origine"]] : []).map(([id, nom]) => (
          <button key={id} className={"tabbtn" + (tab === id ? " on" : "")} onClick={() => { setTab(id); if (id === "equip") { G.dropFlag = false; } }}>
            {nom}{id === "equip" && G.dropFlag ? <span className="bulle" /> : null}
          </button>
        ))}
      </div>
      <div className={"colonnes" + (tab === "equip" ? " modeEquip" : "")}>
        <div className="colG">
          <div className="panneau">
            {tab === "boutique" ? <TabBoutique G={G} maj={maj} /> : null}
            {tab === "stances" ? <TabStances G={G} maj={maj} /> : null}
            {tab === "equip" ? <TabEquipement G={G} sel={sel} setSel={setSel} maj={maj} /> : null}
            {tab === "best" ? <TabBestiaire G={G} maj={maj} /> : null}
            {tab === "origine" ? <TabOrigine G={G} maj={maj} /> : null}
          </div>
        </div>
        <div className="zoneDroite colcote">
          <div className="panneau pcote pstats">
            <div className="ctitel">Statistiques de combat</div>
            <div className="ctitel2" style={{ color: "#ff9d5c" }}>Offensives</div>
            <div className="statcol">
              <span className="schip">⚔ ATQ <b>{fmt(st.atk)}</b></span>
              <span className="schip">» Vit. attaque <b>{String(Math.round(st.as * 100) / 100).replace(".", ",")}/s</b></span>
              <span className="schip">✳ Critique <b>{Math.round(st.critC)}% ×{String(Math.round(st.critD) / 100).replace(".", ",")}</b></span>
              <span className="schip">👑 Dégâts boss <b>×{String(Math.round(st.vsBoss * 100) / 100).replace(".", ",")}</b></span>
            </div>
            <div className="ctitel2" style={{ color: "#5fc25f" }}>Défensives</div>
            <div className="statcol">
              <span className="schip">♥ PV <b>{fmt(st.hpMax)}</b></span>
              <span className="schip">⛨ Réduction <b>{Math.round(st.red * 100)}%</b></span>
            </div>
            <div className="ctitel2" style={{ color: "#ffd45e" }}>Bonus</div>
            <div className="statcol">
              <span className="schip">◆ Or <b>×{String(Math.round(st.gold * 100) / 100).replace(".", ",")}</b></span>
              <span className="schip">◎ Remplissage jauges <b>×{String(Math.round(st.gaugeF * 100) / 100).replace(".", ",")}</b></span>
            </div>
            <div className="ctitel2" style={{ color: "#c59bff" }}>Divers</div>
            <div className="statcol">
              <span className="schip">🏆 Record global <b>niv {G.meta.vie.meilleure}</b></span>
              <span className="schip">↻ Runs jouées <b>{G.meta.vie.runs}</b></span>
            </div>
          </div>
          <div className="panneau pcmd" style={tab === "equip" ? { display: "none" } : null}>
            <div className="ctitel">Stances</div>
            <div className="chips" style={{ marginBottom: 12 }}>
              {STANCES.map((s) => (
                <button key={s.id} className={"chip" + (run.stance === s.id ? " on" : "")} style={run.stance === s.id ? { borderColor: s.col, color: s.col } : null}
                  onClick={() => { run.stance = s.id; sfx("equip", G.meta.opts.sfx); maj(); }}>
                  {s.ico} {s.nom}
                </button>
              ))}
            </div>
            <div className="ctitel">Commandes</div>
            <div className="cmdcol">
              <button className={"btn" + (G.meta.opts.autoRelance ? " on" : "")} title="AFK farm : relance automatiquement une run après la mort" onClick={() => { G.meta.opts.autoRelance = !G.meta.opts.autoRelance; G.saveNow = true; maj(); }}>⟳ AFK {G.meta.opts.autoRelance ? "· ACTIF" : ""}</button>
              <button className={"btn" + (G.meta.opts.autoZone ? " on" : "")} title="Passe automatiquement à la zone suivante après le Gardien" onClick={() => { G.meta.opts.autoZone = !G.meta.opts.autoZone; G.saveNow = true; maj(); }}>⇉ ZONE {G.meta.opts.autoZone ? "· ACTIF" : ""}</button>
              <EncaisserBtn G={G} maj={maj} />
              <button className="btn" onClick={() => setOpts(true)}>⚙ PARAMÈTRES</button>
            </div>
          </div>
          <div className="panneau pjournal" style={tab === "equip" ? { display: "none" } : null}>
            <div className="ctitel">Journal de combat</div>
            <div className="loglist">
              {(G.log || []).length === 0 ? <div className="dim">Le combat commence…</div> : null}
              {(G.log || []).slice(-18).map((l) => <div key={l.id} style={{ color: l.col }}>{l.txt}</div>)}
            </div>
          </div>
        </div>
      </div>
      <div className="panneau pnotifs" style={tab === "equip" ? { display: "none" } : null}>
        <div className="ctitel">Notifications</div>
        <div className="notiflist">
          {G.toasts.length === 0 ? <div className="dim">Rien à signaler pour l'instant.</div> : null}
          {G.toasts.slice(-10).reverse().map((t) => <div key={t.id} className="toast" style={{ borderLeftColor: t.col }}>{t.txt}</div>)}
        </div>
      </div>
      {!G.meta.opts.autoRelance ? <ModaleFin G={G} maj={maj} /> : null}
      {opts ? <ModaleOpts G={G} fermer={() => setOpts(false)} maj={maj} voirNotes={() => { setOpts(false); setNotes(true); }} /> : null}
      {notes ? <ModaleNouveautes G={G} fermer={() => { G.meta.versionVue = VERSION; G.saveNow = true; setNotes(false); }} /> : null}
      {majDispo && !notes ? <ModaleMaj G={G} version={majDispo} fermer={() => setMajDispo(null)} maj={maj} /> : null}
      {!notes && G.meta.origine.echoChoix && G.meta.origine.echoChoix.length > 0 && G.meta.origine.echoChoix[0].id !== choixVu ? (
        <div className="voile">
          <div className="modale large" onClick={(e) => e.stopPropagation()}>
            <div className="mtitre" style={{ color: "#7a6aff" }}>L'ORIGINE TE PROPOSE UN ÉCHO</div>
            <div className="cinfo dim" style={{ textAlign: "center" }}>Choisis-en un seul — les autres se dissiperont.</div>
            <div className="grid2">{G.meta.origine.echoChoix.map((e) => <EchoCard key={e.id} G={G} e={e} maj={maj} mode="choix" />)}</div>
            <button className="btn ghost" onClick={() => setChoixVu(G.meta.origine.echoChoix[0].id)}>Plus tard (Origine → Échos)</button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
