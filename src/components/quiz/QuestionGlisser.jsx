import { useRef, useState } from 'react'
import { melanger } from '../../data/quiz.js'
import Retour from './Retour.jsx'

// Glisser-déposer : on glisse chaque étiquette dans une case (souris ou doigt).
// Sans glisser, on peut aussi toucher une étiquette puis la case (et au clavier).
const SEUIL_DRAG = 6 // pixels avant de considérer qu'on glisse

export default function QuestionGlisser({ q, onAnswer }) {
  const [ordre] = useState(() => melanger(q.etiquettes.map((_, i) => i)))
  const [cases, setCases] = useState(() => q.cibles.map(() => null)) // index d'étiquette par case
  const [choisie, setChoisie] = useState(null)
  const [drag, setDrag] = useState(null) // { etiquette, x, y, actif }
  const [valide, setValide] = useState(false)
  const depart = useRef(null)

  const placees = new Set(cases.filter((c) => c != null))
  const libres = ordre.filter((i) => !placees.has(i))
  const complet = cases.every((c) => c != null)

  const poser = (etiquette, k) => {
    setCases((cs) => {
      const n = cs.map((c) => (c === etiquette ? null : c))
      n[k] = etiquette
      return n
    })
    setChoisie(null)
  }
  const retirer = (k) => setCases((cs) => cs.map((c, j) => (j === k ? null : c)))

  const onPointerDown = (e, etiquette) => {
    if (valide || e.button > 0) return
    depart.current = { x: e.clientX, y: e.clientY }
    e.currentTarget.setPointerCapture?.(e.pointerId)
    setDrag({ etiquette, x: e.clientX, y: e.clientY, actif: false })
  }
  const onPointerMove = (e) => {
    if (!drag) return
    const d = depart.current
    const actif = drag.actif || Math.hypot(e.clientX - d.x, e.clientY - d.y) > SEUIL_DRAG
    setDrag({ ...drag, x: e.clientX, y: e.clientY, actif })
  }
  const onPointerUp = (e) => {
    if (!drag) return
    const { etiquette, actif } = drag
    setDrag(null)
    if (!actif) {
      // Simple toucher : on sélectionne l'étiquette.
      setChoisie((c) => (c === etiquette ? null : etiquette))
      return
    }
    const cible = document.elementFromPoint(e.clientX, e.clientY)?.closest('[data-case]')
    if (cible) poser(etiquette, Number(cible.dataset.case))
  }

  const toucherCase = (k) => {
    if (valide) return
    if (choisie != null) poser(choisie, k)
    else if (cases[k] != null) retirer(k)
  }

  const valider = () => {
    setValide(true)
    onAnswer(cases.every((c, k) => c === k))
  }

  const etiquette = (i, extra = '') => (
    <button
      key={i}
      type="button"
      className={`dnd-chip${choisie === i ? ' is-on' : ''}${drag?.actif && drag.etiquette === i ? ' is-dragging' : ''}${extra}`}
      onPointerDown={(e) => onPointerDown(e, i)}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={() => setDrag(null)}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          setChoisie((c) => (c === i ? null : i))
        }
      }}
      disabled={valide}
      aria-pressed={choisie === i}
    >
      {q.etiquettes[i]}
    </button>
  )

  return (
    <div className="quiz-q">
      <p className="quiz-question">{q.question}</p>
      <p className="muted">Glisse chaque étiquette dans la bonne case, ou touche une étiquette puis une case.</p>
      <div className="dnd-pool" aria-label="Étiquettes à placer">
        {libres.length ? libres.map((i) => etiquette(i)) : <span className="muted">Toutes les étiquettes sont placées.</span>}
      </div>
      <ol className="dnd-cases">
        {q.cibles.map((cible, k) => {
          const e = cases[k]
          const etat = valide ? (e === k ? ' is-right' : ' is-wrong') : ''
          return (
            <li key={k} className={`dnd-case${etat}${choisie != null && !valide ? ' is-target' : ''}`} data-case={k}>
              <button type="button" className="dnd-label" onClick={() => toucherCase(k)} disabled={valide} aria-label={`Case ${cible}${e != null ? ` : ${q.etiquettes[e]}` : ', vide'}`}>
                {cible}
              </button>
              <div className="dnd-slot" onClick={() => toucherCase(k)}>
                {e != null ? <span className="dnd-chip is-placed">{q.etiquettes[e]}</span> : <span className="dnd-empty">Dépose ici</span>}
                {valide && e !== k && <span className="dnd-fix">Réponse : {q.etiquettes[k]}</span>}
              </div>
            </li>
          )
        })}
      </ol>
      {!valide && (
        <button type="button" className="btn btn-primary quiz-validate" disabled={!complet} onClick={valider}>Valider</button>
      )}
      {valide && <Retour ok={cases.every((c, k) => c === k)} texte={q.explication} />}
      {drag?.actif && (
        <span className="dnd-ghost" style={{ left: drag.x, top: drag.y }} aria-hidden="true">{q.etiquettes[drag.etiquette]}</span>
      )}
    </div>
  )
}
