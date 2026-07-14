import type { Metadata } from 'next'
import { projects } from '@/lib/content/projects'
import { ProjectDetailCard } from '@/components/projects/project-detail-card'
import { Reveal } from '@/components/reveal'

export const metadata: Metadata = {
  title: 'Projects',
  description:
    'Software projects by Emmanuel Chinjekure — full-stack development, homelab infrastructure, and student platforms. Problem, solution, and impact for each.',
}

export default function ProjectsPage() {
  return (
    <main className="mx-auto max-w-5xl px-4 py-16 md:px-6 md:py-20">
      <Reveal>
        <p className="mb-3 font-mono text-sm text-terminal">
          <span className="text-muted-foreground">$</span> git log --all --oneline
        </p>
        <h1 className="mb-4 text-balance text-4xl font-bold tracking-tight md:text-5xl">
          Projects
        </h1>
        <p className="mb-12 max-w-2xl text-pretty leading-relaxed text-muted-foreground">
          Each project is documented as problem, solution, and impact — not a feature list.
          Older work gets archived, never deleted; the history is the point.
        </p>
      </Reveal>

      <div className="flex flex-col gap-8">
        {projects.map((project, i) => (
          <ProjectDetailCard key={project.slug} project={project} index={i} />
        ))}
      </div>
    </main>
  )
}
