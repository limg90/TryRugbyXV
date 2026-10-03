import { useEffect, useMemo, useRef, useState } from 'react'
import Pitch, { makeUnproject } from '../components/Pitch.jsx'
import PlayerToken from '../components/PlayerToken.jsx'
import Ball from '../components/Ball.jsx'
import Trails, { TrailDefs } from '../components/Trails.jsx'
import ScenarioStage from '../components/ScenarioStage.jsx'
import Transport from '../components/Transport.jsx'
import { POSITIONS } from '../data/positions.js'
import { MODELES } from '../data/formations.js'
import { buildFrames, useScenario } from '../engine/useScenario.js'
import { useMediaQuery } from '../lib/useMediaQuery.js'
import { load, save } from '../lib/storage.js'

// Éditeur de combinaisons : on place les joueurs, on ajoute des étapes en les déplaçant,
// on donne le ballon, puis on rejoue l'animation. Enregistrement dans le stockage local.
//
// Brouillon : { id, titre, steps: [{ duration, caption, players, opponents, ball }] }
// Chaque étape garde les positions complètes, ce qui la rend lisible par buildFrames.

export const CLE_BROUILLON = 'rugbyapp.editeur.brouillon'
const CLE_LISTE = 'rugbyapp.combinaisons'
const DUREES = [0.6, 1, 1.5, 2, 3]

const brouillonDepuisModele = (m) => ({
  id: null,
  titre: 'Ma combinaison',
  steps: [{ duration: 0, caption: 'Placement de départ.', players: { ...m.players }, opponents: { ...m.opponents }, ball: m.ball }],
})

export function brouillonDepuisScenario(s) {
  return {
    id: null,
    titre: `${s.titre} (ma version)`,
    steps: buildFrames(s).map((f) => ({ duration: f.duration, caption: f.caption, players: f.positions, opponents: f.opponents, ball: f.ball })),
  }
}

const versScenario = (d) => ({ id: 'brouillon', titre: d.titre, steps: d.steps.map((s) => ({ ...s, caption: s.caption || ' ' })) })

// Cadre qui contient tous les joueurs de toutes les étapes, avec une marge.
function cadrer(d) {
  let x0 = Infinity, x1 = -Infinity, y0 = Infinity, y1 = -Infinity
  for (const s of d.steps) {
    for (const [x, y] of [...Object.values(s.players), ...Object.values(s.opponents)]) {
      x0 = Math.min(x0, x); x1 = Math.max(x1, x); y0 = Math.min(y0, y); y1 = Math.max(y1, y)
    }
  }
  if (x0 === Infinity) return null
  const m = 7
  const box = { x: [Math.max(-13, x0 - m), Math.min(113, x1 + m)], y: [Math.max(-3, y0 - m), Math.min(73, y1 + m)] }
  // Taille minimale pour garder des maillots à une échelle raisonnable.
  for (const k of ['x', 'y']) {
    const [a, b] = box[k]
    if (b - a < 34) {
      const c = (a + b) / 2
      box[k] = [c - 17, c + 17]
    }
  }
  return box
}

const clamp = (v, a, b) => Math.max(a, Math.min(b, v))
const round = (v) => Math.round(v * 2) / 2

function MesCombinaisons({ liste, courant, onOuvrir, onSupprimer }) {
  if (liste.length === 0) return <p className="muted">Aucune combinaison enregistrée pour l’instant.</p>
  return (
    <ul className="mes-combis">
      {liste.map((c) => (
        <li key={c.id} className={c.id === courant ? 'is-on' : ''}>
          <button type="button" className="link-btn" onClick={() => onOuvrir(c)}>{c.titre}</button>
          <span className="muted">{c.steps.length} étape{c.steps.length > 1 ? 's' : ''}</span>
          <button type="button" className="icon-btn" aria-label={`Supprimer ${c.titre}`} onClick={() => onSupprimer(c)}>×</button>
        </li>
      ))}
    </ul>
  )
}

export default function Editeur() {
  const vertical = useMediaQuery('(max-width: 720px)')
  const [draft, setDraft] = useState(() => load(CLE_BROUILLON, null) ?? brouillonDepuisModele(MODELES[0]))
  const [stepIndex, setStepIndex] = useState(0)
  const [mode, setMode] = useState('edition')
  const [outil, setOutil] = useState('deplacer')
  const [selected, setSelected] = useState(null) // { team: 'nous' | 'adv', n }
  const [liste, setListe] = useState(() => load(CLE_LISTE, []))
  const [message, setMessage] = useState('')
  const [cadre, setCadre] = useState(() => cadrer(draft))
  const [speed, setSpeed] = useState(1)
  const [dragging, setDragging] = useState(null)
  const svgRef = useRef(null)

  const scenario = useMemo(() => versScenario(draft), [draft])
  const frames = useMemo(() => buildFrames(scenario), [scenario])
  const player = useScenario(scenario, { speed })
  const idx = Math.min(stepIndex, draft.steps.length - 1)
  const step = draft.steps[idx]
  const unproject = makeUnproject(vertical)

  // Le brouillon survit à un rechargement de la page.
  useEffect(() => save(CLE_BROUILLON, draft), [draft])
  useEffect(() => {
    if (!message) return
    const t = setTimeout(() => setMessage(''), 2500)
    return () => clearTimeout(t)
  }, [message])

  const remplacer = (d) => {
    setDraft(d)
    setStepIndex(0)
    setSelected(null)
    setMode('edition')
    setCadre(cadrer(d))
  }
  const majEtape = (patch) => setDraft((d) => ({ ...d, steps: d.steps.map((s, k) => (k === idx ? { ...s, ...patch } : s)) }))
  const deplacer = (team, n, pos) => {
    const key = team === 'adv' ? 'opponents' : 'players'
    setDraft((d) => ({ ...d, steps: d.steps.map((s, k) => (k === idx ? { ...s, [key]: { ...s[key], [n]: pos } } : s)) }))
  }
  const donnerBallon = (team, n) => majEtape({ ball: team === 'adv' ? { carrier: n, team: 'adv' } : { carrier: n } })

  const ajouterEtape = () => {
    setDraft((d) => {
      const s = d.steps[idx]
      const copie = { ...s, duration: 1, caption: '' }
      return { ...d, steps: [...d.steps.slice(0, idx + 1), copie, ...d.steps.slice(idx + 1)] }
    })
    setStepIndex(idx + 1)
  }
  const supprimerEtape = () => {
    if (draft.steps.length < 2) return
    setDraft((d) => {
      const steps = d.steps.filter((_, k) => k !== idx)
      steps[0] = { ...steps[0], duration: 0 }
      return { ...d, steps }
    })
    setStepIndex(Math.max(0, idx - 1))
  }
  const ajouterDefenseur = () => {
    const pris = new Set(Object.keys(step.opponents).map(Number))
    const n = [...Array(15).keys()].map((k) => k + 1).find((k) => !pris.has(k))
    if (!n) return
    const pos = [clamp(round((cadre ? (cadre.x[0] + cadre.x[1]) / 2 : 60) + 6), 0, 100), 35]
    setDraft((d) => ({ ...d, steps: d.steps.map((s) => ({ ...s, opponents: { ...s.opponents, [n]: s.opponents[n] ?? pos } })) }))
    setSelected({ team: 'adv', n })
  }
  const retirerDefenseur = () => {
    if (selected?.team !== 'adv') return
    const n = selected.n
    setDraft((d) => ({
      ...d,
      steps: d.steps.map((s) => {
        const opponents = { ...s.opponents }
        const pos = opponents[n]
        delete opponents[n]
        const ball = s.ball?.team === 'adv' && s.ball.carrier === n ? { at: pos } : s.ball
        return { ...s, opponents, ball }
      }),
    }))
    setSelected(null)
  }

  const enregistrer = () => {
    const id = draft.id ?? `perso-${Date.now()}`
    const d = { ...draft, id, titre: draft.titre.trim() || 'Ma combinaison' }
    const next = liste.some((c) => c.id === id) ? liste.map((c) => (c.id === id ? d : c)) : [...liste, d]
    setDraft(d)
    setListe(next)
    save(CLE_LISTE, next)
    setMessage('Combinaison enregistrée sur cet appareil.')
  }
  const supprimer = (c) => {
    if (!window.confirm(`Supprimer « ${c.titre} » ?`)) return
    const next = liste.filter((x) => x.id !== c.id)
    setListe(next)
    save(CLE_LISTE, next)
    if (draft.id === c.id) setDraft((d) => ({ ...d, id: null }))
  }

  // ---- Glisser-déposer sur le terrain
  const versTerrain = (e) => {
    const svg = svgRef.current
    const ctm = svg?.getScreenCTM()
    if (!ctm) return null
    const pt = svg.createSVGPoint()
    pt.x = e.clientX
    pt.y = e.clientY
    const p = pt.matrixTransform(ctm.inverse())
    const [x, y] = unproject(p.x, p.y)
    return [round(clamp(x, -9, 109)), round(clamp(y, -2, 72))]
  }
  const toucher = (team, n) => (e) => {
    if (mode !== 'edition') return
    e.preventDefault()
    if (outil === 'ballon') {
      donnerBallon(team, n)
      return
    }
    setSelected({ team, n })
    setDragging({ team, n })
    svgRef.current?.setPointerCapture?.(e.pointerId)
  }
  const onPointerMove = (e) => {
    if (!dragging) return
    const pos = versTerrain(e)
    if (pos) deplacer(dragging.team, dragging.n, pos)
  }
  const finDrag = () => setDragging(null)
  const onKeyDown = (e) => {
    if (!selected || mode !== 'edition') return
    const d = { ArrowRight: [1, 0], ArrowLeft: [-1, 0], ArrowDown: [0, 1], ArrowUp: [0, -1] }[e.key]
    if (!d) return
    e.preventDefault()
    const map = selected.team === 'adv' ? step.opponents : step.players
    const cur = map[selected.n]
    if (!cur) return
    // Les flèches suivent l'écran : en vertical, « haut » veut dire vers l'en-but adverse.
    const [dx, dy] = vertical ? [-d[1], d[0]] : d
    deplacer(selected.team, selected.n, [clamp(cur[0] + dx, -9, 109), clamp(cur[1] + dy, -2, 72)])
  }
  const choisirClavier = (team) => (n) => (outil === 'ballon' ? donnerBallon(team, n) : setSelected({ team, n }))

  const ballMap = step.ball?.team === 'adv' ? step.opponents : step.players
  const isSel = (team, n) => selected?.team === team && selected.n === n

  return (
    <div className="editeur">
      <header className="view-head">
        <div>
          <p className="eyebrow">Mon éditeur</p>
          <h1>Dessiner une combinaison</h1>
          <p className="lede">Placez les joueurs, ajoutez une étape, faites-les glisser vers leur nouvelle position et donnez le ballon. Puis rejouez l’animation.</p>
        </div>
      </header>

      <div className="terrain-layout">
        <div className="terrain-stage">
          {mode === 'edition' ? (
            <>
              <div className="controls">
                <div className="seg" role="radiogroup" aria-label="Outil">
                  <button type="button" role="radio" aria-checked={outil === 'deplacer'} className={`chip${outil === 'deplacer' ? ' is-on' : ''}`} onClick={() => setOutil('deplacer')}>Déplacer</button>
                  <button type="button" role="radio" aria-checked={outil === 'ballon'} className={`chip${outil === 'ballon' ? ' is-on' : ''}`} onClick={() => setOutil('ballon')}>Donner le ballon</button>
                </div>
                <label className="toggle">
                  <input type="checkbox" checked={!!cadre} onChange={(e) => setCadre(e.target.checked ? cadrer(draft) : null)} />
                  <span>Zoom sur les joueurs</span>
                </label>
                <button type="button" className="btn btn-primary edit-play" onClick={() => { setMode('lecture'); player.play() }} disabled={draft.steps.length < 2}>Rejouer l’animation</button>
              </div>
              <div className={`pitch-wrap${vertical ? ' is-vertical' : ''}`} onKeyDown={onKeyDown}>
                <Pitch
                  vertical={vertical}
                  zoom={cadre}
                  svgRef={svgRef}
                  className="pitch-edit"
                  ariaLabel={`Éditeur, étape ${idx + 1}`}
                  onPointerMove={onPointerMove}
                  onPointerUp={finDrag}
                  onPointerCancel={finDrag}
                >
                  <TrailDefs />
                  <Trails frames={frames} index={idx} duration={0} />
                  {Object.entries(step.opponents).map(([n, [x, y]]) => (
                    <PlayerToken key={`adv-${n}`} numero={Number(n)} x={x} y={y} groupe="adverse" selected={isSel('adv', Number(n))} duration={dragging ? 0 : 0.35} onSelect={choisirClavier('adv')} onPointerDown={toucher('adv', Number(n))} />
                  ))}
                  {POSITIONS.map((p) => {
                    const pos = step.players[p.numero]
                    if (!pos) return null
                    return (
                      <PlayerToken key={p.numero} numero={p.numero} nom={p.nom} x={pos[0]} y={pos[1]} groupe={p.groupe} selected={isSel('nous', p.numero)} duration={dragging ? 0 : 0.35} onSelect={choisirClavier('nous')} onPointerDown={toucher('nous', p.numero)} />
                    )
                  })}
                  <Ball ball={step.ball} positions={ballMap} duration={dragging ? 0 : 0.35} />
                </Pitch>
              </div>
              <p className="muted">
                {outil === 'ballon' ? 'Touchez le joueur qui reçoit le ballon à cette étape.' : 'Faites glisser un maillot. Au clavier : sélectionnez un joueur puis utilisez les flèches.'}
                {idx > 0 && ' Les flèches montrent le chemin depuis l’étape précédente.'}
              </p>
            </>
          ) : (
            <>
              <div className="controls">
                <Transport player={player} speed={speed} onSpeed={setSpeed} />
                <button type="button" className="btn btn-ghost" onClick={() => { player.pause(); setMode('edition') }}>Retour à l’édition</button>
              </div>
              <div className={`pitch-wrap${vertical ? ' is-vertical' : ''}`}>
                <ScenarioStage frames={player.frames} index={player.index} transitionDuration={player.transitionDuration} vertical={vertical} zoom={cadre} ariaLabel={`Animation : ${draft.titre}`} />
              </div>
              <div className="caption" aria-live="polite">
                <span className="caption-step">{`${player.index + 1}/${player.count}`}</span>
                <p>{player.frame.caption}</p>
              </div>
            </>
          )}
        </div>

        <aside className="panel editeur-panel">
          <label className="field">
            <span className="field-label">Nom</span>
            <input className="input" value={draft.titre} onChange={(e) => setDraft((d) => ({ ...d, titre: e.target.value }))} />
          </label>

          <div>
            <h3>Étapes</h3>
            <ol className="steps" aria-label="Étapes">
              {draft.steps.map((_, k) => (
                <li key={k}>
                  <button type="button" className={k === idx ? 'is-on' : ''} aria-current={k === idx ? 'step' : undefined} onClick={() => { setMode('edition'); setStepIndex(k) }}>{k + 1}</button>
                </li>
              ))}
              <li><button type="button" className="step-add" onClick={ajouterEtape} aria-label="Ajouter une étape après celle-ci">+</button></li>
            </ol>
          </div>

          <label className="field">
            <span className="field-label">Texte de l’étape {idx + 1}</span>
            <textarea className="input" rows={3} value={step.caption} placeholder="Ex. : le 9 passe au 10, qui attaque la ligne." onChange={(e) => majEtape({ caption: e.target.value })} />
          </label>
          {idx > 0 && (
            <div className="field">
              <span className="field-label">Durée du mouvement</span>
              <div className="seg" role="radiogroup" aria-label="Durée">
                {DUREES.map((s) => (
                  <button key={s} type="button" role="radio" aria-checked={step.duration === s} className={`chip${step.duration === s ? ' is-on' : ''}`} onClick={() => majEtape({ duration: s })}>{String(s).replace('.', ',')} s</button>
                ))}
              </div>
            </div>
          )}
          <div className="btn-row">
            <button type="button" className="btn btn-ghost" onClick={ajouterEtape}>Ajouter une étape</button>
            <button type="button" className="btn btn-ghost" onClick={supprimerEtape} disabled={draft.steps.length < 2}>Supprimer l’étape</button>
          </div>

          <div>
            <h3>Défenseurs</h3>
            <div className="btn-row">
              <button type="button" className="btn btn-ghost" onClick={ajouterDefenseur} disabled={Object.keys(step.opponents).length >= 15}>Ajouter</button>
              <button type="button" className="btn btn-ghost" onClick={retirerDefenseur} disabled={selected?.team !== 'adv'}>Retirer le défenseur choisi</button>
            </div>
          </div>

          <div className="btn-row">
            <button type="button" className="btn btn-primary" onClick={enregistrer}>Enregistrer</button>
            <label className="field field-inline">
              <span className="sr-only">Nouvelle combinaison</span>
              <select value="" onChange={(e) => { const m = MODELES.find((x) => x.id === e.target.value); if (m) remplacer(brouillonDepuisModele(m)) }}>
                <option value="" disabled>Nouvelle à partir de…</option>
                {MODELES.map((m) => <option key={m.id} value={m.id}>{m.titre}</option>)}
              </select>
            </label>
          </div>
          <p className="save-msg" role="status">{message}</p>

          <div>
            <h3>Mes combinaisons</h3>
            <MesCombinaisons liste={liste} courant={draft.id} onOuvrir={(c) => remplacer(c)} onSupprimer={supprimer} />
          </div>
        </aside>
      </div>
    </div>
  )
}
