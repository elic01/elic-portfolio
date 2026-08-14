import type { Metadata } from 'next'
import { projects } from '@/lib/content/projects'
import { ProjectFilter } from '@/components/projects/project-filter'
import { Reveal } from '@/components/reveal'

export const metadata: Metadata = {
  title: 'Projects',
  description:
    'Software projects by Emmanuel Chinjekure — full-stack development, homelab infrastructure, cybersecurity tools, and student platforms. Problem, solution, and impact for each.',
}

export default function ProjectsPage() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-16 md:px-6 md:py-24 pt-24">
      <Reveal>
        <p className="mb-3 font-mono text-sm text-terminal">
          <span className="text-muted-foreground">$</span> git log --all --oneline
        </p>
        <h1 className="mb-4 text-balance text-4xl font-bold tracking-tight md:text-5xl">
          Projects
        </h1>
        <p className="mb-12 max-w-2xl text-pretty leading-relaxed text-muted-foreground">
          Each project is documented as problem, solution, and impact — not a feature list.
          Use the category filters below to explore work across DevOps, Cybersecurity, and Full-Stack Software.
        </p>
      </Reveal>

      <Reveal delay={0.05}>
        <ProjectFilter projects={projects} />
      </Reveal>
    </main>
  )
}
