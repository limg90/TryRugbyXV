import { useRef, useState } from 'react'
import Pitch, { makeProject, makeUnproject } from '../Pitch.jsx'
import PlayerToken from '../PlayerToken.jsx'
import Ball from '../Ball.jsx'
import { POSITIONS } from '../../data/positions.js'
import { useMediaQuery } from '../../lib/useMediaQuery.js'
import Retour from './Retour.jsx'

const groupeDe = (n) => POSITIONS.find((p) => p.numero === n)?.groupe ?? 'arrieres'
const dansZone = ([x, y], z) => x >= z.x[0] && x <= z.x[1] && y >= z.y[0] && y <= z.y[1]

// Positionnement sur le terrain : cliquer sur le bon joueur (mode 'joueur')
// ou sur le bon endroit (mode 'zone', puis Valider).
export default function QuestionTerrain({ q, onAnswer }) {
  const vertical = useMediaQuery('(max-width: 720px)')
  const svgRef = useRef(null)
  const [choix, setChoix] = useState(null) // { equipe, numero } ou [x, y]
  const [valide, setValide] = useState(false)
  const { players = {}, opponents = {}, ball, zoom } = q.situation
  const project = makeProject(vertical)

  const juste = (c) => (q.mode === 'joueur'
    ? c?.equipe === q.bonne.equipe && c?.numero === q.bonne.numero
    : c != null && dansZone(c, q.zone))

  const choisirJoueur = (equipe, numero) => {
    if (valide || q.mode !== 'joueur') return
    const c = { equipe, numero }
    setChoix(c)
    setValide(true)
    onAnswer(juste(c))
  }

  const onClick = (e) => {
    if (valide || q.mode !== 'zone') return
    const svg = svgRef.current
    const ctm = svg?.getScreenCTM()
    if (!ctm) return
    const pt = svg.createSVGPoint()
    pt.x = e.clientX
    pt.y = e.clientY
    const p = pt.matrixTransform(ctm.inverse())
    setChoix(makeUnproject(vertical)(p.x, p.y))
  }

  const valider = () => {
    setValide(true)
    onAnswer(juste(choix))
  }

  let zoneRect = null
  if (q.mode === 'zone' && valide) {
    const [ax, ay] = project(q.zone.x[0], q.zone.y[0])
    const [bx, by] = project(q.zone.x[1], q.zone.y[1])
    zoneRect = <rect className="quiz-zone" x={Math.min(ax, bx)} y={Math.min(ay, by)} width={Math.abs(bx - ax)} height={Math.abs(by - ay)} />
  }
  let marque = null
  if (q.mode === 'zone' && choix) {
    const [mx, my] = project(choix[0], choix[1])
    marque = (
      <g className={`quiz-marker${valide ? (juste(choix) ? ' is-right' : ' is-wrong') : ''}`} transform={`translate(${mx} ${my})`} aria-hidden="true">
        <circle r={2.2} />
        <path d="M-1.2 0H1.2M0 -1.2V1.2" />
      </g>
    )
  }
  const ballMap = ball?.team === 'adv' ? opponents : players
  const etatJoueur = (equipe, n) => {
    if (!valide || q.mode !== 'joueur') return {}
    if (q.bonne.equipe === equipe && q.bonne.numero === n) return { selected: true }
    if (choix?.equipe === equipe && choix?.numero === n) return { highlighted: true }
    return { dimmed: true }
  }

  return (
    <div className="quiz-q">
      <p className="quiz-question">{q.question}</p>
      <p className="muted">{q.mode === 'joueur' ? 'Touche un maillot sur le terrain.' : 'Touche le terrain pour placer ta marque, puis valide.'} Nous attaquons vers {vertical ? 'le haut' : 'la droite'}.</p>
      <div className={`pitch-wrap quiz-pitch${vertical ? ' is-vertical' : ''}${q.mode === 'zone' && !valide ? ' is-pickable' : ''}`}>
        <Pitch vertical={vertical} zoom={zoom} svgRef={svgRef} onClick={onClick} ariaLabel="Terrain du quiz">
          {zoneRect}
          {Object.entries(opponents).map(([n, [x, y]]) => (
            <PlayerToken key={`adv-${n}`} numero={Number(n)} x={x} y={y} groupe="adverse" duration={0} onSelect={() => choisirJoueur('adv', Number(n))} {...etatJoueur('adv', Number(n))} />
          ))}
          {Object.entries(players).map(([n, [x, y]]) => (
            <PlayerToken key={n} numero={Number(n)} x={x} y={y} groupe={groupeDe(Number(n))} duration={0} onSelect={() => choisirJoueur('nous', Number(n))} {...etatJoueur('nous', Number(n))} />
          ))}
          {ball && <Ball ball={ball} positions={ballMap} duration={0} />}
          {marque}
        </Pitch>
      </div>
      {q.mode === 'zone' && !valide && (
        <button type="button" className="btn btn-primary quiz-validate" disabled={!choix} onClick={valider}>Valider</button>
      )}
      {valide && <Retour ok={juste(choix)} texte={q.explication} />}
    </div>
  )
}
