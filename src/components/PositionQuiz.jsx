import { useState } from 'react'

// Petit QCM de situations de match pour un poste.
// Le fil « Quiz et progression » pourra remplacer ce composant par le moteur de quiz complet.
export default function PositionQuiz({ questions, numero }) {
  const [answers, setAnswers] = useState({})
  const score = questions.filter((q, i) => answers[i] === q.bonne).length
  const done = Object.keys(answers).length === questions.length
  return (
    <div className="quiz">
      {questions.map((q, i) => {
        const a = answers[i]
        return (
          <fieldset key={`${numero}-${i}`} className="quiz-q">
            <legend>{q.question}</legend>
            <div className="quiz-choices">
              {q.choix.map((c, j) => {
                const state = a == null ? '' : j === q.bonne ? 'is-right' : j === a ? 'is-wrong' : 'is-faded'
                return (
                  <button key={j} type="button" className={`quiz-choice ${state}`} disabled={a != null} onClick={() => setAnswers((s) => ({ ...s, [i]: j }))}>
                    <span className="quiz-letter">{String.fromCharCode(65 + j)}</span>
                    {c}
                  </button>
                )
              })}
            </div>
            {a != null && (
              <p className={`quiz-feedback ${a === q.bonne ? 'good' : 'bad'}`}>
                <strong>{a === q.bonne ? 'Bonne réponse.' : 'Pas tout à fait.'}</strong> {q.explication}
              </p>
            )}
          </fieldset>
        )
      })}
      {done && (
        <div className="quiz-score">
          <span>{score} / {questions.length}</span>
          <button type="button" className="btn btn-ghost" onClick={() => setAnswers({})}>Recommencer</button>
        </div>
      )}
    </div>
  )
}
