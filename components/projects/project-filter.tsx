'use client'

import { useState } from 'react'
import type { Project, ProjectCategory } from '@/lib/content/types'
import { ProjectDetailCard } from '@/components/projects/project-detail-card'
import { cn } from '@/lib/utils'

type FilterTab = 'all' | ProjectCategory

const tabs: { id: FilterTab; label: string }[] = [
  { id: 'all', label: 'All Projects' },
  { id: 'devops', label: 'DevOps & IaC' },
  { id: 'security', label: 'Cybersecurity' },
  { id: 'dev', label: 'Full-Stack Software' },
]

export function ProjectFilter({ projects }: { projects: Project[] }) {
  const [activeTab, setActiveTab] = useState<FilterTab>('all')

  const filteredProjects =
    activeTab === 'all'
      ? projects
      : projects.filter((project) => project.category === activeTab)

  return (
    <div className="flex flex-col gap-8">
      {/* Category filter tabs */}
      <div
        className="flex flex-wrap items-center gap-2 rounded-xl border border-border bg-card/60 p-1.5"
        role="tablist"
        aria-label="Filter projects by category"
      >
        {tabs.map((tab) => {
          const count =
            tab.id === 'all'
              ? projects.length
              : projects.filter((p) => p.category === tab.id).length

          return (
            <button
              key={tab.id}
              role="tab"
              aria-selected={activeTab === tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                'flex items-center gap-2 rounded-lg px-4 py-2 font-mono text-xs font-medium transition-all duration-200',
                activeTab === tab.id
                  ? 'bg-accent text-accent-foreground shadow-sm'
                  : 'text-muted-foreground hover:bg-secondary hover:text-foreground',
              )}
            >
              <span>{tab.label}</span>
              <span
                className={cn(
                  'rounded-full px-2 py-0.5 text-[10px]',
                  activeTab === tab.id
                    ? 'bg-accent-foreground/20 text-accent-foreground'
                    : 'bg-secondary text-muted-foreground',
                )}
              >
                {count}
              </span>
            </button>
          )
        })}
      </div>

      {/* Rendered projects */}
      {filteredProjects.length === 0 ? (
        <div className="glass-panel flex flex-col items-center justify-center rounded-2xl p-12 text-center">
          <p className="font-mono text-sm text-muted-foreground">
            No projects found in this category.
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-8">
          {filteredProjects.map((project, i) => (
            <ProjectDetailCard key={project.slug} project={project} index={i} />
          ))}
        </div>
      )}
    </div>
  )
}
