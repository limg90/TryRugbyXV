import { useState } from 'react'
import Courbe from './Courbe.jsx'
import { Delta } from './Blocs.jsx'
import { CRITERES, FAMILLES, getPeriode } from '../../data/evaluation.js'
import { chronologique, moyenne, moyenneFamille, fmt, estRemplie } from '../../lib/analyse.js'
import { dateFr } from '../../lib/suivi.js'

// Courbe d'évolution (moyenne, famille ou critère) et historique des évaluations.
export default function Evolution({ evaluations, cibles, onOuvrir, onSupprimer, libelleAuteur }) {
  const [vue, setVue] = useState('moyenne')
  const evals = chronologique(evaluations).filter((e) => estRemplie(e.notes))
  if (!evals.length) return <p className="muted">Aucune évaluation enregistrée pour l’instant.</p>

  const famille = FAMILLES.find((f) => f.id === vue)
  const critere = CRITERES.find((c) => c.id === vue)
  const valeur = (notes) => (vue === 'moyenne' ? moyenne(notes) : famille ? moyenneFamille(notes, vue) : notes[vue] || null)
  const cible = vue === 'moyenne' ? moyenne(cibles) : famille ? moyenneFamille(cibles, vue) : cibles[vue]
  const points = evals.map((e) => ({
    id: e.id,
    label: dateFr(e.date, { day: 'numeric', month: 'short' }),
    detail: `${getPeriode(e.periode).label} · ${dateFr(e.date)}`,
    valeur: valeur(e.notes),
  }))
  const titreVue = vue === 'moyenne' ? 'Moyenne des 13 critères' : famille ? `Famille ${famille.label}` : critere.label

  return (
    <div className="evolution">
      <div className="evolution-head">
        <label className="field">
          <span className="field-label">Afficher</span>
          <select className="input" value={vue} onChange={(e) => setVue(e.target.value)}>
            <option value="moyenne">Moyenne générale</option>
            <optgroup label="Familles">{FAMILLES.map((f) => <option key={f.id} value={f.id}>{f.label}</option>)}</optgroup>
            <optgroup label="Critères">{CRITERES.map((c) => <option key={c.id} value={c.id}>{c.label}</option>)}</optgroup>
          </select>
        </label>
        <p className="muted">{titreVue} sur {evals.length} évaluation{evals.length > 1 ? 's' : ''}. La ligne pointillée est la cible du poste.</p>
      </div>
      <Courbe points={points} cible={cible} titre={`Évolution : ${titreVue}`} />

      <h3>Historique</h3>
      <ol className="historique">
        {[...evals].reverse().map((e, i, arr) => {
          const prec = arr[i + 1]
          const m = moyenne(e.notes)
          return (
            <li key={e.id}>
              <div>
                <strong>{getPeriode(e.periode).label}</strong>
                <span className="muted"> · {dateFr(e.date)}{libelleAuteur ? ` · ${libelleAuteur}` : ''}</span>
                {e.commentaire && <p className="historique-com">« {e.commentaire} »</p>}
              </div>
              <span className="historique-note">{fmt(m)}<small>/10</small></span>
              <Delta v={prec ? m - moyenne(prec.notes) : null} d={1} />
              <span className="btn-row">
                {onOuvrir && <button type="button" className="btn btn-ghost btn-sm" onClick={() => onOuvrir(e)}>Modifier</button>}
                {onSupprimer && <button type="button" className="btn btn-ghost btn-sm btn-danger" onClick={() => window.confirm('Supprimer cette évaluation ?') && onSupprimer(e.id)}>Supprimer</button>}
              </span>
            </li>
          )
        })}
      </ol>
    </div>
  )
}
