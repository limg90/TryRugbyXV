import { useState } from 'react'
import { CATEGORIES, COMBINAISONS } from '../data/combinaisons.js'
import { getPosition } from '../data/positions.js'
import { useScenario } from '../engine/useScenario.js'
import { useMediaQuery } from '../lib/useMediaQuery.js'
import { href } from '../lib/router.js'
import { save } from '../lib/storage.js'
import ScenarioStage from '../components/ScenarioStage.jsx'
import Transport from '../components/Transport.jsx'
import { niveauLabel } from './Bibliotheque.jsx'
import { brouillonDepuisScenario, CLE_BROUILLON } from './Editeur.jsx'

function Explication({ e }) {
  return (
    <>
      <h3>Objectif</h3>
      <p>{e.objectif}</p>
      <h3>Quand l’utiliser</h3>
      <p>{e.quand}</p>
      <h3>Points clés</h3>
      <ul className="bullets">{e.points.map((p) => <li key={p}>{p}</li>)}</ul>
      <h3>Erreurs fréquentes</h3>
      <ul className="bullets bullets-bad">{e.erreurs.map((p) => <li key={p}>{p}</li>)}</ul>
    </>
  )
}

function Exercice({ x }) {
  return (
    <>
      <h3>{x.titre}</h3>
      <p><strong>Mise en place.</strong> {x.miseEnPlace}</p>
      <h3>Déroulé</h3>
      <ol className="bullets">{x.deroule.map((p) => <li key={p}>{p}</li>)}</ol>
      <h3>Consignes</h3>
      <ul className="bullets">{x.consignes.map((p) => <li key={p}>{p}</li>)}</ul>
      <p className="tip-line"><strong>Variante.</strong> {x.variante}</p>
    </>
  )
}

export default function CombinaisonDetail({ combinaison: c }) {
  const vertical = useMediaQuery('(max-width: 720px)')
  const [speed, setSpeed] = useState(1)
  const [rapproche, setRapproche] = useState(true)
  const [trails, setTrails] = useState(true)
  const [selected, setSelected] = useState(null)
  const [onglet, setOnglet] = useState('explication')
  const player = useScenario(c, { speed })
  const i = COMBINAISONS.indexOf(c)
  const prev = COMBINAISONS[i - 1]
  const next = COMBINAISONS[i + 1]
  const cat = CATEGORIES.find((k) => k.id === c.categorie)
  const sel = selected ? getPosition(selected) : null

  const ouvrirEditeur = () => {
    save(CLE_BROUILLON, brouillonDepuisScenario(c))
    window.location.hash = href('combinaisons', 'editeur')
  }

  return (
    <div className="combi">
      <div className="fiche-nav">
        <a href={href('combinaisons')}>← Bibliothèque</a>
        <span>
          {prev && <a href={href('combinaisons', prev.id)}>‹ {prev.titre}</a>}
          {next && <a href={href('combinaisons', next.id)}>{next.titre} ›</a>}
        </span>
      </div>
      <header className="view-head">
        <div>
          <p className="eyebrow">{cat.label} · {niveauLabel(c.niveau)}</p>
          <h1>{c.titre}</h1>
          <p className="lede">{c.resume}</p>
        </div>
        <button type="button" className="btn btn-ghost" onClick={ouvrirEditeur}>Modifier dans l’éditeur</button>
      </header>

      <div className="terrain-layout">
        <div className="terrain-stage">
          <Transport player={player} speed={speed} onSpeed={setSpeed} />
          <div className="view-toggles">
            {c.zoom && (
              <div className="seg" role="radiogroup" aria-label="Vue">
                <button type="button" role="radio" aria-checked={rapproche} className={`chip${rapproche ? ' is-on' : ''}`} onClick={() => setRapproche(true)}>Vue rapprochée</button>
                <button type="button" role="radio" aria-checked={!rapproche} className={`chip${!rapproche ? ' is-on' : ''}`} onClick={() => setRapproche(false)}>Vue aérienne</button>
              </div>
            )}
            <label className="toggle">
              <input type="checkbox" checked={trails} onChange={(e) => setTrails(e.target.checked)} />
              <span>Trajectoires</span>
            </label>
          </div>
          <div className={`pitch-wrap${vertical ? ' is-vertical' : ''}`}>
            <ScenarioStage
              frames={player.frames}
              index={player.index}
              transitionDuration={player.transitionDuration}
              vertical={vertical}
              zoom={rapproche ? c.zoom : null}
              trails={trails}
              selected={selected}
              onSelect={(n) => setSelected((cur) => (cur === n ? null : n))}
              ariaLabel={`Animation : ${c.titre}`}
            />
          </div>
          <div className="caption" aria-live="polite">
            <span className="caption-step">{player.count > 1 ? `${player.index + 1}/${player.count}` : '•'}</span>
            <p>{player.frame.caption}</p>
          </div>
          <ol className="steps" aria-label="Étapes">
            {player.frames.map((f, k) => (
              <li key={k}>
                <button type="button" className={k === player.index ? 'is-on' : ''} aria-current={k === player.index ? 'step' : undefined} onClick={() => player.goTo(k)} title={f.caption}>
                  {k + 1}
                </button>
              </li>
            ))}
          </ol>
          <p className="legend">
            <span><i className="dot dot-avants" /> Nos avants</span>
            <span><i className="dot dot-arrieres" /> Nos trois-quarts</span>
            <span><i className="dot dot-adverse" /> Adversaires</span>
            <span><i className="line-key line-passe" /> Passe</span>
            <span><i className="line-key line-course" /> Course</span>
            <span>Nous attaquons vers {vertical ? 'le haut' : 'la droite'}</span>
          </p>
          {sel && <p className="muted">Le {sel.numero} : {sel.nom}. <a href={href('poste', sel.numero)}>Voir la fiche du poste</a></p>}
        </div>

        <aside className="panel combi-panel">
          <div className="seg" role="tablist" aria-label="Contenu">
            <button type="button" role="tab" aria-selected={onglet === 'explication'} className={`chip${onglet === 'explication' ? ' is-on' : ''}`} onClick={() => setOnglet('explication')}>Explication</button>
            <button type="button" role="tab" aria-selected={onglet === 'exercice'} className={`chip${onglet === 'exercice' ? ' is-on' : ''}`} onClick={() => setOnglet('exercice')}>Exercice</button>
          </div>
          <div role="tabpanel" className="combi-panel-body">
            {onglet === 'explication' ? <Explication e={c.explication} /> : <Exercice x={c.exercice} />}
          </div>
        </aside>
      </div>
    </div>
  )
}
