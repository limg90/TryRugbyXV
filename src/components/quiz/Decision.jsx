import { useMemo, useState } from 'react'
import { buildFrames, useScenario } from '../../engine/useScenario.js'
import { useMediaQuery } from '../../lib/useMediaQuery.js'
import { noteInfo } from '../../data/matchs.js'
import ScenarioStage from '../ScenarioStage.jsx'
import Retour from './Retour.jsx'

// Choix tactique : l'action se joue, puis le joueur décide (A, B, C).
// La suite de l'action correspondant à son choix est ensuite animée et évaluée.
// Utilisé par les quiz (type 'tactique') et le mode match.

// Scénario de la suite : on repart de la dernière image de la situation.
function scenarioSuite(situation, choix) {
  const frames = buildFrames({ steps: situation })
  const f = frames[frames.length - 1]
  return {
    steps: [
      { duration: 0, caption: f.caption, players: f.positions, opponents: f.opponents, ball: f.ball, highlight: f.highlight },
      ...choix.suite,
    ],
  }
}

export default function Decision({ q, onAnswer }) {
  const vertical = useMediaQuery('(max-width: 720px)')
  const [choix, setChoix] = useState(null)
  const situation = useMemo(() => ({ steps: q.situation }), [q])
  const suite = useMemo(() => (choix == null ? null : scenarioSuite(q.situation, q.choix[choix])), [q, choix])
  const player = useScenario(suite ?? situation, { autoplay: true })
  const pret = player.index >= player.count - 1

  const choisir = (j) => {
    setChoix(j)
    onAnswer(q.choix[j].note)
  }
  const c = choix != null ? q.choix[choix] : null
  const info = c ? noteInfo(c.note) : null

  return (
    <div className="quiz-q decision">
      <div className={`pitch-wrap${vertical ? ' is-vertical' : ''}`}>
        <ScenarioStage
          frames={player.frames}
          index={player.index}
          transitionDuration={player.transitionDuration}
          vertical={vertical}
          zoom={q.zoom}
          ariaLabel="Action de match"
        />
      </div>
      <div className="caption" aria-live="polite">
        <span className="caption-step">{player.count > 1 ? `${player.index + 1}/${player.count}` : '•'}</span>
        <p>{player.frame.caption}</p>
        {pret && !player.playing && player.count > 1 && (
          <button type="button" className="link-btn caption-replay" onClick={player.play}>Revoir</button>
        )}
      </div>
      <p className="quiz-question">{q.question}</p>
      <div className="quiz-choices">
        {q.choix.map((ch, j) => {
          const state = choix == null ? '' : j === choix ? `is-picked note-${noteInfo(ch.note).classe}` : ch.note === 2 ? 'is-right' : 'is-faded'
          return (
            <button key={j} type="button" className={`quiz-choice ${state}`} disabled={choix != null || !pret} onClick={() => choisir(j)}>
              <span className="quiz-letter">{String.fromCharCode(65 + j)}</span>
              {ch.texte}
            </button>
          )
        })}
      </div>
      {!pret && choix == null && <p className="muted">Regarde l’action, les choix s’activent à la fin.</p>}
      {c && <Retour ok={c.note === 2} titre={`${info.label}.`} texte={c.retour} />}
      {c && c.note < 2 && <p className="muted">Meilleur choix : {q.choix.find((x) => x.note === 2).texte}.</p>}
    </div>
  )
}
