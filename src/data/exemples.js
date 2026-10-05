// Effectif d'exemple pour découvrir l'Espace Coach (chargé à la demande, modifiable puis supprimable).
import { CRITERES } from './evaluation.js'

const notes = (...v) => Object.fromEntries(CRITERES.map((c, i) => [c.id, v[i]]))
const ev = (id, date, periode, n, commentaire = '') => ({ id, date, periode, notes: n, commentaire, cree: Date.parse(date) })

// Ordre des notes : technique, offensif, défensif, collectif, adaptation, communication,
// puissance, cardio, effort, mental, lead, assiduité, valeurs.
export const EXEMPLE_EFFECTIF = [
  {
    id: 'exemple9', prenom: 'Hugo', nom: 'Martin', naissance: '2009-03-14', poste: 9, niveau: 'intermediaire', matchs: '14',
    objectifs: 'Accélérer la sortie de balle et prendre plus la parole avec les avants.', prioritaires: ['communication'], cibles: null, exemple: true,
    evaluations: [
      ev('ex9a', '2025-09-08', 'debut', notes(6, 5, 4, 6, 5, 4, 4, 6, 5, 6, 4, 8, 7), 'Bonne passe mais trop discret.'),
      ev('ex9b', '2025-12-15', 'mi', notes(7, 6, 5, 7, 6, 5, 4, 7, 6, 6, 5, 8, 8)),
      ev('ex9c', '2026-03-20', 'fin', notes(8, 7, 5, 7, 7, 7, 5, 8, 7, 7, 6, 9, 8), 'Net progrès dans la communication.'),
    ],
  },
  {
    id: 'exemple3', prenom: 'Yanis', nom: 'Benali', naissance: '2008-11-02', poste: 3, niveau: 'avance', matchs: '18',
    objectifs: 'Tenir la mêlée sur 80 minutes.', prioritaires: ['effort'], cibles: null, exemple: true,
    evaluations: [
      ev('ex3a', '2025-09-10', 'debut', notes(7, 4, 6, 6, 5, 5, 8, 5, 5, 7, 5, 9, 8)),
      ev('ex3b', '2025-12-12', 'mi', notes(7, 5, 7, 7, 6, 5, 9, 5, 6, 7, 5, 9, 8), 'Mêlée solide, s’essouffle en fin de match.'),
    ],
  },
  {
    id: 'exemple14', prenom: 'Léo', nom: 'Rousseau', naissance: '2009-07-21', poste: 14, niveau: 'debutant', matchs: '6',
    objectifs: 'Gagner en confiance au plaquage.', prioritaires: ['jeu_defensif'], cibles: null, exemple: true,
    evaluations: [
      ev('ex14a', '2026-09-09', 'debut', notes(5, 7, 3, 5, 4, 3, 4, 8, 5, 5, 3, 7, 7), 'Très rapide, appréhende le contact.'),
    ],
  },
]
