import Link from 'next/link'
import { ArrowRight, Star } from 'lucide-react'
import { featuredProjects } from '@/lib/content/projects'
import { Reveal } from '@/components/reveal'

export function FeaturedProjects() {
  return (
    <section
      aria-labelledby="projects-heading"
      className="border-y border-border bg-card/40"
    >
      <div className="mx-auto max-w-6xl px-4 py-20 md:px-6">
        <Reveal>
          <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="mb-2 inline-flex items-center gap-2 text-sm font-medium uppercase tracking-wide text-gold">
                <Star className="size-4" aria-hidden="true" />
                Featured Work
              </p>
              <h2 id="projects-heading" className="text-3xl font-bold tracking-tight md:text-4xl">
                Projects
              </h2>
            </div>
            <Link
              href="/projects"
              className="inline-flex items-center gap-2 text-sm text-accent transition-colors hover:text-foreground"
            >
              All projects
              <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
          </div>
        </Reveal>

        <div className="grid gap-6 md:grid-cols-3">
          {featuredProjects.map((project, i) => (
            <Reveal key={project.slug} delay={i * 0.08}>
              <article className="neu-card group flex h-full flex-col gap-4 rounded-2xl p-6 transition-transform duration-200 hover:-translate-y-1">
                <div className="flex items-center justify-between gap-2">
                  <span className="rounded-full border border-gold/40 px-3 py-1 text-xs font-medium text-gold">
                    {project.category === 'dev'
                      ? 'Development'
                      : project.category === 'devops'
                        ? 'Infrastructure'
                        : 'Security'}
                  </span>
                  <span className="text-xs text-muted-foreground">{project.dateRange}</span>
                </div>
                <h3 className="text-lg font-semibold leading-snug text-foreground">
                  {project.title}
                </h3>
                <p className="flex-1 text-sm leading-relaxed text-muted-foreground">
                  {project.summary}
                </p>
                <ul className="flex flex-wrap gap-2" aria-label="Tech stack">
                  {project.techStack.slice(0, 4).map((tech) => (
                    <li
                      key={tech}
                      className="rounded-full bg-secondary px-2.5 py-1 font-mono text-xs text-muted-foreground"
                    >
                      {tech}
                    </li>
                  ))}
                </ul>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
