import { skillGroups, topSkills } from '@/lib/content/skills'
import { Reveal } from '@/components/reveal'
import { cn } from '@/lib/utils'

const accentText: Record<string, string> = {
  accent: 'text-accent',
  gold: 'text-gold',
  violet: 'text-violet',
  ember: 'text-ember',
  terminal: 'text-terminal',
  info: 'text-info',
}

export function SkillsPreview() {
  return (
    <section aria-labelledby="skills-heading" className="mx-auto max-w-6xl px-4 py-20 md:px-6">
      <Reveal>
        <p className="mb-2 text-sm font-medium uppercase tracking-wide text-violet">Capabilities</p>
        <h2 id="skills-heading" className="mb-8 text-3xl font-bold tracking-tight md:text-4xl">
          Skills
        </h2>
      </Reveal>

      <Reveal>
        <ul className="mb-10 flex flex-wrap gap-3" aria-label="Top skills">
          {topSkills.map((skill) => (
            <li
              key={skill}
              className="rounded-full border border-violet/40 bg-violet/10 px-4 py-1.5 text-sm text-foreground transition-colors duration-200 hover:border-violet"
            >
              {skill}
            </li>
          ))}
        </ul>
      </Reveal>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {skillGroups.map((group, i) => (
          <Reveal key={group.category} delay={i * 0.06}>
            <div className="neu-card h-full rounded-2xl p-6">
              <h3 className={cn('mb-4 text-sm font-semibold uppercase tracking-wide', accentText[group.accent])}>
                {group.category}
              </h3>
              <ul className="flex flex-col gap-3">
                {group.skills.map((skill) => (
                  <li key={skill.name} className="flex items-center justify-between gap-3">
                    <span className="text-sm text-foreground">{skill.name}</span>
                    <span
                      className="flex gap-1"
                      aria-label={`Proficiency ${skill.proficiency} of 5, since ${skill.since}`}
                    >
                      {[1, 2, 3, 4, 5].map((level) => (
                        <span
                          key={level}
                          aria-hidden="true"
                          className={cn(
                            'size-1.5 rounded-full',
                            level <= skill.proficiency ? 'bg-accent' : 'bg-border',
                          )}
                        />
                      ))}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  )
}
