import { motion } from 'framer-motion'
import { useProject } from './Pitch.jsx'

// Un joueur sur le terrain : maillot rond avec son numéro officiel.
// groupe 'adverse' : maillot de l'équipe adverse. lifted : joueur soulevé en touche.
export default function PlayerToken({ numero, nom, x, y, groupe, label, selected, highlighted, dimmed, lifted, duration = 0.6, onSelect, onPointerDown }) {
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
      className={`token token-${groupe}${selected ? ' is-selected' : ''}${highlighted ? ' is-highlighted' : ''}${dimmed ? ' is-dimmed' : ''}${lifted ? ' is-lifted' : ''}`}
      initial={false}
      animate={{ x: sx, y: sy, scale: lifted ? 1.2 : 1 }}
      transition={{ duration, ease: 'easeInOut' }}
      role="button"
      tabIndex={0}
      aria-label={`${groupe === 'adverse' ? 'Adversaire' : 'Joueur'} ${numero}${nom ? `, ${nom}` : ''}`}
      aria-pressed={selected}
      onClick={() => onSelect?.(numero)}
      onKeyDown={onKey}
      onPointerDown={onPointerDown}
    >
      <circle r={2.5} className="token-hit" />
      {lifted && <circle r={2.4} className="token-lift" />}
      {selected && <circle r={2.7} className="token-ring" />}
      <circle r={1.9} className="token-body" />
      <text className="token-number" textAnchor="middle" dominantBaseline="central">{numero}</text>
      {label && (
        <text className="token-label" y={3.3} textAnchor="middle" dominantBaseline="hanging">{label}</text>
      )}
    </motion.g>
  )
}
