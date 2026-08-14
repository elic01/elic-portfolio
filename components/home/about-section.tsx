import { profile } from '@/lib/content/profile'
import { education, organizations } from '@/lib/content/education'
import { Reveal } from '@/components/reveal'

export function AboutSection() {
  const edu = education[0]

  return (
    <section aria-labelledby="about-heading" className="relative mx-auto max-w-6xl px-4 py-16 md:px-6 md:py-24">
      <Reveal>
        <div className="mb-10 flex flex-col gap-2">
          <p className="font-mono text-xs uppercase tracking-widest text-accent">Background</p>
          <h2 id="about-heading" className="text-3xl font-bold tracking-tight md:text-4xl">
            About Me
          </h2>
        </div>
      </Reveal>

      <div className="flex flex-col gap-10 lg:flex-row">
        <Reveal className="flex-1">
          <div className="flex flex-col gap-6">
            {profile.bio.map((paragraph) => (
              <p key={paragraph.slice(0, 24)} className="text-pretty text-base leading-relaxed text-muted-foreground">
                {paragraph}
              </p>
            ))}
            <div className="neu-card neu-card-hover mt-2 rounded-2xl p-6 backdrop-blur-xl">
              <p className="font-mono text-xs font-semibold uppercase tracking-wider text-success">Education</p>
              <p className="mt-2 text-lg font-semibold text-foreground">{edu.degree}</p>
              <p className="text-sm text-muted-foreground">
                {edu.institution} · 2023 – Present
              </p>
              {edu.note && <p className="mt-1 text-sm text-muted-foreground/90">{edu.note}</p>}
            </div>
          </div>
        </Reveal>

        <Reveal delay={0.12} className="flex-1">
          <div className="flex flex-col gap-4">
            <p className="font-mono text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              Community &amp; Leadership
            </p>
            {organizations.map((org) => (
              <div key={org.name} className="neu-card neu-card-hover rounded-2xl p-5 backdrop-blur-xl">
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <p className="font-semibold text-foreground">{org.name}</p>
                  <p className="font-mono text-xs text-muted-foreground">since {org.since}</p>
                </div>
                <p className="text-sm font-medium text-ember">{org.role}</p>
                <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{org.description}</p>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  )
}
