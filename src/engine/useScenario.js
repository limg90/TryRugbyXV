import { useCallback, useEffect, useMemo, useState } from 'react'

// Lecteur de scénario : calcule l'image courante (positions, ballon, légende)
// et avance d'étape en étape selon la vitesse choisie.
// Le rendu (Pitch, PlayerToken, Ball) anime la transition avec Framer Motion.

export function buildFrames(scenario) {
  const frames = []
  let positions = {}
  let ball = { carrier: null }
  for (const step of scenario.steps) {
    positions = { ...positions, ...step.players }
    ball = step.ball ?? ball
    frames.push({ positions, ball, caption: step.caption, duration: step.duration, highlight: step.highlight ?? [] })
  }
  return frames
}

export function useScenario(scenario, { speed = 1 } = {}) {
  const frames = useMemo(() => buildFrames(scenario), [scenario])
  const [rawIndex, setIndex] = useState(0)
  const [playing, setPlaying] = useState(false)
  const [current, setCurrent] = useState(scenario)

  // Nouveau scénario : on revient au début (ajustement pendant le rendu, sans effet).
  let index = rawIndex
  if (current !== scenario) {
    setCurrent(scenario)
    setIndex(0)
    setPlaying(false)
    index = 0
  }

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
