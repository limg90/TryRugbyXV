import { motion } from 'framer-motion'
import { useProject } from './Pitch.jsx'

// Trajectoires tracées sur le terrain : courses (tirets), passes (pointillés dorés),
// coups de pied (tirets longs). Les étapes passées restent en fond, l'étape courante se dessine.

export function TrailDefs() {
  return (
    <defs>
      {['nous', 'adv', 'passe'].map((k) => (
        <marker key={k} id={`arrow-${k}`} viewBox="0 0 10 10" refX="7" refY="5" markerWidth="1.3" markerHeight="1.3" markerUnits="userSpaceOnUse" orient="auto-start-reverse">
          <path d="M0 0 10 5 0 10z" className={`arrow-${k}`} />
        </marker>
      ))}
    </defs>
  )
}

function Segment({ from, to, kind, current, duration }) {
  const project = useProject()
  const [x1, y1] = project(from[0], from[1])
  const [x2, y2] = project(to[0], to[1])
  // On raccourcit un peu la flèche pour qu'elle s'arrête au bord du maillot.
  const len = Math.hypot(x2 - x1, y2 - y1)
  if (len < 3) return null
  const cut = Math.min(2.1, len / 2)
  const ex = x2 - ((x2 - x1) / len) * cut
  const ey = y2 - ((y2 - y1) / len) * cut
  const d = `M${x1} ${y1}L${ex} ${ey}`
  const marker = kind === 'pied' ? 'passe' : kind
  return (
    <motion.path
      d={d}
      className={`trail trail-${kind}${current ? ' is-current' : ''}`}
      markerEnd={current ? `url(#arrow-${marker})` : undefined}
      initial={current ? { pathLength: 0, opacity: 0 } : false}
      animate={{ pathLength: 1, opacity: 1 }}
      transition={{ duration: current ? duration : 0, ease: 'easeInOut' }}
    />
  )
}

// frames : images du scénario ; index : image courante.
export default function Trails({ frames, index, duration = 1, showOpponents = true }) {
  const items = []
  for (let i = 1; i <= index; i++) {
    const f = frames[i]
    const current = i === index
    for (const m of f.moves) {
      if (m.team === 'adv' && !showOpponents) continue
      items.push(<Segment key={`${i}-${m.id}`} from={m.from} to={m.to} kind={m.team} current={current} duration={duration} />)
    }
    if (f.pass) items.push(<Segment key={`${i}-ballon`} from={f.pass.from} to={f.pass.to} kind={f.pass.kind} current={current} duration={duration * 0.6} />)
  }
  return <g className="trails" aria-hidden="true">{items}</g>
}
