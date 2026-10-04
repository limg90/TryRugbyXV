// Progression du joueur, enregistrée sur l'appareil (stockage local).
//
// État : {
//   reponses  : { [idQuestion]: { ok (dernière réponse juste), bonnes, essais } },
//   regles    : { [idRegle]: { meilleur } }            meilleur = part de bonnes réponses (0 à 1)
//   matchs    : { [idMatch]: { meilleur, joues } }     meilleur = part des points (0 à 1)
//   badgesVus : [idBadge]                              badges déjà annoncés
// }

import { REGLES, SEUIL_REUSSITE } from '../data/regles.js'

export const CLE_PROGRESSION = 'rugbyapp.progression'
export const PROGRESSION_VIDE = { reponses: {}, regles: {}, matchs: {}, badgesVus: [] }

export function normaliser(p) {
  return { ...PROGRESSION_VIDE, ...(p && typeof p === 'object' ? p : {}) }
}

export function avecReponse(p, id, ok) {
  const r = p.reponses[id] ?? { bonnes: 0, essais: 0 }
  return { ...p, reponses: { ...p.reponses, [id]: { ok, bonnes: r.bonnes + (ok ? 1 : 0), essais: r.essais + 1 } } }
}

export function avecRegle(p, id, part) {
  const meilleur = Math.max(part, p.regles[id]?.meilleur ?? 0)
  return { ...p, regles: { ...p.regles, [id]: { meilleur } } }
}

export function avecMatch(p, id, part) {
  const m = p.matchs[id] ?? { meilleur: 0, joues: 0 }
  return { ...p, matchs: { ...p.matchs, [id]: { meilleur: Math.max(part, m.meilleur), joues: m.joues + 1 } } }
}

export const regleReussie = (p, id) => (p.regles[id]?.meilleur ?? 0) >= SEUIL_REUSSITE - 1e-9

export function statistiques(p) {
  const rep = Object.values(p.reponses)
  const reglesReussies = (module) => REGLES.filter((r) => r.module === module && regleReussie(p, r.id)).length
  const matchs = Object.values(p.matchs)
  return {
    bonnesDistinctes: rep.filter((r) => r.bonnes > 0).length,
    reponses: rep.reduce((s, r) => s + r.essais, 0),
    justes: rep.reduce((s, r) => s + r.bonnes, 0),
    reglesDebutant: reglesReussies('debutant'),
    reglesExpert: reglesReussies('expert'),
    totalDebutant: REGLES.filter((r) => r.module === 'debutant').length,
    totalExpert: REGLES.filter((r) => r.module === 'expert').length,
    matchsJoues: matchs.filter((m) => m.joues > 0).length,
    matchs70: matchs.filter((m) => m.meilleur >= 0.7).length,
    matchs80: matchs.filter((m) => m.meilleur >= 0.8).length,
  }
}

// Badges dans l'ordre : chacun demande le précédent.
export const BADGES = [
  {
    id: 'debutant', emoji: '🥉', titre: 'Débutant', niveauSuivant: 'intermediaire',
    conditions: (s) => [
      { label: 'Réussir le quiz de chaque règle du module Débutant', valeur: s.reglesDebutant, cible: s.totalDebutant },
    ],
  },
  {
    id: 'intermediaire', emoji: '🥈', titre: 'Intermédiaire', niveauSuivant: 'avance',
    conditions: (s) => [
      { label: 'Répondre juste à 40 questions différentes', valeur: s.bonnesDistinctes, cible: 40 },
      { label: 'Jouer un match interactif', valeur: s.matchsJoues, cible: 1 },
    ],
  },
  {
    id: 'avance', emoji: '🥇', titre: 'Avancé',
    conditions: (s) => [
      { label: 'Réussir le quiz de 6 règles du module Expert', valeur: s.reglesExpert, cible: 6 },
      { label: 'Obtenir au moins 70 % des points dans un match', valeur: s.matchs70, cible: 1 },
    ],
  },
  {
    id: 'expert', emoji: '🏆', titre: 'Expert Rugby',
    conditions: (s) => [
      { label: 'Réussir le quiz de toutes les règles Expert', valeur: s.reglesExpert, cible: s.totalExpert },
      { label: 'Obtenir 80 % des points dans 3 matchs différents', valeur: s.matchs80, cible: 3 },
      { label: 'Répondre juste à 80 questions différentes', valeur: s.bonnesDistinctes, cible: 80 },
    ],
  },
]

// État de chaque badge : conditions avec avancement, obtenu ou non.
export function etatBadges(p) {
  const s = statistiques(p)
  let precedent = true
  return BADGES.map((b) => {
    const conditions = b.conditions(s).map((c) => ({ ...c, faite: c.valeur >= c.cible }))
    const obtenu = precedent && conditions.every((c) => c.faite)
    precedent = obtenu
    return { ...b, conditions, obtenu }
  })
}
