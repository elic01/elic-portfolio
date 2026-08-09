'use client'

import { motion } from 'framer-motion'

interface Layer {
  tier: string
  items: string[]
  accent: string
}

const layers: Layer[] = [
  {
    tier: 'Identity',
    items: ['Authentik SSO / IdP'],
    accent: 'var(--terminal)',
  },
  {
    tier: 'Services',
    items: ['Nextcloud', 'Paperless-ngx', 'Gitea'],
    accent: 'var(--accent)',
  },
  {
    tier: 'Data',
    items: ['PostgreSQL', 'Redis'],
    accent: 'var(--info)',
  },
  {
    tier: 'Runtime',
    items: ['Docker Compose'],
    accent: 'var(--gold)',
  },
  {
    tier: 'Platform',
    items: ['Proxmox VE', 'Linux'],
    accent: 'var(--ember)',
  },
]

export function StackDiagram() {
  return (
    <div className="flex flex-col gap-3">
      {layers.map((layer, i) => (
        <motion.div
          key={layer.tier}
          initial={{ opacity: 0, x: -16 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ delay: i * 0.08, duration: 0.4 }}
          className="flex flex-col gap-3 rounded-xl border border-border bg-card p-4 sm:flex-row sm:items-center"
        >
          <div className="flex w-32 shrink-0 items-center gap-2">
            <span
              className="h-2.5 w-2.5 rounded-full"
              style={{ background: layer.accent }}
              aria-hidden="true"
            />
            <span className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
              {layer.tier}
            </span>
          </div>
          <div className="flex flex-wrap gap-2">
            {layer.items.map((item) => (
              <span
                key={item}
                className="rounded-md border border-border bg-secondary px-3 py-1 font-mono text-sm"
              >
                {item}
              </span>
            ))}
          </div>
        </motion.div>
      ))}
    </div>
  )
}
