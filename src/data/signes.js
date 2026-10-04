// Signes de l'arbitre (#regles-signes).
//
// Chaque signe contient :
//   - categorie : voir CATEGORIES
//   - image     : illustration fournie (src/assets/signes/<id>.webp), ou absente
//   - dessin    : geste dessiné par l'application (components/Arbitre.jsx), affiché quand il n'y a pas d'image
//   - conforme  : false quand l'illustration fournie ne montre pas exactement le geste officiel ;
//                 la fiche propose alors de voir aussi le geste dessiné
//   - geste, quand, ensuite : textes de la fiche
//
// Remplacer un dessin par une illustration : déposer src/assets/signes/<id>.webp (fond clair conseillé),
// l'importer ci-dessous et l'ajouter au signe avec `image`.

import imgEssai from '../assets/signes/essai.webp'
import imgTransformation from '../assets/signes/transformation.webp'
import imgPenalite from '../assets/signes/penalite.webp'
import imgCoupFranc from '../assets/signes/coup-franc.webp'
import imgAvantage from '../assets/signes/avantage.webp'
import imgEnAvant from '../assets/signes/en-avant.webp'

export const CATEGORIES = [
  { id: 'points', label: 'Points' },
  { id: 'sanctions', label: 'Sanctions' },
  { id: 'fautes', label: 'Fautes de jeu' },
  { id: 'relances', label: 'Relances du jeu' },
  { id: 'discipline', label: 'Cartons et vidéo' },
]

export const SIGNES = [
  // ------------------------------------------------------------------ Points
  {
    id: 'essai',
    titre: 'Essai',
    categorie: 'points',
    image: imgEssai,
    conforme: false,
    dessin: { d: { a: -88, b: -91 } },
    geste: 'Dos à la ligne de ballon mort, l’arbitre lève un bras bien droit vers le ciel. Il se place à l’endroit où le ballon a été aplati.',
    quand: 'Un attaquant aplatit le ballon dans l’en-but adverse (ou sur la ligne d’essai) en exerçant une pression vers le bas.',
    ensuite: 'L’équipe marque 5 points et tente la transformation, face à l’endroit où l’essai a été marqué. Si une faute adverse a empêché un essai probable, l’arbitre court sous les poteaux : c’est un essai de pénalité, 7 points, sans transformation.',
  },
  {
    id: 'transformation',
    titre: 'Transformation réussie',
    categorie: 'points',
    image: imgTransformation,
    dessin: { g: { a: -100, b: -92 }, d: { a: -80, b: -88 } },
    geste: 'Bras levés vers le ciel. Les juges de touche, placés derrière les poteaux, lèvent aussi leur drapeau.',
    quand: 'Le ballon botté passe entre les poteaux, au-dessus de la barre. Même signe pour une pénalité ou un drop réussi.',
    ensuite: 'Transformation : 2 points. Pénalité ou drop : 3 points. L’équipe qui vient d’encaisser les points donne le coup d’envoi au centre du terrain.',
  },

  // ------------------------------------------------------------------ Sanctions
  {
    id: 'penalite',
    titre: 'Pénalité',
    categorie: 'sanctions',
    image: imgPenalite,
    dessin: { d: { a: -45, b: -50 } },
    geste: 'Épaules parallèles à la ligne de touche, bras levé en oblique vers l’équipe qui n’a pas fait la faute.',
    quand: 'Faute grave ou volontaire : hors-jeu, ballon non libéré, plaquage dangereux, mêlée écroulée, antijeu…',
    ensuite: 'L’équipe non fautive choisit : tirer au but (3 points), taper en touche (elle gagne du terrain et garde le lancer), jouer vite à la main (taper-passer) ou demander une mêlée. Les adversaires reculent de 10 mètres.',
  },
  {
    id: 'coup-franc',
    titre: 'Coup franc',
    categorie: 'sanctions',
    image: imgCoupFranc,
    conforme: false,
    dessin: { d: { a: -4, b: -90 } },
    geste: 'Épaules parallèles à la ligne de touche, bras plié à angle droit : le haut du bras pointe vers l’équipe non fautive, l’avant-bras vers le ciel.',
    quand: 'Faute technique moins grave : introduction pas droite ou retard en mêlée, ou « marque » d’un défenseur qui attrape un coup de pied adverse dans ses 22.',
    ensuite: 'L’équipe non fautive joue vite à la main, tape au pied ou demande une mêlée. Elle ne peut pas tirer au but, et si elle tape directement en touche, c’est l’adversaire qui lance. Les adversaires reculent de 10 mètres.',
  },
  {
    id: 'avantage',
    titre: 'Avantage',
    categorie: 'sanctions',
    image: imgAvantage,
    dessin: { d: { a: 25, b: 20 } },
    geste: 'Bras tendu vers l’équipe qui a subi la faute, à hauteur de la taille, pendant quelques secondes.',
    quand: 'L’arbitre a vu une faute mais l’équipe qui l’a subie peut en profiter : il laisse jouer au lieu de siffler.',
    ensuite: 'Si l’équipe gagne du terrain ou une vraie occasion, l’arbitre annonce « avantage terminé » et le jeu continue. Sinon, il siffle et revient à l’endroit de la faute pour la sanctionner.',
  },

  // ------------------------------------------------------------------ Fautes de jeu
  {
    id: 'en-avant',
    titre: 'En-avant',
    categorie: 'fautes',
    image: imgEnAvant,
    conforme: false,
    dessin: {
      d: { a: -70, b: -105 },
      mouvement: ['M108 -2 q-5 7 0 14', 'M139 -2 q5 7 0 14'],
    },
    geste: 'Bras tendu au-dessus de la tête, main ouverte qui bouge d’avant en arrière.',
    quand: 'Un joueur perd le ballon, le fait tomber ou le repousse avec la main ou le bras, et le ballon part vers l’en-but adverse.',
    ensuite: 'Mêlée pour l’adversaire, à l’endroit de l’en-avant. Un en-avant volontaire est sanctionné d’une pénalité.',
  },
  {
    id: 'passe-en-avant',
    titre: 'Passe en avant',
    categorie: 'fautes',
    dessin: {
      g: { a: 10, b: -5 },
      d: { a: 60, b: -20 },
      accessoires: [{ type: 'ballon', at: [176, 56], rot: -20, dessus: true }],
      fleches: ['M150 44 L192 36'],
    },
    geste: 'Les deux mains font le geste d’une passe lancée vers l’avant.',
    quand: 'Le ballon est passé ou lancé vers l’en-but adverse au lieu de partir vers l’arrière ou à plat.',
    ensuite: 'Mêlée pour l’adversaire, à l’endroit de la passe.',
  },
  {
    id: 'hors-jeu',
    titre: 'Hors-jeu au ruck ou au maul',
    categorie: 'fautes',
    dessin: {
      d: { a: 60, b: 75 },
      mouvement: ['M126 127 q16 11 32 0', 'M130 134 q12 7 24 0'],
    },
    geste: 'Bras tendu vers le bas, qui se balance comme un pendule.',
    quand: 'Un joueur ne repart pas derrière le dernier pied de son équipe dans le ruck ou le maul et participe au jeu.',
    ensuite: 'Pénalité pour l’adversaire, à l’endroit de la faute.',
  },
  {
    id: 'plaqueur',
    titre: 'Plaqueur qui ne relâche pas',
    categorie: 'fautes',
    dessin: {
      g: { a: 160, b: 175 },
      d: { a: 20, b: 5 },
      fleches: ['M40 92 L16 92', 'M160 92 L184 92'],
    },
    geste: 'Bras ramenés comme pour saisir un joueur, puis ouverts comme pour le lâcher.',
    quand: 'Après le plaquage, le plaqueur garde le porteur au sol au lieu de le lâcher et de se relever.',
    ensuite: 'Pénalité pour l’équipe du joueur plaqué.',
  },
  {
    id: 'ballon-non-libere',
    titre: 'Ballon non libéré',
    categorie: 'fautes',
    dessin: {
      g: { a: 100, b: -25 },
      d: { a: 80, b: 205 },
      accessoires: [{ type: 'ballon', at: [100, 80], rx: 13, ry: 8, dessus: true }],
    },
    geste: 'Les deux mains serrées contre la poitrine, comme si l’arbitre tenait un ballon.',
    quand: 'Le joueur plaqué garde le ballon au sol au lieu de le poser, le passer ou le lâcher tout de suite.',
    ensuite: 'Pénalité pour l’équipe qui a plaqué.',
  },
  {
    id: 'plaquage-haut',
    titre: 'Plaquage haut ou dangereux',
    categorie: 'fautes',
    dessin: {
      d: { a: 170, b: -41 },
      fleches: ['M116 58 L84 58'],
    },
    geste: 'La main passe devant la gorge.',
    quand: 'Plaquage au-dessus de la ligne des épaules, au cou ou à la tête, ou plaquage sur un joueur en l’air. Chez les amateurs en France, le plaquage doit viser la ceinture ou en dessous.',
    ensuite: 'Pénalité, et selon la gravité carton jaune ou rouge.',
  },
  {
    id: 'obstruction',
    titre: 'Obstruction',
    categorie: 'fautes',
    dessin: { g: { a: 60, b: -40 }, d: { a: 120, b: 220 } },
    geste: 'Avant-bras croisés devant la poitrine, comme des ciseaux ouverts.',
    quand: 'Un joueur gêne un adversaire qui n’a pas le ballon : il lui barre la route, le bouscule ou court devant son porteur pour le protéger.',
    ensuite: 'Pénalité pour l’équipe gênée.',
  },

  // ------------------------------------------------------------------ Relances du jeu
  {
    id: 'melee',
    titre: 'Mêlée',
    categorie: 'relances',
    dessin: { d: { a: 0, b: 0 } },
    geste: 'Épaules parallèles à la ligne de touche, bras tendu à l’horizontale vers l’équipe qui introduira le ballon.',
    quand: 'Après un en-avant, une passe en avant, un ballon injouable dans un ruck ou un maul, ou quand une équipe la choisit sur pénalité ou coup franc.',
    ensuite: 'Les avants se lient à 8 contre 8. Le demi de mêlée de l’équipe désignée introduit le ballon au milieu du tunnel.',
  },
  {
    id: 'touche',
    titre: 'Ballon en touche',
    categorie: 'relances',
    dessin: {
      d: { a: -80, b: -88, main: 'poing' },
      g: { a: 170, b: 175 },
      accessoires: [{ type: 'drapeau', dessus: true }],
    },
    geste: 'Le juge de touche lève son drapeau et tend l’autre bras vers l’équipe qui lancera.',
    quand: 'Le ballon ou le joueur qui le porte touche la ligne de touche ou le sol au-delà.',
    ensuite: 'Alignement en touche, lancé par l’équipe qui n’a pas fait sortir le ballon. Exception : sur pénalité tapée en touche, c’est l’équipe qui a tapé qui lance.',
  },
  {
    id: 'renvoi-22',
    titre: 'Renvoi aux 22 mètres',
    categorie: 'relances',
    dessin: { d: { a: 25, b: 30, main: 'pointe' } },
    geste: 'Bras pointé vers le milieu de la ligne des 22 mètres.',
    quand: 'Les attaquants envoient le ballon dans l’en-but adverse et il sort derrière la ligne de ballon mort ou en touche de but, par exemple après un tir au but raté.',
    ensuite: 'Les défenseurs relancent par un coup de pied tombé (drop) joué de derrière leur ligne des 22 mètres.',
  },
  {
    id: 'en-but',
    titre: 'Ballon porté en l’air dans l’en-but',
    categorie: 'relances',
    dessin: {
      g: { a: 130, b: 0 },
      d: { a: 50, b: 180 },
      accessoires: [{ type: 'ballon', at: [100, 85], rx: 6, ry: 4.5, fantome: true }],
    },
    geste: 'Les mains écartées l’une en face de l’autre : l’espace entre elles montre que le ballon n’a pas touché le sol.',
    quand: 'Un attaquant entre dans l’en-but mais les défenseurs l’empêchent d’aplatir le ballon.',
    ensuite: 'Pas d’essai. Les défenseurs relancent par un renvoi en drop depuis leur ligne d’en-but.',
  },

  // ------------------------------------------------------------------ Cartons et vidéo
  {
    id: 'carton-jaune',
    titre: 'Carton jaune',
    categorie: 'discipline',
    dessin: { d: { a: -75, b: -92 }, accessoires: [{ type: 'carton', couleur: 'jaune', dessus: true }] },
    geste: 'L’arbitre lève le carton jaune au-dessus de la tête, face au joueur.',
    quand: 'Faute volontaire ou répétée, jeu dangereux, antijeu qui empêche une occasion d’essai.',
    ensuite: 'Le joueur sort 10 minutes et son équipe joue à 14 pendant ce temps. Le jeu reprend par la sanction de la faute, souvent une pénalité.',
  },
  {
    id: 'carton-rouge',
    titre: 'Carton rouge',
    categorie: 'discipline',
    dessin: { d: { a: -75, b: -92 }, accessoires: [{ type: 'carton', couleur: 'rouge', dessus: true }] },
    geste: 'L’arbitre lève le carton rouge au-dessus de la tête, face au joueur.',
    quand: 'Faute très grave : coup, plaquage dangereux à la tête, deuxième carton jaune du match.',
    ensuite: 'Le joueur est exclu jusqu’à la fin du match et n’est pas remplacé. Une commission de discipline peut ensuite le suspendre.',
  },
  {
    id: 'carton-bleu',
    titre: 'Carton bleu',
    categorie: 'discipline',
    dessin: { d: { a: -75, b: -92 }, accessoires: [{ type: 'carton', couleur: 'bleu', dessus: true }] },
    geste: 'L’arbitre lève le carton bleu. Ce n’est pas une punition.',
    quand: 'Dans les compétitions amateurs de la FFR, quand un joueur montre des signes de commotion (choc à la tête, joueur sonné).',
    ensuite: 'Le joueur sort et ne revient pas dans le match ; il peut être remplacé. Il doit voir un médecin et respecter un repos avant de rejouer.',
  },
  {
    id: 'video',
    titre: 'Arbitrage vidéo',
    categorie: 'discipline',
    dessin: {
      g: { a: -120, b: -80 },
      d: { a: -60, b: -100 },
      accessoires: [{ type: 'ecran', rect: [70, -20, 130, 9], dessus: true }],
    },
    geste: 'L’arbitre dessine un rectangle avec ses mains, comme un écran de télévision.',
    quand: 'Dans les matchs filmés et équipés : l’arbitre doute d’un essai ou veut revoir un geste dangereux.',
    ensuite: 'L’arbitre vidéo revoit les images et l’arbitre de champ donne la décision finale.',
  },
]

export const signesDe = (categorie) => SIGNES.filter((s) => s.categorie === categorie)
