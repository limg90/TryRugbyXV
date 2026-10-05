import { useEffect, useState } from 'react'

// Routeur par ancre, compatible hors ligne et hébergement statique.
// Routes : #terrain, #postes, #poste-9, #combinaisons, #regles, #quiz, #coach(-id), #joueur(-onglet), #assistant
function parse(hash) {
  const h = (hash || '').replace(/^#\/?/, '')
  const [name, ...rest] = h.split('-')
  return { name: name || 'terrain', param: rest.join('-') || null }
}

export function useRoute() {
  const [route, setRoute] = useState(() => parse(window.location.hash))
  useEffect(() => {
    const onChange = () => {
      setRoute(parse(window.location.hash))
      window.scrollTo(0, 0)
    }
    window.addEventListener('hashchange', onChange)
    return () => window.removeEventListener('hashchange', onChange)
  }, [])
  return route
}

export const href = (name, param) => `#${name}${param != null ? `-${param}` : ''}`
