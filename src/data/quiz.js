// Banque de questions et séries de quiz.
//
// Format commun : { id, type, niveau, theme, question, explication, ... } selon le type :
//   - qcm      : choix (textes), bonne (index)
//   - glisser  : cibles (cases), etiquettes (même longueur : etiquettes[i] va dans cibles[i])
//   - terrain  : situation { players, opponents, ball, zoom } et
//                mode 'joueur' (bonne { equipe: 'nous' | 'adv', numero }) ou 'zone' (zone { x: [a, b], y: [c, d] })
//   - tactique : une décision du mode match (situation animée, choix notés de 0 à 2), voir data/matchs.js
// Les questions des règles (data/regles.js), des postes (data/positions.js) et des matchs
// sont rassemblées ici, avec un identifiant stable pour la progression.

import { BASE_FORMATION } from './scenarios.js'
import { REGLES, questionsDeRegle } from './regles.js'
import { POSITIONS } from './positions.js'
import { MATCHS } from './matchs.js'

const sans = (players, ...numeros) => Object.fromEntries(Object.entries(players).filter(([n]) => !numeros.includes(Number(n))))

const AUTRES = [
  { id: 'jeu-postes-numeros', type: 'glisser', niveau: 'debutant', theme: 'postes', question: 'Associe chaque numéro à son poste.', cibles: ['1', '2', '9', '10', '15'], etiquettes: ['Pilier gauche', 'Talonneur', 'Demi de mêlée', 'Demi d’ouverture', 'Arrière'], explication: 'Les numéros sont officiels : chacun correspond à un poste précis.' },
  { id: 'jeu-postes-lignes', type: 'glisser', niveau: 'debutant', theme: 'postes', question: 'Associe chaque ligne à ses numéros.', cibles: ['Première ligne', 'Deuxième ligne', 'Troisième ligne', 'Charnière', 'Centres'], etiquettes: ['1, 2, 3', '4, 5', '6, 7, 8', '9, 10', '12, 13'], explication: 'Les avants vont de 1 à 8, les trois-quarts de 9 à 15.' },
  { id: 'jeu-vocabulaire', type: 'glisser', niveau: 'debutant', theme: 'vocabulaire', question: 'Associe chaque mot à sa définition.', cibles: ['Ruck', 'Maul', 'Plaquage', 'En-but'], etiquettes: ['Ballon au sol, joueurs debout au-dessus', 'Porteur debout tenu et entouré', 'Amener le porteur au sol', 'Zone où l’on marque l’essai'], explication: 'Le vocabulaire de base pour comprendre les consignes de l’entraîneur.' },
  { id: 'jeu-vocabulaire-2', type: 'glisser', niveau: 'intermediaire', theme: 'vocabulaire', question: 'Associe chaque mot à sa définition.', cibles: ['Croisée', 'Passe sautée', 'Fixer', 'Ligne d’avantage'], etiquettes: ['Deux joueurs se croisent, le ballon change de sens', 'Passe par-dessus un partenaire', 'Attirer un défenseur avant de passer', 'Ligne imaginaire du point de départ du jeu'], explication: 'Les mots du jeu de trois-quarts.' },
  {
    id: 'terrain-arriere', type: 'terrain', mode: 'zone', niveau: 'debutant', theme: 'placement',
    question: 'Mêlée au milieu du terrain : clique là où se place l’arrière (15).',
    situation: { players: sans(BASE_FORMATION, 15), opponents: {}, ball: { carrier: 9 }, zoom: { x: [14, 62], y: [0, 70] } },
    zone: { x: [16, 32], y: [24, 46] },
    explication: 'L’arrière se place loin derrière ses trois-quarts, au centre, pour couvrir le jeu au pied.',
  },
  {
    id: 'terrain-ailier-gauche', type: 'terrain', mode: 'zone', niveau: 'debutant', theme: 'placement',
    question: 'Clique là où se place l’ailier gauche (11) sur cette mêlée.',
    situation: { players: sans(BASE_FORMATION, 11), opponents: {}, ball: { carrier: 9 }, zoom: { x: [14, 62], y: [0, 70] } },
    zone: { x: [30, 48], y: [0, 16] },
    explication: 'L’ailier gauche reste large, côté fermé, près de la touche gauche.',
  },
  {
    id: 'terrain-9', type: 'terrain', mode: 'joueur', niveau: 'debutant', theme: 'placement',
    question: 'Clique sur le joueur qui introduit le ballon en mêlée.',
    situation: { players: BASE_FORMATION, opponents: {}, ball: { carrier: 9 }, zoom: { x: [14, 62], y: [0, 70] } },
    bonne: { equipe: 'nous', numero: 9 },
    explication: 'Le demi de mêlée (9) introduit le ballon dans le tunnel.',
  },
  {
    id: 'terrain-8', type: 'terrain', mode: 'joueur', niveau: 'debutant', theme: 'placement',
    question: 'Clique sur le joueur placé en fond de mêlée, qui contrôle le ballon à ses pieds.',
    situation: { players: BASE_FORMATION, opponents: {}, ball: { carrier: 9 }, zoom: { x: [30, 60], y: [8, 42] } },
    bonne: { equipe: 'nous', numero: 8 },
    explication: 'Le troisième ligne centre (8) pousse au fond de la mêlée.',
  },
  { id: 'jeu-securite', type: 'qcm', niveau: 'debutant', theme: 'securite', question: 'Un joueur reste au sol après un choc à la tête. Que fais-tu ?', choix: ['Tu le relèves vite', 'Tu préviens l’arbitre et l’encadrement', 'Tu continues de jouer'], bonne: 1, explication: 'En cas de choc à la tête, on arrête et on alerte : sécurité d’abord.' },
  { id: 'jeu-securite-2', type: 'qcm', niveau: 'debutant', theme: 'securite', question: 'Commotion suspectée : le joueur peut-il reprendre le match ?', choix: ['Oui, s’il se sent mieux', 'Non, il sort et consulte un médecin', 'Après 5 minutes'], bonne: 1, explication: 'Au moindre doute, le joueur sort et ne revient pas dans le match.' },
  { id: 'jeu-securite-3', type: 'qcm', niveau: 'debutant', theme: 'securite', question: 'Comment bien tomber quand tu es plaqué ?', choix: ['En tendant le bras pour amortir', 'En roulant sur l’épaule, ballon protégé', 'En arrière sur la tête'], bonne: 1, explication: 'On ne tend pas le bras (risque de fracture) : on roule et on protège le ballon.' },
]

// Questions des fiches postes, au format commun.
const POSTES = POSITIONS.flatMap((p) => p.quiz.map((q, i) => ({
  ...q, type: 'qcm', id: `poste-${p.numero}-${i}`, niveau: 'debutant', theme: 'postes', source: `${p.numero} · ${p.nom}`,
})))

export const questionsDePoste = (numero) => POSTES.filter((q) => q.id.startsWith(`poste-${numero}-`))

// Décisions des matchs, en questions « choix tactique ».
const TACTIQUES = MATCHS.flatMap((m) => m.decisions.map((d, i) => ({
  ...d, type: 'tactique', id: `match-${m.id}-${i}`, niveau: m.niveau, theme: 'tactique', source: m.titre,
})))

const REGLES_Q = REGLES.flatMap(questionsDeRegle)

export const QUESTIONS = [...REGLES_Q, ...POSTES, ...AUTRES, ...TACTIQUES]

export const TYPES = {
  qcm: 'QCM',
  glisser: 'Glisser-déposer',
  terrain: 'Positionnement sur le terrain',
  tactique: 'Choix tactique',
}

// Séries proposées dans le module Quiz. « niveau » est construit à la volée selon le niveau du joueur.
export const SERIES = [
  { id: 'niveau', titre: 'Quiz de mon niveau', description: '10 questions de tous types, choisies selon ton niveau et tes erreurs passées.' },
  { id: 'regles-debutant', titre: 'Règles Débutant', description: 'Passe, en-avant, hors-jeu, touche, essai, cartons…', filtre: (q) => q.theme === 'regles-debutant' },
  { id: 'regles-expert', titre: 'Règles Expert', description: 'Avantage, ruck, maul, mêlée, hors-jeu avancé, discipline…', filtre: (q) => q.theme === 'regles-expert' },
  { id: 'postes', titre: 'Les 15 postes', description: 'Numéros, missions et situations de match de chaque poste.', filtre: (q) => q.theme === 'postes' },
  { id: 'terrain', titre: 'Positionnement sur le terrain', description: 'Clique sur le bon joueur ou le bon endroit du terrain.', filtre: (q) => q.type === 'terrain' },
  { id: 'glisser', titre: 'Glisser-déposer', description: 'Remets dans l’ordre et associe les bonnes réponses.', filtre: (q) => q.type === 'glisser' },
  { id: 'tactique', titre: 'Choix tactiques', description: 'Regarde l’action et choisis la meilleure décision.', filtre: (q) => q.type === 'tactique' },
  { id: 'securite', titre: 'Sécurité et vocabulaire', description: 'Bien tomber, réagir à un choc, parler rugby.', filtre: (q) => q.theme === 'securite' || q.theme === 'vocabulaire' },
]

export const getSerie = (id) => SERIES.find((s) => s.id === id)

// Répartition des niveaux de questions selon le niveau du joueur.
const MELANGE = {
  debutant: { debutant: 1 },
  intermediaire: { debutant: 0.4, intermediaire: 0.6 },
  avance: { debutant: 0.2, intermediaire: 0.3, avance: 0.5 },
}

export function melanger(liste, rand = Math.random) {
  const a = [...liste]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

// Ordre de priorité : questions ratées la dernière fois, puis jamais vues, puis déjà réussies.
function prioriser(liste, reponses) {
  const rang = (q) => {
    const r = reponses[q.id]
    if (!r) return 1
    return r.ok ? 2 : 0
  }
  return melanger(liste).sort((a, b) => rang(a) - rang(b))
}

// Quiz adapté : `nombre` questions selon le niveau et l'historique des réponses.
export function quizAdapte(niveau, reponses = {}, nombre = 10) {
  const parts = MELANGE[niveau] ?? MELANGE.debutant
  const choisies = []
  for (const [niv, part] of Object.entries(parts)) {
    const pool = prioriser(QUESTIONS.filter((q) => q.niveau === niv), reponses)
    choisies.push(...pool.slice(0, Math.round(part * nombre)))
  }
  // Complète si un niveau manque de questions.
  if (choisies.length < nombre) {
    const reste = prioriser(QUESTIONS.filter((q) => !choisies.includes(q)), reponses)
    choisies.push(...reste.slice(0, nombre - choisies.length))
  }
  return melanger(choisies.slice(0, nombre))
}

export function quizSerie(serie, niveau, reponses, nombre = 10) {
  if (serie.id === 'niveau') return quizAdapte(niveau, reponses, nombre)
  return melanger(prioriser(QUESTIONS.filter(serie.filtre), reponses).slice(0, nombre))
}
