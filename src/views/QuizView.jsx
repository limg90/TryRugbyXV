import { useState } from 'react'
import { QUESTIONS, SERIES, TYPES, getSerie, quizSerie } from '../data/quiz.js'
import { NIVEAUX, useApp } from '../lib/AppContext.jsx'
import { href } from '../lib/router.js'
import Quiz from '../components/quiz/Quiz.jsx'
import MatchView from './MatchView.jsx'
import ProgressionView from './ProgressionView.jsx'

// Module Quiz : #quiz (séries), #quiz-niveau (une série), #quiz-match, #quiz-match-defense, #quiz-progression.

function Hub() {
  const { niveau } = useApp()
  const label = NIVEAUX.find((n) => n.id === niveau)?.label
  return (
    <div className="biblio">
      <header className="view-head">
        <div>
          <p className="eyebrow">Quiz</p>
          <h1>Teste tes connaissances</h1>
          <p className="lede">QCM, glisser-déposer, positionnement sur le terrain et choix tactiques. Chaque bonne réponse compte pour tes badges.</p>
        </div>
      </header>
      <div className="serie-grid">
        {SERIES.map((s) => {
          const n = s.filtre ? QUESTIONS.filter(s.filtre).length : null
          return (
            <a key={s.id} href={href('quiz', s.id)} className={`serie-card${s.id === 'niveau' ? ' is-featured' : ''}`}>
              <strong>{s.titre}</strong>
              <span>{s.description}</span>
              <small>{s.id === 'niveau' ? `Niveau ${label} · 10 questions` : `${Math.min(n, 10)} questions sur ${n}`}</small>
            </a>
          )
        })}
      </div>
      <p className="muted">Types de questions : {Object.values(TYPES).join(', ')}.</p>
    </div>
  )
}

function Serie({ serie }) {
  const { niveau, progression } = useApp()
  const [tirage, setTirage] = useState(0)
  // Le tirage est figé pour la série en cours ; « Recommencer » en refait un.
  const [questions, setQuestions] = useState(() => quizSerie(serie, niveau, progression.reponses))
  const recommencer = () => {
    setQuestions(quizSerie(serie, niveau, progression.reponses))
    setTirage((t) => t + 1)
  }
  return (
    <div className="quiz-page">
      <div className="fiche-nav">
        <a href={href('quiz')}>← Toutes les séries</a>
      </div>
      <header className="view-head">
        <div>
          <p className="eyebrow">Quiz</p>
          <h1>{serie.titre}</h1>
          <p className="lede">{serie.description}</p>
        </div>
      </header>
      <div className="fiche-block quiz-card">
        <Quiz
          key={tirage}
          questions={questions}
          onRestart={recommencer}
          finLiens={<a className="btn btn-ghost" href={href('quiz', 'progression')}>Mes badges</a>}
        />
      </div>
    </div>
  )
}

export default function QuizView({ param }) {
  const onglet = param?.startsWith('match') ? 'match' : param === 'progression' ? 'progression' : 'quiz'
  const serie = onglet === 'quiz' && param ? getSerie(param) : null
  let contenu
  if (onglet === 'match') contenu = <MatchView matchId={param.replace(/^match-?/, '') || null} />
  else if (onglet === 'progression') contenu = <ProgressionView />
  else if (serie) contenu = <Serie key={serie.id} serie={serie} />
  else contenu = <Hub />
  return (
    <div className="combis">
      <nav className="tabs" aria-label="Quiz">
        <a href={href('quiz')} className={onglet === 'quiz' ? 'is-on' : ''} aria-current={onglet === 'quiz' ? 'page' : undefined}>Quiz</a>
        <a href={href('quiz', 'match')} className={onglet === 'match' ? 'is-on' : ''} aria-current={onglet === 'match' ? 'page' : undefined}>Mode match</a>
        <a href={href('quiz', 'progression')} className={onglet === 'progression' ? 'is-on' : ''} aria-current={onglet === 'progression' ? 'page' : undefined}>Progression</a>
      </nav>
      {contenu}
    </div>
  )
}
