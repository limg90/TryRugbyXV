import { POSITIONS, GROUPES } from '../data/positions.js'
import { href } from '../lib/router.js'

export default function PostesView() {
  const lignes = [...new Set(POSITIONS.map((p) => p.ligne))]
  return (
    <div className="postes">
      <header className="view-head">
        <div>
          <p className="eyebrow">Module Postes</p>
          <h1>Les 15 postes</h1>
          <p className="lede">{GROUPES.avants.description} {GROUPES.arrieres.description}</p>
        </div>
      </header>
      {lignes.map((ligne) => (
        <section key={ligne} className="ligne">
          <h2 className="ligne-title">{ligne}</h2>
          <div className="poste-grid">
            {POSITIONS.filter((p) => p.ligne === ligne).map((p) => (
              <a key={p.numero} className="poste-card" href={href('poste', p.numero)}>
                <span className={`jersey jersey-${p.groupe}`}>{p.numero}</span>
                <span className="poste-card-text">
                  <strong>{p.nom}</strong>
                  <span>{p.resume}</span>
                </span>
              </a>
            ))}
          </div>
        </section>
      ))}
    </div>
  )
}
