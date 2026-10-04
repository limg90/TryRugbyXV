import { useState } from 'react'
import Retour from './Retour.jsx'

// QCM : un clic sur un choix donne la réponse.
export default function QuestionQcm({ q, onAnswer }) {
  const [choix, setChoix] = useState(null)
  const repondre = (j) => {
    setChoix(j)
    onAnswer(j === q.bonne)
  }
  return (
    <div className="quiz-q">
      <p className="quiz-question">{q.question}</p>
      <div className="quiz-choices">
        {q.choix.map((c, j) => {
          const state = choix == null ? '' : j === q.bonne ? 'is-right' : j === choix ? 'is-wrong' : 'is-faded'
          return (
            <button key={j} type="button" className={`quiz-choice ${state}`} disabled={choix != null} onClick={() => repondre(j)}>
              <span className="quiz-letter">{String.fromCharCode(65 + j)}</span>
              {c}
            </button>
          )
        })}
      </div>
      {choix != null && <Retour ok={choix === q.bonne} texte={q.explication} />}
    </div>
  )
}
