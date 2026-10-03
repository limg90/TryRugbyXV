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

- **Moteur d'animation et combinaisons** : ajouter des scénarios dans `data/scenarios.js`
  (mêlée, touche, ruck, défense glissée, adversaires), étendre `useScenario` si besoin
  (trajectoires courbes, passes en vol, deuxième équipe).
- **Règles, quiz et progression** : `PositionQuiz` est un QCM simple à remplacer par le moteur de quiz ;
  le niveau (`lib/AppContext.jsx`) accueillera badges et scores.
- **Assistant IA** : peut s'appuyer sur `POSITIONS` et `SCENARIOS` pour générer explication, animation et quiz.
