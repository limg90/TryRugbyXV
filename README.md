# Rugbyapp

Application web pour apprendre le rugby (U18) : terrain interactif, postes, combinaisons, règles, quiz.
React 19 + Vite + Framer Motion, terrain en SVG, PWA utilisable hors ligne.

## Lancer

```bash
npm install
npm run dev            # développement
npm run build          # build de production (dist/, avec service worker)
npm run preview        # sert dist/
npm run build:preview  # page unique preview/rugbyapp.html (aperçu sans service worker)
npm run lint
```

## Structure

```
src/
  data/positions.js     Fiches des 15 postes (missions, capacités, skills 1–5, exercices, conseils, quiz)
  data/scenarios.js     Placement de base et scénarios d'animation (format d'étapes documenté en tête)
  engine/useScenario.js Lecteur de scénario : étapes, lecture/pause, vitesse
  components/Pitch.jsx  Terrain à l'échelle (mètres), orientation horizontale ou verticale, recadrage
  components/PlayerToken.jsx, Ball.jsx   Joueurs et ballon animés (Framer Motion)
  components/PlayerPanel.jsx, SkillBars.jsx, PositionQuiz.jsx
  views/                Terrain, Postes, Fiche poste, modules à venir
  lib/                  Routeur par ancre (#terrain, #postes, #poste-9…), niveau du joueur, stockage local
```

## Repère du terrain

`x` de 0 à 100 m (ligne d'essai défendue → ligne d'essai attaquée), `y` de 0 à 70 m
(touche gauche → touche droite, vue de l'équipe qui attaque). L'équipe attaque toujours vers `x = 100`.
`Pitch` convertit ces coordonnées pour l'écran, y compris en mode vertical sur téléphone.

## Points d'extension pour la suite

- **Combinaisons** (fait) : `data/combinaisons.js` (phases de jeu et 15 combinaisons, avec explication
  et exercice), `data/formations.js` (placements de départ, adversaires inclus), vues `views/Bibliotheque.jsx`,
  `views/CombinaisonDetail.jsx` et `views/Editeur.jsx` (routes `#combinaisons`, `#combinaisons-croisee`,
  `#combinaisons-editeur`). Le moteur gère les adversaires (`opponents`), le ballon porté par un adversaire
  (`ball: { carrier, team: 'adv' }`), le saut en touche (`lifted`) et trace les trajectoires (`Trails`).
  `Pitch` accepte `zoom: { x: [a, b], y: [c, d] }` pour la vue rapprochée. Les combinaisons de l'éditeur
  sont enregistrées dans le stockage local (`rugbyapp.combinaisons`).
- **Règles, quiz et progression** (fait) : `data/regles.js` (modules Débutant et Expert, 20 règles avec
  explication, schéma animé, emplacement vidéo et quiz), `data/quiz.js` (banque de 113 questions : QCM,
  glisser-déposer, positionnement sur le terrain, choix tactique ; séries et quiz adapté au niveau),
  `data/matchs.js` (mode match : 4 schémas, décisions notées et animées, choix de l'équipe).
  Moteur de quiz dans `components/quiz/` (`Quiz` + un composant par type, `Decision` pour les choix tactiques).
  Progression et badges dans `lib/progression.js`, enregistrés sur l'appareil (`rugbyapp.progression`).
  Routes `#regles`, `#regles-hors-jeu`, `#quiz`, `#quiz-niveau`, `#quiz-match`, `#quiz-match-defense`, `#quiz-progression`.
  `useScenario(scenario, { autoplay: true })` démarre la lecture seule.
- **Signes de l'arbitre** (fait) : `data/signes.js` (20 signes en 5 catégories : geste, quand, et après),
  route `#regles-signes`, lien depuis la page Règles. Illustrations fournies dans `src/assets/signes/*.webp` ;
  les autres gestes sont dessinés par `components/Arbitre.jsx` (pose décrite par des angles de bras) et marqués
  « Dessin provisoire ». Pour les remplacer : déposer `<id>.webp` dans `src/assets/signes/`, l'importer et
  l'ajouter au signe (`image`). L'aperçu intègre les images (`assetsInlineLimit` quand `VITE_PREVIEW`).
- **Assistant IA** : peut s'appuyer sur `POSITIONS` et `SCENARIOS` pour générer explication, animation et quiz.
