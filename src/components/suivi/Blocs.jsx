import { CRITERES, FAMILLES, ECHELLE, niveauDeNote, PERIODES, PROFILS, getCritere } from '../../data/evaluation.js'
import { fmt, signe, parPeriode } from '../../lib/analyse.js'

// Blocs partagés par l'Espace Coach et l'Espace Joueur.

// Jauge circulaire : note sur 10, repère de la cible.
export function Jauge({ valeur, cible, label, icon }) {
  const r = 34
  const tour = 2 * Math.PI * r
  const part = valeur == null ? 0 : valeur / 10
  const etat = valeur == null ? '' : cible == null ? '' : valeur >= cible ? 'is-ok' : valeur >= cible - 1 ? 'is-mid' : 'is-low'
  const ang = cible != null ? (cible / 10) * 2 * Math.PI - Math.PI / 2 : 0
  return (
    <div className={`jauge ${etat}`}>
      <svg viewBox="0 0 90 90" role="meter" aria-valuemin={0} aria-valuemax={10} aria-valuenow={valeur ?? 0} aria-label={`${label} : ${fmt(valeur)} sur 10${cible != null ? `, cible ${fmt(cible)}` : ''}`}>
        <circle className="jauge-fond" cx="45" cy="45" r={r} />
        <circle className="jauge-val" cx="45" cy="45" r={r} strokeDasharray={`${tour * part} ${tour}`} transform="rotate(-90 45 45)" />
        {cible != null && (
          <line className="jauge-cible" x1={45 + Math.cos(ang) * (r - 8)} y1={45 + Math.sin(ang) * (r - 8)} x2={45 + Math.cos(ang) * (r + 8)} y2={45 + Math.sin(ang) * (r + 8)} />
        )}
        <text x="45" y="50" textAnchor="middle" className="jauge-txt">{fmt(valeur)}</text>
      </svg>
      <span className="jauge-label">{icon} {label}</span>
      {cible != null && <small className="muted">cible {fmt(cible)}</small>}
    </div>
  )
}

// Barre de compétence horizontale avec repère de cible.
export function BarreNote({ note, cible }) {
  return (
    <span className="barre" aria-hidden="true">
      <span className={`barre-val${cible != null && note < cible ? ' is-low' : ''}`} style={{ width: `${(note / 10) * 100}%` }} />
      {cible != null && <span className="barre-cible" style={{ left: `${(cible / 10) * 100}%` }} />}
    </span>
  )
}

export function Kpis({ items }) {
  return (
    <dl className="kpis">
      {items.map((k) => (
        <div key={k.label} className={k.ton ? `kpi-${k.ton}` : ''}>
          <dt>{k.label}</dt>
          <dd>{k.valeur}{k.unite && <small>{k.unite}</small>}</dd>
          {k.detail && <p className="muted">{k.detail}</p>}
        </div>
      ))}
    </dl>
  )
}

// Saisie des 13 notes, groupées par famille, avec l'échelle sous chaque curseur.
export function SaisieNotes({ notes, onChange, cibles }) {
  return (
    <div className="saisie">
      {FAMILLES.map((f) => (
        <fieldset key={f.id} className="saisie-famille">
          <legend>{f.icon} {f.label}</legend>
          {CRITERES.filter((c) => c.famille === f.id).map((c) => {
            const v = notes[c.id] ?? 0
            const e = v ? niveauDeNote(v) : null
            return (
              <label key={c.id} className="saisie-ligne">
                <span className="saisie-nom">
                  <strong>{c.icon} {c.label}</strong>
                  <small>{c.aide}</small>
                </span>
                <span className="saisie-curseur">
                  <input type="range" min="0" max="10" step="1" value={v} onChange={(ev) => onChange({ ...notes, [c.id]: Number(ev.target.value) })} aria-valuetext={v ? `${v} sur 10, ${e.label}` : 'non noté'} />
                  {cibles && <span className="saisie-cible" style={{ left: `${(cibles[c.id] / 10) * 100}%` }} title={`Cible du poste : ${cibles[c.id]}`} />}
                </span>
                <span className={`saisie-val${v ? '' : ' is-vide'}`}>{v || '–'}<small>{e ? e.label : 'non noté'}</small></span>
              </label>
            )
          })}
        </fieldset>
      ))}
      <p className="echelle muted">
        {ECHELLE.map((e) => <span key={e.min}><b>{e.min}-{e.max}</b> {e.label}</span>)}
        {cibles && <span><i className="saisie-cible-key" aria-hidden="true" /> cible du poste</span>}
      </p>
    </div>
  )
}

// Tableau critère / cible / note / écart.
export function TableEcarts({ analyse }) {
  return (
    <div className="table-wrap">
      <table className="table">
        <thead><tr><th>Critère</th><th>Cible</th><th>Note</th><th>Écart</th><th className="col-barre"><span className="sr-only">Barre</span></th></tr></thead>
        <tbody>
          {analyse.lignes.map((l) => (
            <tr key={l.id}>
              <td>{l.icon} {l.label}</td>
              <td>{l.cible}</td>
              <td>{l.note || '—'}</td>
              <td><Delta v={l.ecart} /></td>
              <td className="col-barre">{l.note > 0 && <BarreNote note={l.note} cible={l.cible} />}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export function Delta({ v, d = 0 }) {
  if (v == null) return <span className="delta">—</span>
  const cls = v > 0 ? 'up' : v < 0 ? 'down' : 'flat'
  const fl = v > 0 ? '▲' : v < 0 ? '▼' : '▬'
  return <span className={`delta delta-${cls}`}>{fl} {signe(v, d)}</span>
}

// Points forts et axes d'amélioration.
export function ForcesAxes({ analyse, max = 4 }) {
  return (
    <div className="forces-axes">
      <section>
        <h3>Points forts</h3>
        {analyse.forces.length ? (
          <ul className="crit-list">
            {analyse.forces.slice(0, max).map((l) => (
              <li key={l.id}>
                <span>{l.icon} {l.label}</span>
                <BarreNote note={l.note} cible={l.cible} />
                <span className="meter-text">{l.note}/10 <Delta v={l.ecart} /></span>
              </li>
            ))}
          </ul>
        ) : <p className="muted">Pas encore de critère au niveau attendu.</p>}
      </section>
      <section>
        <h3>Axes d’amélioration</h3>
        {analyse.axes.length ? (
          <ul className="crit-list">
            {analyse.axes.slice(0, max).map((l) => (
              <li key={l.id}>
                <span>{l.icon} {l.label}</span>
                <BarreNote note={l.note} cible={l.cible} />
                <span className="meter-text">{l.note}/10 <Delta v={l.ecart} /></span>
              </li>
            ))}
          </ul>
        ) : <p className="muted">Toutes les attentes du poste sont atteintes. 🎉</p>}
      </section>
    </div>
  )
}

const URGENCE = { haute: 'Priorité haute', moyenne: 'À travailler', entretien: 'Entretien' }

// Recommandations avec conseil et exercices ciblés.
export function Recommandations({ recos, tutoiement = false }) {
  if (!recos.length) return <p className="muted">{tutoiement ? 'Tu atteins' : 'Le joueur atteint'} les attentes du poste sur tous les critères : {tutoiement ? 'fixe-toi' : 'fixez-lui'} un objectif au-dessus de la cible.</p>
  return (
    <ol className="recos">
      {recos.map((r) => (
        <li key={r.critere} className={`reco reco-${r.urgence}`}>
          <header>
            <span className="reco-icon" aria-hidden="true">{r.icon}</span>
            <div>
              <h3>{r.label}</h3>
              <p className="muted">{r.pourquoi}</p>
            </div>
            <span className="reco-tag">{URGENCE[r.urgence]}</span>
          </header>
          <p>{r.conseil}</p>
          <ul className="reco-exos">
            {r.exercices.slice(0, 3).map((e) => (
              <li key={e.titre}>
                <strong>{e.titre}</strong> <small className="muted">{e.duree}</small>
                <p>{e.description}</p>
                {e.lien && <a href={e.lien.to}>{e.lien.label} →</a>}
              </li>
            ))}
          </ul>
        </li>
      ))}
    </ol>
  )
}

// Bilan de saison : début, mi-saison, fin et évolution (fin, ou mi-saison, moins début).
export function BilanSaison({ evaluations }) {
  const p = parPeriode(evaluations)
  const periodes = PERIODES.filter((x) => x.id !== 'libre')
  if (!Object.keys(p).length) return <p className="muted">Enregistrez une évaluation « Début de saison », « Mi-saison » ou « Fin de saison » pour remplir ce bilan.</p>
  return (
    <div className="table-wrap">
      <table className="table">
        <thead><tr><th>Critère</th>{periodes.map((x) => <th key={x.id}>{x.court}</th>)}<th>Évolution</th></tr></thead>
        <tbody>
          {CRITERES.map((c) => {
            const d = p.debut?.notes[c.id] || 0
            const ref = p.fin?.notes[c.id] || p.mi?.notes[c.id] || 0
            return (
              <tr key={c.id}>
                <td>{c.icon} {c.label}</td>
                {periodes.map((x) => <td key={x.id}>{p[x.id]?.notes[c.id] || '—'}</td>)}
                <td><Delta v={d && ref && (p.fin || p.mi) ? ref - d : null} /></td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

// Exigences clés du poste (reprises de la fiche type par poste).
export function Exigences({ poste, cibles }) {
  const ex = PROFILS[poste]?.exigences ?? []
  return (
    <ul className="exigences">
      {ex.map((e) => {
        const c = getCritere(e.critere)
        return (
          <li key={e.critere}>
            <span aria-hidden="true">{c.icon}</span>
            <span><b>{c.label} ({cibles[e.critere]}/10)</b> : {e.texte}</span>
          </li>
        )
      })}
    </ul>
  )
}
