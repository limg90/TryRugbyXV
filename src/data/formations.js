// Placements de départ réutilisés par les phases de jeu, les combinaisons et l'éditeur.
// Même repère que data/scenarios.js : x de 0 à 100 (on attaque vers x = 100), y de 0 à 70.
// Les adversaires (maillots rouges) portent leurs propres numéros.
// Les distances sont schématiques : on écarte les joueurs pour que chaque numéro reste lisible.

import { BASE_FORMATION } from './scenarios.js'

// Mêlée au milieu du terrain, introduction pour nous. Ligne de mêlée : x = 52.
export const NOUS_MELEE = BASE_FORMATION
export const ADV_MELEE = {
  3: [54, 21], 2: [54, 25], 1: [54, 29],
  5: [58, 23], 4: [58, 27],
  7: [57.5, 18.6], 6: [57.5, 31.4], 8: [62, 25],
  9: [55, 14.5],
  10: [65, 33], 12: [66, 40], 13: [66, 48], 11: [66, 57], 14: [66, 8], 15: [78, 36],
}

// Touche à 10 m de la ligne médiane, touche gauche (y = 0), lancer pour nous. Ligne de touche : x = 60.
export const NOUS_TOUCHE = {
  2: [60, -1.5],
  1: [58, 6], 4: [58, 10], 3: [58, 14], 6: [58, 18], 5: [58, 22], 8: [58, 26], 7: [58, 30],
  9: [54, 21],
  10: [49, 26], 12: [46, 34], 13: [43, 42], 14: [40, 52], 11: [48, 5], 15: [36, 32],
}
export const ADV_TOUCHE = {
  2: [64, 1.5],
  1: [62, 6], 4: [62, 10], 3: [62, 14], 6: [62, 18], 5: [62, 22], 8: [62, 26], 7: [62, 30],
  9: [65.5, 16],
  10: [71, 26], 12: [72, 34], 13: [72, 42], 11: [72, 52], 14: [71, 8], 15: [84, 32],
}

// Ruck au milieu du terrain (x = 50, y = 20) : ballon disponible, on attaque côté ouvert (vers y = 70).
export const BALLON_RUCK = [48.5, 20]
export const NOUS_RUCK = {
  6: [50, 18], 7: [50, 22.5], 9: [46.5, 20.5],
  1: [46, 12], 2: [43.5, 8.5], 3: [46, 16],
  4: [42, 13.5], 5: [41.5, 19.5], 8: [42.5, 24.5],
  10: [42, 28], 12: [40, 35], 13: [38, 42], 14: [34, 57], 15: [31, 47], 11: [38, 6],
}
export const ADV_RUCK = {
  4: [54, 18], 5: [54, 22.5], 9: [58, 19],
  6: [56, 13], 2: [57, 9],
  1: [56, 26], 7: [56, 31], 10: [56, 36], 12: [56, 41], 13: [56, 46], 11: [56, 53],
  3: [62, 27], 8: [61, 23], 14: [58, 5], 15: [70, 38],
}

// Défense : nous défendons (notre ligne d'essai est en x = 0), l'adversaire a le ballon au ruck en (52, 18).
export const NOUS_DEFENSE = {
  4: [48.5, 16.5], 5: [48.5, 20.5],
  2: [46, 11], 6: [44, 6],
  1: [46, 25], 3: [46, 30], 10: [46, 36], 12: [46, 42], 13: [46, 48], 14: [46, 55],
  9: [42, 19], 7: [41, 26], 8: [40, 33],
  11: [32, 14], 15: [28, 40],
}
export const ADV_ATTAQUE = {
  6: [52.5, 16.5], 7: [52.5, 20.5], 9: [56, 18.5],
  1: [56, 23.5], 10: [60, 27], 12: [62, 34], 13: [64, 41], 15: [66, 48], 11: [67, 55], 14: [66, 62],
}

// Décale tout un groupe de joueurs (dx, dy en mètres).
export function shift(players, dx, dy = 0, only = null) {
  const out = {}
  for (const [n, [x, y]] of Object.entries(players)) {
    out[n] = !only || only.includes(Number(n)) ? [x + dx, y + dy] : [x, y]
  }
  return out
}

// Modèles de départ proposés dans l'éditeur.
export const MODELES = [
  { id: 'ruck', titre: 'Ballon au ruck', players: NOUS_RUCK, opponents: ADV_RUCK, ball: { at: BALLON_RUCK } },
  { id: 'melee', titre: 'Mêlée', players: NOUS_MELEE, opponents: ADV_MELEE, ball: { carrier: 9 } },
  { id: 'touche', titre: 'Touche', players: NOUS_TOUCHE, opponents: ADV_TOUCHE, ball: { carrier: 2 } },
  { id: 'defense', titre: 'Défense', players: NOUS_DEFENSE, opponents: ADV_ATTAQUE, ball: { carrier: 9, team: 'adv' } },
  { id: 'sans', titre: 'Sans adversaires', players: NOUS_RUCK, opponents: {}, ball: { at: BALLON_RUCK } },
]
