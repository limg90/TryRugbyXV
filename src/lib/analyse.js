// Analyse d'une évaluation : écarts avec le profil du poste, points forts, axes d'amélioration,
// recommandations et plan de progression. Tout est calculé à partir des données de l'application.

import { CRITERES, FAMILLES, EXERCICES, CONSEILS, PROFILS, getCritere } from '../data/evaluation.js'
import { getPosition } from '../data/positions.js'
import { href } from './router.js'

export const notesVides = () => Object.fromEntries(CRITERES.map((c) => [c.id, 0]))
export const estRemplie = (notes) => !!notes && CRITERES.some((c) => notes[c.id] > 0)

export function moyenne(notes, ids = CRITERES.map((c) => c.id)) {
  const v = ids.map((id) => notes?.[id] ?? 0).filter((n) => n > 0)
  return v.length ? v.reduce((s, n) => s + n, 0) / v.length : null
}

export const moyenneFamille = (notes, famille) => moyenne(notes, CRITERES.filter((c) => c.famille === famille).map((c) => c.id))
export const moyennesFamilles = (notes) => FAMILLES.map((f) => ({ ...f, valeur: moyenneFamille(notes, f.id) }))

export const fmt = (n, d = 1) => (n == null ? '—' : n.toLocaleString('fr-FR', { minimumFractionDigits: d, maximumFractionDigits: d }))
export const signe = (n, d = 1) => (n == null ? '—' : `${n > 0 ? '+' : n < 0 ? '−' : '±'}${fmt(Math.abs(n), d)}`)

// Évaluations triées par date (la plus ancienne d'abord).
export const chronologique = (evals) => [...(evals ?? [])].sort((a, b) => (a.date < b.date ? -1 : a.date > b.date ? 1 : a.cree - b.cree))
export const derniere = (evals) => chronologique(evals).at(-1) ?? null

// Comparaison d'une évaluation avec les cibles du poste.
export function analyser(notes, cibles) {
  const lignes = CRITERES.map((c) => {
    const note = notes?.[c.id] ?? 0
    const cible = cibles[c.id]
    return { ...c, note, cible, ecart: note > 0 ? note - cible : null }
  })
  const notees = lignes.filter((l) => l.ecart != null)
  const atteints = notees.filter((l) => l.ecart >= 0).length
  // Priorité d'un axe : l'écart, pondéré par l'importance du critère pour le poste.
  const priorite = (l) => -l.ecart * (0.6 + l.cible / 10)
  const axes = notees.filter((l) => l.ecart < 0).sort((a, b) => priorite(b) - priorite(a))
  const forces = notees
    .filter((l) => l.ecart >= 0 || l.note >= 8)
    .sort((a, b) => b.ecart - a.ecart || b.note - a.note)
  return {
    lignes,
    axes,
    forces,
    conformite: notees.length ? atteints / notees.length : null,
    atteints,
    notes: notees.length,
    ecartMoyen: notees.length ? notees.reduce((s, l) => s + l.ecart, 0) / notees.length : null,
  }
}

// Exercices d'un critère ; pour la technique, on ajoute ceux de la fiche du poste.
export function exercicesPour(critere, poste) {
  const base = EXERCICES[critere] ?? []
  if (critere !== 'technique' || !poste) return base
  const p = getPosition(poste)
  if (!p) return base
  const duPoste = p.exercices.slice(0, 2).map((e) => ({
    titre: e.nom, duree: '10 min', description: e.description, lien: { label: `Fiche du ${p.numero}`, to: href('poste', p.numero) },
  }))
  return [...duPoste, ...base]
}

// Recommandations : les 3 axes prioritaires (ou les critères liés aux objectifs), avec conseil et exercices.
export function recommandations({ notes, cibles, poste, objectifs = [], max = 3 }) {
  const a = analyser(notes, cibles)
  const viseParObjectif = new Set(objectifs.filter((o) => !o.fait && o.critere).map((o) => o.critere))
  const exigees = new Set((PROFILS[poste]?.exigences ?? []).map((e) => e.critere))
  const score = (l) => -l.ecart * (0.6 + l.cible / 10) + (viseParObjectif.has(l.id) ? 2 : 0) + (exigees.has(l.id) ? 0.5 : 0)
  const candidats = a.lignes.filter((l) => l.ecart != null && (l.ecart < 0 || viseParObjectif.has(l.id)))
  const choisis = candidats.sort((x, y) => score(y) - score(x)).slice(0, max)
  return choisis.map((l) => {
    const pourquoi = []
    if (l.ecart < 0) pourquoi.push(`${l.note}/10 pour une attente de ${l.cible}/10 au poste`)
    if (exigees.has(l.id)) pourquoi.push('critère clé du poste')
    if (viseParObjectif.has(l.id)) pourquoi.push('lié à un objectif')
    return {
      critere: l.id,
      label: l.label,
      icon: l.icon,
      note: l.note,
      cible: l.cible,
      ecart: l.ecart,
      urgence: l.ecart <= -3 ? 'haute' : l.ecart <= -1 ? 'moyenne' : 'entretien',
      pourquoi: pourquoi.join(' · '),
      conseil: CONSEILS[l.id],
      exercices: exercicesPour(l.id, poste),
    }
  })
}

// Plan de progression sur 4 semaines construit à partir des recommandations.
export function planDeProgression(recos) {
  if (!recos.length) return []
  const semaines = [
    { titre: 'Semaine 1', but: 'Découvrir les exercices', axes: recos.slice(0, 2) },
    { titre: 'Semaine 2', but: 'Répéter avec régularité', axes: recos.slice(0, 2) },
    { titre: 'Semaine 3', but: 'Ajouter de la pression', axes: recos.length > 2 ? [recos[0], recos[2]] : recos },
    { titre: 'Semaine 4', but: 'Se tester puis s’auto-évaluer', axes: recos },
  ]
  return semaines.map((s, i) => ({
    ...s,
    seances: s.axes.map((r) => {
      const ex = r.exercices[i % r.exercices.length]
      return { critere: r.critere, icon: r.icon, label: r.label, ...ex, cle: `${i}-${r.critere}-${ex.titre}` }
    }),
  }))
}

// Progression entre la première et la dernière évaluation.
export function progression(evals) {
  const c = chronologique(evals).filter((e) => estRemplie(e.notes))
  if (c.length < 2) return null
  const a = moyenne(c[0].notes)
  const b = moyenne(c.at(-1).notes)
  return { depuis: c[0], vers: c.at(-1), delta: b - a }
}

// Notes par période de saison (dernière évaluation de chaque période).
export function parPeriode(evals) {
  const r = {}
  for (const e of chronologique(evals)) if (e.periode !== 'libre') r[e.periode] = e
  return r
}

export const critereLabel = (id) => getCritere(id)?.label ?? id
