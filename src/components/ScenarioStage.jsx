import Pitch from './Pitch.jsx'
import PlayerToken from './PlayerToken.jsx'
import Ball from './Ball.jsx'
import Trails, { TrailDefs } from './Trails.jsx'
import { POSITIONS } from '../data/positions.js'

// Terrain + joueurs + adversaires + ballon + trajectoires pour une image de scénario.
// Partagé par la bibliothèque, les vignettes et la lecture dans l'éditeur.
export default function ScenarioStage({
  frames, index, transitionDuration = 0.6, vertical = false, zoom = null, trails = true,
  selected = null, onSelect, ariaLabel, className = '', still = false,
}) {
  const frame = frames[index]
  const duration = still ? 0 : transitionDuration
  const hl = frame.highlight
  const ballMap = frame.ball?.team === 'adv' ? frame.opponents : frame.positions
  return (
    <Pitch vertical={vertical} zoom={zoom} ariaLabel={ariaLabel} className={className}>
      <TrailDefs />
      {trails && <Trails frames={frames} index={index} duration={duration} />}
      {Object.entries(frame.opponents).map(([n, [x, y]]) => (
        <PlayerToken key={`adv-${n}`} numero={Number(n)} x={x} y={y} groupe="adverse" duration={duration} dimmed={hl.length > 0} />
      ))}
      {POSITIONS.map((p) => {
        const pos = frame.positions[p.numero]
        if (!pos) return null
        const isHl = hl.includes(p.numero)
        return (
          <PlayerToken
            key={p.numero}
            numero={p.numero}
            nom={p.nom}
            x={pos[0]}
            y={pos[1]}
            groupe={p.groupe}
            label={selected === p.numero ? p.court : null}
            selected={selected === p.numero}
            highlighted={isHl}
            dimmed={hl.length > 0 && !isHl && selected !== p.numero}
            lifted={frame.lifted.includes(p.numero)}
            duration={duration}
            onSelect={onSelect}
          />
        )
      })}
      <Ball ball={frame.ball} positions={ballMap} duration={duration} />
    </Pitch>
  )
}
