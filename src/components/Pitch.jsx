import { createContext, useContext } from 'react'

// Terrain de rugby à l'échelle (mètres) : 100 m entre les lignes d'essai,
// 70 m de large, en-buts de 10 m. Orientation horizontale (attaque vers la droite)
// ou verticale (attaque vers le haut) pour les écrans de téléphone.

const PAD = 3
const IN_GOAL = 10

const ProjectContext = createContext((x, y) => [x, y])
export const useProject = () => useContext(ProjectContext)

export function makeProject(vertical) {
  return vertical
    ? (x, y) => [y + PAD, 100 + IN_GOAL + PAD - x]
    : (x, y) => [x + IN_GOAL + PAD, y + PAD]
}

function Dashed({ x1, y1, x2, y2, dash = '1.6 1.6' }) {
  return <line className="pitch-line" x1={x1} y1={y1} x2={x2} y2={y2} strokeDasharray={dash} />
}

function PitchMarkings() {
  const stripes = []
  for (let i = 0; i < 10; i++) {
    stripes.push(<rect key={i} x={i * 10} y={0} width={10} height={70} className={i % 2 ? 'pitch-stripe-b' : 'pitch-stripe-a'} />)
  }
  const fifteen = []
  // Petits tirets sur les lignes des 5 m et 15 m à chaque ligne transversale.
  for (const x of [5, 22, 40, 50, 60, 78, 95]) {
    for (const y of [5, 15, 55, 65]) fifteen.push(<line key={`${x}-${y}`} className="pitch-line" x1={x - 1} y1={y} x2={x + 1} y2={y} />)
  }
  return (
    <>
      <rect x={-IN_GOAL} y={0} width={IN_GOAL} height={70} className="pitch-ingoal" />
      <rect x={100} y={0} width={IN_GOAL} height={70} className="pitch-ingoal" />
      {stripes}
      <rect x={-IN_GOAL} y={0} width={100 + 2 * IN_GOAL} height={70} className="pitch-line pitch-border" fill="none" />
      <line className="pitch-line pitch-strong" x1={0} y1={0} x2={0} y2={70} />
      <line className="pitch-line pitch-strong" x1={100} y1={0} x2={100} y2={70} />
      <line className="pitch-line" x1={22} y1={0} x2={22} y2={70} />
      <line className="pitch-line" x1={78} y1={0} x2={78} y2={70} />
      <line className="pitch-line" x1={50} y1={0} x2={50} y2={70} />
      <Dashed x1={40} y1={0} x2={40} y2={70} dash="2.5 2.5" />
      <Dashed x1={60} y1={0} x2={60} y2={70} dash="2.5 2.5" />
      <Dashed x1={5} y1={5} x2={5} y2={65} dash="1 3" />
      <Dashed x1={95} y1={5} x2={95} y2={65} dash="1 3" />
      <Dashed x1={5} y1={5} x2={95} y2={5} dash="1 4" />
      <Dashed x1={5} y1={65} x2={95} y2={65} dash="1 4" />
      <Dashed x1={5} y1={15} x2={95} y2={15} dash="1 4" />
      <Dashed x1={5} y1={55} x2={95} y2={55} dash="1 4" />
      {fifteen}
      {/* Poteaux : 5,6 m d'écart */}
      {[0, 100].map((x) => (
        <g key={x} className="pitch-posts">
          <line x1={x} y1={32.2} x2={x} y2={37.8} />
          <circle cx={x} cy={32.2} r={0.5} />
          <circle cx={x} cy={37.8} r={0.5} />
        </g>
      ))}
    </>
  )
}

const LABELS = [
  { x: 22, t: '22' }, { x: 40, t: '10' }, { x: 50, t: '50' }, { x: 60, t: '10' }, { x: 78, t: '22' },
]

// crop : [xmin, xmax] en mètres pour n'afficher qu'une partie du terrain (orientation horizontale).
export default function Pitch({ vertical = false, crop = null, children, className = '', ariaLabel = 'Terrain de rugby' }) {
  const project = makeProject(vertical)
  const w = vertical ? 70 + 2 * PAD : 100 + 2 * IN_GOAL + 2 * PAD
  const h = vertical ? 100 + 2 * IN_GOAL + 2 * PAD : 70 + 2 * PAD
  const groupTransform = vertical
    ? `translate(${PAD} ${100 + IN_GOAL + PAD}) rotate(-90)`
    : `translate(${IN_GOAL + PAD} ${PAD})`
  const viewBox = crop && !vertical
    ? `${crop[0] + IN_GOAL + PAD} 0 ${crop[1] - crop[0]} ${h}`
    : `0 0 ${w} ${h}`
  return (
    <ProjectContext.Provider value={project}>
      <svg className={`pitch ${className}`} viewBox={viewBox} role="group" aria-label={ariaLabel}>
        <rect x={0} y={0} width={w} height={h} className="pitch-surround" />
        <g transform={groupTransform}>
          <PitchMarkings />
        </g>
        {LABELS.map(({ x, t }) => {
          const [sx, sy] = project(x + 1.6, 2.2)
          return (
            <text key={x} x={sx} y={sy} className="pitch-label" textAnchor="middle" dominantBaseline="middle">{t}</text>
          )
        })}
        {(() => {
          const [ax, ay] = project(104.5, 35)
          return <text x={ax} y={ay} className="pitch-label pitch-label-goal" textAnchor="middle" dominantBaseline="middle" transform={vertical ? undefined : `rotate(90 ${ax} ${ay})`}>EN-BUT</text>
        })()}
        {children}
      </svg>
    </ProjectContext.Provider>
  )
}
