import { useState } from 'react'
import Analyse from '../components/suivi/Analyse.jsx'
import Evolution from '../components/suivi/Evolution.jsx'
import FormEvaluation from '../components/suivi/FormEvaluation.jsx'
import { Kpis, Recommandations, BilanSaison, Exigences, Delta, BarreNote } from '../components/suivi/Blocs.jsx'
import { CRITERES, ciblesPour, getPeriode } from '../data/evaluation.js'
import { POSITIONS, getPosition } from '../data/positions.js'
import { EXEMPLE_EFFECTIF } from '../data/exemples.js'
import { NIVEAUX } from '../lib/AppContext.jsx'
import { analyser, derniere, moyenne, progression, recommandations, fmt, signe, chronologique } from '../lib/analyse.js'
import { useCoach, dateFr } from '../lib/suivi.js'
import { href } from '../lib/router.js'

// Espace Coach : #coach (effectif), #coach-nouveau, #coach-<id>(-analyse|-evaluer|-evolution|-profil).

const ONGLETS = [
  { id: 'analyse', label: 'Analyse' },
  { id: 'evaluer', label: 'Évaluer' },
  { id: 'evolution', label: 'Évolution' },
  { id: 'profil', label: 'Profil et cibles' },
]

const niveauLabel = (id) => NIVEAUX.find((n) => n.id === id)?.label ?? id
const nomComplet = (j) => `${j.prenom} ${j.nom}`.trim() || 'Joueur sans nom'
const ciblesDe = (j) => ciblesPour(j.poste, j.niveau, j.cibles)

export default function CoachView({ param }) {
  const coach = useCoach()
  if (!param) return <Effectif coach={coach} />
  if (param === 'nouveau') return <NouveauJoueur coach={coach} />
  const [id, onglet = 'analyse'] = param.split('-')
  const j = coach.joueurs.find((x) => x.id === id)
  if (!j) {
    return (
      <div className="view-head">
        <h1>Joueur introuvable</h1>
        <a className="btn btn-primary" href={href('coach')}>Retour à l’effectif</a>
      </div>
    )
  }
  return <FicheJoueur key={j.id} joueur={j} onglet={onglet} coach={coach} />
}

// ---------------------------------------------------------------- Effectif
function Effectif({ coach }) {
  const [filtre, setFiltre] = useState('tous')
  const joueurs = [...coach.joueurs].sort((a, b) => a.poste - b.poste || a.nom.localeCompare(b.nom))
  const fiches = joueurs.map((j) => {
    const d = derniere(j.evaluations)
    return { j, d, a: d ? analyser(d.notes, ciblesDe(j)) : null, p: progression(j.evaluations) }
  })
  const visibles = fiches.filter(({ j }) => filtre === 'tous' || getPosition(j.poste).groupe === filtre)
  const evalues = fiches.filter((f) => f.a)
  const conformite = evalues.length ? evalues.reduce((s, f) => s + f.a.conformite, 0) / evalues.length : null
  const enProgres = fiches.filter((f) => f.p && f.p.delta > 0).length
  // Critères les plus souvent sous la cible dans l'effectif.
  const manques = CRITERES.map((c) => ({ ...c, n: evalues.filter((f) => f.a.lignes.find((l) => l.id === c.id).ecart < 0).length }))
    .filter((c) => c.n > 0).sort((a, b) => b.n - a.n).slice(0, 4)

  return (
    <div className="biblio suivi">
      <header className="view-head">
        <div>
          <p className="eyebrow">Espace Coach</p>
          <h1>Mon effectif</h1>
          <p className="lede">Évaluez chaque joueur sur les 13 critères du club, comparez-le aux attentes de son poste et suivez sa progression sur la saison.</p>
        </div>
        <a className="btn btn-primary" href={href('coach', 'nouveau')}>+ Ajouter un joueur</a>
      </header>

      {!coach.joueurs.length ? (
        <section className="fiche-block vide">
          <h2>Aucun joueur pour l’instant</h2>
          <p>Ajoutez vos joueurs un par un, ou chargez un effectif d’exemple pour découvrir l’outil (vous pourrez le supprimer ensuite).</p>
          <div className="btn-row">
            <a className="btn btn-primary" href={href('coach', 'nouveau')}>Ajouter un joueur</a>
            <button type="button" className="btn btn-ghost" onClick={() => coach.importer(EXEMPLE_EFFECTIF)}>Charger un exemple</button>
          </div>
          <p className="muted">Les fiches restent sur cet appareil : rien n’est envoyé en ligne.</p>
        </section>
      ) : (
        <>
          <Kpis items={[
            { label: 'Joueurs', valeur: coach.joueurs.length },
            { label: 'Joueurs évalués', valeur: evalues.length, unite: `/${coach.joueurs.length}` },
            { label: 'Attentes du poste atteintes', valeur: conformite == null ? '—' : Math.round(conformite * 100), unite: conformite == null ? '' : ' %', detail: 'moyenne de l’effectif' },
            { label: 'Joueurs en progrès', valeur: enProgres, detail: 'depuis leur 1re évaluation' },
          ]} />
          {manques.length > 0 && (
            <section className="fiche-block">
              <h2>À travailler en collectif</h2>
              <p className="muted">Critères sous la cible du poste chez le plus de joueurs (dernière évaluation).</p>
              <ul className="crit-list">
                {manques.map((c) => (
                  <li key={c.id}>
                    <span>{c.icon} {c.label}</span>
                    <span className="meter" aria-hidden="true"><span style={{ width: `${(c.n / evalues.length) * 100}%` }} /></span>
                    <span className="meter-text">{c.n}/{evalues.length} joueurs</span>
                  </li>
                ))}
              </ul>
            </section>
          )}
          <div className="filters seg" role="group" aria-label="Filtrer l’effectif">
            {[['tous', 'Tous'], ['avants', 'Avants'], ['arrieres', 'Trois-quarts']].map(([id, label]) => (
              <button key={id} type="button" className={`chip${filtre === id ? ' is-on' : ''}`} aria-pressed={filtre === id} onClick={() => setFiltre(id)}>{label}</button>
            ))}
          </div>
          <div className="joueur-grid">
            {visibles.map(({ j, d, a, p }) => {
              const pos = getPosition(j.poste)
              return (
                <a key={j.id} className="joueur-card" href={href('coach', j.id)}>
                  <span className={`jersey jersey-${pos.groupe}`}>{j.poste}</span>
                  <span className="joueur-card-text">
                    <strong>{nomComplet(j)}</strong>
                    <span className="muted">{pos.nom} · {niveauLabel(j.niveau)}</span>
                    {a ? (
                      <>
                        <span className="joueur-card-stats">
                          <span><b>{fmt(moyenne(d.notes))}</b>/10</span>
                          <span>{a.atteints}/{a.notes} attentes</span>
                          {p && <Delta v={p.delta} d={1} />}
                        </span>
                        <BarreNote note={(a.conformite ?? 0) * 10} />
                        <small className="muted">Dernière évaluation : {dateFr(d.date)}</small>
                      </>
                    ) : <small className="statut">À évaluer</small>}
                  </span>
                </a>
              )
            })}
          </div>
          {coach.joueurs.some((j) => j.exemple) && (
            <p className="muted">
              L’effectif contient des joueurs d’exemple.{' '}
              <button type="button" className="link-btn" onClick={() => coach.joueurs.filter((j) => j.exemple).forEach((j) => coach.supprimerJoueur(j.id))}>Supprimer les exemples</button>
            </p>
          )}
        </>
      )}
    </div>
  )
}

// ---------------------------------------------------------------- Création / profil
function ChampsProfil({ valeur, onChange }) {
  const set = (k) => (e) => onChange({ ...valeur, [k]: k === 'poste' ? Number(e.target.value) : e.target.value })
  return (
    <div className="form-grid">
      <label className="field"><span className="field-label">Prénom</span><input className="input" value={valeur.prenom} onChange={set('prenom')} required autoComplete="off" /></label>
      <label className="field"><span className="field-label">Nom</span><input className="input" value={valeur.nom} onChange={set('nom')} autoComplete="off" /></label>
      <label className="field"><span className="field-label">Poste</span>
        <select className="input" value={valeur.poste} onChange={set('poste')}>
          {POSITIONS.map((p) => <option key={p.numero} value={p.numero}>{p.numero} · {p.nom}</option>)}
        </select>
      </label>
      <label className="field"><span className="field-label">Niveau</span>
        <select className="input" value={valeur.niveau} onChange={set('niveau')}>
          {NIVEAUX.map((n) => <option key={n.id} value={n.id}>{n.label}</option>)}
        </select>
      </label>
      <label className="field"><span className="field-label">Date de naissance</span><input className="input" type="date" value={valeur.naissance} onChange={set('naissance')} /></label>
      <label className="field"><span className="field-label">Matchs joués (saison)</span><input className="input" type="number" min="0" value={valeur.matchs} onChange={set('matchs')} /></label>
      <label className="field form-wide"><span className="field-label">Objectifs fixés par le coach</span>
        <textarea className="input" rows="2" value={valeur.objectifs} onChange={set('objectifs')} placeholder="Ex. : devenir titulaire, gagner en vitesse de passe…" />
      </label>
      <fieldset className="field form-wide">
        <legend className="field-label">Critères prioritaires (pris en compte dans les recommandations)</legend>
        <div className="seg">
          {CRITERES.map((c) => {
            const on = (valeur.prioritaires ?? []).includes(c.id)
            return (
              <button key={c.id} type="button" className={`chip${on ? ' is-on' : ''}`} aria-pressed={on}
                onClick={() => onChange({ ...valeur, prioritaires: on ? valeur.prioritaires.filter((x) => x !== c.id) : [...(valeur.prioritaires ?? []), c.id] })}>
                {c.icon} {c.court}
              </button>
            )
          })}
        </div>
      </fieldset>
    </div>
  )
}

function NouveauJoueur({ coach }) {
  const [v, setV] = useState({ prenom: '', nom: '', poste: 1, niveau: 'intermediaire', naissance: '', matchs: '', objectifs: '', prioritaires: [] })
  const creer = (e) => {
    e.preventDefault()
    const id = coach.ajouterJoueur(v)
    window.location.hash = href('coach', `${id}-evaluer`)
  }
  return (
    <form className="fiche suivi" onSubmit={creer}>
      <nav className="fiche-nav"><a href={href('coach')}>← Effectif</a></nav>
      <header className="view-head"><div><p className="eyebrow">Espace Coach</p><h1>Nouveau joueur</h1></div></header>
      <section className="fiche-block">
        <ChampsProfil valeur={v} onChange={setV} />
        <div className="btn-row">
          <button type="submit" className="btn btn-primary">Créer et évaluer</button>
          <a className="btn btn-ghost" href={href('coach')}>Annuler</a>
        </div>
      </section>
    </form>
  )
}

// ---------------------------------------------------------------- Fiche joueur
function FicheJoueur({ joueur: j, onglet, coach }) {
  const pos = getPosition(j.poste)
  const cibles = ciblesDe(j)
  const evals = chronologique(j.evaluations)
  const d = evals.at(-1)
  const aller = (o) => { window.location.hash = href('coach', o === 'analyse' ? j.id : `${j.id}-${o}`) }

  return (
    <article className="fiche suivi">
      <nav className="fiche-nav" aria-label="Navigation"><a href={href('coach')}>← Effectif</a><a href={href('poste', j.poste)}>Fiche du poste {j.poste} →</a></nav>
      <header className="fiche-head">
        <span className={`jersey jersey-lg jersey-${pos.groupe}`}>{j.poste}</span>
        <div>
          <p className="eyebrow">{pos.nom} · {niveauLabel(j.niveau)}{j.matchs ? ` · ${j.matchs} matchs` : ''}</p>
          <h1>{nomComplet(j)}</h1>
          {j.objectifs && <p className="lede">Objectif : {j.objectifs}</p>}
        </div>
      </header>
      <nav className="tabs tabs-scroll" aria-label="Sections de la fiche">
        {ONGLETS.map((o) => (
          <a key={o.id} href={href('coach', o.id === 'analyse' ? j.id : `${j.id}-${o.id}`)} className={onglet === o.id ? 'is-on' : ''} aria-current={onglet === o.id ? 'page' : undefined}>{o.label}</a>
        ))}
      </nav>

      {onglet === 'analyse' && (d ? <OngletAnalyse j={j} evals={evals} cibles={cibles} /> : (
        <section className="fiche-block vide">
          <h2>Pas encore d’évaluation</h2>
          <p>Commencez par l’évaluation de début de saison : 13 critères notés de 1 à 10.</p>
          <button type="button" className="btn btn-primary" onClick={() => aller('evaluer')}>Évaluer {j.prenom}</button>
        </section>
      ))}
      {onglet === 'evaluer' && <OngletEvaluer j={j} cibles={cibles} coach={coach} aller={aller} />}
      {onglet === 'evolution' && (
        <>
          <section className="fiche-block">
            <h2>Courbe de progression</h2>
            <Evolution evaluations={j.evaluations} cibles={cibles}
              onOuvrir={(e) => { try { sessionStorage.setItem('rugbyapp.modif', e.id) } catch { /* indisponible */ } aller('evaluer') }}
              onSupprimer={(evId) => coach.supprimerEvaluation(j.id, evId)} />
          </section>
          <section className="fiche-block">
            <h2>Bilan de saison</h2>
            <BilanSaison evaluations={j.evaluations} />
          </section>
        </>
      )}
      {onglet === 'profil' && <OngletProfil j={j} coach={coach} />}
    </article>
  )
}

function OngletAnalyse({ j, evals, cibles }) {
  const d = evals.at(-1)
  const prec = evals.at(-2)
  const a = analyser(d.notes, cibles)
  const p = progression(evals)
  const recos = recommandations({ notes: d.notes, cibles, poste: j.poste, objectifs: (j.prioritaires ?? []).map((critere) => ({ critere })) })
  return (
    <div className="suivi-stack">
      <p className="muted">Dernière évaluation : {getPeriode(d.periode).label}, {dateFr(d.date)}.{d.commentaire && ` « ${d.commentaire} »`}</p>
      <Kpis items={[
        { label: 'Note moyenne', valeur: fmt(moyenne(d.notes)), unite: '/10', detail: `cible du poste : ${fmt(moyenne(cibles))}` },
        { label: 'Attentes du poste atteintes', valeur: a.atteints, unite: `/${a.notes}`, ton: a.conformite >= 0.7 ? 'good' : a.conformite < 0.4 ? 'bad' : '' },
        { label: 'Écart moyen à la cible', valeur: signe(a.ecartMoyen), ton: a.ecartMoyen >= 0 ? 'good' : a.ecartMoyen < -1.5 ? 'bad' : '' },
        { label: 'Progression', valeur: p ? signe(p.delta) : '—', detail: p ? `depuis le ${dateFr(p.depuis.date)}` : 'une seule évaluation', ton: p && p.delta > 0 ? 'good' : p && p.delta < 0 ? 'bad' : '' },
      ]} />
      <Analyse notes={d.notes} cibles={cibles} precedente={prec} />
      <section className="fiche-block">
        <h2>Exigences clés du poste</h2>
        <Exigences poste={j.poste} cibles={cibles} />
      </section>
      <section className="fiche-block">
        <h2>Recommandations pour {j.prenom}</h2>
        <p className="muted">Calculées d’après le poste ({getPosition(j.poste).nom}), le niveau {niveauLabel(j.niveau).toLowerCase()} et les critères prioritaires.</p>
        <Recommandations recos={recos} />
      </section>
    </div>
  )
}

function OngletEvaluer({ j, cibles, coach, aller }) {
  // Une évaluation à modifier peut être transmise depuis l'onglet Évolution.
  const [modifId] = useState(() => {
    try {
      const id = sessionStorage.getItem('rugbyapp.modif')
      sessionStorage.removeItem('rugbyapp.modif')
      return id
    } catch {
      return null
    }
  })
  const aModifier = j.evaluations.find((e) => e.id === modifId)
  const depart = aModifier ?? derniere(j.evaluations)
  return (
    <section className="fiche-block">
      <h2>{aModifier ? 'Modifier l’évaluation' : `Évaluer ${j.prenom}`}</h2>
      <FormEvaluation key={aModifier?.id ?? 'nouvelle'} depart={depart} modification={!!aModifier} cibles={cibles}
        onEnregistrer={(ev) => { coach.enregistrerEvaluation(j.id, ev); aller('analyse') }}
        onAnnuler={() => aller('analyse')} />
    </section>
  )
}

function OngletProfil({ j, coach }) {
  const [v, setV] = useState({ prenom: j.prenom, nom: j.nom, poste: j.poste, niveau: j.niveau, naissance: j.naissance ?? '', matchs: j.matchs ?? '', objectifs: j.objectifs ?? '', prioritaires: j.prioritaires ?? [] })
  const [ok, setOk] = useState('')
  const defaut = ciblesPour(v.poste, v.niveau)
  const [cibles, setCibles] = useState(() => ({ ...defaut, ...(j.cibles ?? {}) }))
  const enregistrer = (e) => {
    e.preventDefault()
    // On ne garde que les cibles qui diffèrent du profil par défaut.
    const ajust = Object.fromEntries(Object.entries(cibles).filter(([k, x]) => x !== defaut[k]))
    coach.modifierJoueur(j.id, { ...v, cibles: Object.keys(ajust).length ? ajust : null })
    setOk('Profil enregistré.')
  }
  const supprimer = () => {
    if (window.confirm(`Supprimer ${nomComplet(j)} et toutes ses évaluations ?`)) {
      coach.supprimerJoueur(j.id)
      window.location.hash = href('coach')
    }
  }
  return (
    <form className="suivi-stack" onSubmit={enregistrer}>
      <section className="fiche-block">
        <h2>Identité et objectifs</h2>
        <ChampsProfil valeur={v} onChange={(n) => { if (n.poste !== v.poste || n.niveau !== v.niveau) setCibles(ciblesPour(n.poste, n.niveau)); setV(n); setOk('') }} />
      </section>
      <section className="fiche-block">
        <h2>Cibles du poste</h2>
        <p className="muted">Profil attendu pour un {getPosition(v.poste).nom.toLowerCase()} de niveau {niveauLabel(v.niveau).toLowerCase()}. Ajustez-le selon votre projet de jeu.</p>
        <ul className="cibles">
          {CRITERES.map((c) => (
            <li key={c.id}>
              <span>{c.icon} {c.label}</span>
              <input type="range" min="1" max="10" value={cibles[c.id]} onChange={(e) => { setCibles({ ...cibles, [c.id]: Number(e.target.value) }); setOk('') }} aria-label={`Cible ${c.label}`} />
              <span className={`meter-text${cibles[c.id] !== defaut[c.id] ? ' is-ajuste' : ''}`}>{cibles[c.id]}{cibles[c.id] !== defaut[c.id] && <small> (réf. {defaut[c.id]})</small>}</span>
            </li>
          ))}
        </ul>
        <button type="button" className="link-btn" onClick={() => setCibles(defaut)}>Revenir au profil de référence</button>
      </section>
      <div className="btn-row">
        <button type="submit" className="btn btn-primary">Enregistrer</button>
        <button type="button" className="btn btn-ghost btn-danger" onClick={supprimer}>Supprimer le joueur</button>
        <span className="save-msg" role="status">{ok}</span>
      </div>
    </form>
  )
}
