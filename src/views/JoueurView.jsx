import { useState } from 'react'
import Analyse from '../components/suivi/Analyse.jsx'
import Evolution from '../components/suivi/Evolution.jsx'
import FormEvaluation from '../components/suivi/FormEvaluation.jsx'
import { Kpis, Recommandations, BilanSaison, Exigences, BarreNote } from '../components/suivi/Blocs.jsx'
import { CRITERES, HORIZONS, ciblesPour, getCritere, getPeriode } from '../data/evaluation.js'
import { POSITIONS, getPosition } from '../data/positions.js'
import { NIVEAUX, useApp } from '../lib/AppContext.jsx'
import { analyser, chronologique, moyenne, progression, recommandations, planDeProgression, fmt, signe } from '../lib/analyse.js'
import { useJoueur, aujourdhui, dateFr } from '../lib/suivi.js'
import { href } from '../lib/router.js'

// Espace Joueur : #joueur (tableau de bord), #joueur-evaluer, #joueur-plan, #joueur-objectifs, #joueur-historique.

const ONGLETS = [
  { id: 'tableau', label: 'Tableau de bord' },
  { id: 'evaluer', label: 'Auto-évaluation' },
  { id: 'plan', label: 'Mon plan' },
  { id: 'objectifs', label: 'Objectifs' },
  { id: 'historique', label: 'Historique' },
]
const niveauLabel = (id) => NIVEAUX.find((n) => n.id === id)?.label ?? id
const ajouterJours = (iso, n) => {
  const d = new Date(`${iso}T12:00:00`)
  d.setDate(d.getDate() + n)
  return d.toISOString().slice(0, 10)
}
const joursAvant = (iso) => Math.round((new Date(`${iso}T12:00:00`) - new Date(`${aujourdhui()}T12:00:00`)) / 86400000)

export default function JoueurView({ param }) {
  const joueur = useJoueur()
  const onglet = ONGLETS.some((o) => o.id === param) ? param : 'tableau'
  const [modifProfil, setModifProfil] = useState(false)
  if (!joueur.profil || modifProfil) return <Profil joueur={joueur} onFini={() => setModifProfil(false)} />

  const { profil } = joueur
  const pos = getPosition(profil.poste)
  const cibles = ciblesPour(profil.poste, profil.niveau)
  const evals = chronologique(joueur.evaluations)
  const d = evals.at(-1)
  const recos = d ? recommandations({ notes: d.notes, cibles, poste: profil.poste, objectifs: joueur.objectifs }) : []
  const ctx = { joueur, profil, cibles, evals, d, recos }

  return (
    <article className="fiche suivi">
      <header className="fiche-head">
        <span className={`jersey jersey-lg jersey-${pos.groupe}`}>{profil.poste}</span>
        <div>
          <p className="eyebrow">Espace Joueur · {pos.nom} · {niveauLabel(profil.niveau)}</p>
          <h1>Salut {profil.prenom} !</h1>
          <p className="lede">Évalue-toi, repère tes points forts et suis ton plan pour progresser à ton poste.</p>
        </div>
        <button type="button" className="btn btn-ghost btn-sm fiche-head-btn" onClick={() => setModifProfil(true)}>Modifier mon profil</button>
      </header>
      <nav className="tabs tabs-scroll" aria-label="Sections de l’Espace Joueur">
        {ONGLETS.map((o) => (
          <a key={o.id} href={href('joueur', o.id === 'tableau' ? null : o.id)} className={onglet === o.id ? 'is-on' : ''} aria-current={onglet === o.id ? 'page' : undefined}>{o.label}</a>
        ))}
      </nav>
      {onglet === 'tableau' && <Tableau {...ctx} />}
      {onglet === 'evaluer' && (
        <section className="fiche-block">
          <h2>Mon auto-évaluation</h2>
          <p className="muted">Sois honnête : note ce que tu réussis vraiment en match, pas ce que tu aimerais réussir. Le repère doré montre l’attente de ton poste.</p>
          <FormEvaluation auto depart={d} cibles={cibles}
            onEnregistrer={(ev) => { joueur.enregistrerEvaluation(ev); window.location.hash = href('joueur') }} />
        </section>
      )}
      {onglet === 'plan' && <Plan {...ctx} />}
      {onglet === 'objectifs' && <Objectifs {...ctx} />}
      {onglet === 'historique' && (
        <>
          <section className="fiche-block">
            <h2>Ma progression</h2>
            <Evolution evaluations={joueur.evaluations} cibles={cibles} onSupprimer={joueur.supprimerEvaluation} />
          </section>
          <section className="fiche-block">
            <h2>Bilan de saison</h2>
            <BilanSaison evaluations={joueur.evaluations} />
          </section>
        </>
      )}
    </article>
  )
}

function Profil({ joueur, onFini }) {
  const { niveau } = useApp()
  const [v, setV] = useState(joueur.profil ?? { prenom: '', poste: 10, niveau })
  const valider = (e) => {
    e.preventDefault()
    joueur.definirProfil({ ...v, prenom: v.prenom.trim() || 'joueur' })
    onFini()
  }
  const effacer = () => {
    if (window.confirm('Effacer ton profil, tes auto-évaluations et tes objectifs sur cet appareil ?')) {
      joueur.reinitialiser()
      onFini()
    }
  }
  return (
    <form className="fiche suivi" onSubmit={valider}>
      <header className="view-head">
        <div>
          <p className="eyebrow">Espace Joueur</p>
          <h1>{joueur.profil ? 'Mon profil' : 'Bienvenue dans ton espace'}</h1>
          <p className="lede">Indique ton poste et ton niveau : ton tableau de bord compare tes notes aux attentes de ton poste et te propose un plan d’exercices.</p>
        </div>
      </header>
      <section className="fiche-block">
        <div className="form-grid">
          <label className="field"><span className="field-label">Prénom</span><input className="input" value={v.prenom} onChange={(e) => setV({ ...v, prenom: e.target.value })} autoComplete="given-name" required /></label>
          <label className="field"><span className="field-label">Mon poste</span>
            <select className="input" value={v.poste} onChange={(e) => setV({ ...v, poste: Number(e.target.value) })}>
              {POSITIONS.map((p) => <option key={p.numero} value={p.numero}>{p.numero} · {p.nom}</option>)}
            </select>
          </label>
          <label className="field"><span className="field-label">Mon niveau</span>
            <select className="input" value={v.niveau} onChange={(e) => setV({ ...v, niveau: e.target.value })}>
              {NIVEAUX.map((n) => <option key={n.id} value={n.id}>{n.label}</option>)}
            </select>
          </label>
        </div>
        <div className="btn-row">
          <button type="submit" className="btn btn-primary">{joueur.profil ? 'Enregistrer' : 'C’est parti'}</button>
          {joueur.profil && <button type="button" className="btn btn-ghost" onClick={onFini}>Annuler</button>}
          {joueur.profil && <button type="button" className="btn btn-ghost btn-danger" onClick={effacer}>Effacer mes données</button>}
        </div>
        <p className="muted">Tes données restent sur cet appareil.</p>
      </section>
    </form>
  )
}

function Tableau({ joueur, profil, cibles, evals, d, recos }) {
  if (!d) {
    return (
      <div className="suivi-stack">
        <section className="fiche-block vide">
          <h2>Commence par t’évaluer</h2>
          <p>13 critères à noter de 1 à 10 : technique, tactique, physique et mental. Ça prend 3 minutes.</p>
          <a className="btn btn-primary" href={href('joueur', 'evaluer')}>Faire mon auto-évaluation</a>
        </section>
        <section className="fiche-block">
          <h2>Ce qu’on attend d’un {getPosition(profil.poste).nom.toLowerCase()}</h2>
          <Exigences poste={profil.poste} cibles={cibles} />
        </section>
      </div>
    )
  }
  const a = analyser(d.notes, cibles)
  const p = progression(evals)
  const enCours = joueur.objectifs.filter((o) => !o.fait)
  const plan = planDeProgression(recos)
  const seances = plan.flatMap((s) => s.seances)
  const faites = seances.filter((s) => joueur.faits[s.cle]).length
  return (
    <div className="suivi-stack">
      <Kpis items={[
        { label: 'Ma note moyenne', valeur: fmt(moyenne(d.notes)), unite: '/10', detail: `attendu au poste : ${fmt(moyenne(cibles))}` },
        { label: 'Attentes du poste atteintes', valeur: a.atteints, unite: `/${a.notes}`, ton: a.conformite >= 0.7 ? 'good' : '' },
        { label: 'Progression', valeur: p ? signe(p.delta) : '—', detail: p ? `depuis le ${dateFr(p.depuis.date)}` : 'refais une évaluation plus tard', ton: p && p.delta > 0 ? 'good' : p && p.delta < 0 ? 'bad' : '' },
        { label: 'Plan de progression', valeur: seances.length ? `${Math.round((faites / seances.length) * 100)}` : '—', unite: seances.length ? ' %' : '', detail: `${enCours.length} objectif${enCours.length > 1 ? 's' : ''} en cours` },
      ]} />
      <p className="muted">Dernière auto-évaluation : {getPeriode(d.periode).label}, {dateFr(d.date)}. <a href={href('joueur', 'evaluer')}>Me réévaluer</a></p>
      <Analyse notes={d.notes} cibles={cibles} precedente={evals.at(-2)} tutoiement />
      {recos.length > 0 && (
        <section className="fiche-block">
          <h2>Mes priorités</h2>
          <ol className="priorites">
            {recos.map((r) => <li key={r.critere}><span aria-hidden="true">{r.icon}</span> <strong>{r.label}</strong> <span className="muted">{r.note}/10, objectif {r.cible}/10</span></li>)}
          </ol>
          <a className="btn btn-primary" href={href('joueur', 'plan')}>Voir mon plan d’exercices</a>
        </section>
      )}
    </div>
  )
}

function Plan({ joueur, d, recos }) {
  if (!d) return <AFaire />
  const plan = planDeProgression(recos)
  const seances = plan.flatMap((s) => s.seances)
  const faites = seances.filter((s) => joueur.faits[s.cle]).length
  return (
    <div className="suivi-stack">
      <section className="fiche-block">
        <h2>Pourquoi ces exercices</h2>
        <Recommandations recos={recos} tutoiement />
      </section>
      {plan.length > 0 && (
        <section className="fiche-block">
          <div className="ligne-row">
            <h2>Mon plan sur 4 semaines</h2>
            <span className="meter-text">{faites}/{seances.length} séances faites</span>
          </div>
          <div className="meter" aria-hidden="true"><span style={{ width: `${(faites / seances.length) * 100}%` }} /></div>
          <p className="muted">2 à 3 séances par semaine, en plus des entraînements du club. À la fin de la semaine 4, refais ton auto-évaluation : le plan se met à jour.</p>
          <div className="semaines">
            {plan.map((s) => (
              <section key={s.titre} className="semaine">
                <h3>{s.titre} <small className="muted">{s.but}</small></h3>
                <ul>
                  {s.seances.map((x) => (
                    <li key={x.cle} className={joueur.faits[x.cle] ? 'is-done' : ''}>
                      <label className="toggle">
                        <input type="checkbox" checked={!!joueur.faits[x.cle]} onChange={() => joueur.basculerFait(x.cle)} />
                        <span><strong>{x.icon} {x.titre}</strong> <small className="muted">{x.duree}</small></span>
                      </label>
                      <p>{x.description}</p>
                      {x.lien && <a href={x.lien.to}>{x.lien.label} →</a>}
                    </li>
                  ))}
                </ul>
              </section>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}

function AFaire() {
  return (
    <section className="fiche-block vide">
      <h2>Ton plan arrive après ta première auto-évaluation</h2>
      <a className="btn btn-primary" href={href('joueur', 'evaluer')}>Faire mon auto-évaluation</a>
    </section>
  )
}

function Objectifs({ joueur, d, recos }) {
  const vide = { horizon: 'court', texte: '', critere: '', cible: '', echeance: ajouterJours(aujourdhui(), HORIZONS[0].jours) }
  const [v, setV] = useState(vide)
  const ajouter = (e) => {
    e.preventDefault()
    if (!v.texte.trim()) return
    joueur.ajouterObjectif({ ...v, texte: v.texte.trim(), cible: v.cible ? Number(v.cible) : null, critere: v.critere || null })
    setV(vide)
  }
  const suggerer = (r) => {
    const cible = Math.min(10, Math.max(r.cible, r.note + 2))
    joueur.ajouterObjectif({ horizon: r.ecart <= -3 ? 'moyen' : 'court', texte: `Passer de ${r.note} à ${cible}/10 en ${r.label.toLowerCase()}`, critere: r.critere, cible, echeance: ajouterJours(aujourdhui(), r.ecart <= -3 ? 90 : 28) })
  }
  const dejaVise = new Set(joueur.objectifs.filter((o) => !o.fait).map((o) => o.critere))
  const suggestions = recos.filter((r) => !dejaVise.has(r.critere))

  return (
    <div className="suivi-stack">
      {suggestions.length > 0 && (
        <section className="fiche-block tip">
          <h2>Objectifs suggérés</h2>
          <p className="muted">D’après ta dernière auto-évaluation et les attentes de ton poste.</p>
          <div className="btn-row">
            {suggestions.map((r) => (
              <button key={r.critere} type="button" className="btn btn-ghost" onClick={() => suggerer(r)}>+ {r.icon} {r.label} : {r.note} → {Math.min(10, Math.max(r.cible, r.note + 2))}</button>
            ))}
          </div>
        </section>
      )}
      <form className="fiche-block" onSubmit={ajouter}>
        <h2>Nouvel objectif</h2>
        <div className="form-grid">
          <label className="field form-wide"><span className="field-label">Mon objectif</span>
            <input className="input" value={v.texte} onChange={(e) => setV({ ...v, texte: e.target.value })} placeholder="Ex. : réussir 8 plaquages sur 10 à l’entraînement" required />
          </label>
          <label className="field"><span className="field-label">Échéance</span>
            <span className="seg">
              {HORIZONS.map((h) => (
                <button key={h.id} type="button" className={`chip${v.horizon === h.id ? ' is-on' : ''}`} aria-pressed={v.horizon === h.id} onClick={() => setV({ ...v, horizon: h.id, echeance: ajouterJours(aujourdhui(), h.jours) })}>{h.label}</button>
              ))}
            </span>
          </label>
          <label className="field"><span className="field-label">Date visée</span><input className="input" type="date" value={v.echeance} onChange={(e) => setV({ ...v, echeance: e.target.value })} /></label>
          <label className="field"><span className="field-label">Critère lié (facultatif)</span>
            <select className="input" value={v.critere} onChange={(e) => setV({ ...v, critere: e.target.value })}>
              <option value="">Aucun</option>
              {CRITERES.map((c) => <option key={c.id} value={c.id}>{c.label}</option>)}
            </select>
          </label>
          {v.critere && (
            <label className="field"><span className="field-label">Note visée</span>
              <input className="input" type="number" min="1" max="10" value={v.cible} onChange={(e) => setV({ ...v, cible: e.target.value })} />
            </label>
          )}
        </div>
        <button type="submit" className="btn btn-primary">Ajouter l’objectif</button>
      </form>

      {HORIZONS.map((h) => {
        const liste = joueur.objectifs.filter((o) => o.horizon === h.id).sort((a, b) => a.fait - b.fait || (a.echeance < b.echeance ? -1 : 1))
        return (
          <section key={h.id} className="fiche-block">
            <h2>{h.label} <small className="muted">{h.detail}</small></h2>
            {liste.length ? (
              <ul className="objectifs">
                {liste.map((o) => {
                  const c = o.critere && getCritere(o.critere)
                  const note = c && d ? d.notes[o.critere] || 0 : null
                  const reste = o.echeance ? joursAvant(o.echeance) : null
                  return (
                    <li key={o.id} className={o.fait ? 'is-done' : ''}>
                      <label className="toggle">
                        <input type="checkbox" checked={o.fait} onChange={() => joueur.modifierObjectif(o.id, { fait: !o.fait })} />
                        <span>{o.texte}</span>
                      </label>
                      {c && o.cible && (
                        <span className="objectif-suivi">
                          <span className="muted">{c.icon} {c.label} : {note || '—'}/{o.cible}</span>
                          <BarreNote note={note || 0} cible={o.cible} />
                        </span>
                      )}
                      <span className="objectif-meta muted">
                        {o.fait ? 'Atteint 🎉' : reste == null ? '' : reste < 0 ? `Échéance dépassée (${dateFr(o.echeance)})` : `${reste} jour${reste > 1 ? 's' : ''} restants · ${dateFr(o.echeance)}`}
                        <button type="button" className="icon-btn" aria-label={`Supprimer l’objectif ${o.texte}`} onClick={() => joueur.supprimerObjectif(o.id)}>×</button>
                      </span>
                    </li>
                  )
                })}
              </ul>
            ) : <p className="muted">Aucun objectif {h.label.toLowerCase()}.</p>}
          </section>
        )
      })}
    </div>
  )
}
