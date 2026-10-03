import { SKILL_GROUPS } from '../data/positions.js'

// Importance de chaque qualité pour le poste, de 1 à 5.
export default function SkillBars({ skills }) {
  return (
    <div className="skills">
      {SKILL_GROUPS.map((g) => (
        <section key={g.id} className="skills-group">
          <h4>{g.label}</h4>
          <ul>
            {Object.entries(g.items).map(([key, label]) => {
              const v = skills[g.id][key]
              return (
                <li key={key}>
                  <span className="skill-name">{label}</span>
                  <span className="skill-meter" role="meter" aria-valuemin={1} aria-valuemax={5} aria-valuenow={v} aria-label={`${label} : ${v} sur 5`}>
                    {[1, 2, 3, 4, 5].map((i) => (
                      <span key={i} className={i <= v ? 'on' : ''} />
                    ))}
                  </span>
                </li>
              )
            })}
          </ul>
        </section>
      ))}
    </div>
  )
}
