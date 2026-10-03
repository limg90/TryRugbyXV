import { motion } from 'framer-motion'
import { useProject } from './Pitch.jsx'

// Un joueur sur le terrain : maillot rond avec son numéro officiel.
export default function PlayerToken({ numero, nom, x, y, groupe, label, selected, highlighted, dimmed, duration = 0.6, onSelect }) {
  const project = useProject()
  const [sx, sy] = project(x, y)
  const onKey = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      onSelect?.(numero)
    }
  }
  return (
    <motion.g
      className={`token token-${groupe}${selected ? ' is-selected' : ''}${highlighted ? ' is-highlighted' : ''}${dimmed ? ' is-dimmed' : ''}`}
      initial={false}
      animate={{ x: sx, y: sy }}
      transition={{ duration, ease: 'easeInOut' }}
      role="button"
      tabIndex={0}
      aria-label={`Joueur ${numero}${nom ? `, ${nom}` : ''}`}
      aria-pressed={selected}
      onClick={() => onSelect?.(numero)}
      onKeyDown={onKey}
    >
      <circle r={2.5} className="token-hit" />
      {selected && <circle r={2.7} className="token-ring" />}
      <circle r={1.9} className="token-body" />
      <text className="token-number" textAnchor="middle" dominantBaseline="central">{numero}</text>
      {label && (
        <text className="token-label" y={3.3} textAnchor="middle" dominantBaseline="hanging">{label}</text>
      )}
    </motion.g>
  )
}
