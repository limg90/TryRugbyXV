import { useState } from 'react'
import { load, save } from './storage.js'

// Données de l'Espace Coach et de l'Espace Joueur, enregistrées sur l'appareil.
//
// rugbyapp.coach  : { joueurs: [{ id, prenom, nom, naissance, poste, niveau, matchs, objectifs, cibles (ajustements | null),
//                                  evaluations: [{ id, date, periode, notes: { [critère]: 1-10 }, commentaire, cree }] }] }
// rugbyapp.joueur : { profil: { prenom, poste, niveau } | null, evaluations: [...même format],
//                     objectifs: [{ id, horizon, texte, critere, cible, echeance, fait, cree }], faits: { [cléSéance]: true } }

export const CLE_COACH = 'rugbyapp.coach'
export const CLE_JOUEUR = 'rugbyapp.joueur'
export const COACH_VIDE = { joueurs: [] }
export const JOUEUR_VIDE = { profil: null, evaluations: [], objectifs: [], faits: {} }

export const nouvelId = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 6)
export const aujourdhui = () => new Date().toISOString().slice(0, 10)
export const dateFr = (iso, opts = { day: 'numeric', month: 'short', year: 'numeric' }) =>
  iso ? new Date(`${iso}T12:00:00`).toLocaleDateString('fr-FR', opts) : '—'

function useStocke(cle, vide) {
  const [etat, setEtat] = useState(() => ({ ...vide, ...(load(cle, vide) ?? {}) }))
  const maj = (f) => setEtat((e) => {
    const n = typeof f === 'function' ? f(e) : f
    save(cle, n)
    return n
  })
  return [etat, maj]
}

// Remplace ou ajoute une évaluation (même id).
export const avecEvaluation = (evals, ev) => (evals.some((e) => e.id === ev.id) ? evals.map((e) => (e.id === ev.id ? ev : e)) : [...evals, ev])

export function useCoach() {
  const [etat, maj] = useStocke(CLE_COACH, COACH_VIDE)
  const majJoueur = (id, f) => maj((e) => ({ ...e, joueurs: e.joueurs.map((j) => (j.id === id ? f(j) : j)) }))
  return {
    joueurs: etat.joueurs,
    ajouterJoueur: (j) => {
      const id = nouvelId()
      maj((e) => ({ ...e, joueurs: [...e.joueurs, { cibles: null, evaluations: [], objectifs: '', matchs: '', naissance: '', ...j, id }] }))
      return id
    },
    modifierJoueur: (id, champs) => majJoueur(id, (j) => ({ ...j, ...champs })),
    importer: (liste) => maj((e) => ({ ...e, joueurs: [...e.joueurs, ...liste.filter((j) => !e.joueurs.some((k) => k.id === j.id))] })),
    supprimerJoueur: (id) => maj((e) => ({ ...e, joueurs: e.joueurs.filter((j) => j.id !== id) })),
    enregistrerEvaluation: (id, ev) => majJoueur(id, (j) => ({ ...j, evaluations: avecEvaluation(j.evaluations, ev) })),
    supprimerEvaluation: (id, evId) => majJoueur(id, (j) => ({ ...j, evaluations: j.evaluations.filter((e) => e.id !== evId) })),
  }
}

export function useJoueur() {
  const [etat, maj] = useStocke(CLE_JOUEUR, JOUEUR_VIDE)
  return {
    ...etat,
    definirProfil: (profil) => maj((e) => ({ ...e, profil })),
    enregistrerEvaluation: (ev) => maj((e) => ({ ...e, evaluations: avecEvaluation(e.evaluations, ev) })),
    supprimerEvaluation: (id) => maj((e) => ({ ...e, evaluations: e.evaluations.filter((x) => x.id !== id) })),
    ajouterObjectif: (o) => maj((e) => ({ ...e, objectifs: [...e.objectifs, { fait: false, cree: Date.now(), ...o, id: nouvelId() }] })),
    modifierObjectif: (id, champs) => maj((e) => ({ ...e, objectifs: e.objectifs.map((o) => (o.id === id ? { ...o, ...champs } : o)) })),
    supprimerObjectif: (id) => maj((e) => ({ ...e, objectifs: e.objectifs.filter((o) => o.id !== id) })),
    basculerFait: (cle) => maj((e) => ({ ...e, faits: { ...e.faits, [cle]: !e.faits[cle] } })),
    reinitialiser: () => maj(JOUEUR_VIDE),
  }
}
