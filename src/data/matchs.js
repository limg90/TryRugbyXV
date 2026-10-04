// Mode match interactif : schémas tactiques découpés en décisions.
//
// Un match = une suite de décisions. Chaque décision donne :
//   - situation : étapes animées jusqu'au moment du choix (même format que data/scenarios.js,
//                 la première étape place les joueurs utiles), zoom facultatif
//   - question  : la question posée au joueur
//   - choix     : 3 options { texte, note, retour, suite } où note vaut 2 (meilleur choix),
//                 1 (possible) ou 0 (mauvais choix) et suite les étapes jouées après le choix.
// Les décisions servent aussi de questions « choix tactique » dans les quiz (data/quiz.js).

import { NOUS_MELEE, ADV_MELEE, NOUS_DEFENSE, ADV_ATTAQUE, NOUS_TOUCHE, ADV_TOUCHE, shift } from './formations.js'

export const NOTES = [
  { note: 2, label: 'Excellent choix', classe: 'good' },
  { note: 1, label: 'Choix possible', classe: 'mid' },
  { note: 0, label: 'Mauvais choix', classe: 'bad' },
]
export const noteInfo = (note) => NOTES.find((n) => n.note === note)

// Équipes proposées : couleurs des maillots (avants, trois-quarts). L'adversaire reste en rouge.
export const EQUIPES = [
  { id: 'bleus', nom: 'Les Bleus', avants: '#12284a', arrieres: '#2763d1' },
  { id: 'noir-or', nom: 'Noir et Or', avants: '#1d1d1f', arrieres: '#9a7210' },
  { id: 'violets', nom: 'Les Violets', avants: '#3d1866', arrieres: '#7a3fc0' },
  { id: 'orange', nom: 'Les Orange', avants: '#6b2c00', arrieres: '#c25a0c' },
]

// ---------------------------------------------------------------- Placements utiles

// Touche à 16 m de l'en-but adverse (ligne de touche en x = 84), lancer pour nous.
const TOUCHE_22_NOUS = shift(NOUS_TOUCHE, 24)
const TOUCHE_22_ADV = { ...shift(ADV_TOUCHE, 24), 15: [99, 32] }
// Nos avants groupés autour du 8 après la réception en fond d'alignement.
const GROUPE_NOUS = { 8: [84, 24], 7: [83, 26.5], 6: [83, 21.5], 5: [82, 24], 4: [81.5, 21.5], 3: [81.5, 26.5], 1: [80, 24], 2: [80.5, 20], 9: [78, 24] }
const GROUPE_ADV = { 4: [86, 22], 5: [86, 25], 6: [86.5, 27.5], 8: [86.5, 20], 7: [87, 30], 1: [88, 14], 3: [88, 10], 2: [88, 4], 9: [89, 17] }
const AVANTS = [1, 2, 3, 4, 5, 6, 7, 8]

export const MATCHS = [
  // ---------------------------------------------------------------- Match 1
  {
    id: 'attaque-melee',
    titre: 'Attaque sur sortie de mêlée',
    niveau: 'debutant',
    resume: 'Mêlée gagnée au milieu du terrain : à toi de choisir comment attaquer jusqu’à l’essai.',
    decisions: [
      {
        zoom: { x: [30, 70], y: [6, 62] },
        situation: [
          { duration: 0, caption: 'Mêlée gagnée : le ballon est aux pieds du 8, le 9 se place derrière.', players: { ...NOUS_MELEE, 9: [43.5, 20.5] }, opponents: ADV_MELEE, ball: { at: [43.8, 25] } },
          { duration: 1.1, caption: 'Le 9 ramasse. Le troisième ligne adverse (6) se détache et fonce sur lui.', players: { 9: [42.5, 24.5] }, opponents: { 6: [51, 30] }, ball: { carrier: 9 }, highlight: [9] },
        ],
        question: 'Tu es le 9. Un troisième ligne adverse arrive sur toi. Que fais-tu ?',
        choix: [
          { texte: 'Passer au 10', note: 2, retour: 'Bien vu : le 6 adverse est attiré par toi, le 10 reçoit avec de l’espace.', suite: [
            { duration: 1.1, caption: 'Le 9 passe vite au 10, qui reçoit lancé.', players: { 9: [42, 25], 10: [41.5, 34], 12: [39, 41], 13: [36, 49], 14: [33, 58] }, opponents: { 6: [46, 27] }, ball: { carrier: 10 }, highlight: [9, 10] },
          ] },
          { texte: 'Courir seul vers le côté ouvert', note: 0, retour: 'Le 6 adverse t’attendait : tu es plaqué derrière la ligne d’avantage et ton équipe recule.', suite: [
            { duration: 1, caption: 'Le 9 part seul… et se fait plaquer par le 6 adverse.', players: { 9: [45, 29] }, opponents: { 6: [46.5, 29.5] }, highlight: [9] },
          ] },
          { texte: 'Jouer au pied par-dessus (box kick)', note: 1, retour: 'Possible pour gagner du terrain, mais tu rends le ballon alors que ta mêlée dominait.', suite: [
            { duration: 1.4, caption: 'Le box kick monte haut… l’arrière adverse le récupère.', ball: { at: [74, 22], kick: true }, opponents: { 15: [74, 23] }, highlight: [9] },
          ] },
        ],
      },
      {
        zoom: { x: [30, 72], y: [16, 66] },
        situation: [
          { duration: 0, caption: 'Le 10 a le ballon et attaque la ligne.', players: { 9: [42, 26], 10: [46, 34], 12: [43, 41], 13: [40, 49], 14: [37, 58], 15: [33, 42] }, opponents: { 10: [57, 34], 12: [58, 41], 13: [58, 48], 11: [58, 57], 15: [74, 42] }, ball: { carrier: 10 }, highlight: [10] },
          { duration: 1, caption: 'Le défenseur monte très vite sur le 10, toute la ligne adverse le suit.', players: { 10: [47.5, 34.5], 12: [45, 40] }, opponents: { 10: [51, 35], 12: [52, 42], 13: [53, 49], 11: [54, 57] }, highlight: [10] },
        ],
        question: 'Le défenseur monte. Que fais-tu ?',
        choix: [
          { texte: 'Passer au 12', note: 0, retour: 'Le 12 reçoit avec son défenseur déjà sur lui : il est plaqué sans avancer.', suite: [
            { duration: 1, caption: 'Passe au 12… plaqué tout de suite par son vis-à-vis.', players: { 12: [48, 41] }, opponents: { 12: [49.5, 41.5] }, ball: { carrier: 12 }, highlight: [12] },
          ] },
          { texte: 'Croiser avec le 12', note: 2, retour: 'La défense monte vers l’extérieur : en croisant, le 12 repique dans son dos.', suite: [
            { duration: 1.2, caption: 'Croisée : le 10 part vers l’extérieur et attire son défenseur, le 12 rentre et reçoit.', players: { 10: [50, 40], 12: [47, 36.5] }, opponents: { 10: [52.5, 39], 12: [53, 43] }, ball: { carrier: 12 }, highlight: [10, 12] },
            { duration: 1.4, caption: 'Le 12 perce dans l’intervalle !', players: { 12: [64, 33], 10: [56, 41], 9: [50, 28] }, opponents: { 10: [54, 39] }, highlight: [12] },
          ] },
          { texte: 'Petit jeu au pied par-dessus', note: 1, retour: 'Bonne idée face à une défense qui monte, mais risqué : l’arrière adverse couvre.', suite: [
            { duration: 1.2, caption: 'Petit coup de pied dans le dos de la défense…', ball: { at: [62, 36], kick: true }, players: { 10: [49, 34], 12: [50, 41], 13: [48, 48] }, opponents: { 15: [66, 39] } },
            { duration: 0.8, caption: '…l’arrière adverse arrive le premier.', opponents: { 15: [62.5, 36.5] }, ball: { carrier: 15, team: 'adv' } },
          ] },
        ],
      },
      {
        zoom: { x: [54, 111], y: [28, 70] },
        situation: [
          { duration: 0, caption: 'Le 13 a franchi. Il ne reste que l’arrière adverse, et ton ailier 14 est à l’extérieur.', players: { 13: [66, 46], 14: [63, 60], 12: [60, 40], 15: [58, 52], 10: [56, 36] }, opponents: { 15: [88, 55], 13: [64, 43], 11: [76, 32] }, ball: { carrier: 13 }, highlight: [13, 14] },
          { duration: 1.2, caption: 'Deux contre un : le 13 et le 14 face au 15 adverse.', players: { 13: [74, 49], 14: [71, 61], 15: [66, 54] }, opponents: { 15: [84, 55], 13: [68, 45] }, highlight: [13, 14] },
        ],
        question: 'Deux contre un face à l’arrière. Que fais-tu ?',
        choix: [
          { texte: 'Passer tout de suite à l’ailier', note: 1, retour: 'L’arrière n’est pas fixé : il glisse sur l’ailier et peut le pousser en touche.', suite: [
            { duration: 1, caption: 'Passe immédiate : le 15 adverse glisse sur le 14…', players: { 13: [77, 50], 14: [74, 62] }, opponents: { 15: [80, 59] }, ball: { carrier: 14 }, highlight: [14] },
            { duration: 1.1, caption: '…et le pousse en touche.', players: { 14: [83, 69] }, opponents: { 15: [83, 66.5] }, highlight: [14] },
          ] },
          { texte: 'Fixer l’arrière puis passer', note: 2, retour: 'Parfait : l’arrière vient sur toi, ton ailier n’a plus personne devant lui.', suite: [
            { duration: 1, caption: 'Le 13 court droit sur l’arrière pour le fixer.', players: { 13: [80, 53], 14: [78, 63] }, opponents: { 15: [82, 54.5] }, highlight: [13] },
            { duration: 0.6, caption: 'Il passe au dernier moment.', ball: { carrier: 14 }, highlight: [14] },
            { duration: 1.8, caption: 'Le 14 file seul : essai !', players: { 14: [104, 62], 13: [86, 55] }, highlight: [14] },
          ] },
          { texte: 'Garder le ballon et foncer', note: 0, retour: 'Tu gâches le surnombre : l’arrière te plaque et ton ailier reste sans ballon.', suite: [
            { duration: 1.2, caption: 'Le 13 garde le ballon… plaqué par l’arrière adverse.', players: { 13: [81, 54], 14: [79, 63] }, opponents: { 15: [82.5, 54.5] }, highlight: [13] },
          ] },
        ],
      },
    ],
  },

  // ---------------------------------------------------------------- Match 2
  {
    id: 'defense',
    titre: 'Défendre en ligne',
    niveau: 'intermediaire',
    resume: 'L’adversaire attaque : organise la montée, plaque en sécurité et récupère le ballon.',
    decisions: [
      {
        zoom: { x: [22, 72], y: [6, 70] },
        situation: [
          { duration: 0, caption: 'Nous défendons (nous protégeons l’en-but à gauche). Le 9 adverse a le ballon au ruck.', players: NOUS_DEFENSE, opponents: ADV_ATTAQUE, ball: { carrier: 9, team: 'adv' } },
          { duration: 1.2, caption: 'Le ballon part au large : 4 attaquants (13, 15, 11, 14) face à nos 3 défenseurs extérieurs.', opponents: { 10: [58, 28], 12: [60, 35], 13: [61, 42], 15: [62, 49], 11: [63, 56], 14: [63, 63] }, ball: { carrier: 10, team: 'adv' }, highlight: [12, 13, 14] },
        ],
        question: 'Ils sont en surnombre au large. Que fait notre ligne ?',
        choix: [
          { texte: 'Monter vite, chacun sur son vis-à-vis', note: 0, retour: 'En surnombre, monter chacun sur son homme laisse le dernier attaquant libre.', suite: [
            { duration: 1, caption: 'Notre ligne monte… le ballon va plus vite qu’elle.', players: { 10: [52, 30], 12: [53, 36], 13: [54, 43], 14: [54, 50] }, opponents: { 13: [57, 44], 15: [58.5, 52], 11: [58, 58], 14: [59, 64] }, ball: { carrier: 15, team: 'adv' } },
            { duration: 0.6, caption: 'Le 14 adverse reçoit sans défenseur devant lui…', ball: { carrier: 14, team: 'adv' } },
            { duration: 1.4, caption: '…il file vers l’essai.', opponents: { 14: [40, 65] } },
          ] },
          { texte: 'Glisser ensemble vers l’extérieur', note: 2, retour: 'La glissée : on monte en ligne et on décale vers l’extérieur. Notre 15 ferme le côté, le surnombre disparaît.', suite: [
            { duration: 1.3, caption: 'Toute la ligne glisse : chaque défenseur prend l’attaquant suivant, notre 15 vient fermer l’extérieur.', players: { 10: [51, 34], 12: [51, 40.5], 13: [51, 47], 14: [50, 54], 15: [42, 60] }, opponents: { 13: [57, 44], 15: [58, 51], 11: [57, 58], 14: [58, 64] }, ball: { carrier: 15, team: 'adv' } },
            { duration: 1, caption: 'Le porteur est poussé vers la touche, sans espace.', players: { 14: [53, 57], 15: [49, 62] }, opponents: { 15: [55, 56] }, highlight: [14, 15] },
          ] },
          { texte: 'Reculer pour attendre', note: 0, retour: 'En reculant, tu offres du terrain et de l’élan aux attaquants.', suite: [
            { duration: 1.3, caption: 'Notre ligne recule : les attaquants avancent de 10 m sans contact.', players: shift(NOUS_DEFENSE, -6, 0, [1, 3, 10, 12, 13, 14]), opponents: shift({ 10: [58, 28], 12: [60, 35], 13: [61, 42], 15: [62, 49], 11: [63, 56], 14: [63, 63] }, -10) },
            { duration: 0.6, caption: 'Ils jouent au large en pleine vitesse.', ball: { carrier: 13, team: 'adv' } },
          ] },
        ],
      },
      {
        zoom: { x: [30, 66], y: [14, 54] },
        situation: [
          { duration: 0, caption: 'Le 12 adverse a le ballon. Notre 7 est en couverture intérieure.', players: { 7: [44, 30], 10: [48, 34], 12: [48, 40], 8: [42, 37], 9: [42, 21] }, opponents: { 12: [57, 38], 10: [57, 32], 13: [58, 45] }, ball: { carrier: 12, team: 'adv' }, highlight: [7] },
          { duration: 1, caption: 'Il fait une course rentrante, entre notre 10 et notre 7.', players: { 10: [50, 37], 12: [50, 42] }, opponents: { 12: [50, 33] }, highlight: [7] },
        ],
        question: 'Tu es le 7. Le porteur arrive sur toi. Que fais-tu ?',
        choix: [
          { texte: 'Plaquer bas, la tête du bon côté', note: 2, retour: 'Plaquage efficace et sûr : épaule aux cuisses, tête derrière les fesses du porteur.', suite: [
            { duration: 0.8, caption: 'Le 7 plaque aux cuisses, tête du bon côté.', players: { 7: [47, 32.5] }, opponents: { 12: [47.8, 33] }, highlight: [7] },
            { duration: 0.6, caption: 'Le porteur est au sol : le ballon est disponible.', ball: { at: [47, 34.5] }, highlight: [7] },
          ] },
          { texte: 'Attendre qu’il passe à côté', note: 0, retour: 'Un défenseur qui attend se fait passer : il n’y a plus personne derrière.', suite: [
            { duration: 1.2, caption: 'Il passe : plus personne derrière la ligne.', players: { 7: [44, 31] }, opponents: { 12: [34, 31] } },
          ] },
          { texte: 'Plaquer haut pour arracher le ballon', note: 0, retour: 'Un plaquage haut est dangereux et sanctionné : pénalité, voire carton. Vise la taille ou plus bas.', suite: [
            { duration: 0.8, caption: 'Plaquage haut : l’arbitre siffle pénalité et sort un carton jaune.', players: { 7: [47, 32.5] }, opponents: { 12: [47.8, 33] }, highlight: [7] },
          ] },
        ],
      },
      {
        zoom: { x: [36, 62], y: [18, 46] },
        situation: [
          { duration: 0, caption: 'Notre 7 a plaqué. Le ballon est au sol, les soutiens adverses arrivent.', players: { 7: [47, 32.5], 10: [46, 37], 8: [43, 28], 12: [47, 42] }, opponents: { 12: [48, 33.5], 7: [56, 30], 9: [57, 25], 10: [57, 37] }, ball: { at: [49.3, 33.8] }, highlight: [8] },
          { duration: 0.8, caption: 'Notre 8 arrive le premier au-dessus du ballon, debout.', players: { 8: [49, 31.5] }, opponents: { 7: [52, 31] }, highlight: [8] },
        ],
        question: 'Tu es le 8, premier arrivé sur le ballon. Que fais-tu ?',
        choix: [
          { texte: 'Gratter le ballon en restant sur tes appuis', note: 2, retour: 'Debout, sur tes pieds, avant que le ruck ne se forme : c’est légal et tu récupères le ballon.', suite: [
            { duration: 0.8, caption: 'Le 8 arrache le ballon : récupération !', ball: { carrier: 8 }, highlight: [8] },
            { duration: 1, caption: 'Il le transmet à notre 10 pour relancer.', players: { 8: [47, 31], 10: [44, 36] }, ball: { carrier: 10 }, highlight: [10] },
          ] },
          { texte: 'Plonger sur le ballon', note: 0, retour: 'Tu n’es plus sur tes appuis : pénalité contre toi.', suite: [
            { duration: 0.7, caption: 'Le 8 plonge… coup de sifflet : pénalité pour l’adversaire.', players: { 8: [49.5, 33.5] }, highlight: [8] },
          ] },
          { texte: 'Laisser le ballon et revenir dans la ligne', note: 1, retour: 'Prudent : la défense est en place, mais l’adversaire garde le ballon.', suite: [
            { duration: 1, caption: 'Le 8 se replace. Le 9 adverse récupère et relance.', players: { 8: [45, 28] }, opponents: { 7: [50, 32.5], 9: [51, 31] }, ball: { carrier: 9, team: 'adv' } },
          ] },
        ],
      },
    ],
  },

  // ---------------------------------------------------------------- Match 3
  {
    id: 'touche-22',
    titre: 'Touche dans les 22 adverses',
    niveau: 'intermediaire',
    resume: 'Une touche à 16 m de l’en-but : choisis le lancer, l’option de jeu et la sortie du maul.',
    decisions: [
      {
        zoom: { x: [60, 111], y: [-3, 45] },
        situation: [
          { duration: 0, caption: 'Touche pour nous à 16 m de l’en-but adverse. Leurs meilleurs sauteurs (4 et 5) sont devant et au milieu.', players: TOUCHE_22_NOUS, opponents: TOUCHE_22_ADV, ball: { carrier: 2 }, highlight: [2] },
        ],
        question: 'Tu es le talonneur. Où lances-tu ?',
        choix: [
          { texte: 'Devant, sur le 4', note: 0, retour: 'Leur 4 est juste en face : il saute avec toi et vole le ballon.', suite: [
            { duration: 1, caption: 'Le 4 adverse contre et vole le ballon.', opponents: { 4: [85, 10] }, ball: { carrier: 4, team: 'adv' } },
          ] },
          { texte: 'Au milieu, sur le 5', note: 1, retour: 'Ballon gagné de justesse : leur 5 était là aussi.', suite: [
            { duration: 1, caption: 'Capté au milieu, mais le 5 adverse a failli le toucher.', players: { 5: [83, 22] }, lifted: [5], ball: { carrier: 5 }, highlight: [5] },
          ] },
          { texte: 'En fond, sur le 8', note: 2, retour: 'Leurs sauteurs sont devant : en fond, ton 8 capte sans opposition.', suite: [
            { duration: 1.1, caption: 'Lancer au fond : notre 8 capte seul.', players: { 8: [83, 26] }, lifted: [8], ball: { carrier: 8 }, highlight: [8] },
          ] },
        ],
      },
      {
        zoom: { x: [60, 111], y: [-3, 45] },
        situation: [
          { duration: 0, caption: 'Le 8 retombe avec le ballon, ses avants se lient autour de lui.', players: { ...TOUCHE_22_NOUS, ...GROUPE_NOUS }, opponents: { ...TOUCHE_22_ADV, ...GROUPE_ADV }, ball: { carrier: 8 }, highlight: [8] },
        ],
        question: 'Avants groupés à 16 m de l’en-but. Quelle option ?',
        choix: [
          { texte: 'Former un maul et pousser', note: 2, retour: 'Le maul est l’arme idéale près de l’en-but : la défense ne peut pas l’arrêter sans faute.', suite: [
            { duration: 0.8, caption: 'Le ballon passe de main en main jusqu’au pilier, à l’arrière du maul.', ball: { carrier: 1 }, highlight: [1] },
            { duration: 1.8, caption: 'Le maul avance : la défense recule de 7 m.', players: shift(GROUPE_NOUS, 7, 0, AVANTS), opponents: shift(GROUPE_ADV, 7, 0, AVANTS), highlight: [1] },
          ] },
          { texte: 'Ouvrir au large tout de suite', note: 1, retour: 'Possible, mais leurs trois-quarts sont en place : tu lâches l’avantage du maul.', suite: [
            { duration: 0.6, caption: 'Le 8 donne au 9…', ball: { carrier: 9 }, players: { 9: [79, 27] } },
            { duration: 1, caption: '…qui sert le 10. La défense adverse monte en place.', ball: { carrier: 10 }, players: { 10: [76, 30] }, opponents: { 10: [88, 30], 12: [89, 37] }, highlight: [10] },
          ] },
          { texte: 'Taper au pied dans l’en-but', note: 0, retour: 'L’adversaire aplatit dans son en-but : renvoi aux 22 m pour lui, l’occasion est perdue.', suite: [
            { duration: 0.6, caption: 'Le 8 donne au 9…', ball: { carrier: 9 }, players: { 9: [79, 27] } },
            { duration: 1.2, caption: '…qui tape dans l’en-but : l’arrière adverse aplatit.', ball: { at: [105, 31], kick: true }, opponents: { 15: [104, 32] } },
          ] },
        ],
      },
      {
        zoom: { x: [62, 111], y: [-3, 52] },
        situation: [
          { duration: 0, caption: 'Le maul est arrêté à 9 m de l’en-but. L’arbitre dit « à jouer » : 5 secondes pour sortir le ballon.', players: { ...shift(GROUPE_NOUS, 7, 0, AVANTS), 9: [85, 26], 10: [80, 31], 12: [77, 38], 13: [74, 45], 14: [71, 54], 15: [68, 40], 11: [79, 6] }, opponents: { ...shift(GROUPE_ADV, 7, 0, AVANTS), 9: [96, 18], 10: [94, 31], 12: [94, 38], 13: [94, 45], 11: [94, 53], 14: [94, 8], 15: [100, 34] }, ball: { carrier: 1 }, highlight: [9] },
        ],
        question: 'Le maul s’est arrêté. Que fais-tu ?',
        choix: [
          { texte: 'Le 9 sort vite le ballon pour un avant lancé', note: 2, retour: 'Les défenseurs sont aspirés par le maul : un avant lancé perce au ras.', suite: [
            { duration: 0.6, caption: 'Le 9 récupère à l’arrière du maul. Le 3 se détache pour prendre son élan.', ball: { carrier: 9 }, players: { 9: [86, 27], 3: [84.5, 31] }, highlight: [9, 3] },
            { duration: 0.6, caption: 'Le 9 lui donne le ballon.', ball: { carrier: 3 }, players: { 3: [85.5, 31.5] }, highlight: [3] },
            { duration: 0.9, caption: 'Le 3 arrive lancé et perce au ras du maul.', players: { 3: [93, 33] }, highlight: [3] },
            { duration: 1, caption: 'Le pilier plonge : essai !', players: { 3: [101, 33] }, ball: { at: [101.5, 33] }, highlight: [3] },
          ] },
          { texte: 'Rester groupés et attendre', note: 0, retour: 'Le ballon ne sort pas : l’arbitre siffle « ballon injouable », mêlée pour l’adversaire.', suite: [
            { duration: 1.4, caption: 'Coup de sifflet : mêlée pour l’adversaire, qui ne portait pas le ballon au début du maul.' },
          ] },
          { texte: 'Passer au large au 10', note: 1, retour: 'Le jeu continue, mais la défense a eu le temps de se replacer.', suite: [
            { duration: 0.6, caption: 'Le 9 récupère…', ball: { carrier: 9 }, players: { 9: [86, 27] } },
            { duration: 1, caption: '…et passe au 10. La défense est remontée : l’élan du maul est perdu.', ball: { carrier: 10 }, players: { 10: [84, 33], 12: [81, 39] }, opponents: { 10: [89, 32], 12: [90, 38] }, highlight: [10] },
          ] },
        ],
      },
    ],
  },

  // ---------------------------------------------------------------- Match 4
  {
    id: 'contre-attaque',
    titre: 'Contre-attaque',
    niveau: 'avance',
    resume: 'Tu réceptionnes un long coup de pied : saisis l’espace, crée le surnombre et finis l’action.',
    decisions: [
      {
        zoom: { x: [14, 72], y: [0, 70] },
        situation: [
          { duration: 0, caption: 'Le 10 adverse va taper long dans notre camp.', players: { 15: [25, 35], 11: [32, 10], 14: [30, 60], 13: [38, 48], 12: [38, 40], 10: [36, 30], 9: [40, 22], 1: [45, 20], 2: [44, 25], 3: [46, 30], 4: [47, 15], 5: [47, 35], 6: [43, 12], 7: [44, 40], 8: [42, 32] }, opponents: { 10: [62, 30], 12: [52, 38], 13: [54, 46], 7: [53, 28], 6: [54, 22], 11: [64, 60], 14: [64, 10] }, ball: { carrier: 10, team: 'adv' } },
          { duration: 1.6, caption: 'Notre 15 réceptionne. Les chasseurs arrivent au centre, mais les ailiers adverses sont en retard.', ball: { carrier: 15 }, players: { 15: [26, 36] }, opponents: { 12: [40, 36], 13: [41, 43], 7: [41, 29], 6: [42, 22], 11: [56, 60], 14: [56, 10] }, highlight: [15] },
        ],
        question: 'Tu es le 15, ballon en main. Les côtés adverses sont vides. Que fais-tu ?',
        choix: [
          { texte: 'Taper en touche', note: 1, retour: 'Sûr, mais tu rends le ballon alors qu’il y avait de l’espace sur les côtés.', suite: [
            { duration: 1.3, caption: 'Touche : on gagne 20 m, mais l’adversaire aura le lancer.', ball: { at: [46, 71], kick: true }, highlight: [15] },
          ] },
          { texte: 'Relancer à la main vers l’aile', note: 2, retour: 'L’espace est sur les côtés : tu attaques vite avant que la défense se replace.', suite: [
            { duration: 1, caption: 'Le 15 attaque l’espace, l’ailier 14 se place en soutien, en retrait.', players: { 15: [32, 44], 14: [29, 58], 13: [34, 50] }, highlight: [15, 14] },
            { duration: 0.6, caption: 'Passe au 14.', ball: { carrier: 14 }, highlight: [14] },
            { duration: 1.5, caption: 'Le 14 remonte le terrain : contre-attaque lancée !', players: { 14: [52, 62], 15: [42, 54], 13: [44, 50] }, opponents: { 11: [58, 62] }, highlight: [14] },
          ] },
          { texte: 'Garder le ballon et attendre le soutien', note: 0, retour: 'En attendant, tu laisses les chasseurs arriver : la contre-attaque meurt.', suite: [
            { duration: 1.1, caption: 'Les chasseurs arrivent et plaquent le 15.', opponents: { 12: [27.5, 36], 7: [28, 33] }, highlight: [15] },
          ] },
        ],
      },
      {
        zoom: { x: [32, 84], y: [26, 70] },
        situation: [
          { duration: 0, caption: 'Le 15 a franchi au centre. L’ailier adverse (11) est le dernier défenseur proche, ton ailier 14 est libre à l’extérieur.', players: { 15: [48, 48], 14: [45, 62], 13: [44, 44], 12: [40, 38] }, opponents: { 11: [60, 58], 15: [78, 46], 13: [50, 40] }, ball: { carrier: 15 }, highlight: [15, 14] },
          { duration: 1, caption: 'Le 11 adverse monte sur le porteur.', players: { 15: [52, 48], 14: [49, 62] }, opponents: { 11: [55, 51], 13: [51, 43] }, highlight: [15] },
        ],
        question: 'Un défenseur monte sur toi, ton ailier est libre à l’extérieur. Que fais-tu ?',
        choix: [
          { texte: 'Fixer le défenseur puis passer à l’ailier', note: 2, retour: 'Le défenseur est pris : ton ailier a tout le couloir.', suite: [
            { duration: 0.7, caption: 'Le 15 attire le défenseur.', players: { 15: [54, 50] }, opponents: { 11: [55.5, 51] }, highlight: [15] },
            { duration: 0.6, caption: 'Passe au 14, en retrait.', players: { 14: [52, 63] }, ball: { carrier: 14 }, highlight: [14] },
            { duration: 1.6, caption: 'Le 14 file le long de la touche.', players: { 14: [74, 64] }, opponents: { 15: [76, 56] }, highlight: [14] },
          ] },
          { texte: 'Croiser avec l’ailier', note: 0, retour: 'Croiser ramène le jeu vers l’intérieur, là où les défenseurs reviennent.', suite: [
            { duration: 1, caption: 'Croisée vers l’intérieur : le 14 tombe sur les défenseurs qui reviennent.', players: { 15: [55, 55], 14: [51, 52] }, opponents: { 11: [54, 53], 13: [53, 49] }, ball: { carrier: 14 }, highlight: [14] },
          ] },
          { texte: 'Petit coup de pied rasant', note: 1, retour: 'Possible, mais le ballon est rendu au hasard : l’arrière adverse est bien placé.', suite: [
            { duration: 1, caption: 'Le ballon roule vers l’en-but…', ball: { at: [68, 50], kick: true }, highlight: [15] },
            { duration: 1, caption: '…l’arrière adverse le récupère.', opponents: { 15: [68, 50.5] }, ball: { carrier: 15, team: 'adv' } },
          ] },
        ],
      },
      {
        zoom: { x: [72, 111], y: [36, 70] },
        situation: [
          { duration: 0, caption: 'Le 14 est à 15 m de l’en-but. Le 15 adverse lui fait face, ton 13 arrive à l’intérieur.', players: { 14: [86, 60], 13: [81, 53] }, opponents: { 15: [96, 57], 11: [78, 63] }, ball: { carrier: 14 }, highlight: [14, 13] },
          { duration: 0.9, caption: 'Le dernier défenseur s’avance.', players: { 14: [90, 60], 13: [86, 54] }, opponents: { 15: [95, 59] }, highlight: [14] },
        ],
        question: 'Le dernier défenseur te fait face, ton 13 arrive à l’intérieur. Que fais-tu ?',
        choix: [
          { texte: 'Fixer puis passer à l’intérieur au 13', note: 2, retour: 'L’arrière est fixé vers la touche : ton 13 marque entre lui et les poteaux.', suite: [
            { duration: 0.7, caption: 'Le 14 fixe l’arrière…', players: { 14: [93, 61], 13: [91, 55] }, opponents: { 15: [94.5, 60.5] }, highlight: [14] },
            { duration: 0.5, caption: '…passe intérieure au 13…', ball: { carrier: 13 }, highlight: [13] },
            { duration: 1, caption: '…qui aplatit : essai !', players: { 13: [102, 54] }, ball: { at: [102.5, 53.5] }, highlight: [13] },
          ] },
          { texte: 'Forcer le passage', note: 1, retour: 'Duel incertain : plaqué à 5 m, il faudra recycler le ballon.', suite: [
            { duration: 0.9, caption: 'Duel : le 14 est plaqué à 5 m de la ligne.', players: { 14: [95, 60] }, opponents: { 15: [96, 60] }, highlight: [14] },
          ] },
          { texte: 'Jouer au pied à suivre', note: 0, retour: 'Le ballon file dans l’en-but : l’arrière adverse aplatit le premier.', suite: [
            { duration: 1.1, caption: 'Le ballon file dans l’en-but : l’arrière adverse aplatit.', ball: { at: [105, 60], kick: true }, opponents: { 15: [104, 59] } },
          ] },
        ],
      },
    ],
  },
]

export const getMatch = (id) => MATCHS.find((m) => m.id === id)
export const NOTE_MAX = 2
