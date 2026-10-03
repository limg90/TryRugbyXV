// Commandes de lecture : lancer/pause, étape précédente/suivante, début, vitesse.
export const SPEEDS = [0.25, 0.5, 1, 1.5, 2]

export default function Transport({ player, speed, onSpeed }) {
  return (
    <div className="controls" role="group" aria-label="Lecture">
      <div className="transport">
        {player.playing ? (
          <button type="button" className="btn btn-primary" onClick={player.pause}>Pause</button>
        ) : (
          <button type="button" className="btn btn-primary" onClick={player.play} disabled={player.count < 2}>
            {player.index > 0 && player.index >= player.count - 1 ? 'Rejouer' : 'Lancer'}
          </button>
        )}
        <button type="button" className="btn btn-ghost" onClick={() => player.goTo(player.index - 1)} disabled={player.index === 0} aria-label="Étape précédente">‹</button>
        <button type="button" className="btn btn-ghost" onClick={() => player.goTo(player.index + 1)} disabled={player.index >= player.count - 1} aria-label="Étape suivante">›</button>
        <button type="button" className="btn btn-ghost" onClick={player.reset}>Début</button>
      </div>
      <div className="speed" role="radiogroup" aria-label="Vitesse">
        {SPEEDS.map((s) => (
          <button key={s} type="button" role="radio" aria-checked={speed === s} className={`chip${speed === s ? ' is-on' : ''}`} onClick={() => onSpeed(s)}>
            {String(s).replace('.', ',')}×
          </button>
        ))}
      </div>
    </div>
  )
}
