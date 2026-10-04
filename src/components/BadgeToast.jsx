import { AnimatePresence, motion } from 'framer-motion'
import { useApp } from '../lib/AppContext.jsx'
import { etatBadges } from '../lib/progression.js'
import { href } from '../lib/router.js'

// Annonce d'un badge débloqué (une seule fois par badge) et raccourci vers les badges dans la barre du haut.

export function BadgeLink() {
  const { progression } = useApp()
  const obtenus = etatBadges(progression).filter((b) => b.obtenu)
  const dernier = obtenus[obtenus.length - 1]
  return (
    <a className="badge-link" href={href('quiz', 'progression')} title={dernier ? `Badge ${dernier.titre}` : 'Mes badges'} aria-label={dernier ? `Mes badges : ${dernier.titre}` : 'Mes badges'}>
      <span aria-hidden="true">{dernier ? dernier.emoji : '☆'}</span>
      <small>{obtenus.length}/4</small>
    </a>
  )
}

export default function BadgeToast() {
  const { progression, marquerBadgeVu } = useApp()
  const nouveau = etatBadges(progression).find((b) => b.obtenu && !progression.badgesVus.includes(b.id))
  return (
    <AnimatePresence>
      {nouveau && (
        <motion.div
          key={nouveau.id}
          className="toast"
          role="status"
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -16 }}
        >
          <span className="toast-emoji" aria-hidden="true">{nouveau.emoji}</span>
          <span>
            <strong>Badge {nouveau.titre} débloqué !</strong>
            <small>Retrouve tes badges dans l’onglet Progression.</small>
          </span>
          <a className="btn btn-primary" href={href('quiz', 'progression')} onClick={() => marquerBadgeVu(nouveau.id)}>Voir</a>
          <button type="button" className="icon-btn" aria-label="Fermer" onClick={() => marquerBadgeVu(nouveau.id)}>×</button>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
