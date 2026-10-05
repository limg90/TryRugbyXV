// Référentiel d'évaluation : 13 critères notés de 1 à 10 (repris des fiches de suivi du club),
// regroupés en 4 familles, profils cibles des 15 postes pour un joueur U18, et banque d'exercices.
//
// Les cibles ci-dessous correspondent au niveau « Avancé » ; elles baissent de 1 (Intermédiaire)
// ou 2 points (Débutant). Le coach peut les ajuster joueur par joueur.

import { href } from '../lib/router.js'

export const CRITERES = [
  { id: 'technique', court: 'Technique', label: 'Technique', icon: '⚙️', famille: 'technique', aide: 'Passe, réception, plaquage, gestes du poste.' },
  { id: 'jeu_offensif', court: 'Attaque', label: 'Jeu offensif', icon: '🏉', famille: 'technique', aide: 'Avancer, fixer, faire la passe au bon moment, finir.' },
  { id: 'jeu_defensif', court: 'Défense', label: 'Jeu défensif', icon: '🧱', famille: 'technique', aide: 'Plaquer, monter en ligne, se replacer, gratter.' },
  { id: 'jeu_collectif', court: 'Collectif', label: 'Jeu collectif', icon: '🔵', famille: 'tactique', aide: 'Soutien, placement par rapport aux partenaires, jouer pour l’équipe.' },
  { id: 'adaptation', court: 'Projet de jeu', label: 'Adaptation au projet de jeu', icon: '📐', famille: 'tactique', aide: 'Connaître les combinaisons, lire le jeu, faire le bon choix.' },
  { id: 'communication', court: 'Communication', label: 'Communication terrain', icon: '💬', famille: 'tactique', aide: 'Annoncer, appeler le ballon, guider la défense.' },
  { id: 'puissance', court: 'Puissance', label: 'Puissance physique', icon: '💪', famille: 'physique', aide: 'Force et explosivité au contact.' },
  { id: 'cardio', court: 'Cardio', label: 'Cardio et vitesse', icon: '❤️', famille: 'physique', aide: 'Courir longtemps et vite, récupérer entre les efforts.' },
  { id: 'effort', court: 'Effort', label: 'Gestion de l’effort', icon: '⚡', famille: 'physique', aide: 'Répéter les efforts intenses et doser son énergie sur le match.' },
  { id: 'mental', court: 'Mental', label: 'Mental', icon: '🧠', famille: 'mental', aide: 'Concentration, confiance, réaction après une erreur.' },
  { id: 'lead', court: 'Leadership', label: 'Leadership', icon: '🧑‍🤝‍🧑', famille: 'mental', aide: 'Entraîner les autres, prendre la parole, montrer l’exemple.' },
  { id: 'assiduite', court: 'Assiduité', label: 'Assiduité', icon: '📅', famille: 'mental', aide: 'Présence et sérieux aux entraînements.' },
  { id: 'valeurs', court: 'Valeurs', label: 'Valeurs du club / Entraide', icon: '💎', famille: 'mental', aide: 'Respect, discipline, aide aux coéquipiers.' },
]

export const FAMILLES = [
  { id: 'technique', label: 'Technique', icon: '⚙️' },
  { id: 'tactique', label: 'Tactique', icon: '📐' },
  { id: 'physique', label: 'Physique', icon: '💪' },
  { id: 'mental', label: 'Mental', icon: '🧠' },
]

export const getCritere = (id) => CRITERES.find((c) => c.id === id)

// Échelle de notation commune au coach et au joueur.
export const ECHELLE = [
  { min: 1, max: 2, label: 'Insuffisant', detail: 'non maîtrisé' },
  { min: 3, max: 4, label: 'En développement', detail: 'réussi parfois' },
  { min: 5, max: 6, label: 'Niveau attendu', detail: 'réussi le plus souvent' },
  { min: 7, max: 8, label: 'Très bon niveau', detail: 'point d’appui pour l’équipe' },
  { min: 9, max: 10, label: 'Niveau supérieur', detail: 'au-dessus de la catégorie' },
]
export const niveauDeNote = (n) => ECHELLE.find((e) => n >= e.min && n <= e.max)

export const PERIODES = [
  { id: 'debut', label: 'Début de saison', court: 'Début' },
  { id: 'mi', label: 'Mi-saison', court: 'Mi-saison' },
  { id: 'fin', label: 'Fin de saison', court: 'Fin' },
  { id: 'libre', label: 'Point d’étape', court: 'Étape' },
]
export const getPeriode = (id) => PERIODES.find((p) => p.id === id) ?? PERIODES[3]

// Ordre des valeurs : technique, offensif, défensif, collectif, adaptation, communication,
// puissance, cardio, effort, mental, lead, assiduité, valeurs.
const ORDRE = CRITERES.map((c) => c.id)
const profil = (...v) => Object.fromEntries(ORDRE.map((id, i) => [id, v[i]]))

export const PROFILS = {
  1: {
    cible: profil(7, 5, 7, 7, 6, 6, 9, 6, 7, 7, 5, 8, 8),
    exigences: [
      { critere: 'puissance', texte: 'Tenir la mêlée côté gauche et gagner les collisions au ras des rucks.' },
      { critere: 'technique', texte: 'Posture de mêlée sûre (dos plat, tête haute) et lift propre en touche.' },
      { critere: 'effort', texte: 'Enchaîner mêlée, ruck et plaquage sans baisser d’intensité.' },
    ],
  },
  2: {
    cible: profil(8, 6, 7, 8, 7, 8, 8, 7, 7, 7, 7, 8, 8),
    exigences: [
      { critere: 'technique', texte: 'Lancer en touche précis à 5, 7 et 10 mètres, même fatigué.' },
      { critere: 'communication', texte: 'Relais des annonces entre le pack et la charnière.' },
      { critere: 'jeu_collectif', texte: 'Présent dans le jeu courant : soutien, déblayage, plaquages.' },
    ],
  },
  3: {
    cible: profil(7, 5, 7, 7, 6, 6, 9, 6, 7, 7, 5, 8, 8),
    exigences: [
      { critere: 'puissance', texte: 'Pilier de la mêlée : il supporte la poussée de deux adversaires.' },
      { critere: 'technique', texte: 'Tenir l’axe en mêlée en toute sécurité, sans relever la tête.' },
      { critere: 'jeu_defensif', texte: 'Plaquer bas au ras des rucks et se relever vite.' },
    ],
  },
  4: {
    cible: profil(7, 5, 8, 7, 7, 7, 8, 7, 8, 7, 6, 8, 8),
    exigences: [
      { critere: 'technique', texte: 'Sauter et capter en touche, réceptionner les coups d’envoi.' },
      { critere: 'effort', texte: 'Volume de rucks et de plaquages élevé sur tout le match.' },
      { critere: 'puissance', texte: 'Pousser en mêlée et conduire le maul.' },
    ],
  },
  5: {
    cible: profil(7, 5, 8, 7, 8, 8, 8, 7, 8, 7, 7, 8, 8),
    exigences: [
      { critere: 'communication', texte: 'Annonce les combinaisons de touche et organise l’alignement.' },
      { critere: 'adaptation', texte: 'Lit l’alignement adverse pour choisir le bon sauteur.' },
      { critere: 'jeu_defensif', texte: 'Contre en touche et plaque au ras.' },
    ],
  },
  6: {
    cible: profil(7, 6, 9, 7, 7, 7, 8, 8, 8, 7, 6, 8, 8),
    exigences: [
      { critere: 'jeu_defensif', texte: 'Plaqueur numéro un : il couvre le côté fermé et monte vite.' },
      { critere: 'cardio', texte: 'Se détache de la mêlée et arrive le premier sur le porteur.' },
      { critere: 'puissance', texte: 'Gagne les impacts en attaque comme en défense.' },
    ],
  },
  7: {
    cible: profil(8, 6, 9, 8, 8, 7, 7, 9, 8, 8, 6, 8, 8),
    exigences: [
      { critere: 'jeu_defensif', texte: 'Gratteur : récupère le ballon au sol, légalement, avant le ruck.' },
      { critere: 'cardio', texte: 'Le plus rapide des avants, toujours en soutien du porteur.' },
      { critere: 'jeu_collectif', texte: 'Ligne de course intérieure pour recevoir après une percée.' },
    ],
  },
  8: {
    cible: profil(8, 8, 8, 8, 8, 7, 8, 8, 8, 8, 7, 8, 8),
    exigences: [
      { critere: 'jeu_offensif', texte: 'Porteur de balle qui fait avancer l’équipe en sortie de mêlée.' },
      { critere: 'technique', texte: 'Contrôle du ballon en fond de mêlée et sortie 8-9.' },
      { critere: 'adaptation', texte: 'Choisit entre jouer seul, servir le 9 ou fixer.' },
    ],
  },
  9: {
    cible: profil(9, 8, 6, 8, 8, 9, 5, 8, 8, 8, 8, 8, 8),
    exigences: [
      { critere: 'technique', texte: 'Passe rapide et précise depuis le sol, des deux côtés.' },
      { critere: 'communication', texte: 'Dicte le tempo à chaque ruck et parle sans arrêt aux avants.' },
      { critere: 'cardio', texte: 'Présent sur chaque regroupement : le plus gros volume de courses.' },
    ],
  },
  10: {
    cible: profil(9, 9, 6, 9, 9, 9, 5, 7, 7, 9, 9, 8, 8),
    exigences: [
      { critere: 'adaptation', texte: 'Choisit l’option : jeu au pied, jeu à la main, combinaison.' },
      { critere: 'lead', texte: 'Organise l’attaque et annonce les lancements.' },
      { critere: 'mental', texte: 'Décide vite et reste lucide sous la pression.' },
    ],
  },
  11: {
    cible: profil(7, 9, 7, 6, 7, 6, 6, 9, 7, 7, 5, 8, 8),
    exigences: [
      { critere: 'cardio', texte: 'Vitesse de pointe : le critère qui fait la différence au poste.' },
      { critere: 'jeu_offensif', texte: 'Finisseur : convertit le moindre espace en essai.' },
      { critere: 'jeu_defensif', texte: 'Couvre les coups de pied et plaque dans les grands espaces.' },
    ],
  },
  12: {
    cible: profil(8, 8, 8, 8, 8, 7, 8, 8, 7, 8, 7, 8, 8),
    exigences: [
      { critere: 'jeu_offensif', texte: 'Fixe la défense et libère le ballon au contact.' },
      { critere: 'jeu_defensif', texte: 'Plaqueur fiable dans le couloir du 10 adverse.' },
      { critere: 'adaptation', texte: 'Deuxième relais du 10 : appelle les combinaisons de trois-quarts.' },
    ],
  },
  13: {
    cible: profil(8, 9, 8, 8, 8, 7, 7, 8, 7, 8, 6, 8, 8),
    exigences: [
      { critere: 'jeu_offensif', texte: 'Cherche l’intervalle et crée le surnombre pour les ailiers.' },
      { critere: 'jeu_defensif', texte: 'Gère la défense glissée : le couloir le plus exposé.' },
      { critere: 'technique', texte: 'Passe sous pression et passe après contact.' },
    ],
  },
  14: {
    cible: profil(7, 9, 7, 6, 7, 6, 6, 9, 7, 7, 5, 8, 8),
    exigences: [
      { critere: 'cardio', texte: 'Vitesse de pointe répétée sur tout le match.' },
      { critere: 'jeu_offensif', texte: 'Finisseur côté droit : appelle le ballon au large.' },
      { critere: 'adaptation', texte: 'Se replace en couverture dès que le ballon est perdu.' },
    ],
  },
  15: {
    cible: profil(8, 8, 8, 8, 8, 8, 6, 8, 7, 8, 7, 8, 8),
    exigences: [
      { critere: 'technique', texte: 'Réception des ballons hauts et jeu au pied long.' },
      { critere: 'communication', texte: 'Dernier défenseur : il voit tout et replace la ligne.' },
      { critere: 'jeu_offensif', texte: 'Intrusion dans la ligne pour créer le surnombre.' },
    ],
  },
}

export const DECALAGE_NIVEAU = { debutant: -2, intermediaire: -1, avance: 0 }

// Cible de chaque critère pour un poste et un niveau, avec les ajustements éventuels du coach.
export function ciblesPour(poste, niveau = 'intermediaire', ajustements = null) {
  const base = PROFILS[poste]?.cible ?? PROFILS[10].cible
  const d = DECALAGE_NIVEAU[niveau] ?? 0
  return Object.fromEntries(ORDRE.map((id) => [id, ajustements?.[id] ?? Math.max(3, base[id] + d)]))
}

// Banque d'exercices par critère. « lien » renvoie vers un contenu de l'application.
// La fiche du poste est ajoutée automatiquement pour les critères techniques.
export const EXERCICES = {
  technique: [
    { titre: 'Passes en mouvement à 3', duree: '15 min', description: 'Trois joueurs en escalier sur 30 mètres, passes vers l’arrière à pleine course. 6 allers, en changeant de main à chaque passage.' },
    { titre: 'Plaquage au bouclier', duree: '10 min', description: 'Joue contre la hanche, bras serrés, pieds qui continuent. 3 séries de 6 plaquages de chaque épaule.' },
  ],
  jeu_offensif: [
    { titre: 'Fixer-passer à 2 contre 1', duree: '15 min', description: 'Couloir de 10 mètres : attaquer l’épaule intérieure du défenseur, passer au dernier moment. Compter les essais sur 10 tentatives.', lien: { label: 'Voir la croisée', to: href('combinaisons', 'croisee') } },
    { titre: 'Lecture des intervalles', duree: '10 min', description: 'Regarder la combinaison « Loop » au ralenti puis la rejouer à 3 contre 2.', lien: { label: 'Voir le loop', to: href('combinaisons', 'loop') } },
  ],
  jeu_defensif: [
    { titre: 'Défense glissée 4 contre 5', duree: '15 min', description: 'Monter ensemble, glisser vers l’extérieur et parler à chaque passe adverse.', lien: { label: 'Voir la défense glissée', to: href('combinaisons', 'defense-glissee') } },
    { titre: 'Ligne de hors-jeu', duree: '5 min', description: 'Revoir où se place la ligne de hors-jeu au ruck et réussir le quiz de la règle.', lien: { label: 'Règle du hors-jeu', to: href('regles', 'hors-jeu') } },
  ],
  jeu_collectif: [
    { titre: 'Pods de 3', duree: '15 min', description: 'Par trois, avancer contre des boucliers puis recycler vite. Le joueur sans ballon se place à 2 mètres du porteur.', lien: { label: 'Voir le pod de 3', to: href('combinaisons', 'pod-de-3') } },
    { titre: 'Placement sur le terrain', duree: '10 min', description: 'Série de quiz « Positionnement » : retrouver sa place à chaque phase.', lien: { label: 'Quiz positionnement', to: href('quiz', 'terrain') } },
  ],
  adaptation: [
    { titre: 'Mode match', duree: '15 min', description: 'Jouer un match interactif et viser 70 % des points sur les choix tactiques.', lien: { label: 'Jouer un match', to: href('quiz', 'match') } },
    { titre: 'Choix tactiques', duree: '10 min', description: 'Série « Choix tactiques » : regarder l’action, choisir la meilleure option.', lien: { label: 'Quiz tactique', to: href('quiz', 'tactique') } },
  ],
  communication: [
    { titre: 'Annonces de touche', duree: '10 min', description: 'Sur la ligne, une annonce différente à chaque lancer ; l’alignement doit répondre à voix haute.', lien: { label: 'Voir la touche', to: href('combinaisons', 'touche') } },
    { titre: 'Défense parlée', duree: '10 min', description: 'En défense, chaque joueur annonce son vis-à-vis (« j’ai le 10 ! ») avant la montée. Pas d’annonce, pas de montée.' },
  ],
  puissance: [
    { titre: 'Circuit gainage et poussée', duree: '20 min', description: 'Planche 30 s, poussée au sac 5 s, squats sautés ×8, pompes ×10. 4 tours, 1 min de repos.' },
    { titre: 'Duels au contact', duree: '10 min', description: 'Un contre un au bouclier : abaisser le centre de gravité, conduire les jambes sur 3 mètres.' },
  ],
  cardio: [
    { titre: 'Fractionné 30-30', duree: '15 min', description: '30 s de course rapide, 30 s de marche. 2 séries de 8, 3 min de récupération entre les séries.' },
    { titre: 'Sprints répétés', duree: '10 min', description: '8 sprints de 20 mètres, départ au sol, retour en marchant.' },
  ],
  effort: [
    { titre: 'Enchaînement plaquage-relevé-sprint', duree: '10 min', description: 'Plaquer un bouclier, se relever, sprinter 10 mètres, toucher un ruck. 6 répétitions, 40 s de repos.' },
    { titre: 'Récupération active', duree: '10 min', description: 'Après chaque effort intense, respirer par le ventre et marcher 20 s avant de repartir. Noter sa sensation de 1 à 10.' },
  ],
  mental: [
    { titre: 'Routine après erreur', duree: '5 min', description: 'Choisir un geste (taper dans les mains, mot-clé) pour tourner la page après un en-avant ou un raté, et l’utiliser à chaque entraînement.' },
    { titre: 'Décider sous pression', duree: '10 min', description: 'Quiz chronométré mentalement : répondre en moins de 5 secondes aux questions de son niveau.', lien: { label: 'Quiz de mon niveau', to: href('quiz', 'niveau') } },
  ],
  lead: [
    { titre: 'Capitaine d’atelier', duree: 'chaque séance', description: 'Diriger l’échauffement ou un atelier une fois par semaine : expliquer la consigne et corriger un partenaire.' },
    { titre: 'Choisir sur pénalité', duree: '5 min', description: 'Revoir les options sur pénalité et expliquer son choix à l’équipe.', lien: { label: 'Règle de la pénalité', to: href('regles', 'penalite') } },
  ],
  assiduite: [
    { titre: 'Carnet d’entraînement', duree: '2 min', description: 'Noter après chaque séance : présent, ce que j’ai travaillé, une chose à améliorer. Viser 100 % de présence sur un mois.' },
  ],
  valeurs: [
    { titre: 'Discipline et respect', duree: '5 min', description: 'Revoir la règle « Discipline » et réussir son quiz.', lien: { label: 'Règle discipline', to: href('regles', 'discipline') } },
    { titre: 'Parrain d’un plus jeune', duree: 'chaque séance', description: 'Aider un joueur moins expérimenté sur un geste à chaque entraînement.' },
  ],
}

// Conseils du coach selon le critère, utilisés dans les recommandations.
export const CONSEILS = {
  technique: 'Travailler les gestes de base du poste en répétition, d’abord lentement puis sous pression.',
  jeu_offensif: 'Attaquer la ligne plus droit et chercher à fixer avant de passer.',
  jeu_defensif: 'Gagner en régularité au plaquage et dans la montée défensive collective.',
  jeu_collectif: 'Se rendre disponible pour le porteur : soutien proche, placement en escalier.',
  adaptation: 'Mieux connaître le projet de jeu : annonces, combinaisons et choix selon la situation.',
  communication: 'Parler plus et plus tôt : annoncer, appeler le ballon, guider la défense.',
  puissance: 'Renforcer le gainage et la force au contact, avec un travail régulier hors terrain.',
  cardio: 'Développer la capacité à répéter les courses : fractionné court deux fois par semaine.',
  effort: 'Apprendre à répéter les efforts intenses et à récupérer vite entre deux actions.',
  mental: 'Garder la concentration après une erreur et décider vite.',
  lead: 'Prendre la parole dans le groupe et montrer l’exemple à l’entraînement.',
  assiduite: 'Être présent et à l’heure à chaque séance : la progression vient de la régularité.',
  valeurs: 'Respect de l’arbitre, des partenaires et des adversaires, entraide au quotidien.',
}

export const HORIZONS = [
  { id: 'court', label: 'Court terme', detail: '4 semaines', jours: 28 },
  { id: 'moyen', label: 'Moyen terme', detail: '3 mois', jours: 90 },
  { id: 'long', label: 'Long terme', detail: 'fin de saison', jours: 270 },
]
