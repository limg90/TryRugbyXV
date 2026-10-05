import { useState } from 'react'
import { SaisieNotes } from './Blocs.jsx'
import { CRITERES, PERIODES } from '../../data/evaluation.js'
import { estRemplie } from '../../lib/analyse.js'
import { aujourdhui, nouvelId } from '../../lib/suivi.js'

// Formulaire d'évaluation (coach) ou d'auto-évaluation (joueur).
// « depart » : évaluation à modifier, ou notes de la dernière évaluation pour pré-remplir.
export default function FormEvaluation({ depart, modification, cibles, onEnregistrer, onAnnuler, auto }) {
  const [ev, setEv] = useState(() => ({
    id: modification ? depart.id : nouvelId(),
    date: modification ? depart.date : aujourdhui(),
    periode: modification ? depart.periode : 'libre',
    commentaire: modification ? depart.commentaire ?? '' : '',
    cree: modification ? depart.cree : Date.now(),
    notes: { ...Object.fromEntries(CRITERES.map((c) => [c.id, 0])), ...(depart?.notes ?? {}) },
  }))
  const [msg, setMsg] = useState('')
  const complete = CRITERES.every((c) => ev.notes[c.id] > 0)
  const valider = (e) => {
    e.preventDefault()
    if (!estRemplie(ev.notes)) {
      setMsg('Notez au moins un critère.')
      return
    }
    onEnregistrer(ev)
  }

  return (
    <form className="form-eval" onSubmit={valider}>
      <div className="form-eval-head">
        <label className="field">
          <span className="field-label">Moment de la saison</span>
          <span className="seg">
            {PERIODES.map((p) => (
              <button key={p.id} type="button" className={`chip${ev.periode === p.id ? ' is-on' : ''}`} aria-pressed={ev.periode === p.id} onClick={() => setEv({ ...ev, periode: p.id })}>{p.label}</button>
            ))}
          </span>
        </label>
        <label className="field">
          <span className="field-label">Date</span>
          <input className="input" type="date" value={ev.date} max={aujourdhui()} onChange={(e) => setEv({ ...ev, date: e.target.value || aujourdhui() })} required />
        </label>
      </div>
      {!modification && depart?.notes && <p className="tip-line">Les curseurs reprennent {auto ? 'ta' : 'la'} dernière évaluation : ajustez seulement ce qui a changé.</p>}
      <SaisieNotes notes={ev.notes} cibles={cibles} onChange={(notes) => { setEv({ ...ev, notes }); setMsg('') }} />
      <label className="field">
        <span className="field-label">{auto ? 'Mon ressenti (facultatif)' : 'Commentaire du coach (facultatif)'}</span>
        <textarea className="input" rows="3" value={ev.commentaire} onChange={(e) => setEv({ ...ev, commentaire: e.target.value })} placeholder={auto ? 'Ce qui a bien marché, ce qui me bloque…' : 'Observations, contexte du match, blessure…'} />
      </label>
      <div className="btn-row">
        <button type="submit" className="btn btn-primary">{modification ? 'Enregistrer les modifications' : 'Enregistrer l’évaluation'}</button>
        {onAnnuler && <button type="button" className="btn btn-ghost" onClick={onAnnuler}>Annuler</button>}
        <span className="muted">{complete ? '13 critères notés' : `${CRITERES.filter((c) => ev.notes[c.id] > 0).length}/13 critères notés`}</span>
        {msg && <span className="form-err" role="alert">{msg}</span>}
      </div>
    </form>
  )
}
