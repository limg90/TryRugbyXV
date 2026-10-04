const MODULES = {
  assistant: {
    titre: 'Assistant Rugby',
    texte: 'Posez une question (« Explique-moi le rôle du numéro 8 ») et recevez une explication, un schéma animé et un quiz.',
  },
}

export default function ComingSoon({ name }) {
  const m = MODULES[name]
  return (
    <div className="soon">
      <p className="eyebrow">Bientôt</p>
      <h1>{m.titre}</h1>
      <p className="lede">{m.texte}</p>
      <a className="btn btn-primary" href="#terrain">Retour au terrain</a>
    </div>
  )
}

export const SOON_MODULES = Object.keys(MODULES)
