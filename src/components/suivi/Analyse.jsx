import Radar from './Radar.jsx'
import { Jauge, ForcesAxes, TableEcarts } from './Blocs.jsx'
import { FAMILLES } from '../../data/evaluation.js'
import { analyser, moyenneFamille } from '../../lib/analyse.js'

// Tableau de bord d'une évaluation : jauges par famille, radar cible / réel, points forts, axes, écarts.
export default function Analyse({ notes, cibles, precedente, tutoiement }) {
  const a = analyser(notes, cibles)
  const series = [
    { id: 'cible', label: 'Attendu au poste', notes: cibles, variante: 'cible' },
    precedente && { id: 'prec', label: 'Évaluation précédente', notes: precedente.notes, variante: 'prec' },
    { id: 'reel', label: tutoiement ? 'Mon niveau' : 'Niveau du joueur', notes, variante: 'reel' },
  ].filter(Boolean)

  return (
    <div className="analyse">
      <section className="fiche-block fiche-wide">
        <h2>Compétences par famille</h2>
        <div className="jauges">
          {FAMILLES.map((f) => (
            <Jauge key={f.id} label={f.label} icon={f.icon} valeur={moyenneFamille(notes, f.id)} cible={moyenneFamille(cibles, f.id)} />
          ))}
        </div>
      </section>
      <section className="fiche-block">
        <h2>Profil réel et profil cible</h2>
        <Radar series={series} titre="Radar des 13 critères : niveau attendu au poste et niveau réel" />
      </section>
      <section className="fiche-block">
        <h2>Points forts et axes d’amélioration</h2>
        <ForcesAxes analyse={a} />
      </section>
      <details className="fiche-block fiche-wide">
        <summary><h2>Bilan d’écart critère par critère</h2></summary>
        <TableEcarts analyse={a} />
      </details>
    </div>
  )
}
