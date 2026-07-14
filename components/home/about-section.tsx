import { profile } from '@/lib/content/profile'
import { education, organizations } from '@/lib/content/education'
import { Reveal } from '@/components/reveal'

export function AboutSection() {
  const edu = education[0]

  return (
    <section aria-labelledby="about-heading" className="mx-auto max-w-6xl px-4 py-20 md:px-6">
      <Reveal>
        <h2 id="about-heading" className="mb-8 text-3xl font-bold tracking-tight md:text-4xl">
          About
        </h2>
      </Reveal>

      <div className="flex flex-col gap-10 lg:flex-row">
        <Reveal className="flex-1">
          <div className="flex flex-col gap-4">
            {profile.bio.map((paragraph) => (
              <p key={paragraph.slice(0, 24)} className="text-pretty leading-relaxed text-muted-foreground">
                {paragraph}
              </p>
            ))}
            <div className="neu-card mt-2 rounded-2xl p-6">
              <p className="text-sm font-medium uppercase tracking-wide text-success">Education</p>
              <p className="mt-2 font-medium text-foreground">{edu.degree}</p>
              <p className="text-sm text-muted-foreground">
                {edu.institution} · 2023 – present
              </p>
              {edu.note && <p className="mt-1 text-sm text-muted-foreground">{edu.note}</p>}
            </div>
          </div>
        </Reveal>

        <Reveal delay={0.1} className="flex-1">
          <div className="flex flex-col gap-4">
            <p className="text-sm font-medium uppercase tracking-wide text-muted-foreground">
              Community &amp; Leadership
            </p>
            {organizations.map((org) => (
              <div key={org.name} className="neu-card rounded-2xl p-5">
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <p className="font-medium text-foreground">{org.name}</p>
                  <p className="text-xs text-muted-foreground">since {org.since}</p>
                </div>
                <p className="text-sm text-ember">{org.role}</p>
                <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{org.description}</p>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  )
}
