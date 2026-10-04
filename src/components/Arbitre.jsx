// Arbitre dessiné au trait (SVG), dans le style des illustrations fournies :
// maillot blanc, short et chaussettes noirs, sifflet. Les bras sont décrits par deux angles
// (bras puis avant-bras, en degrés : 0 = vers la droite de l'écran, 90 = vers le bas, -90 = vers le haut).
// Les gestes sont dans data/signes.js (champ `dessin`).

const EPAULE = { g: [80, 62], d: [120, 62] }
const BRAS = 30
const AVANT_BRAS = 27
const REPOS = { g: { a: 100, b: 95 }, d: { a: 80, b: 85 } }

const BUTT = { strokeLinecap: 'butt' }
const rad = (deg) => (deg * Math.PI) / 180
const pt = ([x, y], deg, len) => [x + Math.cos(rad(deg)) * len, y + Math.sin(rad(deg)) * len]

function Main({ at, angle, forme }) {
  const [x, y] = at
  if (forme === 'pointe') {
    const [px, py] = pt(at, angle, 9)
    return (
      <g>
        <line x1={x} y1={y} x2={px} y2={py} className="arb-out" strokeWidth="6" />
        <line x1={x} y1={y} x2={px} y2={py} className="arb-in" strokeWidth="2.6" />
        <circle cx={x} cy={y} r="5.2" className="arb-skin" />
      </g>
    )
  }
  if (forme === 'ouverte') {
    const [cx, cy] = pt(at, angle, 3.5)
    return <ellipse cx={cx} cy={cy} rx="7.5" ry="4.6" transform={`rotate(${angle} ${cx} ${cy})`} className="arb-skin" />
  }
  return <circle cx={x} cy={y} r="5.4" className="arb-skin" />
}

function Bras({ cote, a, b, main = 'ouverte' }) {
  const s = EPAULE[cote]
  const coude = pt(s, a, BRAS)
  const poignet = pt(coude, b, AVANT_BRAS)
  const manche = pt(s, a, 13)
  const d = `M${s[0]} ${s[1]} L${coude[0]} ${coude[1]} L${poignet[0]} ${poignet[1]}`
  return (
    <g>
      <path d={d} className="arb-out" strokeWidth="11" />
      <path d={d} className="arb-in" strokeWidth="6.4" />
      <line x1={s[0]} y1={s[1]} x2={manche[0]} y2={manche[1]} className="arb-out" strokeWidth="16" style={BUTT} />
      <line x1={s[0]} y1={s[1]} x2={manche[0]} y2={manche[1]} className="arb-in" strokeWidth="11.5" style={BUTT} />
      <line x1={manche[0]} y1={manche[1]} x2={pt(s, a, 15)[0]} y2={pt(s, a, 15)[1]} className="arb-out" strokeWidth="14" style={BUTT} />
      <Main at={poignet} angle={b} forme={main} />
    </g>
  )
}

function Corps() {
  return (
    <g>
      {/* Jambes, chaussettes et crampons */}
      {[[89, 84], [111, 116]].map(([h, b]) => (
        <g key={h}>
          <line x1={h} y1="140" x2={b} y2="208" className="arb-out" strokeWidth="13" />
          <line x1={h} y1="140" x2={(h + b) / 2} y2="176" className="arb-in" strokeWidth="8.6" />
          <line x1={(h + b) / 2 + (b - h) * 0.03} y1="178" x2={b} y2="208" className="arb-ink" strokeWidth="11" />
          <line x1={(h + b) / 2 - 5.5} y1="183" x2={(h + b) / 2 + 5.5} y2="183" className="arb-stripe" />
          <ellipse cx={b + (b < 100 ? -4 : 4)} cy="211" rx="10" ry="5" className="arb-ink" />
          <path d={`M${b - 3} 209 l3 -4 M${b + 1} 210 l3 -4`} className="arb-stripe" />
        </g>
      ))}
      {/* Short */}
      <path d="M77 108 L123 108 L128 144 L104 146 L100 130 L96 146 L72 144 Z" className="arb-ink" />
      <path d="M84 114 l6 24 M114 116 l-3 18" className="arb-shine" />
      {/* Maillot */}
      <path d="M81 57 Q100 52 119 57 L124 112 Q100 116 76 112 Z" className="arb-shirt" />
      <path d="M91 55 L100 66 L109 55 L104 53 L100 58 L96 53 Z" className="arb-ink" />
      <path d="M108 74 h8 v7 q-4 4 -8 0 z" className="arb-badge" />
      <path d="M95 60 Q100 74 104 60" className="arb-cord" />
      {/* Tête */}
      <rect x="95" y="44" width="10" height="11" className="arb-skin" />
      <circle cx="100" cy="34" r="14.5" className="arb-skin" />
      <path d="M86 32 Q85 16 100 16 Q116 15 115 31 L111 24 L106 27 L101 22 L95 27 L91 23 Z" className="arb-ink" />
      <circle cx="95" cy="34" r="1.4" className="arb-dot" />
      <circle cx="105" cy="34" r="1.4" className="arb-dot" />
      <rect x="97" y="40" width="7" height="4" rx="1.5" className="arb-whistle" />
    </g>
  )
}

const CARTON = { jaune: '#f3c623', rouge: '#d63a2c', bleu: '#2b6fd6' }

function Accessoire({ acc, mains }) {
  if (acc.type === 'carton') {
    const [x, y] = mains.d
    return <rect x={x - 6} y={y - 22} width="13" height="18" rx="1.5" fill={CARTON[acc.couleur]} className="arb-prop" />
  }
  if (acc.type === 'drapeau') {
    const [x, y] = mains.d
    return (
      <g>
        <line x1={x} y1={y + 4} x2={x} y2={y - 34} className="arb-out" strokeWidth="2.6" />
        <path d={`M${x} ${y - 34} h20 v13 h-20 z`} fill="#f3c623" className="arb-prop" />
        <path d={`M${x} ${y - 34} h10 v6.5 h-10 z M${x + 10} ${y - 27.5} h10 v6.5 h-10 z`} fill="#d63a2c" />
      </g>
    )
  }
  if (acc.type === 'ballon') {
    const [x, y] = acc.at
    return (
      <g>
        <ellipse cx={x} cy={y} rx={acc.rx ?? 12} ry={acc.ry ?? 7.5} transform={`rotate(${acc.rot ?? 0} ${x} ${y})`} className={acc.fantome ? 'arb-ghost' : 'arb-ball'} />
        {!acc.fantome && <path d={`M${x - 5} ${y} h10 M${x - 2} ${y - 2} v4 M${x + 2} ${y - 2} v4`} transform={`rotate(${acc.rot ?? 0} ${x} ${y})`} className="arb-seam" />}
      </g>
    )
  }
  if (acc.type === 'ecran') {
    const [x1, y1, x2, y2] = acc.rect
    return <rect x={x1} y={y1} width={x2 - x1} height={y2 - y1} rx="3" className="arb-ghost-rect" />
  }
  return null
}

const mainDe = (cote, pose) => {
  const { a, b } = pose ?? REPOS[cote]
  return pt(pt(EPAULE[cote], a, BRAS), b, AVANT_BRAS)
}

// pose : { g, d, accessoires (dessus: devant les bras), mouvement: [chemins SVG], fleches: [chemins SVG] }
export default function Arbitre({ pose, titre }) {
  const g = { ...REPOS.g, main: 'poing', ...pose.g }
  const d = { ...REPOS.d, main: 'poing', ...pose.d }
  const mains = { g: mainDe('g', g), d: mainDe('d', d) }
  const acc = pose.accessoires ?? []
  return (
    <svg viewBox="0 -24 200 248" className="arbitre" role="img" aria-label={titre}>
      <path d="M58 216 q4-5 6 0 M72 218 q3-4 5 0 M126 218 q3-4 5 0 M140 216 q4-5 6 0" className="arb-grass" />
      <Corps />
      {acc.filter((x) => !x.dessus).map((x, i) => <Accessoire key={i} acc={x} mains={mains} />)}
      <Bras cote="g" {...g} />
      <Bras cote="d" {...d} />
      {acc.filter((x) => x.dessus).map((x, i) => <Accessoire key={`h${i}`} acc={x} mains={mains} />)}
      {(pose.mouvement ?? []).map((m) => <path key={m} d={m} className="arb-motion" />)}
      {(pose.fleches ?? []).map((m) => <path key={m} d={m} className="arb-arrow" markerEnd="url(#arb-pointe)" />)}
      <defs>
        <marker id="arb-pointe" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse">
          <path d="M0 0 L10 5 L0 10 z" className="arb-arrowhead" />
        </marker>
      </defs>
    </svg>
  )
}
