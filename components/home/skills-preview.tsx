import { coreDailyDrivers, skillGroups } from '@/lib/content/skills'
import { Reveal } from '@/components/reveal'
import { cn } from '@/lib/utils'
import { Cpu, Zap } from 'lucide-react'

const accentText: Record<string, string> = {
  accent: 'text-accent',
  gold: 'text-gold',
  violet: 'text-violet',
  ember: 'text-ember',
  terminal: 'text-terminal',
  info: 'text-info',
}

const accentBorder: Record<string, string> = {
  accent: 'border-accent/30',
  gold: 'border-gold/30',
  violet: 'border-violet/30',
  ember: 'border-ember/30',
  terminal: 'border-terminal/30',
  info: 'border-info/30',
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
          <p className="font-mono text-xs uppercase tracking-widest text-violet">Technical Stack</p>
          <h2 id="skills-heading" className="text-3xl font-bold tracking-tight md:text-4xl">
            Skills &amp; Architecture
          </h2>
        </div>
      </Reveal>

      {/* Tier 1: Core Daily Drivers */}
      <Reveal>
        <div className="mb-10 rounded-2xl border border-accent/30 bg-card/60 p-6 shadow-xl backdrop-blur-2xl">
          <div className="mb-4 flex items-center gap-2">
            <Zap className="size-4 text-accent" aria-hidden="true" />
            <p className="font-mono text-xs font-semibold uppercase tracking-wider text-accent">
              Core Daily Drivers &amp; Production Stack
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {coreDailyDrivers.map((driver) => (
              <div
                key={driver.name}
                className="flex items-center justify-between rounded-xl border border-white/10 bg-secondary/50 p-3.5 transition-all duration-300 hover:border-accent/40 hover:bg-secondary"
              >
                <span className="font-semibold text-sm text-foreground">{driver.name}</span>
                <span className="rounded-md border border-accent/30 bg-accent/10 px-2 py-0.5 font-mono text-[11px] text-accent">
                  {driver.tag}
                </span>
              </div>
            ))}
          </div>
        </div>
      </Reveal>

      {/* Categorized Skills Deep Dive */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {skillGroups.map((group, i) => (
          <Reveal key={group.category} delay={i * 0.05}>
            <div className={cn('neu-card neu-card-hover h-full rounded-2xl p-5 backdrop-blur-xl', accentBorder[group.accent])}>
              <div className="mb-4 flex items-center gap-2">
                <Cpu className={cn('size-3.5', accentText[group.accent])} aria-hidden="true" />
                <h3 className={cn('font-mono text-xs font-semibold uppercase tracking-wider', accentText[group.accent])}>
                  {group.category}
                </h3>
              </div>
              <ul className="flex flex-col gap-2.5">
                {group.skills.map((skill) => (
                  <li key={skill.name} className="flex items-center justify-between gap-2 text-xs">
                    <span className="text-foreground/90 font-medium">{skill.name}</span>
                    <span
                      className="flex gap-0.5"
                      aria-label={`Proficiency ${skill.proficiency} of 5, since ${skill.since}`}
                    >
                      {[1, 2, 3, 4, 5].map((level) => (
                        <span
                          key={level}
                          aria-hidden="true"
                          className={cn(
                            'size-1.5 rounded-full transition-colors duration-300',
                            level <= skill.proficiency ? 'bg-accent shadow-[0_0_6px_rgba(0,201,167,0.5)]' : 'bg-border/50',
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
