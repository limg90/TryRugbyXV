import { useState } from 'react'
import { useScenario } from '../engine/useScenario.js'
import { useMediaQuery } from '../lib/useMediaQuery.js'
import ScenarioStage from './ScenarioStage.jsx'
import Transport from './Transport.jsx'

// Schéma animé complet : commandes de lecture, terrain, légende et étapes.
// scenario : { steps, zoom } (règles, fiches) ; utilise le moteur partagé.
export default function ScenarioPlayer({ scenario, ariaLabel }) {
  const vertical = useMediaQuery('(max-width: 720px)')
  const [speed, setSpeed] = useState(1)
  const [rapproche, setRapproche] = useState(true)
  const player = useScenario(scenario, { speed })
  return (
    <div className="terrain-stage">
      <Transport player={player} speed={speed} onSpeed={setSpeed} />
      {scenario.zoom && (
        <div className="seg" role="radiogroup" aria-label="Vue">
          <button type="button" role="radio" aria-checked={rapproche} className={`chip${rapproche ? ' is-on' : ''}`} onClick={() => setRapproche(true)}>Vue rapprochée</button>
          <button type="button" role="radio" aria-checked={!rapproche} className={`chip${!rapproche ? ' is-on' : ''}`} onClick={() => setRapproche(false)}>Vue aérienne</button>
        </div>
      )}
      <div className={`pitch-wrap${vertical ? ' is-vertical' : ''}`}>
        <ScenarioStage
          frames={player.frames}
          index={player.index}
          transitionDuration={player.transitionDuration}
          vertical={vertical}
          zoom={rapproche ? scenario.zoom : null}
          ariaLabel={ariaLabel}
        />
      </div>
      <div className="caption" aria-live="polite">
        <span className="caption-step">{player.count > 1 ? `${player.index + 1}/${player.count}` : '•'}</span>
        <p>{player.frame.caption}</p>
      </div>
      <ol className="steps" aria-label="Étapes">
        {player.frames.map((f, k) => (
          <li key={k}>
            <button type="button" className={k === player.index ? 'is-on' : ''} aria-current={k === player.index ? 'step' : undefined} onClick={() => player.goTo(k)} title={f.caption}>
              {k + 1}
            </button>
          </li>
        ))}
      </ol>
      <p className="legend">
        <span><i className="dot dot-avants" /> Nos avants</span>
        <span><i className="dot dot-arrieres" /> Nos trois-quarts</span>
        <span><i className="dot dot-adverse" /> Adversaires</span>
        <span>Nous attaquons vers {vertical ? 'le haut' : 'la droite'}</span>
      </p>
    </div>
  )
}
