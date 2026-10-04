import Pitch from '../components/Pitch.jsx'
import PlayerToken from '../components/PlayerToken.jsx'
import SkillBars from '../components/SkillBars.jsx'
import Quiz from '../components/quiz/Quiz.jsx'
import { questionsDePoste } from '../data/quiz.js'
import { POSITIONS, GROUPES, getPosition } from '../data/positions.js'
import { BASE_FORMATION } from '../data/scenarios.js'
import { href } from '../lib/router.js'
import { useApp } from '../lib/AppContext.jsx'

export default function PosteDetail({ numero }) {
  const { niveau } = useApp()
  const p = getPosition(numero)
  if (!p) {
    return (
      <div className="view-head">
        <h1>Poste introuvable</h1>
        <a className="btn btn-primary" href={href('postes')}>Voir les 15 postes</a>
      </div>
    )
  }
  const prev = getPosition(p.numero === 1 ? 15 : p.numero - 1)
  const next = getPosition(p.numero === 15 ? 1 : p.numero + 1)
  const go = (n) => { window.location.hash = href('poste', n) }

  return (
    <article className="fiche">
      <nav className="fiche-nav" aria-label="Postes voisins">
        <a href={href('postes')}>← Tous les postes</a>
        <span>
          <a href={href('poste', prev.numero)} aria-label={`Poste précédent : ${prev.nom}`}>‹ {prev.numero}</a>
          <a href={href('poste', next.numero)} aria-label={`Poste suivant : ${next.nom}`}>{next.numero} ›</a>
        </span>
      </nav>

      <header className="fiche-head">
        <span className={`jersey jersey-lg jersey-${p.groupe}`}>{p.numero}</span>
        <div>
          <p className="eyebrow">{GROUPES[p.groupe].label} · {p.ligne}</p>
          <h1>{p.nom}</h1>
          <p className="lede">{p.resume}</p>
        </div>
      </header>

      <div className="fiche-grid">
        <section className="fiche-block fiche-map">
          <h2>Sa place sur mêlée</h2>
          <Pitch ariaLabel={`Position du ${p.numero} sur mêlée`} className="pitch-mini" crop={[14, 64]}>
            {POSITIONS.map((q) => {
              const [x, y] = BASE_FORMATION[q.numero]
              return (
                <PlayerToken key={q.numero} numero={q.numero} nom={q.nom} x={x} y={y} groupe={q.groupe} selected={q.numero === p.numero} dimmed={q.numero !== p.numero} onSelect={go} />
              )
            })}
          </Pitch>
        </section>

        <section className="fiche-block">
          <h2>Missions</h2>
          <ul className="bullets">{p.missions.map((m) => <li key={m}>{m}</li>)}</ul>
          <h2>Capacités requises</h2>
          <ul className="tags">{p.capacites.map((c) => <li key={c}>{c}</li>)}</ul>
        </section>

        <section className="fiche-block fiche-wide">
          <h2>Skills du poste</h2>
          <p className="muted">Importance de chaque qualité pour le {p.numero}, de 1 à 5.</p>
          <SkillBars skills={p.skills} />
        </section>

        <section className="fiche-block fiche-wide">
          <h2>Exercices</h2>
          <ol className="exos">
            {p.exercices.map((e) => (
              <li key={e.nom}>
                <h3>{e.nom} <span className="exo-but">{e.but}</span></h3>
                <p>{e.description}</p>
              </li>
            ))}
          </ol>
        </section>

        <section className="fiche-block tip">
          <h2>Conseil</h2>
          <p>{p.conseil}</p>
        </section>

        {niveau !== 'debutant' && (
          <section className="fiche-block tip tip-advanced">
            <h2>Pour aller plus loin</h2>
            <p>{p.avance}</p>
          </section>
        )}

        <section className="fiche-block fiche-wide">
          <h2>Quiz : situations de match</h2>
          <Quiz key={p.numero} questions={questionsDePoste(p.numero)} />
        </section>
      </div>
    </article>
  )
}
