import { href } from '../lib/router.js'
import Bibliotheque from './Bibliotheque.jsx'
import CombinaisonDetail from './CombinaisonDetail.jsx'
import Editeur from './Editeur.jsx'
import { getCombinaison } from '../data/combinaisons.js'

// Module Combinaisons : #combinaisons (bibliothèque), #combinaisons-croisee (fiche), #combinaisons-editeur.
export default function CombinaisonsView({ param }) {
  const combinaison = param && param !== 'editeur' ? getCombinaison(param) : null
  const onglet = param === 'editeur' ? 'editeur' : 'bibliotheque'
  return (
    <div className="combis">
      <nav className="tabs" aria-label="Combinaisons">
        <a href={href('combinaisons')} className={onglet === 'bibliotheque' ? 'is-on' : ''} aria-current={onglet === 'bibliotheque' ? 'page' : undefined}>Bibliothèque</a>
        <a href={href('combinaisons', 'editeur')} className={onglet === 'editeur' ? 'is-on' : ''} aria-current={onglet === 'editeur' ? 'page' : undefined}>Mon éditeur</a>
      </nav>
      {onglet === 'editeur' ? <Editeur /> : combinaison ? <CombinaisonDetail key={combinaison.id} combinaison={combinaison} /> : <Bibliotheque />}
    </div>
  )
}
