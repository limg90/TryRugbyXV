import { useState } from 'react'
import Pitch from '../components/Pitch.jsx'
import PlayerToken from '../components/PlayerToken.jsx'
import Ball from '../components/Ball.jsx'
import PlayerPanel from '../components/PlayerPanel.jsx'
import { POSITIONS, getPosition } from '../data/positions.js'
import { SCENARIOS, getScenario } from '../data/scenarios.js'
import { useScenario } from '../engine/useScenario.js'
import { useMediaQuery } from '../lib/useMediaQuery.js'

const SPEEDS = [0.5, 1, 1.5, 2]

// Joueurs trop proches d'un autre pour afficher leur poste sans chevauchement.
function crowdedPlayers(positions, minDistance = 6) {
  const entries = Object.entries(positions)
  const crowded = new Set()
  for (const [a, [ax, ay]] of entries) {
    for (const [b, [bx, by]] of entries) {
      if (a !== b && Math.hypot(ax - bx, ay - by) < minDistance) crowded.add(Number(a))
    }
  }
  return crowded
}

export default function TerrainView() {
  const vertical = useMediaQuery('(max-width: 720px)')
  const [scenarioId, setScenarioId] = useState('mouvement-9-14')
  const [speed, setSpeed] = useState(1)
  const [selected, setSelected] = useState(null)
  const [showLabels, setShowLabels] = useState(false)
  const scenario = getScenario(scenarioId)
  const player = useScenario(scenario, { speed })
  const { frame } = player
  const crowded = showLabels ? crowdedPlayers(frame.positions) : null

  return (
    <div className="terrain">
      <header className="view-head">
        <div>
          <p className="eyebrow">Terrain interactif</p>
          <h1>Les 15 joueurs sur le terrain</h1>
        </div>
        <label className="toggle">
          <input id="show-labels" type="checkbox" checked={showLabels} onChange={(e) => setShowLabels(e.target.checked)} />
          <span>Afficher les postes</span>
        </label>
      </header>

      <div className="terrain-layout">
        <div className="terrain-stage">
          <div className="controls" role="group" aria-label="Animation">
            <label className="field">
              <span className="field-label">Animation</span>
              <select id="scenario" value={scenarioId} onChange={(e) => setScenarioId(e.target.value)}>
                {SCENARIOS.map((s) => <option key={s.id} value={s.id}>{s.titre}</option>)}
              </select>
            </label>
            <div className="transport">
              {player.playing ? (
                <button type="button" className="btn btn-primary" onClick={player.pause}>Pause</button>
              ) : (
                <button type="button" className="btn btn-primary" onClick={player.play} disabled={player.count < 2}>
                  {player.index > 0 && player.index >= player.count - 1 ? 'Rejouer' : 'Lancer'}
                </button>
              )}
              <button type="button" className="btn btn-ghost" onClick={() => player.goTo(player.index - 1)} disabled={player.index === 0} aria-label="Étape précédente">‹</button>
              <button type="button" className="btn btn-ghost" onClick={() => player.goTo(player.index + 1)} disabled={player.index >= player.count - 1} aria-label="Étape suivante">›</button>
              <button type="button" className="btn btn-ghost" onClick={player.reset}>Début</button>
            </div>
            <div className="speed" role="radiogroup" aria-label="Vitesse">
              {SPEEDS.map((s) => (
                <button key={s} type="button" role="radio" aria-checked={speed === s} className={`chip${speed === s ? ' is-on' : ''}`} onClick={() => setSpeed(s)}>
                  {String(s).replace('.', ',')}×
                </button>
              ))}
            </div>
          </div>

          <div className={`pitch-wrap${vertical ? ' is-vertical' : ''}`}>
            <Pitch vertical={vertical} ariaLabel={`Terrain : ${scenario.titre}`}>
              {POSITIONS.map((p) => {
                const pos = frame.positions[p.numero]
                if (!pos) return null
                const hl = frame.highlight.includes(p.numero)
                return (
                  <PlayerToken
                    key={p.numero}
                    numero={p.numero}
                    nom={p.nom}
                    x={pos[0]}
                    y={pos[1]}
                    groupe={p.groupe}
                    label={showLabels && (selected === p.numero || !crowded.has(p.numero)) ? p.court : null}
                    selected={selected === p.numero}
                    highlighted={hl}
                    dimmed={frame.highlight.length > 0 && !hl && selected !== p.numero}
                    duration={player.transitionDuration}
                    onSelect={(n) => setSelected((cur) => (cur === n ? null : n))}
                  />
                )
              })}
              <Ball ball={frame.ball} positions={frame.positions} duration={player.transitionDuration} />
            </Pitch>
          </div>

          <div className="caption" aria-live="polite">
            <span className="caption-step">{player.count > 1 ? `${player.index + 1}/${player.count}` : '•'}</span>
            <p>{frame.caption}</p>
          </div>
          {showLabels && crowded.size > 0 && (
            <p className="muted">Dans les zones serrées, touchez un joueur pour voir son poste.</p>
          )}
          <p className="legend">
            <span><i className="dot dot-avants" /> Avants (1 à 8)</span>
            <span><i className="dot dot-arrieres" /> Trois-quarts (9 à 15)</span>
            <span>Attaque vers {vertical ? 'le haut' : 'la droite'}</span>
          </p>
        </div>

        <PlayerPanel position={selected ? getPosition(selected) : null} onClose={() => setSelected(null)} />
      </div>
    </div>
  )
}
