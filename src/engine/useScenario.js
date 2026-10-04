import { useCallback, useEffect, useMemo, useState } from 'react'

// Lecteur de scénario : calcule l'image courante (positions, adversaires, ballon, légende)
// et avance d'étape en étape selon la vitesse choisie.
// Le rendu (Pitch, PlayerToken, Ball, Trails) anime la transition avec Framer Motion.
//
// Champs d'étape (voir data/scenarios.js) : duration, caption, players, ball, highlight,
// et en plus pour le moteur d'animation :
//   - opponents : positions des adversaires { numero: [x, y] }, cumulées comme players
//   - ball      : { carrier, team: 'adv' } quand un adversaire porte le ballon, { at, kick: true } pour un coup de pied
//   - lifted    : numéros de nos joueurs soulevés en touche pendant l'étape

const MOVE_MIN = 0.8 // en mètres : en dessous, on ne trace pas de trajectoire

// Position du ballon dans une image (décalé sur le côté du porteur, comme Ball.jsx).
export function ballPosition(ball, positions, opponents) {
  if (ball?.carrier != null) {
    const map = ball.team === 'adv' ? opponents : positions
    const p = map?.[ball.carrier]
    return p ? [p[0] + 1.4, p[1] - 1.6] : null
  }
  return ball?.at ?? null
}

const sameBall = (a, b) =>
  a?.carrier != null ? a.carrier === b?.carrier && (a.team ?? null) === (b?.team ?? null) : !!a?.at && !!b?.at && a.at[0] === b.at[0] && a.at[1] === b.at[1]

export function buildFrames(scenario) {
  const frames = []
  let positions = {}
  let opponents = {}
  let ball = { carrier: null }
  for (const step of scenario.steps) {
    const prev = frames[frames.length - 1]
    positions = { ...positions, ...step.players }
    opponents = { ...opponents, ...step.opponents }
    const nextBall = step.ball ?? ball
    // Trajectoires de l'étape : course des joueurs qui ont bougé, passe ou coup de pied.
    const moves = []
    let pass = null
    if (prev) {
      for (const [team, now, before] of [['nous', positions, prev.positions], ['adv', opponents, prev.opponents]]) {
        for (const [n, to] of Object.entries(now)) {
          const from = before[n]
          if (from && Math.hypot(to[0] - from[0], to[1] - from[1]) > MOVE_MIN) moves.push({ id: `${team}-${n}`, team, from, to })
        }
      }
      if (!sameBall(nextBall, ball)) {
        const from = ballPosition(ball, prev.positions, prev.opponents)
        const to = ballPosition(nextBall, positions, opponents)
        if (from && to) pass = { from, to, kind: nextBall.kick ? 'pied' : 'passe' }
      }
    }
    ball = nextBall
    frames.push({
      positions,
      opponents,
      ball,
      caption: step.caption,
      duration: step.duration,
      highlight: step.highlight ?? [],
      lifted: step.lifted ?? [],
      moves,
      pass,
    })
  }
  return frames
}

// autoplay : la lecture démarre seule à chaque nouveau scénario (quiz, mode match).
export function useScenario(scenario, { speed = 1, autoplay = false } = {}) {
  const frames = useMemo(() => buildFrames(scenario), [scenario])
  const [rawIndex, setIndex] = useState(0)
  const [playing, setPlaying] = useState(autoplay)
  const [current, setCurrent] = useState(scenario)

  // Nouveau scénario : on revient au début (ajustement pendant le rendu, sans effet).
  let index = rawIndex
  if (current !== scenario) {
    setCurrent(scenario)
    setIndex(0)
    setPlaying(autoplay)
    index = 0
  }
  index = Math.min(index, frames.length - 1)

  const isPlaying = playing && index < frames.length - 1

  useEffect(() => {
    if (!isPlaying) return
    // On attend la fin de l'étape courante, puis on passe à la suivante.
    const wait = index === 0 ? 400 : (frames[index].duration / speed) * 1000
    const t = setTimeout(() => setIndex((i) => i + 1), wait)
    return () => clearTimeout(t)
  }, [isPlaying, index, frames, speed])

  const play = useCallback(() => {
    setIndex((i) => (i >= frames.length - 1 ? 0 : i))
    setPlaying(true)
  }, [frames.length])
  const pause = useCallback(() => setPlaying(false), [])
  const reset = useCallback(() => {
    setPlaying(false)
    setIndex(0)
  }, [])
  const goTo = useCallback((i) => {
    setPlaying(false)
    setIndex(Math.max(0, Math.min(frames.length - 1, i)))
  }, [frames.length])

  const frame = frames[index]
  return {
    frames,
    frame,
    index,
    count: frames.length,
    playing: isPlaying,
    play,
    pause,
    reset,
    goTo,
    // Durée de la transition vers l'image courante, en secondes.
    transitionDuration: index === 0 ? 0.6 : frame.duration / speed,
  }
}
