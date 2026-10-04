// Message affiché après une réponse.
export default function Retour({ ok, texte, titre }) {
  return (
    <p className={`quiz-feedback ${ok ? 'good' : 'bad'}`} role="status">
      <strong>{titre ?? (ok ? 'Bonne réponse.' : 'Pas tout à fait.')}</strong> {texte}
    </p>
  )
}
