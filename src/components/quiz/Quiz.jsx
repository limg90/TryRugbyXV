import { useState } from 'react'
import { useApp } from '../../lib/AppContext.jsx'
import { TYPES } from '../../data/quiz.js'
import QuestionQcm from './QuestionQcm.jsx'
import QuestionGlisser from './QuestionGlisser.jsx'
import QuestionTerrain from './QuestionTerrain.jsx'
import Decision from './Decision.jsx'

// Moteur de quiz : une question à la fois, tous types confondus.
// Chaque réponse est enregistrée dans la progression ; onFinish(bonnes, total) à la fin.
const COMPOSANTS = { qcm: QuestionQcm, glisser: QuestionGlisser, terrain: QuestionTerrain, tactique: Decision }

function message(part) {
  if (part === 1) return 'Sans faute, bravo !'
  if (part >= 0.7) return 'Très bien, tu maîtrises le sujet.'
  if (part >= 0.4) return 'Pas mal, revois les questions manquées.'
  return 'Continue, chaque quiz te fait progresser.'
}

export default function Quiz({ questions, onFinish, onRestart, finLiens }) {
  const { noterReponse } = useApp()
  const [index, setIndex] = useState(0)
  const [resultats, setResultats] = useState([]) // true / false par question répondue
  const [fini, setFini] = useState(false)

  if (!questions.length) return <p className="muted">Aucune question disponible.</p>

  const q = questions[index]
  const repondu = resultats.length > index
  const bonnes = resultats.filter(Boolean).length

  const onAnswer = (valeur) => {
    // Choix tactique : seule la meilleure décision (note 2) compte comme juste.
    const ok = q.type === 'tactique' ? valeur === 2 : valeur
    noterReponse(q.id, ok)
    setResultats((r) => [...r, ok])
  }
  const suivante = () => {
    if (index < questions.length - 1) setIndex(index + 1)
    else {
      setFini(true)
      onFinish?.(bonnes, questions.length)
    }
  }
  const recommencer = () => {
    if (onRestart) return onRestart()
    setIndex(0)
    setResultats([])
    setFini(false)
  }

  if (fini) {
    const part = bonnes / questions.length
    return (
      <div className="quiz-end">
        <div className="quiz-score">
          <span>{bonnes} / {questions.length}</span>
          <small>{message(part)}</small>
        </div>
        <ol className="quiz-recap">
          {questions.map((x, i) => (
            <li key={x.id} className={resultats[i] ? 'is-right' : 'is-wrong'}>
              <span aria-label={resultats[i] ? 'Juste' : 'Faux'}>{resultats[i] ? '✓' : '✗'}</span>
              {x.question}
            </li>
          ))}
        </ol>
        <div className="btn-row">
          <button type="button" className="btn btn-primary" onClick={recommencer}>Recommencer</button>
          {finLiens}
        </div>
      </div>
    )
  }

  const Composant = COMPOSANTS[q.type]
  return (
    <div className="quiz">
      <div className="quiz-head">
        <span className="quiz-count">Question {index + 1}/{questions.length}</span>
        <span className="quiz-type">{TYPES[q.type]}{q.source ? ` · ${q.source}` : ''}</span>
        <span className="quiz-points">{bonnes} ✓</span>
      </div>
      <div className="quiz-progress" aria-hidden="true">
        <span style={{ width: `${((index + (repondu ? 1 : 0)) / questions.length) * 100}%` }} />
      </div>
      <Composant key={`${q.id}-${index}`} q={q} onAnswer={onAnswer} />
      {repondu && (
        <button type="button" className="btn btn-primary quiz-next" onClick={suivante}>
          {index < questions.length - 1 ? 'Question suivante' : 'Voir mon score'}
        </button>
      )}
    </div>
  )
}
