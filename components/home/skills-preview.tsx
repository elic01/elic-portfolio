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
    <section aria-labelledby="skills-heading" className="relative mx-auto max-w-6xl px-4 py-16 md:px-6 md:py-24">
      {/* Background radial glow */}
      <div
        className="absolute top-1/2 right-0 -translate-y-1/2 size-96 rounded-full bg-violet/5 blur-3xl -z-10"
        aria-hidden="true"
      />

      <Reveal>
        <div className="mb-8 flex flex-col gap-2">
          <p className="font-mono text-xs uppercase tracking-widest text-violet">Capabilities</p>
          <h2 id="skills-heading" className="text-3xl font-bold tracking-tight md:text-4xl">
            Skills &amp; Expertise
          </h2>
        </div>
      </Reveal>

      <Reveal>
        <ul className="mb-10 flex flex-wrap gap-2.5" aria-label="Top skills">
          {topSkills.map((skill) => (
            <li
              key={skill}
              className="rounded-full border border-violet/30 bg-violet/10 backdrop-blur-md px-4 py-1.5 font-mono text-xs text-foreground transition-all duration-300 hover:border-violet hover:bg-violet/20"
            >
              {skill}
            </li>
          ))}
        </ul>
      </Reveal>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {skillGroups.map((group, i) => (
          <Reveal key={group.category} delay={i * 0.06}>
            <div className="neu-card neu-card-hover h-full rounded-2xl p-6 backdrop-blur-xl">
              <h3 className={cn('mb-4 font-mono text-xs font-semibold uppercase tracking-wider', accentText[group.accent])}>
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
                            'size-1.5 rounded-full transition-colors duration-300',
                            level <= skill.proficiency ? 'bg-accent shadow-[0_0_8px_rgba(0,201,167,0.6)]' : 'bg-border/60',
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
