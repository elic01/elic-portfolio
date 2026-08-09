import { ExternalLink } from 'lucide-react'
import { GithubIcon } from '@/components/brand-icons'
import type { Project } from '@/lib/content/types'
import { Reveal } from '@/components/reveal'

const statusColor: Record<Project['status'], string> = {
  active: 'text-terminal',
  shipped: 'text-info',
  archived: 'text-muted-foreground',
}

export function ProjectDetailCard({ project, index }: { project: Project; index: number }) {
  return (
    <Reveal delay={index * 0.06}>
      <article className="neu-card overflow-hidden rounded-2xl">
        {/* Editor-style title bar */}
        <div className="flex items-center justify-between gap-3 border-b border-border bg-secondary px-5 py-3">
          <div className="flex items-center gap-3 overflow-hidden">
            <span className="flex gap-1.5" aria-hidden="true">
              <span className="size-2.5 rounded-full bg-destructive/70" />
              <span className="size-2.5 rounded-full bg-gold/70" />
              <span className="size-2.5 rounded-full bg-success/70" />
            </span>
            <p className="truncate font-mono text-sm text-muted-foreground">
              ~/projects/{project.slug}.md
            </p>
          </div>
          <p className={`font-mono text-xs uppercase ${statusColor[project.status]}`}>
            {project.status}
          </p>
        </div>

        <div className="flex flex-col gap-5 p-6 md:p-8">
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <h2 className="text-xl font-semibold text-foreground md:text-2xl">{project.title}</h2>
            <p className="font-mono text-xs text-muted-foreground">{project.dateRange}</p>
          </div>

          <p className="text-pretty leading-relaxed text-muted-foreground">{project.summary}</p>

          <dl className="grid gap-4 md:grid-cols-3">
            <div className="rounded-xl border border-border bg-background/60 p-4">
              <dt className="mb-1.5 font-mono text-xs uppercase tracking-wide text-destructive">
                {'// problem'}
              </dt>
              <dd className="text-sm leading-relaxed text-muted-foreground">{project.problem}</dd>
            </div>
            <div className="rounded-xl border border-border bg-background/60 p-4">
              <dt className="mb-1.5 font-mono text-xs uppercase tracking-wide text-info">
                {'// solution'}
              </dt>
              <dd className="text-sm leading-relaxed text-muted-foreground">{project.solution}</dd>
            </div>
            <div className="rounded-xl border border-border bg-background/60 p-4">
              <dt className="mb-1.5 font-mono text-xs uppercase tracking-wide text-success">
                {'// impact'}
              </dt>
              <dd className="text-sm leading-relaxed text-muted-foreground">{project.impact}</dd>
            </div>
          </dl>

          <div className="flex flex-wrap items-center justify-between gap-4">
            <ul className="flex flex-wrap gap-2" aria-label="Tech stack">
              {project.techStack.map((tech) => (
                <li
                  key={tech}
                  className="rounded-full border border-violet/40 bg-violet/10 px-3 py-1 font-mono text-xs text-foreground"
                >
                  {tech}
                </li>
              ))}
            </ul>
            <p className="font-mono text-xs text-muted-foreground">{project.role}</p>
          </div>

          {(project.links.repo || project.links.demo) && (
            <div className="flex flex-wrap gap-3 border-t border-border pt-4">
              {project.links.repo && (
                <a
                  href={project.links.repo}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-lg border border-border px-4 py-2 text-sm text-foreground transition-colors duration-200 hover:bg-secondary"
                >
                  <GithubIcon className="size-4" />
                  Repository
                </a>
              )}
              {project.links.demo && (
                <a
                  href={project.links.demo}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-lg border border-border px-4 py-2 text-sm text-foreground transition-colors duration-200 hover:bg-secondary"
                >
                  <ExternalLink className="size-4" aria-hidden="true" />
                  Live Demo
                </a>
              )}
            </div>
          )}
        </div>
      </article>
    </Reveal>
  )
}
