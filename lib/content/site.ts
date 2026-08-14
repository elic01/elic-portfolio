import type { ChangelogEntry, NowItem } from './types'

/** The /now page — updated for August 2026. */
export const nowUpdated = 'August 2026'

export const nowItems: NowItem[] = [
  {
    label: 'Status',
    detail:
      'Completed IT internship at Cimas Health Group; currently completing final studies towards B.Tech Honours in Information Technology at Harare Institute of Technology.',
  },
  {
    label: 'Building',
    detail:
      'Extending my homelab: Proxmox VE cluster running Nextcloud, Paperless-ngx, and Gitea behind Authentik SSO, with PostgreSQL and Redis underneath.',
  },
  {
    label: 'Learning',
    detail:
      'Going deeper on networking fundamentals, infrastructure automation with Ansible, and identity management.',
  },
  {
    label: 'Studying',
    detail:
      'Completing final B.Tech Honours in Information Technology degree requirements at Harare Institute of Technology.',
  },
]

/** Running log of career + site milestones. Newest first. */
export const changelog: ChangelogEntry[] = [
  {
    date: '2026-08',
    entry: 'Completed IT Internship at Cimas Health Group & transitioned to final degree completion phase at HIT.',
  },
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
