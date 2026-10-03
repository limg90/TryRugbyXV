import { useMemo, useState } from 'react'
import { CATEGORIES, COMBINAISONS } from '../data/combinaisons.js'
import { NIVEAUX } from '../lib/AppContext.jsx'
import { buildFrames } from '../engine/useScenario.js'
import { href } from '../lib/router.js'
import ScenarioStage from '../components/ScenarioStage.jsx'

export const niveauLabel = (id) => NIVEAUX.find((n) => n.id === id)?.label ?? id

// Vignette : toutes les trajectoires de la combinaison, figées sur la dernière étape.
function Vignette({ combinaison }) {
  const frames = useMemo(() => buildFrames(combinaison), [combinaison])
  return (
    <div className="vignette" aria-hidden="true">
      <ScenarioStage frames={frames} index={frames.length - 1} zoom={combinaison.zoom} still className="pitch-thumb" ariaLabel="" />
    </div>
  )
}

export default function Bibliotheque() {
  const [filtre, setFiltre] = useState('toutes')
  const categories = filtre === 'toutes' ? CATEGORIES : CATEGORIES.filter((c) => c.id === filtre)
  return (
    <div className="biblio">
      <header className="view-head">
        <div>
          <p className="eyebrow">Combinaisons</p>
          <h1>Bibliothèque de combinaisons</h1>
          <p className="lede">Chaque fiche contient une animation à vitesse réglable, une vue aérienne, l’explication tactique et un exercice d’entraînement.</p>
        </div>
      </header>
      <div className="filters" role="radiogroup" aria-label="Catégorie">
        {[{ id: 'toutes', label: 'Toutes' }, ...CATEGORIES].map((c) => (
          <button key={c.id} type="button" role="radio" aria-checked={filtre === c.id} className={`chip${filtre === c.id ? ' is-on' : ''}`} onClick={() => setFiltre(c.id)}>
            {c.label}
          </button>
        ))}
      </div>
      {categories.map((cat) => (
        <section key={cat.id} className="ligne">
          <div>
            <h2 className="ligne-title">{cat.label}</h2>
            <p className="muted">{cat.description}</p>
          </div>
          <div className="combi-grid">
            {COMBINAISONS.filter((c) => c.categorie === cat.id).map((c) => (
              <a key={c.id} className="combi-card" href={href('combinaisons', c.id)}>
                <Vignette combinaison={c} />
                <span className="combi-card-text">
                  <span className={`niveau niveau-${c.niveau}`}>{niveauLabel(c.niveau)}</span>
                  <strong>{c.titre}</strong>
                  <span>{c.resume}</span>
                </span>
              </a>
            ))}
          </div>
        </section>
      ))}
    </div>
  )
}
