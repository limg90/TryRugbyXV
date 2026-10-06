// Assistant Rugby (#assistant) : répond à une question en français à partir du contenu de l'application,
// sans service extérieur (fonctionne hors ligne).
//
// Toutes les fiches (postes, règles, combinaisons, signes de l'arbitre) sont rassemblées dans un index.
// Une question est découpée en mots normalisés (minuscules, sans accents, sans mots vides),
// chaque fiche reçoit un score, et la meilleure devient la réponse : explication, schéma animé et quiz.

import { POSITIONS } from '../data/positions.js'
import { REGLES, questionsDeRegle } from '../data/regles.js'
import { COMBINAISONS } from '../data/combinaisons.js'
import { SIGNES } from '../data/signes.js'
import { BASE_FORMATION } from '../data/scenarios.js'
import { QUESTIONS, questionsDePoste } from '../data/quiz.js'
import { href } from './router.js'

const MOTS_VIDES = new Set(`
  a au aux avec ce ces c ca cela cet cette d de des du dans en et est elle il ils je j l la le les leur lui ma me mes moi mon
  ne n ni nous on ou par pas pour qu que qui quoi sa se ses si son sur ta te tes toi ton tu un une vos votre vous y
  quel quelle quels quelles comment pourquoi quand combien dois doit faut peut peux veut veux fait faire font sont etre
  explique expliquer explique-moi moi dis dire donne montre apprends c-est qu-est est-ce svp stp merci bonjour salut
  rugby joueur joueurs equipe veut-dire signifie
`.split(/\s+/).filter(Boolean))

// Mots équivalents : on remplace le mot de la question par celui employé dans les fiches.
const SYNONYMES = {
  offside: 'hors', flanker: 'flanqueur', flanqueurs: 'flanqueur', talon: 'talonneur', ouverture: 'ouvreur',
  demi: 'demi', huit: '8', neuf: '9', dix: '10', quinze: '15', ailes: 'ailier', aile: 'ailier',
  buteur: 'transformation', tirer: 'pied', taper: 'pied', plaquer: 'plaquage', plaque: 'plaquage',
  rouges: 'rouge', jaunes: 'jaune', sifflet: 'arbitre', gestes: 'geste', bras: 'geste', signal: 'signe',
  lift: 'touche', alignement: 'touche', lancer: 'touche', regroupement: 'ruck', pousser: 'melee',
  marquer: 'essai', points: 'point', interdit: 'faute', sanctionne: 'sanction',
}

// Noms usuels des postes, en plus de ceux des fiches.
const ALIAS_POSTES = {
  1: 'pilier gauche tete libre premiere ligne', 2: 'talonneur talon premiere ligne lanceur',
  3: 'pilier droit tete prise premiere ligne', 4: 'deuxieme seconde ligne sauteur', 5: 'deuxieme seconde ligne sauteur',
  6: 'troisieme ligne aile flanqueur', 7: 'troisieme ligne aile flanqueur gratteur',
  8: 'troisieme ligne centre numero huit', 9: 'demi de melee charniere', 10: 'demi ouverture ouvreur charniere buteur',
  11: 'ailier gauche ailier finisseur', 12: 'premier centre', 13: 'deuxieme centre', 14: 'ailier droit ailier finisseur',
  15: 'arriere dernier rempart',
}

// Mots qui indiquent le type de fiche recherché.
const INDICES = {
  poste: ['role', 'poste', 'numero', 'joue', 'mission', 'place'],
  regle: ['regle', 'faute', 'sanction', 'autorise', 'arbitre'],
  combinaison: ['combinaison', 'lancement', 'attaque', 'attaquer', 'tactique', 'jouer', 'exercice', 'phase'],
  signe: ['signe', 'geste', 'arbitre', 'reconnaitre'],
}

export const TYPES = {
  poste: 'Poste',
  regle: 'Règle',
  combinaison: 'Combinaison',
  signe: 'Signe de l’arbitre',
}

const sansAccents = (s) => s.normalize('NFD').replace(/[̀-ͯ]/g, '')

// Minuscules, sans accents ni ponctuation ; « n°8 » devient « numero 8 ».
export function normaliser(texte) {
  return sansAccents(String(texte).toLowerCase())
    .replace(/n°\s*/g, 'numero ')
    .replace(/[’'`]/g, ' ')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim()
}

const racine = (mot) => (mot.length > 3 && /[sx]$/.test(mot) ? mot.slice(0, -1) : mot)

export function mots(texte) {
  return normaliser(texte).split(' ')
    .filter((m) => m && !MOTS_VIDES.has(m))
    .map((m) => racine(SYNONYMES[m] ?? m))
}

// Deux mots correspondent s'ils sont égaux, ne diffèrent que par une terminaison courte (touche / toucher)
// ou partagent un début assez long (plaquage / plaquer). « avant » ne correspond pas à « avantage ».
function correspond(a, b) {
  if (a === b) return true
  const [court, long] = a.length <= b.length ? [a, b] : [b, a]
  if (long.startsWith(court)) return court.length >= 4 && long.length - court.length <= 2
  return court.length >= 5 && court.slice(0, 5) === long.slice(0, 5)
}

const ensemble = (...textes) => new Set(textes.flat().filter(Boolean).flatMap(mots))

// ---------------------------------------------------------------- Index des fiches

const placement = (p) => ({
  zoom: { x: [14, 64], y: [0, 70] },
  steps: [{ duration: 0, caption: `Le ${p.numero} (${p.nom.toLowerCase()}) sur une mêlée au milieu du terrain.`, players: BASE_FORMATION, ball: { carrier: 9 }, highlight: [p.numero] }],
})

const FICHES = [
  ...REGLES.map((r) => ({
    type: 'regle', id: r.id, titre: r.titre, lien: href('regles', r.id),
    resume: r.explication.simple, points: r.explication.points,
    extra: { label: 'Sanction', texte: r.explication.sanction },
    scenario: { steps: r.steps, zoom: r.zoom },
    questions: questionsDeRegle(r),
    index: { titre: ensemble(r.titre), alias: new Set(), texte: ensemble(r.resume, r.explication.simple, r.explication.points, r.explication.sanction) },
  })),
  ...POSITIONS.map((p) => ({
    type: 'poste', id: `poste-${p.numero}`, numero: p.numero, titre: `${p.numero} · ${p.nom}`, lien: href('poste', p.numero),
    resume: p.resume, points: p.missions,
    extra: { label: 'Conseil', texte: p.conseil },
    scenario: placement(p),
    questions: questionsDePoste(p.numero),
    index: { titre: ensemble(p.nom, p.court), alias: ensemble(ALIAS_POSTES[p.numero], p.ligne), texte: ensemble(p.resume, p.missions, p.capacites) },
  })),
  ...COMBINAISONS.map((c) => ({
    type: 'combinaison', id: c.id, titre: c.titre, lien: href('combinaisons', c.id),
    resume: c.explication.objectif, points: c.explication.points,
    extra: { label: 'Quand l’utiliser', texte: c.explication.quand },
    scenario: { steps: c.steps, zoom: c.zoom },
    questions: null,
    index: { titre: ensemble(c.titre), alias: new Set(), texte: ensemble(c.resume, c.explication.objectif, c.explication.quand, c.explication.points) },
  })),
  ...SIGNES.map((s) => ({
    type: 'signe', id: `signe-${s.id}`, titre: s.titre, lien: href('regles', 'signes'),
    resume: s.quand, points: [s.geste],
    extra: { label: 'Et après ?', texte: s.ensuite },
    signe: s, scenario: null, questions: null,
    index: { titre: ensemble(s.titre), alias: new Set(['signe', 'geste', 'arbitre']), texte: ensemble(s.geste, s.quand, s.ensuite) },
  })),
]

// Ordre de préférence quand deux fiches ont le même score (« la mêlée » : la règle d'abord).
const PRIORITE = { regle: 0.3, poste: 0.2, combinaison: 0.1, signe: 0 }

// Numéro de poste cité dans la question (« numéro 8 », « le 10 »), hors durées et distances.
function numerosCites(texte) {
  const n = normaliser(texte)
  const trouves = []
  for (const m of n.matchAll(/(?:^|\s)(\d{1,2})(?=\s|$)(?!\s+(?:m|metres?|min|minutes?|points?|secondes?|s)\b)/g)) {
    const v = Number(m[1])
    if (v >= 1 && v <= 15) trouves.push(v)
  }
  return { numeros: trouves, explicite: /\b(numero|poste|maillot|le|du)\s+\d/.test(n) }
}

function scoreFiche(fiche, motsQ, phrase, numeros) {
  const { titre, alias, texte } = fiche.index
  let score = 0
  for (const m of motsQ) {
    const dans = (set) => [...set].some((x) => correspond(m, x))
    if (dans(titre)) score += 6
    else if (dans(alias)) score += 4
    else if (dans(texte)) score += 1
  }
  // Part du titre couverte par la question : « centre » désigne plutôt le premier centre que le troisième ligne centre.
  const couverts = [...titre].filter((x) => motsQ.some((m) => correspond(m, x))).length
  if (titre.size) score += (3 * couverts) / titre.size
  // Le titre entier dans la question (« hors jeu », « carton jaune ») : réponse quasi certaine.
  const t = mots(fiche.titre.replace(/^\d+ · /, '')).join(' ')
  if (t && phrase.includes(t)) score += 8
  if (fiche.type === 'poste' && numeros.numeros.includes(fiche.numero)) score += numeros.explicite ? 14 : 8
  for (const indice of INDICES[fiche.type]) if (motsQ.includes(indice)) score += 2
  return score + PRIORITE[fiche.type]
}

// Seuil en dessous duquel l'assistant préfère dire qu'il n'a pas trouvé.
const SEUIL = 5

export function rechercher(question) {
  const motsQ = mots(question)
  if (!motsQ.length) return []
  const phrase = motsQ.join(' ')
  const numeros = numerosCites(question)
  return FICHES
    .map((fiche) => ({ fiche, score: scoreFiche(fiche, motsQ, phrase, numeros) }))
    .filter((r) => r.score >= SEUIL)
    .sort((a, b) => b.score - a.score)
}

// Questions de la banque proches de la recherche (pour les fiches sans quiz propre).
function questionsProches(motsQ, exclure = [], nombre = 3) {
  return QUESTIONS
    .filter((q) => !exclure.includes(q.id))
    .map((q) => {
      const texte = ensemble(q.question, q.explication, q.source, q.choix)
      return { q, score: motsQ.filter((m) => [...texte].some((x) => correspond(m, x))).length }
    })
    .filter((r) => r.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, nombre)
    .map((r) => r.q)
}

// Réponse complète à une question : { fiche, voirAussi, questions } ou null si rien ne correspond.
export function repondre(question) {
  const resultats = rechercher(question)
  if (!resultats.length) return null
  const [meilleur, ...autres] = resultats
  const fiche = meilleur.fiche
  const motsQ = [...new Set([...mots(question), ...mots(fiche.titre)])]
  const questions = fiche.questions?.length ? fiche.questions.slice(0, 3) : questionsProches(motsQ)
  const voirAussi = autres.filter((r) => r.score >= meilleur.score / 3).slice(0, 4).map((r) => r.fiche)
  return { fiche, voirAussi, questions }
}

export const EXEMPLES = [
  'Explique-moi le rôle du numéro 8',
  'C’est quoi le hors-jeu ?',
  'Comment marche une croisée ?',
  'Quand prend-on un carton jaune ?',
  'Le geste de l’arbitre pour un avantage',
  'Que fait l’ouvreur ?',
]
