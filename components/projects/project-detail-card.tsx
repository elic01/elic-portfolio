import Image from 'next/image'
import { BookOpen, CheckCircle2, ExternalLink, Network } from 'lucide-react'
import { GithubIcon } from '@/components/brand-icons'
import type { Project } from '@/lib/content/types'
import { Reveal } from '@/components/reveal'

const statusColor: Record<Project['status'], string> = {
  active: 'text-terminal border-terminal/30 bg-terminal/10',
  shipped: 'text-info border-info/30 bg-info/10',
  archived: 'text-muted-foreground border-border bg-secondary',
}

export function ProjectDetailCard({ project, index }: { project: Project; index: number }) {
  return (
    <Reveal delay={index * 0.06}>
      <article className="neu-card overflow-hidden rounded-2xl border border-white/10 shadow-2xl backdrop-blur-xl">
        {/* Editor-style title bar */}
        <div className="flex items-center justify-between gap-3 border-b border-border bg-secondary/80 px-5 py-3">
          <div className="flex items-center gap-3 overflow-hidden">
            <span className="flex gap-1.5" aria-hidden="true">
              <span className="size-2.5 rounded-full bg-destructive/70" />
              <span className="size-2.5 rounded-full bg-gold/70" />
              <span className="size-2.5 rounded-full bg-success/70" />
            </span>
            <p className="truncate font-mono text-sm text-muted-foreground">
              ~/case-studies/{project.slug}.md
            </p>
          </div>
          <span className={`rounded-full border px-2.5 py-0.5 font-mono text-[11px] uppercase font-semibold ${statusColor[project.status]}`}>
            {project.status}
          </span>
        </div>

        <div className="flex flex-col gap-6 p-6 md:p-8">
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <div>
              <span className="mb-1 inline-block font-mono text-xs text-accent">
                {project.category === 'dev' ? 'Full-Stack Software' : project.category === 'devops' ? 'DevOps & Infrastructure' : 'Cybersecurity Tooling'}
              </span>
              <h2 className="text-xl font-bold text-foreground md:text-2xl">{project.title}</h2>
            </div>
            <p className="font-mono text-xs text-muted-foreground">{project.dateRange}</p>
          </div>

          <p className="text-pretty leading-relaxed text-muted-foreground">{project.summary}</p>

          {/* Screenshots Gallery if available */}
          {project.images && project.images.length > 0 && (
            <div className="flex flex-col gap-4 pt-1">
              <div className="grid gap-4 sm:grid-cols-2">
                {project.images.map((img) => (
                  <figure key={img.url} className="group overflow-hidden rounded-xl border border-white/10 bg-background/60 p-2">
                    <div className="relative aspect-[16/10] w-full overflow-hidden rounded-lg">
                      <Image
                        src={img.url}
                        alt={img.caption}
                        fill
                        className="object-cover object-top transition-transform duration-500 group-hover:scale-105"
                        sizes="(max-width: 768px) 100vw, 50vw"
                      />
                    </div>
                    <figcaption className="mt-2 font-mono text-[11px] text-muted-foreground px-1">
                      {img.caption}
                    </figcaption>
                  </figure>
                ))}
              </div>
            </div>
          )}

          {/* Problem, Solution, Impact Breakdown */}
          <dl className="grid gap-4 md:grid-cols-3">
            <div className="rounded-xl border border-border bg-background/60 p-4">
              <dt className="mb-1.5 font-mono text-xs uppercase tracking-wide text-destructive">
                {'// problem statement'}
              </dt>
              <dd className="text-xs leading-relaxed text-muted-foreground">{project.problem}</dd>
            </div>
            <div className="rounded-xl border border-border bg-background/60 p-4">
              <dt className="mb-1.5 font-mono text-xs uppercase tracking-wide text-info">
                {'// engineering solution'}
              </dt>
              <dd className="text-xs leading-relaxed text-muted-foreground">{project.solution}</dd>
            </div>
            <div className="rounded-xl border border-border bg-background/60 p-4">
              <dt className="mb-1.5 font-mono text-xs uppercase tracking-wide text-success">
                {'// key outcome & impact'}
              </dt>
              <dd className="text-xs leading-relaxed text-muted-foreground">{project.impact}</dd>
            </div>
          </dl>

          {/* Architecture Diagram if available */}
          {project.architectureDiagram && (
            <div className="rounded-xl border border-accent/20 bg-black/80 p-5 shadow-inner">
              <div className="mb-3 flex items-center gap-2 border-b border-white/10 pb-2">
                <Network className="size-4 text-accent" aria-hidden="true" />
                <h3 className="font-mono text-xs font-semibold uppercase tracking-wider text-accent">
                  System Architecture &amp; Data Flow
                </h3>
              </div>
              <pre className="overflow-x-auto font-mono text-xs text-muted-foreground leading-relaxed">
                <code>{project.architectureDiagram}</code>
              </pre>
            </div>
          )}

          {/* Case Study Takeaways / Highlights */}
          {project.highlights && project.highlights.length > 0 && (
            <div className="rounded-xl border border-white/5 bg-secondary/40 p-4">
              <h3 className="mb-2 font-mono text-xs font-semibold uppercase tracking-wider text-foreground">
                Key Technical Highlights:
              </h3>
              <ul className="flex flex-col gap-1.5">
                {project.highlights.map((highlight) => (
                  <li key={highlight} className="flex items-start gap-2 text-xs text-muted-foreground">
                    <CheckCircle2 className="size-3.5 shrink-0 text-accent mt-0.5" aria-hidden="true" />
                    <span>{highlight}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Tech Stack & Action Links */}
          <div className="flex flex-wrap items-center justify-between gap-4 border-t border-border pt-4">
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

            <div className="flex flex-wrap items-center gap-3">
              {project.links.guide && (
                <a
                  href={project.links.guide}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-lg border border-gold/40 bg-gold/10 px-3.5 py-1.5 text-xs font-mono text-gold transition-colors duration-200 hover:bg-gold/20"
                >
                  <BookOpen className="size-3.5" />
                  Homelab Guide
                </a>
              )}
              {project.links.repo && (
                <a
                  href={project.links.repo}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-lg border border-border px-3.5 py-1.5 text-xs font-mono text-foreground transition-colors duration-200 hover:bg-secondary"
                >
                  <GithubIcon className="size-3.5" />
                  Repository
                </a>
              )}
              {project.links.demo && (
                <a
                  href={project.links.demo}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-lg border border-border px-3.5 py-1.5 text-xs font-mono text-foreground transition-colors duration-200 hover:bg-secondary"
                >
                  <ExternalLink className="size-3.5" aria-hidden="true" />
                  Live Demo
                </a>
              )}
            </div>
          </div>
        </div>
      </article>
    </Reveal>
  )
}
