import { experience } from '@/lib/content/experience'
import { Reveal } from '@/components/reveal'

function formatDate(date: string | null) {
  if (!date) return 'Present'
  const [year, month] = date.split('-')
  const months = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
  ]
  return `${months[Number(month) - 1]} ${year}`
}

const typeLabel: Record<string, string> = {
  internship: 'Internship',
  fulltime: 'Full-time',
  contract: 'Contract',
  parttime: 'Part-time',
}

export function ExperienceTimeline() {
  return (
    <section aria-labelledby="experience-heading" className="relative py-16 md:py-24">
      {/* Background glow */}
      <div
        className="absolute top-1/2 left-1/4 -translate-y-1/2 size-96 rounded-full bg-ember/5 blur-3xl -z-10"
        aria-hidden="true"
      />

      <div className="mx-auto max-w-6xl px-4 md:px-6">
        <Reveal>
          <div className="mb-10 flex flex-col gap-2">
            <p className="font-mono text-xs uppercase tracking-widest text-ember">Career</p>
            <h2 id="experience-heading" className="text-3xl font-bold tracking-tight md:text-4xl">
              Experience &amp; History
            </h2>
          </div>
        </Reveal>

        <ol className="relative flex flex-col gap-8 border-l border-ember/30 pl-6 md:pl-8">
          {experience.map((job, i) => (
            <li key={`${job.company}-${job.startDate}`} className="relative">
              <span
                aria-hidden="true"
                className="absolute -left-[31px] top-2 size-3.5 rounded-full border-2 border-ember bg-background shadow-[0_0_12px_rgba(244,162,97,0.6)] md:-left-[39px]"
              />
              <Reveal delay={i * 0.08}>
                <article className="neu-card neu-card-hover rounded-2xl p-6 backdrop-blur-xl transition-all duration-300">
                  <div className="mb-3 flex flex-wrap items-baseline justify-between gap-2">
                    <h3 className="text-lg font-semibold text-foreground">
                      {job.role} · <span className="text-ember">{job.company}</span>
                    </h3>
                    <p className="font-mono text-xs text-muted-foreground">
                      {formatDate(job.startDate)} – {formatDate(job.endDate)} · {typeLabel[job.type]}
                    </p>
                  </div>
                  <ul className="mb-4 flex list-disc flex-col gap-1.5 pl-4">
                    {job.description.map((line) => (
                      <li key={line.slice(0, 24)} className="text-sm leading-relaxed text-muted-foreground">
                        {line}
                      </li>
                    ))}
                  </ul>
                  <ul className="flex flex-wrap gap-2" aria-label="Skills used">
                    {job.skills.map((skill) => (
                      <li
                        key={skill}
                        className="rounded-full bg-secondary/80 border border-white/5 px-2.5 py-1 font-mono text-xs text-muted-foreground"
                      >
                        {skill}
                      </li>
                    ))}
                  </ul>
                </article>
              </Reveal>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
