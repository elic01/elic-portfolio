import { coreDailyDrivers, ruthlessSkillTiers } from '@/lib/content/skills'
import { Reveal } from '@/components/reveal'
import { cn } from '@/lib/utils'
import { CheckCircle2, Flame, Layers, ShieldCheck, Zap } from 'lucide-react'

const accentText: Record<string, string> = {
  accent: 'text-accent',
  violet: 'text-violet',
  terminal: 'text-terminal',
}

const accentBorder: Record<string, string> = {
  accent: 'border-accent/30',
  violet: 'border-violet/30',
  terminal: 'border-terminal/30',
}

const tierIcons = {
  Strong: Flame,
  'Working Knowledge': Layers,
  Familiar: ShieldCheck,
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
          <p className="font-mono text-xs uppercase tracking-widest text-accent">Interview Readiness</p>
          <h2 id="skills-heading" className="text-3xl font-bold tracking-tight md:text-4xl">
            Technical Stack &amp; Proficiency
          </h2>
          <p className="max-w-2xl text-pretty text-sm text-muted-foreground">
            Clear, honest technical categorization: what I use daily, what I have deployed in production,
            and what I have explored.
          </p>
        </div>
      </Reveal>

      {/* Core Daily Drivers */}
      <Reveal>
        <div className="mb-10 rounded-2xl border border-accent/30 bg-card/60 p-6 shadow-xl backdrop-blur-2xl">
          <div className="mb-4 flex items-center gap-2">
            <Zap className="size-4 text-accent" aria-hidden="true" />
            <p className="font-mono text-xs font-semibold uppercase tracking-wider text-accent">
              Core Daily Drivers (Active Daily Stack)
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

      {/* 3 Ruthless Interview-Readiness Tiers */}
      <div className="grid gap-6 lg:grid-cols-3">
        {ruthlessSkillTiers.map((tier, i) => {
          const Icon = tierIcons[tier.level]
          return (
            <Reveal key={tier.level} delay={i * 0.08}>
              <div
                className={cn(
                  'neu-card neu-card-hover flex h-full flex-col justify-between rounded-2xl p-6 backdrop-blur-xl',
                  accentBorder[tier.accent],
                )}
              >
                <div>
                  <div className="mb-3 flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <Icon className={cn('size-4', accentText[tier.accent])} aria-hidden="true" />
                      <h3 className="font-bold text-lg text-foreground">{tier.level}</h3>
                    </div>
                    <span className={cn('rounded-full border px-2.5 py-0.5 font-mono text-[11px] font-medium', tier.badgeColor)}>
                      {tier.badge}
                    </span>
                  </div>

                  <p className="mb-5 text-xs leading-relaxed text-muted-foreground border-b border-white/5 pb-4">
                    {tier.description}
                  </p>
                </div>

                <ul className="flex flex-col gap-3 pt-1">
                  {tier.skills.map((skill) => (
                    <li key={skill.name} className="flex flex-col gap-0.5 rounded-lg bg-secondary/30 p-2.5">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                          <CheckCircle2 className={cn('size-3', accentText[tier.accent])} aria-hidden="true" />
                          {skill.name}
                        </span>
                        <span className="font-mono text-[10px] text-muted-foreground">since {skill.since}</span>
                      </div>
                      <p className="text-[11px] text-muted-foreground/90 pl-4">{skill.context}</p>
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          )
        })}
      </div>
    </section>
  )
}
