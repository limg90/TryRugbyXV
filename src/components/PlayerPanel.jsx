import { href } from '../lib/router.js'
import { GROUPES } from '../data/positions.js'

// Aperçu d'un poste affiché à côté du terrain quand on clique un joueur.
export default function PlayerPanel({ position, onClose }) {
  if (!position) {
    return (
      <aside className="panel panel-empty">
        <p className="eyebrow">Touchez un joueur</p>
        <p>Chaque maillot porte son numéro officiel. Touchez-en un pour voir son poste et ses missions.</p>
      </aside>
    )
  }
  const p = position
  return (
    <aside className="panel" aria-live="polite">
      <div className="panel-head">
        <span className={`jersey jersey-${p.groupe}`}>{p.numero}</span>
        <div>
          <p className="eyebrow">{GROUPES[p.groupe].label} · {p.ligne}</p>
          <h2>{p.nom}</h2>
        </div>
        <button type="button" className="icon-btn" onClick={onClose} aria-label="Fermer la fiche">×</button>
      </div>
      <p className="panel-resume">{p.resume}</p>
      <h3>Missions</h3>
      <ul className="bullets">
        {p.missions.slice(0, 4).map((m) => <li key={m}>{m}</li>)}
      </ul>
      <a className="btn btn-primary" href={href('poste', p.numero)}>Fiche complète du {p.numero}</a>
    </aside>
  )
}
