import { createContext, useContext, useState } from 'react'
import { load, save } from './storage.js'

// État global partagé par les modules : niveau du joueur.
// Les fils « progression » et « quiz » y ajouteront badges et scores.
export const NIVEAUX = [
  { id: 'debutant', label: 'Débutant' },
  { id: 'intermediaire', label: 'Intermédiaire' },
  { id: 'avance', label: 'Avancé' },
]

const AppContext = createContext(null)

export function AppProvider({ children }) {
  const [niveau, setNiveauState] = useState(() => load('rugbyapp.niveau', 'debutant'))
  const setNiveau = (n) => {
    setNiveauState(n)
    save('rugbyapp.niveau', n)
  }
  return <AppContext.Provider value={{ niveau, setNiveau }}>{children}</AppContext.Provider>
}

export const useApp = () => useContext(AppContext)
