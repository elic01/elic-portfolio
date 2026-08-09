import type { Metadata } from 'next'
import { projects } from '@/lib/content/projects'
import { infraSkillGroups } from '@/lib/content/skills'
import { Reveal } from '@/components/reveal'
import { PipelineDiagram } from '@/components/devops/pipeline-diagram'
import { StackDiagram } from '@/components/devops/stack-diagram'
import { ProjectDetailCard } from '@/components/projects/project-detail-card'

export const metadata: Metadata = {
  title: 'DevOps & Infrastructure',
  description:
    'Homelab infrastructure, self-hosting, and CI/CD by Emmanuel Chinjekure — Proxmox VE, Docker, PostgreSQL, Redis, and Authentik SSO.',
}

const infraProjects = projects.filter((p) => p.category === 'devops')

export default function DevOpsPage() {
  return (
    <main className="mx-auto max-w-5xl px-4 py-16 md:px-6 md:py-20">
      <Reveal>
        <p className="mb-3 font-mono text-sm text-ember">
          <span className="text-muted-foreground">$</span> systemctl status homelab.elic
        </p>
        <h1 className="mb-4 text-balance text-4xl font-bold tracking-tight md:text-5xl">
          DevOps &amp; Infrastructure
        </h1>
        <p className="mb-12 max-w-2xl text-pretty leading-relaxed text-muted-foreground">
          I run a production-style homelab the way a real ops team runs infrastructure —
          hypervisor, containers, databases, and identity, all self-maintained. This is where
          I turn theory into things that stay up.
        </p>
      </Reveal>

      <Reveal delay={0.05}>
        <div className="mb-14">
          <h2 className="mb-4 font-heading text-sm uppercase tracking-wider text-muted-foreground">
            Deploy pipeline
          </h2>
          <PipelineDiagram />
        </div>
      </Reveal>

      <Reveal delay={0.05}>
        <div className="mb-14">
          <h2 className="mb-4 font-heading text-sm uppercase tracking-wider text-muted-foreground">
            Homelab stack
          </h2>
          <StackDiagram />
        </div>
      </Reveal>

      <Reveal delay={0.05}>
        <div className="mb-14">
          <h2 className="mb-4 font-heading text-sm uppercase tracking-wider text-muted-foreground">
            Infrastructure skills
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {infraSkillGroups.map((group) => (
              <div key={group.category} className="rounded-xl border border-border bg-card p-5">
                <h3 className="mb-3 font-heading text-base font-semibold">{group.category}</h3>
                <ul className="flex flex-col gap-2.5">
                  {group.skills.map((skill) => (
                    <li key={skill.name} className="flex flex-col gap-1">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-sm">{skill.name}</span>
                        <span className="font-mono text-xs text-muted-foreground">
                          &apos;{skill.since.slice(2)}
                        </span>
                      </div>
                      <div
                        className="flex gap-1"
                        role="img"
                        aria-label={`Proficiency ${skill.proficiency} of 5`}
                      >
                        {Array.from({ length: 5 }).map((_, i) => (
                          <span
                            key={i}
                            className="h-1.5 flex-1 rounded-full"
                            style={{
                              background:
                                i < skill.proficiency
                                  ? `var(--${group.accent})`
                                  : 'var(--border)',
                            }}
                          />
                        ))}
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </Reveal>

      <Reveal delay={0.05}>
        <h2 className="mb-4 font-heading text-sm uppercase tracking-wider text-muted-foreground">
          Featured infrastructure work
        </h2>
        <div className="flex flex-col gap-8">
          {infraProjects.map((project, i) => (
            <ProjectDetailCard key={project.slug} project={project} index={i} />
          ))}
        </div>
      </Reveal>
    </main>
  )
}
