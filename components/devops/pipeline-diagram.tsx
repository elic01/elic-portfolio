'use client'

import { motion } from 'framer-motion'

const stages = [
  { id: 'commit', label: 'Commit', sub: 'Gitea push', color: 'var(--violet)' },
  { id: 'build', label: 'Build', sub: 'Docker image', color: 'var(--info)' },
  { id: 'test', label: 'Test', sub: 'Lint + typecheck', color: 'var(--gold)' },
  { id: 'deploy', label: 'Deploy', sub: 'Compose up', color: 'var(--ember)' },
  { id: 'run', label: 'Run', sub: 'Proxmox VE', color: 'var(--accent)' },
]

export function PipelineDiagram() {
  return (
    <div
      className="neu-card overflow-x-auto rounded-xl p-6"
      role="img"
      aria-label="CI/CD pipeline: Commit to Build to Test to Deploy to Run"
    >
      <div className="flex min-w-max items-stretch gap-2">
        {stages.map((stage, i) => (
          <div key={stage.id} className="flex items-center gap-2">
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.12, duration: 0.4 }}
              className="flex w-32 flex-col gap-1 rounded-lg border border-border bg-secondary px-4 py-3"
              style={{ borderTopColor: stage.color, borderTopWidth: 3 }}
            >
              <span className="font-mono text-xs text-muted-foreground">
                {String(i + 1).padStart(2, '0')}
              </span>
              <span className="font-heading text-sm font-semibold">{stage.label}</span>
              <span className="text-xs text-muted-foreground">{stage.sub}</span>
            </motion.div>
            {i < stages.length - 1 && (
              <motion.span
                initial={{ opacity: 0, scaleX: 0 }}
                whileInView={{ opacity: 1, scaleX: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.12 + 0.06, duration: 0.3 }}
                className="hidden h-px w-6 origin-left bg-border sm:block"
                aria-hidden="true"
              />
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
