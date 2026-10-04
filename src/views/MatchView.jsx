import { useState } from 'react'
import { EQUIPES, MATCHS, NOTE_MAX, getMatch, noteInfo } from '../data/matchs.js'
import { useApp } from '../lib/AppContext.jsx'
import { load, save } from '../lib/storage.js'
import { href } from '../lib/router.js'
import Decision from '../components/quiz/Decision.jsx'
import { niveauLabel } from './Bibliotheque.jsx'

// Mode match interactif : choisir son équipe et un schéma tactique, puis prendre les décisions.

const CLE_EQUIPE = 'rugbyapp.equipe'

// Couleurs de l'équipe choisie appliquées aux maillots (variables CSS).
const styleEquipe = (e) => ({ '--forward': e.avants, '--back': e.arrieres })

function Choix({ equipe, setEquipe }) {
  const { progression } = useApp()
  return (
    <div className="biblio">
      <header className="view-head">
        <div>
          <p className="eyebrow">Mode match</p>
          <h1>À toi de jouer</h1>
          <p className="lede">Choisis ton équipe et un schéma tactique. L’action se joue, puis c’est toi qui décides : chaque choix est animé et évalué.</p>
        </div>
      </header>
      <section className="ligne">
        <h2 className="ligne-title">1. Ton équipe</h2>
        <div className="seg equipes" role="radiogroup" aria-label="Équipe">
          {EQUIPES.map((e) => (
            <button key={e.id} type="button" role="radio" aria-checked={equipe.id === e.id} className={`equipe${equipe.id === e.id ? ' is-on' : ''}`} onClick={() => setEquipe(e)}>
              <span className="equipe-maillots" aria-hidden="true">
                <i style={{ background: e.avants }} />
                <i style={{ background: e.arrieres }} />
              </span>
              {e.nom}
            </button>
          ))}
        </div>
      </section>
      <section className="ligne">
        <h2 className="ligne-title">2. Ton schéma tactique</h2>
        <div className="serie-grid">
          {MATCHS.map((m) => {
            const r = progression.matchs[m.id]
            return (
              <a key={m.id} href={href('quiz', `match-${m.id}`)} className="serie-card">
                <span className={`niveau niveau-${m.niveau}`}>{niveauLabel(m.niveau)}</span>
                <strong>{m.titre}</strong>
                <span>{m.resume}</span>
                <small>{m.decisions.length} décisions{r ? ` · meilleur score ${Math.round(r.meilleur * 100)} %` : ''}</small>
              </a>
            )
          })}
        </div>
      </section>
    </div>
  )
}

function Partie({ match, equipe }) {
  const { noterMatch } = useApp()
  const [k, setK] = useState(0)
  const [notes, setNotes] = useState([])
  const [fini, setFini] = useState(false)
  const [manche, setManche] = useState(0)
  const d = match.decisions[k]
  const repondu = notes.length > k
  const total = notes.reduce((s, n) => s + n, 0)
  const max = match.decisions.length * NOTE_MAX

  const suivante = () => {
    if (k < match.decisions.length - 1) setK(k + 1)
    else {
      setFini(true)
      noterMatch(match.id, total / max)
    }
  }
  const rejouer = () => {
    setK(0)
    setNotes([])
    setFini(false)
    setManche((m) => m + 1)
  }

  const part = total / max
  return (
    <div className="quiz-page" style={styleEquipe(equipe)}>
      <div className="fiche-nav">
        <a href={href('quiz', 'match')}>← Changer de schéma</a>
        <span className="muted">{equipe.nom}</span>
      </div>
      <header className="view-head">
        <div>
          <p className="eyebrow">Mode match · {niveauLabel(match.niveau)}</p>
          <h1>{match.titre}</h1>
          <p className="lede">{match.resume}</p>
        </div>
        <div className="match-score" aria-label="Score">
          {match.decisions.map((_, i) => {
            const n = notes[i]
            return <span key={i} className={`match-pip${n == null ? '' : ` note-${noteInfo(n).classe}`}`} title={n == null ? 'À jouer' : noteInfo(n).label} />
          })}
          <strong>{total}/{max} pts</strong>
        </div>
      </header>

      {fini ? (
        <div className="fiche-block quiz-card">
          <div className="quiz-score">
            <span>{Math.round(part * 100)} %</span>
            <small>{part >= 0.8 ? 'Lecture de jeu remarquable !' : part >= 0.5 ? 'Bon match, quelques choix à revoir.' : 'Rejoue pour trouver les meilleures options.'}</small>
          </div>
          <ol className="quiz-recap">
            {match.decisions.map((x, i) => {
              const choix = x.choix.find((c) => c.note === notes[i])
              return (
                <li key={i} className={notes[i] === 2 ? 'is-right' : notes[i] === 1 ? 'is-mid' : 'is-wrong'}>
                  <span>{notes[i]} pt{notes[i] > 1 ? 's' : ''}</span>
                  {x.question} <em>Ton choix : {choix?.texte}</em>
                </li>
              )
            })}
          </ol>
          <div className="btn-row">
            <button type="button" className="btn btn-primary" onClick={rejouer}>Rejouer</button>
            <a className="btn btn-ghost" href={href('quiz', 'match')}>Autre schéma</a>
            <a className="btn btn-ghost" href={href('quiz', 'progression')}>Mes badges</a>
          </div>
        </div>
      ) : (
        <div className="fiche-block quiz-card">
          <div className="quiz-head">
            <span className="quiz-count">Décision {k + 1}/{match.decisions.length}</span>
          </div>
          <Decision key={`${manche}-${k}`} q={d} onAnswer={(note) => setNotes((ns) => [...ns, note])} />
          {repondu && (
            <button type="button" className="btn btn-primary quiz-next" onClick={suivante}>
              {k < match.decisions.length - 1 ? 'Action suivante' : 'Voir le résultat'}
            </button>
          )}
        </div>
      )}
    </div>
  )
}

export default function MatchView({ matchId }) {
  const [equipe, setEquipeState] = useState(() => EQUIPES.find((e) => e.id === load(CLE_EQUIPE, 'bleus')) ?? EQUIPES[0])
  const setEquipe = (e) => {
    setEquipeState(e)
    save(CLE_EQUIPE, e.id)
  }
  const match = matchId ? getMatch(matchId) : null
  if (match) return <Partie key={match.id} match={match} equipe={equipe} />
  return <Choix equipe={equipe} setEquipe={setEquipe} />
}
