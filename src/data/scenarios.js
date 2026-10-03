// Scénarios d'animation.
//
// Repère terrain (en mètres) : x de 0 (ligne d'essai défendue) à 100 (ligne d'essai attaquée),
// y de 0 à 70 (largeur, de la touche gauche à la touche droite vue de l'équipe qui attaque).
// L'équipe attaque toujours vers x = 100.
//
// Un scénario = des étapes. Chaque étape donne :
//   - duration : durée en secondes (à vitesse 1×) pour atteindre l'étape
//   - caption  : texte affiché pendant l'étape
//   - players  : positions des joueurs qui bougent { numero: [x, y] } (les autres restent en place)
//   - ball     : { carrier: numero } (ballon en main) ou { at: [x, y] } (ballon posé)
//   - highlight: numéros à mettre en avant (facultatif)
// La première étape doit placer les 15 joueurs.
// Les positions sont schématiques : on écarte un peu les joueurs pour que chaque maillot reste lisible.

export const BASE_FORMATION = {
  1: [50, 21], 2: [50, 25], 3: [50, 29],
  4: [46, 23], 5: [46, 27],
  6: [46.5, 18.6], 7: [46.5, 31.4], 8: [42, 25],
  9: [50.5, 16.8], 10: [40, 32],
  12: [37, 40], 13: [34, 48], 14: [31, 57],
  11: [40, 8], 15: [26, 35],
}

export const SCENARIOS = [
  {
    id: 'placement',
    titre: 'Placement sur mêlée',
    niveau: 'debutant',
    description: 'Où se place chaque joueur quand son équipe introduit en mêlée au milieu du terrain.',
    steps: [
      { duration: 0, caption: 'Mêlée au milieu du terrain : les 8 avants sont liés, le 9 introduit, les trois-quarts s’étagent en profondeur.', players: BASE_FORMATION, ball: { carrier: 9 } },
    ],
  },
  {
    id: 'mouvement-9-14',
    titre: 'Mouvement offensif 9 → 14',
    niveau: 'intermediaire',
    description: 'Le 9 sort le ballon, passe au 10, croisée avec le 12, décalage vers le 13 et passe à l’aile 14.',
    steps: [
      { duration: 0, caption: 'Le ballon est sorti de la mêlée. Le 9 le récupère derrière le 8.', players: { ...BASE_FORMATION, 9: [43.5, 29.5], 7: [47, 32] }, ball: { carrier: 9 }, highlight: [9] },
      { duration: 1.2, caption: 'Le 9 sort le ballon et passe au 10, qui attaque la ligne.', players: { 10: [44, 34], 12: [41.5, 41.5], 13: [38.5, 49.5], 14: [35.5, 58.5], 15: [31, 38] }, ball: { carrier: 10 }, highlight: [9, 10] },
      { duration: 1.4, caption: 'Croisée : le 10 court vers l’extérieur, le 12 rentre dans son dos et reçoit.', players: { 10: [49, 42], 12: [50, 36.5], 13: [43, 51], 14: [40, 60], 15: [37, 45], 9: [43, 30.5] }, ball: { carrier: 12 }, highlight: [10, 12] },
      { duration: 1.2, caption: 'Le 12 fixe son défenseur et décale vers le 13.', players: { 12: [55, 40], 13: [54, 50], 14: [49, 60], 15: [45, 48], 10: [51, 44] }, ball: { carrier: 13 }, highlight: [12, 13] },
      { duration: 1.2, caption: 'Le 13 attire le dernier défenseur et passe à l’aile 14.', players: { 13: [60, 53], 14: [61, 62.5], 15: [53, 53], 12: [58, 43] }, ball: { carrier: 14 }, highlight: [13, 14] },
      { duration: 3, caption: 'Le 14 accélère le long de la touche… Essai !', players: { 14: [103, 62], 13: [92, 55], 15: [88, 52], 12: [80, 46] }, ball: { carrier: 14 }, highlight: [14] },
    ],
  },
]

export const getScenario = (id) => SCENARIOS.find((s) => s.id === id)
