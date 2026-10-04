import { NIVEAUX, useApp } from '../lib/AppContext.jsx'
import { etatBadges, statistiques } from '../lib/progression.js'
import { QUESTIONS } from '../data/quiz.js'
import { MATCHS } from '../data/matchs.js'
import { href } from '../lib/router.js'

// Badges et statistiques, enregistrés sur l'appareil.
export default function ProgressionView() {
  const { progression, niveau, setNiveau, reinitialiser } = useApp()
  const badges = etatBadges(progression)
  const s = statistiques(progression)
  const ordre = NIVEAUX.map((n) => n.id)
  // Niveau conseillé : celui qui suit le dernier badge obtenu.
  const dernier = [...badges].reverse().find((b) => b.obtenu)
  const conseille = dernier?.niveauSuivant
  const proposer = conseille && ordre.indexOf(conseille) > ordre.indexOf(niveau)

  const effacer = () => {
    if (window.confirm('Effacer toute ta progression (réponses, règles, matchs et badges) sur cet appareil ?')) reinitialiser()
  }

  return (
    <div className="biblio">
      <header className="view-head">
        <div>
          <p className="eyebrow">Progression</p>
          <h1>Mes badges</h1>
          <p className="lede">Ta progression est enregistrée sur cet appareil, même hors ligne.</p>
        </div>
      </header>

      {proposer && (
        <div className="tip-line level-up">
          <span>Bravo pour ton badge {dernier.emoji} {dernier.titre} ! Tu peux passer au niveau {NIVEAUX.find((n) => n.id === conseille).label} : quiz et contenus s’adaptent.</span>
          <button type="button" className="btn btn-primary" onClick={() => setNiveau(conseille)}>Passer au niveau {NIVEAUX.find((n) => n.id === conseille).label}</button>
        </div>
      )}

      <div className="badge-grid">
        {badges.map((b) => (
          <section key={b.id} className={`badge-card${b.obtenu ? ' is-won' : ''}`}>
            <div className="badge-head">
              <span className="badge-emoji" aria-hidden="true">{b.emoji}</span>
              <div>
                <h2>{b.titre}</h2>
                <p className="muted">{b.obtenu ? 'Badge obtenu' : 'À débloquer'}</p>
              </div>
            </div>
            <ul className="badge-conds">
              {b.conditions.map((c) => (
                <li key={c.label} className={c.faite ? 'is-done' : ''}>
                  <span>{c.label}</span>
                  <span className="meter-text">{Math.min(c.valeur, c.cible)}/{c.cible}</span>
                  <div className="meter" aria-hidden="true"><span style={{ width: `${Math.min(1, c.valeur / c.cible) * 100}%` }} /></div>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>

      <section className="fiche-block">
        <h2>Mes chiffres</h2>
        <dl className="stats">
          <div><dt>Questions réussies</dt><dd>{s.bonnesDistinctes}<small>/{QUESTIONS.length}</small></dd></div>
          <div><dt>Réponses données</dt><dd>{s.reponses}</dd></div>
          <div><dt>Règles Débutant</dt><dd>{s.reglesDebutant}<small>/{s.totalDebutant}</small></dd></div>
          <div><dt>Règles Expert</dt><dd>{s.reglesExpert}<small>/{s.totalExpert}</small></dd></div>
          <div><dt>Matchs joués</dt><dd>{s.matchsJoues}<small>/{MATCHS.length}</small></dd></div>
        </dl>
        <div className="btn-row">
          <a className="btn btn-primary" href={href('quiz', 'niveau')}>Quiz de mon niveau</a>
          <a className="btn btn-ghost" href={href('regles')}>Règles</a>
          <a className="btn btn-ghost" href={href('quiz', 'match')}>Mode match</a>
          <button type="button" className="btn btn-ghost btn-danger" onClick={effacer}>Effacer ma progression</button>
        </div>
      </section>
    </div>
  )
}
