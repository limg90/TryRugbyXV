import { useState } from 'react'
import { CRITERES } from '../../data/evaluation.js'

// Radar des 13 critères (échelle 0 à 10).
// series : [{ id, label, notes, variante: 'cible' | 'reel' | 'p0' | 'p1' | 'p2' | 'p3' }]
// Survoler ou toucher un axe affiche les valeurs de chaque série sous le graphique.
const C = 200
const R = 128
const N = CRITERES.length
const angle = (i) => (i / N) * 2 * Math.PI - Math.PI / 2
const point = (i, v) => [C + Math.cos(angle(i)) * (R * v) / 10, C + Math.sin(angle(i)) * (R * v) / 10]

export default function Radar({ series, titre }) {
  const [actif, setActif] = useState(null)
  const visibles = series.filter((s) => s.notes && CRITERES.some((c) => s.notes[c.id] > 0))
  const c = actif != null ? CRITERES[actif] : null

  return (
    <figure className="radar">
      <svg viewBox="-64 -8 528 416" role="img" aria-label={titre ?? 'Radar des 13 critères'} onMouseLeave={() => setActif(null)}>
        {[2, 4, 6, 8, 10].map((l) => (
          <polygon key={l} className={`radar-grid${l === 10 ? ' is-outer' : ''}`} points={CRITERES.map((_, i) => point(i, l).join(',')).join(' ')} />
        ))}
        {[5, 10].map((l) => (
          <text key={l} className="radar-tick" x={C + 3} y={C - (R * l) / 10 + 10}>{l}</text>
        ))}
        {CRITERES.map((cr, i) => {
          const [x, y] = point(i, 10)
          const [lx, ly] = point(i, 11.9)
          const cos = Math.cos(angle(i))
          const anchor = cos > 0.3 ? 'start' : cos < -0.3 ? 'end' : 'middle'
          return (
            <g key={cr.id} className={`radar-axis${actif === i ? ' is-on' : ''}`}>
              <line x1={C} y1={C} x2={x} y2={y} />
              <text x={lx} y={ly + 4} textAnchor={anchor}>{cr.court}</text>
            </g>
          )
        })}
        {visibles.map((s) => (
          <g key={s.id} className={`radar-serie radar-${s.variante}`}>
            <polygon points={CRITERES.map((cr, i) => point(i, s.notes[cr.id] || 0).join(',')).join(' ')} />
            {s.variante !== 'cible' && CRITERES.map((cr, i) => {
              const [x, y] = point(i, s.notes[cr.id] || 0)
              return <circle key={cr.id} cx={x} cy={y} r={actif === i ? 5.5 : 3.6} />
            })}
          </g>
        ))}
        {CRITERES.map((cr, i) => {
          // Zone de survol large : un secteur par critère.
          const a0 = angle(i - 0.5)
          const a1 = angle(i + 0.5)
          const big = R + 40
          const d = `M${C},${C} L${C + Math.cos(a0) * big},${C + Math.sin(a0) * big} A${big},${big} 0 0 1 ${C + Math.cos(a1) * big},${C + Math.sin(a1) * big} Z`
          return <path key={cr.id} d={d} className="radar-hit" onMouseEnter={() => setActif(i)} onClick={() => setActif(i)}><title>{cr.label}</title></path>
        })}
      </svg>
      <figcaption>
        <ul className="radar-legend">
          {visibles.map((s) => (
            <li key={s.id}><span className={`key key-${s.variante}`} aria-hidden="true" />{s.label}</li>
          ))}
        </ul>
        <p className="radar-detail" aria-live="polite">
          {c ? (
            <>
              <strong>{c.icon} {c.label}</strong>
              {visibles.map((s) => <span key={s.id}>{s.label} : <b>{s.notes[c.id] || '—'}</b></span>)}
            </>
          ) : (
            <span className="muted">Survolez ou touchez un critère pour voir les notes.</span>
          )}
        </p>
      </figcaption>
    </figure>
  )
}
