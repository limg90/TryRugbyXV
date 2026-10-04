// Module Règles : Débutant (règles fondamentales) et Expert (règles World Rugby).
//
// Chaque règle contient :
//   - module     : 'debutant' ou 'expert' ; niveau : niveau des questions pour les quiz adaptés
//   - resume, explication { simple, points, sanction }
//   - steps (+ zoom) : schéma animé, même format que data/scenarios.js (voir engine/useScenario.js)
//   - video      : emplacement réservé { titre, description } en attendant les vidéos
//   - quiz       : questions au format de data/quiz.js (qcm, glisser, terrain)
// Repère : x de 0 à 100 (on attaque vers x = 100), y de 0 à 70. Adversaires en rouge, avec leurs numéros.

import {
  NOUS_MELEE, NOUS_TOUCHE, ADV_TOUCHE, NOUS_RUCK, ADV_RUCK, BALLON_RUCK,
  NOUS_DEFENSE, ADV_ATTAQUE, shift,
} from './formations.js'
import { getCombinaison } from './combinaisons.js'

export const MODULES = [
  { id: 'debutant', label: 'Débutant', description: 'Les règles fondamentales pour jouer son premier match et comprendre les décisions de l’arbitre.' },
  { id: 'expert', label: 'Expert', description: 'Les règles World Rugby du jeu au contact, des phases statiques et de la discipline.' },
]

// Maul formé après la touche (ligne de touche en x = 60).
const MAUL_NOUS = { 5: [60, 22], 6: [59, 19.5], 8: [59, 24.5], 4: [58, 21], 7: [57.5, 25], 3: [57, 19], 1: [56.5, 22.5], 2: [55.5, 21] }
const MAUL_ADV = { 5: [62, 22], 4: [62, 19.5], 6: [62, 24.5], 8: [63.5, 22], 3: [63.5, 18], 7: [63.5, 26] }

// Copie d'un placement sans certains joueurs.
const sans = (players, ...numeros) => Object.fromEntries(Object.entries(players).filter(([n]) => !numeros.includes(Number(n))))

// Touche jouée en x = 36, lancer pour nous (utilisée par la règle de la touche).
const NOUS_TOUCHE_36 = shift(NOUS_TOUCHE, -24)
const ADV_TOUCHE_36 = shift(ADV_TOUCHE, -24)

export const REGLES = [
  // ------------------------------------------------------------------ Débutant
  {
    id: 'passe-en-arriere',
    titre: 'La passe en arrière',
    module: 'debutant',
    niveau: 'debutant',
    resume: 'Au rugby, on avance avec le ballon mais on se le passe toujours vers l’arrière.',
    explication: {
      simple: 'Tu peux courir vers l’en-but adverse avec le ballon, mais chaque passe doit partir à plat ou vers ton propre camp. C’est ce qui oblige l’équipe à jouer en profondeur et en soutien.',
      points: [
        'La passe se juge au mouvement des mains du passeur : elles doivent aller vers l’arrière.',
        'Les partenaires se placent derrière le porteur, en escalier, pour pouvoir recevoir.',
        'Une passe peut sembler aller vers l’avant quand le receveur court vite : seul le geste compte.',
      ],
      sanction: 'Passe en avant : mêlée pour l’adversaire à l’endroit de la passe.',
    },
    zoom: { x: [28, 62], y: [20, 56] },
    steps: [
      { duration: 0, caption: 'Le 10 porte le ballon. Ses partenaires 12 et 13 sont placés derrière lui, en escalier.', players: { 10: [40, 30], 12: [37, 37], 13: [34, 45] }, opponents: { 10: [56, 31], 12: [56, 39], 13: [56, 47] }, ball: { carrier: 10 }, highlight: [10] },
      { duration: 1.2, caption: 'Le 10 avance avec le ballon. Le 12 et le 13 suivent, toujours en retrait.', players: { 10: [46, 31], 12: [42, 38], 13: [39, 46] }, opponents: { 10: [52, 31], 12: [53, 39], 13: [53, 47] }, highlight: [10] },
      { duration: 0.7, caption: 'Il passe au 12, qui est derrière lui : la passe va vers son camp, elle est valable.', ball: { carrier: 12 }, highlight: [10, 12] },
      { duration: 1.1, caption: 'Le 12 avance à son tour, le 13 reste en retrait.', players: { 12: [48, 39], 13: [44, 46], 10: [48, 33] }, opponents: { 12: [51, 39], 13: [51.5, 46] }, highlight: [12] },
      { duration: 0.7, caption: 'Le 12 passe au 13, toujours placé derrière lui.', ball: { carrier: 13 }, highlight: [12, 13] },
      { duration: 1.2, caption: 'Le 13 gagne du terrain. On avance en courant, pas en passant.', players: { 13: [54, 48], 12: [50, 41] }, opponents: { 13: [53, 46] }, highlight: [13] },
    ],
    video: { titre: 'Passer vers l’arrière en courant', description: 'Ralenti d’une attaque à quatre joueurs : position des mains, placement en escalier des receveurs.' },
    quiz: [
      { type: 'qcm', question: 'Dans quelle direction doit partir une passe ?', choix: ['Vers l’arrière ou à plat', 'Vers l’avant', 'Dans n’importe quelle direction'], bonne: 0, explication: 'La passe se fait à plat ou vers son camp, jamais vers l’en-but adverse.' },
      { type: 'qcm', question: 'Que siffle l’arbitre après une passe en avant ?', choix: ['Une pénalité', 'Une mêlée pour l’adversaire', 'Une touche'], bonne: 1, explication: 'C’est une faute technique : mêlée pour l’équipe qui n’a pas commis la faute.' },
      {
        type: 'terrain', mode: 'joueur',
        question: 'Le 10 veut faire une passe valable. Clique sur le partenaire à qui il peut passer.',
        situation: { players: { 10: [45, 32], 12: [49, 39], 13: [42, 44] }, opponents: { 10: [56, 32], 12: [56, 40] }, ball: { carrier: 10 }, zoom: { x: [32, 62], y: [20, 52] } },
        bonne: { equipe: 'nous', numero: 13 },
        explication: 'Le 13 est derrière le 10 (plus près de notre camp). Le 12 est devant : une passe vers lui serait en avant.',
      },
    ],
  },
  {
    id: 'en-avant',
    titre: 'L’en-avant',
    module: 'debutant',
    niveau: 'debutant',
    resume: 'Le ballon échappe des mains et part vers l’en-but adverse : c’est un en-avant.',
    explication: {
      simple: 'Si tu laisses tomber le ballon, ou si tu le frappes avec la main ou le bras, et qu’il part vers l’avant puis touche le sol ou un autre joueur, c’est un en-avant.',
      points: [
        'Rattraper le ballon avant qu’il touche le sol ou un autre joueur : pas d’en-avant.',
        'Contrer un coup de pied adverse avec les mains n’est pas un en-avant.',
        'Un en-avant volontaire (taper le ballon du bras pour empêcher une passe) est sanctionné d’une pénalité.',
      ],
      sanction: 'Mêlée pour l’adversaire. En-avant volontaire : pénalité, parfois carton jaune.',
    },
    zoom: { x: [36, 66], y: [22, 50] },
    steps: [
      { duration: 0, caption: 'Le 12 reçoit le ballon et attaque la ligne adverse.', players: { 12: [44, 36], 10: [42, 30], 13: [40, 43] }, opponents: { 12: [58, 36], 13: [58, 43] }, ball: { carrier: 12 }, highlight: [12] },
      { duration: 1.1, caption: 'Au moment du contact, le ballon lui échappe des mains…', players: { 12: [51, 36], 10: [47, 31], 13: [47, 43] }, opponents: { 12: [53.5, 36], 13: [55, 43] }, highlight: [12] },
      { duration: 0.7, caption: '…et tombe vers l’avant. En-avant !', ball: { at: [55.5, 34] }, highlight: [12] },
      { duration: 1, caption: 'L’arbitre siffle : mêlée pour l’adversaire, introduite à l’endroit de la faute.', opponents: { 12: [55, 38] }, highlight: [] },
    ],
    video: { titre: 'En-avant ou pas ?', description: 'Cinq situations de match à juger : ballon rattrapé, contre, ballon perdu au contact.' },
    quiz: [
      { type: 'qcm', question: 'Le ballon t’échappe, part vers l’avant, mais tu le rattrapes avant qu’il touche le sol. C’est…', choix: ['Un en-avant', 'Pas un en-avant, le jeu continue', 'Une pénalité'], bonne: 1, explication: 'Tant que le ballon ne touche ni le sol ni un autre joueur, tu peux le rattraper.' },
      { type: 'qcm', question: 'Tu contres un coup de pied adverse avec les mains et le ballon part vers l’avant.', choix: ['C’est un en-avant', 'Ce n’est pas un en-avant', 'C’est un carton jaune'], bonne: 1, explication: 'Le contre d’un coup de pied n’est pas un en-avant, même si le ballon va vers l’avant.' },
      { type: 'qcm', question: 'Un défenseur tape volontairement le ballon du bras pour empêcher une passe. Sanction ?', choix: ['Mêlée', 'Pénalité, voire carton jaune', 'Rien'], bonne: 1, explication: 'L’en-avant volontaire est une faute de jeu déloyal.' },
    ],
  },
  {
    id: 'hors-jeu',
    titre: 'Le hors-jeu',
    module: 'debutant',
    niveau: 'debutant',
    resume: 'Un joueur placé devant un partenaire qui porte ou vient de jouer le ballon est hors-jeu.',
    explication: {
      simple: 'Dans le jeu courant, tu es hors-jeu si tu te trouves devant le partenaire qui a le ballon ou qui vient de le jouer (par exemple au pied). Être hors-jeu n’est pas une faute en soi : la faute, c’est de participer au jeu dans cette position.',
      points: [
        'Un joueur hors-jeu ne doit ni jouer le ballon, ni gêner un adversaire, ni avancer vers le ballon.',
        'Il redevient en jeu quand le botteur ou un partenaire placé derrière le botteur le dépasse.',
        'Aux rucks, mêlées et touches, des lignes de hors-jeu particulières s’appliquent (module Expert).',
      ],
      sanction: 'Pénalité pour l’adversaire.',
    },
    zoom: { x: [32, 86], y: [20, 58] },
    steps: [
      { duration: 0, caption: 'Le 10 va jouer au pied. Le 12 est devant lui, le 13 est derrière.', players: { 10: [45, 32], 12: [53, 41], 13: [40, 46] }, opponents: { 15: [80, 40], 13: [64, 52] }, ball: { carrier: 10 }, highlight: [12, 13] },
      { duration: 1.3, caption: 'Coup de pied par-dessus la défense.', ball: { at: [72, 40], kick: true }, players: { 10: [46, 32] }, highlight: [10] },
      { duration: 1.3, caption: 'Le 12 était devant le botteur : il est hors-jeu et doit rester à l’écart. S’il joue le ballon, pénalité.', players: { 12: [55, 41] }, opponents: { 15: [76, 40] }, highlight: [12] },
      { duration: 1.3, caption: 'Le 13 était derrière le botteur : il est en jeu. Il dépasse le 12, qui redevient en jeu à son tour.', players: { 13: [66, 43], 12: [60, 41] }, opponents: { 15: [74, 40] }, highlight: [13] },
    ],
    video: { titre: 'Repérer un hors-jeu', description: 'Arrêts sur image : où passe la ligne de hors-jeu dans le jeu courant et après un coup de pied.' },
    quiz: [
      {
        type: 'terrain', mode: 'joueur',
        question: 'Le 10 vient de taper au pied. Clique sur le joueur hors-jeu.',
        situation: { players: { 10: [45, 30], 12: [42, 38], 13: [54, 45], 15: [36, 34] }, opponents: { 15: [80, 38] }, ball: { at: [70, 38] }, zoom: { x: [30, 84], y: [18, 56] } },
        bonne: { equipe: 'nous', numero: 13 },
        explication: 'Le 13 est devant le botteur au moment du coup de pied : il est hors-jeu.',
      },
      { type: 'qcm', question: 'Être hors-jeu, est-ce une faute ?', choix: ['Oui, toujours', 'Seulement si le joueur participe au jeu', 'Jamais'], bonne: 1, explication: 'La faute, c’est de jouer le ballon ou de gêner l’adversaire en étant hors-jeu.' },
      { type: 'qcm', question: 'Comment un joueur hors-jeu après un coup de pied redevient-il en jeu ?', choix: ['En comptant jusqu’à 5', 'Quand le botteur ou un partenaire venu de derrière le dépasse', 'En levant la main'], bonne: 1, explication: 'Il faut être « remis en jeu » par un partenaire qui était derrière le botteur, ou par le botteur lui-même.' },
    ],
  },
  {
    id: 'touche',
    titre: 'La touche',
    module: 'debutant',
    niveau: 'debutant',
    resume: 'Le ballon sort du terrain par le côté : on le remet en jeu par un lancer entre deux alignements.',
    explication: {
      simple: 'Quand le ballon ou le porteur touche la ligne de touche ou le sol au-delà, le ballon est en touche. L’équipe qui ne l’a pas sorti le remet en jeu : son talonneur le lance droit entre les deux alignements d’avants.',
      points: [
        'L’alignement se forme entre 5 m et 15 m de la ligne de touche, avec 1 m entre les deux équipes.',
        'Le lancer doit être droit, au-dessus de l’espace entre les deux alignements.',
        'Les sauteurs peuvent être soulevés par leurs partenaires.',
      ],
      sanction: 'Lancer pas droit : l’adversaire choisit une touche ou une mêlée.',
    },
    steps: [
      { duration: 0, caption: 'Nous défendons. Le 10 adverse a le ballon et va dégager au pied.', players: NOUS_DEFENSE, opponents: { ...ADV_ATTAQUE, 10: [60, 27] }, ball: { carrier: 10, team: 'adv' } },
      { duration: 1.4, caption: 'Le ballon franchit la ligne de touche : il est en touche, le jeu s’arrête.', ball: { at: [36, -1.5], kick: true } },
      { duration: 2, caption: 'Les adversaires ont sorti le ballon : nous lançons. Les deux alignements se forment face à face.', players: NOUS_TOUCHE_36, opponents: ADV_TOUCHE_36, ball: { carrier: 2 }, highlight: [2] },
      { duration: 1, caption: 'Le talonneur lance droit. Le 5 est soulevé et capte le ballon.', players: { 5: [34, 22] }, lifted: [5], ball: { carrier: 5 }, highlight: [2, 5] },
    ],
    video: { titre: 'Touche : du lancer à la réception', description: 'Lancer du talonneur, saut et ascenseurs filmés de côté puis de dos.' },
    quiz: [
      { type: 'qcm', question: 'Qui lance le ballon en touche ?', choix: ['L’équipe qui a sorti le ballon', 'L’équipe qui ne l’a pas sorti', 'Toujours l’équipe qui attaque'], bonne: 1, explication: 'L’équipe adverse de celle qui a sorti le ballon remet en jeu.' },
      { type: 'glisser', question: 'Remets les étapes de la touche dans l’ordre.', cibles: ['1', '2', '3', '4'], etiquettes: ['Le ballon sort', 'Les alignements se forment', 'Le talonneur lance droit', 'Le sauteur capte'], explication: 'Sortie, alignement, lancer, saut et réception.' },
      { type: 'qcm', question: 'Le lancer n’est pas droit. Que se passe-t-il ?', choix: ['On recommence', 'L’adversaire choisit touche ou mêlée', 'Pénalité'], bonne: 1, explication: 'C’est une faute technique : l’adversaire a le choix de la remise en jeu.' },
    ],
  },
  {
    id: 'essai',
    titre: 'L’essai',
    module: 'debutant',
    niveau: 'debutant',
    resume: 'Aplatir le ballon dans l’en-but adverse rapporte 5 points.',
    explication: {
      simple: 'Pour marquer un essai, tu dois poser le ballon au sol dans l’en-but adverse (ou sur la ligne d’essai) en exerçant une pression vers le bas avec la main, les bras ou le haut du corps.',
      points: [
        'La ligne d’essai fait partie de l’en-but : aplatir dessus, c’est marquer.',
        'Il faut contrôler le ballon en l’aplatissant : le lâcher avant n’est pas un essai.',
        'Un essai de pénalité (7 points) est accordé si une faute adverse empêche un essai probable.',
      ],
      sanction: '5 points, puis une tentative de transformation à 2 points.',
    },
    zoom: { x: [66, 111], y: [34, 70] },
    steps: [
      { duration: 0, caption: 'Le 14 a le ballon le long de la touche. Seul l’arrière adverse peut l’arrêter.', players: { 14: [74, 62], 13: [70, 54] }, opponents: { 15: [92, 50] }, ball: { carrier: 14 }, highlight: [14] },
      { duration: 1.6, caption: 'Il accélère et prend l’arrière de vitesse.', players: { 14: [94, 63], 13: [86, 56] }, opponents: { 15: [94, 58] }, highlight: [14] },
      { duration: 1, caption: 'Il franchit la ligne d’essai et aplatit le ballon dans l’en-but : essai, 5 points !', players: { 14: [103, 60] }, opponents: { 15: [99, 60] }, ball: { at: [104, 59] }, highlight: [14] },
    ],
    video: { titre: 'Aplatir sans perdre le ballon', description: 'Techniques d’aplatissement à une main, à deux mains et en glissade, avec les erreurs à éviter.' },
    quiz: [
      { type: 'glisser', question: 'Associe chaque action au nombre de points qu’elle rapporte.', cibles: ['Essai', 'Transformation', 'Pénalité réussie', 'Essai de pénalité'], etiquettes: ['5 points', '2 points', '3 points', '7 points'], explication: 'Essai 5, transformation 2, pénalité ou drop 3, essai de pénalité 7.' },
      { type: 'qcm', question: 'Tu aplatis le ballon sur la ligne d’essai. C’est…', choix: ['Essai', 'Pas essai, il faut être au-delà', 'Une touche'], bonne: 0, explication: 'La ligne d’essai fait partie de l’en-but.' },
      {
        type: 'terrain', mode: 'zone',
        question: 'Clique à l’endroit où le 14 doit aplatir le ballon pour marquer.',
        situation: { players: { 14: [88, 60] }, opponents: { 15: [90, 45] }, ball: { carrier: 14 }, zoom: { x: [66, 111], y: [30, 70] } },
        zone: { x: [100, 110], y: [0, 70] },
        explication: 'L’essai se marque dans l’en-but adverse, entre la ligne d’essai (incluse) et la ligne de ballon mort.',
      },
    ],
  },
  {
    id: 'transformation',
    titre: 'La transformation',
    module: 'debutant',
    niveau: 'debutant',
    resume: 'Après un essai, un coup de pied entre les poteaux rapporte 2 points.',
    explication: {
      simple: 'Après l’essai, l’équipe qui a marqué tente de transformer. Le buteur place le ballon n’importe où sur une ligne parallèle à la touche, passant par l’endroit où l’essai a été marqué. Le ballon doit passer entre les poteaux, au-dessus de la barre.',
      points: [
        'Plus l’essai est marqué près des poteaux, plus la transformation est facile : on dit « aller aplatir sous les poteaux ».',
        'Le buteur peut reculer autant qu’il veut sur cette ligne pour trouver un meilleur angle.',
        'Les adversaires attendent derrière leur ligne d’essai et peuvent charger dès que le buteur s’élance.',
      ],
      sanction: '2 points si le ballon passe entre les poteaux.',
    },
    zoom: { x: [62, 111], y: [22, 70] },
    steps: [
      { duration: 0, caption: 'L’essai a été marqué à droite. Le buteur (10) recule sur la ligne de l’essai pour ouvrir l’angle.', players: { 10: [92, 60] }, opponents: { 1: [102, 30], 2: [102, 34], 3: [102, 38], 15: [102, 42] }, ball: { carrier: 10 }, highlight: [10] },
      { duration: 1.3, caption: 'Il se place à 25 m de la ligne d’essai, toujours en face de l’endroit de l’essai.', players: { 10: [75, 60] }, highlight: [10] },
      { duration: 1.3, caption: 'Il frappe. Les adversaires chargent, mais le ballon passe entre les poteaux : 2 points.', ball: { at: [104, 35], kick: true }, opponents: { 1: [97, 34], 2: [97, 38], 3: [98, 42], 15: [97, 46] }, highlight: [10] },
    ],
    video: { titre: 'Le geste du buteur', description: 'Placement du ballon sur le tee, élan et frappe, filmés de face et de profil.' },
    quiz: [
      {
        type: 'terrain', mode: 'zone',
        question: 'L’essai a été marqué à l’endroit du ballon. Clique sur un endroit où le buteur peut placer le ballon.',
        situation: { players: {}, opponents: {}, ball: { at: [101, 58] }, zoom: { x: [56, 111], y: [22, 70] } },
        zone: { x: [60, 99], y: [55, 61] },
        explication: 'Sur la ligne parallèle à la touche qui passe par l’endroit de l’essai, à la distance de son choix.',
      },
      { type: 'qcm', question: 'Combien rapporte une transformation réussie ?', choix: ['1 point', '2 points', '3 points'], bonne: 1, explication: '2 points, qui s’ajoutent aux 5 de l’essai.' },
      { type: 'qcm', question: 'Quand les adversaires peuvent-ils charger le buteur ?', choix: ['Dès qu’il pose le ballon', 'Dès qu’il s’élance', 'Jamais'], bonne: 1, explication: 'Ils attendent derrière leur ligne d’essai et chargent dès que le buteur commence son élan.' },
    ],
  },
  {
    id: 'penalite',
    titre: 'La pénalité',
    module: 'debutant',
    niveau: 'debutant',
    resume: 'Après une faute grave, l’équipe non fautive choisit comment rejouer : but, touche, mêlée ou jeu rapide.',
    explication: {
      simple: 'Pour les fautes comme le hors-jeu, les mains dans le ruck ou le plaquage dangereux, l’arbitre accorde une pénalité. Les fautifs reculent de 10 m. L’équipe qui en bénéficie choisit son option.',
      points: [
        'Taper au but : 3 points si le ballon passe entre les poteaux.',
        'Taper en touche : on gagne du terrain et on garde le lancer (« pénaltouche »).',
        'Demander une mêlée ou jouer vite à la main (petit coup de pied à soi-même).',
      ],
      sanction: 'Les fautifs reculent de 10 m. Faute répétée ou dangereuse : carton possible.',
    },
    zoom: { x: [36, 80], y: [-3, 44] },
    steps: [
      { duration: 0, caption: 'Ruck : le ballon est disponible pour nous. Le 10 adverse est passé devant sa ligne de hors-jeu.', players: NOUS_RUCK, opponents: { ...ADV_RUCK, 10: [51, 28] }, ball: { at: BALLON_RUCK } },
      { duration: 1, caption: 'Il plaque notre 9 avant qu’il ait sorti le ballon : coup de sifflet, pénalité pour nous.', players: { 9: [47.5, 22.5] }, opponents: { 10: [48.5, 23.5] }, ball: { carrier: 9 }, highlight: [9] },
      { duration: 1.6, caption: 'Les adversaires reculent de 10 m. Nous choisissons : but, touche, mêlée ou jeu rapide.', opponents: shift(ADV_RUCK, 10), players: { 9: [47, 21], 10: [45, 24] }, ball: { at: [47, 22] }, highlight: [10] },
      { duration: 1.4, caption: 'Le 10 tape en touche : nous lancerons la touche là où le ballon est sorti.', ball: { at: [72, -1.5], kick: true }, highlight: [10] },
    ],
    video: { titre: 'Choisir la bonne option sur pénalité', description: 'Le capitaine explique quand viser les poteaux, la touche ou jouer vite.' },
    quiz: [
      { type: 'glisser', question: 'Associe chaque option de pénalité à ce qu’elle apporte.', cibles: ['Taper au but', 'Taper en touche', 'Jouer vite à la main'], etiquettes: ['3 points', 'Du terrain et le lancer', 'Surprendre une défense pas replacée'], explication: 'Chaque option répond à une situation de match différente.' },
      { type: 'qcm', question: 'De combien les fautifs doivent-ils reculer sur une pénalité ?', choix: ['5 m', '10 m', '22 m'], bonne: 1, explication: '10 m vers leur camp, sinon la pénalité peut être avancée de 10 m.' },
      { type: 'qcm', question: 'Après une pénalité tapée directement en touche, qui lance ?', choix: ['L’équipe qui a tapé', 'L’adversaire', 'Tirage au sort'], bonne: 0, explication: 'C’est l’avantage de la pénaltouche : on garde le lancer.' },
    ],
  },
  {
    id: 'carton-jaune',
    titre: 'Le carton jaune',
    module: 'debutant',
    niveau: 'debutant',
    resume: 'Exclusion temporaire de 10 minutes pour une faute dangereuse ou des fautes répétées.',
    explication: {
      simple: 'L’arbitre sort le carton jaune pour un jeu dangereux, une faute volontaire qui empêche une action, ou des fautes répétées de l’équipe. Le joueur quitte le terrain pendant 10 minutes de jeu et son équipe joue à 14.',
      points: [
        'Le joueur ne peut pas être remplacé pendant son exclusion.',
        'Exemples : plaquage haut, plaquage sans les bras, en-avant volontaire, hors-jeu répétés.',
        'Deux cartons jaunes dans le même match valent un carton rouge.',
      ],
      sanction: '10 minutes hors du terrain, et une pénalité pour l’adversaire.',
    },
    zoom: { x: [34, 70], y: [24, 74] },
    steps: [
      { duration: 0, caption: 'Notre 12 attaque la ligne adverse.', players: { 12: [44, 40], 13: [41, 48] }, opponents: { 12: [57, 40], 13: [57, 48] }, ball: { carrier: 12 }, highlight: [12] },
      { duration: 1.1, caption: 'Le 12 adverse plaque au niveau du cou : plaquage haut, dangereux.', players: { 12: [50, 40], 13: [47, 48] }, opponents: { 12: [51.8, 40], 13: [53, 48] }, highlight: [12] },
      { duration: 2, caption: 'Carton jaune : il sort 10 minutes et son équipe joue à 14. Pénalité pour nous.', opponents: { 12: [52, 72] }, ball: { at: [50, 41] }, highlight: [] },
    ],
    video: { titre: 'Plaquer sans danger', description: 'Le plaquage à la bonne hauteur, tête du bon côté, comparé aux plaquages sanctionnés.' },
    quiz: [
      { type: 'qcm', question: 'Combien de temps dure une exclusion temporaire ?', choix: ['5 minutes', '10 minutes', 'Jusqu’à la mi-temps'], bonne: 1, explication: '10 minutes de jeu, sans remplacement.' },
      { type: 'qcm', question: 'Un joueur reçoit un deuxième carton jaune dans le match. Que se passe-t-il ?', choix: ['Encore 10 minutes', 'C’est un carton rouge', 'Rien de plus'], bonne: 1, explication: 'Deux jaunes font un rouge : il est exclu pour le reste du match.' },
      { type: 'qcm', question: 'Laquelle de ces fautes peut valoir un carton jaune ?', choix: ['Un en-avant involontaire', 'Un plaquage au niveau du cou', 'Une touche pas droite'], bonne: 1, explication: 'Le plaquage haut est un jeu dangereux.' },
    ],
  },
  {
    id: 'carton-rouge',
    titre: 'Le carton rouge',
    module: 'debutant',
    niveau: 'debutant',
    resume: 'Exclusion définitive pour un geste très dangereux ou violent : le joueur n’est pas remplacé.',
    explication: {
      simple: 'Le carton rouge sanctionne les fautes les plus graves : coup de poing, coup de pied, plaquage qui fait tomber un joueur sur la tête, charge à la tête. Le joueur quitte le match et son équipe finit à 14.',
      points: [
        'Le joueur exclu ne revient pas et n’est pas remplacé.',
        'Une commission de discipline décide ensuite d’une éventuelle suspension.',
        'Le respect de l’adversaire et la sécurité passent avant tout.',
      ],
      sanction: 'Exclusion pour le reste du match, pénalité pour l’adversaire, suspension possible.',
    },
    zoom: { x: [34, 70], y: [10, 74] },
    steps: [
      { duration: 0, caption: 'Notre 7 porte le ballon. Le 6 adverse arrive lancé.', players: { 7: [46, 30], 8: [42, 35] }, opponents: { 6: [60, 26] }, ball: { carrier: 7 }, highlight: [7] },
      { duration: 1, caption: 'Le 6 adverse charge l’épaule en avant, sans les bras, au niveau de la tête : geste très dangereux.', players: { 7: [50, 30], 8: [46, 34] }, opponents: { 6: [52, 29] }, highlight: [7] },
      { duration: 2.2, caption: 'Carton rouge : il est exclu pour le reste du match, sans remplacement.', opponents: { 6: [54, 72] }, ball: { at: [50, 31] }, highlight: [] },
    ],
    video: { titre: 'Les gestes interdits', description: 'Ce qui vaut un carton rouge et pourquoi : sécurité des joueurs et respect de l’adversaire.' },
    quiz: [
      { type: 'qcm', question: 'Après un carton rouge, le joueur peut-il être remplacé ?', choix: ['Oui, tout de suite', 'Non, son équipe finit à 14', 'Après 10 minutes'], bonne: 1, explication: 'L’équipe joue en infériorité jusqu’à la fin du match.' },
      { type: 'glisser', question: 'Associe chaque faute à sa sanction habituelle.', cibles: ['En-avant', 'Hors-jeu', 'Coup de poing'], etiquettes: ['Mêlée', 'Pénalité', 'Carton rouge'], explication: 'Faute technique : mêlée. Faute de jeu : pénalité. Violence : carton rouge.' },
      { type: 'qcm', question: 'Qui décide d’une suspension après un carton rouge ?', choix: ['L’arbitre', 'Une commission de discipline', 'Le capitaine'], bonne: 1, explication: 'La commission étudie le geste après le match.' },
    ],
  },

  // ------------------------------------------------------------------ Expert
  {
    id: 'avantage',
    titre: 'L’avantage',
    module: 'expert',
    niveau: 'intermediaire',
    resume: 'L’arbitre laisse jouer après une faute si l’équipe non fautive peut en profiter.',
    explication: {
      simple: 'Quand une équipe commet une faute, l’arbitre peut attendre au lieu de siffler. Il tend le bras du côté de l’équipe non fautive et annonce « avantage ». Si celle-ci gagne du terrain ou une vraie occasion, l’avantage est acquis. Sinon, l’arbitre revient à la faute.',
      points: [
        'L’avantage peut être tactique (une occasion de marquer) ou territorial (du terrain gagné).',
        'Sur une faute technique (en-avant), l’avantage est souvent court ; sur une pénalité, plus long.',
        'Pendant l’avantage, on peut tenter un jeu au pied ou un drop sans risque : si ça échoue, on revient à la pénalité.',
      ],
      sanction: 'Avantage non obtenu : retour à la faute (mêlée ou pénalité).',
    },
    zoom: { x: [36, 82], y: [22, 62] },
    steps: [
      { duration: 0, caption: 'Le 12 adverse attaque vers notre camp.', players: { 12: [46, 40], 13: [44, 48], 10: [45, 32] }, opponents: { 12: [57, 40], 13: [59, 48], 10: [58, 32] }, ball: { carrier: 12, team: 'adv' } },
      { duration: 1, caption: 'Il perd le ballon vers l’avant : en-avant. L’arbitre tend le bras de notre côté : « avantage ».', opponents: { 12: [52, 40], 13: [55, 48], 10: [54, 32] }, ball: { at: [49, 40] } },
      { duration: 0.9, caption: 'Notre 12 ramasse le ballon.', players: { 12: [49.5, 40.5] }, ball: { carrier: 12 }, highlight: [12] },
      { duration: 1.5, caption: 'Il contre-attaque et gagne 20 m : avantage acquis, le jeu continue. Sinon, mêlée pour nous.', players: { 12: [70, 44], 13: [64, 50], 10: [62, 36] }, opponents: { 12: [60, 41], 13: [62, 47], 10: [61, 34] }, highlight: [12] },
    ],
    video: { titre: 'Lire le bras de l’arbitre', description: 'Les gestes de l’arbitre pendant l’avantage et le moment où il le déclare acquis.' },
    quiz: [
      { type: 'qcm', question: 'L’arbitre tend le bras horizontalement vers ton équipe. Cela signifie…', choix: ['Pénalité accordée', 'Avantage en cours pour ton équipe', 'Mêlée'], bonne: 1, explication: 'Le bras tendu signale l’avantage à l’équipe non fautive.' },
      { type: 'qcm', question: 'Pendant un avantage de pénalité, ton 10 tente un drop et le rate. Que se passe-t-il ?', choix: ['Renvoi aux 22 m', 'Retour à la pénalité', 'Mêlée adverse'], bonne: 1, explication: 'L’avantage n’est pas acquis : l’arbitre revient à la pénalité.' },
      { type: 'qcm', question: 'Quand l’avantage est-il « acquis » ?', choix: ['Après 3 passes', 'Quand l’équipe a tiré un vrai bénéfice : terrain ou occasion', 'Au bout de 30 secondes'], bonne: 1, explication: 'C’est l’arbitre qui juge le bénéfice tactique ou territorial.' },
    ],
  },
  {
    id: 'maul',
    titre: 'Le maul',
    module: 'expert',
    niveau: 'avance',
    resume: 'Le porteur du ballon reste debout, tenu par un adversaire et lié à au moins un partenaire.',
    explication: {
      simple: 'Un maul se forme quand le porteur du ballon, debout, est tenu par un ou plusieurs adversaires et qu’au moins un de ses partenaires se lie à lui : au minimum 3 joueurs. On peut pousser le maul et faire passer le ballon de main en main vers l’arrière.',
      points: [
        'Chaque équipe a une ligne de hors-jeu au pied du dernier joueur de son maul.',
        'On rejoint le maul par derrière, lié, jamais par le côté.',
        'Quand le maul s’arrête, l’arbitre dit « à jouer » : le ballon doit sortir dans les 5 secondes.',
        'Écrouler volontairement un maul est interdit et dangereux.',
      ],
      sanction: 'Maul écroulé ou entrée par le côté : pénalité. Ballon pas sorti : mêlée pour l’équipe qui ne portait pas le ballon.',
    },
    zoom: { x: [44, 80], y: [-3, 38] },
    steps: [
      { duration: 0, caption: 'Touche pour nous. Le 5 va sauter.', players: NOUS_TOUCHE, opponents: ADV_TOUCHE, ball: { carrier: 2 }, highlight: [5] },
      { duration: 1, caption: 'Le 5 est soulevé et capte.', players: { 5: [59, 22] }, lifted: [5], ball: { carrier: 5 }, highlight: [5] },
      { duration: 1.2, caption: 'Il retombe, tenu par un adversaire : ses partenaires se lient à lui. Le maul est formé.', players: MAUL_NOUS, opponents: MAUL_ADV, highlight: [5] },
      { duration: 1, caption: 'Le ballon passe de main en main jusqu’au dernier joueur, le talonneur, à l’arrière du maul.', ball: { carrier: 2 }, highlight: [2] },
      { duration: 1.8, caption: 'Le maul avance : tout le paquet pousse, la défense recule.', players: shift(MAUL_NOUS, 7), opponents: shift(MAUL_ADV, 7), highlight: [2] },
      { duration: 1, caption: '« À jouer » : le maul ralentit, le 9 sort le ballon.', players: { 9: [60, 24] }, ball: { carrier: 9 }, highlight: [9] },
    ],
    video: { titre: 'Former et conduire un maul', description: 'Réception, liaison des soutiens, transfert du ballon et poussée coordonnée.' },
    quiz: [
      { type: 'qcm', question: 'Combien de joueurs faut-il au minimum pour former un maul ?', choix: ['2', '3', '5'], bonne: 1, explication: 'Le porteur, un adversaire qui le tient et un partenaire lié.' },
      { type: 'qcm', question: 'Le maul s’arrête et l’arbitre dit « à jouer ». Combien de temps pour sortir le ballon ?', choix: ['5 secondes', '15 secondes', 'Aucune limite'], bonne: 0, explication: 'Sinon, mêlée pour l’équipe qui ne portait pas le ballon.' },
      { type: 'glisser', question: 'Associe chaque situation de maul à sa conséquence.', cibles: ['Entrée par le côté', 'Maul écroulé volontairement', 'Ballon pas sorti à temps'], etiquettes: ['Pénalité (hors-jeu)', 'Pénalité (jeu dangereux)', 'Mêlée adverse'], explication: 'On rejoint par derrière, on ne fait pas tomber un maul, et on sort le ballon quand il s’arrête.' },
    ],
  },
  {
    id: 'ruck',
    titre: 'Le ruck',
    module: 'expert',
    niveau: 'intermediaire',
    resume: 'Ballon au sol, au moins un joueur de chaque équipe debout et au contact au-dessus : on joue avec les pieds.',
    explication: {
      simple: 'Après un plaquage, le ballon est au sol. Dès qu’un joueur de chaque équipe, debout, est en contact au-dessus du ballon, c’est un ruck. Les mains sont alors interdites : on pousse pour libérer le ballon, que le 9 vient ramasser derrière.',
      points: [
        'Le plaqué lâche ou pose le ballon tout de suite ; le plaqueur le libère et s’écarte.',
        'On entre dans le ruck par derrière le dernier pied de son équipe (« la porte »).',
        'Chaque équipe a sa ligne de hors-jeu au dernier pied de son ruck.',
        'Quand le ballon est sorti, l’arbitre dit « utilisez-le » : 5 secondes pour le jouer.',
      ],
      sanction: 'Mains dans le ruck, entrée par le côté, hors-jeu : pénalité. Ballon injouable : mêlée.',
    },
    zoom: getCombinaison('ruck').zoom,
    steps: getCombinaison('ruck').steps,
    video: { titre: 'Le ruck : porteur, soutiens, sortie', description: 'Ralenti d’un ruck gagné : placement au sol, nettoyage par les soutiens et passe du 9.' },
    quiz: [
      { type: 'qcm', question: 'Dans un ruck formé, peut-on jouer le ballon avec les mains ?', choix: ['Oui', 'Non, seulement avec les pieds', 'Seulement le 9'], bonne: 1, explication: 'Dans le ruck, on libère le ballon avec les pieds ; le 9 le ramasse une fois sorti.' },
      { type: 'qcm', question: 'Par où doit-on entrer dans un ruck ?', choix: ['Par le côté', 'Par derrière le dernier pied de son équipe', 'Par-dessus en plongeant'], bonne: 1, explication: 'On passe par « la porte », derrière son dernier joueur.' },
      {
        type: 'terrain', mode: 'joueur',
        question: 'Ruck : le ballon va sortir pour nous. Clique sur le défenseur adverse hors-jeu.',
        situation: { players: NOUS_RUCK, opponents: { ...ADV_RUCK, 12: [51.5, 38] }, ball: { at: BALLON_RUCK }, zoom: { x: [34, 70], y: [2, 48] } },
        bonne: { equipe: 'adv', numero: 12 },
        explication: 'Sa ligne de hors-jeu passe au dernier pied de son ruck (vers x = 54). Le 12 adverse est devant.',
      },
    ],
  },
  {
    id: 'melee',
    titre: 'La mêlée',
    module: 'expert',
    niveau: 'intermediaire',
    resume: 'Huit contre huit, liés, pour remettre le ballon en jeu après une faute technique.',
    explication: {
      simple: 'La mêlée se forme après un en-avant, une passe en avant ou un ballon injouable. Les huit avants de chaque équipe se lient et s’engagent à l’ordre de l’arbitre : « Flexion, lier, jeu ». Le 9 introduit droit, le talonneur ramène le ballon du pied.',
      points: [
        'L’introduction se fait droit, au milieu du tunnel.',
        'Les trois-quarts restent 5 m derrière le dernier pied de leur mêlée jusqu’à la sortie du ballon.',
        'Le 9 adverse suit le ballon : il reste derrière le ballon, à côté de la mêlée.',
        'En jeunes (U18), la poussée est limitée à 1,5 m et les mêlées tournées sont interdites.',
      ],
      sanction: 'Introduction pas droite : coup franc. Mêlée écroulée volontairement : pénalité.',
    },
    zoom: getCombinaison('melee').zoom,
    steps: getCombinaison('melee').steps,
    video: { titre: 'Mêlée en sécurité', description: 'Position du dos, liaisons et engagement en trois temps, vus de côté et de dessus.' },
    quiz: [
      { type: 'glisser', question: 'Remets les ordres de l’arbitre et les étapes de la mêlée dans l’ordre.', cibles: ['1', '2', '3', '4', '5'], etiquettes: ['Flexion', 'Lier', 'Jeu', 'Introduction du 9', 'Talonnage'], explication: 'Les trois ordres de l’arbitre, puis l’introduction et le talonnage.' },
      { type: 'qcm', question: 'Où se placent les trois-quarts pendant la mêlée ?', choix: ['Collés à la mêlée', 'À 5 m derrière le dernier pied de leur mêlée', 'Où ils veulent'], bonne: 1, explication: 'Ils restent derrière la ligne des 5 m jusqu’à ce que le ballon sorte.' },
      { type: 'qcm', question: 'En U18, de combien peut-on pousser en mêlée ?', choix: ['Sans limite', '1,5 m', '5 m'], bonne: 1, explication: 'La poussée est limitée pour la sécurité des jeunes joueurs.' },
    ],
  },
  {
    id: 'touche-expert',
    titre: 'La touche (règles avancées)',
    module: 'expert',
    niveau: 'intermediaire',
    resume: 'Alignements, sauteurs soulevés, ligne des 10 m pour les trois-quarts et fin de la touche.',
    explication: {
      simple: 'L’équipe qui lance décide du nombre de joueurs dans l’alignement (au moins 2) ; l’adversaire ne peut pas en mettre plus. Les trois-quarts restent à 10 m de la ligne de touche jusqu’à la fin de la touche.',
      points: [
        'Les sauteurs peuvent être soulevés, mais pas avant que le ballon soit lancé.',
        'Un receveur (souvent le 9) se place à 2 m de l’alignement.',
        'La touche se termine quand le ballon ou son porteur sort de l’alignement, ou au maul/ruck qui en sort.',
        'Lancer rapide possible avec le même ballon, avant que l’alignement soit formé.',
      ],
      sanction: 'Lancer pas droit : touche ou mêlée au choix de l’adversaire. Obstruction du sauteur : pénalité.',
    },
    zoom: getCombinaison('touche').zoom,
    steps: getCombinaison('touche').steps,
    video: { titre: 'Les rôles dans l’alignement', description: 'Lanceur, sauteurs, lifteurs et receveur : qui fait quoi et à quel moment.' },
    quiz: [
      { type: 'qcm', question: 'Qui décide du nombre de joueurs dans l’alignement ?', choix: ['L’arbitre', 'L’équipe qui lance', 'L’équipe qui défend'], bonne: 1, explication: 'L’adversaire peut en aligner moins, jamais plus.' },
      { type: 'qcm', question: 'À quelle distance de la touche restent les trois-quarts ?', choix: ['5 m', '10 m', '15 m'], bonne: 1, explication: 'Ils restent à 10 m derrière la ligne de touche jusqu’à la fin de la touche.' },
      { type: 'glisser', question: 'Associe chaque joueur à son rôle en touche.', cibles: ['Talonneur', 'Deuxième ligne', 'Pilier', 'Demi de mêlée'], etiquettes: ['Lance', 'Saute', 'Soulève le sauteur', 'Reçoit la passe du sauteur'], explication: 'Chacun a une tâche précise pour que la touche soit propre.' },
    ],
  },
  {
    id: 'hors-jeu-avance',
    titre: 'Le hors-jeu avancé',
    module: 'expert',
    niveau: 'avance',
    resume: 'Les lignes de hors-jeu au ruck, au maul, en mêlée, en touche, et la règle des 10 m.',
    explication: {
      simple: 'Chaque phase a sa ligne de hors-jeu. Au ruck et au maul, elle passe au dernier pied de son équipe. En mêlée, à 5 m derrière le dernier pied. En touche, à 10 m de l’alignement. Après un coup de pied, un joueur devant le botteur et à moins de 10 m du receveur doit reculer.',
      points: [
        'Règle des 10 m : le joueur hors-jeu doit s’éloigner du point de réception, il ne peut pas attendre sur place.',
        'Il est remis en jeu par le botteur ou un partenaire venu de derrière le botteur.',
        'Le receveur qui court 5 m ou passe le ballon ne remet pas en jeu ceux qui sont à moins de 10 m.',
      ],
      sanction: 'Pénalité à l’endroit du hors-jeu.',
    },
    zoom: { x: [20, 72], y: [18, 60] },
    steps: [
      { duration: 0, caption: 'Le 10 adverse va taper long. Son 13 est devant lui, vers notre camp.', players: { 15: [24, 36], 14: [28, 54], 11: [30, 20] }, opponents: { 10: [64, 32], 13: [40, 42], 11: [62, 50] }, ball: { carrier: 10, team: 'adv' }, highlight: [15] },
      { duration: 1.4, caption: 'Coup de pied vers notre 15. Le 13 adverse était devant le botteur : il est hors-jeu.', ball: { at: [30, 36], kick: true }, players: { 15: [29, 36] }, opponents: { 11: [56, 50] } },
      { duration: 1, caption: 'Il est à moins de 10 m du receveur : il doit reculer, pas plaquer.', players: { 15: [30, 36.5] }, ball: { carrier: 15 }, opponents: { 13: [43, 41] }, highlight: [15] },
      { duration: 1.4, caption: 'Le 11 adverse, parti derrière le botteur, le dépasse : le 13 est remis en jeu et peut défendre.', opponents: { 11: [42, 46], 13: [41, 41] }, players: { 15: [34, 37] } },
    ],
    video: { titre: 'Les lignes invisibles', description: 'Les lignes de hors-jeu tracées sur des images de ruck, maul, mêlée, touche et jeu au pied.' },
    quiz: [
      { type: 'glisser', question: 'Associe chaque phase à sa ligne de hors-jeu pour les joueurs qui n’y participent pas.', cibles: ['Ruck et maul', 'Mêlée', 'Touche'], etiquettes: ['Dernier pied de son équipe', '5 m derrière le dernier pied', '10 m derrière l’alignement'], explication: 'Chaque phase statique ou de regroupement a sa propre ligne.' },
      { type: 'qcm', question: 'Après un coup de pied, tu es hors-jeu à 6 m du receveur adverse. Tu dois…', choix: ['Rester immobile', 'Reculer en t’éloignant du receveur', 'Plaquer le receveur'], bonne: 1, explication: 'Règle des 10 m : on s’éloigne activement, on ne reste pas sur place.' },
      {
        type: 'terrain', mode: 'zone',
        question: 'Mêlée : notre ballon est aux pieds du 8. Clique sur une zone où notre 12 peut se placer sans être hors-jeu.',
        situation: { players: sans(NOUS_MELEE, 12), opponents: {}, ball: { at: [43.8, 25] }, zoom: { x: [20, 64], y: [6, 60] } },
        zone: { x: [0, 37], y: [0, 70] },
        explication: 'La ligne de hors-jeu des trois-quarts passe 5 m derrière le dernier pied de la mêlée (le 8, vers x = 42) : il faut être en x ≤ 37.',
      },
    ],
  },
  {
    id: 'obstruction',
    titre: 'L’obstruction',
    module: 'expert',
    niveau: 'avance',
    resume: 'Interdit de bloquer un adversaire quand on est devant son porteur de ballon.',
    explication: {
      simple: 'Un joueur sans ballon ne doit pas empêcher volontairement un adversaire de plaquer le porteur ou de jouer le ballon. Courir devant son porteur pour « faire écran » est une obstruction.',
      points: [
        'Les courses de leurre sont autorisées tant que le leurre ne bloque pas un défenseur.',
        'Le porteur ne doit pas se cacher derrière un partenaire placé devant lui.',
        'En touche, gêner le sauteur adverse est une obstruction.',
        'Charger ou retenir un joueur qui court après un coup de pied est une obstruction.',
      ],
      sanction: 'Pénalité pour l’adversaire.',
    },
    zoom: { x: [36, 66], y: [20, 48] },
    steps: [
      { duration: 0, caption: 'Notre 10 a le ballon. Le 12 adverse s’apprête à le plaquer.', players: { 10: [44, 31], 12: [42, 38] }, opponents: { 12: [56, 33] }, ball: { carrier: 10 }, highlight: [10, 12] },
      { duration: 1.2, caption: 'Notre 12 coupe devant son porteur et se met sur la route du défenseur.', players: { 10: [48, 32], 12: [51, 33.5] }, opponents: { 12: [52.5, 33.5] }, highlight: [12] },
      { duration: 1.2, caption: 'Le défenseur est bloqué : obstruction. Pénalité pour l’adversaire.', players: { 10: [52, 30] }, highlight: [12] },
    ],
    video: { titre: 'Leurre ou obstruction ?', description: 'Comparaison de courses de leurre valables et d’écrans sanctionnés.' },
    quiz: [
      { type: 'qcm', question: 'Ton partenaire court devant toi et bloque le défenseur qui voulait te plaquer. C’est…', choix: ['Une bonne combinaison', 'Une obstruction', 'Un en-avant'], bonne: 1, explication: 'Être devant le porteur et gêner un défenseur, c’est une obstruction.' },
      { type: 'qcm', question: 'Une course de leurre est-elle autorisée ?', choix: ['Jamais', 'Oui, tant que le leurre ne bloque pas de défenseur', 'Seulement en touche'], bonne: 1, explication: 'Le leurre attire la défense sans la gêner physiquement.' },
      { type: 'qcm', question: 'Sanction d’une obstruction ?', choix: ['Mêlée', 'Pénalité', 'Touche'], bonne: 1, explication: 'C’est une faute de jeu : pénalité.' },
    ],
  },
  {
    id: 'jeu-au-pied',
    titre: 'Le jeu au pied',
    module: 'expert',
    niveau: 'avance',
    resume: 'Où se joue la touche selon l’endroit du coup de pied, et la règle du 50-22.',
    explication: {
      simple: 'Un coup de pied qui sort directement en touche (sans rebond dans le terrain) depuis l’extérieur de ses 22 m donne une touche au niveau du botteur. Depuis ses propres 22 m, la touche se joue là où le ballon est sorti.',
      points: [
        'Si le ballon rebondit dans le terrain avant de sortir, la touche se joue là où il sort.',
        '50-22 : depuis son camp, un coup de pied qui rebondit puis sort dans les 22 m adverses donne le lancer au botteur.',
        'Si un joueur ramène le ballon dans ses 22 m, il ne peut pas taper directement en touche avec gain de terrain.',
        'Un coup de pied dans l’en-but aplati par la défense donne un renvoi aux 22 m.',
      ],
      sanction: 'Touche adverse au niveau du botteur.',
    },
    zoom: { x: [0, 70], y: [-3, 42] },
    steps: [
      { duration: 0, caption: 'Le 10 est à 30 m de sa ligne d’essai, hors de ses 22 m.', players: { 10: [30, 25] }, opponents: { 10: [60, 30] }, ball: { carrier: 10 }, highlight: [10] },
      { duration: 1.4, caption: 'Il tape directement en touche, sans rebond.', ball: { at: [56, -1.5], kick: true }, highlight: [10] },
      { duration: 1.4, caption: 'Touche pour l’adversaire au niveau du botteur : aucun terrain gagné.', ball: { at: [30, -1.5] }, highlight: [10] },
      { duration: 1.4, caption: 'Même coup de pied depuis ses propres 22 m…', players: { 10: [16, 25] }, ball: { carrier: 10 }, highlight: [10] },
      { duration: 1.4, caption: '…la touche se joue là où le ballon est sorti : 30 m de gagnés.', ball: { at: [46, -1.5], kick: true }, highlight: [10] },
    ],
    video: { titre: 'Taper en touche intelligemment', description: 'Coup de pied direct, avec rebond et 50-22 : où se joue la touche dans chaque cas.' },
    quiz: [
      { type: 'qcm', question: 'Tu tapes directement en touche depuis le milieu du terrain. Où se joue la touche ?', choix: ['Là où le ballon est sorti', 'Au niveau du botteur', 'Aux 22 m'], bonne: 1, explication: 'Hors de tes 22 m, un coup de pied direct en touche ne fait pas gagner de terrain.' },
      { type: 'qcm', question: 'Depuis ton camp, ton coup de pied rebondit et sort dans les 22 m adverses. C’est…', choix: ['Touche adverse', 'Un 50-22 : touche pour ton équipe', 'Un renvoi'], bonne: 1, explication: 'Le 50-22 récompense le botteur avec le lancer.' },
      {
        type: 'terrain', mode: 'zone',
        question: 'Clique sur la zone d’où un coup de pied direct en touche fait gagner du terrain.',
        situation: { players: { 10: [50, 30] }, opponents: {}, ball: { carrier: 10 }, zoom: null },
        zone: { x: [-10, 22], y: [0, 70] },
        explication: 'Depuis ses propres 22 m (et son en-but), la touche se joue là où le ballon sort.',
      },
    ],
  },
  {
    id: 'ballon-injouable',
    titre: 'Le ballon injouable',
    module: 'expert',
    niveau: 'avance',
    resume: 'Quand le ballon ne peut plus sortir d’un ruck ou d’un maul, l’arbitre donne une mêlée.',
    explication: {
      simple: 'Si le ballon reste bloqué sous les joueurs d’un ruck, ou ne sort pas d’un maul arrêté, l’arbitre déclare le ballon injouable. Le jeu reprend par une mêlée.',
      points: [
        'Ruck : mêlée à l’équipe qui avançait juste avant l’arrêt ; à défaut, à l’équipe qui attaquait.',
        'Maul : mêlée à l’équipe qui ne portait pas le ballon au début du maul.',
        'Le joueur plaqué doit lâcher le ballon tout de suite, sinon c’est pénalité (« tenu au sol »).',
      ],
      sanction: 'Mêlée.',
    },
    zoom: { x: [26, 66], y: [2, 44] },
    steps: [
      { duration: 0, caption: 'Ruck : notre 6 est au sol avec le ballon, les soutiens arrivent des deux côtés.', players: NOUS_RUCK, opponents: ADV_RUCK, ball: { at: BALLON_RUCK } },
      { duration: 1.2, caption: 'Les avants adverses poussent : le ballon reste coincé sous les joueurs.', opponents: shift(ADV_RUCK, -2.5, 0, [4, 5, 6]), players: shift(NOUS_RUCK, -2.5, 0, [6, 7]), highlight: [9] },
      { duration: 1, caption: 'Le 9 ne peut pas le sortir : l’arbitre annonce « ballon injouable ».', highlight: [9] },
      { duration: 2, caption: 'Mêlée pour l’adversaire, qui avançait au moment de l’arrêt.', players: shift(NOUS_MELEE, -6), opponents: shift({ 3: [54, 21], 2: [54, 25], 1: [54, 29], 5: [58, 23], 4: [58, 27], 7: [57.5, 18.6], 6: [57.5, 31.4], 8: [62, 25], 9: [55, 14.5] }, -6), ball: { carrier: 9, team: 'adv' }, highlight: [] },
    ],
    video: { titre: 'Ruck et maul : quand l’arbitre siffle', description: 'Exemples de ballons injouables et de la mêlée qui suit.' },
    quiz: [
      { type: 'qcm', question: 'Un maul s’arrête et le ballon ne sort pas. Qui introduit la mêlée ?', choix: ['L’équipe qui portait le ballon', 'L’équipe qui ne portait pas le ballon au début du maul', 'L’équipe qui défendait son en-but'], bonne: 1, explication: 'C’est la règle « utilise-le ou perds-le ».' },
      { type: 'qcm', question: 'Le ballon reste coincé dans un ruck. Qui introduit la mêlée ?', choix: ['L’équipe qui avançait juste avant', 'Toujours la défense', 'On tire au sort'], bonne: 0, explication: 'Mêlée à l’équipe qui avançait ; si aucune n’avançait, à l’équipe qui attaquait.' },
      { type: 'qcm', question: 'Le joueur plaqué garde le ballon contre lui au sol. Sanction ?', choix: ['Mêlée', 'Pénalité', 'Rien'], bonne: 1, explication: 'Il doit libérer le ballon tout de suite : sinon, pénalité pour « tenu au sol ».' },
    ],
  },
  {
    id: 'fautes-techniques',
    titre: 'Les fautes techniques',
    module: 'expert',
    niveau: 'intermediaire',
    resume: 'Les petites fautes sans danger ni tricherie : mêlée, touche ou coup franc pour l’adversaire.',
    explication: {
      simple: 'Une faute technique est une erreur de geste : en-avant, passe en avant, lancer pas droit, introduction pas droite. Elle n’est pas dangereuse et pas volontaire, elle est donc sanctionnée moins sévèrement qu’une pénalité.',
      points: [
        'En-avant et passe en avant : mêlée pour l’adversaire.',
        'Lancer pas droit en touche : touche ou mêlée au choix de l’adversaire.',
        'Fautes de procédure (mêlée formée trop lentement, trop de joueurs en touche) : coup franc.',
        'Sur un coup franc, on ne peut pas taper directement au but.',
      ],
      sanction: 'Mêlée, touche ou coup franc selon la faute.',
    },
    zoom: { x: [44, 78], y: [-3, 36] },
    steps: [
      { duration: 0, caption: 'Touche pour nous. Le talonneur va lancer.', players: NOUS_TOUCHE, opponents: ADV_TOUCHE, ball: { carrier: 2 }, highlight: [2] },
      { duration: 1, caption: 'Le lancer part en biais vers le côté adverse : il n’est pas droit.', ball: { at: [62.5, 12] }, highlight: [2] },
      { duration: 1, caption: 'Le 4 adverse le capte, mais l’arbitre a déjà sifflé la faute.', opponents: { 4: [61.5, 10.5] }, ball: { carrier: 4, team: 'adv' } },
      { duration: 1.6, caption: 'Faute technique : l’adversaire choisit de relancer en touche ou de prendre une mêlée à 15 m de la touche.', highlight: [] },
    ],
    video: { titre: 'Les gestes de l’arbitre', description: 'Les signaux de l’en-avant, de la passe en avant, du lancer pas droit et du coup franc.' },
    quiz: [
      { type: 'glisser', question: 'Associe chaque faute technique à sa sanction.', cibles: ['En-avant', 'Lancer pas droit', 'Trop de joueurs dans l’alignement'], etiquettes: ['Mêlée adverse', 'Touche ou mêlée au choix', 'Coup franc'], explication: 'Les fautes techniques ne donnent pas de pénalité.' },
      { type: 'qcm', question: 'Sur un coup franc, peut-on taper directement au but ?', choix: ['Oui, 3 points', 'Non', 'Oui, 2 points'], bonne: 1, explication: 'Le coup franc ne permet pas de buter directement.' },
      { type: 'qcm', question: 'Pourquoi l’en-avant n’est-il pas puni d’une pénalité ?', choix: ['Parce qu’il n’est ni dangereux ni volontaire', 'Parce qu’il est fréquent', 'Parce que l’arbitre ne le voit pas'], bonne: 0, explication: 'C’est une erreur technique ; l’en-avant volontaire, lui, est pénalisé.' },
    ],
  },
  {
    id: 'discipline',
    titre: 'La discipline',
    module: 'expert',
    niveau: 'avance',
    resume: 'Respect de l’arbitre, recul de 10 m, capitaine seul interlocuteur : la discipline fait gagner des matchs.',
    explication: {
      simple: 'Seul le capitaine parle à l’arbitre, calmement. Sur une pénalité, les fautifs reculent tout de suite de 10 m sans gêner le jeu rapide. Contester, retarder le jeu ou ne pas reculer coûte cher.',
      points: [
        'Ne pas reculer de 10 m ou gêner le jeu rapide : la pénalité est avancée de 10 m.',
        'Les fautes répétées de l’équipe mènent à un carton jaune collectif.',
        'Contestation, insultes ou geste d’humeur : pénalité et carton possible.',
        'Une équipe disciplinée concède peu de pénalités et garde le ballon.',
      ],
      sanction: 'Pénalité avancée de 10 m, carton jaune ou rouge selon la gravité.',
    },
    zoom: { x: [34, 76], y: [10, 52] },
    steps: [
      { duration: 0, caption: 'Pénalité pour nous. Notre 9 veut jouer vite.', players: { 9: [50, 30], 8: [47, 26], 10: [45, 35] }, opponents: { 3: [52, 28], 4: [53, 33], 7: [54, 38], 6: [54, 24] }, ball: { carrier: 9 }, highlight: [9] },
      { duration: 1.4, caption: 'Les adversaires reculent… sauf le 3, qui reste devant le ballon et proteste.', opponents: { 4: [61, 33], 7: [61, 38], 6: [61, 24], 3: [51.5, 29] }, highlight: [9] },
      { duration: 1.6, caption: 'L’arbitre avance la pénalité de 10 m : nous rejouons plus près de l’en-but.', players: { 9: [60, 30], 8: [57, 26], 10: [55, 35] }, opponents: { 3: [70, 29], 4: [71, 33], 7: [71, 38], 6: [71, 24] }, highlight: [9] },
    ],
    video: { titre: 'Le rôle du capitaine', description: 'Comment le capitaine parle à l’arbitre et garde son équipe disciplinée.' },
    quiz: [
      { type: 'qcm', question: 'Qui peut parler à l’arbitre pendant le match ?', choix: ['Tous les joueurs', 'Le capitaine', 'L’entraîneur depuis le bord'], bonne: 1, explication: 'Le capitaine est l’interlocuteur de l’arbitre, toujours calmement.' },
      { type: 'qcm', question: 'Un joueur fautif ne recule pas de 10 m sur une pénalité. Conséquence ?', choix: ['Rien', 'La pénalité est avancée de 10 m', 'Mêlée'], bonne: 1, explication: 'Ne pas reculer coûte 10 m de plus.' },
      { type: 'qcm', question: 'Ton équipe accumule les pénalités dans ses 22 m. Que risque-t-elle ?', choix: ['Un carton jaune pour fautes répétées', 'Une mêlée', 'Un renvoi'], bonne: 0, explication: 'L’arbitre peut sanctionner les fautes répétées par un carton.' },
    ],
  },
]

export const getRegle = (id) => REGLES.find((r) => r.id === id)
export const reglesDuModule = (module) => REGLES.filter((r) => r.module === module)

// Seuil pour qu'un quiz de règle soit « réussi » (au moins 2 bonnes réponses sur 3).
export const SEUIL_REUSSITE = 2 / 3

// Questions du module, avec un identifiant stable pour la progression.
export function questionsDeRegle(regle) {
  return regle.quiz.map((q, i) => ({ ...q, id: `regle-${regle.id}-${i}`, niveau: regle.niveau, theme: regle.module === 'debutant' ? 'regles-debutant' : 'regles-expert', source: regle.titre }))
}

