import { createContext, useContext, useState } from 'react'
import { load, save } from './storage.js'
import { CLE_PROGRESSION, PROGRESSION_VIDE, normaliser, avecReponse, avecRegle, avecMatch } from './progression.js'

// État global partagé par les modules : niveau du joueur et progression (réponses, règles, matchs, badges).
// Tout est enregistré sur l'appareil.
export const NIVEAUX = [
  { id: 'debutant', label: 'Débutant' },
  { id: 'intermediaire', label: 'Intermédiaire' },
  { id: 'avance', label: 'Avancé' },
]

const AppContext = createContext(null)

export function AppProvider({ children }) {
  const [niveau, setNiveauState] = useState(() => load('rugbyapp.niveau', 'debutant'))
  const [progression, setProgression] = useState(() => normaliser(load(CLE_PROGRESSION, PROGRESSION_VIDE)))

  const setNiveau = (n) => {
    setNiveauState(n)
    save('rugbyapp.niveau', n)
  }
  const maj = (f) => setProgression((p) => {
    const n = f(p)
    save(CLE_PROGRESSION, n)
    return n
  })

  const value = {
    niveau,
    setNiveau,
    progression,
    noterReponse: (id, ok) => maj((p) => avecReponse(p, id, ok)),
    noterRegle: (id, part) => maj((p) => avecRegle(p, id, part)),
    noterMatch: (id, part) => maj((p) => avecMatch(p, id, part)),
    marquerBadgeVu: (id) => maj((p) => (p.badgesVus.includes(id) ? p : { ...p, badgesVus: [...p.badgesVus, id] })),
    reinitialiser: () => maj(() => PROGRESSION_VIDE),
  }
  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export const useApp = () => useContext(AppContext)
