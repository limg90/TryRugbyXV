import { useEffect, useRef, useState } from 'react'
import { fmt } from '../../lib/analyse.js'

// Évolution d'une note (0 à 10) au fil des évaluations, avec la cible du poste en pointillés.
// points : [{ id, label (date courte), detail (période), valeur | null }]
// La largeur suit celle du conteneur pour garder des textes lisibles sur téléphone.
const H = 260
const M = { l: 34, r: 16, t: 14, b: 34 }
const y = (v) => M.t + (H - M.t - M.b) * (1 - v / 10)

export default function Courbe({ points, cible, titre }) {
  const [actif, setActif] = useState(null)
  const ref = useRef(null)
  const [W, setW] = useState(640)
  useEffect(() => {
    const el = ref.current
    if (!el || typeof ResizeObserver === 'undefined') return
    const ro = new ResizeObserver(([e]) => setW(Math.max(280, Math.round(e.contentRect.width))))
    ro.observe(el)
    return () => ro.disconnect()
  }, [])
  const n = points.length
  const x = (i) => (n === 1 ? (M.l + W - M.r) / 2 : M.l + ((W - M.l - M.r) * i) / (n - 1))
  const notes = points.map((p, i) => ({ ...p, i })).filter((p) => p.valeur != null)
  const chemin = notes.map((p, k) => `${k ? 'L' : 'M'}${x(p.i)},${y(p.valeur)}`).join(' ')
  const pas = Math.max(1, Math.ceil(n / Math.max(2, Math.floor(W / 90))))
  const a = actif != null ? points[actif] : null

  return (
    <figure className="courbe" ref={ref}>
      <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label={titre} onMouseLeave={() => setActif(null)}>
        {[0, 2, 4, 6, 8, 10].map((v) => (
          <g key={v} className="courbe-grid">
            <line x1={M.l} x2={W - M.r} y1={y(v)} y2={y(v)} />
            <text x={M.l - 8} y={y(v) + 4} textAnchor="end">{v}</text>
          </g>
        ))}
        {cible != null && (
          <g className="courbe-cible">
            <line x1={M.l} x2={W - M.r} y1={y(cible)} y2={y(cible)} />
            <text x={M.l + 6} y={y(cible) - 6}>Cible {fmt(cible)}</text>
          </g>
        )}
        {points.map((p, i) => (i % pas === 0 || i === n - 1) && (
          <text key={p.id} className="courbe-x" x={x(i)} y={H - 10} textAnchor={n > 1 && i === 0 ? 'start' : n > 1 && i === n - 1 ? 'end' : 'middle'}>{p.label}</text>
        ))}
        {actif != null && <line className="courbe-cross" x1={x(actif)} x2={x(actif)} y1={M.t} y2={H - M.b} />}
        <path className="courbe-ligne" d={chemin} />
        {notes.map((p) => (
          <circle key={p.id} className="courbe-point" cx={x(p.i)} cy={y(p.valeur)} r={actif === p.i ? 6.5 : 4.5} />
        ))}
        {notes.at(-1) && (
          <text className="courbe-val" x={x(notes.at(-1).i)} y={y(notes.at(-1).valeur) - 12} textAnchor={n > 1 ? 'end' : 'middle'}>{fmt(notes.at(-1).valeur)}</text>
        )}
        {points.map((p, i) => {
          const w = n === 1 ? W : (W - M.l - M.r) / (n - 1)
          return <rect key={p.id} className="courbe-hit" x={x(i) - w / 2} y={0} width={w} height={H} onMouseEnter={() => setActif(i)} onClick={() => setActif(i)} />
        })}
      </svg>
      <figcaption className="radar-detail" aria-live="polite">
        {a ? (
          <>
            <strong>{a.detail}</strong>
            <span>Note : <b>{fmt(a.valeur)}</b></span>
            {cible != null && a.valeur != null && <span>Écart à la cible : <b>{a.valeur - cible >= 0 ? '+' : '−'}{fmt(Math.abs(a.valeur - cible))}</b></span>}
          </>
        ) : (
          <span className="muted">Survolez ou touchez un point pour le détail.</span>
        )}
      </figcaption>
    </figure>
  )
}
