import type { ChangelogEntry, NowItem } from './types'

/** The /now page: updated for August 2026. */
export const nowUpdated = 'August 2026'

export const nowItems: NowItem[] = [
  {
    label: 'Status',
    detail:
      'Completed IT internship at Cimas Health Group; currently completing final year studies towards B.Tech Honours in Information Technology at Harare Institute of Technology.',
  },
  {
    label: 'Building',
    detail:
      'Extending my homelab: Proxmox VE virtualization cluster hosting Nextcloud, Paperless-ngx, and Gitea behind Authentik SSO, with PostgreSQL and Redis.',
  },
  {
    label: 'Learning',
    detail:
      'Deepening knowledge in enterprise networking, Ansible infrastructure automation, and zero-trust identity management.',
  },
  {
    label: 'Studying',
    detail:
      'Completing final B.Tech Honours in Information Technology degree capstone and coursework at Harare Institute of Technology.',
  },
]

/** Running log of career and site milestones. Newest first. */
export const changelog: ChangelogEntry[] = [
  {
    date: '2026-08',
    entry: 'Completed IT Internship at Cimas Health Group and transitioned to final degree completion phase at HIT.',
  },
  {
    date: '2026-07',
    entry: 'Rebuilt portfolio as a long-term engineering platform on a typed data architecture.',
  },
  {
    date: '2026-06',
    entry: 'Deployed multi-node Proxmox VE homelab cluster with containerized self-hosted services.',
  },
  {
    date: '2025-08',
    entry: 'Started IT Internship at Cimas Health Group.',
  },
  {
    date: '2025-05',
    entry: 'Shipped UniConnect student feedback platform for Harare Institute of Technology.',
  },
  {
    date: '2025-02',
    entry: 'Launched initial portfolio and homelab documentation on GitHub.',
  },
  {
    date: '2023-08',
    entry: 'Began B.Tech Honours in Information Technology at Harare Institute of Technology.',
  },
]
