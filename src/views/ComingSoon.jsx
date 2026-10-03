const MODULES = {
  combinaisons: {
    titre: 'Combinaisons',
    texte: 'La bibliothèque de combinaisons (avants, trois-quarts, sorties de mêlée et de touche) avec vitesse réglable, ainsi que l’éditeur pour dessiner et rejouer vos propres combinaisons.',
  },
  regles: {
    titre: 'Règles',
    texte: 'Les modules Débutant et Expert : chaque règle avec une explication simple, un schéma animé, une vidéo et un quiz.',
  },
  quiz: {
    titre: 'Quiz et match',
    texte: 'Les quiz adaptés à votre niveau, le mode match à décisions et les badges de progression.',
  },
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
