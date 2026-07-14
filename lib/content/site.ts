import type { ChangelogEntry, NowItem } from './types'

/** The /now page — update freely, it should always reflect this month. */
export const nowUpdated = 'July 2026'

export const nowItems: NowItem[] = [
  {
    label: 'Working',
    detail:
      'Wrapping up my IT internship at Cimas Health Group — enterprise infrastructure support in a high-compliance health environment.',
  },
  {
    label: 'Building',
    detail:
      'Extending my homelab: Proxmox VE cluster running Nextcloud, Paperless-ngx, and Gitea behind Authentik SSO, with PostgreSQL and Redis underneath.',
  },
  {
    label: 'Learning',
    detail:
      'Going deeper on networking fundamentals and identity management, plus IT governance through HIT ISACA.',
  },
  {
    label: 'Studying',
    detail:
      'Third year of B.Tech Honours in Information Technology at Harare Institute of Technology (graduating August 2027).',
  },
]

/** Running log of career + site milestones. Newest first. */
export const changelog: ChangelogEntry[] = [
  {
    date: '2026-07',
    entry: 'Rebuilt this site as a long-term career platform on a typed content layer.',
  },
  {
    date: '2026-06',
    entry: 'Started the homelab project — Proxmox VE cluster with self-hosted services.',
  },
  {
    date: '2025-08',
    entry: 'Started as IT Intern at Cimas Health Group.',
  },
  {
    date: '2025-05',
    entry: 'Shipped UniConnect, the HIT 200 group project.',
  },
  {
    date: '2025-02',
    entry: 'Launched the first version of this portfolio on GitHub Pages.',
  },
  {
    date: '2023-08',
    entry: 'Began B.Tech Honours in Information Technology at Harare Institute of Technology.',
  },
]
