import { motion } from 'framer-motion'
import { useProject } from './Pitch.jsx'

// Le ballon suit son porteur (décalé sur le côté) ou reste posé à une position.
export default function Ball({ ball, positions, duration = 0.6 }) {
  const project = useProject()
  let pos = null
  if (ball?.carrier != null && positions[ball.carrier]) {
    const [x, y] = positions[ball.carrier]
    pos = [x + 1.4, y - 1.6]
  } else if (ball?.at) {
    pos = ball.at
  }
  if (!pos) return null
  const [sx, sy] = project(pos[0], pos[1])
  return (
    <motion.g initial={false} animate={{ x: sx, y: sy }} transition={{ duration, ease: 'easeInOut' }} className="ball" aria-hidden="true">
      <ellipse rx={1.15} ry={0.75} transform="rotate(-30)" />
      <line x1={-0.45} y1={0.25} x2={0.45} y2={-0.25} />
    </motion.g>
  )
}
