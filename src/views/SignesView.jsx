import { useState } from 'react'
import { CATEGORIES, SIGNES } from '../data/signes.js'
import { href } from '../lib/router.js'
import Arbitre from '../components/Arbitre.jsx'

// Signes de l'arbitre : #regles-signes. Illustrations fournies ou gestes dessinés (components/Arbitre.jsx).

export function Figure({ signe: s }) {
  const [officiel, setOfficiel] = useState(false)
  const dessin = !s.image || officiel
  return (
    <div className="signe-figure-wrap">
      <div className="signe-figure">
        {dessin
          ? <Arbitre pose={s.dessin} titre={`Geste de l’arbitre : ${s.titre}`} />
          : <img src={s.image} alt={`Geste de l’arbitre : ${s.titre}`} loading="lazy" />}
        {!s.image && <span className="signe-tag">Dessin provisoire</span>}
      </div>
      {s.image && s.conforme === false && (
        <div className="signe-switch" role="radiogroup" aria-label="Illustration">
          <button type="button" role="radio" aria-checked={!officiel} className={!officiel ? 'is-on' : ''} onClick={() => setOfficiel(false)}>Illustration</button>
          <button type="button" role="radio" aria-checked={officiel} className={officiel ? 'is-on' : ''} onClick={() => setOfficiel(true)}>Geste officiel</button>
        </div>
      )}
    </div>
  )
}

function Carte({ signe: s }) {
  return (
    <article className="signe-card" id={`signe-${s.id}`}>
      <Figure signe={s} />
      <div className="signe-text">
        <h3>{s.titre}</h3>
        <dl>
          <dt>Le geste</dt>
          <dd>{s.geste}</dd>
          <dt>Quand ?</dt>
          <dd>{s.quand}</dd>
          <dt>Et après ?</dt>
          <dd className="tip-line">{s.ensuite}</dd>
        </dl>
      </div>
    </article>
  )
}

export default function SignesView() {
  const [filtre, setFiltre] = useState('tous')
  const categories = filtre === 'tous' ? CATEGORIES : CATEGORIES.filter((c) => c.id === filtre)
  return (
    <div className="biblio">
      <div className="fiche-nav">
        <a href={href('regles')}>← Toutes les règles</a>
      </div>
      <header className="view-head">
        <div>
          <p className="eyebrow">Règles</p>
          <h1>Signes de l’arbitre</h1>
          <p className="lede">Chaque geste de l’arbitre annonce une décision. Apprends à les reconnaître pour savoir tout de suite ce qui se passe et ce que ton équipe doit faire.</p>
        </div>
      </header>
      <div className="filters" role="radiogroup" aria-label="Catégorie">
        {[{ id: 'tous', label: 'Tous' }, ...CATEGORIES].map((c) => (
          <button key={c.id} type="button" role="radio" aria-checked={filtre === c.id} className={`chip${filtre === c.id ? ' is-on' : ''}`} onClick={() => setFiltre(c.id)}>
            {c.label}
          </button>
        ))}
      </div>
      {categories.map((c) => (
        <section key={c.id} className="ligne">
          <h2 className="ligne-title">{c.label}</h2>
          <div className="signe-grid">
            {SIGNES.filter((s) => s.categorie === c.id).map((s) => <Carte key={s.id} signe={s} />)}
          </div>
        </section>
      ))}
    </div>
  )
}
