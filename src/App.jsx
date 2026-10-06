import { MotionConfig } from 'framer-motion'
import { AppProvider, NIVEAUX, useApp } from './lib/AppContext.jsx'
import { useRoute, href } from './lib/router.js'
import TerrainView from './views/TerrainView.jsx'
import PostesView from './views/PostesView.jsx'
import PosteDetail from './views/PosteDetail.jsx'
import CombinaisonsView from './views/CombinaisonsView.jsx'
import ReglesView from './views/ReglesView.jsx'
import QuizView from './views/QuizView.jsx'
import CoachView from './views/CoachView.jsx'
import JoueurView from './views/JoueurView.jsx'
import AssistantView from './views/AssistantView.jsx'
import BadgeToast, { BadgeLink } from './components/BadgeToast.jsx'

const NAV = [
  { name: 'terrain', label: 'Terrain', icon: 'M3 5h18v14H3z M12 5v14 M3 9h3v6H3 M21 9h-3v6h3' },
  { name: 'postes', label: 'Postes', icon: 'M8 4l4 2 4-2 4 3-2 3-2-1v11H8V9l-2 1-2-3z' },
  { name: 'combinaisons', label: 'Combinaisons', icon: 'M5 18c3-8 7-1 14-12 M15 6h4v4' },
  { name: 'regles', label: 'Règles', icon: 'M6 3h9l3 3v15H6z M9 10h6 M9 14h6 M9 18h4' },
  { name: 'arbitre', label: 'Arbitre', to: href('regles', 'signes'), icon: 'M7 14a5 5 0 1 0 5-5H8a2 2 0 0 0-2 2v3z M12 9V6h6 M18 4v4' },
  { name: 'quiz', label: 'Quiz', icon: 'M9 9a3 3 0 1 1 4 2.8c-.7.3-1 .9-1 1.6V15 M12 19h.01' },
  { name: 'coach', label: 'Coach', icon: 'M9 3h6v3H9z M8 4.5H5V21h14V4.5h-3 M8.5 11h7 M8.5 15h7 M8.5 18.5h4' },
  { name: 'joueur', label: 'Joueur', icon: 'M12 11.5a4 4 0 1 0 0-8 4 4 0 0 0 0 8z M4.5 21c.8-4 3.7-6.3 7.5-6.3s6.7 2.3 7.5 6.3' },
  { name: 'assistant', label: 'Assistant', icon: 'M4 5h16v11H9l-5 4z' },
]

function Icon({ d }) {
  return (
    <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d={d} />
    </svg>
  )
}

function LevelPicker() {
  const { niveau, setNiveau } = useApp()
  return (
    <label className="level">
      <span className="sr-only">Mon niveau</span>
      <select id="niveau" value={niveau} onChange={(e) => setNiveau(e.target.value)}>
        {NIVEAUX.map((n) => <option key={n.id} value={n.id}>{n.label}</option>)}
      </select>
    </label>
  )
}

function Shell() {
  const route = useRoute()
  const active = route.name === 'poste' ? 'postes'
    : route.name === 'regles' && route.param === 'signes' ? 'arbitre'
    : route.name

  let view
  if (route.name === 'postes') view = <PostesView />
  else if (route.name === 'poste') view = <PosteDetail numero={route.param} />
  else if (route.name === 'combinaisons') view = <CombinaisonsView param={route.param} />
  else if (route.name === 'regles') view = <ReglesView param={route.param} />
  else if (route.name === 'quiz') view = <QuizView param={route.param} />
  else if (route.name === 'coach') view = <CoachView param={route.param} />
  else if (route.name === 'joueur') view = <JoueurView param={route.param} />
  else if (route.name === 'assistant') view = <AssistantView />
  else view = <TerrainView />

  return (
    <div className="app">
      <header className="topbar">
        <a className="brand" href={href('terrain')}>
          <svg viewBox="0 0 32 32" width="30" height="30" aria-hidden="true">
            <ellipse cx="16" cy="16" rx="13" ry="8.5" transform="rotate(-35 16 16)" className="brand-ball" />
            <path d="M11 21 21 11 M13 15l4 4 M15 13l4 4" className="brand-seam" />
          </svg>
          <span>
            <strong>Rugbyapp</strong>
            <small>École de rugby U18</small>
          </span>
        </a>
        <nav className="nav" aria-label="Modules">
          {NAV.map((n) => (
            <a key={n.name} href={n.to ?? href(n.name)} title={n.label} aria-label={n.label} className={active === n.name ? 'is-active' : ''} aria-current={active === n.name ? 'page' : undefined}>
              <Icon d={n.icon} />
              <span>{n.label}</span>
            </a>
          ))}
        </nav>
        <BadgeLink />
        <LevelPicker />
      </header>
      <main className="main">{view}</main>
      <BadgeToast />
    </div>
  )
}

export default function App() {
  return (
    <AppProvider>
      <MotionConfig reducedMotion="user">
        <Shell />
      </MotionConfig>
    </AppProvider>
  )
}
