import { useState } from 'react'
import { MODULES, REGLES, getRegle, reglesDuModule, questionsDeRegle } from '../data/regles.js'
import { useApp } from '../lib/AppContext.jsx'
import { regleReussie } from '../lib/progression.js'
import { href } from '../lib/router.js'
import ScenarioPlayer from '../components/ScenarioPlayer.jsx'
import Quiz from '../components/quiz/Quiz.jsx'
import { Vignette } from './Bibliotheque.jsx'

// Module Règles : #regles (liste Débutant / Expert), #regles-hors-jeu (fiche d'une règle).

function Statut({ id }) {
  const { progression } = useApp()
  const r = progression.regles[id]
  if (!r) return null
  return regleReussie(progression, id)
    ? <span className="statut statut-ok">Quiz réussi ✓</span>
    : <span className="statut">Quiz : {Math.round(r.meilleur * 100)} %</span>
}

function Liste() {
  const { niveau, progression } = useApp()
  const [module, setModule] = useState(niveau === 'avance' ? 'expert' : 'debutant')
  const m = MODULES.find((x) => x.id === module)
  const regles = reglesDuModule(module)
  const reussies = regles.filter((r) => regleReussie(progression, r.id)).length
  return (
    <div className="biblio">
      <header className="view-head">
        <div>
          <p className="eyebrow">Règles</p>
          <h1>Apprendre les règles</h1>
          <p className="lede">Chaque règle : une explication simple, un schéma animé, une vidéo et un quiz.</p>
        </div>
      </header>
      <div className="filters" role="radiogroup" aria-label="Module">
        {MODULES.map((x) => (
          <button key={x.id} type="button" role="radio" aria-checked={module === x.id} className={`chip${module === x.id ? ' is-on' : ''}`} onClick={() => setModule(x.id)}>
            Module {x.label}
          </button>
        ))}
      </div>
      <section className="ligne">
        <div className="ligne-row">
          <p className="muted">{m.description}</p>
          <span className="meter-text">{reussies}/{regles.length} quiz réussis</span>
        </div>
        <div className="meter" aria-hidden="true"><span style={{ width: `${(reussies / regles.length) * 100}%` }} /></div>
        <div className="combi-grid">
          {regles.map((r, i) => (
            <a key={r.id} className="combi-card" href={href('regles', r.id)}>
              <Vignette combinaison={r} />
              <span className="combi-card-text">
                <span className="regle-num">Règle {i + 1}</span>
                <strong>{r.titre}</strong>
                <span>{r.resume}</span>
                <Statut id={r.id} />
              </span>
            </a>
          ))}
        </div>
      </section>
    </div>
  )
}

function Video({ video }) {
  return (
    <div className="video">
      <div className="video-frame" role="img" aria-label={`Vidéo à venir : ${video.titre}`}>
        <svg viewBox="0 0 24 24" width="44" height="44" aria-hidden="true"><circle cx="12" cy="12" r="11" className="video-ring" /><path d="M10 8l6 4-6 4z" className="video-play" /></svg>
        <span>Vidéo à venir</span>
      </div>
      <h3>{video.titre}</h3>
      <p className="muted">{video.description}</p>
    </div>
  )
}

function Detail({ regle: r }) {
  const { noterRegle } = useApp()
  const [tirage, setTirage] = useState(0)
  const liste = REGLES.filter((x) => x.module === r.module)
  const i = liste.indexOf(r)
  const prev = liste[i - 1]
  const next = liste[i + 1]
  const m = MODULES.find((x) => x.id === r.module)
  const scenario = { steps: r.steps, zoom: r.zoom }

  return (
    <div className="combi">
      <div className="fiche-nav">
        <a href={href('regles')}>← Toutes les règles</a>
        <span>
          {prev && <a href={href('regles', prev.id)}>‹ {prev.titre}</a>}
          {next && <a href={href('regles', next.id)}>{next.titre} ›</a>}
        </span>
      </div>
      <header className="view-head">
        <div>
          <p className="eyebrow">Module {m.label} · règle {i + 1}/{liste.length}</p>
          <h1>{r.titre}</h1>
          <p className="lede">{r.resume}</p>
        </div>
        <Statut id={r.id} />
      </header>

      <div className="terrain-layout">
        <ScenarioPlayer scenario={scenario} ariaLabel={`Schéma animé : ${r.titre}`} />
        <aside className="panel combi-panel">
          <h3>Explication simple</h3>
          <p>{r.explication.simple}</p>
          <h3>À retenir</h3>
          <ul className="bullets">{r.explication.points.map((p) => <li key={p}>{p}</li>)}</ul>
          <h3>Sanction</h3>
          <p className="tip-line">{r.explication.sanction}</p>
        </aside>
      </div>

      <div className="fiche-grid">
        <section className="fiche-block fiche-wide">
          <h2>Vidéo</h2>
          <Video video={r.video} />
        </section>
        <section className="fiche-block fiche-wide">
          <h2>Quiz</h2>
          <p className="muted">Réussis au moins 2 questions sur 3 pour valider la règle et avancer vers ton badge.</p>
          <Quiz
            key={`${r.id}-${tirage}`}
            questions={questionsDeRegle(r)}
            onFinish={(bonnes, total) => noterRegle(r.id, bonnes / total)}
            onRestart={() => setTirage((t) => t + 1)}
            finLiens={next && <a className="btn btn-ghost" href={href('regles', next.id)}>Règle suivante</a>}
          />
        </section>
      </div>
    </div>
  )
}

export default function ReglesView({ param }) {
  const regle = param ? getRegle(param) : null
  if (param && !regle) {
    return (
      <div className="view-head">
        <h1>Règle introuvable</h1>
        <a className="btn btn-primary" href={href('regles')}>Voir toutes les règles</a>
      </div>
    )
  }
  return regle ? <Detail key={regle.id} regle={regle} /> : <Liste />
}
