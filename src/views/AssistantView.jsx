import { useEffect, useRef, useState } from 'react'
import { repondre, EXEMPLES, TYPES } from '../lib/assistant.js'
import ScenarioPlayer from '../components/ScenarioPlayer.jsx'
import Quiz from '../components/quiz/Quiz.jsx'
import { Figure } from './SignesView.jsx'

// Assistant Rugby : #assistant. Le joueur pose une question, l'assistant répond avec la fiche
// la plus proche (explication, schéma animé, quiz express) et propose des fiches voisines.
// La recherche est faite sur l'appareil (lib/assistant.js) : aucun service extérieur, fonctionne hors ligne.

function Reponse({ echange, onAsk }) {
  const { reponse } = echange
  if (!reponse) {
    return (
      <div className="assist-bubble assist-bot">
        <p>Je n’ai pas trouvé de fiche sur ce sujet. Essaie avec un poste (« le 9 »), une règle (« le maul »),
          une combinaison (« la croisée ») ou un geste de l’arbitre.</p>
        <Exemples onAsk={onAsk} />
      </div>
    )
  }
  const { fiche: f, voirAussi, questions } = reponse
  return (
    <article className="assist-answer">
      <header>
        <p className="eyebrow">{TYPES[f.type]}</p>
        <h2>{f.titre}</h2>
        <p className="lede">{f.resume}</p>
      </header>
      <div className="terrain-layout">
        {f.scenario
          ? <ScenarioPlayer scenario={f.scenario} ariaLabel={`Schéma animé : ${f.titre}`} />
          : f.signe && <div className="assist-signe"><Figure signe={f.signe} /></div>}
        <aside className="panel combi-panel">
          <h3>{f.type === 'poste' ? 'Missions' : f.type === 'signe' ? 'Le geste' : 'À retenir'}</h3>
          <ul className="bullets">{f.points.map((p) => <li key={p}>{p}</li>)}</ul>
          <h3>{f.extra.label}</h3>
          <p className="tip-line">{f.extra.texte}</p>
          <a className="btn btn-ghost" href={f.lien}>Ouvrir la fiche complète</a>
        </aside>
      </div>
      {questions.length > 0 && (
        <section className="fiche-block">
          <h2>Quiz express</h2>
          <Quiz questions={questions} />
        </section>
      )}
      {voirAussi.length > 0 && (
        <div className="assist-related">
          <span className="muted">Voir aussi :</span>
          {voirAussi.map((x) => (
            <button key={`${x.type}-${x.id}`} type="button" className="chip" onClick={() => onAsk(x.titre.replace(/^\d+ · /, ''), x)}>
              {x.titre} <small>· {TYPES[x.type]}</small>
            </button>
          ))}
        </div>
      )}
    </article>
  )
}

function Exemples({ onAsk }) {
  return (
    <div className="assist-related">
      {EXEMPLES.map((e) => (
        <button key={e} type="button" className="chip" onClick={() => onAsk(e)}>{e}</button>
      ))}
    </div>
  )
}

export default function AssistantView() {
  const [texte, setTexte] = useState('')
  const [echanges, setEchanges] = useState([])
  const fin = useRef(null)
  const dernier = echanges[echanges.length - 1]

  useEffect(() => {
    if (dernier) fin.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }, [dernier])

  // fiche : quand on clique sur « Voir aussi », on affiche directement cette fiche.
  const demander = (question, fiche = null) => {
    const q = question.trim()
    if (!q) return
    let reponse = repondre(q)
    if (fiche && reponse?.fiche !== fiche) reponse = { fiche, voirAussi: [], questions: fiche.questions?.slice(0, 3) ?? [] }
    setEchanges((liste) => [...liste, { id: Date.now(), question: q, reponse }])
    setTexte('')
  }

  return (
    <div className="assist">
      <header className="view-head">
        <div>
          <p className="eyebrow">Assistant</p>
          <h1>Assistant Rugby</h1>
          <p className="lede">Pose ta question sur un poste, une règle, une combinaison ou un geste de l’arbitre :
            tu reçois une explication, un schéma animé et un quiz.</p>
        </div>
      </header>

      {echanges.length === 0 && (
        <section className="assist-start">
          <p className="muted">Quelques idées pour commencer :</p>
          <Exemples onAsk={demander} />
        </section>
      )}

      <ol className="assist-log">
        {echanges.map((e, i) => {
          const actuel = i === echanges.length - 1
          return (
            <li key={e.id} ref={actuel ? fin : null}>
              <p className="assist-bubble assist-user">{e.question}</p>
              {actuel
                ? <Reponse echange={e} onAsk={demander} />
                : (
                  <button type="button" className="assist-bubble assist-bot assist-past" onClick={() => demander(e.question)}>
                    {e.reponse ? <><strong>{e.reponse.fiche.titre}</strong> · {TYPES[e.reponse.fiche.type]} <span className="muted">· revoir</span></> : 'Pas de fiche trouvée'}
                  </button>
                )}
            </li>
          )
        })}
      </ol>

      <form className="assist-form" onSubmit={(ev) => { ev.preventDefault(); demander(texte) }}>
        <label className="sr-only" htmlFor="assist-question">Ta question</label>
        <input id="assist-question" className="input" value={texte} onChange={(ev) => setTexte(ev.target.value)} placeholder="Ex. : explique-moi le rôle du numéro 8" autoComplete="off" />
        <button type="submit" className="btn btn-primary" disabled={!texte.trim()}>Demander</button>
      </form>
    </div>
  )
}
